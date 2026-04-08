// user-profile.component.ts
import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { PLATFORM_ID } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit, OnDestroy {
  profile: any = {
    _id: '',
    name: '',
    email: '',
    phone: '',
    password: '',
    qualification: '',
    status: '',
    resumeUrl: '',
    profileImageUrl: ''
  };

  isEditMode = false;
  private routeSub!: Subscription;

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    @Inject(PLATFORM_ID) private platformId: any
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      // Listen for route changes to refresh data
      this.routeSub = this.route.params.subscribe(() => {
        this.loadUserProfile();
      });
    }
  }

  ngOnDestroy(): void {
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
  }

  private loadUserProfile(): void {
    const userId = localStorage.getItem('userId');
    console.log('📦 Loaded userId from.Concurrent localStorage:', userId);

    if (!userId) {
      console.warn('❌ No userId found in localStorage. Redirecting to login.');
      alert('Please log in to view your profile.');
      this.router.navigate(['/login']);
      return;
    }

    console.log('📡 Fetching profile for userId:', userId);
    this.http.get<any>(`https://new-angular-jobsphere.onrender.com/api/user/${userId}`).subscribe({
    
      next: (data) => {
        console.log('✅ Profile data received:', data);
        this.profile = {
          _id: data._id,
          name: data.name,
          email: data.email,
          phone: data.phone,
          password: data.password, // Avoid sending passwords if possible
          qualification: data.qualification,
          status: data.status,
          resumeUrl: data.resumeUrl,
          profileImageUrl: data.profileImageUrl || ''
        };
      },
      error: (err) => {
        console.error('❌ Error fetching profile:', err);
        alert('Failed to load profile. Please try again.');
        this.router.navigate(['/login']);
      }
    });
  }

  toggleEdit(): void {
    this.isEditMode = !this.isEditMode;
  }

  updateProfile(): void {
    const id = this.profile._id;
    if (!id) {
      console.error('❌ Profile ID missing.');
      alert('Cannot update profile: Profile ID missing.');
      return;
    }

    console.log('📤 Updating profile:', this.profile);
    this.http.put(`https://new-angular-jobsphere.onrender.com/api/user/${id}`, this.profile).subscribe({
      next: (res) => {
        console.log('✅ Profile updated:', res);
        alert('Profile updated successfully!');
        this.isEditMode = false;
      },
      error: (err) => {
        console.error('❌ Update failed:', err);
        alert('Failed to update profile.');
      }
    });
  }

  uploadResume(event: any): void {
    const file = event.target.files[0];
    if (!file) {
      console.warn('❌ No file selected for resume upload.');
      return;
    }

    const formData = new FormData();
    formData.append('resume', file);

    const id = this.profile._id;
    if (!id) {
      console.error('❌ Profile ID missing.');
      alert('Cannot upload resume: Profile ID missing.');
      return;
    }

    console.log('📤 Uploading resume for userId:', id);
    this.http.post(`https://new-angular-jobsphere.onrender.com/api/upload-resume/${id}`, formData).subscribe({
      next: (res: any) => {
        console.log('✅ Resume uploaded:', res);
        this.profile.resumeUrl = res.user.resumeUrl;
        alert('Resume uploaded successfully!');
      },
      error: (err) => {
        console.error('❌ Resume upload failed:', err);
        alert('Failed to upload resume.');
      }
    });
  }

  uploadProfilePhoto(event: any): void {
    const file = event.target.files[0];
    if (!file) {
      console.warn('❌ No file selected for profile photo upload.');
      return;
    }

    const formData = new FormData();
    formData.append('profilePhoto', file);

    const id = this.profile._id;
    if (!id) {
      console.error('❌ Profile ID missing.');
      alert('Cannot upload profile photo: Profile ID missing.');
      return;
    }

    console.log('📤 Uploading profile photo for userId:', id);
    this.http.post(`https://new-angular-jobsphere.onrender.com/api/upload-profile-photo/${id}`, formData).subscribe({
      next: (res: any) => {
        console.log('✅ Profile photo uploaded:', res);
        this.profile.profileImageUrl = res.user.profileImageUrl;
        alert('Profile photo uploaded successfully!');
      },
      error: (err) => {
        console.error('❌ Profile photo upload failed:', err);
        alert('Failed to upload profile photo.');
      }
    });
  }
}