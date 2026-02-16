import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class MoodService {

    private http = inject(HttpClient);
    private baseUrl = environment.apiBaseUrl;

    detectMood(content: string): Observable<{ mood: string, confidence: number }> {
        return this.http.post<{ mood: string, confidence: number }>(
            `${this.baseUrl}/mood/detect`,
            { content }
        );
    }
}
