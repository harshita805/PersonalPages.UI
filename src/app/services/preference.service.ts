import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class PreferenceService {

    private http = inject(HttpClient);
    private baseUrl = environment.apiBaseUrl;

    savePreferences(data: any) {
        return this.http.post(`${this.baseUrl}/preferences`, data);
    }

    getPreferences() {
        return this.http.get<any>(`${this.baseUrl}/preferences`);
    }
}