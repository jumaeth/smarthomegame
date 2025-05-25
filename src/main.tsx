import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

import { I18nProvider } from '@lingui/react';
import { i18n } from '@lingui/core';
import messages from './locales/de/messages.json';

i18n.load('de', messages);
i18n.activate('de');

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <I18nProvider i18n={i18n}>
      <App />
    </I18nProvider>
  </StrictMode>,
)
