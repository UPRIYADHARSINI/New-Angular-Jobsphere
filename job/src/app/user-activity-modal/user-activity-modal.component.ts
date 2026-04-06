import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-activity-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-activity-modal.component.html',
  styleUrls: ['./user-activity-modal.component.css']
})
export class UserActivityModalComponent {
  @Input() userData: any;
  @Output() close = new EventEmitter<void>();
}