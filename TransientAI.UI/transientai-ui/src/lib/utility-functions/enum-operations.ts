export type KeyValuePair = { key: string, value: string|number };

export function enumToKeyValuePair<T extends { [key: string]: number | string }>(enumObj: T): KeyValuePair[] {
    return Object.entries(enumObj)
        .filter(([key]) => isNaN(Number(key)))
        .map(([key, value]) => ({
            key, value
        }));
}


export function stringToEnum<T>(enumType: T, str: string): T[keyof T] | undefined {
    if (Object.values(enumType as any).includes(str as T[keyof T])) {
        return str as T[keyof T];
    }
    return undefined;
}