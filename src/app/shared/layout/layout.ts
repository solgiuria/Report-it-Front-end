import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/services/auth-service';
import { Header } from './header/header';
import { Sidebar } from './sidebar/sidebar';


@Component({
  selector: 'app-layout-page',
  standalone: true,
  imports: [RouterOutlet, Header, Sidebar],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
})
export class LayoutPage {
 private authService = inject(AuthService);
  
  // Signal para controlar si el sidebar está abierto (mobile)
  readonly sidebarOpen = signal<boolean>(false);

  toggleSidebar() {
    this.sidebarOpen.update(value => !value);
  }

  closeSidebar() {
    this.sidebarOpen.set(false);
  }
}
