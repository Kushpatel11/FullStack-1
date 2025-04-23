import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

interface AdminLoginPayload {
  adminEmail: string;
  adminPassword: string;
}

@Injectable({ providedIn: 'root' })
export class AdminServise {
  private baseUrl = 'https://fullstack-1-1-ohld.onrender.com/admin';
  private http = inject(HttpClient);

  adminlogin(payload: AdminLoginPayload) {
    return this.http.post(`${this.baseUrl}/login`, payload);
  }

  adminDbDataWithHeaders(headers: HttpHeaders) {
    return this.http.get(`${this.baseUrl}/admin-dashboard`, { headers });
  }

  adminDeleteUser(id: number, token: string) {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete(`${this.baseUrl}/admin-delete-user/${id}`, {
      headers,
    });
  }
}
