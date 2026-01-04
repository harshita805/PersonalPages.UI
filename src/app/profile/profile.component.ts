import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    MatCardModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatFormFieldModule
  ],
  templateUrl: './profile.component.html'
})
export class ProfileComponent {
  saveProfile() {
    alert('Profile updated');
  }
}
