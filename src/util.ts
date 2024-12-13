// Copyright (C) 2024  Aaron Satterlee

export function queryStringlike(stringlike: string | string[]): string {
    if (Array.isArray(stringlike)) {
        return encodeURIComponent(stringlike.join(","));
    }
    return encodeURIComponent(stringlike);
}
