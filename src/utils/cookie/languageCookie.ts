export function getLocaleFromCookie() {
  const match = document.cookie.match(/(?:^|; )locale=([^;]*)/);
  return match ? match[1] : "en";
}

export function setLocaleCookie(locale: string) {
  document.cookie = `locale=${locale}; path=/; max-age=31536000`; // 1 year
}