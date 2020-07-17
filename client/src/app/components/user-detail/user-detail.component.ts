import { Component, OnInit, Input } from '@angular/core'
import { FormGroup, FormControl, Validators } from '@angular/forms'
import { AuthenticationService } from 'src/app/authentication/authentication.service'
import { NbDialogRef, NbDialogService } from '@nebular/theme'
import { ManageUserService } from 'src/app/services/manage-user.service'
import { convertStringBooleanToBoolean } from 'src/common/functions'
import { SharedService } from '@app/services/shared.service'
import { ConfirmationComponent } from '../confirmation/confirmation.component'
import { DropdownService } from '@app/services/dropdown.service'

@Component({
    selector: 'app-user-detail',
    templateUrl: './user-detail.component.html',
    styleUrls: ['./user-detail.component.scss'],
})
export class UserDetailComponent implements OnInit {
    @Input() data: any
    @Input() type: any
    @Input() department: any

    editUserFormGroup = new FormGroup({})

    fakeUserProperties = [
        'column_username',
        'column_password',
        'column_confirm_password',
        'column_fullname',
        'column_department_id',
        'column_email',
        'column_phone',
        'column_is_deleted',
        'column_permission_code',
        'column_group',
        'column_theme',
    ]
    realUserProperties = [
        'admin_manage_users.user_detail.user_name',
        'admin_manage_users.user_detail.user_password',
        'admin_manage_users.user_detail.user_confirm_password',
        'admin_manage_users.user_detail.user_fullname',
        'admin_manage_users.user_detail.user_department_id',
        'admin_manage_users.user_detail.user_email',
        'admin_manage_users.user_detail.user_phone',
        'admin_manage_users.user_detail.user_is_deleted',
        'admin_manage_users.user_detail.user_permission',
        'admin_manage_users.user_detail.user_group',
        'admin_manage_users.user_detail.user_theme',
    ]

    user
    isEditing
    isViewing
    isEditable
    isCreating
    rows
    inputType = 'text'
    isReadOnly = false
    typePassword = true
    typeConfirmPassword = true
    eye_off = false
    eye_off2 = false
    hiddenColumn = ['column_password', 'column_confirm_password']

    constructor(
        private authenticationService: AuthenticationService,
        private nbDialogRef: NbDialogRef<UserDetailComponent>,
        private manageUserService: ManageUserService,
        private dialogService: NbDialogService,
        public sharedService: SharedService,
        private dropdownService: DropdownService
    ) {}

    ngOnInit(): void {
        const { user_permission_code } = this.authenticationService.getUserValue
        this.user = { ...this.data }
        delete this.user.user_id
        delete this.user.column_no
        delete this.user.column_permission
        this.rows = Object.keys(this.user)

        this.createFormControls()

        this.isViewing = this.type === 'view' || this.type === 'edit'
        this.isEditable = this.type === 'edit' && (user_permission_code === '99' || user_permission_code === '09')
        this.isCreating = this.type === 'create'
    }

    saveUser() {
        const {
            column_email,
            column_fullname,
            column_group,
            column_is_deleted,
            column_password,
            column_confirm_password,
            column_permission_code,
            column_phone,
            column_theme,
            column_username,
            column_department_id,
        } = this.editUserFormGroup.getRawValue()
        this.editUserFormGroup.get(`column_is_deleted`).patchValue(convertStringBooleanToBoolean(column_is_deleted))
        const newUser = {
            column_username: column_username.trim(),
            column_password,
            column_fullname: column_fullname.trim(),
            column_email: column_email.trim(),
            column_phone: column_phone.trim(),
            column_is_deleted,
            column_permission_code,
            column_group,
            column_theme,
            column_department_id,
        }
        if (this.editUserFormGroup.get('column_username').invalid) {
            this.sharedService.showMessage({
                content: {
                    value: 'response_text.login.username_password_empty',
                },
                title: 0,
            })

            return
        }

        if (column_password !== '' && column_password !== column_confirm_password) {
            this.sharedService.showMessage({
                content: {
                    value: 'response_text.login.username_password_empty',
                },
                title: 0,
            })

            return
        }

        const latinChar = /^([A-Za-z0-9]*)$/
        if (!latinChar.test(newUser.column_username)) {
            this.sharedService.showMessage({
                content: {
                    value: 'response_text.common.confirm_pass_not_match',
                },
                title: 0,
            })
            return
        }

        if (!newUser.column_email.includes('@')) {
            this.sharedService.showMessage({
                content: {
                    value: 'response_text.common.wrong_email',
                },
                title: 0,
            })
            return
        }

        this.manageUserService.editUser(newUser).subscribe((res) => {
            if (res.code === 0) {
                this.sharedService.showMessage({
                    title: 1,
                    type: 'update',
                    object: 'object.user',
                })
            } else {
                this.sharedService.showMessage({
                    title: 0,
                    type: 'update',
                    object: 'object.user',
                })
            }
            this.nbDialogRef.close({ data: res.data })
        })
    }

    editUser() {
        this.isViewing = false
        this.isEditing = true
        this.isCreating = false
    }

    createUser() {
        const {
            column_username,
            column_password,
            column_confirm_password,
            column_fullname,
            column_email,
            column_phone,
            column_is_deleted,
            column_permission_code,
            column_group,
            column_theme,
            column_department_id,
        } = this.editUserFormGroup.getRawValue()
        const newUser = {
            column_username: column_username.trim(),
            column_password: column_password.trim(),
            column_fullname: column_fullname.trim(),
            column_email: column_email.trim(),
            column_phone: column_phone.trim(),
            column_is_deleted,
            column_permission_code,
            column_group,
            column_theme,
            column_department_id,
        }

        if (this.editUserFormGroup.invalid || newUser.column_username.trim() === '' || newUser.column_password.trim() === '') {
            this.sharedService.showMessage({
                content: {
                    value: 'response_text.login.username_password_empty',
                },
                title: 0,
            })

            return
        }

        if (column_password !== '' && column_password !== column_confirm_password) {
            this.sharedService.showMessage({
                content: {
                    value: 'response_text.common.confirm_pass_not_match',
                },
                title: 0,
            })

            return
        }

        const latinChar = /^([A-Za-z0-9]*)$/
        if (!latinChar.test(newUser.column_username)) {
            this.sharedService.showMessage({
                content: {
                    value: 'response_text.common.user_latin_chars',
                },
                title: 0,
            })
            return
        }

        if (column_email !== '' && !newUser.column_email.includes('@')) {
            this.sharedService.showMessage({
                content: {
                    value: 'response_text.common.wrong_email',
                },
                title: 0,
            })
            return
        }

        this.manageUserService.createUser(newUser).subscribe((res) => {
            if (res.code === 0) {
                this.sharedService.showMessage({
                    title: 1,
                    type: 'create',
                    object: 'object.user',
                })
                this.nbDialogRef.close({ data: res.data })
            }
            if (res.code === 5) {
                this.sharedService.showMessage({
                    content: {
                        value: 'response_text.manage_users.create.user_exist',
                    },
                    title: 0,
                })
            }
            if (res.code === 6) {
                this.sharedService.showMessage({
                    content: {
                        value: 'response_text.manage_users.create.email_exist',
                    },
                    title: 0,
                })
            }
        })
    }

    translate(property_name = '') {
        if (property_name === 'column_confirm_password' || property_name === 'column_password') {
            this.inputType = 'password'
            this.isReadOnly = false
        } else if (property_name === 'column_username') {
            if (this.isCreating) {
                this.isReadOnly = false
            } else {
                this.isReadOnly = true
            }
        } else if (property_name === 'column_email') {
            this.inputType = 'email'
            this.isReadOnly = false
        } else {
            this.inputType = 'text'
            this.isReadOnly = false
        }

        return this.realUserProperties[this.fakeUserProperties.indexOf(property_name)]
    }

    createFormControls() {
        this.rows.forEach((e) => {
            if (e === `column_username` || (e === `column_password` && this.type === 'create')) {
                this.editUserFormGroup.addControl(
                    e,
                    new FormControl(this.user[e], {
                        validators: Validators.required,
                    })
                )

                return
            }
            this.editUserFormGroup.addControl(e, new FormControl(this.user[e]))
        })
        /** ??? */
        let index = 0
    }

    deleteUser() {
        const contentType = this.data.column_is_deleted ? 2 : -1

        this.dialogService.open(ConfirmationComponent, {
            context: {
                data: {
                    contentType,
                    onYes: (() => {
                        const input = {
                            user_username: this.data.column_username,
                            status: this.data.column_is_deleted,
                        }
                        this.manageUserService.deleteUser(input).subscribe((res2) => {
                            if (res2.code === 0) {
                                this.sharedService.showMessage({
                                    title: 1,
                                    type: contentType === 2 ? 'undelete' : 'delete',
                                    object: 'object.user',
                                })
                            } else {
                                this.sharedService.showMessage({
                                    title: 0,
                                    type: contentType === 2 ? 'undelete' : 'delete',
                                    object: 'object.user',
                                })
                            }
                            this.nbDialogRef.close({ data: res2.data })
                        })
                    }).bind(this),
                },
            },
        })
    }

    checkNumber(event, row) {
        const pattern = /[0-9]/
        const inputChar = event.key
        if (row === 'column_phone') {
            if (!pattern.test(inputChar)) {
                // invalid character, prevent input
                event.preventDefault()
            }
        }
    }

    setMaxLength(row) {
        if (row === 'column_fullname' || row === 'column_username') {
            return 32
        }

        if (row === 'column_phone') {
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
        if (
            row !== 'column_group' &&
            row !== 'column_is_deleted' &&
            row !== 'column_permission_code' &&
            row !== 'column_theme' &&
            row !== 'column_password' &&
            row !== 'column_confirm_password' &&
            row !== 'column_department_id'
        ) {
            return true
        }
        return false
    }

    closeDialog() {
        this.nbDialogRef.close()
    }
}
