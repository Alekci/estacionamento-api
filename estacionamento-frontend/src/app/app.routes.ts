import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./features/dashboard/dashboard').then(
        (m) => m.Dashboard,
      ),
  },
  {
    path: 'clientes',
    loadComponent: () =>
      import('./features/clientes/clientes').then(
        (m) => m.Clientes,
      ),
  },
  {
    path: 'veiculos',
    loadComponent: () =>
      import('./features/veiculos/veiculos').then(
        (m) => m.Veiculos,
      ),
  },
  {
    path: 'vagas',
    loadComponent: () =>
      import('./features/vagas/vagas').then(
        (m) => m.Vagas,
      ),
  },
  {
    path: 'bilhetes',
    loadComponent: () =>
      import('./features/bilhetes/bilhetes').then(
        (m) => m.Bilhetes,
      ),
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];