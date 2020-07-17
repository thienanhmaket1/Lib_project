import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { ManageDropdownComponent } from './manage-dropdown.component'

describe('ManageDropdownComponent', () => {
    let component: ManageDropdownComponent
    let fixture: ComponentFixture<ManageDropdownComponent>

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ManageDropdownComponent],
        }).compileComponents()
    }))

    beforeEach(() => {
        fixture = TestBed.createComponent(ManageDropdownComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
