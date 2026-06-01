import { CommonModule, isPlatformBrowser, DatePipe } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  inject,
  Inject,
  OnInit,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
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
import { Service } from '../../core/service';
import { HomeService } from '../../services/home.service';
import { SeoService } from '../../services/seo.service';
import { TranslationService } from '../../services/translation.service';
import { LoaderService } from '../../services/loader.service';
import { TranslatePipe } from '../../core/translate.pipe';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { PromoVideo } from '../../core/promoVideo';
interface ExtraFlight {
  fromWhere: string;
  toWhere: string;
  selectedDate: Date | null;
  passengers?: number | null;
}

interface PlaneViewModel extends Airplane {
  image: string;
  dayImage: string;
  nightImage: string;
  subImageUrl: string;
  subImageUrl2: string;
  subImageUrl3: string;
  specs: { label: string; value: string }[];
}
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DatePipe,
    RouterLink,
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
export class HomeComponent implements OnInit, AfterViewInit {
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
  private seoService = inject(SeoService);
  private ts = inject(TranslationService);
  private loaderService = inject(LoaderService);
  private sanitizer = inject(DomSanitizer);
  apiBlogsLoaded = false;
  apiBlogs: Blog[] = [];

  apiServicesLoaded = false;
  apiServices: Service[] = [];

  benefitItems: { title: string; description: string; iconUrl: string }[] = [];
  promoVideo: PromoVideo | null = null;
  safeVideoUrl: SafeResourceUrl | null = null;
  videoId: string | null = null;
  videoLoaded = false;

  extraFlights: ExtraFlight[] = [
    { fromWhere: '', toWhere: '', selectedDate: null, passengers: null },
  ];
  miles = 2634929.12;
  digits: { char: string; prev: string; animating: boolean }[] = [];
  private intervalId: any;

  @ViewChild('logoEl') logoEl!: ElementRef<HTMLDivElement>;

  calendarReady = false;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngAfterViewInit(): void {
    if (this.isBrowser) {
      setTimeout(() => {
        this.calendarReady = true;
        this.logoEl?.nativeElement?.focus();
      }, 300);
    }
  }
  responsiveOptions: any[] | undefined;
  async ngOnInit() {
    // Reset to default home page SEO
    this.seoService.resetSeoData();

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
        breakpoint: '768px',
        numVisible: 1,
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
      this.loaderService.hide();
    }
    // dublicate plane for testing carousel with more items

    this.getAboutUs();
    this.getVision();
    this.getMission();
    this.loadAirplanes();
    this.loadBlogs();
    this.loadServices();
    this.loadVideo();
    this.loadBenefits();
  }
  getYoutubeEmbedUrl(url: string): string {
    const videoId = url.split('v=')[1]?.split('&')[0];
    return `https://www.youtube.com/embed/${videoId}`;
  }
  loadBenefits() {
    const langNumber = this.isBrowser ? localStorage.getItem('lang') || '2' : '2';
    const mediaUrl = environment.mediaUrl;
    this._homeService.getBenefitItems(Number(langNumber)).subscribe({
      next: (data) => {
        this.benefitItems = (data || [])
          .filter((b: any) => b.isActive)
          .map((b: any) => ({
            title: b.title,
            description: b.description,
            iconUrl: mediaUrl + b.iconUrl,
          }));
      },
      error: () => {},
    });
  }

  loadVideo() {
    const langNumber = this.isBrowser ? localStorage.getItem('lang') || '2' : '2';
    this._homeService.getPromoVideo(Number(langNumber)).subscribe({
      next: (data) => {
        const originalUrl = data.videoUrl;
        this.videoId = originalUrl.split('v=')[1]?.split('&')[0] ?? null;
        const embedUrl = this.getYoutubeEmbedUrl(originalUrl);
        this.promoVideo = { ...data, videoUrl: embedUrl };
        this.safeVideoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
      },
      error: () => {},
    });
  }
  loadAirplanes() {
    this._homeService.getAirplanes().subscribe({
      next: (data) => {
        if (data && data.length) {
          this.planes = data.filter((p) => p.isActive && p.isShow).map((p) => this.mapAirplane(p));
        }
      },
      error: () => {},
    });
  }

  loadBlogs() {
    this._homeService.getBlogs().subscribe({
      next: (data) => {
        if (data && data.length) {
          this.apiBlogs = data.filter((b) => b.isActive && b.isShow);
          this.apiBlogsLoaded = true;
        }
      },
      error: () => {},
    });
  }

  loadServices() {
    this._homeService.getServices().subscribe({
      next: (data) => {
        if (data && data.length) {
          this.apiServices = data.filter((s) => s.isActive && s.isShow);
          this.services = data
            .filter((s) => s.isActive && s.isShow)
            .map((s) => ({
              image: this.resolveImageUrl(s.imageUrl, 'assets/images/slider-1.jpg'),
              text: s.description,
              title: s.title,
              id: s.id,
            }));
        }
        this.apiServicesLoaded = true;
      },
      error: () => {},
    });
  }

  resolveImageUrl(url: string | null | undefined, fallback: string): string {
    if (!url) return fallback;
    return url.startsWith('/uploads/') ? environment.mediaUrl + url : url;
  }

  private mapAirplane(p: Airplane): PlaneViewModel {
    return {
      ...p,
      image: this.resolveImageUrl(p.imageUrl, 'assets/images/jet.png'),
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
  private useExtraFlights = false;
  extraFlightValidationError = '';

  openContactModal(): void {
    const allFilled = this.flights.every((f) => f.fromWhere.trim() && f.toWhere.trim());
    if (!allFilled) {
      this.flightValidationError = 'Lütfen tüm uçuşlar için nereden ve nereye alanlarını doldurun.';
      return;
    }
    this.flightValidationError = '';
    this.useExtraFlights = false;
    this.submitSuccess = false;
    this.submitError = '';
    this.showContactModal = true;
  }

  openExtraContactModal(): void {
    const allFilled = this.extraFlights.every((f) => f.fromWhere.trim() && f.toWhere.trim());
    if (!allFilled) {
      this.extraFlightValidationError = 'Lütfen tüm uçuşlar için nereden ve nereye alanlarını doldurun.';
      return;
    }
    this.extraFlightValidationError = '';
    this.useExtraFlights = true;
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

    const flightsSource = this.useExtraFlights ? this.extraFlights : this.flights;
    const payload = {
      firstName: this.contactInfo.firstName.trim(),
      lastName: this.contactInfo.lastName.trim(),
      email: this.contactInfo.email.trim(),
      phone: this.contactInfo.phone.trim(),
      flights: flightsSource.map((f) => ({
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
    const langNumber = this.isBrowser ? localStorage.getItem('lang') || '2' : '2';
    this._homeService.getAboutUs(Number(langNumber)).subscribe({
      next: (_aboutUs) => {
        this.aboutUs = _aboutUs;
      },
      error: () => {},
    });
  }
  getVision() {
    const langNumber = this.isBrowser ? localStorage.getItem('lang') || '2' : '2';
    this._homeService.getVision(Number(langNumber)).subscribe({
      next: (_vision) => {
        this.vision = _vision;
      },
      error: () => {},
    });
  }
  getMission() {
    const langNumber = this.isBrowser ? localStorage.getItem('lang') || '2' : '2';
    this._homeService.getMission(Number(langNumber)).subscribe({
      next: (_mission) => {
        this.mission = _mission;
      },
      error: () => {},
    });
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
  planes: PlaneViewModel[] = [];

  planeIndex = 0;
  selectedPlane: PlaneViewModel | null = null;

  getPlaneAt(offset: number) {
    return this.planes[(this.planeIndex + offset + this.planes.length) % this.planes.length];
  }

  openPlaneModal(plane: PlaneViewModel) {
    this.selectedPlane = plane;
    if (typeof document !== 'undefined') {
      document.body.style.overflow = 'hidden';
    }
    // Set SEO data from airplane if available
    this.seoService.setSeoData({
      seoTitle: plane.seoTitle,
      seoDescription: plane.seoDescription,
      seoKeywords: plane.seoKeywords,
      seoUrl: plane.seoUrl,
    });
  }

  closePlaneModal() {
    this.selectedPlane = null;
    this.showQuoteModal = false;
    if (typeof document !== 'undefined') {
      document.body.style.overflow = '';
    }
    // Reset to default SEO data
    this.seoService.resetSeoData();
  }

  // Image preview lightbox
  previewImageUrl: string | null = null;

  openPreview(url: string): void {
    this.previewImageUrl = url;
  }

  closePreview(): void {
    this.previewImageUrl = null;
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.previewImageUrl) {
      this.closePreview();
    } else if (this.showQuoteModal) {
      this.closeQuoteModal();
    } else if (this.selectedPlane) {
      this.closePlaneModal();
    }
  }

  // Quote modal (inside plane modal)
  showQuoteModal = false;
  quoteInfo = {
    name: '',
    lastName: '',
    email: '',
    phone: '',
    fromWhere: '',
    toWhere: '',
    selectedDate: null as Date | null,
    passengers: null as number | null,
  };
  quoteSubmitting = false;
  quoteSuccess = false;
  quoteError = '';

  openQuoteModal(): void {
    this.quoteInfo = {
      name: '',
      lastName: '',
      email: '',
      phone: '',
      fromWhere: '',
      toWhere: '',
      selectedDate: null,
      passengers: null,
    };
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
    if (
      !this.quoteInfo.name.trim() ||
      !this.quoteInfo.email.trim() ||
      !this.quoteInfo.phone.trim() ||
      !this.quoteInfo.fromWhere.trim() ||
      !this.quoteInfo.toWhere.trim()
    ) {
      this.quoteError = 'Lütfen zorunlu alanları doldurun.';
      return;
    }
    this.quoteSubmitting = true;
    this.quoteError = '';

    const payload = {
      firstName: this.quoteInfo.name.trim(),
      lastName: this.quoteInfo.lastName.trim(),
      email: this.quoteInfo.email.trim(),
      phone: this.quoteInfo.phone.trim(),
      flights: [
        {
          fromWhere: this.quoteInfo.fromWhere,
          toWhere: this.quoteInfo.toWhere,
          date: this.quoteInfo.selectedDate ? this.quoteInfo.selectedDate.toISOString() : null,
          passengers: this.quoteInfo.passengers,
        },
      ],
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
