import isEqualWith from 'lodash/isEqualWith';

const customizer = (val1, val2) => {
  // Treat null, undefined, and '' as equal
  const isEmpty = v => v === null || v === undefined || v === '';
  if (isEmpty(val1) && isEmpty(val2)) return true;

  // Let lodash handle deep equality for other types
  return undefined;
};

const isFormEqual = (initialData, latestData) => {
  return isEqualWith(initialData, latestData, customizer);
};
