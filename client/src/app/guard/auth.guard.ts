import { Injectable } from '@angular/core'
import { CanActivate, Router, CanLoad } from '@angular/router'

import { map, tap } from 'rxjs/operators'

import { detectIE } from '../../common/detectIE'
import { AuthenticationService } from '../authentication/authentication.service'

@Injectable({
    providedIn: 'root',
})
export class AuthGuard implements CanActivate, CanLoad {
    version = detectIE()
    constructor(private router: Router, private authService: AuthenticationService) {}

    canActivate() {
        if (this.version === false) {
            return this.authService.isLoggedIn().pipe(
                map((user) => !!user),
                tap((result) => {
                    if (!result) {
                        this.authService.goLogin()
                    }
                })
            )
        }
        // this.authService.goUnSupportedBrowser()
    }

    canLoad() {
        if (this.version === false) {
            return this.authService.isLoggedIn().pipe(
                map((user) => !!user),
                tap((result) => {
                    if (!result) {
                        this.authService.goLogin()
                    }
                })
            )
        }
        // this.authService.goUnSupportedBrowser()
    }
}
