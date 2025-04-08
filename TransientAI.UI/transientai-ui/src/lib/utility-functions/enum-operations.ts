export type KeyValuePair = { key: string, value: string|number };

export function enumToKeyValuePair<T extends { [key: string]: number | string }>(enumObj: T): KeyValuePair[] {
    return Object.entries(enumObj)
        .filter(([key]) => isNaN(Number(key)))
        .map(([key, value]) => ({
            key, value
        }));
}