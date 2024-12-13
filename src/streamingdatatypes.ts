// Copyright (C) 2024  Aaron Satterlee

import {EAssetSubType, EAssetType, ICandle} from "./sharedTypes";
import { DoubleNumber, Int64EpochTime, Int64Number } from "./sharedTypes";

export interface ChartFuturesResponseRough extends StringIndexed {
    key: string,
    seq: number,
    "0": string, // key
    "1": Int64EpochTime, // datetime
    "2": DoubleNumber, // open
    "3": DoubleNumber, // high
    "4": DoubleNumber, // low
    "5": DoubleNumber, // close
    "6": number // volume
}

export interface ChartFuturesResponse extends StringIndexed, ICandle {
    key: string,
    symbol: string,
    seq: number,
}

export interface ChartEquityResponseRough extends StringIndexed {
    key: string,
    seq: number,
    "0": string, // key
    "1": number, // open
    "2": number, // high
    "3": number, // low
    "4": number, // close
    "5": number, // volume
    "6": number, // sequence
    "7": number, // chart datetime
    "8": number, // chart day
}

export interface ChartEquityResponse extends StringIndexed, ICandle {
    key: string,
    symbol: string,
    seq: Int64Number,
    chartDay: number,
}

export interface ChartHistoryFuturesCandleRough extends StringIndexed {
    "0": number, // datetime
    "1": number, // open
    "2": number, // high
    "3": number, // low
    "4": number, // close
    "5": number, // volume
}

export interface ChartHistoryFuturesRough extends StringIndexed {
    key: string, // futures symbol
    "0": string, // request id?
    "1": number, // no idea
    "2": number, // candle array length?
    "3": ChartHistoryFuturesCandleRough[],
}

export interface ChartHistoryFutures extends StringIndexed {
    key: string,
    requestId: string,
    prop1: number,
    count: number,
    candles: ICandle[],
}

export interface StringIndexed {
    [index: string]: any
}

export interface StreamingResponseData {
    service: string,
    content?: any,
    timestamp: number
}

export enum EXCHANGES {
    /** NASDAQ */
    NASDAQ="Q",
    NYSE="N",
    AMEX="A",
    OTCBB="U",
    PACIFIC="P",
    INDICES="0",
    AMEX_INDEX="G",
    MUTUAL_FUND="3",
    PINK_SHEET="9",
    ICE="I",
    CME="E",
    LIFFEUS="L",
    UNKNOWN="?",
    INDICATOR=":",
}

export enum TRADING_STATUS {
    NORMAL="Normal",
    HALTED="Halted",
    CLOSED="Closed",
}

export interface L1FuturesOptionsQuoteRough extends StringIndexed {
    "key": string, // symbol
    "delayed": boolean,
    "0": string, // symbol
    "1": DoubleNumber, // bid price
    "2": DoubleNumber, // ask price
    "3": DoubleNumber, // last trade price
    "4": Int64Number, // bid size
    "5": Int64Number, // ask size
    "6": EXCHANGES, // exchange with best bid
    "7": EXCHANGES, // exchange with best ask
    "8": Int64Number, // daily volume
    "9": Int64Number, // last size
    "10": Int64EpochTime, // quote time ms epoch
    "11": Int64EpochTime, // trade time ms epoch
    "12": DoubleNumber, // daily high
    "13": DoubleNumber, // daily low
    "14": DoubleNumber, // prev day close
    "15": EXCHANGES, // exchange where last trade executed
    "16": string, // description
    "17": DoubleNumber, // daily open
    "18": DoubleNumber, // open interest
    "19": DoubleNumber, // mark
    "20": DoubleNumber, // tick size, min price movement
    "21": DoubleNumber, // tick amount dollars
    "22": DoubleNumber, // multiplier
    "23": DoubleNumber, // settlement / closing price
    "24": string, // underlying symbol
    "25": DoubleNumber, // strike
    "26": Int64EpochTime, // expiration date of this contract, ms since epoch
    "27": string, // expiration style
    "28": string, // contract type (P/C?)
    "29": string, // security status
    "30": EXCHANGES, // exchange character
    "31": string, // exchange name
}

export interface L1OptionsQuoteRough extends StringIndexed {
    "key": string,
    "cusip": string,
    "assetMainType": EAssetType,
    "delayed": boolean,
    "0": string, // symbol
    "1": string, // description, company, index, fund name
    "2": DoubleNumber, // bid
    "3": DoubleNumber, // ask
    "4": DoubleNumber, // last
    "5": DoubleNumber, // daily high
    "6": DoubleNumber, // daily low
    "7": DoubleNumber, // prev day close
    "8": Int64Number, // total volume
    "9": number, // open interest
    "10": DoubleNumber, // volatility
    "11": DoubleNumber, // intrinsic value
    "12": number, // expiration year
    "13": DoubleNumber, // multiplier
    "14": number, // digits, i.e. number of decimal places
    "15": DoubleNumber, // daily open
    "16": number, // bid size
    "17": number, // ask size
    "18": number, // last size
    "19": DoubleNumber, // net change, last - prev close
    "20": DoubleNumber, // strike price
    "21": string, // contract type (standard, non-standard?)
    "22": string, // underyling
    "23": number, // expiration month (0 based?)
    "24": string, // deliverables
    "25": DoubleNumber, // time value
    "26": number, // expiration day
    "27": number, // days to expiry
    "28": DoubleNumber, // delta
    "29": DoubleNumber, // gamma
    "30": DoubleNumber, // theta
    "31": DoubleNumber, // vega
    "32": DoubleNumber, // rho
    "33": TRADING_STATUS, // trading status
    "34": DoubleNumber, // theoretical option value
    "35": DoubleNumber, // underlying price
    "36": string, // uv expiration type (american/european?)
    "37": DoubleNumber, // mark
    "38": Int64EpochTime, // last quote time
    "39": Int64EpochTime, // last trade time
    "40": EXCHANGES, // exchange character
    "41": string, // exchange name
    "42": Int64EpochTime, // last trading day
    "43": string, // char for settlement type
    "44": DoubleNumber, // net percent change
    "45": DoubleNumber, // mark price net change
    "46": DoubleNumber, // mark price percent change
    "47": DoubleNumber, // implied yield
    "48": boolean, // isPennyPilot (i.e. price can increment by pennies instead of 5 cent increments)
    "49": string, // option root
    "50": DoubleNumber, // 52 wk high
    "51": DoubleNumber, // 52 wk low
    "52": DoubleNumber, // indicative ask price (Index options only, 0 otherwise)
    "53": DoubleNumber, // indicative bid price (Index options only, 0 otherwise)
    "54": Int64EpochTime, // indicative quote time (Index options only, 0 otherwise)
    "55": string, // char for exercise type
}

export interface L1EquityQuoteRough extends StringIndexed {
    "key": string, // symbol
    "cusip": string,
    "assetMainType": EAssetType,
    "assetSubType": EAssetSubType,
    "delayed": boolean,
    "0": string, // ticker in upper case
    "1": DoubleNumber, // bid price
    "2": DoubleNumber, // ask price
    "3": DoubleNumber, // last price
    "4": number, // bid size
    "5": number, // ask size
    "6": EXCHANGES, // ask exchange id
    "7": EXCHANGES, // bid exchange id
    "8": Int64Number, // volume
    "9": Int64Number, // last size of trade
    "10": DoubleNumber, // daily high price
    "11": DoubleNumber, // daily low price
    "12": DoubleNumber, // prev day close
    "13": EXCHANGES, // primary listing exchange ID (character)
    "14": boolean, // is marginable
    "15": string, // description
    "16": EXCHANGES, // last trade exchange, type EXCHANGES
    "17": DoubleNumber, // open price
    "18": DoubleNumber, // net change
    "19": DoubleNumber, // 52 week high
    "20": DoubleNumber, // 52 week low
    "21": DoubleNumber, // P/E ratio
    "22": DoubleNumber, // annual dividend amount
    "23": DoubleNumber, // dividend yield
    "24": DoubleNumber, // NAV
    "25": string, // exchange name
    "26": string, // dividend date
    "27": boolean, // is last trade a regular quote
    "28": boolean, // is last trade a regular trade
    "29": DoubleNumber, // regular market last price
    "30": number, // regular market last size
    "31": DoubleNumber, // regular market net change, reg mkt last price - close
    "32": TRADING_STATUS, // security status, a symbol for Normal, Halted, Closed
    "33": DoubleNumber, // mark
    "34": Int64EpochTime, // last quote time
    "35": Int64EpochTime, // last trade time
    "36": Int64EpochTime, // last reg mkt trade time
    "37": Int64EpochTime, // last bid time
    "38": Int64EpochTime, // last ask time
    "39": string, // 4 char MIC (market identifier code) for Ask
    "40": string, // 4 char MIC (market identifier code) for Bid
    "41": string, // 4 char MIC (market identifier code) for Last
    "42": DoubleNumber, // net pct change = netchange / closeprice * 100
    "43": DoubleNumber, // reg mkt hours pct change
    "44": DoubleNumber, // mark price net change
    "45": DoubleNumber, // mark price pct change
    "46": number | null, // HTB (hard to borrow) quantity, -1 is null, >= 0 is valid
    "47": DoubleNumber | null, // HTB rate, null is null, -99_999_999 to + is valid
    "48": number | null, // HTB, -1 null, 1 true, 0 false
    "49": number | null, // shortable, -1 null, 1 true, 0 false
    "50": DoubleNumber, // post-market net change, Change in price since the end of the regular session (typically 4:00pm)	PostMarketLastPrice - RegularMarketLastPrice
    "51": DoubleNumber, // Post-Market Percent Change	double	Percent Change in price since the end of the regular session (typically 4:00pm)	PostMarketNetChange / RegularMarketLastPrice * 100
}

/**
 * Sample data:
 * {
          "1": 5827.25,
          "2": 5827.5,
          "3": 5827.5,
          "4": 12,
          "5": 14,
          "6": "?",
          "7": "?",
          "8": 28099,
          "9": 3,
          "10": 1728628873949,
          "11": 1728628862552,
          "12": 5837.75,
          "13": 5826.5,
          "14": 5829,
          "15": "@",
          "16": "E-mini S&P 500 Index Futures,Dec-2024,ETH",
          "17": "?",
          "18": 5831,
          "19": -1.5,
          "20": -0.0257334,
          "21": "XCME",
          "22": "Normal",
          "23": 2121938,
          "24": 5827.5,
          "25": 0.25,
          "26": 12.5,
          "27": "/ES",
          "28": "D,D",
          "29": "GLBX(de=1640;0=-17001600;1=r-17001600d-15551640;7=d-16401555)",
          "30": false,
          "31": 50,
          "32": true,
          "33": 5829,
          "34": "",
          "35": 1734670800000,
          "36": "Unknown",
          "37": 1728628873942,
          "38": 1728628873949,
          "39": true,
          "40": 1728518400000,
          "key": "/ESZ24",
          "delayed": false,
          "assetMainType": "FUTURE"
        }
 */
export interface L1FuturesQuoteRough {
    "key": string, //symbol
    "1": DoubleNumber, //bid
    "2": DoubleNumber, //ask
    "3": DoubleNumber, //last
    "4": Int64Number, //bidSize
    "5": Int64Number, //askSize
    "6": EXCHANGES, // bestAskExchange
    "7": EXCHANGES, // bestBidExchange
    "8": Int64Number, // dailyVolume
    "9": Int64Number, // lastSize
    "10": Int64EpochTime, // lastQuoteTime ms since epoch
    "11": Int64EpochTime, // lastTradeTime ms since epoch
    "12": DoubleNumber, // dailyHigh
    "13": DoubleNumber, // dailyLow
    "14": DoubleNumber, // prevDayClose
    "15": EXCHANGES, // exchangeId
    "16": string, // description of product
    "17": EXCHANGES, // lastTradeExchange
    "18": DoubleNumber, // dailyOpen
    "19": DoubleNumber, // netChange
    "20": DoubleNumber, // pctChange
    "21": string, // exchangeName
    "22": TRADING_STATUS, // symbolStatus
    "23": number, // openInterest
    "24": DoubleNumber, // mark
    "25": DoubleNumber, // tickSize
    "26": DoubleNumber, // tickDollarkAmount
    "27": string, // futuresProduct
    "28": string, // priceFormat fraction or decimal
    "29": string, // tradingHours
    "30": boolean, // isTradable
    "31": DoubleNumber, // contractMultiplier
    "32": boolean, // isContractActive
    "33": DoubleNumber, // settlementPrice
    "34": string, // activeContractSymbol
    "35": Int64EpochTime, // contractExpirationMSEpoch ms since epoch
    "36": string, // expirationStyle
    "37": Int64EpochTime, // askTime, time of the last ask-side quote
    "38": Int64EpochTime, // bidTime, time of the last bid-side quote
    "39": boolean, // quotedSession, if contract has quoted during active session
    "40": Int64EpochTime, // settlementDate
    "delayed": boolean,
    "assetMainType": EAssetType,
}

export interface L1ForexQuoteRough extends StringIndexed {
    "key": string,
    "assetMainType": EAssetType,
    "delayed": boolean,
    "0": string, // symbol
    "1": DoubleNumber, // current best bid price
    "2": DoubleNumber, // current ask
    "3": DoubleNumber, // last trade
    "4": Int64Number, // bid size
    "5": Int64Number, // ask size
    "6": Int64Number, // volume
    "7": Int64Number, // last size
    "8": Int64EpochTime, // quote time ms epoch
    "9": Int64EpochTime, // trade time ms epoch
    "10": DoubleNumber, // high price
    "11": DoubleNumber, // low price
    "12": DoubleNumber, // prev day close
    "13": EXCHANGES, // primary listing exchange
    "14": string, // description
    "15": DoubleNumber, // day's open price
    "16": DoubleNumber, // net change last - prev close
    "17": DoubleNumber, // percent change
    "18": string, // exchange name
    "19": number, // valid decimal digits
    "20": TRADING_STATUS, // trading status
    "21": DoubleNumber, // tick, min price movement
    "22": DoubleNumber, // tick amount dollars, tick*multiplier
    "23": string, // product name
    "24": string, // trading hours
    "25": boolean, // is tradable
    "26": string, // market maker
    "27": DoubleNumber, // 52wk high
    "28": DoubleNumber, // 52wk low
    "29": DoubleNumber, // mark
}

// TODO: verify 23/24 in forex since there are two 23s in the docs. is it trading hours string or product string?

export interface L1FuturesOptionsQuote extends StringIndexed {
    key: string, // "key": string, // symbol
    symbol: string,

    // contract/product info
    description: string, // "16": string, // description
    multiplier: DoubleNumber, // "22": number, // multiplier
    underlyingSymbol: string, // "24": string, // underlying symbol
    strike: DoubleNumber, // "25": number, // strike
    expirationDateMSEpoch: Int64EpochTime, // "26": number, // expiration date of this contract, ms since epoch
    tickSize: DoubleNumber, // "20": DoubleNumber // tick size, min price movement
    tickAmountDollars: DoubleNumber, // "21": DoubleNumber, // tick amount dollars
    expirationStyle: string, // "27": string, // expiration style
    contractType: string, // "28": string, // contract type (P/C?)
    securityStatus: string, // "29": string, // security status
    listingExchange: string, // 30": EXCHANGES, // exchange character
    listingExchangeName: string, // "31": string, // exchange name

    // price
    bid: DoubleNumber, // "1": number, // bid price
    ask: DoubleNumber, // "2": number, // ask price
    last: DoubleNumber, // "3": number, // last trade price
    dailyHigh: DoubleNumber, // "12": number, // daily high
    dailyLow: DoubleNumber, // "13": number, // daily low
    previousDayClose: DoubleNumber, // "14": number, // prev day close
    dailyOpen: DoubleNumber, // "17": number, // daily open
    mark: DoubleNumber, // "19": number, // ?
    settlementPrice: DoubleNumber, // "23": DoubleNumber, // settlement / closing price

    // volume
    bidSize: Int64Number, // "4": number, // bid size
    askSize: Int64Number, // "5": number, // ask size
    dailyVolume: Int64Number, // "8": number, // total volume
    lastSize: Int64Number, // "9": number, // last size
    openInterest: DoubleNumber, // "18": number, // open interest

    // exchange
    exchangeBestAsk: EXCHANGES | string, // "6": EXCHANGES, // exchange with best ask
    exchangeBestBid: EXCHANGES | string, // "7": EXCHANGES, // exchange with best bid
    lastTradedExchange: EXCHANGES, // "15": EXCHANGES, // last traded exchange

    // time
    timeLastQuote: Int64EpochTime, // "10": number, // quote time ms epoch
    timeLastTrade: Int64EpochTime, // "11": number, // trade time ms epoch
}

export interface L1OptionsQuote extends StringIndexed {
    timestamp: Int64EpochTime, // imposed by transform function

    key: string,
    cusip: string,
    assetMainType: EAssetType,
    delayed: boolean,

    // about
    symbol: string, // "0": string, // symbol
    description: string, // "1": string, // description, company, index, fund name
    multipllier: DoubleNumber, // "13": DoubleNumber, // multiplier
    digits: number, // "14": number, // digits, i.e. number of decimal places
    contractType: string, // "21": string, // contract type (standard, non-standard?)
    underlying: string, // "22": string, // underyling
    deliverables: string, // "24": string, // deliverables
    underlyingPrice: DoubleNumber, // "35": DoubleNumber, // underlying price
    expirationType: string, // "36": string, // uv expiration type (american/european?)
    settlementType: string, // "43": string, // char for settlement type
    isPennyPilot: boolean, // "48": boolean, // isPennyPilot (i.e. price can increment by pennies instead of 5 cent increments)
    optionRoot: string, // "49": string, // option root
    exerciseType: string, // "55": string, // char for exercise type

    // about this option
    expirationYear: number, // "12": number, // expiration year
    strikePrice: DoubleNumber, // "20": DoubleNumber, // strike price
    expirationMonth: number, // "23": number, // expiration month (0 based?)
    expirationDay: number, // "26": number, // expiration day
    daysToExpiry: number, // "27": number, // days to expiry
    tradingStatus: TRADING_STATUS, // "33": TRADING_STATUS, // trading status
    lastTradingDay: Int64EpochTime, // "42": Int64EpochTime, // last trading day

    // prices
    bid: DoubleNumber, // "2": DoubleNumber, // bid
    ask: DoubleNumber, // "3": DoubleNumber, // ask
    last: DoubleNumber, // "4": DoubleNumber, // last
    dailyHigh: DoubleNumber, // "5": DoubleNumber, // daily high
    dailyLow: DoubleNumber, // "6": DoubleNumber, // daily low
    previousDayClose: DoubleNumber, // "7": DoubleNumber, // prev day close
    dailyOpen: DoubleNumber, // "15": DoubleNumber, // daily open
    mark: DoubleNumber, // "37": DoubleNumber, // mark
    fiftyTwoWeekHigh: DoubleNumber, // "50": DoubleNumber, // 52 wk high
    fiftyTwoWeekLow: DoubleNumber, // "51": DoubleNumber, // 52 wk low
    indicativeAsk: DoubleNumber, // "52": DoubleNumber, // indicative ask price (Index options only, 0 otherwise)
    indicativeBid: DoubleNumber, // "53": DoubleNumber, // indicative bid price (Index options only, 0 otherwise)

    // volume info
    dailyVolume: Int64Number, // "8": Int64Number, // total volume
    openInterest: number, // "9": number, // open interest
    bidSize: number, // "16": number, // bid size
    askSize: number, // "17": number, // ask size
    lastSize: number, // "18": number, // last size

    // option data
    volatility: DoubleNumber, // "10": DoubleNumber, // volatility
    intrinsicValue: DoubleNumber, // "11": DoubleNumber, // intrinsic value
    timeValue: DoubleNumber, // "25": DoubleNumber, // time value
    delta: DoubleNumber, // "28": DoubleNumber, // delta
    gamma: DoubleNumber, // "29": DoubleNumber, // gamma
    theta: DoubleNumber, // "30": DoubleNumber, // theta
    vega: DoubleNumber, // "31": DoubleNumber, // vega
    rho: DoubleNumber, // "32": DoubleNumber, // rho
    theoreticalOptionValue: DoubleNumber, // "34": DoubleNumber, // theoretical option value
    impliedYield: DoubleNumber, // "47": DoubleNumber, // implied yield

    // computed price diffs    
    netChange: DoubleNumber, // "19": DoubleNumber, // net change, last - prev close
    netPercentChange: DoubleNumber, // "44": DoubleNumber, // net percent change
    markNetChange: DoubleNumber, // "45": DoubleNumber, // mark price net change
    markNetPercentChange: DoubleNumber, // "46": DoubleNumber, // mark price percent change

    // timestamps
    timeLastQuote: Int64EpochTime, // "38": Int64EpochTime, // last quote time
    timeLastTrade: Int64EpochTime, // "39": Int64EpochTime, // last trade time
    timeLastIndicativeQuote: Int64EpochTime, // "54": Int64EpochTime, // indicative quote time (Index options only, 0 otherwise)

   // exchange info
   exchange: EXCHANGES, // "40": EXCHANGES, // exchange character
   exchangeName: string, // "41": string, // exchange name
}

export interface L1ForexQuote extends StringIndexed {
    timestamp: number, // imposed by transform function
    key: string,
    assetMainType: EAssetType,
    delayed: boolean,
    symbol: string, // "0": string, // ticker symbol in upper case
    description: string, // "14": string, // description
    tradingStatus: TRADING_STATUS, // "20": TRADING_STATUS, // trading status
    productName: string, // "23": string, // product name
    tradingHours: string, // "24": string, // trading hours
    isTradable: boolean, // "25": boolean, // is tradable
    marketMaker: string, // "26": string, // market maker

    // price
    bid: DoubleNumber, // "1": number, // current best bid price
    ask: DoubleNumber, // "2": number, // current ask
    last: DoubleNumber, // "3": number, // last trade
    dailyHigh: DoubleNumber, // "10": number, // high price
    dailyLow: DoubleNumber, // "11": number, // low price
    previousDayClose: DoubleNumber, // "12": number, // prev day close
    dailyOpen: DoubleNumber, // "15": number, // day's open price
    mark: DoubleNumber, // "29": number, // mark
    fiftyTwoWeekHigh: DoubleNumber, // "27": number, // 52wk high
    fiftyTwoWeekLow: DoubleNumber, // "28": number, // 52wk low


    // derived from price
    netChange: DoubleNumber, // "16": number, // net change last - prev close
    percentChange: DoubleNumber, // "17": number, // percent change

    // volume
    bidSize: Int64Number, // "4": number, // bid size
    askSize: Int64Number, // "5": number, // ask size
    dailyVolume: Int64Number, // "6": number, // volume
    lastSize: Int64Number, // "7": number, // last size

    // time
    timeLastQuote: Int64EpochTime, // "8": number, // quote time ms epoch
    timeLastTrade: Int64EpochTime, // "9": number, // trade time ms epoch

    // exchange
    exchangeOfPrimaryListing: EXCHANGES, // "13": EXCHANGES, // primary listing exchange
    exchangeName: string, // "18": string, // exchange name

    // contract/product info
    validDigits: number, // "19": number, // valid decimal digits
    tickSize: DoubleNumber, // "21": number, // tick, min price movement
    tickDollarAmount: DoubleNumber, // "22": number, // tick amount, tick*multiplier
}

export interface L1EquityQuote extends StringIndexed {
    timestamp: number, // will be imposed by transform function

    key: string,
    assetMainType: EAssetType,
    assetSubType: EAssetSubType,
    cusip: string,
    delayed: boolean,
    // symbol and about info
    symbol: string, // "0": string, // symbol
    description: string, // "15": string, // description: company, index, or fund name
    peRatio: DoubleNumber, // "21": number, // PE ratio
    dividendAmountAnnual: DoubleNumber, // "22": number, // annual dividend amount
    dividendYield: DoubleNumber, // "23": number, // dividend yield
    NAV: DoubleNumber, // "24": number, // NAV - mutual fund net asset value
    dividendDate: string, // "26": string, // dividend date
    tradingStatus: TRADING_STATUS, // "32": TRADING_STATUS, // security status: Normal, Halted, Closed

    // price info
    bid: DoubleNumber, // "1": number, // bid price
    ask: DoubleNumber, // "2": number, // ask price
    last: DoubleNumber, // "3": number, // last price
    dailyHigh: DoubleNumber, // "10": number, // daily high price
    dailyLow: DoubleNumber, // "11": number, // daily low price
    previousDayClose: DoubleNumber, // "12": number, // prev day's close
    dailyOpen: DoubleNumber, // "17": number, // day open price
    fiftyTwoWeekHigh: DoubleNumber, // "19": number, // 52wk high
    fiftyTwoWeekLow: DoubleNumber, // "20": number, // 52wk low
    regularMarketLastPrice: DoubleNumber, // "29": DoubleNumber, // regular market last price
    mark: DoubleNumber, // "33": number, // mark

    // info derived from price
    netChange: DoubleNumber, // "18": number, // net change, last-prev close
    regularMarketNetchange: DoubleNumber, // "31": number, // reg market net change
    netPercentChange: DoubleNumber, // "42": DoubleNumber, // net pct change = netchange / closeprice * 100
    regularMarketHoursNetChange: DoubleNumber, // "43": DoubleNumber, // reg mkt hours pct change
    markNetChange: DoubleNumber, // "44": DoubleNumber, // mark price net change
    markPercentChange: DoubleNumber, // "45": DoubleNumber, // mark price pct change
    postMarketNetChange: DoubleNumber, // "50": DoubleNumber, // post-market net change, Change in price since the end of the regular session (typically 4:00pm)	PostMarketLastPrice - RegularMarketLastPrice
    postMarketPercentChange: DoubleNumber, // "51": DoubleNumber, // Post-Market Percent Change	double	Percent Change in price since the end of the regular session (typically 4:00pm)	PostMarketNetChange / RegularMarketLastPrice * 100

    // volume info
    bidSize: number, // "4": number, // bid size
    askSize: number, // "5": number, // ask size
    dailyVolume: Int64Number,  // "8": number, // volume
    lastSize: Int64Number, // "9": number, // last size, in 100s
    regularMarketLastSize: number, // "30": number, // regular market last size

    // exchanges
    exchangeBestAsk: EXCHANGES, // "6": EXCHANGES, // ask exchange id
    exchangeBestBid: EXCHANGES, // "7": EXCHANGES, // bid exchange id
    exchangeOfPrimaryListing: EXCHANGES, // "13": EXCHANGES, // primary listing exchange, type EXCHANGES
    exchangeLastTrade: EXCHANGES, // "16": EXCHANGES, // last id for exchange
    exchangeName: string, // "25": string, // exchange name
    micAsk: string, // "39": string, // 4 char MIC (market identifier code) for Ask
    micBid: string, // "40": string, // 4 char MIC (market identifier code) for Bid
    midLast: string, // "41": string, // 4 char MIC (market identifier code) for Last

    // trade info
    isMarginable: boolean, // "14": boolean, // marginable
    isLastQuoteFromRegularMarket: boolean, // "27": boolean, // is last quote regular market quote
    isLastTradeFromRegularMarket: boolean, // "28": boolean, // regular market trade
    htbQuantity: number | null, // "46": number | null, // HTB (hard to borrow) quantity, -1 is null, >= 0 is valid
    htbRate: DoubleNumber | null, // "47": DoubleNumber | null, // HTB rate, null is null, -99_999_999 to + is valid
    isHTB: boolean | null, // "48": number | null, // HTB, -1 null, 1 true, 0 false
    isShortable: boolean | null, // "49": number | null, // shortable, -1 null, 1 true, 0 false

    // time info
    timeLastQuote: Int64EpochTime, // "34": number, // quote time ms since epoch
    timeLastTrade: Int64EpochTime, // "35": number, // trade time ms since epoch
    timeLastRegularMktTrade: Int64EpochTime, // "36": number, // reg mkt trade time ms epoch
    timeLastBid: Int64EpochTime, // "37": Int64EpochTime, // last bid time
    timeLastAsk: Int64EpochTime, // "38": Int64EpochTime, // last ask time
}

export interface L1FuturesQuote extends StringIndexed {
    timestamp: number, // will be imposed by transform function
    // symbol and about info
    key: string, // "key": string, //symbol
    assetMainType: EAssetType,
    symbol: string, // "0"?: string, //symbol
    description: string, // "16"?: string, // description of product
    tradingStatus: TRADING_STATUS, // "22"?: TRADING_STATUS, // symbolStatus
    futuresProduct: string, // "27"?: string, // futuresProduct
    tradingHours: string, // "29"?: string, // tradingHours
    isTradable: boolean, // "30"?: boolean, // isTradable

    // price info
    bid: DoubleNumber, // "1"?: number, //bid
    ask: DoubleNumber, // "2"?: number, //ask
    last: DoubleNumber, // "3"?: number, //last
    dailyHigh: DoubleNumber, // "12"?: number, // dailyHigh
    dailyLow: DoubleNumber, // "13"?: number, // dailyLow
    previousDayClose: DoubleNumber, // "14"?: number, // prevDayClose
    dailyOpen: DoubleNumber, // "18"?: number, // dailyOpen
    mark: DoubleNumber, // "24"?: number, // mark
    settlementPrice: DoubleNumber, // "33"?: number, // settlementPrice

    // info derived from price
    netChange: DoubleNumber, // "19"?: number, // netChange
    percentChange: DoubleNumber, // "20"?: number, // pctChange
    quotedSession: boolean, // "39": boolean, // quotedSession, if contract has quoted during active session

    // volume info
    bidSize: Int64Number, // "4"?: number, //bidSize
    askSize: Int64Number, // "5"?: number, //askSize
    dailyVolume: Int64Number, // "8"?: number, // dailyVolume
    lastSize: Int64Number, // "9"?: number, // lastSize
    openInterest: number, // "23"?: number, // openInterest

    // contract info
    tickSize: DoubleNumber, // "25"?: number, // tickSize
    tickDollarAmount: DoubleNumber, // "26"?: number, // tickAmount
    priceFormat: string, // "28"?: string, // priceFormat fraction or decimal
    contractMultiplier: number, // "31"?: number, // contractMultiplier
    isContractActive: boolean, // "32"?: boolean, // isContractActive
    activeContractSymbol: string, // "34"?: string, // activeContractSymbol
    contractExpirationMSEpoch: Int64EpochTime, // "35"?: number, // contractExpirationDate ms since epoch
    expirationStyle: string, // "36": string, // expirationStyle

    // exchanges
    exchangeOfPrimaryListing: EXCHANGES, // "15"?: EXCHANGES, // exchangeId
    exchangeBestAsk: EXCHANGES, // "6"?: EXCHANGES, // bestAskExchange
    exchangeBestBid: EXCHANGES, // "7"?: EXCHANGES, // bestBidExchange
    exchangeLastTrade: EXCHANGES, // "17"?: EXCHANGES, // lastTradeExchange
    exchangeName: string, // "21"?: string, // exchangeName

    // time info
    timeLastQuote: Int64EpochTime, // "10"?: number, // lastQuoteTime ms since epoch
    timeLastTrade: Int64EpochTime, // "11"?: number, // lastTradeTime ms since epoch
    askTime: Int64EpochTime, // "37": Int64EpochTime, // askTime, time of the last ask-side quote
    bidTime: Int64EpochTime, // "38": Int64EpochTime, // bidTime, time of the last bid-side quote
    settlementDate: Int64EpochTime, // "40": Int64EpochTime, // settlementDate

    // metadata
    delayed: boolean
}

export interface TimeSaleRough extends StringIndexed {
    "key": string, // symbol
    "seq": number, // sequence
    "0": string, // symbol
    "1": number, // trade time ms since epoch
    "2": number, // last price
    "3": number, // last size
    "4": number, // last sequence
}

export interface TimeSale extends StringIndexed {
    "key": string,
    "sequence": number,
    "tradeTime": number,
    "lastPrice": number,
    "lastSize": number,
    "lastSequence": number,
}

export interface NewsHeadlineRough extends StringIndexed {
    "key": string, // symbol
    "0": string, // symbol
    "1": number, // error code, if any
    "2": number, // story datetime, ms since epoch
    "3": string, // headline id
    "4": string, // status
    "5": string, // headline
    "6": string, // story id
    "7": number, // count for keyword
    "8": string, // keyword array
    "9": boolean, // is hot
    "10": string, // char for story source
}

export interface NewsHeadline extends StringIndexed {
    timestamp: number,
    seq: number,
    key: string,
    symbol: string,
    errorCode: number,
    storyDatetime: number,
    headlineId: string,
    status: string,
    headline: string,
    storyId: string,
    keywordCount: number,
    keywords: string,
    isHot: boolean,
    storySource: string,
}

export interface AcctActivityRough extends StringIndexed {
    "1": string, // account number
    "2": string, // message type
    "3": string, // message data
    "key": string, // subscription key
    "seq": number, // sequence number
}

export interface AcctActivity extends StringIndexed {
    accountNumber: string,
    messageType: EAcctActivityMsgType,
    messageData: string | object | null, // json or string or null
    key: string, // subscription key
    sequence: number, // sequence number
}

export interface ScreenerRough extends StringIndexed {
    "0": string, // symbol/ticker
    "1": Int64EpochTime, // market snapshot timestamp
    "2": EScreenerSort, // field to sort on
    "3": EScreenerFrequency, // lookback in mins (0 = all day)
    "4": ScreenerItem[], // array of results
}

export interface ScreenerResult {
    key: string, // ScreenerRough["0"]
    symbol: string, // ScreenerRough["0"]
    timestamp: Int64EpochTime, // ScreenerRough["1"]
    sortedBy: EScreenerSort, // ScreenerRough["2"]
    frequency: EScreenerFrequency, // ScreenerRough["3"]
    items: ScreenerItem[], // ScreenerRough["4"]
}

export interface ScreenerItem {
    description: string,
    lastPrice: DoubleNumber,
    marketShare: DoubleNumber, // mkt share % of instrument, up to 2 decimal places
    netChange: DoubleNumber,
    netPercentChange: DoubleNumber,
    symbol: string,
    totalVolume: Int64Number, // for the day
    trades: Int64Number, // number of trades for the requested frequency
    volume: Int64Number, // volume for the requested frequency
}

export interface BookServiceRough {
    "0": string, // ticker
    "1": Int64EpochTime, // timestamp
    "2": PriceLevelRough[], // bid side levels
    "3": PriceLevelRough[], // ask side levels
}

export interface PriceLevelRough {
    "0": DoubleNumber, // price
    "1": number, // aggregate size
    "2": number, // market maker count at this level
    "3": MarketMakerSizeRough[], // array of market maker sizes
}

export interface MarketMakerSizeRough {
    "0": string, // market maker id
    "1": Int64Number, // size
    "2": Int64EpochTime, // quote time
}

export interface BookServiceResult {
    key: string,
    symbol: string,
    timestamp: Int64EpochTime,
    bidSideLevels: PriceLevel[],
    askSideLevels: PriceLevel[],
}

export interface PriceLevel {
    price: DoubleNumber,
    size: number,
    marketMakerCount: number,
    marketMakerSizes: MarketMakerSize[],
}

export interface MarketMakerSize {
    marketMakerId: string,
    size: Int64Number,
    quoteTime: Int64EpochTime,
}

export interface BookServiceResult {

}

export enum EAcctActivityMsgType {
    SUBSCRIBED = "SUBSCRIBED",
    ERROR = "ERROR",
    BrokenTrade = "BrokenTrade",
    ManualExecution = "ManualExecution",
    OrderActivation = "OrderActivation",
    OrderCancelReplaceRequest = "OrderCancelReplaceRequest",
    OrderCancelRequest = "OrderCancelRequest",
    OrderEntryRequest = "OrderEntryRequest",
    OrderFill = "OrderFill",
    OrderPartialFill = "OrderPartialFill",
    OrderRejection = "OrderRejection",
    TooLateToCancel = "TooLateToCancel",
    UROUT = "UROUT",
}

export enum EServices {
    ADMIN = "ADMIN",
    ACCT_ACTIVITY = "ACCT_ACTIVITY",

    LEVELONE_EQUITIES = "LEVELONE_EQUITIES",
    LEVELONE_OPTIONS = "LEVELONE_OPTIONS",
    LEVELONE_FUTURES = "LEVELONE_FUTURES",
    LEVELONE_FUTURES_OPTIONS = "LEVELONE_FUTURES_OPTIONS",
    LEVELONE_FOREX = "LEVELONE_FOREX",

    NYSE_BOOK = "NYSE_BOOK",
    NASDAQ_BOOK = "NASDAQ_BOOK",
    OPTIONS_BOOK = "OPTIONS_BOOK",

    CHART_EQUITY = "CHART_EQUITY",
    CHART_FUTURES = "CHART_FUTURES",
    
    SCREENER_EQUITY = "SCREENER_EQUITY",
    SCREENER_OPTION = "SCREENER_OPTION",
}

export enum EChartHistoryFuturesFrequency {
    MINUTE_ONE="m1",
    MINUTE_FIVE="m5",
    MINUTE_TEN="m10",
    MINUTE_THIRTY="m30",
    HOUR_ONE="h1",
    DAY_ONE="d1",
    WEEK_ONE="w1",
    MONTH_ONE="n1",
}

export enum EResponseCodes {
    ACCT_ACTIVITY="ACCT_ACTIVITY",
    ADMIN="ADMIN",
    ACTIVES_NASDAQ="ACTIVES_NASDAQ",
    ACTIVES_NYSE="ACTIVES_NYSE",
    ACTIVES_OTCBB="ACTIVES_OTCBB",
    ACTIVES_OPTIONS="ACTIVES_OPTIONS",
}

export enum ECommands {
    LOGIN="LOGIN",
    LOGOUT="LOGOUT",
    SUBS="SUBS",
    UNSUBS="UNSUBS",
    ADD="ADD",
    VIEW="VIEW",
}

export interface IStreamNotify {
    heartbeat: string, // timestamp as string
}

export interface IStreamResponse {
    command: ECommands,
    content: any,
    requestId: string,
    service: EServices,
    timestamp: number,
}

export interface ILoginLogoutResponse {
    code: EAllResponseCodes,
    // streamer server id, or "SUCCESS" for logout
    msg: string,
}

export enum EAllResponseCodes {
    SUCCESS = 0,
    LOGIN_DENIED = 3,
    UNKNOWN_FAILURE = 9,
    SERVICE_NOT_AVAILABLE = 11,
    CLOSE_CONNECTION = 12,
    REACHED_SYMBOL_LIMIT = 19,
    STREAM_CONN_NOT_FOUND = 20,
    BAD_COMMAND_FORMAT = 21,
    FAILED_COMMAND_SUBS = 22,
    FAILED_COMMAND_UNSUBS = 23,
    FAILED_COMMAND_ADD = 24,
    FAILED_COMMAND_VIEW = 25,
    SUCCEEDED_COMMAND_SUBS = 26,
    SUCCEEDED_COMMAND_UNSUBS = 27,
    SUCCEEDED_COMMAND_ADD = 28,
    SUCCEEDED_COMMAND_VIEW = 29,
    STOP_STREAMING = 30,
}

export interface IResponseObject {
    response?: IStreamResponse[],
    notify?: IStreamNotify[],
    data?: any[],
    snapshot?: any[],
}

export enum EFuturesExpiryMonths {
    F = "January",
    G = "February",
    H = "March",
    J = "April",
    K = "May",
    M = "June",
    N = "July",
    Q = "August",
    U = "September",
    V = "October",
    X = "November",
    Z = "December",
    January = "F",
    February = "G",
    March = "H",
    April = "J",
    May = "K",
    June = "M",
    July = "N",
    August = "Q",
    September = "U",
    October = "V",
    November = "X",
    December = "Z",
}

export enum SchwabStreamEventTypes {
    HEARTBEAT = "heartbeat",
    RESPONSE = "reponse",
    DATA = "data",
    SNAPSHOT = "snapshot",
    STREAM_CLOSED = "streamClosed",
    service_RAW = "donotuse",
    service_RAW_normalized = "donotuse",
    service_TYPED = "donotuse",
    service_TYPED_normalizedsymbol = "donotuse",
}

export enum EScreenerSort {
    VOLUME = "VOLUME",
    TRADES = "TRADES",
    PERCENT_CHANGE_UP = "PERCENT_CHANGE_UP",
    PERCENT_CHANGE_DOWN = "PERCENT_CHANGE_DOWN",
    AVERAGE_PERCENT_VOLUME = "AVERAGE_PERCENT_VOLUME",
}

export enum EScreenerFrequency {
    ALL_DAY = 0,
    ONE_MIN = 1,
    FIVE_MIN = 5,
    TEN_MIN = 10,
    THIRTY_MIN = 30,
    SIXTY_MIN = 60,
}

export enum EScreenerPrefix {
    INDEX_COMPX = "$COMPX",
    INDEX_DJI = "$DJI",
    INDEX_SPX = "$SPX",
    INDEX_ALL = "INDEX_ALL",
    EXCHANGE_NYSE = "NYSE",
    EXCHANGE_NASDAQ = "NASDAQ",
    EXCHANGE_OTCBB = "OTCBB",
    EXCHANGE_EQUITY_ALL = "EQUITY_ALL",
    OPTION_PUT = "OPTION_PUT",
    OPTION_CALL = "OPTION_CALL",
    OPTION_ALL = "OPTION_ALL",
}

export const EBookServiceToEService: Record<string, EServices> = {
    "NYSE_BOOK": EServices.NYSE_BOOK,
    "NASDAQ_BOOK": EServices.NASDAQ_BOOK,
    "OPTIONS_BOOK": EServices.OPTIONS_BOOK,
}

export enum EBookService {
    NYSE_BOOK = EServices.NYSE_BOOK,
    NASDAQ_BOOK = EServices.NASDAQ_BOOK,
    OPTIONS_BOOK = EServices.OPTIONS_BOOK,
}
