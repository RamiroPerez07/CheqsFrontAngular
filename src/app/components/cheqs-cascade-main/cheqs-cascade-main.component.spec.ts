import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheqsCascadeMainComponent } from './cheqs-cascade-main.component';

describe('CheqsCascadeMainComponent', () => {
  let component: CheqsCascadeMainComponent;
  let fixture: ComponentFixture<CheqsCascadeMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheqsCascadeMainComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CheqsCascadeMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
