import { Injectable } from '@angular/core'
import { CanActivate, Router, CanLoad } from '@angular/router'

import { map, tap } from 'rxjs/operators'
import { AuthenticationService } from '../authentication/authentication.service'

@Injectable({
    providedIn: 'root',
})
export class AdminGuard implements CanActivate, CanLoad {
    constructor(private router: Router, private authService: AuthenticationService) {}

    canActivate() {
        return this.authService.isLoggedIn().pipe(
            map((user) => !!user && user.user_permission_code === '99'),
            tap((result) => {
                if (!result) {
                    this.authService.goHome()
                }
            })
        )
    }

    canLoad() {
        return this.authService.isLoggedIn().pipe(
            map((user) => !!user && user.user_permission_code === '99'),
            tap((result) => {
                if (!result) {
                    this.authService.goHome()
                }
            })
        )
    }
}
