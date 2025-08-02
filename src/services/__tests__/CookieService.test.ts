import { CookieService } from "../CookieService";

describe("CookieService", () => {
  beforeEach(() => {
    const cookieStore = new Map<string, string>();

    Object.defineProperty(global, "document", {
      configurable: true,
      value: {
        get cookie() {
          return Array.from(cookieStore.entries())
                  .map(([k, v]) => `${k}=${v}`)
                  .join("; ");
        },
        set cookie(value: string) {
          const [cookiePart] = value.split(";");
          const [name, ...rest] = cookiePart.split("=");
          const cookieValue = rest.join("=");

          if (/expires=Thu, 01 Jan 1970 00:00:00 GMT/.test(value)) {
            cookieStore.delete(name.trim());
          } else {
            cookieStore.set(name.trim(), cookieValue);
          }
        },
      },
    });
  });

  test("set and get string value", () => {
    CookieService.set("cookieConsent", true);
    CookieService.set("testString", "hello");
    const result = CookieService.get<string>("testString");
    expect(result).toBe("hello");
  });

  test("set and get number value", () => {
    CookieService.set("cookieConsent", true);
    CookieService.set("testNumber", 42);
    const result = CookieService.get<number>("testNumber");
    expect(result).toBe(42);
  });

  test("set and get object value", () => {
    CookieService.set("cookieConsent", true);
    const obj = { a: 1, b: "text" };
    CookieService.set("testObject", obj);
    const result = CookieService.get<typeof obj>("testObject");
    expect(result).toEqual(obj);
  });

  test("set and get array value", () => {
    CookieService.set("cookieConsent", true);
    const arr = [1, 2, 3];
    CookieService.set("testArray", arr);
    const result = CookieService.get<number[]>("testArray");
    expect(result).toEqual(arr);
  });

  test("get returns null for non-existent cookie", () => {
    const result = CookieService.get<string>("missing");
    expect(result).toBeNull();
  });

  test("get returns null for invalid JSON", () => {
    CookieService.set("cookieConsent", true);
    document.cookie = "badJson=%7Bnotvalid%3A%22data%22%7D";
    const result = CookieService.get("badJson");
    expect(result).toBeNull();
  });

  test("delete removes cookie", () => {
    CookieService.set("cookieConsent", true);
    CookieService.set("toDelete", "value");
    CookieService.delete("toDelete");
    const result = CookieService.get("toDelete");
    expect(result).toBeNull();
  });

  test("set does not store cookie if consent is false", () => {
    CookieService.set("cookieConsent", false);
    CookieService.set("blockedCookie", "blocked");
    const result = CookieService.get("blockedCookie");
    expect(result).toBeNull();
  });

  test("cookieConsent can always be set", () => {
    CookieService.set("cookieConsent", true);
    const result = CookieService.get("cookieConsent");
    expect(result).toBe(true);
  });
});

