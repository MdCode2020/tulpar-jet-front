import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, inject, AfterViewInit, PLATFORM_ID, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { DatePickerModule } from 'primeng/datepicker';
import { PopoverModule } from 'primeng/popover';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { HomeService } from '../../services/home.service';
import { Slider } from '../../core/slider';
import { environment } from '../../../environments/environment';

interface ExtraFlight {
  fromWhere: string;
  toWhere: string;
  selectedDate: Date | null;
  passengers?: number | null;
}

@Component({
  standalone: true,
  selector: 'app-hero',
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss',
  // encapsulation: ViewEncapsulation.None,
  imports: [
    CommonModule,
    FormsModule,
    DatePickerModule,
    PopoverModule,
    InputTextModule,
    ButtonModule,
    FloatLabelModule,
  ],
})
export class HeroComponent implements AfterViewInit {
  // Date/time picker
  platformId = inject(PLATFORM_ID);
  private http = inject(HttpClient);
  slider: Slider | null = null;
  _homeService = inject(HomeService);
  selectedDate: Date | null = null;
  openPanel = false;
  fromWhere: string = '';
  toWhere: string = '';
  passengers: number | null = null;
  flights: ExtraFlight[] = [{ fromWhere: '', toWhere: '', selectedDate: null, passengers: null }];

  contactInfo = { firstName: '', lastName: '', email: '', phone: '' };
  submitting = false;
  submitSuccess = false;
  submitError = '';
  ngOnInit() {
    this.getSlider();
  }

  ngAfterViewInit() {
    if (this.isBrowser) {
      setTimeout(() => (document.activeElement as HTMLElement)?.blur(), 0);
    }
  }

  addFlight(): void {
    this.flights.push({ fromWhere: '', toWhere: '', selectedDate: null, passengers: null });
  }

  removeFlight(index: number): void {
    this.flights.splice(index, 1);
  }

  submitFlightRequest(): void {
    if (!this.contactInfo.firstName.trim() || !this.contactInfo.email.trim()) {
      this.submitError = 'Lütfen adınızı ve e-posta adresinizi girin.';
      return;
    }
    this.submitting = true;
    this.submitError = '';

    const payload = {
      firstName: this.contactInfo.firstName.trim(),
      lastName: this.contactInfo.lastName.trim(),
      email: this.contactInfo.email.trim(),
      phone: this.contactInfo.phone.trim(),
      flights: this.flights.map(f => ({
        fromWhere: f.fromWhere,
        toWhere: f.toWhere,
        date: f.selectedDate ? f.selectedDate.toISOString() : null,
        passengers: f.passengers
      }))
    };

    this.http.post(`${environment.apiUrl}/flightrequest`, payload).subscribe({
      next: () => {
        this.submitting = false;
        this.submitSuccess = true;
        this.flights = [{ fromWhere: '', toWhere: '', selectedDate: null, passengers: null }];
        this.contactInfo = { firstName: '', lastName: '', email: '', phone: '' };
      },
      error: (err) => {
        this.submitting = false;
        this.submitError = err?.error?.error || 'Talep gönderilemedi, lütfen tekrar deneyin.';
      }
    });
  }
  get isBrowser() {
    return isPlatformBrowser(this.platformId);
  }
  getSlider() {
    if (this.isBrowser){
      const lang = localStorage.getItem('lang') || '2';
      this._homeService.getSlider(Number(lang)).subscribe({
        next: (data) => {
          this.slider = data;
        },
        error: (err) => {
          console.error('Error fetching slider:', err);
        },
      });
    }
  }
}
