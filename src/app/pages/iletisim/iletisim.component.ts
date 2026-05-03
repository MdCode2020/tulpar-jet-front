import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { TranslationService } from '../../services/translation.service';
import { TranslatePipe } from '../../core/translate.pipe';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-iletisim',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent, FooterComponent, TranslatePipe],
  templateUrl: './iletisim.component.html',
  styleUrl: './iletisim.component.scss'
})
export class IletisimComponent {
  private http = inject(HttpClient);
  private ts = inject(TranslationService);

  form = { name: '', email: '', phone: '', message: '' };
  sending = false;
  successMsg = '';
  errorMsg = '';

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
