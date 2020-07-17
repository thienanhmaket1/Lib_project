import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { allAPI } from 'src/common/api'

@Injectable({
    providedIn: 'root',
})
export class ManageDrawingService {
    constructor(private httpClient: HttpClient) {}

    searchDrawingByCSV(formData) {
        return this.httpClient.post(allAPI.qc_admin_manage_drawings_search_file_by_csv, formData)
    }

    getDirectory(source) {
        return this.httpClient.post(allAPI.qc_admin_manage_drawings_get_directory, source)
    }

    uploadDrawing(formData) {
        return this.httpClient.post(allAPI.qc_admin_manage_drawings_upload_file_qc, formData)
    }

    checkAsyncDrawings(data) {
        return this.httpClient.post(allAPI.qc_admin_manage_drawings_check_async_drawings, { data })
    }

    syncDrawings(data) {
        return this.httpClient.post(allAPI.qc_admin_manage_drawings_sync_drawings, { data })
    }

    getDrawings(data) {
        return this.httpClient.post(allAPI.qc_admin_manage_drawings_get_drawings, { data })
    }

    addDrawingFolder(data) {
        return this.httpClient.post(allAPI.qc_admin_manage_drawings_add_drawing_folder, { data })
    }

    renameDrawingFolder(data) {
        return this.httpClient.post(allAPI.qc_admin_manage_drawings_rename_drawing_folder, { data })
    }

    deleteDrawingFile(data) {
        return this.httpClient.post(allAPI.qc_admin_manage_drawings_delete_drawing_file, { data })
    }

    deleteDrawing(data) {
        return this.httpClient.post(allAPI.qc_admin_manage_drawings_delete_drawing, { data })
    }

    updateDrawing(formData) {
        return this.httpClient.post(allAPI.qc_admin_manage_drawings_update_drawing, formData)
    }

    createDrawing(formData) {
        return this.httpClient.post(allAPI.qc_admin_manage_drawings_create_drawing, formData)
    }

    openDrawing(path): string {
        return allAPI.qc_admin_manage_drawings_open_drawing(path)
    }

    downloadDrawing(path): string {
        return allAPI.qc_admin_manage_drawings_download_drawing(path)
    }

    getDrawingHistory(data) {
        return this.httpClient.post(allAPI.qc_admin_manage_drawings_get_drawing_history, { data })
    }
}
