// Copyright (C) 2024  Aaron Satterlee

import assert from "assert";
import { EventEmitter } from "stream";
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, Method } from "axios";
import { ExpiredAccessTokenError, ExpiredAuthorizationCodeError, InvalidAuthorizationCodeError, InvalidRefreshTokenError, SchwabApiError } from "./error-types";
import { queryStringlike } from "./util";
import { DateString, DateStringSimple, DoubleNumber, EContractTypeChar, Int32Number } from "./sharedTypes";
import { TQuoteResponse, EMarkets, EProjectionType, EExpirationMonth, EOptionEntitlement, EOptionType, ERange, EStrategy, EFrequencyQty, EFrequencyType, EPeriodQty, EPeriodType, EIndex, EMoversFrequency, EMoversSort, IMover, TExpirationChain, TOptionChain, IPriceHistory, IMarketMarketHours, ISearchInstrumentResults, ISearchInstrumentResult } from "./schwab-marketdata-types";
import { Account, AccountNumberHash, EOrderStatus, ETransactionType, Order, OrderRequest, PreviewOrder, Transaction, UserPreference } from "./schwab-trading-types";
import { StreamDataSchwab } from "./streamDataSchwab";

export class SchwabClient extends EventEmitter {
    config: SchwabClientConfig;
    authConfig: SchwabOauthData | null;
    marketData: MarketDataRoutes;
    account: AccountRoutes;
    dataStream: StreamDataSchwab;

    private static baseConfig: SchwabClientConfig = {
        SCHWAB_API_APP_KEY: "SET ME",
        SCHWAB_API_APP_SECRET: "SET ME",
        SCHWAB_API_APP_CALLBACK_URL: "SET ME",
        SCHWAB_API_BASE_URL: "https://api.schwabapi.com",
        SCHWAB_API_MARKETDATA_STEM: "/marketdata/v1",
        SCHWAB_API_TRADER_STEM: "/trader/v1",
        SCHWAB_API_OAUTH_AUTHORIZE_STEM: "/v1/oauth/authorize",
        SCHWAB_API_OAUTH_TOKEN_STEM: "/v1/oauth/token",
        getAuthCredentials: undefined,
        emitUpdatedAuthCredentials: true,
    };

    private instance: AxiosInstance;

    constructor(setup: SchwabClientConfigSetup, axiosInstance?: AxiosInstance) {
        super();
        assert.notEqual(setup.SCHWAB_API_APP_KEY, null, "Api App Key is expected");
        assert.notEqual(setup.SCHWAB_API_APP_SECRET, null, "Api Secret is expected");
        assert.notEqual(setup.SCHWAB_API_APP_CALLBACK_URL, null, "Api Secret is expected");
        this.config = { ...SchwabClient.baseConfig, ...setup };
        this.authConfig = null;
        this.marketData = new MarketDataRoutes(this);
        this.account = new AccountRoutes(this);
        this.dataStream = new StreamDataSchwab(this);

        this.instance = axiosInstance ?? axios.create({
            baseURL: this.config.SCHWAB_API_BASE_URL,
            headers: {
                "Accept": "*/*",
                "Accept-Language": "en-US",
                "DNT": 1,
                "Sec-Fetch-Dest": "empty",
                "Sec-Fetch-Mode": "cors",
                "Sec-Fetch-Site": "same-site",
            },
        });
    }

    getCurrentConfig = (): SchwabClientConfig => {
        return { ...this.config };
    }

    getCurrentAuth = async (): Promise<SchwabOauthData> => {
        if (this.config.getAuthCredentials) {
            const creds = await this.config.getAuthCredentials();
            if (creds) return creds;
            else console.warn("No credentials were returned by the supplied getAuthCredentials() function");
        }
        return Promise.resolve({ ...this.authConfig! });
    }

    /**
     * Use this to start the Oauth process. The end user should use this url in their browser to access a Schwab login page to authorize the app.
     * The url format is: https://api.schwabapi.com/v1/oauth/authorize?client_id={CONSUMER _KEY}&redirect_uri={APP_CALLBACK_URL}
     * A token will then be sent to the callback url specified in config.
     * The request to your callback url looks like: https://{SCHWAB_API_APP_CALLBACK_URL}/?code={AUTHORIZATION_CODE_GENERATED}&session={SESSION_ID}
     */
    getAuthorizationUrl = (): string => {
        return `${this.config.SCHWAB_API_BASE_URL}${this.config.SCHWAB_API_OAUTH_AUTHORIZE_STEM}?client_id=${this.config.SCHWAB_API_APP_KEY}&redirect_uri=${this.config.SCHWAB_API_APP_CALLBACK_URL}`;
    }

    setUserAuthResult(authResult?: SchwabOauthData) {
        console.log("setUserAuthResult", authResult);
        if (!authResult) {
            console.warn("no auth data provided in setUserAuthResult");
            return;
        }
        this.authConfig = { ...this.authConfig, ...authResult };
    }

    static getDefaultConfig = () => {
        return { ...SchwabClient.baseConfig };
    }

    private performAxiosRequest = async <T>(requestConfig: AxiosRequestConfig, expectData: boolean): Promise<T | IWriteResponse<T>> => {
        try {
            const response: AxiosResponse<T> = await this.instance.request<T>(requestConfig);
            // console.log("performAxiosRequest response", response);
            if (expectData) {
                return response.data;
            } else {
                return {
                    data: response.data,
                    statusCode: response.status,
                    location: response.headers.location || response.headers["content-location"],
                };
            }
        } catch(error: any) {
            console.error("performAxiosRequest error caught", error?.response?.status || "unknown error status");
            // TODO: Catch auth expired errors, such as expired access_token, expired refresh_token
            // 'ERROR [400] [post /v1/oauth/token]: {"error":"unsupported_token_type","error_description":"400 Bad Request: \\"{\\"error_description\\":\\"Bad authorization code: Invalid authorization code header: yo   \\",\\"error\\":\\"invalid_request\\"}\\""}'
            // 400, data.error = "invalid_client", data.error_description = "refresh_token_invalid" during refresh of access
            // 'ERROR [400] [post /v1/oauth/token]: {"error":"unsupported_token_type","error_description":"400 Bad Request: \\"{\\"error_description\\":\\"Bad authorization code: AuthorizationCode has expired,expiration=1728437138768,now=1728437166999 \\",\\"error\\":\\"invalid_request\\"}\\""}'
            if (error.response) {
                // expired access_token
                if (error.response.status === 401) {
                    console.warn("401 caught, -> ExpiredAccessTokenError");
                    throw new ExpiredAccessTokenError(error.response.status, error.response.data.error, error.response.data.error_description);
                }
                // expired authorization code
                if (error.response.data.error === "unsupported_token_type" && String(error.response.data.error_description).includes("AuthorizationCode has expired")) {
                    console.warn("400 caught, -> ExpiredAuthorizationCodeError");
                    throw new ExpiredAuthorizationCodeError(error.response.status, error.response.data.error, error.response.data.error_description);
                }
                // invalid authorization code
                if (error.response.data.error === "unsupported_token_type" && String(error.response.data.error_description).includes("Invalid authorization code")) {
                    console.warn("400 caught, -> InvalidAuthorizationCodeError");
                    throw new InvalidAuthorizationCodeError(error.response.status, error.response.data.error, error.response.data.error_description);
                }
                // expired refresh token
                if (error.response.data.error === "invalid_client" && String(error.response.data.error_description).includes("refresh_token_invalid")) {
                    console.warn("400 caught, -> InvalidRefreshTokenError");
                    throw new InvalidRefreshTokenError(error.response.status, error.response.data.error, error.response.data.error_description);
                }

                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                throw new SchwabApiError(error.response.status, JSON.stringify(error.response.data), `ERROR [${error.response.status}] [${requestConfig.method} ${requestConfig.url}]: ${JSON.stringify(error.response.data)}`)
                // throw new Error(`ERROR [${error.response.status}] [${requestConfig.method} ${requestConfig.url}]: ${JSON.stringify(error.response.data)}`);
            } else if (error.request) {
                // The request was made but no response was received
                // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                // http.ClientRequest in node.js
                throw new Error(`The request was made but no response was received: ${JSON.stringify(error.request)}`);
            } else {
                // Something happened in setting up the request that triggered an Error
                throw new Error(`An error occurred while setting up the request: ${JSON.stringify(error.message)}`);
            }
        }
    }

    /**
     * Use this for sending an HTTP GET request to api.tdameritrade.com
     * Default behavior is that an expired access_token will throw an error.
     * Optionally, it can get refreshed but then won't be emitted.
     * 
     * @throws {ExpiredAccessTokenError} If access_token has expired (30 mins); can be handled with optional input
     * @throws {InvalidRefreshTokenError} If access_token is optionally refreshed but fails due to expired refresh token (7 days)
     */
    apiGet = async <T>(config: SchwabRequestConfig): Promise<T> => {
        try {
            return await this.apiNoWriteResource<T>(config, "get");
        } catch (err) {
            console.warn("apiGet error caught attemptAccessRefresh", config.attemptAccessRefresh, "refresh token", config.authConfig?.refresh_token);
            if (ExpiredAccessTokenError.isExpiredAccessTokenError(err)) {
                if (config.attemptAccessRefresh !== false
                    && (config.authConfig?.refresh_token
                        || (!config.authConfig?.access_token && this.authConfig?.refresh_token)
                    )
                ) {
                    if (config.authConfig?.refresh_token) {
                        await this.oauthRefreshAccessToken(config);
                        return await this.apiGet({ ...config, attemptAccessRefresh: false });
                    } else {
                        const useThisConfig: SchwabRequestConfig = { ...config, authConfig: { ...this.authConfig! }, attemptAccessRefresh: false };
                        await this.oauthRefreshAccessToken(useThisConfig);
                        return await this.apiGet(useThisConfig);
                    }
                }
                else throw ExpiredAccessTokenError.asExpiredAccessTokenError(err);
            }
            else throw err;
        }
    }

    /**
     * Use this for sending an HTTP DELETE request to api.tdameritrade.com
     * Default behavior is that an expired access_token will throw an error.
     * Optionally, it can get refreshed but then won't be emitted.
     * 
     * @throws {ExpiredAccessTokenError} If access_token has expired (30 mins); can be handled with optional input
     * @throws {InvalidRefreshTokenError} If access_token is optionally refreshed but fails due to expired refresh token (7 days)
     */
    apiDelete = async <T>(config: SchwabRequestConfig): Promise<T> => {
        try {
            return await this.apiNoWriteResource<T>(config, "delete");
        } catch (err) {
            if (ExpiredAccessTokenError.isExpiredAccessTokenError(err)) {
                if (config.attemptAccessRefresh !== false && config.authConfig?.refresh_token) {
                    await this.oauthRefreshAccessToken(config);
                    return await this.apiDelete({ ...config, attemptAccessRefresh: false });
                }
                else throw ExpiredAccessTokenError.asExpiredAccessTokenError(err);
            }
            else throw err;
        }
    }

    /**
     * Use this for sending an HTTP PATCH request to api.tdameritrade.com
     * Default behavior is that an expired access_token will throw an error.
     * Optionally, it can get refreshed but then won't be emitted.
     * 
     * @throws {ExpiredAccessTokenError} If access_token has expired (30 mins); can be handled with optional input
     * @throws {InvalidRefreshTokenError} If access_token is optionally refreshed but fails due to expired refresh token (7 days)
     */
    apiPatch = async <T>(config: SchwabRequestConfig): Promise<IWriteResponse<T>> => {
        try {
            return await this.apiWriteResource<T>(config, "patch");
        } catch (err) {
            if (ExpiredAccessTokenError.isExpiredAccessTokenError(err)) {
                if (config.attemptAccessRefresh !== false && config.authConfig?.refresh_token) {
                    await this.oauthRefreshAccessToken(config);
                    return await this.apiPatch({ ...config, attemptAccessRefresh: false });
                }
                else throw ExpiredAccessTokenError.asExpiredAccessTokenError(err);
            }
            else throw err;
        }
    }

    /**
     * Use this for sending an HTTP PUT request to api.tdameritrade.com
     * Default behavior is that an expired access_token will throw an error.
     * Optionally, it can get refreshed but then won't be emitted.
     * 
     * @throws {ExpiredAccessTokenError} If access_token has expired (30 mins); can be handled with optional input
     * @throws {InvalidRefreshTokenError} If access_token is optionally refreshed but fails due to expired refresh token (7 days)
     */
    apiPut = async <T>(config: SchwabRequestConfig): Promise<IWriteResponse<T>> => {
        try {
            return await this.apiWriteResource<T>(config, "put");
        } catch (err) {
            if (ExpiredAccessTokenError.isExpiredAccessTokenError(err)) {
                if (config.attemptAccessRefresh !== false && config.authConfig?.refresh_token) {
                    await this.oauthRefreshAccessToken(config);
                    return await this.apiPut({ ...config, attemptAccessRefresh: false });
                }
                else throw ExpiredAccessTokenError.asExpiredAccessTokenError(err);
            }
            else throw err;
        }
    }

    /**
     * Use this for sending an HTTP POST request to api.tdameritrade.com
     * Default behavior is that an expired access_token will throw an error.
     * Optionally, it can get refreshed but then won't be emitted.
     * 
     * @throws {ExpiredAccessTokenError} If access_token has expired (30 mins); can be handled with optional input
     * @throws {InvalidRefreshTokenError} If access_token is optionally refreshed but fails due to expired refresh token (7 days)
     */
    apiPost = async <T>(config: SchwabRequestConfig): Promise<IWriteResponse<T>> => {
        try {
            return await this.apiWriteResource<T>(config, "post");
        } catch (err) {
            if (ExpiredAccessTokenError.isExpiredAccessTokenError(err)) {
                if (config.attemptAccessRefresh !== false && config.authConfig?.refresh_token) {
                    await this.oauthRefreshAccessToken(config);
                    return await this.apiPost({ ...config, attemptAccessRefresh: false });
                }
                else throw ExpiredAccessTokenError.asExpiredAccessTokenError(err);
            }
            else throw err;
        }
    }

    private resolveAccessToken = (authConf?: SchwabOauthData): string => {
        if (authConf?.access_token) {
            // Does stored config have an access token and refresh token
            if (this.authConfig?.access_token && this.authConfig?.refresh_token
                // provided auth conf has a refresh_token to compare?
                && authConf.refresh_token
                // access tokens equal or stored token is newer
                && (authConf.refresh_token === this.authConfig.refresh_token
                    || (authConf.refresh_expires_on && this.authConfig.refresh_expires_on
                        && authConf.refresh_expires_on < this.authConfig.refresh_expires_on
                    )
                )
                // stored config has an access expiration date
                && this.authConfig.access_expires_on
                // stored access token expires in the future
                && this.authConfig.access_expires_on > Date.now()
                // provided auth config has a comparable date
                && authConf.access_expires_on
                // stored access token expiry is later
                && authConf.access_expires_on < this.authConfig.access_expires_on
            ) {
                return this.authConfig.access_token;
            } else return authConf.access_token;
        } else if (this.authConfig?.access_token) return this.authConfig.access_token;
        else throw new Error("no access_token provided");
    }

    private apiNoWriteResource = async <T>(config: SchwabRequestConfig, method: Method): Promise<T> => {
        // if (!config.queueSettings || config.queueSettings.enqueue) {
        //     return new Promise((res, rej) => queue.qPush({ id: crypto.randomBytes(16).toString("hex"), config, method, res, rej, deleted: false }));
        // }
        const useThisAccessToken = this.resolveAccessToken(config.authConfig);
        console.log({
            fn: "apiNoWriteResource",
            "config.authConfig": config.authConfig,
            "this.authConfig": this.authConfig,
            "useThisAccessToken": useThisAccessToken,
            url: config.path,
            method,
        });
        const requestConfig: AxiosRequestConfig = {
            method,
            url: config.path ?? "",
            headers: {
                "Authorization": `Bearer ${useThisAccessToken}`,
            },
        };

        const result = await this.performAxiosRequest<T>(requestConfig, true);
        return result as T;
    }

    private apiWriteResource = async <T>(config: SchwabRequestConfig, method: Method): Promise<IWriteResponse<T>> => {
        // if (!config.queueSettings || config.queueSettings.enqueue) {
        //     return new Promise((res, rej) => queue.qPush({ id: crypto.randomBytes(16).toString("hex"), config, method, res, rej, deleted: false }));
        // }
        const useThisAccessToken = this.resolveAccessToken(config.authConfig);
        console.log({
            fn: "apiWriteResource",
            "config.authConfig": config.authConfig,
            "this.authConfig": this.authConfig,
            "useThisAccessToken": useThisAccessToken,
            url: config.path,
            method,
        });
        const requestConfig = {
            method,
            url: config.path,
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${useThisAccessToken}`,
            },
            data: config.bodyJSON,
        };
    
        const result = await this.performAxiosRequest<T>(requestConfig, false);
        return result as IWriteResponse<T>;
    }

    private doAuthRequest = async (data?: any): Promise<SchwabOauthResponse> => {
        const requestConfig: AxiosRequestConfig = {
            method: "post",
            url: this.config.SCHWAB_API_OAUTH_TOKEN_STEM,
            data,
            auth: {
                username: this.config.SCHWAB_API_APP_KEY,
                password: this.config.SCHWAB_API_APP_SECRET
            },
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        };
        const result = await this.performAxiosRequest<SchwabOauthResponse>(requestConfig, true);
        console.log("doAuthRequest result", result);
        return result as SchwabOauthResponse;
    }

    /**
     * Use this to get a new refresh_token from a code obtained from trading credentials authorization.
     * This will generate a new refresh-token, valid for 60 days, that is used to generate an access_token as needed.
     * See authREADME.md for further explanation. This would be equivalent to steps 7-9.
     * Required config fields are: code, client_id, redirect_uri
     * 
     * @throws {InvalidAuthorizationCodeError} Are you sure this is a properly formatted code?
     * @throws {ExpiredAuthorizationCodeError} There was too much delay; run the auth login flow again.
     */
    oauthAuthUserWithCode = async (authorizationCode: string, config: any = {}): Promise<SchwabOauthData> => {
        if (config?.verbose) {
            console.log("refreshing authorization");
        }

        assert.notEqual(authorizationCode, null, "authorizationCode was not provided");

        try {
            const oauthResponse = await this.doAuthRequest({
                "grant_type": "authorization_code",
                "code": authorizationCode,
                "redirect_uri": this.config.SCHWAB_API_APP_CALLBACK_URL,
            });
            const now = Date.now();
            const toReturn: SchwabOauthData = {
                ...oauthResponse,
                access_expires_on: now + (1000 * oauthResponse.expires_in), // now plus expires_in, presumably 30 minutes
                access_expires_iso: new Date(now + (1000 * oauthResponse.expires_in)).toISOString(),
                refresh_expires_on: now + (7 * 24 * 60 * 60000), // now + 7 days
                refresh_expires_iso: new Date(now + (7 * 24 * 60 * 60000)).toISOString(),
                updated_on: now,
                updated_at_iso: new Date(now).toISOString(),
            };
            this.setUserAuthResult(toReturn);
            this.emit("NEW_REFRESH_TOKEN", toReturn);
            return toReturn;
        } catch (err) {
            if (InvalidAuthorizationCodeError.isInvalidAuthorizationCodeError(err)) {
                throw InvalidAuthorizationCodeError.asInvalidAuthorizationCodeError(err);
            }
            if (ExpiredAuthorizationCodeError.isExpiredAuthorizationCodeError(err)) {
                throw ExpiredAuthorizationCodeError.asExpiredAuthorizationCodeError(err);
            }
            throw err;
        }
    }

    /**
     * Use this to force the refresh of the access_token, regardless of whether it is expired.
     * Returns auth info object with the all-important access_token.
     * This is optionally written to the auth json file.
     * 
     * @throws {InvalidRefreshTokenError} The token is expired or otherwise invalid.
     */
    oauthRefreshAccessToken = async (config?: SchwabBaseConfig): Promise<SchwabOauthData> => {
        if (config?.verbose) {
            console.log("refreshing authentication");
        }
        const authConfig = config?.authConfig ?? await this.getCurrentAuth();
        if (!authConfig) {
            throw new Error("AuthConfig was not provided and there was nothing stored internally");
        } else if (!authConfig.refresh_token) {
            throw new Error("AuthConfig does not contain a refresh_token");
        }

        try {
            const oauthResponse = await this.doAuthRequest({
                "grant_type": "refresh_token",
                "refresh_token": authConfig.refresh_token,
            });
            const now = Date.now();
            const toReturn: SchwabOauthData = {
                ...oauthResponse,
                access_expires_on: now + (1000 * oauthResponse.expires_in), // now plus expires_in, presumably 30 minutes
                access_expires_iso: new Date(now + (1000 * oauthResponse.expires_in)).toISOString(),
                updated_on: now,
                updated_at_iso: new Date(now).toISOString(),
            };
            this.setUserAuthResult(toReturn);
            this.emit("NEW_ACCESS_TOKEN", toReturn);
            return toReturn;
        } catch (err) {
            if (InvalidRefreshTokenError.isInvalidRefreshTokenError(err)) {
                throw InvalidRefreshTokenError.asInvalidRefreshTokenError(err);
            }
            throw err;
        }
    }
}

class MarketDataRoutes {
    private client: SchwabClient;

    constructor(client: SchwabClient) {
        this.client = client;
    }

    /**
     * Get quotes for one or more symbols. Input property "symbol" should be a comma-separated string of symbols, cusips, or ssids.
     * e.g. "F,O,TSLA,SPY,AAAHX,/ES,/ESZ24,EUR/USD,$SPX,AMZN  241220C00185000,CMG   241220C03300000,DJX   241220C00390000"
     * Equities/ETFs/Mutual Funds: Just use the symbol: AMZN, MRAD, SPY, AAAHX
     * Indexes: The correct format is $SPX, not SPX or $SPX.X (with .X being the TD Ameritrade way)
     * Futures: Note that you can use the continuous symbol /ES and it will give you the front-month contract, or you can specify a specific contract like /ESZ24
     * Forex: Use the regular currency pair syntax, e.g. USD/JPY
     * Stock/Index Options: Format is 21 characters: 6 characters for symbol (padded with empty space), YYMMDD C/P 5 digits for dollars, 3 digits for cents, e.g. "F     240712C00011500" for the Ford $11.50 Call for July 12, 2024 expiry.
     * Futures Options: TBD
     * Bonds / Treasuries: Don't appear to be supported (attempted CUSIP lookup)
     */
    getQuotes = async (config: IGetQuotesConfig): Promise<TQuoteResponse> => {
        config.path = `${this.client.getCurrentConfig().SCHWAB_API_MARKETDATA_STEM}/quotes?symbols=${queryStringlike(config.symbols)}`;
        const queryParams = [];
        if (config.fields) queryParams.push(`fields=${queryStringlike(config.fields)}`);
        if (config.indicative != null) queryParams.push(`indicative=${config.indicative ? "true" : "false"}`);
        config.path += queryParams.length ? ("&" + queryParams.join("&")) : "";

        return await this.client.apiGet<TQuoteResponse>(config);
    }

    /**
     * Get quotes for a single symbol, e.g. AAPL, AMZN  241220C00185000
     * For symbols containing special characters, use getQuotes instead,
     * e.g. futures (/ES), forex (EUR/USD), indexes ($SPX.X)
     * Equities/ETFs/Mutual Funds: Just use the symbol: AMZN, MRAD, SPY, AAAHX
     * Indexes: The correct format is $SPX, not SPX or $SPX.X (with .X being the TD Ameritrade way)
     * Stock/Index Options: Format is 21 characters: 6 characters for symbol (padded with empty space), YYMMDD C/P 5 digits for dollars, 3 digits for cents, e.g. "F     240712C00011500" for the Ford $11.50 Call for July 12, 2024 expiry.
     * Futures Options: TBD
     */
    getSymbolQuote = async (config: IGetSymbolQuoteConfig): Promise<TQuoteResponse> => {
        config.path = `${this.client.getCurrentConfig().SCHWAB_API_MARKETDATA_STEM}/${config.symbol}/quotes`
            + (config.fields ? `?fields=${queryStringlike(config.fields)}` : "")
        return await this.client.apiGet(config);
    }

    /**
     * Get an options chain for a given optionable symbol. Carefully use config options.
     * The return type is nested, looking like, e.g.:
     * TOptionChain { putExpDateMap: { dateDTEString: { strike: IOption }}}
     * e.g. IOptionChain { putExpDateMap: { "2021-12-10:2": { "45.0": IOption }}}
     * Note the date param is of the format: "YYYY-MM-DD:DTE"
     */
    getOptionChain = async (config: IGetOptionChainConfig): Promise<TOptionChain> => {
        config.path =  `${this.client.getCurrentConfig().SCHWAB_API_MARKETDATA_STEM}/chains?` +
            `symbol=${config.symbol}` +
            (config.contractType ? `&contractType=${encodeURIComponent(config.contractType)}` : "") +
            (config.strikeCount ? `&strikeCount=${encodeURIComponent(config.strikeCount)}` : "") +
            (config.includeUnderlyingQuote ? `&includeUnderlyingQuote=${encodeURIComponent(config.includeUnderlyingQuote)}` : "") +
            (config.strategy ? `&strategy=${encodeURIComponent(config.strategy)}` : "") +
            (config.interval ? `&interval=${encodeURIComponent(config.interval)}` : "") +
            (config.strike ? `&strike=${encodeURIComponent(config.strike)}` : "") +
            (config.range ? `&range=${encodeURIComponent(config.range)}` : "") +
            (config.fromDate ? `&fromDate=${encodeURIComponent(config.fromDate)}` : "") +
            (config.toDate ? `&toDate=${encodeURIComponent(config.toDate)}` : "") +
            (config.volatility ? `&volatility=${encodeURIComponent(config.volatility)}` : "") +
            (config.underlyingPrice ? `&underlyingPrice=${encodeURIComponent(config.underlyingPrice)}` : "") +
            (config.interestRate ? `&interestRate=${encodeURIComponent(config.interestRate)}` : "") +
            (config.daysToExpiration ? `&daysToExpiration=${encodeURIComponent(config.daysToExpiration)}` : "") +
            (config.expMonth ? `&expMonth=${encodeURIComponent(config.expMonth)}` : "") +
            (config.optionType ? `&optionType=${encodeURIComponent(config.optionType)}` : "") +
            (config.entitlement ? `&apikey=${encodeURIComponent(config.entitlement)}` : "");
        return await this.client.apiGet(config);
    }

    getOptionExpirationChain = async (config: IGetOptionExpirationChainConfig): Promise<TExpirationChain> => {
        config.path = `${this.client.getCurrentConfig().SCHWAB_API_MARKETDATA_STEM}/expirationchain?symbol=${encodeURIComponent(config.symbol)}`;
        return await this.client.apiGet(config);
    }

    /**
     * Get price history info in the form of {@link ICandle} candle data for a particular symbol.
     * Provide either startDate and endDate OR period in {@link IGetPriceHistoryConfig} input.
     * Can optionally use apikey for delayed data with an unauthenticated request.
     * See also {@link IGetPriceHistoryConfig} for details on input.
     * 
     * indexes are supported
     * futures?
     * options?
     * forex?
     * bonds?
     */
    getPriceHistory = async (config: IGetPriceHistoryConfig): Promise<IPriceHistory> => {
        config.path = `${this.client.getCurrentConfig().SCHWAB_API_MARKETDATA_STEM}/pricehistory?` +
            `symbol=${config.symbol}` +
            `&periodType=${config.periodType}` +
            (config.period ? `&period=${config.period}` : "") +
            (config.frequencyType ? `&frequencyType=${config.frequencyType}` : "") +
            (config.frequency ? `&frequency=${config.frequency}` : "") +
            (config.startDate ? `&startDate=${config.startDate}` : "") +
            (config.endDate ? `&endDate=${config.endDate}` : "") +
            (config.needExtendedHoursData != null ? `&needExtendedHoursData=${config.needExtendedHoursData ? "true" : "false"}` : "") +
            (config.needPreviousClose != null ? `&needPreviousClose=${config.needPreviousClose ? "true" : "false"}` : "");

        return await this.client.apiGet(config);
    }

    /**
     * Get market movers for a specified major index, Nasdaq Composite, Dow, S&P (use enum EIndex)
     * a given direction, up or down (use enum EDirection), and the type of change, value or percent (use enum EChange)
     * Can optionally use apikey for delayed data with an unauthenticated request.
     */
    getMovers = async (config: IGetMoversConfig): Promise<IMover[]> => {
        config.path = `${this.client.getCurrentConfig().SCHWAB_API_MARKETDATA_STEM}/movers/${encodeURIComponent(config.symbolId)}`;
        const query = [];
        if (config.sort) query.push(`sort=${encodeURIComponent(config.sort)}`);
        if (config.frequency) query.push(`frequency=${encodeURIComponent(config.frequency)}`);
        config.path += query.length ? ("?" + query.join("&")) : "";
        return await this.client.apiGet(config);
    }

    /**
     * Get market open hours for a specified date in ISO-8601 (yyyy-MM-dd and yyyy-MM-dd'T'HH:mm:ssz)
     * (e.g. 2020-09-18) and a specified market (use enum EMarkets).
     * Can optionally use apikey for delayed data with an unauthenticated request.
     */
    getMarketHoursSingle = async (config: IGetMarketHoursSingleConfig): Promise<IMarketMarketHours> => {
        config.path = `${this.client.getCurrentConfig().SCHWAB_API_MARKETDATA_STEM}/markets/${config.market}`;
        if (config.date) config.path += `?date=${config.date}`;
        return await this.client.apiGet(config);
    }

    /**
     * Get market open hours for a specified date (e.g. 2020-09-18) and a set of markets.
     * Markets can be an array of EMarkets (enum), an array of strings, or a string with comma-separated values
     * e.g. [EMarkets.EQUITY, EMarkets.OPTION] or ["EQUITY","OPTION"] or "EQUITY,OPTION".
     * Can optionally use apikey for delayed data with an unauthenticated request.
     */
    getMarketHoursMulti = async (config: IGetMarketHoursMultiConfig): Promise<IMarketMarketHours> => {
        const markets = Array.isArray(config.markets)
            ? config.markets.map(m => `markets=${m.trim()}`).join("&")
            : config.markets.split(",").map(m => `markets=${m.trim()}`).join("&");
        config.path = `${this.client.getCurrentConfig().SCHWAB_API_MARKETDATA_STEM}/markets?${markets}`;
        if (config.date) config.path += `&date=${config.date}`;

        return await this.client.apiGet(config);
    }

    /**
     * Search for an instrument using search string or regex (config.symbol) and search type (config.projection)
     * Projection (you may use enum EProjectionType) is one of: symbol-search, symbol-regex, desc-search, desc-regex, fundamental.
     * Can optionally use apikey for delayed data with an unauthenticated request.
     */
    getInstruments = async (config: IGetInstrumentsConfig): Promise<ISearchInstrumentResults> => {
        config.path = `${this.client.getCurrentConfig().SCHWAB_API_MARKETDATA_STEM}/instruments`
            + `?symbol=${config.symbol}`
            + `&projection=${config.projection}`;
        return await this.client.apiGet(config);
    }

    /**
     * Get an instrument by CUSIP (unique id number assigned to all stocks and registered bonds in US/CA).
     * List of instruments here: https://www.sec.gov/divisions/investment/13flists.htm
     * Can optionally use apikey for delayed data with an unauthenticated request.
     */
    getInstrument = async (config: IGetInstrumentConfig): Promise<ISearchInstrumentResult[]> => {
        config.path = `${this.client.getCurrentConfig().SCHWAB_API_MARKETDATA_STEM}/instruments/${config.cusip}`;
        return await this.client.apiGet(config);
    }
}

class AccountRoutes {
    private client: SchwabClient;

    constructor(client: SchwabClient) {
        this.client = client;
    }

    getAccountNumbers = async (config?: SchwabRequestConfig): Promise<AccountNumberHash[]> => {
        const localConfig = config ?? {};
        localConfig.path = `${this.client.getCurrentConfig().SCHWAB_API_TRADER_STEM}/accounts/accountNumbers`;
        return await this.client.apiGet(localConfig);
    }

    getAccounts = async (config?: IGetAccountsConfig): Promise<Account[]> => {
        const localConfig = config ?? {};
        localConfig.path = `${this.client.getCurrentConfig().SCHWAB_API_TRADER_STEM}/accounts`;
        if (localConfig.fields?.length) localConfig.path += `fields=${localConfig.fields.join(",")}"`;
        return await this.client.apiGet(localConfig);
    }

    getAccount = async (config: IGetAccountConfig): Promise<Account> => {
        config.path = `${this.client.getCurrentConfig().SCHWAB_API_TRADER_STEM}/accounts/${config.accountNumber}`;
        if (config.fields?.length) config.path += `fields=${config.fields.join(",")}"`;
        return await this.client.apiGet(config);
    }

    getAllOrders = async (config: IGetAllOrdersConfig): Promise<Order[]> => {
        config.path = `${this.client.getCurrentConfig().SCHWAB_API_TRADER_STEM}/orders`
            + `?fromEnteredTime=${encodeURIComponent(config.fromEnteredTime)}`
            + `&toEnteredTime=${encodeURIComponent(config.toEnteredTime)}`
            + (config.maxResults ? `&maxResults=${config.maxResults}` : "")
            + (config.status ? `status=${config.status}`: "");
        return await this.client.apiGet(config);
    }

    getAllOrdersByAccount = async (config: IGetAllOrdersByAccountConfig): Promise<Order[]> => {
        config.path = `${this.client.getCurrentConfig().SCHWAB_API_TRADER_STEM}/accounts/${encodeURIComponent(config.accountNumber)}/orders`
            + `?fromEnteredTime=${encodeURIComponent(config.fromEnteredTime)}`
            + `&toEnteredTime=${encodeURIComponent(config.toEnteredTime)}`
            + (config.maxResults ? `&maxResults=${config.maxResults}` : "")
            + (config.status ? `status=${config.status}`: "");
        return await this.client.apiGet(config);
    }

    getOrderByIdAndAccount = async (config: IGetOrderByIdAndAccountConfig): Promise<Order> => {
        config.path = `${this.client.getCurrentConfig().SCHWAB_API_TRADER_STEM}/accounts/${encodeURIComponent(config.accountNumber)}/orders/${encodeURIComponent(config.orderId)}`;
        return await this.client.apiGet(config);
    }

    deleteOrderByIdAndAccount = async (config: IGetOrderByIdAndAccountConfig): Promise<void> => {
        config.path = `${this.client.getCurrentConfig().SCHWAB_API_TRADER_STEM}/accounts/${encodeURIComponent(config.accountNumber)}/orders/${encodeURIComponent(config.orderId)}`;
        return await this.client.apiDelete(config);
    }

    /** A named alias for putOrderByAccount */
    replaceOrderByAccount = async (config: IPutOrderByAccountConfig): Promise<IWriteResponse<any>> => {
        return await this.putOrderByAccount(config);
    }
    putOrderByAccount = async (config: IPutOrderByAccountConfig): Promise<IWriteResponse<any>> => {
        config.path = `${this.client.getCurrentConfig().SCHWAB_API_TRADER_STEM}/accounts/${encodeURIComponent(config.accountNumber)}/orders/${encodeURIComponent(config.orderId)}`;
        return await this.client.apiPut(config);
    }

    postOrderByAccount = async (config: IPostOrderByAccountConfig): Promise<IWriteResponse<any>> => {
        config.path = `${this.client.getCurrentConfig().SCHWAB_API_TRADER_STEM}/accounts/${encodeURIComponent(config.accountNumber)}/orders`;
        return await this.client.apiPost(config);
    }

    postPreviewOrderByAccount = async (config: IPostPreviewOrderByAccountConfig): Promise<IWriteResponse<any>> => {
        config.path = `${this.client.getCurrentConfig().SCHWAB_API_TRADER_STEM}/accounts/${encodeURIComponent(config.accountNumber)}/previewOrder`;
        return await this.client.apiPost(config);
    }

    getTransactionsByAccount = async (config: IGetTransactionsByAccountConfig): Promise<Transaction[]> => {
        config.path = `${this.client.getCurrentConfig().SCHWAB_API_TRADER_STEM}/accounts/${encodeURIComponent(config.accountNumber)}/transactions`
            + `?startDate=${encodeURIComponent(config.startDate)}`
            + `&endDate=${encodeURIComponent(config.endDate)}`
            + `&types=${encodeURIComponent(config.types)}`
            + (config.symbol ? `&symbol=${encodeURIComponent(config.symbol)}` : "");
        return await this.client.apiGet(config);
    }

    getTransactionByIdAndAccount = async (config: IGetTransactionByIdAndAccountConfig): Promise<Transaction[]> => {
        config.path = `${this.client.getCurrentConfig().SCHWAB_API_TRADER_STEM}/accounts/${encodeURIComponent(config.accountNumber)}/transactions/${encodeURIComponent(config.transactionId)}`;
        return await this.client.apiGet(config);
    }

    /**
     * Get streamer subscription keys for given accountIds as a comma-separated list: 123,345
     */
    getStreamerSubKeys = async (config?: SchwabRequestConfig): Promise<UserPreference> => {
        const localConfig = config ?? {};
        localConfig.path = `${this.client.getCurrentConfig().SCHWAB_API_TRADER_STEM}/userPreference`;

        return await this.client.apiGet(localConfig);
    }
}

export interface IGetTransactionsByAccountConfig extends SchwabRequestConfig {
    accountNumber: string | number,
    startDate: DateString,
    endDate: DateString,
    types: ETransactionType,
    symbol?: string,
}

export interface IGetTransactionByIdAndAccountConfig extends SchwabRequestConfig {
    accountNumber: string | number,
    transactionId: string | number,
}

export interface IGetAccountsConfig extends SchwabRequestConfig {
    fields?: string[],
}

export interface IGetAccountConfig extends SchwabRequestConfig {
    accountNumber: string | number,
    fields?: string[],
}

export interface IGetAllOrdersConfig extends SchwabRequestConfig {
    fromEnteredTime: DateString,
    toEnteredTime: DateString,
    /** Max number of orders to retrieve. Default is 3000. */
    maxResults?: number,
    status?: EOrderStatus,
}

export interface IGetAllOrdersByAccountConfig extends IGetAllOrdersConfig {
    accountNumber: string | number,
}

export interface IPostOrderByAccountConfig extends SchwabRequestConfig {
    accountNumber: string | number,
    bodyJSON: OrderRequest | any,
}

export interface IPostPreviewOrderByAccountConfig extends SchwabRequestConfig {
    accountNumber: string | number,
    bodyJSON: PreviewOrder | any,
}

export interface IGetOrderByIdAndAccountConfig extends SchwabRequestConfig {
    accountNumber: string | number,
    orderId: string | number,
}

export interface IPutOrderByAccountConfig extends IGetOrderByIdAndAccountConfig {
    bodyJSON: OrderRequest | any,
}

export type IDeleteOrderByIdAndAccountConfig = IGetOrderByIdAndAccountConfig;
export interface SchwabOauthData extends SchwabOauthResponse {
    access_expires_on?: number;
    access_expires_iso?: string;
    refresh_expires_on?: number;
    refresh_expires_iso?: string;
    updated_on?: number;
    updated_at_iso?: string;
}

export interface SchwabOauthResponse {
    expires_in: number; //Number of seconds access_token is valid for 
    token_type: "Bearer";
    scope: "api";
    refresh_token: string; // "{REFRESH_TOKEN_HERE}", //Valid for 7 days
    access_token: string; // "{NEW_ACCESS_TOKEN_HERE}", //Valid for 30 minutes 
    id_token: string; // JWT_HERE
}

export interface SchwabRequestConfig extends SchwabBaseConfig {
    path?: string;
    bodyJSON?: any;
    /**
     * If a 401 api error is returned, then this will try to get a new access_token, if a refresh_token is supplied
     * though it will not be emitted. If you are storing the access_token yourself, don't use this.
     * DEFAULT IS TRUE
     */
    attemptAccessRefresh?: boolean;
}
/**
 * Default authFileLocation is evaluated by:
 *  path.join(process.cwd(), `/config/tdaclientauth.json`);
 * Default fileAccess is READ_WRITE
 */
export interface SchwabBaseConfig {
    authConfig?: SchwabOauthData;
    verbose?: boolean;
}

export type IWriteResponse<T> = {
    data: T;
    statusCode: number;
    location: string;
};

export interface SchwabClientConfig extends SchwabClientConfigSetup {
    SCHWAB_API_BASE_URL: string;
    SCHWAB_API_MARKETDATA_STEM: string;
    SCHWAB_API_TRADER_STEM: string;
    SCHWAB_API_OAUTH_AUTHORIZE_STEM: string;
    SCHWAB_API_OAUTH_TOKEN_STEM: string;
    emitUpdatedAuthCredentials: boolean;
}

export interface SchwabClientConfigSetup {
    SCHWAB_API_APP_KEY: string;
    SCHWAB_API_APP_SECRET: string;
    SCHWAB_API_APP_CALLBACK_URL: string;
    SCHWAB_API_BASE_URL?: string;
    SCHWAB_API_MARKETDATA_STEM?: string;
    SCHWAB_API_TRADER_STEM?: string;
    SCHWAB_API_OAUTH_AUTHORIZE_STEM?: string;
    SCHWAB_API_OAUTH_TOKEN_STEM?: string;
    /**
     * By default, auth credentials are cached within the instance. You can handle credentials yourself by providing a way to retrieve those.
     * It is recommended to couple this with setting emitUpdatedAuthCredentials to TRUE (default) and then handle any updates, such as when
     * the access_token is renewed every 30 minutes.
     */
    getAuthCredentials?: () => Promise<SchwabOauthData | null>;
    emitUpdatedAuthCredentials?: boolean;
}

export enum SchwabClientEvents {
    NEW_ACCESS_TOKEN = "NEW_ACCESS_TOKEN",
    NEW_REFRESH_TOKEN = "NEW_REFRESH_TOKEN"
}export interface IGetMarketHoursSingleConfig extends SchwabRequestConfig {
    market: EMarkets | string;
    /** Optional. Defaults to current day. Can up to 1 year in the future. */
    date?: DateStringSimple;
}

export interface IGetMarketHoursMultiConfig extends SchwabRequestConfig {
    markets: EMarkets[] | string[] | string;
    /** Optional. Defaults to current day. Can up to 1 year in the future. */
    date?: string;
}
// OPTIONCHAINS TYPES STOP
// QUOTES TYPES START

export interface IGetQuotesConfig extends SchwabRequestConfig {
    /** List of symbols, max of 500 of symbols+cusip+ssids. Use a string, comma-separated string, or an array of strings */
    symbols: string | string[];
    /** Possible values are quote,fundamental,reference,extended,regular. Dont send this attribute for full response. */
    fields?: string | string[];
    /** Include indicative symbol quotes for all ETF symbols in request. If ETF symbol ABC is in request and indicative=true API will return quotes for ABC and its corresponding indicative quote for $ABC.IV */
    indicative?: boolean;
}

export interface IGetSymbolQuoteConfig extends SchwabRequestConfig {
    /** List of symbols, max of 500 of symbols+cusip+ssids. Use a string, comma-separated string, or an array of strings */
    symbol: string;
    /** Possible values are quote,fundamental,reference,extended,regular. Dont send this attribute for full response. */
    fields?: string | string[];
}
export interface IGetInstrumentsConfig extends SchwabRequestConfig {
    symbol: string;
    projection: EProjectionType | string;
}

export interface IGetInstrumentConfig extends SchwabRequestConfig {
    cusip: string;
}
export interface IGetOptionExpirationChainConfig extends SchwabRequestConfig {
    symbol: string;
}
export interface IGetOptionChainConfig extends SchwabRequestConfig {
    /** Only one symbol */
    symbol: string;
    contractType?: EContractTypeChar | string;
    /** The Number of strikes to return above or below the at-the-money price */
    strikeCount?: Int32Number;
    includeUnderlyingQuote?: boolean;
    strategy?: EStrategy | string;
    /** Strike interval for spread strategy chains */
    interval?: DoubleNumber;
    /** Strike price */
    strike?: DoubleNumber;
    /** The set of values was not enumerated by Schwab; these are TDA holdovers */
    range?: ERange | string;
    /** Only return expirations after this date. For strategies, expiration refers to the nearest term expiration in the strategy. Date format is: yyyy-MM-dd */
    fromDate?: DateStringSimple;
    /** Only return expirations before this date. For strategies, expiration refers to the nearest term expiration in the strategy. Date format is: yyyy-MM-dd */
    toDate?: DateStringSimple;
    /** Volatility to use in calculations. Applies only to ANALYTICAL strategy chains */
    volatility?: DoubleNumber;
    /** Underlying price to use in calculations. Applies only to ANALYTICAL strategy chains */
    underlyingPrice?: DoubleNumber;
    /** Interest rate to use in calculations. Applies only to ANALYTICAL strategy chains */
    interestRate?: DoubleNumber;
    /** Days to expiration to use in calculations. Applies only to ANALYTICAL strategy chains */
    daysToExpiration?: Int32Number;
    /** Return only options expiring in the specified month */
    expMonth?: EExpirationMonth | string;
    /** These were not enumerated by Schwab; these are TDA values */
    optionType?: EOptionType | string;
    /** Applicable only if its retail token, entitlement of client PP-PayingPro, NP-NonPro and PN-NonPayingPro */
    entitlement?: EOptionEntitlement | string;
}
/**
 * startDate and endDate are ms since epoch
 * Provide either period OR (startDate and endDate)
 */

export interface IGetPriceHistoryConfig extends SchwabRequestConfig {
    symbol: string;
    /** Over what period of time you would like the data. Use period or startDate/endDate to specify time span */
    periodType: EPeriodType | string;
    /**
     * Can use {@link EPeriodQtyByPeriodType} to get appropriate values to use.
     * Provide either this or startDate and endDate
     */
    period?: EPeriodQty | number;
    /**
     * Can use {@link EFrequencyTypeByPeriodType} to get appropriate values to use
     */
    frequencyType?: EFrequencyType | string;
    /**
     * Can use {@link EFrequencyQtyByFrequencyType} to get appropriate values to use
     */
    frequency?: EFrequencyQty | number;
    /** ms since epoch. Use this and endDate OR supply period */
    startDate?: number;
    /** ms since epoch. Use this and startDate OR supply period */
    endDate?: number;
    /** optional */
    needExtendedHoursData?: boolean;
    needPreviousClose?: boolean;
}
export interface IGetMoversConfig extends SchwabRequestConfig {
    symbolId: EIndex | string;
    sort?: EMoversSort | string;
    /** Lookback period in minutes; use 0 for the whole day */
    frequency?: EMoversFrequency | number;
}
