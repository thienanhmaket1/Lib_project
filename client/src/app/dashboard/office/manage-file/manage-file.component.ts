import { Component, OnInit } from '@angular/core'
import { createMiddleFakeColumns, createMiddleRealColumns, createLeftRealColumns, createRightRealColumns } from 'src/common/functions'
import { FormGroup, FormControl } from '@angular/forms'
import { NbTreeGridDataSource, NbSortDirection, NbTreeGridDataSourceBuilder, NbDialogService, NbSortRequest } from '@nebular/theme'
import { FileDetailComponent } from 'src/app/components/file-detail/file-detail.component'
import { office } from 'src/common/constants'
import { FileDetailService } from 'src/app/services/file-detail.service'
import { ManageUserService } from 'src/app/services/manage-user.service'
import { FolderDetailService } from '@app/services/folder-detail.service'
import { DropdownService } from '@app/services/dropdown.service'
import { TranslateService } from '@ngx-translate/core'
import { SharedService } from '@app/services/shared.service'
import { Router, ActivatedRoute } from '@angular/router'
import { SettingsService } from '@app/services/settings.service'
import { AuthenticationService } from '@app/authentication/authentication.service'

@Component({
    selector: 'app-manage-file',
    templateUrl: './manage-file.component.html',
    styleUrls: ['./manage-file.component.scss'],
})
export class ManageFileComponent implements OnInit {
    activationToggleStatus
    files
    folders
    filterFormGroup = new FormGroup({
        selectedFolder: new FormControl(''),
        searchFileFormControl: new FormControl(''),
        activationFormControl: new FormControl(false),
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
    filesCount = 0
    dropdownList
    maxWidth = 0
    pathFromFolderStructure
    department
    currentFolder
    currentHigherFolder
    user

    constructor(
        private dataSourceBuilder: NbTreeGridDataSourceBuilder<any>,
        private nbDialogService: NbDialogService,
        private fileService: FileDetailService,
        private manageUserService: ManageUserService,
        private foldersService: FolderDetailService,
        private dropdownService: DropdownService,
        public sharedService: SharedService,
        private translateService: TranslateService,
        private route: ActivatedRoute,
        private router: Router,
        private settingsService: SettingsService,
        private authenticationService: AuthenticationService
    ) {
        this.authenticationService.getUser.subscribe((res) => {
            this.user = this.authenticationService.getUserValue
        })

        this.filterFormGroup.valueChanges.subscribe((res) => {
            this._filter(res)
        })
    }

    async _filter(input) {
        const { selectedFolder, searchFileFormControl, activationFormControl } = input
        // const response = await this.fileService.getFiles('office').toPromise()
        // this.files = response.files

        // const responseDropdownList = await this.dropdownService.getDropDown().toPromise()
        // this.dropdownList = responseDropdownList.data

        this.activationToggleStatus = activationFormControl
        if (selectedFolder) {
            const responseNumberOfFiles = await this.fileService.getFilesByFolderID(selectedFolder.folder_id).toPromise()
            this.filesCount = responseNumberOfFiles.files.length
            // this.middleFakeColumns = [...createMiddleFakeColumns(selectedFolder.folder_properties, this.translateService.currentLang)] || []

            // const index = this.leftFakeColumns.indexOf(`file_rule_id`)
            // if (index > -1) {
            //     this.leftFakeColumns.splice(index, 1)
            // }

            // if (this.leftRealColumns[this.leftRealColumns.length - 1] !== 'office_manage_file.file_detail.file_file_no') {
            //     this.leftRealColumns.pop()
            // }
            // this.leftFakeColumns.push(`file_rule_id`)
            // this.leftRealColumns.push(`${selectedFolder.folder_document_no}`)
            this.additionalLeftColumn()

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
            this.data = this.convertDataToDisplayableData(
                this.handlerDetailViewFilterFormGroup(searchFileFormControl, selectedFolder, activationFormControl, data),
                selectedFolder
            )
            this.applyNewData(this.data)
            return
            // if (this.leftRealColumns[this.leftRealColumns.length - 1] !== 'office_manage_file.file_detail.file_file_no') {
            //     this.leftRealColumns.pop()
            // }
            // this.leftFakeColumns.push(`file_rule_id`)
            // this.leftRealColumns.push(`${selectedFolder.folder_document_no}`)

            // this.allColumns = [...this.leftFakeColumns, ...this.middleFakeColumns, ...this.rightFakeColumns]
            // const data = this.files.filter((e) => {
            //     const folderSearching = e.folder_id === selectedFolder.folder_id
            //     const fileSearching = e.file_rule_id
            //         ? e.file_rule_id.includes(searchFileFormControl)
            //         : true || e.file_file_name
            //         ? e.file_file_name.find((e2) => e2.file_title.includes(searchFileFormControl))
            //         : true || e.file_created_by
            //         ? e.file_created_by.includes(searchFileFormControl)
            //         : true || e.file_properties
            //         ? e.file_properties.find((e1) => e1.property_value.includes(searchFileFormControl))
            //         : true
            //     return folderSearching && fileSearching
            // })
            // this.data = this.convertDataToDisplayableData(
            //     this.handlerDetailViewFilterFormGroup(searchFileFormControl, selectedFolder, activationFormControl, data)
            // )

            // this.applyNewData(this.data)
            // return
        }

        this.middleFakeColumns = []
    }

    ngOnInit(): void {
        this.getFolderList()
        this.getUserList()
        this.getDropdown()
        this.getDepartment()
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
        this.fileService.getFiles('office').subscribe((res) => {
            this.files = res.files
            console.log(this.files)
        })
    }

    getFolderList() {
        const folder_id = this.route.snapshot.params.folder_id
        // this.foldersService.getFolders(false).subscribe((res) => {
        //     this.folders = res.data
        // })
        this.foldersService.getFolderDetail(folder_id).subscribe((res) => {
            if (res.data.length !== 0) {
                const folderDetail = res.data[0]
                this.filterFormGroup.get('selectedFolder').patchValue(folderDetail)
                this.currentFolder = folderDetail.folder_name
                this.currentHigherFolder = folderDetail.higher_folder_name
                this.pathFromFolderStructure = `${folderDetail.folder_name}`
            }
        })
    }

    getDropdown() {
        this.dropdownService.getDropDownByUser().subscribe((res) => {
            this.dropdownList = res.data
        })
    }

    getDepartment() {
        this.dropdownService.getDepartment().subscribe((res) => {
            this.department = res.data
        })
    }

    additionalLeftColumn() {
        const { selectedFolder } = this.filterFormGroup.getRawValue()

        /** folder_name */
        const index2 = this.leftFakeColumns.indexOf(`file_department_id`)
        if (index2 > -1) {
            this.leftFakeColumns.splice(index2, 1)
        }

        if (this.leftRealColumns[this.leftRealColumns.length - 1] !== 'office_manage_file.file_detail.file_file_no') {
            this.leftRealColumns.pop()
        }
        this.leftFakeColumns.push(`file_department_id`)
        this.leftRealColumns.push(`office_manage_file.file_detail.file_department_id`)
        /** file_rule_id */
        const index = this.leftFakeColumns.indexOf(`file_rule_id`)
        if (index > -1) {
            this.leftFakeColumns.splice(index, 1)
        }

        if (this.leftRealColumns[this.leftRealColumns.length - 2] === 'office_manage_file.file_detail.file_department_id') {
            this.leftRealColumns.pop()
        }
        this.leftFakeColumns.push(`file_rule_id`)
        this.leftRealColumns.push(`${selectedFolder.folder_document_no}`)
    }

    createMiddleRealColumns(flagColumnName) {
        const columnName = createMiddleRealColumns(flagColumnName)
        return columnName
    }

    createLeftRealColumns(flagColumnName) {
        return createLeftRealColumns(flagColumnName)
    }

    createRightRealColumns(flagColumnName) {
        return createRightRealColumns(flagColumnName)
    }

    handlerDetailViewFilterFormGroup = (searchFileFormControl, selectedFolder, activationFormControl, data = this.files) => {
        let newData: any = data

        if (!activationFormControl) {
            newData = newData.filter((e) => {
                const activationSearch = e.file_is_deleted === activationFormControl
                return activationSearch
            })
        }

        return newData
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

            const departmentId = e.file_department_id ? this.department.drop_down_data.find((info) => info.id === e.file_department_id.toString()) : {}

            return {
                data: {
                    no,
                    folder_name: selectedFolder.folder_name,
                    file_rule_id: e.file_rule_id,
                    file_department_id: departmentId,
                    ...newE,
                    file_file_name: e.file_file_name,
                    file_created_by: e.file_created_by,
                    file_created_at: e.file_created_at,
                    file_id: e.file_id,
                    file_authorized_users: e.file_authorized_users,
                    file_updated_count: e.file_updated_count,
                    file_updated_at: e.file_updated_at,
                    file_is_deleted: e.file_is_deleted,
                },
            }
        })
    }

    applyNewData(data) {
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
        const { selectedFolder, searchFileFormControl, activationFormControl } = this.filterFormGroup.getRawValue()
        this.nbDialogService
            .open(FileDetailComponent, {
                context: { data: file, type: 'edit', folder: selectedFolder, dropdown: this.dropdownList, department: this.department },
            })
            .onClose.subscribe(async () => {
                const response = await this.fileService.getFiles('office').toPromise()
                this.files = response.files
                const data = this.files.filter((e) => e.folder_id === selectedFolder.folder_id)
                this.data = this.convertDataToDisplayableData(
                    this.handlerDetailViewFilterFormGroup(searchFileFormControl, selectedFolder, activationFormControl, data),
                    selectedFolder
                )
                this.applyNewData(this.data)
            })
    }

    addFile() {
        const { selectedFolder, searchFileFormControl, activationFormControl } = this.filterFormGroup.getRawValue()
        if (!selectedFolder) {
            return
        }
        const newData = { file_count: this.filesCount + 1, ...selectedFolder }
        this.nbDialogService
            .open(FileDetailComponent, {
                context: { folder: selectedFolder, type: 'create', data: newData, dropdown: this.dropdownList, department: this.department },
            })
            .onClose.subscribe(async () => {
                const response = await this.fileService.getFiles('office').toPromise()
                this.files = response.files
                const responseNumberOfFiles = await this.fileService.getFilesByFolderID(selectedFolder.folder_id).toPromise()
                this.filesCount = responseNumberOfFiles.files.length
                const data = this.files.filter((e) => e.folder_id === selectedFolder.folder_id)
                this.data = this.convertDataToDisplayableData(
                    this.handlerDetailViewFilterFormGroup(searchFileFormControl, selectedFolder, activationFormControl, data),
                    selectedFolder
                )
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

    openFileName(input) {
        if (input && !input.drawing_is_exist_on_hardisk) {
            this.sharedService.showMessage({
                content: {
                    value: 'office_manage_file.alert_not_exists_drawing',
                },
                title: 'Alert',
                status: 'warning',
            })
            return
        }
        if (!input.file_name.includes('Browse file') && input.file_name !== '') {
            const fileName = `${this.pathFromFolderStructure}/${input.file_name}`
            window.open(this.settingsService.openFile(`get-office-file/${encodeURIComponent(fileName)}`))
        }
    }

    getTextWidth(text, font = '14pt roboto') {
        const canvas = document.createElement('canvas')
        const context = canvas.getContext('2d')
        context.font = font
        const metrics = context.measureText(text)
        return metrics.width
    }

    setWidth(input) {
        // console.log(input.property_value.length)
        return this.getTextWidth('a'.repeat(input.max_width))
    }

    setValue(input) {
        if (input.property_value.length > input.max_width) {
            return input.property_value.substring(0, input.max_width) + '...'
        }
        return input.property_value
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

    goToFolder() {
        const { selectedFolder } = this.filterFormGroup.getRawValue()
        this.router.navigate([`/dashboard/office/manage-folder/${selectedFolder.folder_root_id}`])
    }

    goToHigherFolder() {
        this.router.navigate([`/dashboard/office/manage-higher-folder`])
    }

    checkPermission() {
        if (this.user.user_permission_code === '99' || this.user.user_permission_code === '09') {
            return true
        }
        return false
    }
}
