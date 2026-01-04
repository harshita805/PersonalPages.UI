import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-mood',
  standalone: true,
  imports: [
    MatCardModule,
    MatSelectModule,
    MatButtonModule,
    MatFormFieldModule
  ],
  templateUrl: './mood.component.html'
})
export class MoodComponent {
  saveMood() {
    alert('Mood saved successfully');
  }
}
