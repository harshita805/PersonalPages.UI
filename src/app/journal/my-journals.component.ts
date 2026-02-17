import { Component, inject, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { JournalService } from '../services/journal.service';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-my-journals',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './my-journals.component.html',
  styleUrl: './my-journals.component.css'
})
export class MyJournalsComponent implements OnInit {

  private journalService = inject(JournalService);
  journals: any[] = [];

  ngOnInit() {
    this.journalService.getMyJournals()
      .subscribe(data => this.journals = data);
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
