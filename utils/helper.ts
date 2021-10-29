export function sleep(ms: number = 1000) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function isFunction(functionToCheck: any) {
  return (
    functionToCheck && {}.toString.call(functionToCheck) === '[object Function]'
  );
}
