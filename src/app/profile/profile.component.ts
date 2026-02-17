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

  profileForm = this.fb.group({
    fullName: ['', Validators.required],
    gender: ['', Validators.required],
    dateOfBirth: ['', Validators.required]
  });

  ngOnInit() {
    this.userService.getProfile().subscribe(user => {
      this.profileForm.patchValue(user);
    });
  }

  save() {
    if (this.profileForm.invalid) return;

    this.userService.updateProfile(this.profileForm.value)
      .subscribe(() => alert('Profile updated successfully'));
  }
}
