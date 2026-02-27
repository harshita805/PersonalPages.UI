import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { Journal } from '../../model/journal';
import { JournalService } from '../../services/journal.service';
import { AlertService } from '../../services/alert.service';
import { getMoodEmoji, getMediaUrl, sharePost, downloadPost } from '../../shared/util';

@Component({
  selector: 'app-my-journals',
  standalone: true,
  imports: [CommonModule, DatePipe, FormsModule],
  templateUrl: './my-journals.component.html',
  styleUrl: './my-journals.component.css'
})
export class MyJournalsComponent implements OnInit {

  #journalService = inject(JournalService);
  #router = inject(Router);
  #alertService = inject(AlertService);

  posts: Journal[] = [];

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

    this.#journalService
      .getMyJournals(this.page, this.pageSize, this.searchTerm)
      .subscribe({
        next: (res) => {

          this.posts = [...this.posts, ...res.data];

          this.totalRecords = res.totalRecords;

          this.hasMore = this.posts.length < this.totalRecords;

          this.page++;

          this.loading = false;
        },
        error: () => {
          this.loading = false;
        }
      });
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
    this.posts = [];
    this.hasMore = true;

    this.loadJournals();
  }

  openPost(postId: number) {
    const url = this.#router.serializeUrl(
      this.#router.createUrlTree(['/post', postId])
    );

    window.open(url, '_blank');
  }

  getMoodEmoji(mood: string): string {
    return getMoodEmoji(mood);
  }

  getMediaUrl(path: string): string {
    return getMediaUrl(path, this.baseMediaUrl);
  }

  sharePost(post: any, event: Event) {
    sharePost(post, event, this.#alertService);
  }

  downloadPost(post: any, event: Event) {
    downloadPost(post, event);
  }
}
