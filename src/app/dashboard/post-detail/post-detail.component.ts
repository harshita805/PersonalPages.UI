import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { JournalService } from '../../services/journal.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-post-detail',
  standalone: true,
  imports: [CommonModule, DatePipe, FormsModule],
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.css']
})
export class PostDetailComponent implements OnInit {

  post: any;
  comments: any[] = [];
  commentInput = '';
  loading = true;

  private baseMediaUrl = environment.baseUrl;

  constructor(
    private route: ActivatedRoute,
    private journalService: JournalService
  ) { }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loadPost(id);
  }

  loadPost(id: number) {
    this.journalService.getJournal(id).subscribe({
      next: (res) => {
        this.post = res;
        this.loadComments(id);
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  likePost() {
    this.journalService.likeJournal(this.post.journalId)
      .subscribe(res => {
        this.post.likeCount = res.likeCount;
      });
  }

  loadComments(postId: number) {
    this.journalService.getComments(postId)
      .subscribe(res => {
        this.comments = res;
      });
  }

  addComment() {
    if (!this.commentInput.trim()) return;

    this.journalService.addComment(this.post.journalId, this.commentInput)
      .subscribe(() => {
        this.commentInput = '';
        this.loadComments(this.post.journalId);
      });
  }

  getMediaUrl(path: string): string {
    return this.baseMediaUrl + "/" + path.replace(/\\/g, '/');
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

  downloadPost() {

    const content = `
Title: ${this.post.title}
Author: ${this.post.fullName}
Date: ${new Date(this.post.createdAt).toLocaleString()}
Mood: ${this.post.mood || 'N/A'}

----------------------------------------

${this.post.content}
`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' });

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${this.post.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt`;

    link.click();
  }
}