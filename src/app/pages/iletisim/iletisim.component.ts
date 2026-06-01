import { Component, inject, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { TranslationService } from '../../services/translation.service';
import { HomeService } from '../../services/home.service';
import { TranslatePipe } from '../../core/translate.pipe';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-iletisim',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent, FooterComponent, TranslatePipe],
  templateUrl: './iletisim.component.html',
  styleUrl: './iletisim.component.scss'
})
export class IletisimComponent implements OnInit {
  private http = inject(HttpClient);
  private ts = inject(TranslationService);
  private homeService = inject(HomeService);

  form = { name: '', email: '', phone: '', message: '' };
  sending = false;
  successMsg = '';
  errorMsg = '';

  contactInfo: { phone: string; email: string; address: string } | null = null;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit() {
    const lang = isPlatformBrowser(this.platformId)
      ? Number(localStorage.getItem('lang') || '2')
      : 2;

    this.homeService.getContactInfo(lang).subscribe({
      next: data => { this.contactInfo = data || null; },
      error: () => { this.contactInfo = null; }
    });
  }

  submit() {
    this.successMsg = '';
    this.errorMsg = '';
    this.sending = true;
    this.http.post(`${environment.apiUrl}/contact`, {
      name: this.form.name,
      email: this.form.email,
      phone: this.form.phone,
      message: this.form.message
    }).subscribe({
      next: () => {
        this.successMsg = this.ts.get('contact.success');
        this.form = { name: '', email: '', phone: '', message: '' };
        this.sending = false;
      },
      error: () => {
        this.errorMsg = this.ts.get('contact.error');
        this.sending = false;
      }
    });
  }
}
