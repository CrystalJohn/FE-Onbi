/**
 * Translates backend API error messages (often in English) to Vietnamese
 */
export function translateAuthError(
  msg?: string | string[],
  defaultMsg: string = 'Đã có lỗi xảy ra'
): string {
  if (!msg) return defaultMsg;
  const rawMsg = Array.isArray(msg) ? msg[0] : msg;
  if (typeof rawMsg !== 'string') return defaultMsg;

  const lower = rawMsg.toLowerCase();

  if (
    lower.includes('invalid email or password') ||
    lower.includes('invalid credentials') ||
    lower.includes('unauthorized')
  ) {
    return 'Email hoặc mật khẩu không đúng';
  }
  if (
    lower.includes('already exists') ||
    lower.includes('already in use')
  ) {
    return 'Email hoặc số điện thoại đã được sử dụng';
  }
  if (lower.includes('user not found') || lower.includes('cannot find user')) {
    return 'Tài khoản không tồn tại trên hệ thống';
  }
  if (lower.includes('invalid otp') || lower.includes('expired')) {
    return 'Mã OTP không đúng hoặc đã hết hạn';
  }
  if (lower.includes('must be an email') || lower.includes('email must be')) {
    return 'Địa chỉ email không đúng định dạng';
  }
  if (lower.includes('password must be') || lower.includes('weak password')) {
    return 'Mật khẩu quá ngắn hoặc chưa đủ độ bảo mật';
  }

  return rawMsg;
}
