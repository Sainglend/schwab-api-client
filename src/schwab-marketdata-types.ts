// Copyright (C) 2024  Aaron Satterlee

import { EAssetType, ICandle, IOptionDeliverable } from "./sharedTypes";
import { DateString, DateStringSimple, DoubleNumber, EContractTypeChar, EExerciseTypeChar, EExpirationTypeChar, ESettlementTypeChar, Int32Number, Int64EpochTime, Int64Number } from "./sharedTypes";

// MARKETHOURS TYPES START

export enum EMarkets {
    EQUITY = "equity",
    OPTION = "option",
    FUTURE = "future",
    BOND = "bond",
    FOREX = "forex"
}

export enum EMarketType {
    BOND = "BOND",
    EQUITY = "EQUITY",
    ETF = "ETF",
    EXTENDED = "EXTENDED",
    FOREX = "FOREX",
    FUTURE = "FUTURE",
    FUTURE_OPTION = "FUTURE_OPTION",
    FUNDAMENTAL = "FUNDAMENTAL",
    INDEX = "INDEX",
    INDICATOR = "INDICATOR",
    MUTUAL_FUND = "MUTUAL_FUND",
    OPTION = "OPTION",
    UNKNOWN = "UNKNOWN"
}

export interface IMarketSession {
    start: DateString;
    end: DateString;
}

export interface IMarketHours {
    date: string;
    marketType: EMarketType;
    exchange: string;
    category: string;
    product: string;
    productName: string;
    isOpen: boolean;
    /** Indexed by market segment: preMarket, regularMarket, postMarket */
    sessionHours: { [index: string]: IMarketSession; };
}

/** Indexed by an abbreviation of market type (unmapped abbreviations of EMarketType) */
export interface IProductMarketHours {
    [index: string]: IMarketHours;
}

/** Indexed by market, which is EMarkets */
export interface IMarketMarketHours {
    [index: string]: IProductMarketHours;
}

// MARKETHOURS TYPES STOP

// MOVERS TYPES START

export enum EIndex {
    COMPX = "$COMPX",
    DJI = "$DJI",
    SPX = "$SPX",
    NYSE = "NYSE",
    NASDAQ = "NASDAQ",
    OTCBB = "OTCBB",
    INDEX_ALL = "INDEX_ALL",
    EQUITY_ALL = "EQUITY_ALL",
    OPTION_ALL = "OPTION_ALL",
    OPTION_PUT = "OPTION_PUT",
    OPTION_CALL = "OPTION_CALL"
}

export enum EMoversSort {
    VOLUME = "VOLUME",
    TRADES = "TRADES",
    PERCENT_CHANGE_UP = "PERCENT_CHANGE_UP",
    PERCENT_CHANGE_DOWN = "PERCENT_CHANGE_DOWN"
}

export enum EDirection {
    UP = "up",
    DOWN = "down"
}

export enum EChange {
    PERCENT = "percent",
    VALUE = "value"
}

export enum EMoversFrequency {
    ZERO = 0,
    ONE = 1,
    FIVE = 5,
    TEN = 10,
    THIRTY = 30,
    SIXTY = 60
}

export interface IMover {
    change: DoubleNumber;
    description: string;
    direction: EDirection | string;
    last: DoubleNumber;
    symbol: string;
    totalVolume: Int64Number;
}

// MOVERS TYPES STOP

// OPTIONCHAINS TYPES START

/**
 * Defines what range of strikes to return as results
 * @default ALL
 */
export enum ERange {
    /** DEFAULT */
    ALL = "ALL",
    /** In-the-money strikes */
    ITM = "ITM",
    /** Near-the-money strikes */
    NTM = "NTM",
    /** Out-of-the-money strikes */
    OTM = "OTM",
    /** Strikes Above Market */
    SAK = "SAK",
    /** Strikes Below Market */
    SBK = "SBK",
    /** Strikes Near Market */
    SNK = "SNK"
}

/**
 * @default SINGLE
 */
export enum EStrategy {
    /** DEFAULT */
    SINGLE = "SINGLE",
    /** allows use of the volatility, underlyingPrice, interestRate, and daysToExpiration params to calculate theoretical values */
    ANALYTICAL = "ANALYTICAL",
    COVERED = "COVERED",
    VERTICAL = "VERTICAL",
    CALENDAR = "CALENDAR",
    STRANGLE = "STRANGLE",
    STRADDLE = "STRADDLE",
    BUTTERFLY = "BUTTERFLY",
    CONDOR = "CONDOR",
    DIAGONAL = "DIAGONAL",
    COLLAR = "COLLAR",
    ROLL = "ROLL"
}

/**
 * @default ALL
 */
export enum EContractType {
    /** DEFAULT */
    ALL = "ALL",
    CALL = "CALL",
    PUT = "PUT"
}

/**
 * @default ALL
 */
export enum EExpirationMonth {
    /** DEFAULT */
    ALL = "ALL",
    JAN = "JAN",
    FEB = "FEB",
    MAR = "MAR",
    APR = "APR",
    MAY = "MAY",
    JUN = "JUN",
    JUL = "JUL",
    AUG = "AUG",
    SEP = "SEP",
    OCT = "OCT",
    NOV = "NOV",
    DEC = "DEC"
}

/**
 * @default ALL
 */
export enum EOptionType {
    /** DEFAULT */
    ALL = "ALL",
    /** Standard contracts */
    STANDARD = "S",
    /** Non-standard contracts */
    NONSTANDARD = "NS"
}

export type TOptionChain = {
    symbol: string;
    status: string;
    underlying: TUnderlying;
    strategy: EStrategy;
    interval: DoubleNumber;
    isDelayed: boolean;
    isIndex: boolean;
    daysToExpiration: DoubleNumber;
    interestRate: DoubleNumber;
    underlyingPrice: DoubleNumber;
    volatility: DoubleNumber;
    /** A map from expiration date to an object that contains contracts */
    callExpDateMap: Record<string, TOptionContractMap>;
    /** A map from expiration date to an object that contains contracts */
    putExpDateMap: Record<string, TOptionContractMap>;
};

/** A map from strike price to option contract */
export type TOptionContractMap = Record<string, TOptionContract>;
export type TOptionContract = {
    putCall: "PUT" | "CALL";
    symbol: string;
    description: string;
    exchangeName: EExchangeName;
    bidPrice: DoubleNumber;
    askPrice: DoubleNumber;
    lastPrice: DoubleNumber;
    markPrice: DoubleNumber;
    bidSize: Int32Number;
    askSize: Int32Number;
    lastSize: Int32Number;
    highPrice: DoubleNumber;
    lowPrice: DoubleNumber;
    openPrice: DoubleNumber;
    closePrice: DoubleNumber;
    totalVolume: Int32Number;
    tradeDate: number;
    tradeTimeInLong: Int64EpochTime;
    quoteTimeInLong: Int64EpochTime;
    netChange: DoubleNumber;
    volatility: DoubleNumber;
    delta: DoubleNumber;
    gamma: DoubleNumber;
    theta: DoubleNumber;
    vega: DoubleNumber;
    rho: DoubleNumber;
    openInterest: DoubleNumber;
    timeValue: DoubleNumber;
    isInTheMoney: boolean;
    theoreticalOptionValue: DoubleNumber;
    theoreticalVolatility: DoubleNumber;
    isMini: boolean;
    isNonStandard: boolean;

    optionDeliverablesList: IOptionDeliverable[];
    expirationType: any;
    settlementType: string;

    strikePrice: DoubleNumber;
    expirationDate: string; // TODO: TYPE this better
    daysToExpiration: Int32Number;
    lastTradingDay: Int64EpochTime;
    multiplier: DoubleNumber;
    deliverableNote: string;
    isIndexOption: boolean;
    percentChange: DoubleNumber;
    markChange: DoubleNumber;
    markPercentChange: DoubleNumber;
    intrinsicValue: DoubleNumber;
    isPennyPilot: boolean;
    optionRoot: string;
};

export type TUnderlying = {
    ask: DoubleNumber;
    askSize: Int32Number;
    bid: DoubleNumber;
    bidSize: Int32Number;
    change: DoubleNumber;
    close: DoubleNumber;
    delayed: boolean;
    description: string;
    exchangeName: EExchangeName;
    fiftyTwoWeekHigh: DoubleNumber;
    fiftyTwoWeekLow: DoubleNumber;
    highPrice: DoubleNumber;
    last: DoubleNumber;
    lowPrice: DoubleNumber;
    mark: DoubleNumber;
    markChange: DoubleNumber;
    markPercentChange: DoubleNumber;
    openPrice: DoubleNumber;
    percentChange: DoubleNumber;
    quoteTime: Int64EpochTime;
    symbol: string;
    totalValue: Int64Number;
    tradeTime: Int64EpochTime;
};

enum EExchangeName {
    IND = "IND",
    ASE = "ASE",
    NYS = "NYS",
    NAS = "NAS",
    NAP = "NAP",
    PAC = "PAC",
    OPR = "OPR",
    BATS = "BATS"
}

export interface IOptionMonthlyStrategyListItem {
    month: string;
    year: number;
    day: number;
    daysToExp: number;
    secondaryMonth: string;
    secondaryYear: number;
    secondaryDay: number;
    secondaryDaysToExp: number;
    type: "C" | "P";
    secondaryType: "C" | "P";
    optionStrategyList: IOptionStrategyListItem[];
}

export interface IOptionStrategyListItem {
    primaryLeg: IOptionStrategyOption;
    secondaryLeg: IOptionStrategyOption;
    strategyStrike: string;
    strategyBid: number;
    strategyAsk: number;
}

export interface IOptionStrategyOption {
    symbol: string;
    putCallInd: "C" | "P";
    description: string;
    bid: number;
    ask: number;
    range: ERange;
    strikePrice: number;
    totalVolume: number;
}

export interface IOptionStrike {
    [index: string]: IOption[];
}

export interface IOption {
    putCall: "PUT" | "CALL";
    symbol: string;
    description: string;
    exchangeName: string;
    bid: number;
    ask: number;
    last: number;
    mark: number;
    bidSize: number;
    askSize: number;
    bidAskSize: string;
    lastSize: number;
    highPrice: number;
    lowPrice: number;
    openPrice: number;
    closePrice: number;
    totalVolume: number;
    tradeDate: any;
    tradeTimeInLong: number;
    quoteTimeInLong: number;
    netChange: number;
    volatility: number;
    delta: number;
    gamma: number;
    theta: number;
    vega: number;
    rho: number;
    openInterest: number;
    timeValue: number;
    isInTheMoney: boolean;
    theoreticalOptionValue: number;
    theoreticalVolatility: number;
    optionDeliverablesList: IOptionDeliverable[];
    strikePrice: number;
    expirationDate: number;
    daysToExpiration: number;
    expirationType: string;
    lastTradingDay: number;
    multiplier: number;
    settlementType: string;
    deliverableNote: string;
    isIndexOption: boolean;
    percentChange: number;
    markChange: number;
    markPercentChange: number;
    intrinsicValue: number;
    pennyPilot: boolean;
    nonStandard: boolean;
    inTheMoney: boolean;
    mini: boolean;
}

export enum EOptionsExchange {
    IND = "IND",
    ASE = "ASE",
    NYS = "NYS",
    NAS = "NAS",
    NAP = "NAP",
    PAC = "PAC",
    OPR = "OPR",
    BATS = "BATS"
}


export enum EOptionEntitlement {
    /** PayingPro */
    PP = "PP",
    /** NonPro */
    NP = "NP",
    /** NonPayingPro */
    PN = "PN"
}

export type TExpirationChain = {
    status: string;
    expirationList: TExpiration[];
};

export type TExpiration = {
    daysToExpiration: Int32Number;
    // TODO: Which is correct, expiration or expirationDate?
    expiration: string;
    expirationDate: DateStringSimple;
    expirationType: EExpirationTypeChar;
    standard: boolean;
    settlementType: ESettlementTypeChar;
    optionRoots: string;
};

export enum EAssetMainType {
    BOND = "BOND",
    EQUITY = "EQUITY",
    FOREX = "FOREX",
    FUTURE = "FUTURE",
    FUTURE_OPTION = "FUTURE_OPTION",
    INDEX = "INDEX",
    MUTUAL_FUND = "MUTUAL_FUND",
    OPTION = "OPTION"
}

export enum EEquityAssetSubType {
    COE = "COE",
    PRF = "PRF",
    ADR = "ADR",
    GDR = "GDR",
    CEF = "CEF",
    ETF = "ETF",
    ETN = "ETN",
    UIT = "UIT",
    WAR = "WAR",
    RGT = "RGT",
    NONE = ""
}

export enum EQuoteType {
    /** realtime */
    NBBO = "NBBO",
    /** Non-fee liable quote */
    NFL = "NFL",
    NONE = ""
}
type TExtendedMarket = {
    askPrice: number;
    askSize: number;
    bidPrice: number;
    bidSize: number;
    lastPrice: number;
    lastSize: number;
    mark: number;
    /** Extended market quote time in milliseconds since Epoch; int64 */
    quoteTime: Int64EpochTime;
    /** Total volume; int64 */
    totalVolume: string;
    /** Extended market trade time in milliseconds since Epoch; int64 */
    tradeTime: Int64EpochTime;
};
type TRegularMarket = {
    regularMarketLastPrice: number;
    regularMarketLastSize: number;
    regularMarketNetChange: number;
    regularMarketPercentChange: number;
    /** Regular market trade time in milliseconds since Epoch; int64 */
    regularMarketTradeTime: Int64EpochTime;
};
type TFundamental = {
    avg10DaysVolume: number;
    avg1YearVolume: number;
    declarationDate: DateString;
    divAmount: number;
    divExDate: DateString;
    divFreq?: EDivFreq;
    divPayAmount: number;
    divPayDate: DateString;
    divYield: number;
    eps: number;
    fundLeverageFactor: number;
    fundStrategy?: EFundStrategy;
    nextDivExDate: DateString;
    nextDivPayDate: DateString;
    peRation: number;
};
enum EDivFreq {
    /** once a year or annually */
    ONE = 1,
    /** 2x a year or semi-annualLy */
    TWO = 2,
    /** 3x a year (ex. ARCO, EBRPF) */
    THREE = 3,
    /** 4x a year or quarterly */
    FOUR = 4,
    /** 6x per yr or every other month */
    SIX = 6,
    /** 11x a year (ex. FBND, FCOR) */
    ELEVEN = 11,
    /** 12x a year or monthly */
    TWELVE = 12,
    NONE = ""
}
enum EFundStrategy {
    /** ACTIVE */
    A = "A",
    /** LEVERAGED */
    L = "L",
    /** PASSIVE */
    P = "P",
    /** QUANTITATIVE */
    Q = "Q",
    /** SHORT */
    S = "S",
    NONE = ""
}
type TReferenceEquity = {
    cusip: string;
    description: string;
    exchange: string;
    exchangeName: string;
    /** max length 50 */
    fsiDesc: string;
    htbQuantity: number;
    htbRate: number;
    isHardToBorrow: boolean;
    isShortable: boolean;
    /** max length 10 */
    otcMarketTier: string;
};
type TQuoteEquity = {
    p52WeekHigh: DoubleNumber; // TODO: needs conversion from 52WeekHigh
    p52WeekLow: DoubleNumber; // TODO: needs conversion from 52WeekLow
    askMICId: string;
    askPrice: DoubleNumber;
    askSize: Int32Number;
    askTime: Int64EpochTime;
    bidMICId: string;
    bidPrice: DoubleNumber;
    bidSize: Int32Number;
    bidTime: Int64EpochTime;
    closePrice: DoubleNumber;
    highPrice: DoubleNumber;
    lastMICId: string;
    lastPrice: DoubleNumber;
    lastSize: Int32Number;
    lowPrice: DoubleNumber;
    mark: DoubleNumber;
    markChange: DoubleNumber;
    markPercentChange: DoubleNumber;
    netChange: DoubleNumber;
    netPercentChange: DoubleNumber;
    openPrice: DoubleNumber;
    quoteTime: Int64EpochTime;
    securityStatus: string;
    totalVolume: Int64Number;
    tradeTime: Int64EpochTime;
    volatility: DoubleNumber;
};

export type TEquityResponse = {
    /** Instrument's asset type */
    assetMainType: EAssetMainType.EQUITY;
    /** Asset Sub Type (only there if applicable) */
    assetSubType?: EEquityAssetSubType;
    /** SSID of instrument; actual type is int64 */
    ssid: string;
    symbol: string;
    realtime: boolean;
    quoteType: EQuoteType;
    extended: TExtendedMarket;
    fundamental: TFundamental;
    quote: TQuoteEquity;
    reference: TReferenceEquity;
    regular: TRegularMarket;
};

export type TOptionResponse = {
    /** Instrument's asset type */
    assetMainType: EAssetMainType.OPTION;
    /** SSID of instrument; actual type is int64 */
    ssid: string;
    symbol: string;
    realtime: boolean;
    quote: TQuoteOption;
    reference: TReferenceOption;
};
type TQuoteOption = {
    p52WeekHigh: DoubleNumber; // TODO: needs conversion from 52WeekHigh
    p52WeekLow: DoubleNumber; // TODO: needs conversion from 52WeekLow
    askPrice: DoubleNumber;
    askSize: Int32Number;
    bidPrice: DoubleNumber;
    bidSize: Int32Number;
    closePrice: DoubleNumber;
    /** example: -0.0407 */
    delta: DoubleNumber;
    gamma: DoubleNumber;
    highPrice: DoubleNumber;
    /** Indicative Ask Price applicable only for Indicative Option Symbols */
    indAskPrice: DoubleNumber;
    /** Indicative Bid Price applicable only for Indicative Option Symbols */
    indBidPrice: DoubleNumber;
    /** Indicative Quote Time in milliseconds since Epoch applicable only for Indicative Option Symbols */
    indQuoteTime: Int64EpochTime;
    impliedYield: DoubleNumber;
    lastPrice: DoubleNumber;
    lastSize: Int32Number;
    lowPrice: DoubleNumber;
    mark: DoubleNumber;
    markChange: DoubleNumber;
    markPercentChange: DoubleNumber;
    moneyIntrinsicValue: DoubleNumber;
    netChange: DoubleNumber;
    netPercentChange: DoubleNumber;
    openInterest: DoubleNumber;
    openPrice: DoubleNumber;
    quoteTime: Int64EpochTime;
    rho: DoubleNumber;
    securityStatus: string;
    theoreticalOptionValue: DoubleNumber;
    theta: DoubleNumber;
    timeValue: DoubleNumber;
    totalVolume: Int64Number;
    tradeTime: Int64EpochTime;
    underlyingPrice: DoubleNumber;
    vega: DoubleNumber;
    volatility: DoubleNumber;
};
type TReferenceOption = {
    contractType: EContractTypeChar;
    cusip: string;
    daysToExpiration: Int32Number;
    /** examples: "$6024.37 cash in lieu of shares", "212 shares of AZN" */
    deliverables: string;
    description: string;
    exchange: string;
    exchangeName: string;
    exerciseType: EExerciseTypeChar;
    /** example: 20, min: 1, max: 31 */
    expirationDay: Int32Number;
    /** example: 8, min: 1, max: 12 */
    expirationMonth: Int32Number;
    expirationType: EExpirationTypeChar;
    expirationYear: Int32Number;
    /** Is this contract part of the Penny Pilot program */
    isPennyPilot: boolean;
    /** example: 1629504000000 milliseconds since epoch */
    lastTradingDay: Int64EpochTime;
    multiplier: DoubleNumber;
    settlementType: ESettlementTypeChar;
    strikePrice: DoubleNumber;
    underlying: string;
};

export type TFutureOptionResponse = {
    /** Instrument's asset type */
    assetMainType: EAssetMainType.FUTURE_OPTION;
    /** SSID of instrument; actual type is int64 */
    ssid: string;
    symbol: string;
    realtime: boolean;
    quote: TQuoteFutureOption;
    reference: TReferenceFutureOption;
};
type TQuoteFutureOption = {
    askMICId: string;
    askPrice: DoubleNumber;
    askSize: Int32Number;
    bidMICId: string;
    bidPrice: DoubleNumber;
    bidSize: Int32Number;
    closePrice: DoubleNumber;
    highPrice: DoubleNumber;
    lastMICId: string;
    lastPrice: DoubleNumber;
    lastSize: Int32Number;
    lowPrice: DoubleNumber;
    mark: DoubleNumber;
    markChange: DoubleNumber;
    netChange: DoubleNumber;
    netPercentChange: DoubleNumber;
    openInterest: DoubleNumber;
    openPrice: DoubleNumber;
    quoteTime: Int64EpochTime;
    securityStatus: string;
    settlementPrice: DoubleNumber;
    tick: DoubleNumber;
    tickAmount: DoubleNumber;
    totalVolume: Int64Number;
    tradeTime: Int64EpochTime;
};
type TReferenceFutureOption = {
    contractType: EContractTypeChar;
    description: string;
    exchange: string;
    exchangeName: string;
    multiplier: DoubleNumber;
    expirationDate: Int64EpochTime;
    expirationStyle: string;
    strikePrice: DoubleNumber;
    underlying: string;
};

export type TForexResponse = {
    assetMainType: EAssetMainType.FOREX;
    ssid: string;
    symbol: string;
    realtime: boolean;
    quote: TQuoteForex;
    reference: TReferenceForex;
};
type TReferenceForex = {
    description: string;
    exchange: string;
    exchangeName: string;
    isTradable: boolean;
    marketMaker: string;
    product: string;
    tradingHours: string;
};
type TQuoteForex = {
    p52WeekHigh: DoubleNumber; // TODO: needs conversion from 52WeekHigh
    p52WeekLow: DoubleNumber; // TODO: needs conversion from 52WeekLow
    askPrice: DoubleNumber;
    askSize: Int32Number;
    bidPrice: DoubleNumber;
    bidSize: Int32Number;
    closePrice: DoubleNumber;
    highPrice: DoubleNumber;
    lastPrice: DoubleNumber;
    lastSize: Int32Number;
    lowPrice: DoubleNumber;
    mark: DoubleNumber;
    netChange: DoubleNumber;
    netPercentChange: DoubleNumber;
    openPrice: DoubleNumber;
    quoteTime: Int64EpochTime;
    securityStatus: string;
    /** Tick Price */
    tick: DoubleNumber;
    /** Tick Amount */
    tickAmount: DoubleNumber;
    totalVolume: Int64Number;
    tradeTime: Int64EpochTime;
};

export type TFutureResponse = {
    assetMainType: EAssetMainType.FUTURE;
    ssid: string;
    symbol: string;
    realtime: boolean;
    quote: TQuoteFuture;
    reference: TReferenceFuture;
};
type TReferenceFuture = {
    description: string;
    exchange: string;
    exchangeName: string;
    /** example: /ESM25 */
    futureActiveSymbol: string;
    futureExpirationDate: Int64EpochTime;
    futureIsActive: boolean;
    futureMultiplier: DoubleNumber;
    /** example: "D,D" */
    futurePriceFormat: string;
    futureSettlementPrice: DoubleNumber;
    /** example: GLBX(de=1640;0=-1700151515301600;1=r-17001515r15301600d-15551640;7=d-16401555) */
    futureTradingHours: string;
    product: string;
};
type TQuoteFuture = {
    askMICId: string;
    askPrice: DoubleNumber;
    askSize: Int32Number;
    askTime: Int64EpochTime;
    bidMICId: string;
    bidPrice: DoubleNumber;
    bidSize: Int32Number;
    bidTime: Int64EpochTime;
    closePrice: DoubleNumber;
    futurePercentChange: DoubleNumber;
    highPrice: DoubleNumber;
    lastMICId: string;
    lastPrice: DoubleNumber;
    lastSize: Int32Number;
    lowPrice: DoubleNumber;
    mark: DoubleNumber;
    markChange: DoubleNumber;
    netChange: DoubleNumber;
    openInterest: Int32Number;
    openPrice: DoubleNumber;
    quoteTime: Int64EpochTime;
    /** Quoted during trading session */
    quotedInSession: boolean;
    securityStatus: string;
    /** milliseconds since epoch */
    settleTime: Int64EpochTime;
    /** Tick Price, e.g. 0.25 */
    tick: DoubleNumber;
    /** Tick Amount, e.g. 12.5 */
    tickAmount: DoubleNumber;
    totalVolume: Int64Number;
    tradeTime: Int64EpochTime;
};

export type TQuoteError = {
    invalidCusips: string[];
    invalidSSIDs: Int64Number[];
    invalidSymbols: string[];
};
type TReferenceIndex = {
    description: string;
    exchange: string;
    exchangeName: string;
};
type TQuoteIndex = {
    p52WeekHigh: DoubleNumber; // TODO: needs conversion from 52WeekHigh
    p52WeekLow: DoubleNumber; // TODO: needs conversion from 52WeekLow
    closePrice: DoubleNumber;
    highPrice: DoubleNumber;
    lastPrice: DoubleNumber;
    lowPrice: DoubleNumber;
    netChange: DoubleNumber;
    netPercentChange: DoubleNumber;
    openPrice: DoubleNumber;
    securityStatus: string;
    totalVolume: Int64Number;
    tradeTime: Int64EpochTime;
};

export type TIndexResponse = {
    /** Instrument's asset type */
    assetMainType: EAssetMainType.INDEX;
    /** Asset Sub Type (only there if applicable) */
    ssid: string;
    symbol: string;
    realtime: boolean;
    quote: TQuoteIndex;
    reference: TReferenceIndex;
};
type TReferenceMutualFund = {
    cusip: string;
    description: string;
    exchange: string;
    exchangeName: string;
};
type TQuoteMutualFund = {
    p52WeekHigh: DoubleNumber; // TODO: needs conversion from 52WeekHigh
    p52WeekLow: DoubleNumber; // TODO: needs conversion from 52WeekLow
    closePrice: DoubleNumber;
    nAV: DoubleNumber;
    netChange: DoubleNumber;
    netPercentChange: DoubleNumber;
    securityStatus: string;
    totalVolume: Int64Number;
    tradeTime: Int64EpochTime;
};

export type TMutualFundResponse = {
    /** Instrument's asset type */
    assetMainType: EAssetMainType.MUTUAL_FUND;
    /** Asset Sub Type (only there if applicable) */
    assetSubType: EMutualFundAssetSubType;
    ssid: string;
    symbol: string;
    realtime: boolean;
    fundamental: TFundamental;
    quote: TQuoteMutualFund;
    reference: TReferenceMutualFund;
};
enum EMutualFundAssetSubType {
    OEF = "OEF",
    CEF = "CEF",
    MMF = "MMF",
    NONE = ""
}

/**
 * The type IQuoteResult is indexed with the quoted symbol
 * @example
 * quoteResult["MSFT"]
 */
export type TQuoteResponse = Record<string, TQuoteResponseObject>;
export type TQuoteResponseObject = TEquityResponse | TOptionResponse | TForexResponse | TFutureResponse | TFutureOptionResponse | TIndexResponse | TMutualFundResponse | TQuoteError;

// QUOTES TYPES STOP


// INSTRUMENTS TYPES START

export enum EProjectionType {
    // Retrieve instrument data of a specific symbol or cusip
    SYMBOL_SEARCH = "symbol-search",
    // Retrieve instrument data for all symbols matching regex. Example: symbol=XYZ.* will return all symbols beginning with XYZ
    SYMBOL_REGEX = "symbol-regex",
    // Retrieve instrument data for instruments whose description contains the word supplied. Example: symbol=FakeCompany will return all instruments with FakeCompany in the description.
    DESC_SEARCH = "desc-search",
    // Search description with full regex support. Example: symbol=XYZ.[A-C] returns all instruments whose descriptions contain a word beginning with XYZ followed by a character A through C.
    DESC_REGEX = "desc-regex",
    // vanilla search
    SEARCH = "search",
    // Returns fundamental data for a single instrument specified by exact symbol.'
    FUNDAMENTAL = "fundamental"
}

export interface ISearchInstrumentResult {
    assetType: EAssetType;
    cusip: string;
    symbol: string;
    description: string;
    exchange: string;
    fundamental?: IFundamental;
    bondPrice?: number;
}

export interface IFundamental {
    high52: number; // double
    low52: number; // double
    dividendAmount: number; // double
    dividendYield: number; // double
    dividendDate: string;
    peRatio: number; // double
    pegRatio: number; // double
    pbRatio: number; // double
    prRatio: number; // double
    pcfRatio: number; // double
    grossMarginTTM: number; // double
    grossMarginMRQ: number; // double
    netProfitMarginTTM: number; // double
    netProfitMarginMRQ: number; // double
    operatingMarginTTM: number; // double
    operatingMarginMRQ: number; // double
    returnOnEquity: number; // double
    returnOnAssets: number; // double
    returnOnInvestment: number; // double
    quickRatio: number; // double
    currentRatio: number; // double
    interestCoverage: number; // double
    totalDebtToCapital: number; // double
    ltDebtToEquity: number; // double
    totalDebtToEquity: number; // double
    epsTTM: number; // double
    epsChangePercentTTM: number; // double
    epsChangeYear: number; // double
    epsChange: number; // double
    revChangeYear: number; // double
    revChangeTTM: number; // double
    revChangeIn: number; // double
    sharesOutstanding: number; // double
    marketCapFloat: number; // double
    marketCap: number; // double
    bookValuePerShare: number; // double
    shortIntToFloat: number; // double
    shortIntDayToCover: number; // double
    divGrowthRate3Year: number; // double
    dividendPayAmount: number; // double
    dividendPayDate: string;
    beta: number; // double
    vol1DayAvg: number; // double
    vol10DayAvg: number; // double
    vol3MonthAvg: number; // double
}

export interface ISearchInstrumentResults {
    [key: string]: ISearchInstrumentResult;
}

// INSTRUMENTS TYPES STOP


// PRICEHISTORY TYPES START

/**
 * The type of period by which to group price data (which will be subdivided into candles by {@link EFrequencyType)}
 */
export enum EPeriodType {
    DAY = "day",
    MONTH = "month",
    YEAR = "year",
    YTD = "ytd"
}

/**
 * This pairs with {@link EPeriodType}. Use {@link EPeriodQtyByPeriodType} to get valid quantities for the given type.
 */
export enum EPeriodQty {
    ONE = 1,
    TWO = 2,
    THREE = 3,
    FOUR = 4,
    FIVE = 5,
    SIX = 6,
    TEN = 10,
    FIFTEEN = 15,
    TWENTY = 20
}

/**
 * The number of periods to show. Acceptable values are members of {@link EPeriodQty} and depend on, and are enumerated by, {@link EPeriodType}
 * @example
 * EPeriodQtyByPeriodType[EPeriodType.DAY].FIVE
 */
export const EPeriodQtyByPeriodType = {
    /** Use these values if you selected EPeriodType.DAY */
    [EPeriodType.DAY]: {
        /** DEFAULT */
        TEN: EPeriodQty.TEN,
        FIVE: EPeriodQty.FIVE,
        FOUR: EPeriodQty.FOUR,
        THREE: EPeriodQty.THREE,
        TWO: EPeriodQty.TWO,
        ONE: EPeriodQty.ONE,
    },
    /** Use these values if you selected EPeriodType.MONTH */
    [EPeriodType.MONTH]: {
        SIX: EPeriodQty.SIX,
        THREE: EPeriodQty.THREE,
        TWO: EPeriodQty.TWO,
        /** DEFAULT */
        ONE: EPeriodQty.ONE,
    },
    /** Use these values if you selected EPeriodType.YEAR */
    [EPeriodType.YEAR]: {
        TWENTY: EPeriodQty.TWENTY,
        FIFTEEN: EPeriodQty.FIFTEEN,
        TEN: EPeriodQty.TEN,
        FIVE: EPeriodQty.FIVE,
        THREE: EPeriodQty.THREE,
        TWO: EPeriodQty.TWO,
        /** DEFAULT */
        ONE: EPeriodQty.ONE,
    },
    /** Use these values if you selected EPeriodType.YTD */
    [EPeriodType.YTD]: {
        /** DEFAULT */
        ONE: EPeriodQty.ONE,
    },
};

/**
 * Each candle represents this time unit, quantity specified with {@link EFrequencyQty}
 */
export enum EFrequencyType {
    MINUTE = "minute",
    DAILY = "daily",
    WEEKLY = "weekly",
    MONTHLY = "monthly"
}

/**
 * The frequency type (time unit) for the price candles. Valid {@link EFrequencyType} values
 * for your chosen period type (time span for the whole chart) depend on, and are enumerated by, {@link EPeriodType}
 * @example
 * EFrequencyTypeByPeriodType[EPeriodType.DAY].MINUTE
 */
export const EFrequencyTypeByPeriodType = {
    /** Use these values if you selected EPeriodType.DAY */
    [EPeriodType.DAY]: {
        /** DEFAULT */
        MINUTE: EFrequencyType.MINUTE,
    },
    /** Use these values if you selected EPeriodType.MONTH */
    [EPeriodType.MONTH]: {
        /** DEFAULT */
        WEEKLY: EFrequencyType.WEEKLY,
        DAILY: EFrequencyType.DAILY,
    },
    /** Use these values if you selected EPeriodType.YEAR */
    [EPeriodType.YEAR]: {
        /** DEFAULT */
        MONTHLY: EFrequencyType.MONTHLY,
        WEEKLY: EFrequencyType.WEEKLY,
        DAILY: EFrequencyType.DAILY,
    },
    /** Use these values if you selected EPeriodType.YTD */
    [EPeriodType.YTD]: {
        /** DEFAULT */
        WEEKLY: EFrequencyType.WEEKLY,
        DAILY: EFrequencyType.DAILY,
    },
};

/**
 * Each candle represents this many time units, specified in {@link EFrequencyType}
 */
export enum EFrequencyQty {
    ONE = 1,
    FIVE = 5,
    TEN = 10,
    FIFTEEN = 15,
    THIRTY = 30
}

/**
 * How many units of the EFrequencyType time units make up a candle. Valid quantities/frequencies come from {@link EFrequencyQty}
 * and depend on, and are enumerated by, {@link EFrequencyType}
 * @example
 * EFrequencyQtyByFrequencyType[EFrequencyType.MINUTE].FIFTEEN
 */
export const EFrequencyQtyByFrequencyType = {
    /** Use these values if you selected EFrequencyType.MINUTE */
    [EFrequencyType.MINUTE]: {
        /** DEFAULT */
        ONE: EFrequencyQty.ONE,
        FIVE: EFrequencyQty.FIVE,
        TEN: EFrequencyQty.TEN,
        FIFTEEN: EFrequencyQty.FIFTEEN,
        THIRTY: EFrequencyQty.THIRTY,
    },
    /** Use this value if you selected EFrequencyType.DAILY */
    [EFrequencyType.DAILY]: {
        /** DEFAULT */
        ONE: EFrequencyQty.ONE,
    },
    /** Use these values if you selected EFrequencyType.WEEKLY */
    [EFrequencyType.WEEKLY]: {
        /** DEFAULT */
        ONE: EFrequencyQty.ONE,
    },
    /** Use these values if you selected EFrequencyType.MONTHLY */
    [EFrequencyType.MONTHLY]: {
        /** DEFAULT */
        ONE: EFrequencyQty.ONE,
    },
};

export interface IPriceHistory {
    candles: ICandle[];
    symbol: string;
    empty: boolean;
    previousClose: DoubleNumber;
    previousCloseDate: Int64EpochTime;
}

// PRICEHISTORY TYPES STOP

export type Placeholder = {

}

