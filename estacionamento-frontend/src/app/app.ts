import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from './shared/components/sidebar/sidebar';
import { Toast } from './shared/components/toast/toast';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Sidebar, Toast],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}