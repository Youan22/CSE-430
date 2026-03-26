import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ContactDetail } from './contact-detail';

describe('ContactDetail', () => {
  let component: ContactDetail;
  let fixture: ComponentFixture<ContactDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactDetail, RouterTestingModule],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of(convertToParamMap({ id: '1' })),
          },
        },
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContactDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
