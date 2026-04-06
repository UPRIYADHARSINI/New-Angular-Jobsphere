import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css']
})
export class AdminLoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';

  private readonly ADMIN_USERNAME = 'admin@jobsphere.com';
  private readonly ADMIN_PASSWORD = 'admin123';

  constructor(private router: Router) {}

  onLogin(): void {
    if (this.username === this.ADMIN_USERNAME && this.password === this.ADMIN_PASSWORD) {
      localStorage.setItem('isAdmin', 'true');  // ✅ add this line
      this.router.navigate(['/admin-home']);
    } else {
      this.errorMessage = '❌ Invalid username or password!';
    }
  }
  
  goToHome(): void {
    this.router.navigate(['/home']);
  }
}
