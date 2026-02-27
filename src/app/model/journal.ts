export interface JournalMedia {
  id: number;
  filePath: string;
  fileType: string;
  base64Data?: string;
}

export interface Journal {
  journalId: number;
  title: string;
  content: string;
  mood: string;
  createdAt: Date;
  fullName: string;
  likeCount: number;
  commentCount: number;

  media?: JournalMedia[];   // 🔥 ADD THIS
}