import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { allAPI } from 'src/common/api'

@Injectable({
    providedIn: 'root',
})
export class DatatypeService {
    constructor(private httpClient: HttpClient) {}

    getDataType() {
        return this.httpClient.post(allAPI.admin_manage_settings_get_data_type, {})
    }

    createDataType(data) {
        return this.httpClient.post(allAPI.admin_manage_settings_create_data_type, { data })
    }

    editDataType(data) {
        return this.httpClient.post(allAPI.admin_manage_settings_edit_data_type, { data })
    }

    deleteDataType(data) {
        return this.httpClient.post(allAPI.admin_manage_settings_delete_data_type, { data })
    }
}
