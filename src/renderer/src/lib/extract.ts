export const extract = <T = any>(data: any, key: string): T | undefined => {
  return key.split('.').reduce((acc: T, key: string) => {
    if (acc && Object.prototype.hasOwnProperty.call(acc, key)) {
      return acc[key];
    } else {
      return undefined as undefined;
    }
  }, data);
};
