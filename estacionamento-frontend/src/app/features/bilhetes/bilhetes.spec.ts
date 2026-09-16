import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Bilhetes } from './bilhetes';

describe('Bilhetes', () => {
  let component: Bilhetes;
  let fixture: ComponentFixture<Bilhetes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Bilhetes],
    }).compileComponents();

    fixture = TestBed.createComponent(Bilhetes);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
