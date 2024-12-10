/**
 * @ref https://html.spec.whatwg.org/multipage/input.html#valid-e-mail-address
 */
const EMAIL_REG_EXP =
  /^[\w.!#$%&'*+/=?^`{|}~-]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)*$/i;

export function isValidEmail(email: string): boolean {
  return EMAIL_REG_EXP.test(email);
}
