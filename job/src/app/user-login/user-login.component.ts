// user-login.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  resumeUrl?: string;
  profileImageUrl?: string;
  qualification?: string;
  status?: string;
}

@Component({
  selector: 'app-user-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.css']
})
export class UserLoginComponent {
  user = {
    email: '',
    password: ''
  };

  constructor(private router: Router, private http: HttpClient) {}

  login(): void {
    if (!this.user.email || !this.user.password) {
      alert('Please enter Email and Password');
      return;
    }

    // Clear existing localStorage to avoid stale data
    localStorage.removeItem('user');
    localStorage.removeItem('userId');

    console.log('📤 Attempting login with:', this.user);
    this.http.post<{ message: string; user: User }>('http://localhost:5000/api/user-login', this.user).subscribe({
      next: (response) => {
        console.log('✅ Login response:', response);
        if (response.message === '✅ Login successful!' && response.user._id) {
          localStorage.setItem('userId', response.user._id); // Store userId for UserProfileComponent
          localStorage.setItem('user', JSON.stringify(response.user)); // Keep user object if needed
          console.log('📦 Stored userId in localStorage:', response.user._id);
          alert('Login successful!');
          this.router.navigate(['/user-home']);
        } else {
          console.error('❌ Invalid response or missing user ID');
          alert('Login failed: Invalid response from server.');
        }
      },
      error: (err) => {
        console.error('❌ Login error:', err);
        alert('Login failed! Please check your credentials or server status.');
      }
    });
  }

  goToRegister() {
    this.router.navigate(['/user-register']);
  }
  goBack(): void {
    this.router.navigate(['/']);
  }
}