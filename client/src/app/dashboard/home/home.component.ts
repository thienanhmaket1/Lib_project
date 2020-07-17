import { dateTimeInString } from './../../../common/functions'
import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core'
import { AuthenticationService } from 'src/app/authentication/authentication.service'
import { SettingsService } from 'src/app/services/settings.service'
import { ManageUserService } from '@app/services/manage-user.service'
import { NbDialogService, NbThemeService, NbPopoverDirective } from '@nebular/theme'
import { SharedService } from '@app/services/shared.service'
import { saveAs } from 'file-saver'
import { MessageDetailComponent } from '@app/components/message-detail/message-detail.component'
import { ProfileDetailComponent } from '@app/components/profile-detail/profile-detail.component'
import { DropdownService } from '@app/services/dropdown.service'

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
    user
    // notifications = ['1', '2', '3', '4', '5', '6', '7', '8']
    notifications = [
        {
            title: `home.notification.admin`,
            group: 'admin',
            info: [],
            max_width: '100%', // Chỉnh chiều rộng của ô chưa message
        },
        {
            title: `home.notification.qc`,
            group: 'qc',
            info: [],
            max_width: '0%', // Chỉnh chiều rộng của ô chưa message
        },
        {
            title: `home.notification.office`,
            group: 'office',
            info: [],
            max_width: '0%', // Chỉnh chiều rộng của ô chưa message
        },
    ]
    messages
    srcImg
    show = false
    @ViewChild(NbPopoverDirective) popover: NbPopoverDirective
    @ViewChild('tabs', { read: TemplateRef }) templateTabs: TemplateRef<any>
    interval: any
    component
    department

    constructor(
        private authenticationService: AuthenticationService,
        private settingsService: SettingsService,
        private userService: ManageUserService,
        private nbDialogService: NbDialogService,
        public sharedService: SharedService,
        public themeService: NbThemeService,
        private dropdownService: DropdownService
    ) {
        this.authenticationService.getUser.subscribe((res) => {
            this.user = this.authenticationService.getUserValue
        })
    }

    ngOnInit(): void {
        this.getMessages()
    }

    async getMessages() {
        const obsvDepartment = await this.dropdownService.getDepartmentEN().toPromise()
        this.department = obsvDepartment.data

        this.settingsService.getMessages(this.user.user_group).subscribe((res) => {
            res.data.forEach((element) => {
                element[`img`] = this.userService.getImage(`${element.updated_by ? element.updated_by : element.created_by}.png`)
                const noti = this.notifications.find((e) => e.group === element.message_group)
                noti.info.push(element)
            })

            this.notifications.forEach((notification) => {
                if (notification.info.length !== 0) {
                    const findResult = notification.info.find((e) => e.user_id === this.user.user_id)
                    if (findResult) {
                        findResult[`editable`] = true
                    }

                    if (this.user.user_permission_code === '99') {
                        let newArr = []
                        newArr = notification.info.map((e2) => {
                            const editable = true
                            const newObj = {
                                ...e2,
                                editable,
                            }
                            return newObj
                        })
                        notification.info = newArr
                    }
                    let newArr2 = []
                    newArr2 = notification.info.map((e3) => {
                        const departmentName = e3.user_department_id
                            ? this.department.drop_down_data.find((i) => e3.user_department_id.toString() === i.id)
                            : null
                        const newObj = {
                            ...e3,
                            user_department_name: departmentName ? departmentName.name : null,
                        }
                        return newObj
                    })
                    notification.info = newArr2
                }
                console.log(notification.info)
                // switch (notification.group) {
                //     case 'admin':
                //         if (this.user.user_permission_code === '99') {
                //             if (info.length !== 0) {
                //                 const findResult = notification.info.find((e) => e.user_id === this.user.user_id)
                //                 findResult[`editable`] = true
                //                 console.log(notification.info)
                //                 // notification.info[0][`editable`] = true
                //             }
                //         }
                //         break
                //     case 'office':
                //         if (this.user.user_permission_code === '99' || this.user.user_permission_code === '09') {
                //             if (info.length !== 0) {
                //                 notification.info[0][`editable`] = true
                //             }
                //         }
                //         break
                //     case 'qc':
                //         if (this.user.user_permission_code === '99' || this.user.user_permission_code === '19') {
                //             if (info.length !== 0) {
                //                 notification.info[0][`editable`] = true
                //             }
                //         }
                //         break
                // }
            })
        })
    }

    // getDepartmentEN() {
    //     this.dropdownService.getDepartmentEN().subscribe((res) => {
    //         this.department = res.data
    //     })
    // }

    dateTimeInString(date) {
        return dateTimeInString(date, 'YYYY/MM/DD HH:mm')
    }

    downloadAttachment(input) {
        const data = {
            filename: input.message_attachment_name,
            group: input.message_group,
        }

        this.settingsService.downloadAttachment(data).subscribe(
            (res) => {
                saveAs(res, input.message_attachment_name)
                // if (input.message_attachment_name.split('.')[input.message_attachment_name.split('.').length - 1] === 'pdf') {
                if (res.type === 'application/pdf') {
                    window.open(`${this.settingsService.openAttachment(JSON.stringify(data))}`)
                }
                this.sharedService.showMessage({
                    content: {
                        value: 'response_text.common.downloading',
                    },
                    title: 1,
                })
            },
            (err) => {
                this.sharedService.showMessage({
                    content: {
                        value: 'response_text.common.file_corrupted_or_not_found',
                    },
                    title: 0,
                })
            }
        )
    }

    openProfile(user_id) {
        let editable = false
        if (user_id === this.user.user_id) {
            editable = true
        }
        this.popover.hide()
        this.userService.getUserById(user_id).subscribe(
            (res) => {
                if (res.code === 0) {
                    const data = res.data
                    this.nbDialogService
                        .open(ProfileDetailComponent, { context: { data, editable }, hasBackdrop: true, autoFocus: false })
                        .onClose.subscribe((res2) => {
                            if (res2) {
                                this.notifications.forEach((element2) => {
                                    element2.info = []
                                })
                                this.getMessages()
                            }
                        })
                }
            },
            (err) => {}
        )
    }

    /**
     * @param noti
     * @param status: 'view' or 'edit'
     */
    openMessageDetail(noti, status) {
        const data = { ...noti }
        data[`user_permission_code`] = this.user.user_permission_code
        this.nbDialogService.open(MessageDetailComponent, { context: { data, status }, hasBackdrop: true, autoFocus: false }).onClose.subscribe((res) => {
            if (res) {
                this.notifications.forEach((element2) => {
                    element2.info = []
                })
                this.getMessages()
            }
        })
    }

    createMessage() {
        const data = {
            message_title: '',
            message_content: '',
            message_attachment_name: '',
        }
        data[`user_permission_code`] = this.user.user_permission_code
        this.nbDialogService
            .open(MessageDetailComponent, { context: { data, status: 'create' }, hasBackdrop: true, autoFocus: false })
            .onClose.subscribe((res) => {
                if (res) {
                    this.notifications.forEach((element2) => {
                        element2.info = []
                    })
                    this.getMessages()
                }
            })
    }
}
