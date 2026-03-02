/**
 * Check if a report is expired
 * @param expires_at - The expiration date of the report
 * @returns boolean - true if the report is expired, false otherwise
 */
export const isReportExpired = (expires_at: Date | string): boolean => {
  const now = new Date().getTime();
  const expirationTime = new Date(expires_at).getTime();
  return now > expirationTime;
};
