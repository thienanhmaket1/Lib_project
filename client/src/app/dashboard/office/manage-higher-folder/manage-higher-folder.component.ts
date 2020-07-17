import { Component, OnInit } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'
import { NbTreeGridDataSourceBuilder, NbTreeGridDataSource, NbSortDirection, NbSortRequest, NbDialogService } from '@nebular/theme'
import { FormGroup, FormControl } from '@angular/forms'
import { createFixedRealColumns, getFixedColumnsWidth } from 'src/common/functions'
import { dateTimeInString } from './../../../../common/functions'
import { FolderDetailService } from '@app/services/folder-detail.service'
import { TranslateService } from '@ngx-translate/core'
import { FolderDetailComponent } from '@app/components/folder-detail/folder-detail.component'
import { HigherFolderDetailComponent } from '@app/components/higher-folder-detail/higher-folder-detail.component'
import { SharedService } from '@app/services/shared.service'
import { AuthenticationService } from '@app/authentication/authentication.service'

@Component({
    selector: 'app-manage-higher-folder',
    templateUrl: './manage-higher-folder.component.html',
    styleUrls: ['./manage-higher-folder.component.scss'],
})
export class ManageHigherFolderComponent implements OnInit {
    activationToggleStatus
    folders
    filterFormGroup = new FormGroup({
        folderFormControl: new FormControl(''),
        activationFormControl: new FormControl(false),
    })

    fixedColumns = ['no', 'higher_folder_name', 'folder_created_at']
    // customColumns = ['folder_structure']
    customColumns = []

    allColumns = []
    dataSource: NbTreeGridDataSource<any>

    sortColumn: string
    sortDirection: NbSortDirection = NbSortDirection.NONE
    data
    user

    constructor(
        private dataSourceBuilder: NbTreeGridDataSourceBuilder<any>,
        private nbDialogService: NbDialogService,
        private folderService: FolderDetailService,
        private translateService: TranslateService,
        private router: Router,
        public sharedService: SharedService,
        private authenticationService: AuthenticationService
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
                e.higher_folder_name &&
                e.higher_folder_name
                    .toString()
                    .toLocaleLowerCase()
                    .includes(folderFormControlLow)

            return folderNameSearch
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
        newData = input.map((e) => {
            no += 1
            return {
                data: {
                    no,
                    ...e,
                },
            }
        })
        this.allColumns = [...this.fixedColumns, ...this.customColumns]
        return newData
    }

    applyNewData(data) {
        this.dataSource = this.dataSourceBuilder.create(data)
    }

    getFolderList() {
        this.folderService.getHigherFolders().subscribe((res) => {
            this.folders = [...res.data]
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

    dateTimeInString(date) {
        return dateTimeInString(date, 'YYYY/MM/DD HH:mm:ss')
    }

    openDetail(folder) {
        const newFolder = { ...folder }
        this.nbDialogService.open(HigherFolderDetailComponent, { context: { data: newFolder, type: 'edit' } }).onClose.subscribe(() => {
            this.getFolderList()
        })
    }

    addFolder() {
        const folder = {
            higher_folder_name: '',
        }
        this.nbDialogService.open(HigherFolderDetailComponent, { context: { data: folder, type: 'create' } }).onClose.subscribe(() => {
            this.getFolderList()
        })
    }

    goToChildFolder(input) {
        this.router.navigate([`/dashboard/office/manage-folder/${input}`])
    }
}
