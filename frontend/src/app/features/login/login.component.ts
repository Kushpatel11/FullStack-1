//login.component.ts

import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../../core/user.service'; // ✅ Import

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [FormsModule, RouterModule],
})
export class LoginComponent {
  private router = inject(Router);
  private userService = inject(UserService); // ✅ Injected service

  email = signal('');
  password = signal('');
  showPassword = signal(false);
  rememberMe = signal(false);
  isSubmitted = signal(false);

  togglePassword(): void {
    this.showPassword.set(!this.showPassword());
  }

  ngOnInit(): void {
    const remembered = localStorage.getItem('rememberedEmail');
    if (remembered) {
      this.email.set(remembered);
      this.rememberMe.set(true);
    }
  }

  goToAdminLogin() {
    window.confirm('Are you Admin?');
    this.router.navigate(['/adminlogin']);
  }

  onSubmit() {
    const enteredEmail = this.email().trim();
    const enteredPassword = this.password().trim();

    if (this.rememberMe()) {
      localStorage.setItem('rememberedEmail', enteredEmail);
    } else {
      localStorage.removeItem('rememberedEmail');
    }

    const payload = { email: enteredEmail, password: enteredPassword };

    this.userService.login(payload).subscribe({
      next: (res) => {
        sessionStorage.setItem(
          'userSession',
          JSON.stringify({
            token: res.access_token,
            role: 'user',
            email: enteredEmail,
          })
        );
        alert('Login successful!');
        this.router.navigate(['/profile']);
      },
      error: (err) => {
        alert(err.error.detail || 'Invalid credentials!');
      },
    });
  }
}
