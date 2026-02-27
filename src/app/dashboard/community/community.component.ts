import { CommonModule, DatePipe, SlicePipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Journal } from '../../model/journal';
import { JournalService } from '../../services/journal.service';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { AlertService } from '../../services/alert.service';
import { downloadPost, getMediaUrl, getMoodEmoji, sharePost } from '../../shared/util';

@Component({
  selector: 'app-community',
  templateUrl: './community.component.html',
  styleUrls: ['./community.component.css'],
  imports: [CommonModule, SlicePipe, DatePipe, FormsModule]
})
export class CommunityComponent implements OnInit {
  #journalService = inject(JournalService);
  #router = inject(Router);
  #alertService = inject(AlertService);

  // Store comments per post
  commentsMap: { [key: number]: any[] } = {};

  // Store comment input per post
  commentInputs: { [key: number]: string } = {};

  // Toggle comment section
  showComments: { [key: number]: boolean } = {};
  posts: Journal[] = [];
  page = 1;
  pageSize = 5;
  totalRecords = 0;
  hasMore = true;
  loading = false;
  searchTerm = '';
  private searchTimeout: any;
  private baseMediaUrl = environment.baseUrl;

  ngOnInit(): void {
    this.loadPosts();
  }

  loadPosts() {
    if (this.loading || !this.hasMore) return;

    this.loading = true;

    this.#journalService
      .getPublicPosts(this.page, this.pageSize, this.searchTerm)
      .subscribe({
        next: (res) => {

          this.posts = [...this.posts, ...res.data];
          this.totalRecords = res.totalRecords;

          this.hasMore = this.posts.length < this.totalRecords;

          this.page++;
          this.loading = false;
        },
        error: () => this.loading = false
      });
  }

  likePost(post: any) {
    this.#journalService.likeJournal(post.journalId)
      .subscribe(res => {
        post.likeCount = res.likeCount;
      });
  }

  toggleComments(postId: number) {
    this.showComments[postId] = !this.showComments[postId];

    if (this.showComments[postId]) {
      this.loadComments(postId);
    }
  }

  loadComments(postId: number) {
    this.#journalService.getComments(postId)
      .subscribe(res => {
        this.commentsMap[postId] = res;
      });
  }

  addComment(post: any) {

    const content = this.commentInputs[post.journalId];
    if (!content || !content.trim()) return;

    this.#journalService.addComment(post.journalId, content)
      .subscribe(() => {

        // Clear input
        this.commentInputs[post.journalId] = '';

        // Reload comments
        this.loadComments(post.journalId);
      });
  }

  onSearchChange(value: string) {
    this.searchTerm = value;

    // Clear previous timer
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }

    // Wait 500ms after typing stops
    this.searchTimeout = setTimeout(() => {
      this.resetAndSearch();
    }, 500);
  }

  resetAndSearch() {
    this.page = 1;
    this.posts = [];
    this.hasMore = true;

    this.loadPosts();
  }

  openPost(post: any) {

  // 🔥 If virtual AI post (not saved in DB)
  if (post.isVirtual || post.journalId < 0) {

    const url = this.#router.serializeUrl(
      this.#router.createUrlTree(['/post'], {
        queryParams: {
          virtual: true,
          title: post.title,
          content: post.content,
          mood: post.mood,
          author: post.fullName,
          createdAt: post.createdAt
        }
      })
    );

    window.open(url, '_blank');
    return;
  }

  // ✅ Normal DB post
  const url = this.#router.serializeUrl(
    this.#router.createUrlTree(['/post', post.journalId])
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
