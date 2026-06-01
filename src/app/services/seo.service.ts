import { Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

export interface SeoData {
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  seoUrl?: string;
}

@Injectable({
  providedIn: 'root'
})
export class SeoService {
  constructor(
    private titleService: Title,
    private metaService: Meta
  ) {}

  setSeoData(seoData: SeoData): void {
    // Set title if not empty
    if (seoData.seoTitle && seoData.seoTitle.trim()) {
      this.titleService.setTitle(seoData.seoTitle);
    }

    // Set description meta tag if not empty
    if (seoData.seoDescription && seoData.seoDescription.trim()) {
      this.metaService.updateTag({
        name: 'description',
        content: seoData.seoDescription
      });
    }

    // Set keywords meta tag if not empty
    if (seoData.seoKeywords && seoData.seoKeywords.trim()) {
      this.metaService.updateTag({
        name: 'keywords',
        content: seoData.seoKeywords
      });
    }

    // Set og:title meta tag if not empty
    if (seoData.seoTitle && seoData.seoTitle.trim()) {
      this.metaService.updateTag({
        property: 'og:title',
        content: seoData.seoTitle
      });
    }

    // Set og:description meta tag if not empty
    if (seoData.seoDescription && seoData.seoDescription.trim()) {
      this.metaService.updateTag({
        property: 'og:description',
        content: seoData.seoDescription
      });
    }

    // Set og:url meta tag if not empty
    if (seoData.seoUrl && seoData.seoUrl.trim()) {
      this.metaService.updateTag({
        property: 'og:url',
        content: seoData.seoUrl
      });
    }
  }

  resetSeoData(): void {
    // Reset to default values
    this.titleService.setTitle('Tulpar Jet | Özel Uçuş Hizmetleri');
    this.metaService.updateTag({
      name: 'description',
      content: 'Tulpar Jet — Özel jet charter hizmetleri ile siz ve sevdiklerinizi güvenle uçuruyoruz.'
    });
    this.metaService.updateTag({
      name: 'keywords',
      content: 'jet charter, private jet, özel uçuş'
    });
  }
}
