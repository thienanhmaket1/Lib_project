import { Component, OnInit } from '@angular/core'
import { RegisterService } from './register.service'
import { Router } from '@angular/router'
import { NbToastrService, NbGlobalPhysicalPosition } from '@nebular/theme'
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms'
import { error } from '@angular/compiler/src/util'

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
    registerFormGroup = new FormGroup({
        usernameFormControl: new FormControl('', {
            validators: Validators.required,
        }),
        passwordFormControl: new FormControl('', {
            validators: Validators.required,
        }),
        fullnameFormControl: new FormControl('', {
            validators: Validators.required,
        }),
        emailFormControl: new FormControl('', {
            validators: Validators.required,
        }),
        phoneFormControl: new FormControl('', {
            validators: Validators.required,
        }),
        permissionFormControl: new FormControl('', {
            validators: Validators.required,
        }),
    })
    constructor(private router: Router, private toastService: NbToastrService, private registerService: RegisterService) {}

    ngOnInit(): void {}

    register() {
        if (!this.registerFormGroup.valid) {
            this.toastService.show('Username and password is required !', 'Error', {
                status: 'danger',
                position: NbGlobalPhysicalPosition.BOTTOM_RIGHT,
            })

            return
        }

        const {
            usernameFormControl,
            passwordFormControl,
            fullnameFormControl,
            emailFormControl,
            phoneFormControl,
            permissionFormControl,
        } = this.registerFormGroup.getRawValue()
        const obj = {
            user_username: usernameFormControl,
            user_fullname: fullnameFormControl,
            user_email: emailFormControl,
            user_phone: phoneFormControl,
            user_permission_code: permissionFormControl,
            user_password: passwordFormControl,
        }
        this.registerService.register(obj).subscribe(
            (res) => {
                if (res.code === 0) {
                    this.toastService.show(`Create successfully`, 'Success', {
                        status: 'primary',
                        position: NbGlobalPhysicalPosition.BOTTOM_RIGHT,
                    })
                }
                if (res.code === 5) {
                    this.toastService.show(`User already exists`, 'Error', {
                        status: 'danger',
                        position: NbGlobalPhysicalPosition.BOTTOM_RIGHT,
                    })
                }
                this.router.navigate(['login'])
            },
            (err) => {}
        )
    }
}
