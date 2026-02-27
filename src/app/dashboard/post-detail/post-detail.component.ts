import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { JournalService } from '../../services/journal.service';
import { environment } from '../../../environments/environment';
import { getMoodEmoji, getMediaUrl, downloadPost } from '../../shared/util';

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

  ngOnInit() {

    this.route.queryParams.subscribe(params => {

      // 🔥 Virtual AI Post
      if (params['virtual'] === 'true') {

        this.post = {
          journalId: -1,
          title: params['title'],
          content: params['content'],
          mood: params['mood'],
          authorName: params['author'],   // ✅ FIXED
          createdAt: new Date(params['createdAt']),
          isVirtual: true,
          likeCount: 0,
          commentCount: 0,
          viewCount: 0,
          media: []
        };

        this.loading = false;   // ✅ IMPORTANT FIX
        return;
      }

      // ✅ Real DB Post
      this.route.paramMap.subscribe(paramMap => {
        const idParam = paramMap.get('id');

        if (idParam) {
          const id = Number(idParam);

          if (!isNaN(id)) {
            this.loadPostFromApi(id);
          }
        }
      });

    });
  }

  loadPostFromApi(id: number) {
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
    if (this.post.isVirtual) {
      this.post.likeCount++;
      return;
    }

    this.journalService.likeJournal(this.post.journalId)
      .subscribe(res => {
        this.post.likeCount = res.likeCount;
      });
  }

  loadComments(postId: number) {
    if (this.post?.isVirtual) return;

    this.journalService.getComments(postId)
      .subscribe(res => {
        this.comments = res;
      });
  }

  addComment() {
    if (!this.commentInput.trim()) return;

    if (this.post.isVirtual) {
      this.comments.unshift({
        content: this.commentInput,
        createdAt: new Date()
      });
      this.commentInput = '';
      return;
    }

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