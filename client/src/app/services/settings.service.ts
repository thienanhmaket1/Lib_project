import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Router } from '@angular/router'
import { environment } from '../../environments/environment'
import { allAPI } from 'src/common/api'
import { BehaviorSubject } from 'rxjs'

@Injectable({
    providedIn: 'root',
})
export class SettingsService {
    public api = environment.server
    private headers: any = new HttpHeaders()
    public logoImg: BehaviorSubject<string> = new BehaviorSubject<string>(``)
    public logoTitle: BehaviorSubject<string> = new BehaviorSubject<string>(``)

    constructor(private http: HttpClient, private router: Router) {
        this.headers = new HttpHeaders().set('Authorization', `${localStorage.getItem('token')}`)
        // this.logoTitle.next(`D-CUBE`)
        // this.logoImg.next(`../../../../assets/images/Nissin_Electric_company_logo.svg-1.png`)
    }

    savePath(obj) {
        return this.http.post<any>(allAPI.admin_manage_settings_save_path, obj)
    }

    // saveQCAdminPath(obj) {
    //     return this.http.post<any>(allAPI.qc_admin_manage_settings_save_path, obj)
    // }

    getOfficeAdminSettings() {
        return this.http.post<any>(allAPI.common_settings_get_settings, {})
    }

    getQCAdminSettings() {
        return this.http.post<any>(allAPI.common_settings_get_settings, {})
    }

    openFile(path): string {
        return allAPI.common_open_file(path)
    }

    getParentFoldersByOnlyFileName(data) {
        return this.http.post<any>(allAPI.qc_user_barcode_reader_get_parent_folders_by_only_file_name, { data })
    }

    saveMessage(input) {
        return this.http.post<any>(allAPI.messages_manage_messages_create_message, input)
    }

    getMessages(group) {
        return this.http.post<any>(allAPI.messages_get_messages(group), {})
    }

    updateMessage(input) {
        return this.http.post<any>(allAPI.messages_manage_messages_update_message, input, { headers: this.headers })
    }

    saveAttachment(input) {
        return this.http.post<any>(allAPI.messages_manage_messages_save_attachment, input)
    }

    downloadAttachment(data) {
        return this.http.post(allAPI.messages_download_attachment, data, {
            responseType: 'blob',
            // headers: this.headers,
        })
    }

    openAttachment(path) {
        return allAPI.messages_open_attachment(path)
    }

    saveCommonSettings(input) {
        return this.http.post<any>(allAPI.admin_manage_save_common_settings, input)
    }

    openManualFile() {
        return allAPI.messages_open_manual
        // return this.http.post(
        //     allAPI.messages_open_manual,
        //     {},
        //     {
        //         responseType: 'blob',
        //     }
        // )
    }
}
