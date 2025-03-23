import isEqualWith from 'lodash/isEqualWith';

const customizer = (val1: any, val2: any) => {
  // Treat null, undefined, and '' as equal
  const isEmpty = (v: any) => v === null || v === undefined || v === '';
  if (isEmpty(val1) && isEmpty(val2)) return true;

  // Let lodash handle deep equality for other types
  return undefined;
};

export function areObjectsEqual<T>(initialData: T, latestData: T) {
  return isEqualWith(initialData, latestData, customizer);
}
