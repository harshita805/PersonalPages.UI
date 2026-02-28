import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AiChatService } from '../services/ai-chat.service';

@Component({
  selector: 'app-ai-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ai-chat.component.html',
  styleUrls: ['./ai-chat.component.css']
})
export class AiChatComponent {
isOpen = false;
  message = '';
  loading = false;

  messages: { role: string, text: string }[] = [];

  #aiChatService = inject(AiChatService);

  constructor(private http: HttpClient) {}

  toggleChat() {
    this.isOpen = !this.isOpen;
  }

  sendMessage() {
    if (!this.message.trim()) return;

    const userMessage = this.message;

    this.messages.push({ role: 'user', text: userMessage });
    this.message = '';
    this.loading = true;

    this.#aiChatService.sendMessage(userMessage).subscribe(res => {
      this.messages.push({ role: 'ai', text: res.reply });
      this.loading = false;
    });
  }
}