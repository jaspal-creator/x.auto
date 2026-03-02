import { Between, FindOperator } from 'typeorm';

export const BetweenDates = (from: Date, to: Date): FindOperator<Date> => {
  return Between<Date>(
    new Date(
      from.getFullYear(),
      from.getMonth(),
      from.getDate(),
      from.getHours(),
      from.getMinutes(),
      from.getMilliseconds()
    ),
    new Date(
      to.getFullYear(),
      to.getMonth(),
      to.getDate(),
      to.getHours(),
      to.getMinutes(),
      to.getMilliseconds()
    )
  );
};
