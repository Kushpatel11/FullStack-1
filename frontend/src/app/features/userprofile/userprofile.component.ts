// features/profile/userprofile.component.ts

import {
  Component,
  ElementRef,
  inject,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from '../../core/user.service'; // ✅ Import service

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './userprofile.component.html',
  styleUrls: ['./userprofile.component.css'],
})
export class UserProfileComponent implements OnInit {
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  fullname = signal<string>('');

  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef;

  isDarkMode = false;

  form = signal<FormGroup>(
    this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: [{ value: '', disabled: true }],
      mobile: [''],
    })
  );

  profilePhoto = signal<string | null>(null);
  selectedPhoto: string | null = null;

  ngOnInit(): void {
    this.isDarkMode = localStorage.getItem('darkMode') === 'true';
    this.applyTheme();

    this.userService.getProfile().subscribe({
      next: (res: any) => {
        this.form().patchValue({
          firstName: res.firstname,
          lastName: res.lastname,
          email: res.email,
          mobile: res.mobile || '',
        });
        this.profilePhoto.set(res.photo || null);
        this.userService.userProfile.set(res);
        this.fullname.set(res.firstname + ' ' + res.lastname);
      },
      error: (err) => {
        alert(err.error.detail || 'Failed to load profile');
        this.router.navigate(['/login']);
      },
    });
  }

  triggerFileInput() {
    this.fileInput?.nativeElement?.click();
  }

  onFileChange(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.selectedPhoto = reader.result as string;
        this.profilePhoto.set(this.selectedPhoto);
      };
      reader.readAsDataURL(file);
    }
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    localStorage.setItem('darkMode', String(this.isDarkMode));
    this.applyTheme();
  }

  applyTheme() {
    const body = document.body;
    body.className = '';
    body.classList.add(this.isDarkMode ? 'dark-mode' : 'light-mode');
  }

  logOut() {
    if (confirm('Are you sure?')) {
      this.userService.logout();
      this.router.navigate(['/login']);
    }
  }

  deleteAcc() {
    if (confirm('Are you sure you want to delete your account?')) {
      this.userService.deleteAccount().subscribe({
        next: () => {
          alert('Account deleted!');
          sessionStorage.removeItem('userSession');
          this.router.navigate(['/signup']);
        },
        error: (err) => alert(err.error.detail || 'Deletion failed!'),
      });
    }
  }

  onUpdateProfile() {
    if (this.form().valid) {
      const rawData = this.form().getRawValue();

      // Send only defined, non-null, non-empty values
      const updatedUser = Object.fromEntries(
        Object.entries(rawData).filter(
          ([_, v]) => v !== null && v !== undefined
        )
      );

      console.log('📦 Sending to backend:', updatedUser);

      this.userService.updateProfile(updatedUser).subscribe({
        next: () => alert('Profile updated successfully!'),
        error: (err) => {
          console.error('Update Error:', err);
          alert(err.error.detail || 'Failed to update profile');
        },
      });
    } else {
      alert('Please fill all required fields.');
    }
  }
}
