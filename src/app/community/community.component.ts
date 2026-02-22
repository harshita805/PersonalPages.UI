import { Component, OnInit } from '@angular/core';
import { JournalService } from '../services/journal.service';
import { CommonModule, DatePipe, SlicePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
  posts: any[] = [];
  page = 1;
  pageSize = 5;
  totalRecords = 0;
  hasMore = true;
  loading = false;

  constructor(private journalService: JournalService) { }

  ngOnInit(): void {
    this.loadPosts();
  }

  loadPosts() {
  if (this.loading || !this.hasMore) return;

  this.loading = true;

  this.journalService
    .getPublicJournals(this.page, this.pageSize)
    .subscribe({
      next: (res) => {
        // Append new data
        this.posts = [...this.posts, ...res.data];

        this.totalRecords = res.totalRecords;

        // Check if more data exists
        this.hasMore = this.posts.length < this.totalRecords;

        this.page++;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
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
}
