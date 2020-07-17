import { TestBed } from '@angular/core/testing'

import { DatatypeService } from './datatype.service'

describe('DatatypeService', () => {
    let service: DatatypeService

    beforeEach(() => {
        TestBed.configureTestingModule({})
        service = TestBed.inject(DatatypeService)
    })

    it('should be created', () => {
        expect(service).toBeTruthy()
    })
})
