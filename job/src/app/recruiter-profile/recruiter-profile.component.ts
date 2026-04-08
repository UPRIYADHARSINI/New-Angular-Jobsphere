import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface Recruiter {
  name: string;
  companyType: string;
  companyName: string;
  mainBranch: string;
  experience: number;
  email: string;
  contactNumber: string;
  website: string;
  profileImageUrl: string;
}

@Component({
  selector: 'app-recruiter-profile',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './recruiter-profile.component.html',
  styleUrls: ['./recruiter-profile.component.css']
})
export class RecruiterProfileComponent implements OnInit {
  recruiter: Recruiter = {
    name: '',
    companyType: '',
    companyName: '',
    mainBranch: '',
    experience: 0,
    email: '',
    contactNumber: '',
    website: '',
    profileImageUrl: ''
  };
  selectedFile: File | null = null; // To store the selected file

  private http = inject(HttpClient);
  private router = inject(Router);

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      const storedRecruiter = localStorage.getItem('recruiter');
      if (storedRecruiter) {
        this.recruiter = JSON.parse(storedRecruiter) as Recruiter;
      } else {
        this.router.navigate(['/login']);
      }
    }
  }

  // Handle file selection
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  // Upload profile picture
  uploadProfilePicture(): void {
    if (!this.selectedFile) {
      alert('Please select a file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('profilePhoto', this.selectedFile);

    this.http.post<{ message: string; recruiter: Recruiter }>(
      `https://new-angular-jobsphere.onrender.com/api/upload-recruiter-profile-photo/${this.recruiter.email}`,
      formData
    ).subscribe({
      next: (response) => {
        this.recruiter = response.recruiter;
        localStorage.setItem('recruiter', JSON.stringify(this.recruiter));
        alert('✅ Profile picture uploaded successfully!');
      },
      error: (err) => {
        console.error('Error uploading profile picture:', err);
        alert('❌ Error uploading profile picture.');
      }
    });
  }

  saveProfile(): void {
    this.http.put<{ message: string; recruiter: Recruiter }>(
      `https://new-angular-jobsphere.onrender.com/api/update-recruiter/${this.recruiter.email}`,
      this.recruiter
    ).subscribe({
      next: (response) => {
        localStorage.setItem('recruiter', JSON.stringify(response.recruiter));
        alert('✅ Profile updated successfully!');
        this.router.navigate(['/recruiter-home']);
      },
      error: (err) => {
        console.error('Error updating profile:', err);
        alert('❌ Error updating profile.');
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/recruiter-home']);
  }
}