import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { HomeService } from '../../services/home.service';
import { SeoService } from '../../services/seo.service';
import { Service } from '../../core/service';
import { TranslatePipe } from '../../core/translate.pipe';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-hizmet-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, NavbarComponent, FooterComponent, TranslatePipe],
  templateUrl: './hizmet-detail.component.html',
  styleUrl: './hizmet-detail.component.scss'
})
export class HizmetDetailComponent implements OnInit {
  private svc = inject(HomeService);
  private seoSvc = inject(SeoService);
  private route = inject(ActivatedRoute);
  service: Service | null = null;
  loading = true;
  notFound = false;

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id'));
      this.svc.getServiceById(id).subscribe({
        next: data => {
          this.service = data;
          this.loading = false;
          // Set SEO data from API if available
          this.seoSvc.setSeoData({
            seoTitle: data.seoTitle,
            seoDescription: data.seoDescription,
            seoKeywords: data.seoKeywords,
            seoUrl: data.seoUrl
          });
        },
        error: () => { this.notFound = true; this.loading = false; }
      });
    });
  }

  resolveImageUrl(url: string | null | undefined, fallback: string): string {
    if (!url) return fallback;
    return url.startsWith('/uploads/') ? environment.mediaUrl + url : url;
  }
}
