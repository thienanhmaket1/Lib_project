import { dateTimeInString } from './../../../../common/functions'
import { Component, OnInit, Input } from '@angular/core'
import { FormGroup, FormControl } from '@angular/forms'
import { NbTreeGridDataSource, NbSortDirection, NbTreeGridDataSourceBuilder, NbDialogService, NbSortRequest } from '@nebular/theme'
import { createFixedRealColumns, getFixedColumnsWidth } from 'src/common/functions'
import { FolderDetailComponent } from 'src/app/components/folder-detail/folder-detail.component'
import { AuthenticationService } from 'src/app/authentication/authentication.service'
import { FolderDetailService } from 'src/app/services/folder-detail.service'
import { TranslateService } from '@ngx-translate/core'
import { ActivatedRoute, Router } from '@angular/router'
import { SharedService } from '@app/services/shared.service'

@Component({
    selector: 'app-manage-folder',
    templateUrl: './manage-folder.component.html',
    styleUrls: ['./manage-folder.component.scss'],
})
export class ManageFolderComponent implements OnInit {
    activationToggleStatus
    folders
    filterFormGroup = new FormGroup({
        folderFormControl: new FormControl(''),
        activationFormControl: new FormControl(false),
    })

    fixedColumns = [
        'no',
        // 'higher_folder_name',
        'folder_name',
        // 'folder_document_no',
        // 'folder_created_by',
        // 'folder_is_show_updated_count',
        // 'folder_is_show_created_at',
        // 'folder_is_show_updated_at',
        // 'folder_authorized_users',
        // 'folder_created_at',
        'file_latest_update',
        // 'folder_is_deleted',
    ]
    // customColumns = ['folder_structure']
    customColumns = []

    allColumns = []
    dataSource: NbTreeGridDataSource<any>

    sortColumn: string
    sortDirection: NbSortDirection = NbSortDirection.NONE

    data = []
    booleanColumn = ['folder_is_show_updated_count', 'folder_is_show_created_at', 'folder_is_show_updated_at']
    max = 0
    status_yes = 'office_manage_folder.folder_detail.folder_status_yes'
    status_no = 'office_manage_folder.folder_detail.folder_status_no'
    currentHigherFolder
    user

    constructor(
        private dataSourceBuilder: NbTreeGridDataSourceBuilder<any>,
        private nbDialogService: NbDialogService,
        private authenticationService: AuthenticationService,
        private folderService: FolderDetailService,
        private translateService: TranslateService,
        private route: ActivatedRoute,
        private router: Router,
        public sharedService: SharedService
    ) {
        this.getFolderList()
        this.filterFormGroup.valueChanges.subscribe(() => {
            this.searchFolder()
        })

        this.authenticationService.getUser.subscribe((res) => {
            this.user = this.authenticationService.getUserValue
        })
    }

    ngOnInit(): void {}

    searchFolder() {
        const { folderFormControl, activationFormControl } = this.filterFormGroup.getRawValue()
        this.activationToggleStatus = activationFormControl
        const folderFormControlLow = folderFormControl.toString().toLocaleLowerCase()

        let newData = this.folders.filter((e) => {
            const folderNameSearch =
                e.folder_name &&
                e.folder_name
                    .toString()
                    .toLocaleLowerCase()
                    .includes(folderFormControlLow)

            const folderCreatedBySearch =
                e.folder_created_by &&
                e.folder_created_by
                    .toString()
                    .toLocaleLowerCase()
                    .includes(folderFormControlLow)
            const folderDocumentNoSearch =
                e.folder_document_no &&
                e.folder_document_no
                    .toString()
                    .toLocaleLowerCase()
                    .includes(folderFormControlLow)
            return folderNameSearch || folderCreatedBySearch || folderDocumentNoSearch
        })
        if (!activationFormControl) {
            newData = newData.filter((e) => {
                const activationSearch = e.folder_is_deleted === activationFormControl
                return activationSearch
            })
        }

        this.data = this.convertToDisplayableData(newData)
        this.applyNewData(this.data)
    }

    convertToDisplayableData(input) {
        this.customColumns = []
        let newData = []
        let no = 0
        this.max = 0
        newData = input.map((e) => {
            no += 1
            const newMax = e.folder_properties.length
            if (e.folder_properties.length > this.max) {
                this.max = newMax
            }
            return {
                data: {
                    no,
                    ...e,
                },
            }
        })

        for (let index = 0; index < this.max; index++) {
            this.customColumns.push((index + 1).toString())
        }

        newData = newData.map((ele) => {
            const { data } = ele
            let flag = {}
            for (let index = 0; index < this.max; index++) {
                const element = data.folder_properties[index]
                flag[`property_name_${index + 1}`] = element ? element.property_name : ''
            }
            return {
                data: {
                    ...data,
                    ...flag,
                },
            }
        })
        // this.allColumns = [...this.fixedColumns, ...this.customColumns]
        this.allColumns = [...this.fixedColumns]
        return newData
    }

    applyNewData(data) {
        this.dataSource = this.dataSourceBuilder.create(data)
    }

    getFolderList() {
        const folder_root_id = this.route.snapshot.params.folder_id
        this.folderService.getFolders(folder_root_id).subscribe((res) => {
            this.folders = [...res.data]
            if (res.data.length !== 0) {
                this.currentHigherFolder = res.data[0].higher_folder_name
            }

            this.searchFolder()
        })
    }

    createFixedRealColumns(flagColumnName) {
        return createFixedRealColumns(flagColumnName)
    }

    createCustomRealColumns(flagColumnName) {
        // return createCustomRealColumns(flagColumnName)
        return this.customColumns[this.customColumns.indexOf(flagColumnName)]
    }

    getFixedColumnsWidth(flagColumnName) {
        return getFixedColumnsWidth(flagColumnName)
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

    openDetail(folder) {
        const newFolder = { max: this.max, ...folder }
        // Object.keys(file).map((e) => this.createRealColumns())
        this.nbDialogService.open(FolderDetailComponent, { context: { data: newFolder, type: 'edit' } }).onClose.subscribe(() => {
            this.getFolderList()
        })
    }

    addFolder() {
        const folder_root_id = this.route.snapshot.params.folder_id
        const folder = {
            folder_name: '',
            folder_short_name: '',
            folder_setting_number: {
                number_of_digit: '3',
                start_number: '001',
            },
            folder_document_no: '',
            folder_is_show_updated_count: true,
            folder_is_show_created_at: true,
            folder_is_show_updated_at: true,
            // folder_can_open_file_detail: true,
            folder_properties: [],
            folder_authorized_users: [],
            // folder_created_by: `${user_lastname} ${user_firstname}`,
            // folder_created_at: new Date().toLocaleString(),
            folder_root_id,
        }
        this.nbDialogService.open(FolderDetailComponent, { context: { data: folder, type: 'create' } }).onClose.subscribe(() => {
            this.getFolderList()
        })
    }

    dateTimeInString(date) {
        return dateTimeInString(date, 'YYYY/MM/DD HH:mm:ss')
    }

    translatePropertyName(input) {
        const currentLang = this.translateService.currentLang
        return input.split('!@#$%^&*()')[currentLang === 'en' ? 0 : 1]
    }

    goToChildFolder(input) {
        this.router.navigate([`/dashboard/office/manage-file/${input}`])
    }

    goToHigherFolder() {
        this.router.navigate([`/dashboard/office/manage-higher-folder`])
    }

    btnClick(column, input) {
        if (column === 'folder_name') {
            this.goToChildFolder(input.folder_id)
        } else if (column === 'higher_folder_name') {
            this.goToHigherFolder()
        } else {
            this.openDetail(input)
        }
    }

    checkPermission() {
        if (this.user.user_permission_code === '99') {
            return true
        }
        return false
    }
}
