export interface Journal {
  journalId: number;
  title: string;
  content: string;
  mood: string;
  createdAt: Date;
  authorName: string;
  likeCount: number;
  commentCount: number;
}