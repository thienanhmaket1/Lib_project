import { SharedService } from '@app/services/shared.service'
import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { FormGroup, FormControl, Validators } from '@angular/forms'
import { NbToastrService, NbGlobalPhysicalPosition } from '@nebular/theme'
import { AuthenticationService } from '../authentication/authentication.service'

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
    loginFormGroup = new FormGroup({
        usernameFormControl: new FormControl('', {
            validators: Validators.required,
        }),
        passwordFormControl: new FormControl('', {
            validators: Validators.required,
        }),
    })
    eye_off = false
    typePassword = true
    constructor(private router: Router, public sharedService: SharedService, private authenticationService: AuthenticationService) {}

    ngOnInit(): void {}

    login() {
        if (!this.loginFormGroup.valid) {
            this.sharedService.showMessage({
                content: {
                    value: 'response_text.login.username_password_empty',
                },
                title: 0,
            })

            return
        }
        const { usernameFormControl, passwordFormControl } = this.loginFormGroup.getRawValue()

        this.authenticationService.login(usernameFormControl, passwordFormControl).subscribe(
            (res) => {
                const {
                    data: { user, token },
                } = res
                if (res.code === 1) {
                    this.sharedService.showMessage({
                        content: {
                            value: 'response_text.login.username_password_incorrect',
                        },
                        title: 0,
                    })

                    return
                }

                if (res.code === 0) {
                    this.sharedService.showMessage({
                        content: {
                            value: 'response_text.login.success',
                        },
                        title: 1,
                    })
                }

                this.authenticationService.setToken(token)

                this.authenticationService.setUser = user

                this.authenticationService.goHome()
                if (user.user_permission_code === '11') {
                    this.router.navigate(['/dashboard/qc/bar-code-reader'])
                }
            },
            (err) => {
                if (err.status === 401) {
                    this.sharedService.showMessage({
                        content: {
                            value: 'response_text.login.username_password_incorrect',
                        },
                        title: 0,
                    })
                }
            }
        )
    }

    toggleFieldTextType() {
        this.typePassword = !this.typePassword
        this.eye_off = !this.eye_off
    }
}
