import { Component, inject, Inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, RouterOutlet, NavigationStart, NavigationEnd, NavigationError, NavigationCancel } from '@angular/router';
import { filter } from 'rxjs';
import { TranslationService } from './services/translation.service';
import { LoaderService } from './services/loader.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  protected readonly title = signal('tulpar-jet-front');
  private ts = inject(TranslationService);
  private router = inject(Router);
  private loaderService = inject(LoaderService);

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      if (this.ts.isRtl()) {
        document.documentElement.dir = 'rtl';
        document.documentElement.lang = 'ar';
      } else {
        document.documentElement.dir = 'ltr';
      }

      // Navigasyon başladığında loader'ı aç
      this.router.events.pipe(
        filter(e => e instanceof NavigationStart)
      ).subscribe(() => {
        this.loaderService.show();
      });

      // Navigasyon bittiğinde: ana sayfa değilse loader'ı kapat
      // Ana sayfa kendi API verisi gelince loader'ı kendisi kapatır
      this.router.events.pipe(
        filter(e => e instanceof NavigationEnd || e instanceof NavigationError || e instanceof NavigationCancel)
      ).subscribe((e: any) => {
        if (e instanceof NavigationEnd) {
          const isHome = e.urlAfterRedirects === '/' || e.urlAfterRedirects === '';
          if (!isHome) {
            setTimeout(() => this.loaderService.hide(), 300);
          }
        } else {
          // Hata veya iptal durumunda her zaman kapat
          setTimeout(() => this.loaderService.hide(), 300);
        }
      });
    }
  }
}
