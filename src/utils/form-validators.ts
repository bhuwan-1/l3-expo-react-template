import PhoneUtils from '@template/utils/phone-utils';

abstract class FormValidators {
  static required(value: any) {
    return value ? undefined : 'ERROR_REQUIRED';
  }

  static arrayMinLength(value: any[]) {
    if (!Array.isArray(value)) return;
    if (value.length < 1) return 'ERROR_REQUIRED';
  }

  static number(value: string) {
    return /^[0-9]+$/.test(value) ? undefined : 'ERROR_NOT_NUMBER';
  }

  static email(value: string) {
    if (!value) return undefined;
    return !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)
      ? 'ERROR_INVALID_EMAIL'
      : undefined;
  }

  static minLength(min: number, customError?: string) {
    return (value: string | any[]) =>
      (value?.length ?? 0) >= min
        ? undefined
        : customError ?? 'ERROR_MIN_LENGTH';
  }

  static maxLength<T extends { length: number }>(
    max: number,
    customError?: string
  ) {
    return (value: T) =>
      (value?.length ?? 0) <= max
        ? undefined
        : customError ?? 'ERROR_MAX_LENGTH';
  }

  static phone(value: string) {
    if (!value) return undefined;
    return PhoneUtils.validatePhoneNumber(value)
      ? undefined
      : 'ERROR_INVALID_PHONE';
  }

  static compose(
    ...validators: ((value: any, allValues: any) => any | undefined)[]
  ) {
    return (value: any, allValues: any) =>
      validators.reduce(
        (error: string | undefined, validator) =>
          error || validator(value, allValues),
        undefined
      );
  }

  static minSpecialChars = (min: number) => (value: string) => {
    if (!value) return undefined;
    return (value.match(/[!@#$%^&*(),.?":{}|<>]/g)?.length ?? 0) >= min
      ? undefined
      : 'ERROR_MIN_SPECIAL_CHARS';
  };

  static percentage(value: string) {
    const numberValue = typeof value === 'string' ? parseFloat(value) : value;
    return isNaN(numberValue) || numberValue < 0 || numberValue > 100
      ? 'ERROR_INVALID_PERCENTAGE'
      : undefined;
  }

  static confirmPassword(value: any, allValues: any) {
    const password = allValues.password;
    const confirmPassword = value;
    return password === confirmPassword ? undefined : 'ERROR_PASSWORD_MISMATCH';
  }

  static ahvNumber(value: string) {
    if (!value) return undefined;
    // AHV number format: 000.0000.0000.00 (11 digits with dots)
    const ahvRegex = /^\d{3}\.\d{4}\.\d{4}\.\d{2}$/;
    return ahvRegex.test(value) ? undefined : 'ERROR_INVALID_AHV_FORMAT';
  }
  static validateTime = (value: string) => {
    if (!value) return 'ERROR_REQUIRED';

    // Check if format is complete (HH:MM:SS)
    const timeRegex = /^([0-1]\d|2[0-3]):([0-5]\d):([0-5]\d)$/;

    return timeRegex.test(value) ? undefined : 'ERROR_INVALID_TIME_FORMAT';
  };
}

export default FormValidators;
