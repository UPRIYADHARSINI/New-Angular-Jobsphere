import { Component, OnInit, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { isPlatformBrowser } from '@angular/common';

interface Job {
  recruiterId: string;
  companyName: string;
  jobTitle: string;
  location: string;
  salary: string;
  experience: string;
  skills: string;
  description: string;
}

@Component({
  selector: 'app-post-job-home',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './post-job-home.component.html',
  styleUrls: ['./post-job-home.component.css']
})
export class PostJobHomeComponent implements OnInit {
  job: Job = {
    recruiterId: '',
    companyName: '',
    jobTitle: '',
    location: '',
    salary: '',
    experience: '',
    skills: '',
    description: ''
  };

  private http = inject(HttpClient);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);

  ngOnInit(): void {
    // Check if running in the browser before accessing localStorage
    if (isPlatformBrowser(this.platformId)) {
      const storedRecruiter = localStorage.getItem('recruiter');
      if (storedRecruiter) {
        const recruiter = JSON.parse(storedRecruiter);
        this.job.recruiterId = recruiter._id; // Set the recruiterId from logged-in user
      } else {
        // If no recruiter data, redirect to login
        this.router.navigate(['/recruiter-login']);
      }
    } else {
      // Handle server-side rendering case (e.g., redirect or skip)
      console.log('Running on server, localStorage not available');
      this.router.navigate(['/recruiter-login']);
    }
  }

  postJob(): void {
    if (!this.job.jobTitle || !this.job.companyName || !this.job.location || !this.job.salary || !this.job.experience || !this.job.skills) {
      alert('Please fill in all required fields.');
      return;
    }

    this.http.post('https://new-angular-jobsphere.onrender.com/api/post-job', this.job).subscribe({
      next: (response) => {
        console.log('Job posted:', response);
        alert('✅ Job posted successfully!');
        this.router.navigate(['/recruiter-home']);
      },
      error: (err) => {
        console.error('Error posting job:', err);
        alert('❌ Error posting job.');
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/recruiter-home']);
  }
}