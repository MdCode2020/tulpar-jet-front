import { isPlatformBrowser, DatePipe } from '@angular/common';
import { Component, inject, Inject, OnInit, PLATFORM_ID, Type } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { CarouselModule } from 'primeng/carousel';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { DatePickerModule } from 'primeng/datepicker';
import { PopoverModule } from 'primeng/popover';
import { FooterComponent } from '../../components/footer/footer.component';
import { AboutUs } from '../../core/aboutUs';
import { Vision } from '../../core/vision';
import { Mission } from '../../core/mission';
import { Airplane } from '../../core/airplane';
import { Blog } from '../../core/blog';
import { HomeService } from '../../services/home.service';
import { TranslationService } from '../../services/translation.service';
import { LoaderService } from '../../services/loader.service';
import { TranslatePipe } from '../../core/translate.pipe';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
interface ExtraFlight {
  fromWhere: string;
  toWhere: string;
  selectedDate: Date | null;
  passengers?: number | null;
}
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    FormsModule,
    DatePipe,
    NavbarComponent,
    CarouselModule,
    DatePickerModule,
    PopoverModule,
    InputTextModule,
    ButtonModule,
    FloatLabelModule,
    FooterComponent,
    TranslatePipe,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  contactInfo = { firstName: '', lastName: '', email: '', phone: '' };
  submitting = false;
  submitSuccess = false;
  submitError = '';
  showContactModal = false;
  flightValidationError = '';
  flights: ExtraFlight[] = [{ fromWhere: '', toWhere: '', selectedDate: null, passengers: null }];
  aboutUs: AboutUs | null = null;
  vision: Vision | null = null;
  mission: Mission | null = null;
  private http = inject(HttpClient);
  _homeService = inject(HomeService);
  private ts = inject(TranslationService);
  private loaderService = inject(LoaderService);
  private pendingApis = 0;

  private apiDone(): void {
    if (!this.isBrowser) return;
    this.pendingApis--;
    if (this.pendingApis <= 0) {
      this.loaderService.hide();
    }
  }

  apiBlogsLoaded = false;
  apiBlogs: Blog[] = [];

  extraFlights: ExtraFlight[] = [
    { fromWhere: '', toWhere: '', selectedDate: null, passengers: null },
  ];
  miles = 2634929.12;
  digits: { char: string; prev: string; animating: boolean }[] = [];
  private intervalId: any;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}
  responsiveOptions: any[] | undefined;
  async ngOnInit() {
    this.updateDigits(false);
    this.responsiveOptions = [
      {
        breakpoint: '1400px',
        numVisible: 2,
        numScroll: 1,
      },
      {
        breakpoint: '1199px',
        numVisible: 2,
        numScroll: 1,
      },
      {
        breakpoint: '767px',
        numVisible: 2,
        numScroll: 1,
      },
      {
        breakpoint: '575px',
        numVisible: 1,
        numScroll: 1,
      },
    ];
    if (this.isBrowser) {
      this.startOdometer();
      // Toplam 6 API çağrısını takip et; hepsi bitince loader kapanacak
      this.pendingApis = 6;
    }
    // dublicate plane for testing carousel with more items

    this.getAboutUs();
    this.getVision();
    this.getMission();
    this.loadAirplanes();
    this.loadBlogs();
    this.loadServices();
  }
  loadAirplanes() {
    this._homeService.getAirplanes().subscribe({
      next: (data) => {
        console.log('airplanes', data);
        if (data && data.length) {
          this.planes = data.filter((p) => p.isActive && p.isShow).map((p) => this.mapAirplane(p));
          // this.planes = [...this.planes, ...this.planes];
          // this.planes = [...this.planes, ...this.planes];
        }
        this.apiDone();
      },
      error: () => this.apiDone(),
    });
  }

  loadBlogs() {
    this._homeService.getBlogs().subscribe({
      next: (data) => {
        if (data && data.length) {
          this.apiBlogs = data.filter((b) => b.isActive && b.isShow);
          this.apiBlogsLoaded = true;
        }
        this.apiDone();
      },
      error: () => this.apiDone(),
    });
  }

  loadServices() {
    this._homeService.getServices().subscribe({

      next: (data) => {
        console.log('services', data);
        console.log(data);
        if (data && data.length) {
          this.services = data
            .filter((s) => s.isActive && s.isShow)
            .map((s) => ({
              image: this.resolveImageUrl(s.imageUrl, 'assets/images/slider-1.jpg'),
              text: s.description,
              title: s.title,
              id: s.id,
            }));
        }
        this.apiDone();
      },
      error: () => this.apiDone(),
    });
  }

  resolveImageUrl(url: string | null | undefined, fallback: string): string {
    if (!url) return fallback;
    return url.startsWith('/uploads/') ? environment.mediaUrl + url : url;
  }

  private mapAirplane(p: Airplane): any {
    return {
      subtitle: p.code || '',
      name: p.title || p.name,
      image: this.resolveImageUrl(p.imageUrl, 'assets/images/jet.png'),
      range: p.range,
      year: p.year,
      seats: p.capacity,
      dayImage: this.resolveImageUrl(p.dayImageUrl, 'assets/images/gunduz.png'),
      nightImage: this.resolveImageUrl(p.nightImageUrl, 'assets/images/gece.png'),
      subImageUrl: this.resolveImageUrl(p.subImageUrl, ''),
      subImageUrl2: this.resolveImageUrl(p.subImageUrl2, ''),
      subImageUrl3: this.resolveImageUrl(p.subImageUrl3, ''),
      specs: [
        { label: this.ts.get('home.specYear'), value: p.year },
        { label: this.ts.get('home.specSpeed'), value: p.speed },
        { label: this.ts.get('home.specRange'), value: p.range },
        { label: this.ts.get('home.specLength'), value: p.height },
        { label: this.ts.get('home.specWidth'), value: p.width },
        { label: this.ts.get('home.specWing'), value: p.wing },
        { label: this.ts.get('home.specBaggage'), value: p.baggage },
        { label: this.ts.get('home.specCapacity'), value: p.capacity },
      ],
    };
  }
  openContactModal(): void {
    const allFilled = this.flights.every((f) => f.fromWhere.trim() && f.toWhere.trim());
    if (!allFilled) {
      this.flightValidationError = 'Lütfen tüm uçuşlar için nereden ve nereye alanlarını doldurun.';
      return;
    }
    this.flightValidationError = '';
    this.submitSuccess = false;
    this.submitError = '';
    this.showContactModal = true;
  }

  closeContactModal(): void {
    this.showContactModal = false;
    this.submitSuccess = false;
    this.submitError = '';
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
      flights: this.flights.map((f) => ({
        fromWhere: f.fromWhere,
        toWhere: f.toWhere,
        date: f.selectedDate ? f.selectedDate.toISOString() : null,
        passengers: f.passengers,
      })),
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
      },
    });
  }
  get isBrowser() {
    return isPlatformBrowser(this.platformId);
  }
  getAboutUs() {
    if (this.isBrowser) {
      const langNumber = localStorage.getItem('lang') || '2';
      this._homeService.getAboutUs(Number(langNumber)).subscribe({
        next: (_aboutUs) => {
          this.aboutUs = _aboutUs;
          this.apiDone();
        },
        error: () => this.apiDone(),
      });
    } else {
      this.apiDone();
    }
  }
  getVision() {
    if (this.isBrowser) {
      const langNumber = localStorage.getItem('lang') || '2';
      this._homeService.getVision(Number(langNumber)).subscribe({
        next: (_vision) => {
          this.vision = _vision;
          this.apiDone();
        },
        error: () => this.apiDone(),
      });
    } else {
      this.apiDone();
    }
  }
  getMission() {
    if (this.isBrowser) {
      const langNumber = localStorage.getItem('lang') || '2';
      this._homeService.getMission(Number(langNumber)).subscribe({
        next: (_mission) => {
          this.mission = _mission;
          this.apiDone();
        },
        error: () => this.apiDone(),
      });
    } else {
      this.apiDone();
    }
  }
  // ngOnDestroy() {
  //   if (this.intervalId) clearInterval(this.intervalId);
  // }
  addFlight(): void {
    const maxFlights = 4;
    if (this.flights.length >= maxFlights) {
      this.flightValidationError = `En fazla ${maxFlights} uçuş ekleyebilirsiniz.`;
      return;
    }
    this.flightValidationError = '';
    this.flights.push({ fromWhere: '', toWhere: '', selectedDate: null, passengers: null });
  }
  addExtraFlight(): void {
    const maxFlights = 4;
    if (this.extraFlights.length >= maxFlights) {
      this.flightValidationError = `En fazla ${maxFlights} uçuş ekleyebilirsiniz.`;
      return;
    }
    this.flightValidationError = '';
    this.extraFlights.push({ fromWhere: '', toWhere: '', selectedDate: null, passengers: null });
  }
  removeFlight(index: number): void {
    this.flights.splice(index, 1);
  }
  removeExtraFlight(index: number): void {
    this.extraFlights.splice(index, 1);
  }
  private startOdometer() {
    this.intervalId = setInterval(() => {
      this.miles += 1.31;
      this.updateDigits(true);
    }, 1000);
  }

  private formatNumber(val: number): string {
    const [whole, dec] = val.toFixed(2).split('.');
    return whole.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '.' + dec;
  }

  private updateDigits(animate: boolean) {
    const formatted = this.formatNumber(this.miles);
    const oldDigits = this.digits;
    const newDigits: { char: string; prev: string; animating: boolean }[] = [];

    for (let i = 0; i < formatted.length; i++) {
      const char = formatted[i];
      const oldChar = oldDigits[i]?.char ?? char;
      const changed = animate && char !== oldChar && char !== '.' && char !== ',';
      newDigits.push({
        char,
        prev: changed ? oldChar : char,
        animating: changed,
      });
    }

    this.digits = newDigits;

    // Animasyon bittikten sonra: prev'i char'a eşitle, böylece eski rakam geri dönmez
    if (animate) {
      setTimeout(() => {
        this.digits = this.digits.map((d) => ({ ...d, animating: false, prev: d.char }));
      }, 800);
    }
  }

  // About tabs
  activeTab: 'about' | 'vision' | 'mission' = 'about';
  animatingTab = true;

  selectTab(tab: 'about' | 'vision' | 'mission') {
    if (tab === this.activeTab) return;
    this.animatingTab = false;
    setTimeout(() => {
      this.activeTab = tab;
      this.animatingTab = true;
    }, 10);
  }

  // Image Slider
  sliderIndex = 0;
  prevSliderIndex: number | null = null;
  sliderAnimating = false;
  sliderDir: 'next' | 'prev' = 'next';

  services: { image: string; text: string; title?: string; id?: number }[] = [
    {
      image: 'assets/images/slider-1.jpg',
      text: 'İş, hareketlilik ve dakiklik ilkelerine dayanmaktadır, bu nedenle programlara sıkı sıkıya bağlı kalmayı garanti ediyoruz.',
    },
    {
      image: 'assets/images/slider-2.jpg',
      text: 'Güçlü filomuz ve deneyimli ekibimizle her uçuşu özel bir deneyime dönüştürüyoruz.',
    },
    {
      image: 'assets/images/slider-1.jpg',
      text: "2012'den bu yana iş dünyasının güvenilir hava ulaşım ortağı olarak yüzlerce başarılı uçuşa imza attık.",
    },
  ];

  goSlide(index: number) {
    if (this.sliderAnimating || index === this.sliderIndex) return;
    this.sliderDir = index > this.sliderIndex ? 'next' : 'prev';
    this.prevSliderIndex = this.sliderIndex;
    this.sliderIndex = index;
    this.sliderAnimating = true;
    setTimeout(() => {
      this.sliderAnimating = false;
      this.prevSliderIndex = null;
    }, 500);
  }

  nextSlide() {
    this.goSlide((this.sliderIndex + 1) % this.services.length);
  }

  prevSlide() {
    this.goSlide((this.sliderIndex - 1 + this.services.length) % this.services.length);
  }

  // Plane Carousel
  planes = [
    {
      subtitle: 'meydan okuyan 604',
      name: 'Challenger 604 OH-WIC',
      image: 'assets/images/jet.png',
      range: 7600,
      year: 2019,
      seats: 11,
      dayImage: 'assets/images/gunduz.png',
      nightImage: 'assets/images/gece.png',
      subImageUrl: '',
      subImageUrl2: '',
      subImageUrl3: '',
      specs: [
        { label: 'yıl serbest bırakmak / salon tadilatı', value: '2019' },
        { label: 'seyir hızı, KM/', value: '560,20' },
        { label: 'uçuş aralığı, KM', value: '7600' },
        { label: 'uzunluk, m', value: '550,10' },
        { label: 'Yükseklik, m', value: '10000' },
        { label: 'kanat açıklığı, m', value: '860,600' },
        { label: 'Bagaj bölmesi hacmi, m³', value: '4560' },
        { label: 'numara yerler', value: '7600' },
        { label: 'Salonda sigara içme imkanı', value: 'EVET' },
      ],
    },
    {
      subtitle: 'ultra uzun menzilli',
      name: 'Global 7500 C-FXYZ',
      image: 'assets/images/jet.png',
      range: 14260,
      year: 2021,
      seats: 19,
      dayImage: 'assets/images/gunduz.png',
      nightImage: 'assets/images/gece.png',
      subImageUrl: '',
      subImageUrl2: '',
      subImageUrl3: '',
      specs: [
        { label: 'yıl serbest bırakmak / salon tadilatı', value: '2021' },
        { label: 'seyir hızı, KM/', value: '956,00' },
        { label: 'uçuş aralığı, KM', value: '14260' },
        { label: 'uzunluk, m', value: '33,80' },
        { label: 'Yükseklik, m', value: '12497' },
        { label: 'kanat açıklığı, m', value: '31,39' },
        { label: 'Bagaj bölmesi hacmi, m³', value: '5950' },
        { label: 'numara yerler', value: '19' },
        { label: 'Salonda sigara içme imkanı', value: 'EVET' },
      ],
    },
    {
      subtitle: 'hafif kategori',
      name: 'Citation CJ4 N400CJ',
      image: 'assets/images/jet.png',
      range: 3278,
      year: 2018,
      seats: 7,
      dayImage: 'assets/images/gunduz.png',
      nightImage: 'assets/images/gece.png',
      subImageUrl: '',
      subImageUrl2: '',
      subImageUrl3: '',
      specs: [
        { label: 'yıl serbest bırakmak / salon tadilatı', value: '2018' },
        { label: 'seyir hızı, KM/', value: '778,00' },
        { label: 'uçuş aralığı, KM', value: '3278' },
        { label: 'uzunluk, m', value: '16,26' },
        { label: 'Yükseklik, m', value: '13716' },
        { label: 'kanat açıklığı, m', value: '15,49' },
        { label: 'Bagaj bölmesi hacmi, m³', value: '1630' },
        { label: 'numara yerler', value: '7' },
        { label: 'Salonda sigara içme imkanı', value: 'HAYIR' },
      ],
    },
    {
      subtitle: 'hafif kategori',
      name: 'Citation CJ4 N400CJ',
      image: 'assets/images/jet.png',
      range: 3278,
      year: 2018,
      seats: 7,
      dayImage: 'assets/images/gunduz.png',
      nightImage: 'assets/images/gece.png',
      subImageUrl: '',
      subImageUrl2: '',
      subImageUrl3: '',
      specs: [
        { label: 'yıl serbest bırakmak / salon tadilatı', value: '2018' },
        { label: 'seyir hızı, KM/', value: '778,00' },
        { label: 'uçuş aralığı, KM', value: '3278' },
        { label: 'uzunluk, m', value: '16,26' },
        { label: 'Yükseklik, m', value: '13716' },
        { label: 'kanat açıklığı, m', value: '15,49' },
        { label: 'Bagaj bölmesi hacmi, m³', value: '1630' },
        { label: 'numara yerler', value: '7' },
        { label: 'Salonda sigara içme imkanı', value: 'HAYIR' },
      ],
    },
  ];

  planeIndex = 0;
  selectedPlane: (typeof this.planes)[0] | null = null;

  getPlaneAt(offset: number) {
    return this.planes[(this.planeIndex + offset + this.planes.length) % this.planes.length];
  }

  openPlaneModal(plane: (typeof this.planes)[0]) {
    this.selectedPlane = plane;
    if (typeof document !== 'undefined') {
      document.body.style.overflow = 'hidden';
    }
  }

  closePlaneModal() {
    this.selectedPlane = null;
    this.showQuoteModal = false;
    if (typeof document !== 'undefined') {
      document.body.style.overflow = '';
    }
  }

  // Quote modal (inside plane modal)
  showQuoteModal = false;
  quoteInfo = { name: '', phone: '', fromWhere: '', toWhere: '', selectedDate: null as Date | null, passengers: null as number | null };
  quoteSubmitting = false;
  quoteSuccess = false;
  quoteError = '';

  openQuoteModal(): void {
    this.quoteInfo = { name: '', phone: '', fromWhere: '', toWhere: '', selectedDate: null, passengers: null };
    this.quoteSuccess = false;
    this.quoteError = '';
    this.showQuoteModal = true;
  }

  closeQuoteModal(): void {
    this.showQuoteModal = false;
    this.quoteSuccess = false;
    this.quoteError = '';
  }

  submitQuoteRequest(): void {
    if (!this.quoteInfo.name.trim() || !this.quoteInfo.phone.trim() || !this.quoteInfo.fromWhere.trim() || !this.quoteInfo.toWhere.trim()) {
      this.quoteError = 'Lütfen zorunlu alanları doldurun.';
      return;
    }
    this.quoteSubmitting = true;
    this.quoteError = '';

    const payload = {
      firstName: this.quoteInfo.name.trim(),
      lastName: '',
      email: '',
      phone: this.quoteInfo.phone.trim(),
      flights: [{
        fromWhere: this.quoteInfo.fromWhere,
        toWhere: this.quoteInfo.toWhere,
        date: this.quoteInfo.selectedDate ? this.quoteInfo.selectedDate.toISOString() : null,
        passengers: this.quoteInfo.passengers,
      }],
    };

    this.http.post(`${environment.apiUrl}/flightrequest`, payload).subscribe({
      next: () => {
        this.quoteSubmitting = false;
        this.quoteSuccess = true;
      },
      error: (err) => {
        this.quoteSubmitting = false;
        this.quoteError = err?.error?.error || 'Talep gönderilemedi, lütfen tekrar deneyin.';
      },
    });
  }
}
