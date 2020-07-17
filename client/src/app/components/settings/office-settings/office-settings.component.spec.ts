import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { OfficeSettingsComponent } from './office-settings.component'

describe('OfficeSettingsComponent', () => {
    let component: OfficeSettingsComponent
    let fixture: ComponentFixture<OfficeSettingsComponent>

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [OfficeSettingsComponent],
        }).compileComponents()
    }))

    beforeEach(() => {
        fixture = TestBed.createComponent(OfficeSettingsComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
