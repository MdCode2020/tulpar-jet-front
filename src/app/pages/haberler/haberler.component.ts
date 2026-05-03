import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, DatePipe, isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { HomeService } from '../../services/home.service';
import { Blog } from '../../core/blog';
import { TranslatePipe } from '../../core/translate.pipe';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-haberler',
  standalone: true,
  imports: [CommonModule, DatePipe, RouterLink, NavbarComponent, FooterComponent, TranslatePipe],
  templateUrl: './haberler.component.html',
  styleUrl: './haberler.component.scss',
})
export class HaberlerComponent implements OnInit {
  private svc = inject(HomeService);
  blogs: Blog[] = [];
  private platformId = inject(PLATFORM_ID);
  get isBrowser() {
    return isPlatformBrowser(this.platformId);
  }
  ngOnInit() {
    if (this.isBrowser) {
      this.svc.getBlogs().subscribe({
        next: (data) =>
          (this.blogs = (data ?? [])
            .filter((b) => b.isActive && b.isShow)
            .sort(
              (a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime(),
            )),
      });
    }
  }

  resolveImageUrl(url: string | null | undefined, fallback: string): string {
    if (!url) return fallback;
    return url.startsWith('/uploads/') ? environment.mediaUrl + url : url;
  }
}
