import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { allAPI } from 'src/common/api'

@Injectable({
    providedIn: 'root',
})
export class DropdownService {
    constructor(private httpClient: HttpClient) {}

    getDropDown(folder_id = 0) {
        return this.httpClient.post<any>(allAPI.admin_manage_settings_get_drop_down, { folder_id })
        // return this.httpClient.post<any>(allAPI.office_user_settings_get_drop_down_by_authorized_user, { folder_id })
    }

    getDropDownByUser(folder_id = 0) {
        return this.httpClient.post<any>(allAPI.common_settings_get_drop_down, { folder_id })
    }

    getDepartment() {
        return this.httpClient.post<any>(allAPI.common_settings_get_department, {})
    }

    getDepartmentEN() {
        return this.httpClient.post<any>(allAPI.common_settings_get_department_en, {})
    }

    createDropDown(input) {
        return this.httpClient.post<any>(allAPI.admin_manage_settings_create_drop_down, input)
    }

    editDropDown(input) {
        return this.httpClient.post<any>(allAPI.admin_manage_settings_edit_drop_down, input)
    }

    deleteDropDown(input) {
        return this.httpClient.post<any>(allAPI.admin_manage_settings_delete_drop_down, input)
    }
}
