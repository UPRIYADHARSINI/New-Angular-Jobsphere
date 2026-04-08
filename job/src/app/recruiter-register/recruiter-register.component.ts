import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-recruiter-registration',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './recruiter-register.component.html',
  styleUrls: ['./recruiter-register.component.css']
})
export class RecruiterRegistrationComponent {
  constructor(private http: HttpClient) {}

  recruiter = {
    name: '',
    companyType: '',
    companyName: '',
    mainBranch: '',
    experience: '',
    email: '',
    contactNumber: '',
    website: '',
    password: ''  // ✅ Add this field
  };
  
  registerRecruiter() {
    if (!this.recruiter.name || !this.recruiter.companyType || !this.recruiter.companyName || !this.recruiter.mainBranch || !this.recruiter.experience || !this.recruiter.email || !this.recruiter.contactNumber) {
      alert('Please fill all mandatory fields!');
      return;
    }

    this.http.post('https://new-angular-jobsphere.onrender.com/api/recruiter-register', this.recruiter)
      .subscribe({
        next: (response) => {
          console.log(response);
          alert('Recruiter Registered Successfully!');
        },
        error: (error) => {
          console.error(error);
          alert('Error during recruiter registration.');
        }
      });
  }
}
