import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { UserService } from '../services/user.service';
import { ThemeService } from '../services/theme.service';
import { PreferenceService } from '../services/preference.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {

  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  #themeService = inject(ThemeService);
  #preferenceService = inject(PreferenceService);

  profileForm = this.fb.group({
    fullName: ['', Validators.required],
    gender: ['', Validators.required],
    dateOfBirth: ['', Validators.required]
  });

  currentTheme: string = 'light';
  currentFontSize: number = 16;
  currentFontFamily: string = "'Arial', sans-serif";

  ngOnInit() {
    this.userService.getProfile().subscribe(user => {
      this.profileForm.patchValue(user);
    });

    this.#preferenceService.getPreferences()
      .subscribe(prefs => {

        if (!prefs) return;

        this.currentTheme = prefs.theme;
        this.currentFontSize = prefs.fontSize;
        this.currentFontFamily = prefs.fontFamily;

        // Apply globally
        this.#themeService.applyPreferences(prefs);
      });
  }

  save() {
    if (this.profileForm.invalid) return;

    this.userService.updateProfile(this.profileForm.value)
      .subscribe(() =>
        this.savePreferences()
      );
  }

  savePreferences() {
    const prefs = {
      theme: this.currentTheme,
      fontSize: this.currentFontSize,
      fontFamily: this.currentFontFamily
    };

    this.#preferenceService.savePreferences(prefs)
      .subscribe(() => {
        alert('Preferences saved successfully');
      });
  }

  toggleTheme(event: any) {
    const isDark = event.target.checked;

    this.currentTheme = isDark ? 'dark' : 'light';

    this.#themeService.applyPreferences({
      theme: this.currentTheme,
      fontSize: this.currentFontSize,
      fontFamily: this.currentFontFamily
    });
  }

  changeFontSize(event: any) {
    this.currentFontSize = event.target.value;

    this.#themeService.applyPreferences({
      theme: this.currentTheme,
      fontSize: this.currentFontSize,
      fontFamily: this.currentFontFamily
    });
  }

  changeFontFamily(event: any) {
    this.currentFontFamily = event.target.value;

    this.#themeService.applyPreferences({
      theme: this.currentTheme,
      fontSize: this.currentFontSize,
      fontFamily: this.currentFontFamily
    });
  }
}
