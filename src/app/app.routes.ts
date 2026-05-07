import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent) },

  { path: 'hizmetler/:id', loadComponent: () => import('./pages/hizmet-detail/hizmet-detail.component').then(m => m.HizmetDetailComponent) },
  { path: 'hizmetler', loadComponent: () => import('./pages/hizmetler/hizmetler.component').then(m => m.HizmetlerComponent) },

  { path: 'haberler/:id', loadComponent: () => import('./pages/haber-detail/haber-detail.component').then(m => m.HaberDetailComponent) },
  { path: 'haberler', loadComponent: () => import('./pages/haberler/haberler.component').then(m => m.HaberlerComponent) },

  { path: 'sss', loadComponent: () => import('./pages/faq/faq.component').then(m => m.FaqComponent) },
  { path: 'iletisim', loadComponent: () => import('./pages/iletisim/iletisim.component').then(m => m.IletisimComponent) },

  { path: '**', redirectTo: '' }
];
