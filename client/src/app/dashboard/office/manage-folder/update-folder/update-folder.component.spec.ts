import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateFolderComponent } from './update-folder.component';

describe('UpdateFolderComponent', () => {
  let component: UpdateFolderComponent;
  let fixture: ComponentFixture<UpdateFolderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateFolderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateFolderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
