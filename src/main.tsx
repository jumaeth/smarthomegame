import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import App from './App.tsx'

import {I18nProvider} from '@lingui/react';
import {i18n} from '@lingui/core';
import {messages as enMessages} from "./locales/en/messages";
import {messages as deMessages} from "./locales/de/messages";

class ConsoleSuppressor {
  static suppressOnProd(): void {
    if (!import.meta.env.PROD) {
      return;
    }

    console.log = () => {}
    console.info = () => {}
    console.warn = () => {}
    console.error = () => {}
    window.addEventListener('error', (e) => e.preventDefault());
    window.addEventListener('unhandledrejection', (e) => {
      // Typen: PromiseRejectionEvent in modernen Umgebungen
      (e as PromiseRejectionEvent).preventDefault();
    });
  }
}


// Unterdrückung vor dem Rendern aktivieren (nur in Produktion)
ConsoleSuppressor.suppressOnProd();

function getLocaleFromCookie() {
  const match = document.cookie.match(/(?:^|; )locale=([^;]*)/);
  return match ? match[1] : "en";
}

i18n.load({
  en: enMessages,
  de: deMessages,
});
i18n.activate(getLocaleFromCookie());


createRoot(document.getElementById('root')!).render(
        <StrictMode>
          <I18nProvider i18n={i18n}>
            <App/>
          </I18nProvider>
        </StrictMode>,
)