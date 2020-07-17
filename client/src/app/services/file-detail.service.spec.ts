import { TestBed } from '@angular/core/testing'

import { FileDetailService } from './file-detail.service'

describe('FileDetailService', () => {
    let service: FileDetailService

    beforeEach(() => {
        TestBed.configureTestingModule({})
        service = TestBed.inject(FileDetailService)
    })

    it('should be created', () => {
        expect(service).toBeTruthy()
    })
})
