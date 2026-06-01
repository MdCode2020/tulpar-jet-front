import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Inject, PLATFORM_ID } from '@angular/core';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { HomeService } from '../../services/home.service';
import { TranslatePipe } from '../../core/translate.pipe';

interface FaqItem {
  question: string;
  answer: string;
  open: boolean;
}

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FooterComponent, TranslatePipe],
  templateUrl: './faq.component.html',
  styleUrl: './faq.component.scss'
})
export class FaqComponent implements OnInit {
  private homeService = inject(HomeService);

  items: FaqItem[] = [];

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit() {
    const lang = isPlatformBrowser(this.platformId)
      ? Number(localStorage.getItem('lang') || '2')
      : 2;

    this.homeService.getFaqs(lang).subscribe({
      next: data => {
        this.items = (data || [])
          .filter((f: any) => f.isActive)
          .map((f: any) => ({ question: f.question, answer: f.answer, open: false }));
      },
      error: () => { this.items = []; }
    });
  }

  toggle(item: FaqItem) {
    item.open = !item.open;
  }
}
