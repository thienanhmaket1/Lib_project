import { office } from './../../../../common/constants'
import { Component, OnInit } from '@angular/core'
import { FormGroup, FormControl } from '@angular/forms'
import { NbSortDirection, NbSortRequest, NbTreeGridDataSource, NbTreeGridDataSourceBuilder, NbDialogService } from '@nebular/theme'
import { FileDetailComponent } from 'src/app/components/file-detail/file-detail.component'
import { createMiddleFakeColumns, createMiddleRealColumns, createLeftRealColumns, createRightRealColumns } from 'src/common/functions'
import { FileDetailService } from 'src/app/services/file-detail.service'
import { AuthenticationService } from 'src/app/authentication/authentication.service'
import { ManageUserService } from 'src/app/services/manage-user.service'
import { FolderDetailService } from '@app/services/folder-detail.service'
import { SharedService } from '@app/services/shared.service'
import { TranslateService } from '@ngx-translate/core'
import { DropdownService } from '@app/services/dropdown.service'

@Component({
    selector: 'app-search-file',
    templateUrl: './search-file.component.html',
    styleUrls: ['./search-file.component.scss'],
})
export class SearchFileComponent implements OnInit {
    folders
    // files = testFiles
    files
    filterFormGroup = new FormGroup({
        selectedFolder: new FormControl(''),
        searchFileFormControl: new FormControl(''),
    })

    leftFakeColumns = office.file.leftFakeColumns
    leftRealColumns = office.file.leftRealColumns

    middleFakeColumns = []

    rightFakeColumns = office.file.rightFakeColumns
    rightRealColumns = office.file.rightRealColumns

    allColumns = []
    dataSource: NbTreeGridDataSource<any>

    sortColumn: string
    sortDirection: NbSortDirection = NbSortDirection.NONE

    data = []
    userList = []
    dropdownList
    maxWidth = 0

    constructor(
        private dataSourceBuilder: NbTreeGridDataSourceBuilder<any>,
        private nbDialogService: NbDialogService,
        private fileService: FileDetailService,
        private authenticationService: AuthenticationService,
        private manageUserService: ManageUserService,
        private foldersService: FolderDetailService,
        public sharedService: SharedService,
        private translateService: TranslateService,
        private dropdownService: DropdownService
    ) {
        // this.getFolderList()
        // this.getUserList()
        this.filterFormGroup.valueChanges.subscribe((res) => {
            this._filter(res)
        })
    }

    async _filter(input) {
        const { selectedFolder, searchFileFormControl } = input
        // const response = await this.fileService.getFilesByUser('office').toPromise()
        // this.files = response.files
        // const responseDropdownList = await this.dropdownService.getDropDownByUser().toPromise()
        // this.dropdownList = responseDropdownList.data

        if (selectedFolder) {
            this.middleFakeColumns = [...createMiddleFakeColumns(selectedFolder.folder_properties, this.translateService.currentLang)]
            const index = this.leftFakeColumns.indexOf(`file_rule_id`)
            if (index > -1) {
                this.leftFakeColumns.splice(index, 1)
            }

            if (this.leftRealColumns[this.leftRealColumns.length - 1] !== 'office_manage_file.file_detail.file_file_no') {
                this.leftRealColumns.pop()
            }
            this.leftFakeColumns.push(`file_rule_id`)
            this.leftRealColumns.push(`${selectedFolder.folder_document_no}`)

            this.allColumns = [...this.leftFakeColumns, ...this.middleFakeColumns, ...this.rightFakeColumns]
            const searchFileFormControlLow = searchFileFormControl.toString().toLocaleLowerCase()
            const data = this.files.filter((e) => {
                const folderSearching = e.folder_id === selectedFolder.folder_id
                const fileSearching =
                    (e.file_rule_id &&
                        e.file_rule_id
                            .toString()
                            .toLocaleLowerCase()
                            .includes(searchFileFormControlLow)) ||
                    (e.file_file_name &&
                        e.file_file_name.find((e2) => {
                            return e2.file_title
                                .toString()
                                .toLocaleLowerCase()
                                .includes(searchFileFormControlLow)
                        })) ||
                    (e.file_created_by &&
                        e.file_created_by
                            .toString()
                            .toLocaleLowerCase()
                            .includes(searchFileFormControlLow)) ||
                    (e.file_properties &&
                        e.file_properties.find((e1) => {
                            return e1.property_value
                                .toString()
                                .toLocaleLowerCase()
                                .includes(searchFileFormControlLow)
                        }))

                return folderSearching && fileSearching
            })
            this.data = this.convertDataToDisplayableData(data, selectedFolder)
            this.applyNewData(this.data)

            return
        }

        this.middleFakeColumns = []
    }

    ngOnInit(): void {
        this.getFolderList()
        this.getUserList()
        this.getDropdown()
        this.getFiles()
        this.translateService.onLangChange.subscribe(() => {
            const filteredFormGroup = this.filterFormGroup.getRawValue()
            this._filter(filteredFormGroup)
        })
    }

    getUserList() {
        this.manageUserService.getSpecificGroupUser('office').subscribe((res) => {
            this.userList = res.data
        })
    }

    getFiles() {
        this.fileService.getFilesByUser('office').subscribe((res) => {
            this.files = res.files
        })
    }

    getFolderList() {
        this.foldersService.getFoldersByUser().subscribe((res) => {
            this.folders = res.data
        })
    }

    getDropdown() {
        this.dropdownService.getDropDownByUser().subscribe((res) => {
            this.dropdownList = res.data
        })
    }

    createMiddleRealColumns(flagColumnName) {
        const columnName = createMiddleRealColumns(flagColumnName)
        if (columnName.includes('!@#$%^&*()')) {
            return columnName.split('!@#$%^&*()')[this.translateService.currentLang === 'en' ? 0 : 1]
        }
        return columnName
    }

    createLeftRealColumns(flagColumnName) {
        return createLeftRealColumns(flagColumnName)
    }

    createRightRealColumns(flagColumnName) {
        return createRightRealColumns(flagColumnName)
    }

    convertDataToDisplayableData(data, selectedFolder) {
        let no = 0
        return data.map((e) => {
            no += 1
            const newE = {}
            const authorized_user_with_name = []
            e.file_properties.forEach((e1) => {
                const find = selectedFolder.folder_properties.find((e3) => e3.id === e1.id)
                newE[`column_*_${find ? find.property_name : e1.property_name}`] = {
                    property_value: e1.property_value,
                    property_data_type: find ? find.property_data_type : e1.property_data_type,
                    property_is_show_in_detail: find ? find.property_is_show_in_detail : e1.property_is_show_in_detail,
                    max_width: find ? find.max_width : e1.max_width,
                    id: e1.id,
                }
                if (e1.hasOwnProperty('dropdown_id')) {
                    newE[`column_*_${find ? find.property_name : e1.property_name}`] = {
                        property_value: e1.property_value,
                        dropdown_id: find ? find.property_data_type.split('dropdown_')[1] : e1.dropdown_id,
                        property_data_type: find ? find.property_data_type : e1.property_data_type,
                        property_is_show_in_detail: find ? find.property_is_show_in_detail : e1.property_is_show_in_detail,
                        max_width: find ? find.max_width : e1.max_width,
                        id: e1.id,
                    }
                }
            })
            e.file_authorized_users.forEach((element) => {
                const i = this.userList.find((e2) => e2.user_id === element)
                authorized_user_with_name.push(i)
            })

            return {
                data: {
                    no,
                    file_rule_id: e.file_rule_id,
                    ...newE,
                    file_file_name: e.file_file_name,
                    file_created_by: e.file_created_by,
                    file_created_at: e.file_created_at,
                    file_id: e.file_id,
                    file_authorized_users: e.file_authorized_users,
                    file_updated_count: e.file_updated_count,
                    file_updated_at: e.file_updated_at,
                },
            }
        })
    }

    applyNewData(data) {
        // data.map((e) => {
        //     const newData = []
        //     e.data.file_authorized_users.forEach(element => {
        //         newData.push(element.fullname)
        //     });
        //     e.data.file_authorized_users = newData
        //     return e
        // })
        this.dataSource = this.dataSourceBuilder.create(data)
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

    openDetail(file) {
        // Object.keys(file).map((e) => this.createRealColumns())
        const { selectedFolder } = this.filterFormGroup.getRawValue()
        const { user_id } = this.authenticationService.getUserValue
        const isAuthorized = file.file_authorized_users.includes(user_id)
        this.nbDialogService
            .open(FileDetailComponent, {
                context: { data: file, type: 'view', folder: selectedFolder, isAuthorized, dropdown: this.dropdownList },
                hasBackdrop: true,
                autoFocus: false,
            })
            .onClose.subscribe(async () => {
                // this.files = this.files.concat([res.data])
                const response = await this.fileService.getFilesByUser('office').toPromise()
                this.files = response.files
                const data = this.files.filter((e) => e.folder_id === selectedFolder.folder_id)
                this.data = this.convertDataToDisplayableData(data, selectedFolder)
                this.applyNewData(this.data)
            })
    }

    dropdownDetail(input) {
        const findDropdown = this.dropdownList.find((e) => e.drop_down_id === Number(input.dropdown_id))
        const list = []
        if (findDropdown) {
            input.property_value.forEach((element) => {
                findDropdown.drop_down_data.find((e2) => {
                    if (e2.id === element) {
                        list.push(e2.name)
                    }
                })
            })
        }

        return list
    }

    translatePropertyName(input) {
        const currentLang = this.translateService.currentLang
        if (input.includes('!@#$%^&*()')) {
            return input.split('!@#$%^&*()')[currentLang === 'en' ? 0 : 1]
        }
        return input
    }

    // measureWidth(input) {
    //     const fontSize = '12'
    //     input.folder_properties.map((e) => {
    //         e.max_width = this.getTextWidth('i'.repeat(e.max_width))
    //         return { ...e }
    //     })
    //     // return this.maxWidth
    // }

    getTextWidth(text, font = '14pt roboto') {
        // if given, use cached canvas for better performance
        // else, create new canvas
        const canvas = document.createElement('canvas')
        const context = canvas.getContext('2d')
        context.font = font
        const metrics = context.measureText(text)
        return metrics.width
    }

    setWidth(input) {
        return this.getTextWidth('a'.repeat(input.max_width))
    }

    check(column) {
        const { selectedFolder } = this.filterFormGroup.getRawValue()
        if (column !== 'file_created_at' && column !== 'file_updated_at' && column !== 'file_file_name' && column !== 'file_is_deleted') {
            if (column === 'file_updated_count') {
                return selectedFolder.folder_is_show_updated_count
            }
        }
        return false
    }

    check2(column) {
        // console.log(column)
        const { selectedFolder } = this.filterFormGroup.getRawValue()
        if (column === 'file_created_at') {
            return selectedFolder.folder_is_show_created_at
        }
        if (column === 'file_updated_at') {
            return selectedFolder.folder_is_show_updated_at
        }
        return false
    }

    checkProperty(input) {
        const { selectedFolder } = this.filterFormGroup.getRawValue()
        if (input) {
            const find = selectedFolder.folder_properties.find((e3) => e3.id === input.id)
            return find ? find.property_is_show_in_list : true
        }
        return false
    }

    displayColumn(column) {
        const { selectedFolder } = this.filterFormGroup.getRawValue()
        if (column === 'file_authorized_users') {
            return false
        }
        if (column === 'file_created_at') {
            return selectedFolder.folder_is_show_created_at
        }
        if (column === 'file_updated_at') {
            return selectedFolder.folder_is_show_updated_at
        }
        if (column === 'file_updated_count') {
            return selectedFolder.folder_is_show_updated_count
        }
        if (column.includes('column_*_')) {
            const propertyName = column.split('column_*_')[1]
            if (propertyName) {
                const find = selectedFolder.folder_properties.find((e3) => e3.property_name === propertyName)
                return find ? find.property_is_show_in_list : true
            }
        }
        return true
    }
}