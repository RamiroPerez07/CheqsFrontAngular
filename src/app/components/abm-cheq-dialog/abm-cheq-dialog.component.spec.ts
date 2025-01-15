import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbmCheqDialogComponent } from './abm-cheq-dialog.component';

describe('AbmCheqDialogComponent', () => {
  let component: AbmCheqDialogComponent;
  let fixture: ComponentFixture<AbmCheqDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AbmCheqDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AbmCheqDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
