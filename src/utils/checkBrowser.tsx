interface NavigatorUADataBrand {
  brand: string;
  version: string;
}

interface NavigatorUAData {
  brands: NavigatorUADataBrand[];
  mobile?: boolean;
  platform?: string;
}

interface NavigatorWithUAData extends Navigator {
  userAgentData?: NavigatorUAData;
}

function isChrome(): boolean {
  if (typeof navigator === 'undefined') return false;

  const ua = navigator.userAgent || '';
  const nav = navigator as NavigatorWithUAData;
  const brands = nav.userAgentData?.brands;

  if (brands && brands.length) {
    const names = brands.map(b => b.brand);
    const isGoogleChrome = names.includes('Google Chrome');
    const isEdge = names.includes('Microsoft Edge');
    return isGoogleChrome && !isEdge;
  }

  const isChromiumBased = /(Chrome|CriOS)/i.test(ua);
  const isEdge = /(Edg|EdgiOS|EdgA)/i.test(ua);
  return isChromiumBased && !isEdge;
}

function isSafari(): boolean {
  if (typeof navigator === 'undefined') return false;

  const ua = navigator.userAgent || '';
  const hasSafari = /Safari/i.test(ua);
  const notChromium = !/(Chrome|CriOS|Edg|OPR|OPiOS)/i.test(ua);
  const notAndroid = !/Android/i.test(ua);
  return hasSafari && notChromium && notAndroid;
}

export function isSupportedBrowser(): boolean {
  return isChrome() || isSafari();
}
