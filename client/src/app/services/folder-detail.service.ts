import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Router } from '@angular/router'
import { environment } from '../../environments/environment'
import { allAPI } from 'src/common/api'

@Injectable({
    providedIn: 'root',
})
export class FolderDetailService {
    public api = environment.server
    constructor(private http: HttpClient, private router: Router) {}

    getHigherFolders(show_deactivate = true) {
        return this.http.post<any>(allAPI.office_admin_manage_folders_get_higher_folders, { show_deactivate })
    }

    getFolders(folder_root_id = null, show_deactivate = true) {
        return this.http.post<any>(allAPI.office_admin_manage_folders_get_folders, { folder_root_id, show_deactivate })
    }

    getChildFolders() {
        return this.http.post<any>(allAPI.office_admin_manage_folders_get_child_folders, {})
    }

    getFolderDetail(folder_id) {
        return this.http.post<any>(allAPI.office_admin_manage_folders_get_folder_detail, { folder_id })
    }

    createHigherFolder(input) {
        return this.http.post<any>(allAPI.office_admin_manage_higher_folders_create_folder, input)
    }

    createFolder(input) {
        return this.http.post<any>(allAPI.office_admin_manage_folders_create_folder, input)
    }

    updateFolder(input) {
        return this.http.post<any>(allAPI.office_admin_manage_folders_update_folder, input)
    }

    updateHigherFolder(input) {
        return this.http.post<any>(allAPI.office_admin_manage_higher_folders_update_folder, input)
    }

    deleteFolder(input) {
        return this.http.post<any>(allAPI.office_admin_manage_folders_delete_folder, input)
    }

    // deleteHigherFolder(input) {
    //     return this.http.post<any>(allAPI.office_admin_manage_higher_folders_delete_folder, input)
    // }

    getFoldersByUser() {
        return this.http.post<any>(allAPI.office_user_manage_folders_get_folders, {})
    }

    getFoldersByAuthorizedUser() {
        return this.http.post<any>(allAPI.office_admin_manage_folders_get_folders, {})
    }
}
