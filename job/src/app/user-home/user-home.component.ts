import { Component, OnInit, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { RouterModule, Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

interface Job {
  _id: string;
  recruiterId: string;
  companyName: string;
  jobTitle: string;
  location: string;
  salary: string;
  experience: string;
  skills: string;
  description: string;
}

interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  resumeUrl?: string;
}

@Component({
  selector: 'app-user-home',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, RouterModule],
  templateUrl: './user-home.component.html',
  styleUrls: ['./user-home.component.css']
})
export class UserHomeComponent implements OnInit {
  isDarkMode = false;
  showModal = false;
  showProfileModal = false;
  modalTitle = '';
  modalMessage = '';
  jobs: Job[] = [];
  topCompanies = ['TCS', 'Infosys', 'Wipro', 'Amazon', 'Google'];
  recommendedJobs = [
    { title: 'UI/UX Designer', company: 'Zoho', location: 'Chennai' },
    { title: 'Backend Developer', company: 'Freshworks', location: 'Bangalore' }
  ];

  private http = inject(HttpClient);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.fetchJobs();
    } else {
      console.log('Running on server, localStorage not available');
      this.router.navigate(['/user-login']);
    }
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
  }

  fetchJobs() {
    this.http.get<{ jobs: Job[] }>('https://new-angular-jobsphere.onrender.com/api/get-jobs').subscribe({
      next: (response) => {
        this.jobs = response.jobs;
        console.log('Fetched jobs:', this.jobs);
      },
      error: (err) => {
        console.error('Error fetching jobs:', err);
      }
    });
  }

  applyToJob(job: Job) {
    if (!isPlatformBrowser(this.platformId)) {
      this.router.navigate(['/user-login']);
      return;
    }

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    console.log('Current user from localStorage:', user);

    if (!user.email) {
      alert('Please log in to apply.');
      this.router.navigate(['/user-login']);
      return;
    }

    const applyData = {
      userId: user._id || '',
      jobId: job._id,
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      resumeLink: user.resumeUrl || ''
    };

    console.log('Sending application data:', applyData);

    this.http.post('https://new-angular-jobsphere.onrender.com/api/apply-job', applyData).subscribe({
      next: (response) => {
        console.log('Apply response:', response);
        alert('✅ Job applied successfully!');
      },
      error: (err) => {
        console.error('Error applying job:', err);
        alert('❌ Error applying job. Please try again.');
      }
    });
  }

  openModal(title: string, message: string, event: MouseEvent) {
    event.preventDefault();
    this.modalTitle = title;
    this.modalMessage = message;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  openProfileModal(event: MouseEvent) {
    event.preventDefault();
    this.showProfileModal = true;
  }

  closeProfileModal() {
    this.showProfileModal = false;
  }

  viewProfile() {
    this.showProfileModal = false;
    this.router.navigate(['/user-profile']);
  }

  updateProfile(event: MouseEvent) {
    event.preventDefault();
    this.router.navigate(['/user-profile']);
  }

  viewAppliedJobs(event: MouseEvent) {
    event.preventDefault();
    this.router.navigate(['/user-applied-jobs']);
  }

  logout() {
    if (isPlatformBrowser(this.platformId)) {
      this.showProfileModal = false;
      localStorage.removeItem('user');
      setTimeout(() => {
        this.router.navigate(['/home']);
      }, 200);
    }
  }

  goToPortalHome() {
    this.router.navigate(['/home']);
  }
}