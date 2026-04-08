import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { UserActivityModalComponent } from '../user-activity-modal/user-activity-modal.component';
import { RecruiterActivityModalComponent } from '../recruiter-activity-modal/recruiter-activity-modal.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-home',
  standalone: true,
  imports: [CommonModule, UserActivityModalComponent, RecruiterActivityModalComponent],
  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.css']
})
export class AdminHomeComponent implements OnInit {
  users: any[] = [];
  recruiters: any[] = [];
  selectedUser: any = null;
  selectedRecruiter: any = null;
  showUserModal: boolean = false;
  showRecruiterModal: boolean = false;
  errorMessage: string = ''; // Add error message property

  private apiUrl = 'https://new-angular-jobsphere.onrender.com/api';

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.fetchUsersAndRecruiters();
  }

  fetchUsersAndRecruiters(): void {
    this.http.get<{ users: any[], recruiters: any[] }>(`${this.apiUrl}/admin/users-recruiters`).subscribe({
      next: (response) => {
        this.users = response.users;
        this.recruiters = response.recruiters;
        this.errorMessage = ''; // Clear error message on success
      },
      error: (error) => {
        console.error('Error fetching users and recruiters:', error);
        this.errorMessage = 'Failed to load users and recruiters. Please try again later.'; // Display error to user
      }
    });
  }

  viewUserActivity(userId: string): void {
    this.http.get(`${this.apiUrl}/admin/user-activity/${userId}`).subscribe({
      next: (response) => {
        this.selectedUser = response;
        this.showUserModal = true;
      },
      error: (error) => {
        console.error('Error fetching user activity:', error);
        this.errorMessage = 'Failed to load user activity.';
      }
    });
  }

  viewRecruiterActivity(recruiterId: string): void {
    this.http.get(`${this.apiUrl}/admin/recruiter-activity/${recruiterId}`).subscribe({
      next: (response) => {
        this.selectedRecruiter = response;
        this.showRecruiterModal = true;
      },
      error: (error) => {
        console.error('Error fetching recruiter activity:', error);
        this.errorMessage = 'Failed to load recruiter activity.';
      }
    });
  }

  closeUserModal(): void {
    this.showUserModal = false;
    this.selectedUser = null;
  }

  closeRecruiterModal(): void {
    this.showRecruiterModal = false;
    this.selectedRecruiter = null;
  }

  logout(): void {
    this.router.navigate(['/admin-login']);
  }
}