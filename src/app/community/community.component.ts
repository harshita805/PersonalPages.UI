import { CommonModule, DatePipe, SlicePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Journal } from '../model/journal';
import { JournalService } from '../services/journal.service';
@Component({
  selector: 'app-community',
  templateUrl: './community.component.html',
  styleUrls: ['./community.component.css'],
  imports: [CommonModule, SlicePipe, DatePipe, FormsModule]
})
export class CommunityComponent implements OnInit {

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
  private baseMediaUrl = 'http://localhost:5110/';

  constructor(private journalService: JournalService) { }

  ngOnInit(): void {
    this.loadPosts();
  }

  loadPosts() {
    if (this.loading || !this.hasMore) return;

    this.loading = true;

    this.journalService
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
    this.journalService.likeJournal(post.journalId)
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
    this.journalService.getComments(postId)
      .subscribe(res => {
        this.commentsMap[postId] = res;
      });
  }

  addComment(post: any) {

    const content = this.commentInputs[post.journalId];
    if (!content || !content.trim()) return;

    this.journalService.addComment(post.journalId, content)
      .subscribe(() => {

        // Clear input
        this.commentInputs[post.journalId] = '';

        // Reload comments
        this.loadComments(post.journalId);
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

  getMediaUrl(path: string): string {
    return this.baseMediaUrl + path.replace(/\\/g, '/');
  }
}
