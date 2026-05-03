import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class LoaderService {
  private platformId = inject(PLATFORM_ID);

  get isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  show(): void {
    if (!this.isBrowser) return;
    const loader = document.getElementById('app-loader');
    if (loader) {
      loader.style.opacity = '1';
      loader.style.pointerEvents = 'auto';
    }
  }

  hide(): void {
    if (!this.isBrowser) return;
    const loader = document.getElementById('app-loader');
    if (loader) {
      loader.style.opacity = '0';
      loader.style.pointerEvents = 'none';
    }
  }
}
