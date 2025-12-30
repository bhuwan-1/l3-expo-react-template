import { AsYouType } from 'libphonenumber-js';
import { Linking } from 'react-native';

abstract class PhoneUtils {
  static formatPhoneNumber(number: string | number | undefined | null) {
    if (!number || !PhoneUtils.validatePhoneNumber(number)) {
      return number ?? '';
    }

    const asYouType = new AsYouType();
    return asYouType.input(number.toString());
  }

  static validatePhoneNumber(number: string | number | undefined | null) {
    if (!number) return false;
    const asYouType = new AsYouType();
    asYouType.input(number.toString());
    return asYouType.isValid();
  }

  static openInWhatsApp(phone: string | undefined) {
    if (!phone) return;
    Linking.openURL('https://wa.me/' + phone.replace(/(\+| )/g, ''));
  }

  static async openDialer(phone: string | undefined) {
    if (!phone) return;
    const phoneUri = `tel://${phone.replace(/(\+| )/g, '')}`;
    Linking.openURL(phoneUri);
  }

  static dialCodeFromPhone(phone: string | undefined) {
    if (!phone) return '';
    const asYouType = new AsYouType();
    asYouType.input(phone);
    return '+'.concat(asYouType.getCallingCode() ?? '');
  }

  static getNationalNumber(phone: string | undefined) {
    if (!phone) return '';
    const asYouType = new AsYouType();
    asYouType.input(phone);
    return asYouType.getNationalNumber();
  }
}

export default PhoneUtils;
