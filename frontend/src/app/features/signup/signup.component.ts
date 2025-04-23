import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../../core/user.service'; // ✅ Import

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
  standalone: true,
  imports: [FormsModule, RouterModule],
})
export class SignupComponent {
  private router = inject(Router);
  private userService = inject(UserService); // ✅ Injected service

  showPassword = false;
  user = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  };

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    const payload = {
      firstname: this.user.firstName,
      lastname: this.user.lastName,
      email: this.user.email,
      password: this.user.password,
    };

    this.userService.signup(payload).subscribe({
      next: () => {
        alert('User registered successfully!');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        alert(err.error.detail || 'Registration failed!');
      },
    });
  }
}
