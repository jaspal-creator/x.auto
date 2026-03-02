export const oneMonthBack = (): Date => {
  const now = new Date();
  const _ = new Date();
  _.setMonth(_.getMonth() - 1);
  _.setHours(now.getHours());
  _.setMinutes(now.getMinutes());
  _.setMilliseconds(now.getMilliseconds());
  return _;
};

export const InitDate = (date: Date) => {
  const now = new Date();
  date.setHours(now.getHours());
  date.setMinutes(now.getMinutes());
  date.setMilliseconds(now.getMilliseconds());
  return date;
};
