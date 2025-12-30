import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

// We will need the platform check to support web and native.
// If you are only developing for native, you can remove the platform check.
abstract class StorageService {
  static getItem(key: string): string | Promise<string | null> | null {
    return Platform.OS === "web"
      ? localStorage.getItem(key)
      : AsyncStorage.getItem(key);
  }
  static setItem(key: string, value: string): void | Promise<void> {
    return Platform.OS === "web"
      ? localStorage.setItem(key, value)
      : AsyncStorage.setItem(key, value);
  }
  static removeItem(key: string): void | Promise<void> {
    return Platform.OS === "web"
      ? localStorage.removeItem(key)
      : AsyncStorage.removeItem(key);
  }
}

export default StorageService;
