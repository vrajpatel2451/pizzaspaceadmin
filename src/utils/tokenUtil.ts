import { LocalStorageUtil } from "./localStorageUtil";

const TOKEN_KEY = "fb-admin-token";

export const TokenUtil = {
  setToken(token: string): void {
    LocalStorageUtil.setItem<string>(TOKEN_KEY, token);
  },

  getToken(): string | null {
    return LocalStorageUtil.getItem<string>(TOKEN_KEY);
  },

  removeToken(): void {
    LocalStorageUtil.removeItem(TOKEN_KEY);
  },
};
