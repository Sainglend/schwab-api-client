// Copyright (C) 2024  Aaron Satterlee

import { format } from "util";

/*
* Checks if the given error is an instance of any of the specified error types.
*
* @param err - The error object to check.
* @param errorTypes - The list of error types to check against.
* @returns `true` if the error is an instance of any of the specified error types, `false` otherwise.
*/
function isErrorOfType(
    err: any,
    ...errorTypes: Array<new (...args: any[]) => Error>
): boolean {
    if (!err) return false;
    return errorTypes.some(errorType => err instanceof errorType);
}


function stringifyError(err: any) {
    return JSON.stringify(err, (_, value) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return value instanceof Error ? format(value) : value;
    });
}

abstract class CustomError extends Error {
    public readonly statusCode: number;

    public constructor(msg: string, httpStatus = 400) {
        super(msg);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
        this.statusCode = httpStatus;
    }

    public toJSON() {
        return {
            error: {
                message: this.message,
                statusCode: this.statusCode,
            },
        };
    }

    public toString() {
        return stringifyError(this);
    }
}

export class SchwabApiError extends CustomError {
    public static isSchwabApiError(err: any): boolean {
        return isErrorOfType(err, SchwabApiError);
    }

    public static asRemoteApiError(err: any): SchwabApiError | undefined {
        return SchwabApiError.isSchwabApiError(err)
            ? err as SchwabApiError
            : undefined;
    }

    public readonly reason?: any;

    public toJSON() {
        return {
            error: {
                message: this.message,
                statusCode: this.statusCode,
                reason: this.reason,
            },
        };
    }

    public constructor(httpStatus: number, msg: string, reason?: any) {
        super(msg, httpStatus);
        this.reason = reason;
    }
}

export class ExpiredAccessTokenError extends CustomError {
    public static isExpiredAccessTokenError(err: any): boolean {
        return isErrorOfType(err, ExpiredAccessTokenError);
    }

    public static asExpiredAccessTokenError(err: any): ExpiredAccessTokenError | undefined {
        return ExpiredAccessTokenError.isExpiredAccessTokenError(err)
            ? err as ExpiredAccessTokenError
            : undefined;
    }

    public readonly reason?: any;

    public constructor(httpStatus: number, msg: string, reason?: any) {
        super(msg, httpStatus);
        this.reason = reason;
    }

    public toJSON() {
        return {
            error: {
                statusCode: this.statusCode,
                message: this.message,
                reason: this.reason,
            },
        };
    }
}

export class ExpiredAuthorizationCodeError extends CustomError {
    public static isExpiredAuthorizationCodeError(err: any): boolean {
        return isErrorOfType(err, ExpiredAuthorizationCodeError);
    }

    public static asExpiredAuthorizationCodeError(err: any): ExpiredAuthorizationCodeError | undefined {
        return ExpiredAuthorizationCodeError.isExpiredAuthorizationCodeError(err)
            ? err as ExpiredAuthorizationCodeError
            : undefined;
    }

    public readonly reason?: any;

    public constructor(httpStatus: number, msg: string, reason?: any) {
        super(msg, httpStatus);
        this.reason = reason;
    }

    public toJSON() {
        return {
            error: {
                statusCode: this.statusCode,
                message: this.message,
                reason: this.reason,
            },
        };
    }
}

export class InvalidAuthorizationCodeError extends CustomError {
    public static isInvalidAuthorizationCodeError(err: any): boolean {
        return isErrorOfType(err, InvalidAuthorizationCodeError);
    }

    public static asInvalidAuthorizationCodeError(err: any): InvalidAuthorizationCodeError | undefined {
        return InvalidAuthorizationCodeError.isInvalidAuthorizationCodeError(err)
            ? err as InvalidAuthorizationCodeError
            : undefined;
    }

    public readonly reason?: any;

    public constructor(httpStatus: number, msg: string, reason?: any) {
        super(msg, httpStatus);
        this.reason = reason;
    }

    public toJSON() {
        return {
            error: {
                statusCode: this.statusCode,
                message: this.message,
                reason: this.reason,
            },
        };
    }
}

export class InvalidRefreshTokenError extends CustomError {
    public static isInvalidRefreshTokenError(err: any): boolean {
        return isErrorOfType(err, InvalidRefreshTokenError);
    }

    public static asInvalidRefreshTokenError(err: any): InvalidRefreshTokenError | undefined {
        return InvalidRefreshTokenError.isInvalidRefreshTokenError(err)
            ? err as InvalidRefreshTokenError
            : undefined;
    }

    public readonly reason?: any;

    public constructor(httpStatus: number, msg: string, reason?: any) {
        super(msg, httpStatus);
        this.reason = reason;
    }

    public toJSON() {
        return {
            error: {
                statusCode: this.statusCode,
                message: this.message,
                reason: this.reason,
            },
        };
    }
}
