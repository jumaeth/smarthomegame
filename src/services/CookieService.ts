export class CookieService {

  static areCookiesAllowed():boolean{
    return this.get("cookieConsent") === true;
  }

  static set<T>(name: string, value: T, days: number = 365): void {
    if (this.areCookiesAllowed() || name === "cookieConsent"){
      const encodedValue = encodeURIComponent(JSON.stringify(value));
      const expires = new Date(Date.now() + days * 864e5).toUTCString();
      document.cookie = `${name}=${encodedValue}; expires=${expires}; path=/`;
    }
  }

  static get<T>(name: string): T | null {
    const cookies = document.cookie.split("; ");
    for (const cookie of cookies) {
      const [key, val] = cookie.split("=");
      if (key === name) {
        try {
          return JSON.parse(decodeURIComponent(val)) as T;
        } catch {
          return null;
        }
      }
    }
    return null;
  }

  static delete(name: string): void {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
  }
}
