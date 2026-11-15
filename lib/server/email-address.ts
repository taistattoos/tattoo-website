// One strict email check for both forms. The shop sends its confirmation *to* this address, so it must be
// a single plain address: no commas, quotes, spaces, angle brackets or semicolons that a mailer could read
// as extra recipients or display names.
const EMAIL_PATTERN = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/;

export function isValidEmail(value: string): boolean {
  return value.length <= 254 && EMAIL_PATTERN.test(value);
}
