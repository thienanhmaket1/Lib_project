import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Router } from '@angular/router'
import { environment } from '../../environments/environment'
import { allAPI } from 'src/common/api'

@Injectable({
    providedIn: 'root',
})
export class FileDetailService {
    public api = environment.server
    constructor(private http: HttpClient, private router: Router) {}

    updateTempPath(input, isAuthorized = false) {
        return this.http.post<any>(
            !isAuthorized ? allAPI.office_admin_manage_file_update_temp_path : allAPI.office_user_manage_file_update_temp_path_by_authorized_user,
            input
        )
    }

    copyFile(data, isAuthorized = false) {
        return this.http.post<any>(
            !isAuthorized ? allAPI.office_admin_manage_file_copy_file : allAPI.office_user_manage_file_copy_file_by_authorized_user,
            data
        )
    }

    getFiles(group) {
        return this.http.post<any>(allAPI.office_admin_manage_files_get_files(group), {})
    }

    getFilesByUser(group) {
        return this.http.post<any>(allAPI.office_user_manage_files_get_files(group), {})
    }

    getSpecificFile(file_id) {
        return this.http.post<any>(allAPI.office_admin_manage_files_get_specific_files, { file_id })
    }

    getSpecificFileByUser(file_id) {
        return this.http.post<any>(allAPI.office_user_manage_files_get_specific_files, { file_id })
    }

    getFilesByFolderID(folder_id) {
        return this.http.post<any>(allAPI.office_admin_manage_files_get_files_by_folder_id, { folder_id })
    }

    createFile(input) {
        return this.http.post<any>(allAPI.office_admin_manage_files_create_file, input)
    }

    updateFile(input, isAuthorized = false) {
        return this.http.post<any>(
            !isAuthorized ? allAPI.office_admin_manage_files_update_file : allAPI.office_user_manage_files_update_file_by_authorized_user,
            input
        )
    }

    updateFileQC(input) {
        return this.http.post<any>(`${this.api}/files/update-file-qc`, input)
    }

    reverseCreatedFile(id) {
        return this.http.post<any>(allAPI.office_admin_manage_files_reverse_created_file(id), {})
    }

    deleteFile(input) {
        return this.http.post<any>(allAPI.office_admin_manage_files_delete_file, input)
    }

    getFileHistories(data) {
        return this.http.post<any>(allAPI.office_admin_manage_files_get_file_histories, data)
    }

    getFileHistoriesByUser(data) {
        return this.http.post<any>(allAPI.office_user_manage_files_get_file_histories, data)
    }
}
