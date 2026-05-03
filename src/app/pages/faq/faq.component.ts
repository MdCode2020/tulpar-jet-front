import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { TranslationService } from '../../services/translation.service';
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
export class FaqComponent {
  private ts = inject(TranslationService);

  items: FaqItem[] = Array.from({ length: 6 }, (_, i) => ({
    question: this.ts.get(`faq.q${i + 1}`),
    answer: this.ts.get(`faq.a${i + 1}`),
    open: false,
  }));

  toggle(item: FaqItem) {
    item.open = !item.open;
  }
}
