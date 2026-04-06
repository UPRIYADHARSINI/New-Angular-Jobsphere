import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserAppliedJobsComponent } from './user-applied-jobs.component';

describe('UserAppliedJobsComponent', () => {
  let component: UserAppliedJobsComponent;
  let fixture: ComponentFixture<UserAppliedJobsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserAppliedJobsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserAppliedJobsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
