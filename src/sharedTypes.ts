// Copyright (C) 2024  Aaron Satterlee

import { ECashEquivalentType, EMutualFundType } from "./schwab-trading-types"

export enum EAssetType {
    EQUITY = "EQUITY",
    ETF = "ETF",
    FOREX = "FOREX",
    FUTURE = "FUTURE",
    FUTURE_OPTION = "FUTURE_OPTION",
    INDEX = "INDEX",
    INDICATOR = "INDICATOR",
    MUTUAL_FUND = "MUTUAL_FUND",
    OPTION = "OPTION",
    UNKNOWN = "UNKNOWN",
    CASH_EQUIVALENT = "CASH_EQUIVALENT",
    FIXED_INCOME = "FIXED_INCOME",
    CURRENCY = "CURRENCY",
    COLLECTIVE_INVESTMENT = "COLLECTIVE_INVESTMENT",
}

export enum EAssetSubType {
    ADR = "ADR",
    CEF = "CEF",
    COE = "COE",
    ETF = "ETF",
    ETN = "ETN",
    GDR = "GDR",
    OEF = "OEF",
    PRF = "PRF",
    RGT = "RGT",
    UIT = "UIT",
    WAR = "WAR",
}

export interface IInstrument {
    assetType: EAssetType,
    cusip?: string,
    symbol: string,
    description?: string,
    exchange?: string,
}

export type IEquity = IInstrument

export interface IFixedIncome extends IInstrument {
    // "assetType": "'EQUITY' or 'OPTION' or 'INDEX' or 'MUTUAL_FUND' or 'CASH_EQUIVALENT' or 'FIXED_INCOME' or 'CURRENCY'",
    // "cusip": "string",
    // "symbol": "string",
    // "description": "string",
    maturityDate: string, // date-time
    variableRate: number, // double
    factor: number, // double
}

export interface IMutualFund extends IInstrument {
    type: EMutualFundType
}

export interface ICashEquivalent extends IInstrument {
    type: ECashEquivalentType
}

export interface IBond extends Omit<IInstrument, "assetType"> {
    bondPrice: number,
    assetType: "BOND",
    bondMaturityDate: string,
    bondInterestRate: number,
}

export enum EOptionInstrumentType {
    VANILLA,
    BINARY,
    BARRIER,
}

export interface IOptionInstrument extends IInstrument {
    type: EOptionInstrumentType,
    putCall: "PUT" | "CALL",
    underlyingSymbol: string,
    optionMultiplier: number, // int32
    optionDeliverables: IOptionDeliverable[],
    optionExpirationDate: string,
    optionStrikePrice: number,
}

export interface IOptionDeliverable {
    symbol: string,
    deliverableUnits: number,
    currencyType: ECurrencyType,
    assetType: EAssetType,
}

export enum ECurrencyType {
    USD,
    CAD,
    EUR,
    JPY,
}

export interface ICandle {
    open: DoubleNumber,
    high: DoubleNumber,
    low: DoubleNumber,
    close: DoubleNumber,
    volume: Int64Number | number,
    datetime: Int64EpochTime,
}

/** example: 2021-05-13T00:00:00Z */
export type DateString = string;
/** example: 2021-05-13 */
export type DateStringSimple = string;
export type Int64Number = number;
export type Int64EpochTime = number;
export type DoubleNumber = number;
export type Int32Number = number;

export enum EContractTypeChar {
    /** call */
    C = "C",
    /** put */
    P = "P"
}

export enum EExerciseTypeChar {
    /** American */
    A = "A",
    /** European */
    E = "E"
}

export enum EExpirationTypeChar {
    /** End Of Month Expiration Calendar Cycle. (To match the last business day of the month) */
    M = "M",
    /** Quarterly expirations (last business day of the quarter month MAR/JUN/SEP/DEC) */
    Q = "Q",
    /** Expires 3rd Friday of the month (also known as regular options) */
    S = "S",
    /** Weekly expiration (also called Friday Short Term Expirations) */
    W = "W"
}

export enum ESettlementTypeChar {
    /** AM settlement */
    A = "A",
    /** PM settlement */
    P = "P"
}
