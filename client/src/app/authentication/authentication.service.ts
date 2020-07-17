import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Router } from '@angular/router'
import { environment } from '../../environments/environment'
import { of, BehaviorSubject } from 'rxjs'
import { map } from 'rxjs/operators'
import { allAPI } from 'src/common/api'

@Injectable({
    providedIn: 'root',
})
export class AuthenticationService {
    private token: string = null
    private user: BehaviorSubject<object> = new BehaviorSubject<object>(null)
    public api = environment.server
    private headers: any = new HttpHeaders()

    constructor(private http: HttpClient, private router: Router) {
        this.user.subscribe((res: any) => {
            if (res) {
                const { user_theme } = res
                if (user_theme) {
                    localStorage.setItem('user_theme', user_theme)
                }
            }
        })
    }

    public set setUser(v) {
        this.user.next(v)
    }

    public get getUser(): any {
        return this.user
    }

    public get getUserValue(): any {
        return this.user.value
    }

    /*
     *
     * @param user_username
     * @param user_password
     */
    login(user_username: string, user_password: string) {
        return this.http.post<any>(allAPI.authen_login, { user_username, user_password })
    }

    /*
     *
     * @param token
     */
    setToken(token) {
        this.token = token
        localStorage.setItem('token', token)
    }

    getToken() {
        return this.token || (this.token = localStorage.getItem('token'))
    }

    removeToken() {
        this.token = null
        localStorage.removeItem('token')
    }

    /*
     *
     * @param willNavigate
     */
    logout(willNavigate = false) {
        this.setUser = null
        // this.setFullUserInfo = null
        // clear token remove user from local storage to log user out
        this.removeToken()
        if (willNavigate) {
            this.goLogin()
        }

        return false
    }

    isLoggedIn() {
        if (!!this.getUserValue) {
            // return of(this.user)
            return this.user
        }
        // dung ham nay de han che truy xuat localstorage de tang performance
        const token = this.getToken()
        // neu chua cho token thi chac chan chua dang nhap
        if (!token) {
            this.logout()
            return of(null)
        }

        this.headers = new HttpHeaders().set('Authorization', `${token}`)
        return this.http.post<any>(allAPI.authen_verify_token, {}, { headers: this.headers }).pipe(
            // tap(
            //     // Log the result or error
            //     (res) => {
            //         if (res.code !== 0) {
            //             return this.logout()
            //         }
            //         this.setToken(token)
            //         this.setUser = res.data.user
            //         this.setFullUserInfo = res.data.fullInfo
            //     },
            //     (error) => this.logout()
            // ),
            map(
                (res: any) => {
                    if (res.code !== 0) {
                        return this.logout()
                    }

                    this.setToken(token)

                    this.setUser = res.data.user
                    // this.setFullUserInfo = res.data.fullInfo

                    return this.getUserValue
                },
                () => this.logout()
            )
        )
    }

    goLogin() {
        this.router.navigate(['/login'])
    }

    goHome() {
        this.router.navigate(['/dashboard/home'])
    }
}
