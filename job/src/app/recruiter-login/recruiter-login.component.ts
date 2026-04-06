import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

// Define Recruiter interface (optional but recommended for type safety)
interface Recruiter {
  _id: string;
  name: string;
  companyType: string;
  companyName: string;
  mainBranch: string;
  experience: number;
  email: string;
  contactNumber: string;
  website: string;
  profileImageUrl: string;
  password?: string; // Optional, since it might not be returned
}

@Component({
  selector: 'app-recruiter-login',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './recruiter-login.component.html',
  styleUrls: ['./recruiter-login.component.css']
})
export class RecruiterLoginComponent {
  recruiter = {
    email: '',
    password: ''
  };

  constructor(private router: Router, private http: HttpClient) {}

  login() {
    if (!this.recruiter.email || !this.recruiter.password) {
      alert('Please enter Email and Password');
      return;
    }

    this.http.post<{ message: string; recruiter: Recruiter; recruiterId: string }>(
      'http://localhost:5000/api/recruiter-login',
      this.recruiter
    ).subscribe(
      (response) => {
        console.log('Recruiter Login success:', response);
        if (response.message === '✅ Recruiter Login successful!') {
          // Save recruiter data and email to localStorage
          localStorage.setItem('recruiter', JSON.stringify(response.recruiter));
          localStorage.setItem('recruiterEmail', response.recruiter.email);
          alert('Recruiter Login successful!');
          this.router.navigate(['/recruiter-home']);
        } else {
          alert('Login failed! Unexpected response.');
        }
      },
      (error) => {
        console.error('Recruiter Login error:', error);
        alert('Login failed! Please check your credentials or server status.');
      }
    );
  }

  goToRegister() {
    this.router.navigate(['/recruiter-register']);
  }
  goBack(){
    this.router.navigate(['/home']);
  }
}