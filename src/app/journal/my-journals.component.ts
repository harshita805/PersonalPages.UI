import { Component, inject, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { JournalService } from '../services/journal.service';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-my-journals',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './my-journals.component.html',
  styleUrl: './my-journals.component.css'
})
export class MyJournalsComponent implements OnInit {

  private journalService = inject(JournalService);
  journals: any[] = [];

  page = 1;
  pageSize = 5;
  totalRecords = 0;
  hasMore = true;
  loading = false;

  ngOnInit() {
  this.loadJournals();
}

loadJournals() {
  if (this.loading || !this.hasMore) return;

  this.loading = true;

  this.journalService
    .getMyJournals(this.page, this.pageSize)
    .subscribe({
      next: (res) => {

        // Append results
        this.journals = [...this.journals, ...res.data];

        this.totalRecords = res.totalRecords;

        // Check if more records exist
        this.hasMore = this.journals.length < this.totalRecords;

        this.page++;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
}

  getMoodEmoji(mood: string): string {
    switch (mood?.toLowerCase()) {
      case 'happy': return '😊';
      case 'sad': return '😢';
      case 'angry': return '😡';
      case 'anxious': return '😰';
      case 'excited': return '🤩';
      case 'calm': return '😌';
      default: return '🙂';
    }
  }
}
