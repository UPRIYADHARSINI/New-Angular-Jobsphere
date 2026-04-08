import { Component, OnInit, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

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
}

interface Job {
  _id: string;
  recruiterId: string;
  jobTitle: string;
  companyName: string;
  location: string;
  salary: string;
  experience: string;
  skills: string;
  description: string;
  applicants: { userId: string; name: string; email: string; phone: string; resumeLink: string; status: string }[];
}

@Component({
  selector: 'app-recruiter-home',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './recruiter-home.component.html',
  styleUrls: ['./recruiter-home.component.css']
})
export class RecruiterHomeComponent implements OnInit {
  recruiter: Recruiter | null = null;
  postedJobs: Job[] = [];

  private http = inject(HttpClient);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);

  ngOnInit(): void {
    this.loadRecruiterDetails();
  }

  loadRecruiterDetails(): void {
    if (isPlatformBrowser(this.platformId)) {
      const storedRecruiter = localStorage.getItem('recruiter');
      if (storedRecruiter) {
        this.recruiter = JSON.parse(storedRecruiter) as Recruiter;
        console.log('Loaded recruiter:', this.recruiter);
        this.fetchPostedJobs();
      } else {
        const email = localStorage.getItem('recruiterEmail');
        if (email) {
          this.http.get<{ recruiter: Recruiter }>(`https://new-angular-jobsphere.onrender.com/api/get-recruiter/${email}`).subscribe({
            next: (response) => {
              this.recruiter = response.recruiter;
              localStorage.setItem('recruiter', JSON.stringify(this.recruiter));
              console.log('Fetched recruiter:', this.recruiter);
              this.fetchPostedJobs();
            },
            error: (err) => {
              console.error('Error fetching recruiter:', err);
              this.router.navigate(['/login']);
            }
          });
        } else {
          this.router.navigate(['/login']);
        }
      }
    } else {
      console.log('Running on server, localStorage not available');
      this.router.navigate(['/login']);
    }
  }

  fetchPostedJobs(): void {
    if (this.recruiter?._id) {
      this.http.get<{ jobs: Job[] }>(`https://new-angular-jobsphere.onrender.com/api/recruiter-jobs/${this.recruiter._id}`).subscribe({
        next: (res) => {
          this.postedJobs = res.jobs || [];
          console.log('Fetched jobs:', this.postedJobs);
        },
        error: (err) => {
          console.error('Error fetching jobs:', err);
        }
      });
    } else {
      console.log('No recruiter ID found');
    }
  }

  recruitApplicant(jobId: string, applicantEmail: string): void {
    this.http.put<{ message: string; job: Job }>(`https://new-angular-jobsphere.onrender.com/api/recruit-candidate/${jobId}/${applicantEmail}`, {}).subscribe({
      next: (response) => {
        alert('✅ Candidate recruited!');
        const jobIndex = this.postedJobs.findIndex(job => job._id === jobId);
        if (jobIndex !== -1) {
          this.postedJobs[jobIndex] = response.job;
        }
      },
      error: (err) => {
        console.error('Error recruiting candidate:', err);
        alert('❌ Error recruiting candidate.');
      }
    });
  }

  deleteJob(jobId: string): void {
    if (confirm('Are you sure you want to delete this job?')) {
      this.http.delete(`https://new-angular-jobsphere.onrender.com/api/delete-job/${jobId}`).subscribe({
        next: () => {
          alert('✅ Job deleted successfully!');
          this.postedJobs = this.postedJobs.filter(job => job._id !== jobId);
        },
        error: (err) => {
          console.error('Error deleting job:', err);
          alert('❌ Error deleting job.');
        }
      });
    }
  }

  editProfile(): void {
    if (this.recruiter) {
      localStorage.setItem('recruiter', JSON.stringify(this.recruiter));
      this.router.navigate(['/recruiter-profile']);
    }
  }

  goToPostJob(): void {
    this.router.navigate(['/post-job-home']);
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}