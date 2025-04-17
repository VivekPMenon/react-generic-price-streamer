export function removeDuplicates<T>(array: T[], property: keyof T): T[] {
    if (!array || !Array.isArray(array) || array.length === 0) {
        return [];
    }
    const seen = new Set();
    return array.filter(item => {
        const value = item[property];
        if (seen.has(value)) {
            return false;
        }
        seen.add(value);
        return true;
    });
}