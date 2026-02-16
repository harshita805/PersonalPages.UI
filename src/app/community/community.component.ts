import { Component, OnInit } from '@angular/core';
import { JournalService } from '../services/journal.service';
import { DatePipe, SlicePipe } from '@angular/common';

@Component({
  selector: 'app-community',
  templateUrl: './community.component.html',
  styleUrls: ['./community.component.css'],
  imports: [SlicePipe, DatePipe]
})
export class CommunityComponent implements OnInit {

  posts: any[] = [];
  commentInputs: { [key: number]: string } = {};
  commentsMap: { [key: number]: any[] } = {};

  constructor(private journalService: JournalService) { }

  ngOnInit(): void {
    this.loadPosts();
  }

  // 🔹 Load all journals
  loadPosts() {
    this.journalService.getPublicJournals()
      .subscribe(res => {
        this.posts = res;
      });
  }

  // 🔹 Like from community page
  likePost(post: any) {
    this.journalService.likeJournal(post.id)
      .subscribe(res => {
        post.likeCount = res.likeCount;
      });
  }

  // 🔹 Load comments for a post
  loadComments(postId: number) {
    this.journalService.getComments(postId)
      .subscribe(res => {
        this.commentsMap[postId] = res;
      });
  }

  // 🔹 Add comment inline
  addComment(post: any) {

    const content = this.commentInputs[post.id];
    if (!content || !content.trim()) return;

    this.journalService.addComment(post.id, content)
      .subscribe(() => {
        this.commentInputs[post.id] = '';
        this.loadComments(post.id);
      });
  }

}
