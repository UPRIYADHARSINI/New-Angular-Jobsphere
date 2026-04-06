import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router'; // Import Router

@Component({
  selector: 'app-user-registration',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-register.component.html',
  styleUrls: ['./user-register.component.css']
})
export class UserRegistrationComponent {
  constructor(private http: HttpClient, private router: Router) {} // Inject Router

  user = {
    name: '',
    email: '',
    phone: '',
    password: '',
    qualification: '',
    status: '',
    agreeTerms: false
  };

  selectStatus(status: string) {
    this.user.status = status;
  }

  registerUser() {
    if (
      !this.user.name ||
      !this.user.email ||
      !this.user.phone ||
      !this.user.password ||
      !this.user.qualification ||
      !this.user.status ||
      !this.user.agreeTerms
    ) {
      alert('❌ Please fill all fields correctly and accept the terms!');
      return;
    }

    this.http.post('http://localhost:5000/api/user-register', this.user).subscribe({
      next: (res: any) => {
        alert('✅ User Registered Successfully!');
        this.router.navigate(['/user-login']); // Navigate to login page after registration
      },
      error: (err) => {
        console.error('❌ Registration error:', err);
        if (err.status === 409) {
          alert('⚠️ A user with this email or phone already exists!');
        } else {
          alert('❌ Error during registration. Please try again.');
        }
      }
    });
  }

  goToLogin() {
    this.router.navigate(['/user-login']); // Navigate to login page
  }
}