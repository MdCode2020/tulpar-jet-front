import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import tr from '../../assets/i18n/tr.json';
import en from '../../assets/i18n/en.json';
import ar from '../../assets/i18n/ar.json';
import ru from '../../assets/i18n/ru.json';
import de from '../../assets/i18n/de.json';
import zh from '../../assets/i18n/zh.json';

type Translations = Record<string, string>;

@Injectable({ providedIn: 'root' })
export class TranslationService {
  private platformId = inject(PLATFORM_ID);
  private translations: Translations;
  readonly currentLangId: string;

  constructor() {
    this.currentLangId = isPlatformBrowser(this.platformId)
      ? (localStorage.getItem('lang') ?? '2')
      : '2';
    this.translations = this.load(this.currentLangId);
  }

  private load(id: string): Translations {
    switch (id) {
      case '1': return en as Translations;
      case '3': return ar as Translations;
      case '4': return ru as Translations;
      case '5': return de as Translations;
      case '6': return zh as Translations;
      default:  return tr as Translations;
    }
  }

  get(key: string): string {
    return this.translations[key] ?? key;
  }

  isRtl(): boolean {
    return this.currentLangId === '3';
  }
}
