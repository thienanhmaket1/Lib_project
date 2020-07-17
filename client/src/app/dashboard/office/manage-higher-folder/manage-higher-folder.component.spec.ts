import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageHigherFolderComponent } from './manage-higher-folder.component';

describe('ManageHigherFolderComponent', () => {
  let component: ManageHigherFolderComponent;
  let fixture: ComponentFixture<ManageHigherFolderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageHigherFolderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageHigherFolderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
