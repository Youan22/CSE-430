import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageEdit } from './message-edit';

describe('MessageEdit', () => {
  let component: MessageEdit;
  let fixture: ComponentFixture<MessageEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MessageEdit]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MessageEdit);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
