import { Component, inject, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { JournalService } from '../services/journal.service';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Journal } from '../model/journal';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-my-journals',
  standalone: true,
  imports: [CommonModule, DatePipe, FormsModule],
  templateUrl: './my-journals.component.html',
  styleUrl: './my-journals.component.css'
})
export class MyJournalsComponent implements OnInit {

  private journalService = inject(JournalService);
  journals: Journal[] = [];

  page = 1;
  pageSize = 5;
  totalRecords = 0;
  hasMore = true;
  loading = false;
  searchTerm = '';
  private searchTimeout: any;
  private baseMediaUrl = environment.baseUrl;
  
  ngOnInit() {
    this.loadJournals();
  }

  loadJournals() {

    if (this.loading || !this.hasMore) return;

    this.loading = true;

    this.journalService
      .getMyJournals(this.page, this.pageSize, this.searchTerm)
      .subscribe({
        next: (res) => {

          this.journals = [...this.journals, ...res.data];

          this.totalRecords = res.totalRecords;

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

  onSearchChange(value: string) {

    this.searchTerm = value;

    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }

    this.searchTimeout = setTimeout(() => {
      this.resetAndSearch();
    }, 500);
  }

  resetAndSearch() {
    this.page = 1;
    this.journals = [];
    this.hasMore = true;

    this.loadJournals();
  }

  getMediaUrl(path: string): string {
    return this.baseMediaUrl + path.replace(/\\/g, '/');
  }
}
