import { Component } from '@angular/core';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-mood',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatSelectModule,
    MatFormFieldModule,
    MatCardModule
  ],
  templateUrl: './mood-dialog.component.html'
})
export class MoodDialogComponent {

  mood = '';

  constructor(
    private dialogRef: MatDialogRef<MoodDialogComponent>
  ) {}

  save() {
    console.log('Mood selected:', this.mood);
    this.dialogRef.close(this.mood);
  }

  close() {
    this.dialogRef.close();
  }
}
