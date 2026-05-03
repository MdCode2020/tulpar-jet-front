import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { HomeService } from '../../services/home.service';
import { Service } from '../../core/service';
import { TranslatePipe } from '../../core/translate.pipe';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-hizmetler',
  standalone: true,
  imports: [CommonModule, RouterLink, NavbarComponent, FooterComponent, TranslatePipe],
  templateUrl: './hizmetler.component.html',
  styleUrl: './hizmetler.component.scss'
})
export class HizmetlerComponent implements OnInit {
  private svc = inject(HomeService);
  services: Service[] = [];

  ngOnInit() {
    this.svc.getServices().subscribe({
      next: data => this.services = (data ?? []).filter(s => s.isActive && s.isShow)
    });
  }

  resolveImageUrl(url: string | null | undefined, fallback: string): string {
    if (!url) return fallback;
    return url.startsWith('/uploads/') ? environment.mediaUrl + url : url;
  }
}
