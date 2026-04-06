import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecruiterActivityModalComponent } from './recruiter-activity-modal.component';

describe('RecruiterActivityModalComponent', () => {
  let component: RecruiterActivityModalComponent;
  let fixture: ComponentFixture<RecruiterActivityModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecruiterActivityModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecruiterActivityModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
