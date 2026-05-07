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
    merkez: {
      phone: '+908505324530',
      address: 'Istanbul Turkiye',
      email: 'concierge@tulparjet.com',
      mapUrl:
        'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d192696.30390928376!2d28.847773500000005!3d41.00527955!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14caa7040068086b%3A0xe1ccfe98bc01b0d0!2sIstanbul%2C%20T%C3%BCrkiye!5e0!3m2!1str!2str!4v1620000000000!5m2!1str!2str',
    },
    sube: {
      phone: '+908505324531',
      address: 'Ankara Turkiye',
      email: 'ankara@tulparjet.com',
      mapUrl:
        'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d195960.10424555766!2d32.41051425!3d39.90427955!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14d347d520732db5%3A0xdc396bdb4c269f2e!2sAnkara%2C%20T%C3%BCrkiye!5e0!3m2!1str!2str!4v1620000000000!5m2!1str!2str',
    },
  };

  constructor(private sanitizer: DomSanitizer, private homeService: HomeService) {}

  ngOnInit(): void {
    this.homeService.getSocialLinks().subscribe({
      next: (links) => (this.socialLinks = links),
      error: () => (this.socialLinks = null),
    });
  }

  get currentLocation(): LocationInfo {
    return this.locations[this.activeTab];
  }

  get safeMapUrl(): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(
      this.currentLocation.mapUrl
    );
  }
}
