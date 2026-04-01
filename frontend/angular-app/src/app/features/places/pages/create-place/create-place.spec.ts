import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePlace } from './create-place';

describe('CreatePlace', () => {
  let component: CreatePlace;
  let fixture: ComponentFixture<CreatePlace>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreatePlace],
    }).compileComponents();

    fixture = TestBed.createComponent(CreatePlace);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
