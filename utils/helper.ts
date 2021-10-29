export function sleep(ms: number = 1000) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function isFunction(functionToCheck: any): boolean {
  return (
    functionToCheck && {}.toString.call(functionToCheck) === '[object Function]'
  );
}

export function isObject(objectToCheck: any): boolean {
  return typeof objectToCheck === 'object' && objectToCheck !== null;
}
