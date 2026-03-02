export const expiresIn = ({ days = 0 }: { days: number }) => {
  const expired = new Date();
  expired.setDate(expired.getDate() + days);
  return expired.getTime();
};
