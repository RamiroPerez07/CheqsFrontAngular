import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheqTableComponent } from './cheq-table.component';

describe('CheqTableComponent', () => {
  let component: CheqTableComponent;
  let fixture: ComponentFixture<CheqTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheqTableComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CheqTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
