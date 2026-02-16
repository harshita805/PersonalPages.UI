import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class JournalService {

  private baseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) { }

  createJournal(data: any) {
    return this.http.post(`${this.baseUrl}/journal`, data);
  }

  getMyJournals() {
    return this.http.get<any[]>(`${this.baseUrl}/journal/my`);
  }

  getPublicJournals() {
    return this.http.get<any[]>(`${this.baseUrl}/journal/public`);
  }

  getJournal(id: number) {
    return this.http.get<any>(`${this.baseUrl}/journal/${id}`);
  }

  likeJournal(id: number) {
    return this.http.post<any>(`${this.baseUrl}/journal/${id}/like`, {});
  }

  addComment(id: number, content: string) {
    return this.http.post(`${this.baseUrl}/journal/${id}/comment`, { content });
  }

  getComments(id: number) {
    return this.http.get<any[]>(`${this.baseUrl}/journal/${id}/comments`);
  }
}
