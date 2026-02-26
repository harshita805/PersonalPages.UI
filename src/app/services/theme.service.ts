import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {

  applyPreferences(prefs: any) {
    if (prefs.theme === 'dark') {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }

    document.documentElement
      .style.setProperty('--font-size-base', prefs.fontSize + 'px');

    document.documentElement
      .style.setProperty('--font-family-base', prefs.fontFamily);
  }
}