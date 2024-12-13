// Copyright (C) 2024  Aaron Satterlee

import { EAssetType } from "./sharedTypes";
import { DateString, DoubleNumber, Int64Number } from "./sharedTypes";

export type AccountNumberHash = {
    accountNumber: string,
    hashValue: string,
}

export enum ETradingSession {
    NORMAL = "NORMAL",
    AM = "AM",
    PM = "PM",
    SEAMLESS = "SEAMLESS",
}

export enum EOrderDuration {
    DAY = "DAY",
    GOOD_TILL_CANCEL = "GOOD_TILL_CANCEL",
    FILL_OR_KILL = "FILL_OR_KILL",
    IMMEDIATE_OR_CANCEL = "IMMEDIATE_OR_CANCEL",
    END_OF_WEEK = "END_OF_WEEK",
    END_OF_MONTH = "END_OF_MONTH",
    NEXT_END_OF_MONTH = "NEXT_END_OF_MONTH",
    UNKNOWN = "UNKNOWN",
}

export enum EOrderType {
    MARKET = "MARKET",
    LIMIT = "LIMIT",
    STOP = "STOP",
    STOP_LIMIT = "STOP_LIMIT",
    TRAILING_STOP = "TRAILING_STOP",
    CABINET = "CABINET",
    NON_MARKETABLE = "NON_MARKETABLE",
    MARKET_ON_CLOSE = "MARKET_ON_CLOSE",
    EXERCISE = "EXERCISE",
    TRAILING_STOP_LIMIT = "TRAILING_STOP_LIMIT",
    NET_DEBIT = "NET_DEBIT",
    NET_CREDIT = "NET_CREDIT",
    NET_ZERO = "NET_ZERO",
    LIMIT_ON_CLOSE = "LIMIT_ON_CLOSE",
    UNKNOWN = "UNKNOWN",
}

export enum EOrderTypeRequest {
    MARKET = "MARKET",
    LIMIT = "LIMIT",
    STOP = "STOP",
    STOP_LIMIT = "STOP_LIMIT",
    TRAILING_STOP = "TRAILING_STOP",
    CABINET = "CABINET",
    NON_MARKETABLE = "NON_MARKETABLE",
    MARKET_ON_CLOSE = "MARKET_ON_CLOSE",
    EXERCISE = "EXERCISE",
    TRAILING_STOP_LIMIT = "TRAILING_STOP_LIMIT",
    NET_DEBIT = "NET_DEBIT",
    NET_CREDIT = "NET_CREDIT",
    NET_ZERO = "NET_ZERO",
    LIMIT_ON_CLOSE = "LIMIT_ON_CLOSE",
}

export enum EComplexOrderStrategyType {
    NONE = "NONE",
    COVERED = "COVERED",
    VERTICAL = "VERTICAL",
    BACK_RATIO = "BACK_RATIO",
    CALENDAR = "CALENDAR",
    DIAGONAL = "DIAGONAL",
    STRADDLE = "STRADDLE",
    STRANGLE = "STRANGLE",
    COLLAR_SYNTHETIC = "COLLAR_SYNTHETIC",
    BUTTERFLY = "BUTTERFLY",
    CONDOR = "CONDOR",
    IRON_CONDOR = "IRON_CONDOR",
    VERTICAL_ROLL = "VERTICAL_ROLL",
    COLLAR_WITH_STOCK = "COLLAR_WITH_STOCK",
    DOUBLE_DIAGONAL = "DOUBLE_DIAGONAL",
    UNBALANCED_BUTTERFLY = "UNBALANCED_BUTTERFLY",
    UNBALANCED_CONDOR = "UNBALANCED_CONDOR",
    UNBALANCED_IRON_CONDOR = "UNBALANCED_IRON_CONDOR",
    UNBALANCED_VERTICAL_ROLL = "UNBALANCED_VERTICAL_ROLL",
    MUTUAL_FUND_SWAP = "MUTUAL_FUND_SWAP",
    CUSTOM = "CUSTOM",
}

export enum ERequestDestination {
    INET = "INET",
    ECN_ARCA = "ECN_ARCA",
    CBOE = "CBOE",
    AMEX = "AMEX",
    PHLX = "PHLX",
    ISE = "ISE",
    BOX = "BOX",
    NYSE = "NYSE",
    NASDAQ = "NASDAQ",
    BATS = "BATS",
    C2 = "C2",
    AUTO = "AUTO",
}

export enum EStopPriceLinkBasis {
    MANUAL = "MANUAL",
    BASE = "BASE",
    TRIGGER = "TRIGGER",
    LAST = "LAST",
    BID = "BID",
    ASK = "ASK",
    ASK_BID = "ASK_BID",
    MARK = "MARK",
    AVERAGE = "AVERAGE",
}

export enum EStopPriceLinkType {
    VALUE = "VALUE",
    PERCENT = "PERCENT",
    TICK = "TICK",
}

export type StopPriceOffset = DoubleNumber;

export enum EStopType {
    STANDARD = "STANDARD",
    BID = "BID",
    ASK = "ASK",
    LAST = "LAST",
    MARK = "MARK",
}

export enum EPriceLinkBasis {
    MANUAL = "MANUAL",
    BASE = "BASE",
    TRIGGER = "TRIGGER",
    LAST = "LAST",
    BID = "BID",
    ASK = "ASK",
    ASK_BID = "ASK_BID",
    MARK = "MARK",
    AVERAGE = "AVERAGE",
}

export enum EPriceLinkType {
    VALUE = "VALUE",
    PERCENT = "PERCENT",
    TICK = "TICK",
}

export enum ETaxLotMethod {
    FIFO = "FIFO",
    LIFO = "LIFO",
    HIGH_COST = "HIGH_COST",
    LOW_COST = "LOW_COST",
    AVERAGE_COST = "AVERAGE_COST",
    SPECIFIC_LOT = "SPECIFIC_LOT",
    LOSS_HARVESTER = "LOSS_HARVESTER",
}

export enum ESpecialInstruction {
    ALL_OR_NONE = "ALL_OR_NONE",
    DO_NOT_REDUCE = "DO_NOT_REDUCE",
    ALL_OR_NONE_DO_NOT_REDUCE = "ALL_OR_NONE_DO_NOT_REDUCE",
}

export enum EOrderStrategyType {
    SINGLE = "SINGLE",
    CANCEL = "CANCEL",
    RECALL = "RECALL",
    PAIR = "PAIR",
    FLATTEN = "FLATTEN",
    TWO_DAY_SWAP = "TWO_DAY_SWAP",
    BLAST_ALL = "BLAST_ALL",
    OCO = "OCO",
    TRIGGER = "TRIGGER",
}

export enum EAdvancedOrderType {
    NONE = "NONE",
    OTO = "OTO",
    OCO = "OCO",
    OTOCO = "OTOCO",
    OT2OCO = "OT2OCO",
    OT3OCO = "OT3OCO",
    BLAST_ALL = "BLAST_ALL",
    OTA = "OTA",
    PAIR = "PAIR",
}

export enum EOrderStatus {
    AWAITING_PARENT_ORDER = "AWAITING_PARENT_ORDER",
    AWAITING_CONDITION = "AWAITING_CONDITION",
    AWAITING_STOP_CONDITION = "AWAITING_STOP_CONDITION",
    AWAITING_MANUAL_REVIEW = "AWAITING_MANUAL_REVIEW",
    ACCEPTED = "ACCEPTED",
    AWAITING_UR_OUT = "AWAITING_UR_OUT",
    PENDING_ACTIVATION = "PENDING_ACTIVATION",
    QUEUED = "QUEUED",
    WORKING = "WORKING",
    REJECTED = "REJECTED",
    PENDING_CANCEL = "PENDING_CANCEL",
    CANCELED = "CANCELED",
    PENDING_REPLACE = "PENDING_REPLACE",
    REPLACED = "REPLACED",
    FILLED = "FILLED",
    EXPIRED = "EXPIRED",
    NEW = "NEW",
    AWAITING_RELEASE_TIME = "AWAITING_RELEASE_TIME",
    PENDING_ACKNOWLEDGEMENT = "PENDING_ACKNOWLEDGEMENT",
    PENDING_RECALL = "PENDING_RECALL",
    UNKNOWN = "UNKNOWN",
}

export enum EAmountIndicator {
    DOLLARS = "DOLLARS",
    SHARES = "SHARES",
    ALL_SHARES = "ALL_SHARES",
    PERCENTAGE = "PERCENTAGE",
    UNKNOWN = "UNKNOWN",
}

export enum EQuantityType {
    DOLLARS = "DOLLARS",
    SHARES = "SHARES",
    ALL_SHARES = "ALL_SHARES",
}

export enum EDivCapGains {
    REINVEST = "REINVEST",
    PAYOUT = "PAYOUT",
}

export enum ESettlementInstruction {
    REGULAR = "REGULAR",
    CASH = "CASH",
    NEXT_DAY = "NEXT_DAY",
    UNKNOWN = "UNKNOWN",
}

export interface OrderBalance {
    orderValue: DoubleNumber,
    projectedAvailableFund: DoubleNumber,
    projectedBuyingPower: DoubleNumber,
    projectedCommission: DoubleNumber,
}

export interface OrderLeg {
    askPrice: DoubleNumber,
    bidPrice: DoubleNumber,
    lastPrice: DoubleNumber,
    markPrice: DoubleNumber,
    projectedCommission: DoubleNumber,
    quantity: DoubleNumber,
    finalSymbol: string,
    legId: Int64Number,
    assetType: EAssetType
    instruction: EOrderLegInstruction,
}

export enum EOrderLegInstruction {
    BUY = "BUY",
    SELL = "SELL",
    BUY_TO_COVER = "BUY_TO_COVER",
    SELL_SHORT = "SELL_SHORT",
    BUY_TO_OPEN = "BUY_TO_OPEN",
    BUY_TO_CLOSE = "BUY_TO_CLOSE",
    SELL_TO_OPEN = "SELL_TO_OPEN",
    SELL_TO_CLOSE = "SELL_TO_CLOSE",
    EXCHANGE = "EXCHANGE",
    SELL_SHORT_EXEMPT = "SELL_SHORT_EXEMPT",
}

export interface OrderStrategy {
    accountNumber: string,
    advancedOrderType: EAdvancedOrderType,
    closeTime: DateString,
    enteredTime: DateString,
    orderBalance: OrderBalance,
    orderStrategyType: EOrderStrategyType,
    orderVersion: number,
    session: ETradingSession,
    status: EOrderStatus,
    allOrNone: boolean,
    discretionary: boolean,
    duration: EOrderDuration,
    filledQuantity: DoubleNumber,
    orderType: EOrderType,
    orderValue: DoubleNumber,
    price: DoubleNumber,
    quantity: DoubleNumber,
    remainingQuantity: DoubleNumber,
    sellNonMarginableFirst: boolean,
    settlementInstruction: ESettlementInstruction,
    strategy: EComplexOrderStrategyType,
    amountIndicator: EAmountIndicator,
    orderLegs: OrderLeg[],
}

export enum EOrderExecutionType {
    FILL = "FILL",
}

export enum EAPIRuleAction {
    ACCEPT = "ACCEPT",
    ALERT = "ALERT",
    REJECT = "REJECT",
    REVIEW = "REVIEW",
    UNKNOWN = "UNKNOWN",
}

export interface OrderValidationDetail {
    validationRuleName: string,
    message: string,
    activityMessage: string,
    originalSeverity: EAPIRuleAction,
    overrideName: string,
    overrideSeverity: EAPIRuleAction,
}

export interface OrderValidationResult {
    alerts: OrderValidationDetail[],
    accepts: OrderValidationDetail[],
    rejects: OrderValidationDetail[],
    reviews: OrderValidationDetail[],
    warns: OrderValidationDetail[],
}

export enum EFeeType {
    COMMISSION = "COMMISSION",
    SEC_FEE = "SEC_FEE",
    STR_FEE = "STR_FEE",
    R_FEE = "R_FEE",
    CDSC_FEE = "CDSC_FEE",
    OPT_REG_FEE = "OPT_REG_FEE",
    ADDITIONAL_FEE = "ADDITIONAL_FEE",
    MISCELLANEOUS_FEE = "MISCELLANEOUS_FEE",
    FTT = "FTT",
    FUTURES_CLEARING_FEE = "FUTURES_CLEARING_FEE",
    FUTURES_DESK_OFFICE_FEE = "FUTURES_DESK_OFFICE_FEE",
    FUTURES_EXCHANGE_FEE = "FUTURES_EXCHANGE_FEE",
    FUTURES_GLOBEX_FEE = "FUTURES_GLOBEX_FEE",
    FUTURES_NFA_FEE = "FUTURES_NFA_FEE",
    FUTURES_PIT_BROKERAGE_FEE = "FUTURES_PIT_BROKERAGE_FEE",
    FUTURES_TRANSACTION_FEE = "FUTURES_TRANSACTION_FEE",
    LOW_PROCEEDS_COMMISSION = "LOW_PROCEEDS_COMMISSION",
    BASE_CHARGE = "BASE_CHARGE",
    GENERAL_CHARGE = "GENERAL_CHARGE",
    GST_FEE = "GST_FEE",
    TAF_FEE = "TAF_FEE",
    INDEX_OPTION_FEE = "INDEX_OPTION_FEE",
    TEFRA_TAX = "TEFRA_TAX",
    STATE_TAX = "STATE_TAX",
    UNKNOWN = "UNKNOWN",
}

export interface FeeValue {
    value: DoubleNumber,
    type: EFeeType,
}

export interface FeeLeg {
    feeValues: FeeValue[],
}

export interface Fees {
    feeLegs: FeeLeg[],
}

export interface CommissionValue {
    value: DoubleNumber,
    type: EFeeType,
}

export interface CommissionLeg {
    commissionValues: CommissionValue[],
}

export interface Commission {
    commissionLegs: CommissionLeg[],
}

export interface CommissionAndFee {
    commission: Commission,
    fee: Fees,
    trueCommission: Commission,
}

export enum ECashEquivalentType {
    SWEEP_VEHICLE = "SWEEP_VEHICLE",
    SAVINGS = "SAVINGS",
    MONEY_MARKET_FUND = "MONEY_MARKET_FUND",
    UNKNOWN = "UNKNOWN",
}

interface AccountsBaseInstrument {
    assetType: EAssetType,
    cusip: string,
    symbol: string,
    description: string,
    instrumentId: Int64Number,
    netChange: DoubleNumber,
}

export interface AccountCashEquivalent extends AccountsBaseInstrument  {
    assetType: EAssetType.CASH_EQUIVALENT,
    type: ECashEquivalentType,
}

export interface AccountEquity extends AccountsBaseInstrument {
    assetType: EAssetType.EQUITY | EAssetType.FUTURE | EAssetType.FOREX | EAssetType.ETF,
}

export interface AccountFixedIncome extends AccountsBaseInstrument {
    assetType: EAssetType.FIXED_INCOME,
    maturityDate: DateString,
    factor: DoubleNumber,
    variableRate: DoubleNumber,
}

export interface AccountMutualFund extends AccountsBaseInstrument {
    assetType: EAssetType.MUTUAL_FUND,
}

export enum EAPICurrencyType {
    USD = "USD",
    CAD = "CAD",
    EUR = "EUR",
    JPY = "JPY",
}

export interface AccountAPIOptionDeliverable {
    symbol: string,
    deliverableUnits: DoubleNumber,
    apiCurrencyType: EAPICurrencyType,
    assetType: EAssetType,
}

export interface AccountOption extends AccountsBaseInstrument {
    assetType: EAssetType.OPTION | EAssetType.FUTURE_OPTION,
    optionDeliverables: AccountAPIOptionDeliverable[],
    putCall: "PUT" | "CALL" | "UNKNOWN",
    optionMultiplier: number,
    type: "VANILLA" | "BINARY" | "BARRIER" | "UNKNOWN",
    underlyingSymbol: string,
}

export type AccountsInstrument = | AccountCashEquivalent | AccountEquity | AccountFixedIncome | AccountMutualFund | AccountOption;

export interface Position {
    shortQuantity: DoubleNumber,
    averagePrice: DoubleNumber,
    currentDayProfitLoss: DoubleNumber,
    currentDayProfitLossPercentage: DoubleNumber,
    longQuantity: DoubleNumber,
    settledLongQuantity: DoubleNumber,
    settledShortQuantity: DoubleNumber,
    agedQuantity: DoubleNumber,
    instrument: AccountsInstrument,
    marketValue: DoubleNumber,
    maintenanceRequirement: DoubleNumber,
    averageLongPrice: DoubleNumber,
    averageShortPrice: DoubleNumber,
    taxLotAverageLongPrice: DoubleNumber,
    taxLotAverageShortPrice: DoubleNumber,
    longOpenProfitLoss: DoubleNumber,
    shortOpenProfitLoss: DoubleNumber,
    previousSessionLongQuantity: DoubleNumber,
    previousSessionShortQuantity: DoubleNumber,
    currentDayCost: DoubleNumber,
}

interface BaseAccount {
    type: "MARGIN" | "CASH",
    accountNumber: string,
    roundTrips: number,
    isDayTrader: boolean,
    isClosingOnlyRestricted: boolean,
    pfcbFlag: boolean,
    positions: Position[],
}

export interface MarginInitialBalance {
    accruedInterest: DoubleNumber,
    availableFundsNonMarginableTrade: DoubleNumber,
    bondValue: DoubleNumber,
    buyingPower: DoubleNumber,
    cashBalance: DoubleNumber,
    cashAvailableForTrading: DoubleNumber,
    cashReceipts: DoubleNumber,
    dayTradingBuyingPower: DoubleNumber,
    dayTradingBuyingPowerCall: DoubleNumber,
    dayTradingEquityCall: DoubleNumber,
    equity: DoubleNumber,
    equityPercentage: DoubleNumber,
    liquidationValue: DoubleNumber,
    longMarginValue: DoubleNumber,
    longOptionMarketValue: DoubleNumber,
    longStockValue: DoubleNumber,
    maintenanceCall: DoubleNumber,
    maintenanceRequirement: DoubleNumber,
    margin: DoubleNumber,
    marginEquity: DoubleNumber,
    moneyMarketFund: DoubleNumber,
    mutualFundValue: DoubleNumber,
    regTCall: DoubleNumber,
    shortMarginValue: DoubleNumber,
    shortOptionMarketValue: DoubleNumber,
    shortStockValue: DoubleNumber,
    totalCash: DoubleNumber,
    isInCall: DoubleNumber,
    unsettledCash: DoubleNumber,
    pendingDeposits: DoubleNumber,
    marginBalance: DoubleNumber,
    shortBalance: DoubleNumber,
    accountValue: DoubleNumber,
}

export interface MarginBalance {
    availableFunds: DoubleNumber,
    availableFundsNonMarginableTrade: DoubleNumber,
    buyingPower: DoubleNumber,
    buyingPowerNonMarginableTrade: DoubleNumber,
    dayTradingBuyingPower: DoubleNumber,
    dayTradingBuyingPowerCall: DoubleNumber,
    equity: DoubleNumber,
    equityPercentage: DoubleNumber,
    longMarginValue: DoubleNumber,
    maintenanceCall: DoubleNumber,
    maintenanceRequirement: DoubleNumber,
    marginBalance: DoubleNumber,
    regTCall: DoubleNumber,
    shortBalance: DoubleNumber,
    shortMarginValue: DoubleNumber,
    sma: DoubleNumber,
    isInCall: DoubleNumber,
    stockBuyingPower: DoubleNumber,
    optionBuyingPower: DoubleNumber,
}

export interface MarginAccount extends BaseAccount {
    type: "MARGIN",
    initialBalances: MarginInitialBalance,
    currentBalances: MarginBalance,
    projectedBalances: MarginBalance,
}

export interface CashInitialBalance {
    accruedInterest: DoubleNumber,
    cashAvailableForTrading: DoubleNumber,
    cashAvailableForWithdrawal: DoubleNumber,
    cashBalance: DoubleNumber,
    bondValue: DoubleNumber,
    cashReceipts: DoubleNumber,
    liquidationValue: DoubleNumber,
    longOptionMarketValue: DoubleNumber,
    longStockValue: DoubleNumber,
    moneyMarketFund: DoubleNumber,
    mutualFundValue: DoubleNumber,
    shortOptionMarketValue: DoubleNumber,
    shortStockValue: DoubleNumber,
    isInCall: DoubleNumber,
    unsettledCash: DoubleNumber,
    cashDebitCallValue: DoubleNumber,
    pendingDeposits: DoubleNumber,
    accountValue: DoubleNumber,
}

export interface CashBalance {
    cashAvailableForTrading: DoubleNumber,
    cashAvailableForWithdrawal: DoubleNumber,
    cashCall: DoubleNumber,
    longNonMarginableMarketValue: DoubleNumber,
    totalCash: DoubleNumber,
    cashDebitCallValue: DoubleNumber,
    unsettledCash: DoubleNumber,
}

export interface CashAccount extends BaseAccount{
    type: "CASH",
    initialBalances: CashInitialBalance,
    currentBalances: CashBalance,
    projectedBalances: CashBalance,
}

export type SecuritiesAccount = | MarginAccount | CashAccount;

export interface Account {
    securitiesAccount: SecuritiesAccount,
}

export interface DateParam {
    date: DateString,
}

export enum EOrderLegType {
    EQUITY = "EQUITY",
    OPTION = "OPTION",
    INDEX = "INDEX",
    MUTUAL_FUND = "MUTUAL_FUND",
    CASH_EQUIVALENT = "CASH_EQUIVALENT",
    FIXED_INCOME = "FIXED_INCOME",
    CURRENCY = "CURRENCY",
    COLLECTIVE_INVESTMENT = "COLLECTIVE_INVESTMENT",
}

export enum EPositionEffect {
    OPENING = "OPENING",
    CLOSING = "CLOSING",
    AUTOMATIC = "AUTOMATIC",
}

export interface OrderLegCollection {
    orderLegType: EOrderLegType,
    legId: Int64Number,
    instrument: AccountsInstrument,
    instruction: EOrderLegInstruction,
    positionEffect: EPositionEffect,
    quantity: DoubleNumber,
    quantityType: EQuantityType,
    divCapGains: EDivCapGains,
    toSymbol: string,
}

export interface ExecutionLeg {
    legId: Int64Number,
    price: DoubleNumber,
    quantity: DoubleNumber,
    mismarkedQuantity: DoubleNumber,
    instrumentId: Int64Number,
    time: DateString,
}

export interface OrderActivity {
    activityType: EOrderActivityType,
    executionType: EOrderExecutionType,
    quantity: DoubleNumber,
    orderRemainingQuantity: DoubleNumber,
    executionLegs: ExecutionLeg[],
}

export interface Order extends OrderRequest {
    requestedDestination: ERequestDestination,
    tag: string,
}

export enum EOrderActivityType {
    EXECUTION = "EXECUTION",
    ORDER_ACTION = "ORDER_ACTION",
}

export interface OrderRequest {
    session: ETradingSession,
    duration: EOrderDuration,
    orderType: EOrderType,
    cancelTime: DateString,
    complexOrderStrategyType: EComplexOrderStrategyType,
    quantity: DoubleNumber,
    filledQuantity: DoubleNumber,
    remainingQuantity: DoubleNumber,
    destinationLinkName: string,
    releaseTime: DateString,
    stopPrice: DoubleNumber,
    stopPriceLinkBasis: EStopPriceLinkBasis,
    stopPriceLinkType: EStopPriceLinkType,
    stopPriceOffset: DoubleNumber,
    stopType: EStopType,
    priceLinkBasis: EPriceLinkBasis,
    priceLinkType: EPriceLinkType,
    price: DoubleNumber,
    taxLotMethod: ETaxLotMethod,
    orderLegCollection: OrderLegCollection[],
    activationPrice: DoubleNumber,
    specialInstruction: ESpecialInstruction,
    orderStrategyType: EOrderStrategyType,
    orderId: Int64Number,
    cancelable: boolean,
    editable: boolean,
    status: EOrderStatus,
    enteredTime: DateString,
    closeTime: DateString,
    accountNumber: Int64Number,
    orderActivityCollection: OrderActivity[],
    replacingOrderCollection: Order[],
    childOrderStrategies: Order[],
    statusDescription: string,
}

export interface PreviewOrder {
    orderId: Int64Number,
    orderStrategy: OrderStrategy,
    orderValidationResult: OrderValidationResult,
    commissionAndFee: CommissionAndFee,
}

export interface ServiceError {
    message: string,
    errors: string[],
}

export interface TransactionBaseInstrument {
    assetType: EAssetType,
    cusip: string,
    symbol: string,
    description: string,
    instrumentId: Int64Number,
    netChange: DoubleNumber,
}

export type TransactionInstrument =
| TransactionCashEquivalent
| CollectiveInvestment
| Currency
| TransactionEquity
| TransactionFixedIncome
| Forex
| Future
| Index
| TransactionMutualFund
| TransactionOption
| Product; 

export interface TransactionCashEquivalent extends TransactionBaseInstrument {
    assetType: EAssetType.CASH_EQUIVALENT,
    type: ECashEquivalentType,
}

export enum ECollectiveInvestmentType {
    UNIT_INVESTMENT_TRUST = "UNIT_INVESTMENT_TRUST",
    EXCHANGE_TRADED_FUND = "EXCHANGE_TRADED_FUND",
    CLOSED_END_FUND = "CLOSED_END_FUND",
    INDEX = "INDEX",
    UNITS = "UNITS",
}

export interface CollectiveInvestment extends TransactionBaseInstrument {
    assetType: EAssetType.COLLECTIVE_INVESTMENT,
    type: ECollectiveInvestmentType,
}

export interface Currency extends TransactionBaseInstrument {
    assetType: EAssetType.CURRENCY,
}

export enum EEquityType {
    COMMON_STOCK = "COMMON_STOCK",
    PREFERRED_STOCK = "PREFERRED_STOCK",
    DEPOSITORY_RECEIPT = "DEPOSITORY_RECEIPT",
    PREFERRED_DEPOSITORY_RECEIPT = "PREFERRED_DEPOSITORY_RECEIPT",
    RESTRICTED_STOCK = "RESTRICTED_STOCK",
    COMPONENT_UNIT = "COMPONENT_UNIT",
    RIGHT = "RIGHT",
    WARRANT = "WARRANT",
    CONVERTIBLE_PREFERRED_STOCK = "CONVERTIBLE_PREFERRED_STOCK",
    CONVERTIBLE_STOCK = "CONVERTIBLE_STOCK",
    LIMITED_PARTNERSHIP = "LIMITED_PARTNERSHIP",
    WHEN_ISSUED = "WHEN_ISSUED",
    UNKNOWN = "UNKNOWN",
}

export interface TransactionEquity extends TransactionBaseInstrument {
    assetType: EAssetType.EQUITY,
    type: EEquityType,
}

export enum EFixedIncomeType {
    BOND_UNIT = "BOND_UNIT",
    CERTIFICATE_OF_DEPOSIT = "CERTIFICATE_OF_DEPOSIT",
    CONVERTIBLE_BOND = "CONVERTIBLE_BOND",
    COLLATERALIZED_MORTGAGE_OBLIGATION = "COLLATERALIZED_MORTGAGE_OBLIGATION",
    CORPORATE_BOND = "CORPORATE_BOND",
    GOVERNMENT_MORTGAGE = "GOVERNMENT_MORTGAGE",
    GNMA_BONDS = "GNMA_BONDS",
    MUNICIPAL_ASSESSMENT_DISTRICT = "MUNICIPAL_ASSESSMENT_DISTRICT",
    MUNICIPAL_BOND = "MUNICIPAL_BOND",
    OTHER_GOVERNMENT = "OTHER_GOVERNMENT",
    SHORT_TERM_PAPER = "SHORT_TERM_PAPER",
    US_TREASURY_BOND = "US_TREASURY_BOND",
    US_TREASURY_BILL = "US_TREASURY_BILL",
    US_TREASURY_NOTE = "US_TREASURY_NOTE",
    US_TREASURY_ZERO_COUPON = "US_TREASURY_ZERO_COUPON",
    AGENCY_BOND = "AGENCY_BOND",
    WHEN_AS_AND_IF_ISSUED_BOND = "WHEN_AS_AND_IF_ISSUED_BOND",
    ASSET_BACKED_SECURITY = "ASSET_BACKED_SECURITY",
    UNKNOWN = "UNKNOWN",
}

export interface TransactionFixedIncome extends TransactionBaseInstrument {
    assetType: EAssetType.FIXED_INCOME,
    type: EFixedIncomeType,
    maturityDate: DateString,
    factor: DoubleNumber,
    multiplier: DoubleNumber,
    variableRate: DoubleNumber,
}

export enum EForexType {
    STANDARD = "STANDARD",
    NBBO = "NBBO",
    UNKNOWN = "UNKNOWN",
}

export interface Forex extends TransactionBaseInstrument {
    assetType: EAssetType.FOREX,
    type: EForexType,
    baseCurrency: Currency,
    counterCurrency: Currency,
}

export interface Future extends TransactionBaseInstrument {
    assetType: EAssetType.FUTURE,
    activeContract: boolean,
    type: "STANDARD" | "UNKNOWN",
    expirationDate: DateString,
    lastTradingDate: DateString,
    firstNoticeDate: DateString,
    multiplier: DoubleNumber,
}

export interface Index extends TransactionBaseInstrument {
    assetType: EAssetType.INDEX,
    activeContract: boolean,
    type: "BROAD_BASED" | "NARROW_BASED" | "UNKNOWN",
}

export enum EMutualFundType {
    NOT_APPLICABLE = "NOT_APPLICABLE",
    OPEN_END_NON_TAXABLE = "OPEN_END_NON_TAXABLE",
    OPEN_END_TAXABLE = "OPEN_END_TAXABLE",
    NO_LOAD_NON_TAXABLE = "NO_LOAD_NON_TAXABLE",
    NO_LOAD_TAXABLE = "NO_LOAD_TAXABLE",
    UNKNOWN = "UNKNOWN",
}

export interface TransactionMutualFund {
    fundFamilyName: string,
    fundFamilySymbol: string,
    fundGroup: string,
    type: EMutualFundType,
    exchangeCutoffTime: DateString,
    purchaseCutoffTime: DateString,
    redemptionCutoffTime: DateString,
}

export interface TransactionOption {
    assetType: EAssetType.OPTION,
    expirationDate: DateString,
    optionDeliverables: TransactionAPIOptionDeliverable[],
    optionPremiumMultiplier: Int64Number,
    putCall: "PUT" | "CALL" | "UNKNOWN",
    strikePrice: DoubleNumber,
    type: "VANILLA" | "BINARY" | "BARRIER" | "UNKNOWN",
    underlyingSymbol: string,
    underlyingCusip: string,
    deliverable: TransactionInstrument,
}

export interface Product extends TransactionBaseInstrument {
    type: EProductType,
}

export enum EProductType {
    TBD = "TBD",
    UNKNOWN = "UNKNOWN",
}

export interface TransactionAPIOptionDeliverable {
    rootSymbol: string,
    strikePercent: Int64Number,
    deliverableNumber: Int64Number,
    deliverableUnits: DoubleNumber,
    deliverable: TransactionInstrument,
    assetType: EAssetType,
}

export enum ETransactionType {
    TRADE = "TRADE",
    RECEIVE_AND_DELIVER = "RECEIVE_AND_DELIVER",
    DIVIDEND_OR_INTEREST = "DIVIDEND_OR_INTEREST",
    ACH_RECEIPT = "ACH_RECEIPT",
    ACH_DISBURSEMENT = "ACH_DISBURSEMENT",
    CASH_RECEIPT = "CASH_RECEIPT",
    CASH_DISBURSEMENT = "CASH_DISBURSEMENT",
    ELECTRONIC_FUND = "ELECTRONIC_FUND",
    WIRE_OUT = "WIRE_OUT",
    WIRE_IN = "WIRE_IN",
    JOURNAL = "JOURNAL",
    MEMORANDUM = "MEMORANDUM",
    MARGIN_CALL = "MARGIN_CALL",
    MONEY_MARKET = "MONEY_MARKET",
    SMA_ADJUSTMENT = "SMA_ADJUSTMENT",
}

export enum ESubAccountType {
    CASH = "CASH",
    MARGIN = "MARGIN",
    SHORT = "SHORT",
    DIV = "DIV",
    INCOME = "INCOME",
    UNKNOWN = "UNKNOWN",
}

export enum EActivityType {
    ACTIVITY_CORRECTION = "ACTIVITY_CORRECTION",
    EXECUTION = "EXECUTION",
    ORDER_ACTION = "ORDER_ACTION",
    TRANSFER = "TRANSFER",
    UNKNOWN = "UNKNOWN",
}

export interface Transaction {
    activityId: Int64Number,
    time: DateString,
    user: UserDetails,
    description: string,
    accountNumber: string,
    type: ETransactionType,
    subAccount: ESubAccountType,
    tradeDate: DateString,
    settlementDate: DateString,
    positionId: Int64Number,
    orderId: Int64Number,
    netAmount: DoubleNumber,
    activityType: EActivityType,
    transferItems: TransferItem[],
}

export interface UserDetails {
    cdDomainId: string,
    login: string,
    type: EUserType,
    userId: Int64Number,
    systemUserName: string,
    firstName: string,
    lastName: string,
    brokerRepCode: string,
}

export interface TransferItem {
    instrument: TransactionInstrument,
    amount: DoubleNumber,
    cost: DoubleNumber,
    price: DoubleNumber,
    feeType: EFeeType,
    positionEffect: EPositionEffect,
}
    
export type UserPreferenceAccount = {
    accountNumber: string;
    primaryAccount: boolean;
    type: string;
    nickName: string;
    accountColor: "Blue" | "Green";
    displayAcctId: string;
    autoPositionEffect: boolean;
};

export type StreamerInfo = {
    streamerSocketUrl: string;
    schwabClientCustomerId: string;
    schwabClientCorrelId: string;
    schwabClientChannel: string;
    schwabClientFunctionId: string;
};

export enum EUserType {
    ADVISOR_USER = "ADVISOR_USER",
    BROKER_USER = "BROKER_USER",
    CLIENT_USER = "CLIENT_USER",
    SYSTEM_USER = "SYSTEM_USER",
    UNKNOWN = "UNKNOWN",
}

export type Offer = {
    level2Permissions: boolean;
    mktDataPermission: string;
};


export type UserPreference = {
    accounts: UserPreferenceAccount[];
    streamerInfo: StreamerInfo[];
    offers: Offer[];
};
