import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostJobHomeComponent } from './post-job-home.component';

describe('PostJobHomeComponent', () => {
  let component: PostJobHomeComponent;
  let fixture: ComponentFixture<PostJobHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostJobHomeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostJobHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
