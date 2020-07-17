import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { environment } from '../../environments/environment'
import { allAPI } from 'src/common/api'

@Injectable({
    providedIn: 'root',
})
export class RegisterService {
    private api = environment.server
    constructor(private http: HttpClient) {}

    register(obj) {
        // {
        //     user_username,
        //     user_password,
        //     user_firstname,
        //     user_lastname,
        //     user_email,
        //     user_phone,
        //     user_permission_code,
        // }
        return this.http.post<any>(allAPI.admin_manage_users_create_user, obj)
    }
}
