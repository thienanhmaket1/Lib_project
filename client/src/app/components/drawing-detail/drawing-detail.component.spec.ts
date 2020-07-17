import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { DrawingDetailComponent } from './drawing-detail.component'

describe('DrawingDetailComponent', () => {
    let component: DrawingDetailComponent
    let fixture: ComponentFixture<DrawingDetailComponent>

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [DrawingDetailComponent],
        }).compileComponents()
    }))

    beforeEach(() => {
        fixture = TestBed.createComponent(DrawingDetailComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
