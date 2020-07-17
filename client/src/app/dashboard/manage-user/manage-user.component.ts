import { Component, OnInit, Output, EventEmitter } from '@angular/core'
import { FormGroup, FormControl } from '@angular/forms'
import { NbTreeGridDataSource, NbSortDirection, NbTreeGridDataSourceBuilder, NbSortRequest, NbDialogService } from '@nebular/theme'
import { UserDetailComponent } from 'src/app/components/user-detail/user-detail.component'
import { ManageUserService } from '../../services/manage-user.service'
import { DropdownService } from '@app/services/dropdown.service'

@Component({
    selector: 'app-manage-user',
    templateUrl: './manage-user.component.html',
    styleUrls: ['./manage-user.component.scss'],
    providers: [ManageUserService],
})
export class ManageUserComponent implements OnInit {
    filterFormGroup = new FormGroup({
        searchFormControl: new FormControl(''),
    })

    users = []
    checked = false
    @Output() checkedChange = new EventEmitter<boolean>()
    labelPosition = 'end'
    viewType = `admin_manage_users.toggle_activating_status`

    allColumns = [
        'column_no',
        'column_username',
        'column_fullname',
        'column_department_id',
        // 'column_email',
        // 'column_phone',
        'column_permission',
        // 'column_is_deleted',
        // 'column_group',
        // 'column_theme',
    ]
    allColumnsRealNames = [
        'admin_manage_users.user_detail.user_no',
        'admin_manage_users.user_detail.user_name',
        'admin_manage_users.user_detail.user_fullname',
        'admin_manage_users.user_detail.user_department_id',
        // 'admin_manage_users.user_detail.user_email',
        // 'admin_manage_users.user_detail.user_phone',
        'admin_manage_users.user_detail.user_permission',
        // 'admin_manage_users.user_detail.user_is_deleted',
        // 'admin_manage_users.user_detail.user_group',
        // 'admin_manage_users.user_detail.user_theme',
    ]

    dataSource: NbTreeGridDataSource<any>

    sortColumn: string
    sortDirection: NbSortDirection = NbSortDirection.NONE

    data = []
    department

    constructor(
        private dataSourceBuilder: NbTreeGridDataSourceBuilder<any>,
        private nbDialogService: NbDialogService,
        private manageUserService: ManageUserService,
        private dropdownService: DropdownService
    ) {
        // this.authenticationService.getUser.subscribe((res) => {
        //     if (res) {
        //         this.getUserList(false)
        //     }
        // })
    }

    ngOnInit(): void {
        // this.getUserList()
        this.getDepartmentEN()
    }

    getUserList() {
        this.manageUserService.getUserList(this.checked).subscribe((res) => {
            this.convertToUsableUsers(res.data)
            // this.applyNewData()
            console.log(this.users)
            this.searchUser()
        })
    }

    getDepartmentEN() {
        this.dropdownService.getDepartmentEN().subscribe((res) => {
            this.department = res.data
            this.getUserList()
        })
    }

    updateValue(event) {
        const input = event.target as HTMLInputElement
        this.checked = input.checked
        this.checkedChange.emit(this.checked)
        switch (this.checked) {
            case false:
                this.viewType = `app.toggle.activation.activating`
                this.getUserList()
                break
            case true:
                this.viewType = `app.toggle.activation.all`
                this.getUserList()
                break
            default:
                break
        }
    }

    convertToUsableUsers(listUser) {
        let no = 0
        this.users = listUser.map((e) => {
            no += 1

            let permission_name
            // console.log
            switch (e.user_permission_code) {
                case '19':
                    permission_name = 'QC Admin'
                    break

                case '09':
                    permission_name = 'Office'
                    break

                // case '01':
                //     permission_name = 'Office User'
                //     break

                case '11':
                    permission_name = 'QC User'
                    break

                default:
                    permission_name = 'Admin'
                    break
            }
            const departmentId = e.user_department_id ? this.department.drop_down_data.find((info) => info.id === e.user_department_id.toString()) : {}
            // console.log(departmentId)
            return {
                data: {
                    column_no: no,
                    column_username: e.user_username,
                    column_password: e.user_password, // ????
                    column_fullname: e.user_fullname,
                    column_department_id: departmentId,
                    column_email: e.user_email,
                    column_phone: e.user_phone,
                    column_permission: permission_name,
                    column_permission_code: e.user_permission_code,
                    column_is_deleted: e.user_is_deleted,
                    column_group: e.user_group,
                    column_theme: e.user_theme,
                },
            }
        })
    }

    searchUser() {
        const { searchFormControl } = this.filterFormGroup.getRawValue()
        if (searchFormControl) {
            const searchFormControlLow = searchFormControl.toString().toLocaleLowerCase()
            this.data = this.users.filter((e) => {
                const usernameSearch =
                    e.data.column_username &&
                    e.data.column_username
                        .toString()
                        .toLocaleLowerCase()
                        .includes(searchFormControlLow)
                const fullNameSearch =
                    e.data.column_fullname &&
                    e.data.column_fullname
                        .toString()
                        .toLocaleLowerCase()
                        .includes(searchFormControlLow)
                const emailSearch =
                    e.data.column_email &&
                    e.data.column_email
                        .toString()
                        .toLocaleLowerCase()
                        .includes(searchFormControlLow)
                const phoneSearch =
                    e.data.column_phone &&
                    e.data.column_phone
                        .toString()
                        .toLocaleLowerCase()
                        .includes(searchFormControlLow)
                // const groupSearch = e.data.column_group.includes(searchFormControl)

                return usernameSearch || fullNameSearch || emailSearch || phoneSearch
            })
        } else {
            this.data = this.users
        }

        this.dataSource = this.dataSourceBuilder.create(this.data)
    }
    // createFlagColumns(properties = []) {
    //     return this.allColumnsRealNames[this.allColumns.indexOf(properties)]
    // }

    createRealColumns(flagColumnName = '') {
        return this.allColumnsRealNames[this.allColumns.indexOf(flagColumnName)]
    }

    updateSort(sortRequest: NbSortRequest): void {
        this.sortColumn = sortRequest.column
        this.sortDirection = sortRequest.direction
    }

    getSortDirection(column: string): NbSortDirection {
        if (this.sortColumn === column) {
            return this.sortDirection
        }
        return NbSortDirection.NONE
    }

    getShowOn(index: number) {
        const minWithForMultipleColumns = 400
        const nextColumnStep = 100
        return minWithForMultipleColumns + nextColumnStep * index
    }

    openDetail(user) {
        const newUser = {
            column_username: user.column_username,
            column_fullname: user.column_fullname,
            column_password: '',
            column_confirm_password: '',
            column_email: user.column_email,
            column_phone: user.column_phone,
            column_is_deleted: user.column_is_deleted,
            column_permission: user.column_permission,
            column_permission_code: user.column_permission_code,
            column_group: user.column_group,
            column_theme: user.column_theme,
            column_department_id: user.column_department_id.id,
        }
        this.nbDialogService.open(UserDetailComponent, { context: { data: newUser, type: 'edit', department: this.department } }).onClose.subscribe((res) => {
            if (res) {
                this.getUserList()
            }
        })
    }

    addUser() {
        const user = {
            column_username: '',
            column_fullname: '',
            column_password: '',
            column_confirm_password: '',
            column_email: '',
            column_phone: '',
            column_is_deleted: 'false',
            column_permission: '',
            column_permission_code: '09',
            column_group: 'office',
            column_theme: 'default',
            column_department_id: '1',
        }

        this.nbDialogService.open(UserDetailComponent, { context: { data: user, type: 'create', department: this.department } }).onClose.subscribe((res) => {
            if (res) {
                this.users = this.users.concat([{ data: res.data }])
                this.data = this.users
                this.getUserList()
            }
        })
    }

    applyNewData(data) {
        this.dataSource = this.dataSourceBuilder.create(data)
    }
}
