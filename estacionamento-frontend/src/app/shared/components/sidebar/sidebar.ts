import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

interface MenuItem {
  label: string;
  route: string;
  icon: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
})
export class Sidebar {
  menuItems: MenuItem[] = [
    { label: 'Dashboard', route: '/dashboard', icon: '📊' },
    { label: 'Clientes', route: '/clientes', icon: '👤' },
    { label: 'Veículos', route: '/veiculos', icon: '🚗' },
    { label: 'Vagas', route: '/vagas', icon: '🅿️' },
    { label: 'Bilhetes', route: '/bilhetes', icon: '🎫' },
  ];
}