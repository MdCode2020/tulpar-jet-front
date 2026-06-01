import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { shareReplay } from 'rxjs/operators';
import { Slider } from '../core/slider';
import { Airplane } from '../core/airplane';
import { Blog } from '../core/blog';
import { Service } from '../core/service';
import { SocialLinks } from '../core/socialLinks';
import { environment } from '../../environments/environment';
import { PromoVideo } from '../core/promoVideo';

@Injectable({
  providedIn: 'root',
})
export class HomeService {
  _http = inject(HttpClient);
  private apiUrl = environment.apiUrl;
  private cache = new Map<string, Observable<any>>();

  private cached<T>(key: string, source: Observable<T>): Observable<T> {
    if (!this.cache.has(key)) {
      this.cache.set(key, source.pipe(shareReplay(1)));
    }
    return this.cache.get(key) as Observable<T>;
  }

  getPromoVideo(lang: number): Observable<PromoVideo> {
    return this.cached(`promovideo-${lang}`, this._http.get<PromoVideo>(`${this.apiUrl}/promovideo?lang=${lang}`));
  }

  getSlider(lang: number): Observable<Slider> {
    return this.cached(`slider-${lang}`, this._http.get<Slider>(`${this.apiUrl}/slider?lang=${lang}`));
  }

  getAboutUs(lang: number): Observable<any> {
    return this.cached(`aboutus-${lang}`, this._http.get(`${this.apiUrl}/aboutus?lang=${lang}`));
  }

  getVision(lang: number): Observable<any> {
    return this.cached(`vision-${lang}`, this._http.get(`${this.apiUrl}/vision?lang=${lang}`));
  }

  getMission(lang: number): Observable<any> {
    return this.cached(`mission-${lang}`, this._http.get(`${this.apiUrl}/mission?lang=${lang}`));
  }

  getAirplanes(): Observable<Airplane[]> {
    return this.cached('airplanes', this._http.get<Airplane[]>(`${this.apiUrl}/airplane`));
  }

  getBlogs(): Observable<Blog[]> {
    return this.cached('blogs', this._http.get<Blog[]>(`${this.apiUrl}/blog`));
  }

  getBlogById(id: number): Observable<Blog> {
    return this._http.get<Blog>(`${this.apiUrl}/blog/${id}`);
  }

  getServices(): Observable<Service[]> {
    return this.cached('services', this._http.get<Service[]>(`${this.apiUrl}/service`));
  }

  getServiceById(id: number): Observable<Service> {
    return this._http.get<Service>(`${this.apiUrl}/service/${id}`);
  }

  getSocialLinks(): Observable<SocialLinks> {
    return this.cached('sociallinks', this._http.get<SocialLinks>(`${this.apiUrl}/sociallinks`));
  }

  getFaqs(lang: number): Observable<any[]> {
    return this._http.get<any[]>(`${this.apiUrl}/faq?lang=${lang}`);
  }

  getContactInfo(lang: number): Observable<any> {
    return this._http.get<any>(`${this.apiUrl}/contactinfo?lang=${lang}`);
  }

  getFooterLocations(): Observable<any[]> {
    return this.cached('footerlocations', this._http.get<any[]>(`${this.apiUrl}/footerlocation`));
  }

  getBenefitItems(lang: number): Observable<any[]> {
    return this._http.get<any[]>(`${this.apiUrl}/benefititem?lang=${lang}`);
  }
}
