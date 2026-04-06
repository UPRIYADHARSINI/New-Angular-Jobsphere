import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  showModal = false;
  showLoginModal = false;

  constructor(private router: Router) {}

  // Register Modal
  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }
  activeMenu: string = '';

  goToUserRegister() {
    this.closeModal();
    setTimeout(() => {
      this.router.navigate(['/user-register']);
    }, 200);
  }

  goToRecruiterRegister() {
    this.closeModal();
    setTimeout(() => {
      this.router.navigate(['/recruiter-register']);
    }, 200);
  }

  // Login Modal
  openLoginModal() {
    this.showLoginModal = true;
  }

  closeLoginModal() {
    this.showLoginModal = false;
  }

  goToUserLogin() {
    this.closeLoginModal();
    setTimeout(() => {
      this.router.navigate(['/user-login']);
    }, 200);
  }

  goToRecruiterLogin() {
    this.closeLoginModal();
    setTimeout(() => {
      this.router.navigate(['/recruiter-login']);
    }, 200);
  }

  goToAdminLogin() {
    this.closeLoginModal();
    setTimeout(() => {
      this.router.navigate(['/admin-login']);
    }, 200);
  }
}
