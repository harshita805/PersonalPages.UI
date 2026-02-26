import { CommonModule, DatePipe, SlicePipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Journal } from '../../model/journal';
import { JournalService } from '../../services/journal.service';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { AlertService } from '../../services/alert.service';
import jsPDF from 'jspdf';

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
    return this.baseMediaUrl + "/wwwroot/" + path.replace(/\\/g, '/');
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
        this.#alertService.show('Link copied to clipboard!');
      });
    }
  }

  async downloadPost(post: any, event: Event) {

    event.stopPropagation();

    const pdf = new jsPDF('p', 'mm', 'a4');

    let yPosition = 15;

    // Title
    pdf.setFontSize(18);
    pdf.text(post.title, 15, yPosition);
    yPosition += 10;

    pdf.setFontSize(11);
    pdf.text(`Author: ${post.fullName}`, 15, yPosition);
    yPosition += 7;

    pdf.text(`Date: ${new Date(post.createdAt).toLocaleString()}`, 15, yPosition);
    yPosition += 7;

    pdf.text(`Mood: ${post.mood || 'N/A'}`, 15, yPosition);
    yPosition += 10;

    pdf.line(15, yPosition, 195, yPosition);
    yPosition += 10;

    // Content (auto wrap)
    pdf.setFontSize(12);
    const contentLines = pdf.splitTextToSize(post.content, 180);
    pdf.text(contentLines, 15, yPosition);
    yPosition += contentLines.length * 6 + 5;

    // 🔥 Add Media
    if (post.media && post.media.length > 0) {

      for (const file of post.media) {

        // Add new page if near bottom
        if (yPosition > 250) {
          pdf.addPage();
          yPosition = 15;
        }

        if (file.fileType.startsWith('image/')) {

          const imageUrl = this.getMediaUrl(file.filePath);

          const img = await this.loadImageAsBase64(imageUrl);

          pdf.addImage(img, 'JPEG', 15, yPosition, 180, 90);
          yPosition += 100;
        }

        if (file.fileType.startsWith('video/')) {

          pdf.setFontSize(11);
          pdf.text(`Video: ${this.getMediaUrl(file.filePath)}`, 15, yPosition);
          yPosition += 10;
        }
      }
    }

    pdf.save(`${post.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`);
  }

  loadImageAsBase64(url: string): Promise<string> {

    return new Promise((resolve, reject) => {

      const img = new Image();
      img.crossOrigin = 'anonymous';

      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;

        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0);

        resolve(canvas.toDataURL('image/jpeg'));
      };

      img.onerror = error => reject(error);

      img.src = url;
    });
  }
}
