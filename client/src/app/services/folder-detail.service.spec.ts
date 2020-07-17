import { TestBed } from '@angular/core/testing'

import { FolderDetailService } from './folder-detail.service'

describe('FolderDetailService', () => {
    let service: FolderDetailService

    beforeEach(() => {
        TestBed.configureTestingModule({})
        service = TestBed.inject(FolderDetailService)
    })

    it('should be created', () => {
        expect(service).toBeTruthy()
    })
})
