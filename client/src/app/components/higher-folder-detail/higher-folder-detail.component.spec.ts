import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HigherFolderDetailComponent } from './higher-folder-detail.component';

describe('HigherFolderDetailComponent', () => {
  let component: HigherFolderDetailComponent;
  let fixture: ComponentFixture<HigherFolderDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HigherFolderDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HigherFolderDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
