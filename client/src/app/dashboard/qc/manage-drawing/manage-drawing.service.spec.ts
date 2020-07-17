import { TestBed } from '@angular/core/testing'

import { ManageDrawingService } from './manage-drawing.service'

describe('ManageDrawingService', () => {
    let service: ManageDrawingService

    beforeEach(() => {
        TestBed.configureTestingModule({})
        service = TestBed.inject(ManageDrawingService)
    })

    it('should be created', () => {
        expect(service).toBeTruthy()
    })
})
