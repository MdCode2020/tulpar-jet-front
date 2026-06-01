import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { HomeService } from '../../services/home.service';
import { SocialLinks } from '../../core/socialLinks';

interface LocationInfo {
  phone: string;
  address: string;
  email: string;
  mapUrl: string;
}

const FALLBACK_LOCATIONS: Record<'merkez' | 'sube', LocationInfo> = {
  merkez: {
    phone: '+908505324530',
    address: 'Istanbul Turkiye',
    email: 'concierge@tulparjet.com',
    mapUrl: '',
  },
  sube: {
    phone: '+908505324531',
    address: 'Ankara Turkiye',
    email: 'ankara@tulparjet.com',
    mapUrl: '',
  },
};

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {
  activeTab: 'merkez' | 'sube' = 'merkez';
  currentYear = new Date().getFullYear();
  socialLinks: SocialLinks | null = null;

  locations: Record<'merkez' | 'sube', LocationInfo> = {
    merkez: { ...FALLBACK_LOCATIONS.merkez },
    sube: { ...FALLBACK_LOCATIONS.sube },
  };

  // SafeResourceUrl'ler sadece URL değiştiğinde yeniden hesaplanır
  safeUrls: Record<'merkez' | 'sube', SafeResourceUrl | null> = {
    merkez: null,
    sube: null,
  };

  constructor(
    private sanitizer: DomSanitizer,
    private homeService: HomeService,
  ) {}

  ngOnInit(): void {
    this.homeService.getSocialLinks().subscribe({
      next: (links) => (this.socialLinks = links),
      error: () => (this.socialLinks = null),
    });

    this.homeService.getFooterLocations().subscribe({
      next: (data) => {
        if (!data?.length) return;
        data.forEach((loc: any) => {
          if (loc.mapUrl) {
            loc.mapUrl = this.extractSrcFromIframe(loc.mapUrl) || '';
          }
        });
        const m = data.find((l: any) => l.locationKey === 'merkez');
        const s = data.find((l: any) => l.locationKey === 'sube');
        if (m) {
          this.locations.merkez = {
            phone: m.phone,
            address: m.address,
            email: m.email,
            mapUrl: m.mapUrl,
          };
          if (m.mapUrl) {
            this.safeUrls.merkez = this.sanitizer.bypassSecurityTrustResourceUrl(m.mapUrl);
          }
        }
        if (s) {
          this.locations.sube = {
            phone: s.phone,
            address: s.address,
            email: s.email,
            mapUrl: s.mapUrl,
          };
          if (s.mapUrl) {
            this.safeUrls.sube = this.sanitizer.bypassSecurityTrustResourceUrl(s.mapUrl);
          }
        }
      },
      error: () => {},
    });
  }
  extractSrcFromIframe(iframeString: string): string | null {
    const regex = /src=["']([^"']+)["']/;
    const match = iframeString.match(regex);
    return match ? match[1] : null;
  }
  get currentLocation(): LocationInfo {
    return this.locations[this.activeTab];
  }

  get currentSafeUrl(): SafeResourceUrl | null {
    return this.safeUrls[this.activeTab];
  }
}
