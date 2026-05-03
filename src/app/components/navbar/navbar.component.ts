// add navbar component
import { Component, HostListener } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { TranslatePipe } from '../../core/translate.pipe';
import { LoaderService } from '../../services/loader.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, TranslatePipe],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent {
  isOpen = false;
  scrolled = false;
  isHomePage = true;
  isMobile = typeof window !== 'undefined' && window.innerWidth < 1199;

  langOpen = false;
  platformId = inject(PLATFORM_ID);
  private router = inject(Router);
  private loaderService = inject(LoaderService);
  langs = [
    { id: '1', label: 'EN' },
    { id: '2', label: 'TR' },
    { id: '3', label: 'AR' },
    { id: '4', label: 'RU' },
    { id: '5', label: 'DE' },
    { id: '6', label: 'CH' },
  ];
  currentLang = this.langs[1];
  constructor() {
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      this.isOpen = false;
      this.resetNavbar();
    });
  }
  ngOnInit() {
    this.router.events.pipe(filter((e) => e instanceof NavigationEnd)).subscribe((e: any) => {
      this.isHomePage = e.urlAfterRedirects === '/' || e.urlAfterRedirects === '';
    });
    this.isHomePage = this.router.url === '/' || this.router.url === '';
    if (this.isBrowser) {
      const savedLang = localStorage.getItem('lang');

      if (savedLang) {
        const found = this.langs.find((l) => l.id === savedLang);
        if (found) {
          this.currentLang = found;
        }
      }
    }
  }
  get isBrowser() {
    return isPlatformBrowser(this.platformId);
  }
  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.scrolled = window.scrollY > 10;
  }

  @HostListener('window:resize', [])
  onResize() {
    this.isMobile = window.innerWidth < 1199;
    if (!this.isMobile) this.isOpen = false;
  }

  @HostListener('document:click')
  onDocumentClick() {
    this.langOpen = false;
  }

  toggleMenu() {
    this.isOpen = !this.isOpen;
    // set navbar background color when menu is open on mobile
    if (this.isMobile) {
      const navbar = document.querySelector('.navbar') as HTMLElement;
      if (this.isOpen) {
        navbar.style.background = 'rgb(0 10 51 / 82%)';
        navbar.style.backdropFilter = 'blur(14px)';
        // navbar.style.webkitBackdropFilter = 'blur(14px)';
        navbar.style.boxShadow = '0 1px 0 rgba(255, 255, 255, 0.06)';
      } else {
        this.resetNavbar();
      }
    }
  }
  resetNavbar() {
    if (this.isBrowser) {
      const navbar = document.querySelector('.navbar') as HTMLElement;
      navbar.style.background = 'transparent';
      navbar.style.backdropFilter = 'none';
      navbar.style.boxShadow = 'none';
    }
  }

  toggleLang(event: MouseEvent) {
    event.stopPropagation();
    this.langOpen = !this.langOpen;
  }
  loader() {
    // Loader'ı aç; App'teki router olayları navigasyon bitince kapatır
    this.loaderService.show();
    this.resetNavbar();
  }
  selectLang(lang: any, event: MouseEvent) {
    event.stopPropagation();

    this.currentLang = lang;
    this.langOpen = false;

    if (this.isBrowser) {
      localStorage.setItem('lang', lang.id);
    }
    // refresh page to apply language change
    if (this.isBrowser) {
      window.location.reload();
    }
  }
}
