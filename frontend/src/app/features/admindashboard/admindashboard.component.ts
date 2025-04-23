//admindashboard.component.ts

import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminServise } from '../../core/admin.service';
import { HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admindashboard.component.html',
  styleUrls: ['./admindashboard.component.css'],
})
export class AdminDashboardComponent implements OnInit {
  private adminService = inject(AdminServise);
  private router = inject(Router);

  users = signal<any[]>([]);
  isLoading = signal(false);
  error = signal('');

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers() {
    const token = JSON.parse(
      sessionStorage.getItem('adminSession') || '{}'
    ).token;
    if (!token) {
      this.error.set('Admin token not found');
      return;
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    this.isLoading.set(true);

    this.adminService.adminDbDataWithHeaders(headers).subscribe({
      next: (res: any) => {
        this.users.set(res);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set(err.error.detail || 'Failed to fetch users');
        this.isLoading.set(false);
      },
    });
  }

  logout() {
    if (window.confirm('Are you sure?')) {
      sessionStorage.removeItem('adminSession');
      this.router.navigate(['/adminlogin']);
    }
  }

  deleteUser(id: number) {
    const token = JSON.parse(
      sessionStorage.getItem('adminSession') || '{}'
    ).token;
    if (!token) {
      alert('Admin not authenticated');
      return;
    }
    if (confirm('Are you sure you want to delete this user?')) {
      this.adminService.adminDeleteUser(id, token).subscribe({
        next: (res: any) => {
          alert(res.message || 'User deleted successfully');
          // Refresh user list
          this.fetchUsers();
        },
        error: (err) => {
          alert(err.error.detail || 'Failed to delete user');
        },
      });
    }
  }
}
