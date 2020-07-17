import { Injectable } from '@angular/core'
import { CanActivate, Router, CanLoad } from '@angular/router'

import { map, tap } from 'rxjs/operators'
import { AuthenticationService } from '../authentication/authentication.service'

@Injectable({
    providedIn: 'root',
})
export class ModQCGuard implements CanActivate, CanLoad {
    constructor(private router: Router, private authService: AuthenticationService) {}

    canActivate() {
        return this.authService.isLoggedIn().pipe(
            map((user) => !!user && (user.user_permission_code === '19' || user.user_permission_code === '99')),
            tap((result) => {
                if (!result) {
                    this.authService.goHome()
                }
            })
        )
    }

    canLoad() {
        return this.authService.isLoggedIn().pipe(
            map((user) => !!user && (user.permission_cd === '19' || user.permission_cd === '99')),
            tap((result) => {
                if (!result) {
                    this.authService.goHome()
                }
            })
        )
    }
}
