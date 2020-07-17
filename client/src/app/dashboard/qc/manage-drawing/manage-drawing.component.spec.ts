import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { ManageDrawingComponent } from './manage-drawing.component'

describe('ManageDrawingComponent', () => {
    let component: ManageDrawingComponent
    let fixture: ComponentFixture<ManageDrawingComponent>

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ManageDrawingComponent],
        }).compileComponents()
    }))

    beforeEach(() => {
        fixture = TestBed.createComponent(ManageDrawingComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
