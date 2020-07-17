import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { environment } from 'src/environments/environment'
import { Observable } from 'rxjs'
import { allAPI } from 'src/common/api'

@Injectable({
    providedIn: 'root',
})
export class ManageUserService {
    private api = environment.server
    constructor(private http: HttpClient) {}

    getUserList(showDeletedUser) {
        return this.http.post<any>(allAPI.admin_manage_users_list, { showDeletedUser })
    }

    getUserById(user_id) {
        return this.http.post<any>(allAPI.get_users_by_id, { user_id })
    }

    getSpecificGroupUser(group) {
        return this.http.post<any>(allAPI.admin_manage_users_get_specific_group_user, { group })
    }

    createUser(input) {
        return this.http.post<any>(allAPI.admin_manage_users_create_user, { input })
    }

    deleteUser(input) {
        return this.http.post<any>(allAPI.admin_manage_users_delete_user, input)
    }

    editUser(input) {
        return this.http.post<any>(allAPI.admin_manage_users_edit_user, { input })
    }

    getImage(img) {
        return `${this.api}/images/avatars/${img}`
    }

    userChangePicture(formData) {
        return this.http.post<any>(allAPI.user_change_picture, formData)
    }

    editProfile(input) {
        return this.http.post<any>(allAPI.user_edit_profile, input)
    }
}
