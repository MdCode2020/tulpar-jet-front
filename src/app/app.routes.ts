import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'hizmetler', loadComponent: () => import('./pages/hizmetler/hizmetler.component').then(m => m.HizmetlerComponent) },
  { path: 'hizmetler/:id', loadComponent: () => import('./pages/hizmet-detail/hizmet-detail.component').then(m => m.HizmetDetailComponent) },
  { path: 'haberler', loadComponent: () => import('./pages/haberler/haberler.component').then(m => m.HaberlerComponent) },
  { path: 'haberler/:id', loadComponent: () => import('./pages/haber-detail/haber-detail.component').then(m => m.HaberDetailComponent) },
  { path: 'sss', loadComponent: () => import('./pages/faq/faq.component').then(m => m.FaqComponent) },
  { path: 'iletisim', loadComponent: () => import('./pages/iletisim/iletisim.component').then(m => m.IletisimComponent) },
];
