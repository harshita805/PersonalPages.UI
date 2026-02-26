import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';
import { LoaderComponent } from './loader/loader.component';
import { ThemeService } from './services/theme.service';
import { PreferenceService } from './services/preference.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    MatDividerModule,
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
  #themeService = inject(ThemeService);
  #preferenceService = inject(PreferenceService);
  private router = inject(Router);

  ngOnInit() {
    const token = this.auth.getToken();
    if (token) {
      // Restart auto-logout timer
      (this.auth as any).startAutoLogout(token);
    }

    this.#preferenceService.getPreferences()
      .subscribe(prefs => {
        if (prefs) {
          this.#themeService.applyPreferences(prefs);
        }
      });
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

  goToCreateJournal() {
    this.router.navigate(['/journal/create']);
  }
}
