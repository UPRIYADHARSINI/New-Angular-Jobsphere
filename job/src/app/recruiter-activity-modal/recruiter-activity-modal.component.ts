import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-recruiter-activity-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './recruiter-activity-modal.component.html',
  styleUrls: ['./recruiter-activity-modal.component.css']
})
export class RecruiterActivityModalComponent {
  @Input() recruiterData: any;
  @Output() close = new EventEmitter<void>();
}