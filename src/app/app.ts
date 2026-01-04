import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { LoaderComponent } from './shared/loader.component';
import { AuthService } from './services/auth.service';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    MatToolbarModule,
    LoaderComponent,
    MatMenuModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './app.html',
  styles: [`
    .spacer {
      flex: 1 1 auto;
    }
  `]
})
export class AppComponent {
  auth = inject(AuthService);
  private router = inject(Router);

  ngOnInit() {
    const token = localStorage.getItem('token');
    if (token) {
      // 🔄 Restart auto logout timer after refresh
      (this.auth as any).startAutoLogout(token);
    }
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  goToProfile() {
    this.router.navigate(['/profile']);
  }

  goToMyJournals() {
    this.router.navigate(['/journal/my']);
  }

  goToDashboard() {
    this.router.navigate(['/']);
  }
}
