import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core'
import { AuthenticationService } from '@app/authentication/authentication.service'
import { FormGroup, FormControl, FormBuilder } from '@angular/forms'
import { ManageUserService } from '@app/services/manage-user.service'
import { NbToastrService, NbDialogRef } from '@nebular/theme'
import { SharedService } from '@app/services/shared.service'

@Component({
    selector: 'app-profile-detail',
    templateUrl: './profile-detail.component.html',
    styleUrls: ['./profile-detail.component.scss'],
})
export class ProfileDetailComponent implements OnInit {
    @Input() data: any
    @Input() editable = true
    editUserFormGroup = new FormGroup({})
    @ViewChild('editFileFakeInput') editFileFakeInput: ElementRef
    userInfo: any
    userID: any
    rows: any
    fakeUserProperties = ['user_username', 'user_password', 'user_confirm_password', 'user_fullname', 'user_email', 'user_phone', 'user_theme']
    realUserProperties = [
        'home.profile.form_username',
        'home.profile.form_password',
        'home.profile.form_confirm_password',
        'home.profile.form_fullname',
        'home.profile.form_email',
        'home.profile.form_phone',
        'home.profile.form_theme',
    ]
    inputType
    isReadOnly = false
    srcImg: any
    message: any
    imagePath: any
    createFileFormGroup = new FormGroup({})
    typePassword = true
    typeConfirmPassword = true
    eye_off = false
    eye_off2 = false

    constructor(
        private authenticationService: AuthenticationService,
        private userService: ManageUserService,
        private formBuilder: FormBuilder,
        private nbDialogRef: NbDialogRef<ProfileDetailComponent>,
        public sharedService: SharedService
    ) {}

    ngOnInit(): void {
        // this.userInfo = this.authenticationService.getUser
        this.userInfo = { ...this.data }
        this.userID = this.userInfo.user_id

        delete this.userInfo.user_permission_code
        delete this.userInfo.user_is_deleted
        delete this.userInfo.user_group
        delete this.userInfo.user_created_at
        delete this.userInfo.user_updated_at
        delete this.userInfo.user_authen_updated_at

        this.rows = Object.keys(this.userInfo)
        this.rows[this.rows.length] = 'user_password'
        this.rows[this.rows.length] = 'user_confirm_password'
        this.srcImg = ''
        this.createFormControls()
        this.getImage()
        this.createFileFormGroup = this.formBuilder.group({
            fileUpload: [''],
        })
    }

    translate(property_name = '') {
        if (property_name === 'user_confirm_password' || property_name === 'user_password') {
            this.inputType = 'password'
            this.isReadOnly = false
        } else if (property_name === 'user_username') {
            this.inputType = 'text'
            this.isReadOnly = true
        } else if (property_name === 'user_email') {
            this.inputType = 'email'
            this.isReadOnly = false
        } else {
            this.inputType = 'text'
            this.isReadOnly = false
        }
        // switch (property_name) {
        //     case 'user_username':
        //         this.inputType = 'text'
        //         this.isReadOnly = true
        //         break
        //     case 'user_password':
        //         this.inputType = 'password'
        //         this.isReadOnly = false
        //         break
        //     case 'user_email':
        //         this.inputType = 'email'
        //         this.isReadOnly = false
        //         break
        //     default:
        //         this.isReadOnly = false
        //         this.inputType = 'text'
        //         break
        // }
        return this.realUserProperties[this.fakeUserProperties.indexOf(property_name)]
    }

    createFormControls() {
        this.rows.forEach((e) => {
            this.editUserFormGroup.addControl(e, new FormControl(this.userInfo[e]))
        })
    }

    getImage() {
        this.srcImg = this.userService.getImage(`${this.userID}.png?v=${Date.now()}`)
    }

    uploadImage() {
        this.editFileFakeInput.nativeElement.click()
    }

    // handleFileInput(event) {
    //     if (event.target.files.length > 0) {
    //         const file = event.target.files[0]
    //         this.createFileFormGroup.get('fileUpload').setValue(file)
    //     }
    // }

    preview(files) {
        if (files.length === 0) {
            return
        }

        const mimeType = files[0].type
        if (mimeType.match(/image\/*/) == null) {
            this.message = 'Only images are supported.'
            return
        }

        const reader = new FileReader()
        // this.imagePath = files;
        reader.readAsDataURL(files[0])
        reader.onload = (_event) => {
            this.srcImg = reader.result
        }
        const myNewFile = new File([files[0]], `${this.userID}.png`, { type: files[0].type })
        this.createFileFormGroup.get('fileUpload').setValue(myNewFile)
    }

    savePicture(cb = null) {
        const formData = new FormData()
        formData.append('file', this.createFileFormGroup.get('fileUpload').value)
        this.userService.userChangePicture(formData).subscribe(
            (res) => {
                if (res.code === 0) {
                    this.sharedService.showMessage({
                        title: 1,
                        type: 'update',
                        object: 'object.profile',
                    })
                    if (cb) {
                        cb()
                    }
                } else {
                    this.sharedService.showMessage({
                        title: 0,
                        type: 'update',
                        object: 'object.profile',
                    })
                }
            },
            () => {
                this.sharedService.showMessage({
                    title: 0,
                    type: 'update',
                    object: 'object.profile',
                })
            }
        )
    }

    updateUser(data) {
        this.authenticationService.setUser = data
    }

    saveUser() {
        const editUserFG = this.editUserFormGroup.getRawValue()
        const { user_password, user_confirm_password, user_email } = editUserFG
        if (user_password !== '' && user_password !== user_confirm_password) {
            this.sharedService.showMessage({
                content: {
                    value: 'response_text.common.confirm_pass_not_match',
                },
                title: 0,
            })

            return
        }

        if (user_email !== '' && !user_email.includes('@')) {
            this.sharedService.showMessage({
                content: {
                    value: 'response_text.common.wrong_email',
                },
                title: 0,
            })
            return
        }

        this.userService.editProfile(editUserFG).subscribe(
            (res) => {
                if (res.code === 0) {
                    const {
                        data: { returnedData },
                    } = res

                    if (this.createFileFormGroup.get('fileUpload').value !== '') {
                        this.savePicture(() => {
                            this.updateUser(returnedData[0])
                        })
                    } else {
                        this.sharedService.showMessage({
                            title: 1,
                            type: 'update',
                            object: 'object.profile',
                        })
                        this.updateUser(returnedData[0])
                    }
                } else {
                    this.sharedService.showMessage({
                        title: 0,
                        type: 'update',
                        object: 'object.profile',
                    })
                }
            },
            () => {
                this.sharedService.showMessage({
                    title: 0,
                    type: 'update',
                    object: 'object.profile',
                })
            },
            () => {
                this.nbDialogRef.close({ data: this.editUserFormGroup.getRawValue() })
            }
        )
    }

    setMaxLength(row) {
        if (row === 'user_fullname' || row === 'column_username') {
            return 32
        }

        if (row === 'user_phone') {
            return 21
        }
        return 'none'
    }

    toggleFieldTextType(input) {
        if (input === 1) {
            this.typePassword = !this.typePassword
            this.eye_off = !this.eye_off
        } else {
            this.typeConfirmPassword = !this.typeConfirmPassword
            this.eye_off2 = !this.eye_off2
        }
    }

    inputCondition(row) {
        if (row !== 'user_theme' && row !== 'user_password' && row !== 'user_confirm_password') {
            return true
        }
        return false
    }

    closeDialog() {
        this.nbDialogRef.close()
    }
}
