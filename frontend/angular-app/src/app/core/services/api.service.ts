import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  get(endpoint: string, params: any = {}) {
    return this.http.get(`${this.baseUrl}/${endpoint}`, { params });
  }

  post(endpoint: string, body: any) {
    return this.http.post(`${this.baseUrl}/${endpoint}`, body);
  }

  put(endpoint: string, body: any) {
    return this.http.put(`${this.baseUrl}/${endpoint}`, body);
  }

  delete(endpoint: string) {
    return this.http.delete(`${this.baseUrl}/${endpoint}`);
  }
}
