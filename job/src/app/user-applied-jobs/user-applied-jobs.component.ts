import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-user-applied-jobs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-applied-jobs.component.html',
  styleUrls: ['./user-applied-jobs.component.css']
})
export class UserAppliedJobsComponent implements OnInit {
  jobs: any[] = [];
  userId: string = ''; // Initialize as empty string
  errorMessage: string = '';

  private apiUrl = 'https://new-angular-jobsphere.onrender.com/api';

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object // Inject PLATFORM_ID
  ) {}

  ngOnInit(): void {
    // Check if running in the browser before accessing localStorage
    if (isPlatformBrowser(this.platformId)) {
      this.userId = localStorage.getItem('userId') || '';
    }

    if (this.userId) {
      this.fetchAppliedJobs();
    } else {
      this.errorMessage = 'Please log in to view applied jobs.';
    }
  }

  fetchAppliedJobs(): void {
    this.http.get<{ jobs: any[] }>(`${this.apiUrl}/user-applied-jobs/${this.userId}`).subscribe({
      next: (response) => {
        this.jobs = response.jobs;
        console.log('Applied jobs:', this.jobs); // Debug log
      },
      error: (error) => {
        this.errorMessage = 'Failed to load applied jobs. Please try again later.';
        console.error('Error fetching applied jobs:', error);
      }
    });
  }

  refreshJobs(): void {
    this.errorMessage = '';
    this.fetchAppliedJobs();
  }
}