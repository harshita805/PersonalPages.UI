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

  posts: any[] = [];

  // Store comments per post
  commentsMap: { [key: number]: any[] } = {};

  // Store comment input per post
  commentInputs: { [key: number]: string } = {};

  // Toggle comment section
  showComments: { [key: number]: boolean } = {};

  constructor(private journalService: JournalService) { }

  ngOnInit(): void {
    this.loadPosts();
  }

  loadPosts() {
    this.journalService.getPublicJournals()
      .subscribe(res => {
        this.posts = res;
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
