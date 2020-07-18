import { Component, OnInit } from '@angular/core'
import { FormGroup, FormControl } from '@angular/forms'
import { NbTreeGridDataSource, NbSortDirection, NbTreeGridDataSourceBuilder, NbDialogService, NbSortRequest } from '@nebular/theme'
import { DropdownService } from '@app/services/dropdown.service'
import { dropdownsettings } from 'src/common/constants'
import { FolderDetailService } from '@app/services/folder-detail.service'
import { createDropdownLeftRealColumns, createDropdownMiddleRealColumns, createDropdownRightRealColumns } from 'src/common/functions'
import { DropdownDetailComponent } from '@app/components/dropdown-detail/dropdown-detail.component'
import { SharedService } from '@app/services/shared.service'

@Component({
    selector: 'app-manage-dropdown',
    templateUrl: './manage-dropdown.component.html',
    styleUrls: ['./manage-dropdown.component.scss'],
})
export class ManageDropdownComponent implements OnInit {
    dropDown
    folders
    filterFormGroup = new FormGroup({
        selectedFolder: new FormControl(''),
        searchDropdownFormControl: new FormControl(''),
        activationFormControl: new FormControl(false),
    })
    activationToggleStatus

    leftFakeColumns = dropdownsettings.dropdown.leftFakeColumns
    leftRealColumn = dropdownsettings.dropdown.leftRealColumns

    rightFakeColumns = dropdownsettings.dropdown.rightFakeColumns
    rightRealColumns = dropdownsettings.dropdown.rightRealColumns
    allColumns = []

    dataSource: NbTreeGridDataSource<any>

    sortColumn: string
    sortDirection: NbSortDirection = NbSortDirection.NONE

    dropdownInfo = []
    userList = []
    isReadOnly = true
    hiddenColumns = ['folder_id']

    constructor(
        private dataSourceBuilder: NbTreeGridDataSourceBuilder<any>,
        private nbDialogService: NbDialogService,
        private dropdownService: DropdownService,
        private foldersService: FolderDetailService,
        public sharedService: SharedService
    ) {
        this.filterFormGroup.valueChanges.subscribe((res) => {
            this._filter(res)
        })
    }

    ngOnInit(): void {
        // Hàm này để chạy cuối cùng
        this.getDropdownsAndFoldersList()
    }

    _filter(input) {
        const { selectedFolder, searchDropdownFormControl, activationFormControl } = input
        this.activationToggleStatus = activationFormControl
        // if (selectedFolder) {

        // }
        // const response = await this.dropdownService.getDropDown(selectedFolder.folder_id).toPromise()
        // this.dropDown = response.data
        this.allColumns = [...this.leftFakeColumns, ...this.rightFakeColumns]
        const searchDropdownFormControlLow = searchDropdownFormControl.toString().toLocaleLowerCase()
        let newData = this.dropDown.filter((e) => {
            const folderSearching = selectedFolder ? e.folder_id === selectedFolder.folder_id : true
            console.log(folderSearching)
            const dropdownSearching =
                (e.drop_down_id &&
                    e.drop_down_id
                        .toString()
                        .toLocaleLowerCase()
                        .includes(searchDropdownFormControlLow)) ||
                (e.drop_down_name &&
                    e.drop_down_name
                        .toString()
                        .toLocaleLowerCase()
                        .includes(searchDropdownFormControlLow)) ||
                (e.folder_name &&
                    e.folder_name
                        .toString()
                        .toLocaleLowerCase()
                        .includes(searchDropdownFormControlLow)) ||
                (e.drop_down_data &&
                    e.drop_down_data.find((e2) => {
                        return e2.name
                            .toString()
                            .toLocaleLowerCase()
                            .includes(searchDropdownFormControlLow)
                    }))

            return folderSearching && dropdownSearching
        })
        if (!activationFormControl) {
            newData = newData.filter((e) => {
                const activationSearch = e.drop_down_is_deleted === activationFormControl
                return activationSearch
            })
        }

        this.dropdownInfo = this.convertDataToDisplayableData(newData)
        console.log(this.dropdownInfo)
        this.applyNewData(this.dropdownInfo)
        return
    }

    // getFolderList() {
    //     this.foldersService.getChildFolders().subscribe((res) => {
    //         this.folders = res.data
    //     })
    // }

    getDropdownsAndFoldersList() {
        this.foldersService.getFolders().subscribe((res) => {
            this.folders = res.data
            this.dropdownService.getDropDown().subscribe((res2) => {
                this.dropDown = res2.data
                this._filter(this.filterFormGroup.getRawValue())
            })
        })
    }

    createRealMiddleColumns(flagColumnName) {
        return createDropdownMiddleRealColumns(flagColumnName)
    }

    createLeftRealColumns(flagColumnName) {
        return createDropdownLeftRealColumns(flagColumnName)
    }

    createRightRealColumns(flagColumnName) {
        return createDropdownRightRealColumns(flagColumnName)
    }

    convertDataToDisplayableData(data) {
        let no = 0
        return data.map((e) => {
            no += 1
            const folder = this.folders.find((e2) => e2.folder_id === data[0].folder_id)
            return {
                data: {
                    no,
                    ...e,
                    folder_name: folder ? folder.folder_name : null,
                },
            }
        })
    }

    applyNewData(data) {
        console.log(data)
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

    openDetail(dropdown) {
        const { selectedFolder, activationFormControl } = this.filterFormGroup.getRawValue()
        this.nbDialogService
            .open(DropdownDetailComponent, { context: { data: dropdown, type: 'edit', folder: selectedFolder }, hasBackdrop: true, autoFocus: false })
            .onClose.subscribe(async (res) => {
                if (res) {
                    this.getDropdownsAndFoldersList()
                    // const response = await this.dropdownService.getDropDown(selectedFolder.folder_id).toPromise()
                    // this.dropDown = response.data
                    // let newData = this.dropDown.filter((e) => e.folder_id === selectedFolder.folder_id)
                    // if (!activationFormControl) {
                    //     newData = newData.filter((e) => {
                    //         const activationSearch = e.drop_down_is_deleted === activationFormControl
                    //         return activationSearch
                    //     })
                    // }
                    // this.dropdownInfo = this.convertDataToDisplayableData(newData)
                    // this.applyNewData(this.dropdownInfo)
                }
            })
    }

    addDropdown() {
        const { selectedFolder, activationFormControl } = this.filterFormGroup.getRawValue()
        this.nbDialogService
            .open(DropdownDetailComponent, { context: { folder: selectedFolder, type: 'create', data: selectedFolder }, hasBackdrop: true, autoFocus: true })
            .onClose.subscribe(async (res) => {
                if (res) {
                    this.getDropdownsAndFoldersList()
                    // const response = await this.dropdownService.getDropDown(selectedFolder.folder_id).toPromise()
                    // this.dropDown = response.data
                    // let newData = this.dropDown.filter((e) => e.folder_id === selectedFolder.folder_id)
                    // if (!activationFormControl) {
                    //     newData = newData.filter((e) => {
                    //         const activationSearch = e.drop_down_is_deleted === activationFormControl
                    //         return activationSearch
                    //     })
                    // }
                    // this.dropdownInfo = this.convertDataToDisplayableData(newData)
                    // this.applyNewData(this.dropdownInfo)
                }
            })
    }
}
