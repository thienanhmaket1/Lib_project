import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { ManageFolderComponent } from './manage-folder.component'

describe('ManageFolderComponent', () => {
    let component: ManageFolderComponent
    let fixture: ComponentFixture<ManageFolderComponent>

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ManageFolderComponent],
        }).compileComponents()
    }))

    beforeEach(() => {
        fixture = TestBed.createComponent(ManageFolderComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
