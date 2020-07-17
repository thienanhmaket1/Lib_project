import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { QcSettingsComponent } from './qc-settings.component'

describe('QcSettingsComponent', () => {
    let component: QcSettingsComponent
    let fixture: ComponentFixture<QcSettingsComponent>

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [QcSettingsComponent],
        }).compileComponents()
    }))

    beforeEach(() => {
        fixture = TestBed.createComponent(QcSettingsComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
