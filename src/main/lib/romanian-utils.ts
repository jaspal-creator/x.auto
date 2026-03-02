interface IRomanianUtils {
  month: () => string;
  year: () => number;
  time_stamp: () => string;
}

export const RomaninaDateUtils: IRomanianUtils = {
  month: (): string => {
    return new Intl.DateTimeFormat('ro-RO', {
      month: 'long'
    }).format(new Date());
  },
  year: (): number => {
    return new Date().getFullYear();
  },
  time_stamp: () => {
    return new Intl.DateTimeFormat('ro-RO', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric'
    })
      .format(new Date())
      .replace(/:/g, '.')
      .replace(/ /g, '-')
      .replace(/,/g, '');
  }
};
