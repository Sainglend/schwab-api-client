// Copyright (C) 2024  Aaron Satterlee

import WebSocket from "ws";
import {
    ECommands,
    EScreenerFrequency,
    EScreenerPrefix,
    EScreenerSort,
    EServices, IStreamNotify,
    StreamingResponseData,
} from "./streamingdatatypes";
import StreamingUtils, {normalizeSymbol} from "./streamingutils";
import EventEmitter from "events";
import { UserPreference } from "./schwab-trading-types";
import { SchwabClient } from "./schwab-client";
import assert from "assert";

export interface IStreamDataSchwabConfig {
    /** default false; will emit raw data from the stream as an event named "data" */
    emitDataRaw?: boolean,
    /** default false; will emit raw data by subbed service with an event named like "{SERVICE}_RAW", e.g. "LEVELONE_EQUITIES_RAW" */
    emitDataBySubRaw?: boolean,
    /** default false; will emit raw typed by subbed service with an event named like "{SERVICE}_RAW", e.g. "LEVELONE_EQUITIES_TYPED" */
    emitDataBySubTyped?: boolean,
    /** default false; will emit raw data by subbed service with an event named like "{SERVICE}_RAW", e.g. "LEVELONE_EQUITIES_RAW_MSFT" */
    emitDataBySubAndTickerRaw?: boolean,
    /** default true; will emit raw data by subbed service with an event named like "{SERVICE}_RAW", e.g. "LEVELONE_EQUITIES_TYPED_MSFT" */
    emitDataBySubAndTickerTyped?: boolean,

    /** default 60 seconds; if a heartbeat is missed, how long should it wait before attempting a reconnect? */
    reconnectRetryIntervalSeconds?: number,

    /** default false; console.log actions as they occur */
    verbose?: boolean,
    /** default false; console.debug data as it is being parsed and more detailed descriptions */
    debug?: boolean,
}

export interface IStreamDataSchwabConfigUpdate {
    emitDataRaw?: boolean,
    emitDataBySubRaw?: boolean,
    emitDataBySubTyped?: boolean,
    emitDataBySubAndTickerRaw?: boolean,
    emitDataBySubAndTickerTyped?: boolean,
    retryIntervalSeconds?: number,
    verbose?: boolean,
    debug?: boolean,
}

export interface IStreamParams {
    keys?: string,
    fields?: string,
    version?: string,
    credential?: string,
    symbol?: string,
    frequency?: string,
}

export interface IGenericStreamConfig {
    service: EServices | string,
    command: ECommands | string,
    requestId?: number,
    parameters?: IStreamParams | any,
}

// You may specify an account id, but it isn't strictly necessary
export interface IAccountUpdatesSubConfig {
    accountIds?: string,
    fields?: string,
    requestSeqNum?: number,
}

export declare interface StreamDataSchwab {
    // events are: "heartbeat", "response", "data", "snapshot", "streamClosed", or one of the following four templates: "{service}_RAW", "{service}_RAW_{normalizedSymbol}", "{service}_TYPED", "{service}_TYPED_{normalizedSymbol}", e.g. "QUOTE_TYPED_MSFT"
    addListener(event: string | symbol, listener: (...args: any[]) => void): this;
    // events are: "heartbeat", "response", "data", "snapshot", "streamClosed", or one of the following four templates: "{service}_RAW", "{service}_RAW_{normalizedSymbol}", "{service}_TYPED", "{service}_TYPED_{normalizedSymbol}", e.g. "QUOTE_TYPED_MSFT"
    on(event: string | symbol, listener: (...args: any[]) => void): this;
    // events are: "heartbeat", "response", "data", "snapshot", "streamClosed", or one of the following four templates: "{service}_RAW", "{service}_RAW_{normalizedSymbol}", "{service}_TYPED", "{service}_TYPED_{normalizedSymbol}", e.g. "QUOTE_TYPED_MSFT"
    once(event: string | symbol, listener: (...args: any[]) => void): this;
    removeListener(event: string | symbol, listener: (...args: any[]) => void): this;
    off(event: string | symbol, listener: (...args: any[]) => void): this;
    removeAllListeners(event?: string | symbol): this;
    setMaxListeners(n: number): this;
    getMaxListeners(): number;
    listeners(event: string | symbol): any[];
    rawListeners(event: string | symbol): any[];
    emit(event: string | symbol, ...args: any[]): boolean;
    listenerCount(event: string | symbol): number;
    prependListener(event: string | symbol, listener: (...args: any[]) => void): this;
    prependOnceListener(event: string | symbol, listener: (...args: any[]) => void): this;
    eventNames(): Array<string | symbol>;
}

/**
 * Events emitted:
 *  heartbeat - for stream heartbeats
 *  response - for stream events pertaining to QOS, LOGOUT, LOGIN;
 *  streamClosed - when the stream is closed;
 *  data - only emitted when config.emitDataRaw is true; covers all realtime data;
 *  snapshot - only emitted when config.emitDataRaw is true; applicable for CHART_FUTURES_HISTORY;
 *  {EServices}_RAW - an array of raw data for the specified service
 *  {EServices}_RAW_{normalizedSymbol} - an item of raw data for the specified service and symbol
 *  {EServices}_TYPED - an array of typed data for the specified service
 *  {EServices}_TYPED_{normalizedSymbol} - an item of typed data for the specified service and symbol
 */
export class StreamDataSchwab extends EventEmitter {
    private dataStreamSocket: any;
    private userKilled: boolean;
    private userPreferenceResponse: UserPreference | null;
    private requestId: number;
    // @ts-ignore
    private streamLastAlive: number;
    private streamStartupTime: number;
    private heartbeats: number[];
    private heartbeatCheckerInterval: any;
    private streamRestartsCount: number;

    readonly defaultFields: Map<string, string>;

    // internal state
    private subParams: {[index: string]: IStreamParams};
    private connectionRetryAttemptTimeouts: any[];

    // input
    private client: SchwabClient;

    // configurable
    private retryIntervalSeconds: number;
    private emitDataRaw: boolean;
    private emitDataBySubRaw: boolean;
    private emitDataBySubTyped: boolean;
    private emitDataBySubAndTickerRaw: boolean;
    private emitDataBySubAndTickerTyped: boolean;
    private verbose: boolean;
    private debug: boolean;

    constructor(client: SchwabClient) {
        super();
        this.client = client;
        this.dataStreamSocket = {};
        this.userKilled = false;
        this.userPreferenceResponse = null;
        this.requestId = 0;
        this.streamLastAlive = 0;
        this.streamStartupTime = 0;
        this.heartbeats = [];
        this.heartbeatCheckerInterval = 0;
        this.streamRestartsCount = 0;

        this.defaultFields = StreamDataSchwab.setDefaultFields();

        // internal state in case of restart
        this.subParams = {};
        this.connectionRetryAttemptTimeouts = [];

        // configurable
        this.retryIntervalSeconds = 60;
        this.emitDataRaw = false;
        this.emitDataBySubRaw = false;
        this.emitDataBySubTyped = false;
        this.emitDataBySubAndTickerRaw = false;
        this.emitDataBySubAndTickerTyped = true;
        this.verbose = false;
        this.debug = false;
    }

    private static setDefaultFields() : Map<string, string> {
        const defaultFields = new Map();
        defaultFields.set(EServices.CHART_FUTURES, StreamingUtils.buildNumberArray(0, 6));
        defaultFields.set(EServices.CHART_EQUITY, StreamingUtils.buildNumberArray(0, 8));

        defaultFields.set(EServices.LEVELONE_EQUITIES, StreamingUtils.buildNumberArray(0, 51));
        defaultFields.set(EServices.LEVELONE_OPTIONS, StreamingUtils.buildNumberArray(0, 55));
        defaultFields.set(EServices.LEVELONE_FOREX, StreamingUtils.buildNumberArray(0, 29));
        defaultFields.set(EServices.LEVELONE_FUTURES, StreamingUtils.buildNumberArray(0, 40));
        defaultFields.set(EServices.LEVELONE_FUTURES_OPTIONS, StreamingUtils.buildNumberArray(0, 31));
        

        defaultFields.set(EServices.ACCT_ACTIVITY, StreamingUtils.buildNumberArray(0, 3));

        defaultFields.set(EServices.NYSE_BOOK, StreamingUtils.buildNumberArray(0, 3));
        defaultFields.set(EServices.NASDAQ_BOOK, StreamingUtils.buildNumberArray(0, 3));
        defaultFields.set(EServices.OPTIONS_BOOK, StreamingUtils.buildNumberArray(0, 3));

        defaultFields.set(EServices.SCREENER_EQUITY, StreamingUtils.buildNumberArray(0, 4));
        defaultFields.set(EServices.SCREENER_OPTION, StreamingUtils.buildNumberArray(0, 4));

        return defaultFields;
    }

    private startHeartbeatChecker(): any {

        const restartDataStream = this.restartDataStream.bind(this);
        // default check is every minute
        return setInterval(async () => {
            if (this.verbose) console.log(new Date().toISOString() + " hb checker");
            // if the latest heartbeat was more than a minute ago
            // OR there have been no heartbeats since the stream started over a minute ago
            if (this.streamStartupTime > 0
                && (this.heartbeats[this.heartbeats.length - 1] < Date.now() - 60_000
                    || (Date.now() - this.streamStartupTime > 60_000 && this.heartbeats.length < 1))
            ) {
                restartDataStream();
            }
            if (this.heartbeats.length > 100) this.heartbeats = this.heartbeats.slice(-50);
        }, this.retryIntervalSeconds*1000);
    }

    private getDefaultFields(service: EServices): string {
        if (this.defaultFields.has(service)) {
            return this.defaultFields.get(service) ?? "";
        } else return "";
    }

    private handleIncomingData(element: StreamingResponseData, emitEventBase: string, mappingFunction: any): void {
        if (this.verbose) console.log(`handle incoming data, ${emitEventBase}; subraw:${this.emitDataBySubRaw}, subtickerraw:${this.emitDataBySubAndTickerRaw}, subtyped:${this.emitDataBySubTyped}, subtickertyped:${this.emitDataBySubAndTickerTyped}`);
        if (this.emitDataBySubRaw) {
            if (this.debug) console.debug(`${emitEventBase}_RAW`, JSON.stringify(element.content, null, 2));
            this.emit(`${emitEventBase}_RAW`, element.content);
        }
        if (this.emitDataBySubAndTickerRaw) {
            element.content.forEach((item: any) => {
                if (this.debug) console.debug(`${emitEventBase}_RAW_${normalizeSymbol(item.key)}`, JSON.stringify(item, null, 2));
                this.emit(`${emitEventBase}_RAW_${normalizeSymbol(item.key)}`, item);
            });
        }

        if (this.emitDataBySubAndTickerTyped || this.emitDataBySubTyped) {
            if (this.verbose) console.log("typed");
            const typedResponses: any[] = element.content.map((item: any) => mappingFunction(item, element.timestamp));
            if (this.emitDataBySubTyped) {
                if (this.debug) console.debug(`${emitEventBase}_TYPED`, JSON.stringify(typedResponses, null, 2));
                this.emit(`${emitEventBase}_TYPED`, typedResponses);
            }
            if (this.emitDataBySubAndTickerTyped && typedResponses) {
                typedResponses.forEach(item => {
                    if (this.debug) console.debug(`${emitEventBase}_TYPED_${normalizeSymbol(item.key)}`, JSON.stringify(item, null, 2));
                    this.emit(`${emitEventBase}_TYPED_${normalizeSymbol(item.key)}`, item);
                });
            }
        }
    }

    /**
     * Called each time there is incoming data from the stream. This calls handleIncomingData with formatted data.
     * @param responseString
     * @param resolve
     * @private
     */
    private async handleIncoming(responseString: string, resolve?: Function): Promise<void> {
        if (resolve) resolve();

        // console.log('handle incoming');
        this.streamLastAlive = Date.now();
        this.heartbeats.push(this.streamLastAlive);
        let responseObject = null;
        try {
            responseObject = JSON.parse(responseString);
        } catch (e) {
            if (this.verbose) console.log("An exception occurred while trying to parse stream data: ", responseString);
        }
        if (!responseObject) return;

        if (this.verbose) {
            console.log("handle incoming: " + Object.keys(responseObject).join(","));
            console.log(JSON.stringify(responseObject, null, 2));
        }

        if (responseObject.notify) {
            if (this.verbose) console.log(JSON.stringify(responseObject.notify, null, 2));
            this.emit("heartbeat", responseObject.notify as IStreamNotify[]);
        }

        // such as in the case of acknowledging connection or new subscription or qos change
        if (responseObject.response) {
            // case 5.7 service === 'ADMIN' && command === 'QOS'
            // case 5.5 service === 'ADMIN' && command === 'LOGOUT'
            // case 5.3 service === 'ADMIN' && command === 'LOGIN'
            if (!this.heartbeatCheckerInterval) this.heartbeatCheckerInterval = this.startHeartbeatChecker();
            if (this.verbose) console.log(JSON.stringify(responseObject.response, null, 2));
            this.emit("response", responseObject.response);
        }

        if (responseObject.data) {
            if (this.emitDataRaw) {
                this.emit("data", responseObject.data);
            }
            responseObject.data.forEach((element: StreamingResponseData) => {
                let fn = null;
                switch (element.service) {
                case EServices.LEVELONE_FUTURES: fn = StreamingUtils.transformL1FuturesResponse; break;
                case EServices.LEVELONE_FUTURES_OPTIONS: fn = StreamingUtils.transformL1FuturesOptionsResponse; break;
                case EServices.LEVELONE_FOREX: fn = StreamingUtils.transformL1ForexResponse; break;
                case EServices.LEVELONE_EQUITIES: fn = StreamingUtils.transformL1EquitiesResponse; break;
                case EServices.LEVELONE_OPTIONS: fn = StreamingUtils.transformL1OptionsResponse; break;
                case EServices.CHART_EQUITY: fn = StreamingUtils.transformEquityChartResponse; break;
                case EServices.CHART_FUTURES: fn = StreamingUtils.transformFuturesChartResponse; break;
                case EServices.NYSE_BOOK:
                case EServices.OPTIONS_BOOK:
                case EServices.NASDAQ_BOOK: fn = StreamingUtils.transformBookServiceResponse; break;
                case EServices.SCREENER_EQUITY:
                case EServices.SCREENER_OPTION: fn = StreamingUtils.transformScreenerResponse; break;
                case EServices.ACCT_ACTIVITY: fn = StreamingUtils.transformAcctActivityResponse; break;
                default: break;
                }
                if (fn != null) {
                    this.handleIncomingData(element, element.service, fn);
                }
            });
        }
    }

    private handleParamStorage(config: IGenericStreamConfig) {
        // handle param storage
        if (!config.service || [EServices.ADMIN].includes(config.service as EServices)) return;
        const currentParams = this.subParams[config.service];
        if (config.command === ECommands.SUBS) {
            // overwrite
            this.subParams[config.service] = {
                ...config.parameters,
            };
        } else if (config.command === ECommands.ADD) {
            // superset
            const keys = new Set();
            config.parameters?.keys?.split(",").forEach((k: string) => {
                keys.add(k);
            });
            this.subParams[config.service]?.keys?.split(",").forEach((k: string) => {
                keys.add(k);
            });
            const fields = new Set();
            config.parameters?.fields?.split(",").forEach((k: string) => {
                fields.add(k);
            });
            this.subParams[config.service]?.fields?.split(",").forEach((k: string) => {
                fields.add(k);
            });
            this.subParams[config.service] = {
                keys: Array.from(keys).join(","),
                fields: Array.from(fields).join(","),
            };
        } else if (config.command === ECommands.UNSUBS) {
            // if there are keys, that means the unsub is selective
            if (config.parameters?.keys) {
                const keys = new Set();
                this.subParams[config.service]?.keys?.split(",").forEach((k: string) => {
                    keys.add(k);
                });
                config.parameters?.keys?.split(",").forEach((k: string) => {
                    keys.delete(k);
                });
                this.subParams[config.service] = {
                    ...currentParams,
                    keys: Array.from(keys).join(","),
                };
            } else {
                this.subParams[config.service] = {};
            }
        }
    }

    private resubscribe() {
        for (const service in this.subParams) {
            const params = this.subParams[service];
            const input = {
                service: service,
                command: ECommands.SUBS,
                requestId: this.requestId++,
                parameters: params,
            };
            this.genericStreamRequest(input as IGenericStreamConfig);
        }
    }

    // called after connect success, and OPEN event received; do login, then something to keep stream alive
    private async open(loginRequest: any): Promise<void> {
        this.dataStreamSocket.send(JSON.stringify(loginRequest));
    }

    private async restartDataStream(): Promise<void> {
        this.streamRestartsCount++;
        if (this.heartbeatCheckerInterval) {
            if (this.verbose) console.log("Clearing heartbeat checker for restart", this.streamRestartsCount, "time:", new Date().toISOString());
            if (this.heartbeatCheckerInterval) clearInterval(this.heartbeatCheckerInterval);
            this.heartbeatCheckerInterval = 0;
        }
        this.once("message", () => { this.clearRetryAttempts(); this.resubscribe(); }); // set this to trigger on successful login
        this.doDataStreamLogin();
    }

    private clearRetryAttempts() {
        this.connectionRetryAttemptTimeouts.forEach(t => clearTimeout(t));
    }

    private async handleStreamClose(): Promise<void> {
        if (this.verbose) console.log("handleStreamClose called");
        if (this.heartbeatCheckerInterval) clearInterval(this.heartbeatCheckerInterval);
        this.heartbeatCheckerInterval = 0;

        if (this.userKilled) {
            if (this.verbose) console.log("stream closed, killed by user");
            this.emit("streamClosed", {attemptingReconnect: false});
        } else {
            if (this.verbose) console.log("stream closed, not killed by user, attempting restart");
            this.emit("streamClosed", {attemptingReconnect: true});
            // attempt to reconnect
            await this.restartDataStream();
        }
        return;
    }

    /**
     * Update some aspects of the stream config.
     */
    setConfig(configUpdate: IStreamDataSchwabConfigUpdate): void {
        this.emitDataRaw = configUpdate.emitDataRaw != undefined ? configUpdate.emitDataRaw : this.emitDataRaw;
        this.emitDataBySubRaw = configUpdate.emitDataBySubRaw != undefined ? configUpdate.emitDataBySubRaw : this.emitDataBySubRaw;
        this.emitDataBySubTyped = configUpdate.emitDataBySubTyped != undefined ? configUpdate.emitDataBySubTyped : this.emitDataBySubTyped;
        this.emitDataBySubAndTickerRaw = configUpdate.emitDataBySubAndTickerRaw != undefined ? configUpdate.emitDataBySubAndTickerRaw : this.emitDataBySubAndTickerRaw;
        this.emitDataBySubAndTickerTyped = configUpdate.emitDataBySubAndTickerTyped != undefined ? configUpdate.emitDataBySubAndTickerTyped : this.emitDataBySubAndTickerTyped;
        this.retryIntervalSeconds = configUpdate.retryIntervalSeconds || this.retryIntervalSeconds;
        this.verbose = configUpdate.verbose || false;
        this.debug = configUpdate.debug || false;
    }

    /**
     * Get the config as is currently being used
     */
    getConfig(): IStreamDataSchwabConfig {
        return {
            emitDataRaw: this.emitDataRaw,
            emitDataBySubRaw: this.emitDataBySubRaw,
            emitDataBySubTyped: this.emitDataBySubTyped,
            emitDataBySubAndTickerRaw: this.emitDataBySubAndTickerRaw,
            emitDataBySubAndTickerTyped: this.emitDataBySubAndTickerTyped,
            reconnectRetryIntervalSeconds: this.retryIntervalSeconds,
            verbose: this.verbose,
            debug: this.debug,
        };
    }

    /**
     * Send a custom stream request, without using one of the helper methods. This method will not capture and store state
     * of your in-progress streams, meaning in the case of disconnect and reconnect, the subscriptions won't be automatically
     * resubscribed.
     * Otherwise, use {@link genericStreamRequest}.
     */
    async sendStreamRequest(requestJSON: any): Promise<void> {
        this.dataStreamSocket.send(JSON.stringify(requestJSON));
    }

    /**
     * Generic wrapper method for sending a stream request.
     * Any requests using this method for subscriptions will have the subscription parameters stored so that in the event
     * of stream interruption and reconnection, all streams will automatically be resubscribed as they were.
     * All helper methods wrap this.
     *
     * @example <caption>Subscribe to real-time stock price updates.</caption>
     * const requestSeqNum = await genericStreamRequest({
     *     service: EServices.LEVELONE_EQUITIES,
     *     command: ECommands.SUBS,
     *     parameters: {
     *         keys: 'TSLA,F,MSFT',
     *     },
     * });
     * @example <caption>A request that sends in the specific fields to return..</caption>
     * const requestSeqNum = await genericStreamRequest(
     *      {
     *          service: EServices.LEVELONE_FUTURES,
     *          command: ECommands.SUBS,
     *          parameters: {
     *              keys: '/NQ,/ES',
     *              fields: '0,1,2,3,4,5,6,7,8',
     *          },
     *      });
     * @returns {number} Returns the sequence number of the request.
     */
    async genericStreamRequest(config: IGenericStreamConfig) : Promise<number> {
        if (!config) throw "You must pass in a config object";
        const localConfig = { ...config };
        if (!localConfig.requestId) localConfig.requestId = this.requestId++;

        const parameters = { ...localConfig.parameters };
        const { requestId: requestSeqNum, service, command } = localConfig;
        if ([ECommands.SUBS, ECommands.ADD].includes(command as ECommands)) {
            if (!parameters || !parameters.keys) throw "With commands ADD or SUBS, your config object must have parameters";
            if (!parameters.fields) {
                parameters.fields = this.getDefaultFields(localConfig.service as EServices);
            }
        }

        // store parameters so the streams can be recovered in case of websocket connection loss
        this.handleParamStorage(localConfig);

        const request = {
            requests: [
                {
                    service: service,
                    requestid: `${requestSeqNum}`,
                    command: command,
                    SchwabClientCorrelId: this.userPreferenceResponse?.streamerInfo[0].schwabClientCorrelId,
                    SchwabClientCustomerId: this.userPreferenceResponse?.streamerInfo[0].schwabClientCustomerId,
                    parameters,
                },
            ],
        };
        this.dataStreamSocket.send(JSON.stringify(request));
        return requestSeqNum;
    }

    /**
     * This method must be called to log in to the stream. If you want to have an event listener for login, set it
     * before calling this login method.
     */
    async doDataStreamLogin() : Promise<any> {
        // if now is within 30 seconds of last alive, do nothing
        this.userKilled = false;
        if (this.verbose) console.log("doDataStreamLogin");
        await this.client.oauthRefreshAccessToken();
        const userPreferenceResponse = await this.client.account.getStreamerSubKeys();
        this.userPreferenceResponse = userPreferenceResponse;
        // console.log(`userPrincipals: ${JSON.stringify(this.userPrincipalsResponse)}`);

        const loginRequest = {
            requests: [
                {
                    service: EServices.ADMIN,
                    command: ECommands.LOGIN,
                    requestid: `${this.requestId++}`,
                    SchwabClientCustomerId: userPreferenceResponse.streamerInfo[0].schwabClientCustomerId,
                    SchwabClientCorrelId: userPreferenceResponse.streamerInfo[0].schwabClientCorrelId,
                    parameters: {
                        Authorization: (await this.client.getCurrentAuth()).access_token,
                        SchwabClientChannel: userPreferenceResponse.streamerInfo[0].schwabClientChannel,
                        SchwabClientFunctionId: userPreferenceResponse.streamerInfo[0].schwabClientFunctionId,
                    },
                },
            ],
        };

        return new Promise((resolve) => {
            this.dataStreamSocket = new WebSocket(userPreferenceResponse.streamerInfo[0].streamerSocketUrl);

            this.dataStreamSocket.on("message", (response: string) => this.handleIncoming.call(this, response, resolve));

            this.dataStreamSocket.on("close", () => this.handleStreamClose.call(this));

            this.dataStreamSocket.on("open", () => this.open.call(this, loginRequest));
        });
    }

    /**
     * After calling this, wait for the emitting event 'streamClosed' with data {attemptingReconnect: false}
     */
    async doDataStreamLogout(): Promise<void> {
        this.userKilled = true;
        if (this.heartbeatCheckerInterval) clearInterval(this.heartbeatCheckerInterval);
        this.heartbeatCheckerInterval = 0;
        await this.genericStreamRequest({
            service: EServices.ADMIN,
            requestId: this.requestId++,
            command: ECommands.LOGOUT,
            parameters: {},
        });
        // this.dataStreamSocket.close();
    }

    /**
     * Schwab-standard FUTURES format: '/' + 'root symbol' + 'month code' + 'year code' 
     * e.g.: /ESZ24
     * 
     * Schwab-standard FUTURES_OPTIONS format: '.' + '/' + 'root symbol' + 'month code' + 'year code' + 'Call/Put code' + 'Strike Price'
     * e.g.: ./ESZ24C5800
     * 
     * Schwab-standard OPTIONS symbol format: RRRRRRYYMMDDsWWWWWddd
     * Where:
     *  R is the space-filled root
     *  symbol YY is the expiration year
     *  MM is the expiration month
     *  DD is the expiration day
     *  s is the side: C/P (call/put)
     *  WWWWW is the whole portion of the strike price
     *  nnn is the decimal portion of the strike price
     * e.g.: AAPL  251219C00200000
     * 
     * FOREX Symbols in upper case
     * e.g.: EUR/USD,USD/JPY,AUD/CAD
     * @see {EFuturesExpiryMonths} for futures expiry month letter abbreviations
     */
    async subLevelOneService(service: EServices.LEVELONE_EQUITIES | EServices.LEVELONE_FOREX | EServices.LEVELONE_FUTURES | EServices.LEVELONE_FUTURES_OPTIONS | EServices.LEVELONE_OPTIONS, tickers: string[], fields?: string) {
        assert.strictEqual([EServices.LEVELONE_EQUITIES, EServices.LEVELONE_FOREX, EServices.LEVELONE_FUTURES, EServices.LEVELONE_FUTURES_OPTIONS, EServices.LEVELONE_OPTIONS].includes(service), true);
        await this.genericStreamRequest({
            command: ECommands.ADD,
            service,
            parameters: {
                keys: tickers.join(","),
                fields: fields ?? this.getDefaultFields(service),
            }
        });
    }

    /**
     * Schwab-standard format: '/' + 'root symbol' + 'month code' + 'year code' 
     * ex: /ESZ24
     * @see {EFuturesExpiryMonths} for futures expiry month letter abbreviations
     */
    async unsubLevelOneService(service: EServices.LEVELONE_EQUITIES | EServices.LEVELONE_FOREX | EServices.LEVELONE_FUTURES | EServices.LEVELONE_FUTURES_OPTIONS | EServices.LEVELONE_OPTIONS, tickers?: string[]) {
        assert.strictEqual([EServices.LEVELONE_EQUITIES, EServices.LEVELONE_FOREX, EServices.LEVELONE_FUTURES, EServices.LEVELONE_FUTURES_OPTIONS, EServices.LEVELONE_OPTIONS].includes(service), true);
        const params = tickers ? { keys: tickers.join(",") } : {}
        await this.genericStreamRequest({
            command: ECommands.UNSUBS,
            service,
            parameters: params,
        });
    }

    async subChartService(service: EServices.CHART_EQUITY | EServices.CHART_FUTURES, tickers: string[], fields?: string) {
        await this.genericStreamRequest({
            command: ECommands.ADD,
            service,
            parameters: {
                keys: tickers.join(","),
                fields: fields ?? this.getDefaultFields(service),
            }
        });
    }

    async unsubChartService(service: EServices.CHART_EQUITY | EServices.CHART_FUTURES, tickers?: string[]) {
        assert.strictEqual([EServices.CHART_EQUITY, EServices.CHART_FUTURES].includes(service), true);
        const params = tickers ? { keys: tickers.join(",") } : {}
        await this.genericStreamRequest({
            command: ECommands.UNSUBS,
            service,
            parameters: params,
        });
    }

    async subBookService(service: EServices.NYSE_BOOK | EServices.NASDAQ_BOOK | EServices.OPTIONS_BOOK, tickers: string[], fields?: string) {
        assert.strictEqual([EServices.NYSE_BOOK, EServices.NASDAQ_BOOK, EServices.OPTIONS_BOOK].includes(service), true);
        await this.genericStreamRequest({
            command: ECommands.ADD,
            service,
            parameters: {
                keys: tickers.join(","),
                fields: fields ?? this.getDefaultFields(service),
            }
        });
    }

    async unsubBookService(service: EServices.NYSE_BOOK | EServices.NASDAQ_BOOK | EServices.OPTIONS_BOOK, tickers: string[] = []) {
        assert.strictEqual([EServices.NYSE_BOOK, EServices.NASDAQ_BOOK, EServices.OPTIONS_BOOK].includes(service), true);
        const params = tickers && tickers.length ? { keys: tickers.join(",") } : {}
        await this.genericStreamRequest({
            command: ECommands.UNSUBS,
            service,
            parameters: params,
        });
    }

    /**
     * Tickers to sub to are in the format: PREFIX_SORTFIELD_FREQUENCY
     * These will be constructed based on your inputs.
     */
    async subScreener(service: EServices.SCREENER_EQUITY | EServices.SCREENER_OPTION, tickers: (EScreenerPrefix | string)[], sortField: EScreenerSort, frequency: EScreenerFrequency, fields?: string) {
        assert.strictEqual([EServices.SCREENER_EQUITY, EServices.SCREENER_OPTION].includes(service), true);
        await this.genericStreamRequest({
            command: ECommands.ADD,
            service: service,
            parameters: {
                keys: tickers.map(t => `${t}_${sortField}_${frequency}`).join(","),
                fields: fields ?? this.getDefaultFields(service),
            }
        });
    }

    /**
     * Tickers to unsub from are in the format: PREFIX_SORTFIELD_FREQUENCY
     * These will be constructed based on your inputs.
     */
    async unsubScreener(service: EServices.SCREENER_EQUITY | EServices.SCREENER_OPTION, tickers?: string[]) {
        assert.strictEqual([EServices.SCREENER_EQUITY, EServices.SCREENER_OPTION].includes(service), true);
        const params = tickers ? { keys: tickers.join(",") } : {}
        await this.genericStreamRequest({
            command: ECommands.UNSUBS,
            service: service,
            parameters: params,
        });
    }

    async subAccountActivity() {
        await this.genericStreamRequest({
            command: ECommands.SUBS,
            service: EServices.ACCT_ACTIVITY,
            parameters: {
                keys: "blah",
                fields: this.getDefaultFields(EServices.ACCT_ACTIVITY),
            },
        });
    }

    async unsubAccountActivity() {
        await this.genericStreamRequest({
            command: ECommands.UNSUBS,
            service: EServices.ACCT_ACTIVITY,
            parameters: {},
        });
    }
}
