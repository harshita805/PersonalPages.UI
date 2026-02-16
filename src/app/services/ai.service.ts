import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AiService {

  private baseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  getSuggestion(content: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/Ai/suggest`, {
      content: content
    });
  }
}
