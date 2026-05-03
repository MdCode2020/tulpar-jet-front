import { bootstrapApplication } from '@angular/platform-browser';
import { registerLocaleData } from '@angular/common';
import localeTr from '@angular/common/locales/tr';
import localeEn from '@angular/common/locales/en';
import localeAr from '@angular/common/locales/ar';
import localeRu from '@angular/common/locales/ru';
import localeDe from '@angular/common/locales/de';
import localeZh from '@angular/common/locales/zh';
import { appConfig } from './app/app.config';
import { App } from './app/app';

registerLocaleData(localeTr, 'tr');
registerLocaleData(localeEn, 'en');
registerLocaleData(localeAr, 'ar');
registerLocaleData(localeRu, 'ru');
registerLocaleData(localeDe, 'de');
registerLocaleData(localeZh, 'zh');

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
