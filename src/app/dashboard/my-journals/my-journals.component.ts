import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { Journal } from '../../model/journal';
import { JournalService } from '../../services/journal.service';

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
    this.posts = [];
    this.hasMore = true;

    this.loadJournals();
  }

  getMediaUrl(path: string): string {
    return this.baseMediaUrl + path.replace(/\\/g, '/');
  }

  openPost(postId: number) {
    const url = this.#router.serializeUrl(
      this.#router.createUrlTree(['/post', postId])
    );

    window.open(url, '_blank');
  }

    sharePost(post: any, event: Event) {

    // Prevent post card click
    event.stopPropagation();

    const postUrl = `${window.location.origin}/post/${post.journalId}`;

    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.content?.slice(0, 100),
        url: postUrl
      }).catch(() => { });
    } else {
      navigator.clipboard.writeText(postUrl).then(() => {
        alert('Link copied to clipboard!');
      });
    }
  }

  downloadPost(post: any, event: Event) {

    // Prevent opening post card
    event.stopPropagation();

    const content = `
Title: ${post.title}
Author: ${post.fullName}
Date: ${new Date(post.createdAt).toLocaleString()}
Mood: ${post.mood || 'N/A'}

----------------------------------------

${post.content}
`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' });

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${post.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt`;

    link.click();
  }
}
