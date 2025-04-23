// user.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { signal } from '@angular/core';

interface LoginPayload {
  email: string;
  password: string;
}

interface SignupPayload {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
}

interface ProfileUpdatePayload {
  firstname?: string;
  lastname?: string;
  email?: string;
  mobile?: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private baseUrl = 'https://fullstack-1-1-ohld.onrender.com/auth';

  constructor(private http: HttpClient) {}

  login(payload: LoginPayload): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, payload);
  }

  signup(payload: SignupPayload): Observable<any> {
    return this.http.post(`${this.baseUrl}/signup`, payload);
  }

  userProfile = signal<any>(null);

  getProfile() {
    return this.http.get(`${this.baseUrl}/profile`);
  }

  logout() {
    sessionStorage.removeItem('userSession');
    this.userProfile.set(null);
  }

  updateProfile(updatedData: ProfileUpdatePayload) {
    const cleanData = Object.fromEntries(
      Object.entries(updatedData).filter(([_, v]) => v != null)
    );
    return this.http.put(`${this.baseUrl}/profile-update`, cleanData);
  }

  deleteAccount() {
    return this.http.delete(`${this.baseUrl}/profile-delete`);
  }
}
