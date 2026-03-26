import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { DocumentDetail } from './document-detail';

describe('DocumentDetail', () => {
  let component: DocumentDetail;
  let fixture: ComponentFixture<DocumentDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocumentDetail, RouterTestingModule],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ id: '1' }),
          },
        },
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocumentDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
