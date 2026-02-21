import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { AiService } from '../services/ai.service';
import { JournalService } from '../services/journal.service';
import { MoodService } from '../services/mood.service';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-create-journal',
  templateUrl: './create-journal.component.html',
  styleUrls: ['./create-journal.component.css'],
  imports: [CommonModule, DecimalPipe, FormsModule]
})
export class CreateJournalComponent implements OnInit {

  title: string = '';
  content: string = '';

  // Mood
  detectedMood: string = 'Neutral';
  moodConfidence: number = 0;
  isMoodLoading: boolean = false;

  // AI Suggestion
  suggestion: string = '';
  isSuggestionLoading: boolean = false;
  isPublic: boolean = false; // default private

  isSaving: boolean = false;

  private moodSubject = new Subject<string>();
  private suggestionSubject = new Subject<string>();

  constructor(
    private aiService: AiService,
    private moodService: MoodService,
    private journalService: JournalService
  ) { }

  ngOnInit(): void {

    // 🔹 Real-time Mood Detection
    this.moodSubject.pipe(
      debounceTime(1500),
      distinctUntilChanged()
    ).subscribe(text => {
      if (text.length > 10) {
        this.fetchMood(text);
      } else {
        this.detectedMood = 'Neutral';
      }
    });

    // 🔹 Real-time AI Suggestion
    this.suggestionSubject.pipe(
      debounceTime(2500),
      distinctUntilChanged()
    ).subscribe(text => {
      if (text.length > 40) {
        this.fetchSuggestion(text);
      } else {
        this.suggestion = '';
      }
    });
  }

  onContentChange(event: any) {
    let value = event?.target?.value;
    this.content = value;
    this.moodSubject.next(value);
    this.suggestionSubject.next(value);
  }

  // ======================
  // Mood Detection
  // ======================

  fetchMood(text: string) {
    this.isMoodLoading = true;

    this.moodService.detectMood(text).subscribe({
      next: (res) => {
        this.detectedMood = res.mood || 'Neutral';
        this.moodConfidence = res.confidence || 0;
        this.isMoodLoading = false;
      },
      error: () => {
        this.detectedMood = 'Neutral';
        this.isMoodLoading = false;
      }
    });
  }

  // ======================
  // AI Suggestion
  // ======================

  fetchSuggestion(text: string) {
    this.isSuggestionLoading = true;

    this.aiService.getSuggestion(text).subscribe({
      next: (res) => {
        this.suggestion = res.suggestion;
        this.isSuggestionLoading = false;
      },
      error: () => {
        this.suggestion = '';
        this.isSuggestionLoading = false;
      }
    });
  }

  acceptSuggestion() {
    if (this.suggestion) {
      this.content += ' ' + this.suggestion;
      this.suggestion = '';
    }
  }

  // ======================
  // Save Journal
  // ======================

  saveJournal() {

    if (!this.title || !this.content) {
      alert('Title and content are required.');
      return;
    }

    this.isSaving = true;

    const journalData = {
      title: this.title,
      content: this.content,
      mood: this.detectedMood,
      moodConfidence: this.moodConfidence,
      isPublic: this.isPublic
    };

    this.journalService.createJournal(journalData).subscribe({
      next: () => {
        alert('Journal saved successfully!');
        this.title = '';
        this.content = '';
        this.suggestion = '';
        this.detectedMood = 'Neutral';
        this.isSaving = false;
      },
      error: () => {
        alert('Error saving journal.');
        this.isSaving = false;
      }
    });
  }

  appendSuggestion() {

    if (!this.suggestion) return;

    // Avoid duplicate append
    if (!this.content.includes(this.suggestion)) {

      // Add proper spacing
      if (this.content.trim().length > 0) {
        this.content += '\n\n' + this.suggestion;
      } else {
        this.content = this.suggestion;
      }
    }

    // Clear suggestion after use
    this.suggestion = '';

    // Optional: trigger mood update again
    this.moodSubject.next(this.content);
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
