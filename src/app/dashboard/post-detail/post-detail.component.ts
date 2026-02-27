import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { JournalService } from '../../services/journal.service';
import { environment } from '../../../environments/environment';
import { getMoodEmoji, getMediaUrl, sharePost, downloadPost } from '../../shared/util';

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

  getMoodEmoji(mood: string): string {
    return getMoodEmoji(mood);
  }

  getMediaUrl(path: string): string {
    return getMediaUrl(path, this.baseMediaUrl);
  }

  downloadPost(post: any, event: Event) {
    downloadPost(post, event);
  }
}