import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Slider } from '../core/slider';
import { Airplane } from '../core/airplane';
import { Blog } from '../core/blog';
import { Service } from '../core/service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class HomeService {
  _http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getSlider(lang: number): Observable<Slider> {
    return this._http.get<Slider>(`${this.apiUrl}/slider?lang=${lang}`);
  }

  getAboutUs(lang: number): Observable<any> {
    return this._http.get(`${this.apiUrl}/aboutus?lang=${lang}`);
  }

  getVision(lang: number): Observable<any> {
    return this._http.get(`${this.apiUrl}/vision?lang=${lang}`);
  }

  getMission(lang: number): Observable<any> {
    return this._http.get(`${this.apiUrl}/mission?lang=${lang}`);
  }

  getAirplanes(): Observable<Airplane[]> {
    return this._http.get<Airplane[]>(`${this.apiUrl}/airplane`);
  }

  getBlogs(): Observable<Blog[]> {
    return this._http.get<Blog[]>(`${this.apiUrl}/blog`);
  }

  getBlogById(id: number): Observable<Blog> {
    return this._http.get<Blog>(`${this.apiUrl}/blog/${id}`);
  }

  getServices(): Observable<Service[]> {
    return this._http.get<Service[]>(`${this.apiUrl}/service`);
  }

  getServiceById(id: number): Observable<Service> {
    return this._http.get<Service>(`${this.apiUrl}/service/${id}`);
  }
}

