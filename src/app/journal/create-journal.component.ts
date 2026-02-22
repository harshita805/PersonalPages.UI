import { Component, inject, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { AiService } from '../services/ai.service';
import { JournalService } from '../services/journal.service';
import { MoodService } from '../services/mood.service';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-journal',
  templateUrl: './create-journal.component.html',
  styleUrls: ['./create-journal.component.css'],
  standalone: true,
  imports: [CommonModule, DecimalPipe, FormsModule]
})
export class CreateJournalComponent implements OnInit {
  #router = inject(Router);

  title: string = '';
  content: string = '';

  // Mood
  detectedMood: string = 'Neutral';
  moodConfidence: number = 0;
  isMoodLoading: boolean = false;

  // AI Suggestion
  suggestion: string = '';
  isSuggestionLoading: boolean = false;

  // Visibility
  isPublic: boolean = false;

  // Saving
  isSaving: boolean = false;

  // 🔥 Media Upload
  selectedFiles: {
    file: File;
    preview: string;
    type: string;
  }[] = [];

  private moodSubject = new Subject<string>();
  private suggestionSubject = new Subject<string>();

  constructor(
    private aiService: AiService,
    private moodService: MoodService,
    private journalService: JournalService
  ) { }

  // ======================
  // INIT
  // ======================

  ngOnInit(): void {

    // 🔹 Mood Detection
    this.moodSubject.pipe(
      debounceTime(1500),
      distinctUntilChanged(),
      switchMap(text => {

        if (text.length <= 10) {
          this.detectedMood = 'Neutral';
          return [];
        }

        this.isMoodLoading = true;
        return this.moodService.detectMood(text);
      })
    ).subscribe({
      next: (res: any) => {
        if (!res) return;

        this.detectedMood = res.mood || 'Neutral';
        this.moodConfidence = res.confidence || 0;
        this.isMoodLoading = false;
      },
      error: () => {
        this.isMoodLoading = false;
      }
    });

    // 🔹 Suggestion
    this.suggestionSubject.pipe(
      debounceTime(2500),
      distinctUntilChanged(),
      switchMap(text => {

        if (text.length <= 40) {
          this.suggestion = '';
          return [];
        }

        this.isSuggestionLoading = true;
        return this.aiService.getSuggestion(text);
      })
    ).subscribe({
      next: (res: any) => {
        if (!res) return;

        this.suggestion = res.suggestion;
        this.isSuggestionLoading = false;
      },
      error: () => {
        this.isSuggestionLoading = false;
      }
    });
  }

  // ======================
  // Content Change
  // ======================

  onContentChange(event: any) {
    const value = event?.target?.value || '';
    this.content = value;

    this.moodSubject.next(value);
    this.suggestionSubject.next(value);
  }

  // ======================
  // Media Upload
  // ======================

  onFileSelected(event: any) {

    const files: FileList = event.target.files;

    if (!files) return;

    for (let i = 0; i < files.length; i++) {

      const file = files[i];

      // Optional: Limit file size (5MB example)
      if (file.size > 5 * 1024 * 1024) {
        alert(`${file.name} exceeds 5MB limit`);
        continue;
      }

      const reader = new FileReader();

      reader.onload = (e: any) => {
        this.selectedFiles.push({
          file: file,
          preview: e.target.result,
          type: file.type
        });
      };

      reader.readAsDataURL(file);
    }

    // Reset input so same file can be re-selected
    event.target.value = '';
  }

  removeFile(fileToRemove: any) {
    this.selectedFiles =
      this.selectedFiles.filter(f => f !== fileToRemove);
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

  appendSuggestion() {

    if (!this.suggestion) return;

    if (!this.content.includes(this.suggestion)) {

      if (this.content.trim().length > 0) {
        this.content += '\n\n' + this.suggestion;
      } else {
        this.content = this.suggestion;
      }
    }

    this.suggestion = '';

    this.moodSubject.next(this.content);
  }

  // ======================
  // Save Journal (UPDATED)
  // ======================

  saveJournal() {

    if (!this.title || !this.content) {
      alert('Title and content are required.');
      return;
    }

    this.isSaving = true;

    const formData = new FormData();

    formData.append('title', this.title);
    formData.append('content', this.content);
    formData.append('mood', this.detectedMood);
    formData.append('moodConfidence', this.moodConfidence.toString());
    formData.append('isPublic', this.isPublic.toString());

    // Append media files
    this.selectedFiles.forEach(item => {
      formData.append('files', item.file);
    });

    this.journalService.createJournal(formData).subscribe({
      next: () => {

        alert('Journal saved successfully!');

        // Reset form
        this.title = '';
        this.content = '';
        this.suggestion = '';
        this.detectedMood = 'Neutral';
        this.selectedFiles = [];
        this.isSaving = false;

        this.#router.navigate(['/dashboard']);
      },
      error: () => {
        alert('Error saving journal.');
        this.isSaving = false;
      }
    });
  }

  // ======================
  // Mood Emoji
  // ======================

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