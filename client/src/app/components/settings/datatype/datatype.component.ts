import { Component, OnInit } from '@angular/core'
import { NbTreeGridDataSource, NbSortDirection, NbTreeGridDataSourceBuilder, NbDialogService, NbSortRequest } from '@nebular/theme'
import { DatatypeService } from '@app/services/datatype.service'
import { FormGroup, FormControl } from '@angular/forms'

@Component({
    selector: 'app-datatype',
    templateUrl: './datatype.component.html',
    styleUrls: ['./datatype.component.scss'],
})
export class DatatypeComponent implements OnInit {
    filterFormGroup = new FormGroup({
        dataTypeFormControl: new FormControl(''),
    })

    datatypes = []
    allColumns = [
        'column_no',
        'column_data_type_name',
        'column_data_type_is_number',
        'column_data_type_is_short_text',
        'column_data_type_is_long_text',
        'column_data_type_is_drop_down',
        'column_data_type_drop_down_name',
    ]
    allColumnsRealNames = ['No.', 'Name', 'Number', 'Short Text', 'Long Text', 'Drop Down', 'Drop Down Name']

    dataSource: NbTreeGridDataSource<any>

    sortColumn: string
    sortDirection: NbSortDirection = NbSortDirection.NONE

    data = []

    constructor(
        private dataTypeService: DatatypeService,
        private dataSourceBuilder: NbTreeGridDataSourceBuilder<any>,
        private nbDialogService: NbDialogService
    ) {}

    ngOnInit(): void {
        this.getDataTypes()
    }

    getDataTypes() {
        return this.dataTypeService.getDataType().subscribe({
            next: (next) => {},
            error: () => {},
        })
    }

    convertToUsableUsers(listUser) {
        let no = 0
        this.datatypes = listUser.map((e) => {
            no += 1

            return {
                data: {
                    column_no: no,
                    // column_username: e.user_username,
                    // column_password: e.user_password, // ????
                    // column_firstname: e.user_firstname,
                    // column_lastname: e.user_lastname,
                    // column_email: e.user_email,
                    // column_phone: e.user_phone,
                    // column_permission_code: e.user_permission_code,
                    // column_is_deleted: e.user_is_deleted ? 'true' : 'false',
                    // column_group: e.user_group,
                },
            }
        })
    }

    searchDataType() {
        const { dataTypeFormControl } = this.filterFormGroup.getRawValue()
        if (dataTypeFormControl) {
            this.data = this.datatypes.filter((e) => {
                // const usernameSearch = e.data.column_username.includes(userFormControl)
                // const firstnameSearch = e.data.column_firstname.includes(userFormControl)
                // const lastnameSearch = e.data.column_lastname.includes(userFormControl)
                // const emailSearch = e.data.column_email.includes(userFormControl)
                // const phoneSearch = e.data.column_phone.includes(userFormControl)
                // const groupSearch = e.data.column_group.includes(userFormControl)

                // return usernameSearch || firstnameSearch || lastnameSearch || emailSearch || phoneSearch || groupSearch
                return true
            })
        } else {
            this.data = this.datatypes
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

    openDetail(datatype) {
        // this.nbDialogService.open(UserDetailComponent, { context: { data: user, type: 'edit' } }).onClose.subscribe((res) => {
        //     this.getUserList(false)
        // })
    }

    addDataType() {
        // const datatype = {
        //     column_username: '',
        //     column_password: '',
        //     column_firstname: '',
        //     column_lastname: '',
        //     column_email: '',
        //     column_phone: '',
        //     column_is_deleted: 'false',
        //     column_permission: '',
        //     column_permission_code: '01',
        //     column_group: '',
        // }
        // this.nbDialogService.open(UserDetailComponent, { context: { data: user, type: 'create' } }).onClose.subscribe((res) => {
        //     this.datatypes = this.datatypes.concat([{ data: res.data }])
        //     // console.log(this.users)
        //     // const data = this.files.filter((e) => e.folder_id === selectedFolder.folder_id)
        //     this.data = this.datatypes
        //     // this.applyNewData(this.data) hoi anh thien
        //     this.getDataTypes()
        // })
    }

    applyNewData(data) {
        this.dataSource = this.dataSourceBuilder.create(data)
    }
}
