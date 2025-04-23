//admin-login.component.ts

import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { signal } from '@angular/core';
import { AdminServise } from '../../core/admin.service';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [FormsModule, RouterModule],
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css'],
})
export class AdminLoginComponent implements OnInit {
  private adminService = inject(AdminServise);

  // Form data
  adminEmail = '';
  adminPassword = '';
  adminRememberMe = false;

  // UI state
  showPassword = signal(false);
  isSubmitted = signal(false);
  errorMessage = signal('');

  @ViewChild('adminLoginForm') adminLoginForm!: NgForm;

  constructor(private router: Router) {}

  ngOnInit(): void {
    const rememberedEmail = localStorage.getItem('rememberedAdminEmail');
    if (rememberedEmail) {
      this.adminEmail = rememberedEmail;
      this.adminRememberMe = true;
    }
  }

  togglePassword(): void {
    this.showPassword.set(!this.showPassword());
  }

  onAdminSubmit() {
    const payload = {
      adminEmail: this.adminEmail.trim(),
      adminPassword: this.adminPassword.trim(),
    };

    if (this.adminRememberMe) {
      localStorage.setItem('rememberedAdminEmail', this.adminEmail.trim());
    } else {
      localStorage.removeItem('rememberedAdminEmail');
    }

    this.adminService.adminlogin(payload).subscribe({
      next: (res: any) => {
        sessionStorage.setItem(
          'adminSession',
          JSON.stringify({
            token: res.access_token,
            role: 'admin',
            email: this.adminEmail.trim(),
          })
        );
        alert('Welcome Admin!');
        this.router.navigate(['/admindashboard']);
      },
      error: (err) => {
        alert(err.error.detail || 'Invalid credentials!');
      },
    });
  }
}
