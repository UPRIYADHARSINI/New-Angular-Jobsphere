import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserActivityModalComponent } from './user-activity-modal.component';

describe('UserActivityModalComponent', () => {
  let component: UserActivityModalComponent;
  let fixture: ComponentFixture<UserActivityModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserActivityModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserActivityModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
