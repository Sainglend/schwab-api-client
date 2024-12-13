// Copyright (C) 2024  Aaron Satterlee

import {
    L1FuturesQuote,
    L1FuturesQuoteRough,
    ChartFuturesResponse,
    ChartFuturesResponseRough,
    ChartHistoryFutures,
    ChartHistoryFuturesRough,
    ChartHistoryFuturesCandleRough,
    ChartEquityResponseRough,
    ChartEquityResponse,
    TimeSaleRough,
    TimeSale,
    L1FuturesOptionsQuoteRough,
    L1FuturesOptionsQuote,
    L1OptionsQuoteRough,
    L1OptionsQuote,
    L1EquityQuoteRough,
    L1EquityQuote,
    L1ForexQuoteRough,
    L1ForexQuote,
    NewsHeadlineRough,
    NewsHeadline,
    AcctActivityRough,
    AcctActivity, EAcctActivityMsgType,
    EServices,
    ScreenerResult,
    ScreenerRough,
    BookServiceResult,
    BookServiceRough,
    PriceLevel,
    PriceLevelRough,
    MarketMakerSizeRough,
    MarketMakerSize,
} from "./streamingdatatypes";
import {ICandle} from "./sharedTypes";
import qs from "qs";

export function normalizeSymbol(ticker: string): string {
    if (ticker) {
        return ticker.replace(/\W/g, "_");
    } else return ticker;
}

export default class StreamingUtils {
    static buildNumberArray(start: number, finish: number) : string {
        const arr = [];
        for (let i = start; i <= finish; i++) {
            arr.push(i);
        }
        return arr.join(",");
    }

    static jsonToQueryString(json: any): string {
        return qs.stringify(json);
    }

    static transformFuturesChartResponse(resp: ChartFuturesResponseRough, timestamp: number) : ChartFuturesResponse {
        return {
            timestamp: timestamp,
            key: resp.key,
            symbol: resp.key,
            seq: resp.seq,
            datetime: resp["1"],
            open: resp["2"],
            high: resp["3"],
            low: resp["4"],
            close: resp["5"],
            volume: resp["6"],
        };
    }

    static transformEquityChartResponse(resp: ChartEquityResponseRough) : ChartEquityResponse {
        return {
            key: resp.key,
            symbol: resp.key,
            seq: resp["6"],
            datetime: resp["7"],
            open: resp["1"],
            high: resp["2"],
            low: resp["3"],
            close: resp["4"],
            volume: resp["5"],
            chartDay: resp["8"],
        };
    }

    static transformChartHistoryFuturesResponse(resp: ChartHistoryFuturesRough) : ChartHistoryFutures {
        return {
            key: resp.key,
            requestId: resp["0"],
            prop1: resp["1"],
            count: resp["2"],
            candles: resp["3"].map(candle => StreamingUtils.transformChartHistoryFuturesCandle(candle)),
        };
    }

    static transformChartHistoryFuturesCandle(candle: ChartHistoryFuturesCandleRough) : ICandle {
        return {
            datetime: candle["0"],
            open: candle["1"],
            high: candle["2"],
            low: candle["3"],
            close: candle["4"],
            volume: candle["5"],
        };
    }

    static transformTimeSaleResponse(timeSaleRough: TimeSaleRough) : TimeSale {
        return {
            key: timeSaleRough["key"],
            sequence: timeSaleRough["seq"],
            tradeTime: timeSaleRough["1"],
            lastPrice: timeSaleRough["2"],
            lastSize: timeSaleRough["3"],
            lastSequence: timeSaleRough["4"],
        };
    }

    static transformL1FuturesResponse(l1FuturesQuoteRough: L1FuturesQuoteRough, timestamp: number) : L1FuturesQuote {
        return {
            // symbol and about info
            timestamp: timestamp, // from outer object
            key: l1FuturesQuoteRough["key"],
            delayed: l1FuturesQuoteRough.delayed,
            assetMainType: l1FuturesQuoteRough.assetMainType,
            symbol: l1FuturesQuoteRough["key"],
            description: l1FuturesQuoteRough["16"],
            tradingStatus: l1FuturesQuoteRough["22"],
            // "key": string, //symbol
            // "0"?: string, //symbol
            // "16"?: string, // description of product
            // "22"?: TRADING_STATUS, // symbolStatus
            futuresProduct: l1FuturesQuoteRough["27"], // "27"?: string, // futuresProduct
            tradingHours: l1FuturesQuoteRough["29"], // "29"?: string, // tradingHours
            isTradable: l1FuturesQuoteRough["30"], // "30"?: boolean, // isTradable

            // price info
            bid: l1FuturesQuoteRough["1"],
            ask: l1FuturesQuoteRough["2"],
            last: l1FuturesQuoteRough["3"],
            dailyOpen: l1FuturesQuoteRough["18"],
            dailyHigh: l1FuturesQuoteRough["12"],
            dailyLow: l1FuturesQuoteRough["13"],
            previousDayClose: l1FuturesQuoteRough["14"],
            mark: l1FuturesQuoteRough["24"],
            // "1"?: number, //bid
            // "2"?: number, //ask
            // "3"?: number, //last
            // "12"?: number, // dailyHigh
            // "13"?: number, // dailyLow
            // "14"?: number, // prevDayClose
            // "18"?: number, // dailyOpen
            // "24"?: number, // mark
            settlementPrice: l1FuturesQuoteRough["33"], // "33"?: number, // settlementPrice

            // info derived from price
            netChange: l1FuturesQuoteRough["19"],
            // "19"?: number, // netChange
            percentChange: l1FuturesQuoteRough["20"], // "20"?: number, // pctChange
            quotedSession: l1FuturesQuoteRough["39"], // "39": boolean, // quotedSession, if contract has quoted during active session

            // volume info
            bidSize: l1FuturesQuoteRough["4"],
            askSize: l1FuturesQuoteRough["5"],
            lastSize: l1FuturesQuoteRough["9"],
            dailyVolume: l1FuturesQuoteRough["8"],
            // "4"?: number, //bidSize
            // "5"?: number, //askSize
            // "8"?: number, // dailyVolume
            // "9"?: number, // lastSize
            openInterest: l1FuturesQuoteRough["23"], // "23"?: number, // openInterest

            // contract info
            tickSize: l1FuturesQuoteRough["25"], // "25"?: number, // tickSize
            tickDollarAmount: l1FuturesQuoteRough["26"], // "26"?: number, // tickAmount
            priceFormat: l1FuturesQuoteRough["28"], // "28"?: string, // priceFormat fraction or decimal
            contractMultiplier: l1FuturesQuoteRough["31"], // "31"?: number, // contractMultiplier
            isContractActive: l1FuturesQuoteRough["32"], // "32"?: boolean, // isContractActive
            activeContractSymbol: l1FuturesQuoteRough["34"], // "34"?: string, // activeContractSymbol
            contractExpirationMSEpoch: l1FuturesQuoteRough["35"], // "35"?: number, // contractExpirationDate ms since epoch
            expirationStyle: l1FuturesQuoteRough["36"], // "36": string, // expirationStyle

            // exchanges
            exchangeOfPrimaryListing: l1FuturesQuoteRough["15"], // "15"?: EXCHANGES, // exchangeId
            exchangeBestAsk: l1FuturesQuoteRough["6"], // "6"?: EXCHANGES, // bestAskExchange
            exchangeBestBid: l1FuturesQuoteRough["7"], // "7"?: EXCHANGES, // bestBidExchange
            exchangeLastTrade: l1FuturesQuoteRough["17"], // "17"?: EXCHANGES, // lastTradeExchange
            exchangeName: l1FuturesQuoteRough["21"], // "21"?: string, // exchangeName

            // time info
            timeLastQuote: l1FuturesQuoteRough["10"],
            timeLastTrade: l1FuturesQuoteRough["11"],
            askTime: l1FuturesQuoteRough["37"], // "37": EpochTimeStamp, // askTime, time of the last ask-side quote
            bidTime: l1FuturesQuoteRough["38"], // "38": EpochTimeStamp, // bidTime, time of the last bid-side quote
            settlementDate: l1FuturesQuoteRough["40"], // "40": EpochTimeStamp, // settlementDate
            // "10"?: number, // lastQuoteTime ms since epoch
            // "11"?: number, // lastTradeTime ms since epoch
        };
    }

    static transformL1FuturesOptionsResponse(l1FutOptRough: L1FuturesOptionsQuoteRough, timestamp: number) : L1FuturesOptionsQuote {
        return {
            key: l1FutOptRough.key, // "key": string, // symbol
            symbol: l1FutOptRough.key,

            // contract/product info
            description: l1FutOptRough["16"], // "16": string, // description
            multiplier: l1FutOptRough["22"], // "22": number, // multiplier
            underlyingSymbol: l1FutOptRough["24"], // "24": string, // underlying symbol
            strike: l1FutOptRough["25"], // "25": number, // strike
            expirationDateMSEpoch: l1FutOptRough["26"], // "26": number, // expiration date of this contract, ms since epoch
            tickSize: l1FutOptRough["20"], // "20": DoubleNumber // tick size, min price movement
            tickAmountDollars: l1FutOptRough["21"], // "21": DoubleNumber, // tick amount dollars
            expirationStyle: l1FutOptRough["27"], // "27": string, // expiration style
            contractType: l1FutOptRough["28"], // "28": string, // contract type (P/C?)
            securityStatus: l1FutOptRough["29"], // "29": string, // security status
            listingExchange: l1FutOptRough["30"], // 30": EXCHANGES, // exchange character
            listingExchangeName: l1FutOptRough["31"], // "31": string, // exchange name

            // price
            bid: l1FutOptRough["1"], // "1": number, // bid price
            ask: l1FutOptRough["2"], // "2": number, // ask price
            last: l1FutOptRough["3"], // "3": number, // last trade price
            dailyHigh: l1FutOptRough["12"], // "12": number, // daily high
            dailyLow: l1FutOptRough["13"], // "13": number, // daily low
            previousDayClose: l1FutOptRough["14"], // "14": number, // prev day close
            dailyOpen: l1FutOptRough["17"], // "17": number, // daily open
            mark: l1FutOptRough["19"], // "19": number, // ?
            settlementPrice: l1FutOptRough["23"], // "23": number, // ?

            // volume
            bidSize: l1FutOptRough["4"], // "4": number, // bid size
            askSize: l1FutOptRough["5"], // "5": number, // ask size
            dailyVolume: l1FutOptRough["8"], // "8": number, // total volume
            lastSize: l1FutOptRough["9"], // "9": number, // last size
            openInterest: l1FutOptRough["18"], // "18": number, // open interest

            // exchange
            exchangeBestAsk: l1FutOptRough["6"], // "6": EXCHANGES, // exchange with best ask
            exchangeBestBid: l1FutOptRough["7"], // "7": EXCHANGES, // exchange with best bid
            lastTradedExchange: l1FutOptRough["15"], // "15": EXCHANGES, // primary listing exchange

            // time
            timeLastQuote: l1FutOptRough["10"], // "10": number, // quote time ms epoch
            timeLastTrade: l1FutOptRough["11"], // "11": number, // trade time ms epoch
        };
    }

    static transformL1OptionsResponse(l1OptionsRough: L1OptionsQuoteRough, timestamp: number) : L1OptionsQuote {
        return {
            timestamp, // imposed by transform function

            key: l1OptionsRough.key,
            cusip: l1OptionsRough.cusip,
            assetMainType: l1OptionsRough.assetMainType,
            delayed: l1OptionsRough.delayed,
        
            // about
            symbol: l1OptionsRough["0"], // "0": string, // symbol
            description: l1OptionsRough["1"], // "1": string, // description, company, index, fund name
            multipllier: l1OptionsRough["13"], // "13": DoubleNumber, // multiplier
            digits: l1OptionsRough["14"], // "14": number, // digits, i.e. number of decimal places
            contractType: l1OptionsRough["21"], // "21": string, // contract type (standard, non-standard?)
            underlying: l1OptionsRough["22"], // "22": string, // underyling
            deliverables: l1OptionsRough["24"], // "24": string, // deliverables
            underlyingPrice: l1OptionsRough["35"], // "35": DoubleNumber, // underlying price
            expirationType: l1OptionsRough["36"], // "36": string, // uv expiration type (american/european?)
            settlementType: l1OptionsRough["43"], // "43": string, // char for settlement type
            isPennyPilot: l1OptionsRough["48"], // "48": boolean, // isPennyPilot (i.e. price can increment by pennies instead of 5 cent increments)
            optionRoot: l1OptionsRough["49"], // "49": string, // option root
            exerciseType: l1OptionsRough["55"], // "55": string, // char for exercise type
        
            // about this option
            expirationYear: l1OptionsRough["12"], // "12": number, // expiration year
            strikePrice: l1OptionsRough["20"], // "20": DoubleNumber, // strike price
            expirationMonth: l1OptionsRough["23"], // "23": number, // expiration month (0 based?)
            expirationDay: l1OptionsRough["26"], // "26": number, // expiration day
            daysToExpiry: l1OptionsRough["27"], // "27": number, // days to expiry
            tradingStatus: l1OptionsRough["33"], // "33": TRADING_STATUS, // trading status
            lastTradingDay: l1OptionsRough["42"], // "42": EpochTimeStamp, // last trading day
        
            // prices
            bid: l1OptionsRough["2"], // "2": DoubleNumber, // bid
            ask: l1OptionsRough["3"], // "3": DoubleNumber, // ask
            last: l1OptionsRough["4"], // "4": DoubleNumber, // last
            dailyHigh: l1OptionsRough["5"], // "5": DoubleNumber, // daily high
            dailyLow: l1OptionsRough["6"], // "6": DoubleNumber, // daily low
            previousDayClose: l1OptionsRough["7"], // "7": DoubleNumber, // prev day close
            dailyOpen: l1OptionsRough["15"], // "15": DoubleNumber, // daily open
            mark: l1OptionsRough["37"], // "37": DoubleNumber, // mark
            fiftyTwoWeekHigh: l1OptionsRough["50"], // "50": DoubleNumber, // 52 wk high
            fiftyTwoWeekLow: l1OptionsRough["51"], // "51": DoubleNumber, // 52 wk low
            indicativeAsk: l1OptionsRough["52"], // "52": DoubleNumber, // indicative ask price (Index options only, 0 otherwise)
            indicativeBid: l1OptionsRough["53"], // "53": DoubleNumber, // indicative bid price (Index options only, 0 otherwise)
        
            // volume info
            dailyVolume: l1OptionsRough["8"], // "8": Int64Number, // total volume
            openInterest: l1OptionsRough["9"], // "9": number, // open interest
            bidSize: l1OptionsRough["16"], // "16": number, // bid size
            askSize: l1OptionsRough["17"], // "17": number, // ask size
            lastSize: l1OptionsRough["18"], // "18": number, // last size
        
            // option data
            volatility: l1OptionsRough["10"], // "10": DoubleNumber, // volatility
            intrinsicValue: l1OptionsRough["11"], // "11": DoubleNumber, // intrinsic value
            timeValue: l1OptionsRough["25"], // "25": DoubleNumber, // time value
            delta: l1OptionsRough["28"], // "28": DoubleNumber, // delta
            gamma: l1OptionsRough["29"], // "29": DoubleNumber, // gamma
            theta: l1OptionsRough["30"], // "30": DoubleNumber, // theta
            vega: l1OptionsRough["31"], // "31": DoubleNumber, // vega
            rho: l1OptionsRough["32"], // "32": DoubleNumber, // rho
            theoreticalOptionValue: l1OptionsRough["34"], // "34": DoubleNumber, // theoretical option value
            impliedYield: l1OptionsRough["47"], // "47": DoubleNumber, // implied yield
        
            // computed price diffs    
            netChange: l1OptionsRough["19"], // "19": DoubleNumber, // net change, last - prev close
            netPercentChange: l1OptionsRough["44"], // "44": DoubleNumber, // net percent change
            markNetChange: l1OptionsRough["45"], // "45": DoubleNumber, // mark price net change
            markNetPercentChange: l1OptionsRough["46"], // "46": DoubleNumber, // mark price percent change
        
            // timestamps
            timeLastQuote: l1OptionsRough["38"], // "38": EpochTimeStamp, // last quote time
            timeLastTrade: l1OptionsRough["39"], // "39": EpochTimeStamp, // last trade time
            timeLastIndicativeQuote: l1OptionsRough["54"], // "54": EpochTimeStamp, // indicative quote time (Index options only, 0 otherwise)
        
           // exchange info
           exchange: l1OptionsRough["40"], // "40": EXCHANGES, // exchange character
           exchangeName: l1OptionsRough["41"], // "41": string, // exchange name
        };
    }

    static transformL1EquitiesResponse(l1EquityRough: L1EquityQuoteRough, timestamp: number) : L1EquityQuote {
        return {
            timestamp: timestamp, // will be imposed by transform function

            key: l1EquityRough.key,
            assetMainType: l1EquityRough.assetMainType,
            assetSubType: l1EquityRough.assetSubType,
            cusip: l1EquityRough.cusip,
            delayed: l1EquityRough.delayed,

            // symbol and about info
            symbol: l1EquityRough["0"], // "0": string, // symbol
            description: l1EquityRough["15"], // "15": string, // description: company, index, or fund name
            peRatio: l1EquityRough["21"], // "21": number, // PE ratio
            dividendAmountAnnual: l1EquityRough["22"], // "22": number, // annual dividend amount
            dividendYield: l1EquityRough["23"], // "23": number, // dividend yield
            NAV: l1EquityRough["24"], // "24": number, // NAV - mutual fund net asset value
            dividendDate: l1EquityRough["26"], // "26": string, // dividend date
            tradingStatus: l1EquityRough["32"], // "32": TRADING_STATUS, // security status: Normal, Halted, Closed

            // price info
            bid: l1EquityRough["1"], // "1": number, // bid price
            ask: l1EquityRough["2"], // "2": number, // ask price
            last: l1EquityRough["3"], // "3": number, // last price
            dailyHigh: l1EquityRough["10"], // "10": number, // daily high price
            dailyLow: l1EquityRough["11"], // "11": number, // daily low price
            previousDayClose: l1EquityRough["12"], // "12": number, // prev day's close
            dailyOpen: l1EquityRough["17"], // "17": number, // day open price
            fiftyTwoWeekHigh: l1EquityRough["19"], // "19": number, // 52wk high
            fiftyTwoWeekLow: l1EquityRough["20"], // "20": number, // 52wk low
            regularMarketLastPrice: l1EquityRough["29"], // "29": DoubleNumber, // regular market last price
            mark: l1EquityRough["33"], // "33": number, // mark

            // info derived from price
            netChange: l1EquityRough["18"], // "18": number, // net change, last-prev close
            regularMarketNetchange: l1EquityRough["31"], // "31": number, // reg market net change
            netPercentChange: l1EquityRough["42"], // "42": DoubleNumber, // net pct change = netchange / closeprice * 100
            regularMarketHoursNetChange: l1EquityRough["43"], // "43": DoubleNumber, // reg mkt hours pct change
            markNetChange: l1EquityRough["44"], // "44": DoubleNumber, // mark price net change
            markPercentChange: l1EquityRough["45"], // "45": DoubleNumber, // mark price pct change
            postMarketNetChange: l1EquityRough["50"], // "50": DoubleNumber, // post-market net change, Change in price since the end of the regular session (typically 4:00pm)	PostMarketLastPrice - RegularMarketLastPrice
            postMarketPercentChange: l1EquityRough["51"], // "51": DoubleNumber, // Post-Market Percent Change	double	Percent Change in price since the end of the regular session (typically 4:00pm)	PostMarketNetChange / RegularMarketLastPrice * 100

            // volume info
            bidSize: l1EquityRough["4"], // "4": number, // bid size
            askSize: l1EquityRough["5"], // "5": number, // ask size
            dailyVolume: l1EquityRough["8"],  // "8": number, // volume
            lastSize: l1EquityRough["9"], // "9": number, // last size, in 100s
            regularMarketLastSize: l1EquityRough["30"], // "30": number, // regular market last size

            // exchanges
            exchangeBestAsk: l1EquityRough["6"], // "6": EXCHANGES, // ask exchange id
            exchangeBestBid: l1EquityRough["7"], // "7": EXCHANGES, // bid exchange id
            exchangeOfPrimaryListing: l1EquityRough["13"], // "13": EXCHANGES, // primary listing exchange, type EXCHANGES
            exchangeLastTrade: l1EquityRough["16"], // "16": EXCHANGES, // last id for exchange
            exchangeName: l1EquityRough["25"], // "25": string, // exchange name
            micAsk: l1EquityRough["39"], // "39": string, // 4 char MIC (market identifier code) for Ask
            micBid: l1EquityRough["40"], // "40": string, // 4 char MIC (market identifier code) for Bid
            midLast: l1EquityRough["41"], // "41": string, // 4 char MIC (market identifier code) for Last

            // trade info
            isMarginable: l1EquityRough["14"], // "14": boolean, // marginable
            isLastQuoteFromRegularMarket: l1EquityRough["27"], // "27": boolean, // is last quote regular market quote
            isLastTradeFromRegularMarket: l1EquityRough["28"], // "28": boolean, // regular market trade
            htbQuantity: String(l1EquityRough["46"]) == "-1" ? null : l1EquityRough["46"], // "46": number | null, // HTB (hard to borrow) quantity, -1 is null, >= 0 is valid
            htbRate: String(l1EquityRough["47"]) == "null" ? null : l1EquityRough["47"], // "47": DoubleNumber | null, // HTB rate, null is null, -99_999_999 to + is valid
            isHTB: String(l1EquityRough["48"]) == "-1" ? null : (l1EquityRough["48"] === 1 ? true : false), // "48": number | null, // HTB, -1 null, 1 true, 0 false
            isShortable: String(l1EquityRough["49"]) == "-1" ? null : (l1EquityRough["49"] === 1 ? true : false), // "49": number | null, // shortable, -1 null, 1 true, 0 false

            // time info
            timeLastQuote: l1EquityRough["34"], // "34": number, // quote time ms since epoch
            timeLastTrade: l1EquityRough["35"], // "35": number, // trade time ms since epoch
            timeLastRegularMktTrade: l1EquityRough["36"], // "36": number, // reg mkt trade time ms epoch
            timeLastBid: l1EquityRough["37"], // "37": EpochTimeStamp, // last bid time
            timeLastAsk: l1EquityRough["38"], // "38": EpochTimeStamp, // last ask time
        };
    }

    static transformL1ForexResponse(l1ForexRough: L1ForexQuoteRough, timestamp: number) : L1ForexQuote {
        return {
            timestamp: timestamp,
            key: l1ForexRough["key"],
            assetMainType: l1ForexRough.assetMainType,
            delayed: l1ForexRough.delayed,
            symbol: l1ForexRough["key"],
            description: l1ForexRough["14"],
            tradingStatus: l1ForexRough["20"],
            // "0": string, // ticker symbol in upper case
            // "14": string, // description
            // "20": TRADING_STATUS, // trading status
            productName: l1ForexRough["23"], // "23": string, // product name
            tradingHours: l1ForexRough["24"], // "24": string, // trading hours
            isTradable: l1ForexRough["25"], // "25": boolean, // is tradable
            marketMaker: l1ForexRough["26"], // "26": string, // market maker

            // price
            bid: l1ForexRough["1"],
            ask: l1ForexRough["2"],
            last: l1ForexRough["3"],
            dailyOpen: l1ForexRough["15"],
            dailyHigh: l1ForexRough["10"],
            dailyLow: l1ForexRough["11"],
            previousDayClose: l1ForexRough["12"],
            mark: l1ForexRough["29"],
            // "1": number, // current best bid price
            // "2": number, // current ask
            // "3": number, // last trade
            // "10": number, // high price
            // "11": number, // low price
            // "12": number, // prev day close
            // "15": number, // day's open price
            // "29": number, // mark
            fiftyTwoWeekHigh: l1ForexRough["27"], // "27": number, // 52wk high
            fiftyTwoWeekLow: l1ForexRough["28"], // "28": number, // 52wk low


            // derived from price
            netChange: l1ForexRough["16"],
            // "16": number, // net change last - prev close
            percentChange: l1ForexRough["17"], // "17": number, // percent change

            // volume
            bidSize: l1ForexRough["4"],
            askSize: l1ForexRough["5"],
            lastSize: l1ForexRough["7"],
            dailyVolume: l1ForexRough["6"],
            // "4": number, // bid size
            // "5": number, // ask size
            // "6": number, // volume
            // "7": number, // last size

            // time
            timeLastQuote: l1ForexRough["8"],
            timeLastTrade: l1ForexRough["9"],
            // "8": number, // quote time ms epoch
            // "9": number, // trade time ms epoch

            // exchange
            exchangeOfPrimaryListing: l1ForexRough["13"], // "13": EXCHANGES, // primary listing exchange
            exchangeName: l1ForexRough["18"], // "18": string, // exchange name

            // contract/product info
            validDigits: l1ForexRough["19"], // "19": number, // valid decimal digits
            tickSize: l1ForexRough["21"], // "21": number, // tick, min price movement
            tickDollarAmount: l1ForexRough["22"], // "22": number, // tick amount, tick*multiplier
        };
    }

    static transformNewsHeadlineResponse(newsHeadlineRough: NewsHeadlineRough, timestamp: number) : NewsHeadline {
        return {
            timestamp: timestamp,
            seq: newsHeadlineRough.seq,
            key: newsHeadlineRough.key,
            symbol: newsHeadlineRough.key,
            errorCode: newsHeadlineRough["1"],
            storyDatetime: newsHeadlineRough["2"],
            headlineId: newsHeadlineRough["3"],
            status: newsHeadlineRough["4"],
            headline: newsHeadlineRough["5"],
            storyId: newsHeadlineRough["6"],
            keywordCount: newsHeadlineRough["7"],
            keywords: newsHeadlineRough["8"],
            isHot: newsHeadlineRough["9"],
            storySource: newsHeadlineRough["10"],
        };
    }

    static transformAcctActivityResponse(acctActivityRough: AcctActivityRough, timestamp: number) : AcctActivity {
        let parsedMessageData = null;
        if ([null, "NULL"].includes(acctActivityRough["3"])) {
            parsedMessageData = null;
        } else {
            try {
                parsedMessageData = JSON.parse(acctActivityRough["3"]);
            } catch (e) {
                parsedMessageData = acctActivityRough["3"];
            }
        }
        return {
            timestamp: timestamp,
            accountNumber: acctActivityRough["1"],
            messageType: acctActivityRough["2"] as EAcctActivityMsgType,
            messageData: parsedMessageData,
            key: acctActivityRough.key, // subscription key
            sequence: acctActivityRough.seq, // sequence number
        };
    }

    static transformScreenerResponse(screenerRough: ScreenerRough, timestamp: number) : ScreenerResult {
        return {
            key: screenerRough["0"],
            symbol: screenerRough["0"],
            timestamp: screenerRough["1"],
            sortedBy: screenerRough["2"],
            frequency: screenerRough["3"],
            items: screenerRough["4"],
        };
    }

    static transformBookServiceResponse(bookServiceRough: BookServiceRough, timestamp: number) : BookServiceResult {
        return {
            key: bookServiceRough["0"],
            symbol: bookServiceRough["0"],
            timestamp: bookServiceRough["1"],
            bidSideLevels: bookServiceRough["2"].map(StreamingUtils.transformPriceLevelRough),
            askSideLevels: bookServiceRough["3"].map(StreamingUtils.transformPriceLevelRough),
        };
    }

    static transformPriceLevelRough(level: PriceLevelRough): PriceLevel {
        return {
            price: level["0"],
            size: level["1"],
            marketMakerCount: level["2"],
            marketMakerSizes: level["3"].map(StreamingUtils.transformMarketMakerSizeRough),
        }
    }

    static transformMarketMakerSizeRough(mmSize: MarketMakerSizeRough): MarketMakerSize {
        return {
            marketMakerId: mmSize["0"],
            size: mmSize["1"],
            quoteTime: mmSize["2"],
        }
    }

    static identityFunction(a: any) : any {
        return a;
    }
}

export function formatStreamEventType(service: EServices, isRawOrTyped: "RAW" | "TYPED", normalizedSymbol?: string) {
    return `${service}_${isRawOrTyped}${normalizedSymbol ? "_" + normalizedSymbol : ""}`;
}
