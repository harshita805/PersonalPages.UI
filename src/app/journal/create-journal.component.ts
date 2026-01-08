import { Component, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { JournalService } from '../services/journal.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-journal',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatFormFieldModule
  ],
  templateUrl: './create-journal.component.html'
})
export class CreateJournalComponent {

  private fb = inject(FormBuilder);
  private journalService = inject(JournalService);
  private router = inject(Router);

  journalForm = this.fb.group({
    title: ['', Validators.required],
    content: ['', Validators.required],
    mood: [''],
    isPublic: [false]
  });

  save() {
    if (this.journalForm.invalid) return;

    this.journalService.createJournal(this.journalForm.value)
      .subscribe(() => {
        alert('Journal saved');
        this.router.navigate(['/journal/my']);
      });
  }
}
