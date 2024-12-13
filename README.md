# schwab-api-client
A client for accessing Schwab's Trader and Marketdata API for Individuals, https://developer.schwab.com .

I am not affiliated with Charles Schwab. I am simply a customer, like you. Use this lib as-is.

This is only v0.1.0, as there isn't yet proper testing or documentation up to my standards. Until v1.0.0, there may be breaking changes that are NOT behind a major version number. Therefore, I encourage you to be defensive and pin versions and update manually until v1.0.0.

## Table of Contents

- [Basic Usage](#basic-usage)
- [Recommended Usage](#recommended-usage)
- [Credentials](#credentials)
- [Basic Requests](#basic-requests)
- [Streaming](#streaming)
- [Symbol Formatting](#symbol-formatting)
- [Example Express App](#example-express-app)
- [What is not yet ready?](#what-is-not-yet-ready)


## Basic Usage
Instantiate the client, passing in your app's credentials from your setup at https://developer.schwab.com
```
const schwabClient = new SchwabClient({
    SCHWAB_API_APP_KEY,
    SCHWAB_API_APP_SECRET,
    SCHWAB_API_APP_CALLBACK_URL,
});
const config: IGetSymbolQuoteConfig = { symbol: "MSFT" };
const data = await schwabClient.marketData.getSymbolQuote(config);
```

## Recommended Usage
I recommend you add listeners for credential refreshes and maintain those in a file or cache. You provide a hook into that with a function that returns a Promise wrapping type SchwabOauthData.

Additionally, you can set the initial values with `schwabClient.setUserAuthResult()` such as if you are rehydrating the auth info (specifically the refresh token) from a file or other source that doesn't disappear when your program exits.

The new access token event will get called when you log in to your app via your app's authorization url which you can obtain with `schwabClient.getAuthorizationUrl()`
```
const schwabClient = new SchwabClient({
    SCHWAB_API_APP_KEY,
    SCHWAB_API_APP_SECRET,
    SCHWAB_API_APP_CALLBACK_URL,
    getAuthCredentials: () => Promise.resolve(readAuthFile()),
    emitUpdatedAuthCredentials: true,
});
schwabClient.setUserAuthResult(readAuthFile() ?? undefined);
schwabClient.on(SchwabClientEvents.NEW_ACCESS_TOKEN, (authData: SchwabOauthData) => writeOutAuthFile(authData));
schwabClient.on(SchwabClientEvents.NEW_REFRESH_TOKEN, (authData: SchwabOauthData) => writeOutAuthFile(authData));
```

## Credentials
Working with credentials is always fun!
Schwab uses Oauth2, with refresh tokens lasting 7 days, access tokens lasting 30 minutes.

This lib will automatically get new access tokens as-needed.

1. The first step is to get a refresh token. After initializing a new SchwabClient, call `schwabClient.getAuthorizationUrl()` to get an URL, looking like: `https://api.schwabapi.com/v1/oauth/authorize?client_id={CONSUMER _KEY}&redirect_uri={APP_CALLBACK_URL}`
2. After you log in to Schwab at that url, it will call back to your application in this format: `https://{SCHWAB_API_APP_CALLBACK_URL}/?code={AUTHORIZATION_CODE_GENERATED}&session={SESSION_ID}`
3. Take that `code` query param and call `schwabClient.oauthAuthUserWithCode(code)`, passing in that code. This will then get a refresh token and access token and hold those locally as well as emit an event you can listen for (`SchwabClientEvents.NEW_REFRESH_TOKEN`) so that you can save those creds somewhere.
4. From this point on, if you call an endpoint with an expired access token, the lib will automatically use the refresh token to get a new access token, emit `SchwabClientEvents.NEW_ACCESS_TOKEN`, and retry your api call. If you are awaiting a function call, the promise should still resolve with the expected result, it just might take an extra second to make that addtional reauth call.

Notice in the section about Recommended Usage, there are examples of how to manually set creds in the client instance, as well as how to set up listeners for the events:
```
schwabClient.setUserAuthResult(readAuthFile() ?? undefined);
```
Set up new creds listeners.
```
schwabClient.on(SchwabClientEvents.NEW_ACCESS_TOKEN, (authData: SchwabOauthData) => doSomething(authData));
schwabClient.on(SchwabClientEvents.NEW_REFRESH_TOKEN, (authData: SchwabOauthData) => doSomething(authData));
```

## Basic Requests

Each request has its own typed input config object to help you properly send in expected input.
```
const config: IGetSymbolQuoteConfig = { symbol: "MSFT" };
const data = await schwabClient.marketData.getSymbolQuote(config);


const config2: IDeleteOrderByIdAndAccountConfig = {
    accountNumber: myAccountNumber,
    orderId: fomoOrderId,
};
await schwabClient.account.deleteOrderByIdAndAccount(config2);
```
There are also enums to help with such expected values.
```
const config: IGetMoversConfig = {
    symbolId: EIndex.NASDAQ,
    sort: EMoversSort.VOLUME,
    frequency: EMoversFrequency.THIRTY,
}
const data = await schwabClient.marketData.getMovers(config);
```

The structure of the SchwabClient class mirrors the structure in their documentation, with 3 objects, each with their own methods:
- schwabClient.marketData
- schwabClient.account
- schwabClient.dataStream

### MARKETDATA
Methods are:
- getQuotes(): multiple symbols ok
- getSymbolQuote(): single symbol
- getOptionChain()
- getOptionExpirationChain()
- getPriceHistory()
- getMovers()
- getMarketHoursSingle()
- getMarketHoursMulti()
- getInstruments()
- getInstrument()

### ACCOUNT
Methods are:
- getAccountNumbers()
- getAccounts()
- getAccount()
- getAllOrders()
- getAllOrdersByAccount()
- getOrderByIdAndAccount()
- deleteOrderByIdAndAccount()
- replaceOrderByAccount()
- putOrderByAccount()
- postOrderByAccount()
- postPreviewOrderByAccount(): very cool endpoint, allowing you to preview what the resulting impact on your account balance would be; also a sort of input validator
- getTransactionsByAccount()
- getTransactionByIdAndAccount
- getStreamerSubKeys

## Streaming
For streaming, it is an object on the main schwabClient object: `schwabClient.dataStream`

1. Set config, if you wish
2. Set up listeners to the events you want
3. Call `schwabClient.dataStream.doDataStreamLogin()`
4. Subscribe to streams.

```
// SETUP
schwabClient.dataStream.setConfig({ verbose: true, debug: true });
schwabClient.dataStream.on(SchwabStreamEventTypes.HEARTBEAT, (data) => console.log(data));
schwabClient.dataStream.on(formatStreamEventType(EServices.LEVELONE_EQUITIES, "TYPED"), (data) => console.log(data));

// LOGIN AND REQUESTS
await schwabClient.dataStream.doDataStreamLogin();
await schwabClient.dataStream.subLevelOneService(EServices.LEVELONE_EQUITIES, ["MSFT"]);
```

### Streaming Config
Config can be set with:
```
schwabClient.dataStream.setConfig(configObj);
```
The configObj is type IStreamDataSchwabConfigUpdate
- emitDataRaw?: boolean -- default false; will emit raw data from the stream as an event named "data"
- emitDataBySubRaw?: boolean, -- default false; will emit raw data by subbed service with an event named like "{SERVICE}_RAW", e.g. "LEVELONE_EQUITIES_RAW"
- emitDataBySubTyped?: boolean,  -- default false; will emit raw typed by subbed service with an event named like "{SERVICE}_RAW", e.g. "LEVELONE_EQUITIES_TYPED"
- emitDataBySubAndTickerRaw?: boolean,  -- default false; will emit raw data by subbed service with an event named like "{SERVICE}_RAW", e.g. "LEVELONE_EQUITIES_RAW_MSFT"
- emitDataBySubAndTickerTyped?: boolean,  -- default true; will emit raw data by subbed service with an event named like "{SERVICE}_RAW", e.g. "LEVELONE_EQUITIES_TYPED_MSFT"
- retryIntervalSeconds?: number, -- default 60 seconds; if a heartbeat is missed, how long should it wait before attempting a reconnect?
- verbose?: boolean, -- default false; console.log actions as they occur
- debug?: boolean, -- default false; console.debug data as it is being parsed and more detailed descriptions

### Methods
- doDataStreamLogin()
- doDataStreamLogout()
- setConfig(config)
- getConfig()
- sendStreamRequest():  Send a custom stream request, without using one of the helper methods. This method will not capture and store state of your in-progress streams, meaning in the case of disconnect and reconnect, the subscriptions won't be automatically resubscribed.
- genericStreamRequest(): Generic wrapper method for sending a stream request. Any requests using this method for subscriptions will have the subscription parameters stored so that in the event of stream interruption and reconnection, all streams will automatically be resubscribed as they were. All helper methods wrap this.
- subLevelOneService(service: EServices.LEVELONE_EQUITIES | EServices.LEVELONE_FOREX | EServices.LEVELONE_FUTURES | EServices.LEVELONE_FUTURES_OPTIONS | EServices.LEVELONE_OPTIONS, tickers: string[], fields?: string): This gets you tick-level price data.
- unsubLevelOneService(service, tickers?): Stop streaming ticks
- subChartService(service: EServices.CHART_EQUITY | EServices.CHART_FUTURES, tickers: string[], fields?: string): Subscribe to a stream of 1 minute candles.
- unsubChartService(service, tickers?): Stop streaming 1 minute candles.
- subBookService(service: EServices.NYSE_BOOK | EServices.NASDAQ_BOOK | EServices.OPTIONS_BOOK, tickers: string[], fields?: string): get the book ticks (market maker, price, size)
- unsubBookService(service, tickers): stop getting book ticks
- subScreener(service: EServices.SCREENER_EQUITY | EServices.SCREENER_OPTION, tickers: (EScreenerPrefix | string)[], sortField: EScreenerSort, frequency: EScreenerFrequency, fields?: string)
- unsubScreener(service, tickers)
- subAccountActivity()
- unsubAccountActivity()

NOTE: The Account Activity subscriptions aren't well defined, so at this time there is no guidance or typing in this lib for data from that stream.

## Symbol Formatting
Symbol formats are always fun!

### FUTURES
Schwab-standard FUTURES format is to concatenate the following:
- '/'
- 'root symbol'
- 'month code' (use EFuturesExpiryMonths)
- 'year code' 
 e.g.: "/ESZ24"

### FUTURES OPTIONS
Schwab-standard FUTURES_OPTIONS format is to concatenate the following: 
- '.'
- '/'
- 'root symbol'
- 'month code' (use EFuturesExpiryMonths)
- 'year code'
- 'Call/Put code'
- 'Strike Price'
e.g.: "./ESZ24C5800"

### OPTIONS
Schwab-standard OPTIONS symbol format: RRRRRRYYMMDDsWWWWWddd
Where:
- R is the space-filled root
- symbol YY is the expiration year
- MM is the expiration month
- DD is the expiration day
- s is the side: C/P (call/put)
- WWWWW is the whole portion of the strike price
- nnn is the decimal portion of the strike price
e.g.: "AAPL  251219C00200000" for the AAPL 200 strike for Dec 19, '25

### FOREX
Symbols in upper case, e.g.: EUR/USD,USD/JPY,AUD/CAD


## Example Express App
There will be an example Express app in this repo that wraps up everything and serves it up via http endpoint. In many cases, these will be passthroughs, but in the streaming cases, you can see how the code is invoked to start and stop streams.

## What is not yet ready
- Tests are not yet in this repo, though I've started them.
- Error handling from the returned requests is pretty basic or not there. A couple of the auth ones are caught and handled (expired access token)
- There is not yet a mechanism for automatic weekly reset of the refresh token. Schwab's intent is for this to be manual, but I'd like to offer an automatic method, likely in a standalone lib.
- Order constructor helper functions
- Types for data returned in the Account stream
- Example app