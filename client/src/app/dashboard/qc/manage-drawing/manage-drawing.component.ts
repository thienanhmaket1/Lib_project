import { Component, OnInit, ViewChild, ElementRef } from '@angular/core'
import { FormGroup, FormControl } from '@angular/forms'
import { SettingsService } from 'src/app/services/settings.service'
import { qc } from 'src/common/constants'
import { createDrawingMiddleRealColumns, createDrawingLeftRealColumns, createDrawingRightRealColumns, dateTimeInString } from 'src/common/functions'
import { NbTreeGridDataSource, NbTreeGridDataSourceBuilder, NbSortRequest, NbSortDirection, NbDialogService } from '@nebular/theme'

import { NgxFileDropEntry, FileSystemFileEntry } from 'ngx-file-drop'
import { ManageDrawingService } from './manage-drawing.service'
import { SharedService } from '@app/services/shared.service'
import { forkJoin } from 'rxjs'
import { DrawingDetailComponent } from '@app/components/drawing-detail/drawing-detail.component'
import { ConfirmationComponent } from '@app/components/confirmation/confirmation.component'
import { AuthenticationService } from '@app/authentication/authentication.service'
@Component({
    selector: 'app-manage-drawing',
    templateUrl: './manage-drawing.component.html',
    styleUrls: ['./manage-drawing.component.scss'],
})
export class ManageDrawingComponent implements OnInit {
    @ViewChild('addDrawingFileFakeInput') addDrawingFileFakeInput: ElementRef

    folderViewFilterFormGroup = new FormGroup({
        selectedFolderFormControl: new FormControl(''),
        drawingsFormControl: new FormControl(''),
    })

    detailViewFilterFormGroup = new FormGroup({
        selectedFolderFormControl: new FormControl(''),
        drawingsFormControl: new FormControl(''),
        activationFormControl: new FormControl(false),
        isNotExistOnHardiskControl: new FormControl(false),
    })

    updateCSVViewFilterFormGroup = new FormGroup({
        drawingsFormControl: new FormControl(''),
    })

    dropFiles: NgxFileDropEntry[] = []

    rowsPerPageFormControl = new FormControl(50)

    baseFolders = []
    baseFiles = []

    foldersQC = []
    folders = []

    files: any = []
    rows

    fileFormGroup = new FormGroup({})

    selectedFolder: any = 'root'
    settingsInfo: any
    fileToUpload: any

    leftFakeColumns = qc.drawing.leftFakeColumns.filter((e) => !qc.drawing.hiddenColumnsInList.includes(e))
    leftRealColumn = qc.drawing.leftRealColumns

    middleFakeColumns = qc.drawing.middleFakeColumns.filter((e) => !qc.drawing.hiddenColumnsInList.includes(e))

    rightFakeColumns = qc.drawing.rightFakeColumns.filter((e) => !qc.drawing.hiddenColumnsInList.includes(e))
    rightRealColumns = qc.drawing.rightRealColumns

    data = []
    currentData = []
    dataCSV = []
    allColumns = []

    dataSource: NbTreeGridDataSource<any>
    dataSourceCSV: NbTreeGridDataSource<any>

    sortColumn: string
    sortDirection: NbSortDirection = NbSortDirection.NONE
    checked = false
    // @Output() checkedChange = new EventEmitter<boolean>()
    labelPosition = 'end'
    viewType = 'Folder View'
    isLoadingSomething = false
    arrRelativePath = []

    showCSV = false
    show = false

    isEditCustomer = false

    hiddenColumns = qc.drawing.hiddenColumnsInList
    disabledColumns = qc.drawing.disabledColumnsInList
    toggleColumns = qc.drawing.toggleColumnsInList
    fileColumns = qc.drawing.fileColumnsInList
    inputColumns = qc.drawing.inputColumnsInList
    dateTimeColumns = qc.drawing.dateTimeColumns
    activationToggleStatus
    isShowUpdateByCSV = true
    pages = 0
    rowsEachPage = 50
    currentPage = 0
    currentShowing = ''
    user

    constructor(
        private settingsService: SettingsService,
        private dataSourceBuilder: NbTreeGridDataSourceBuilder<any>,
        private nbDialogService: NbDialogService,
        private manageDrawingService: ManageDrawingService,
        public sharedService: SharedService,
        private authenticationService: AuthenticationService
    ) {
        this.authenticationService.getUser.subscribe((res) => {
            this.user = this.authenticationService.getUserValue
        })

        /** Bắt sự kiện khi người dùng thao tác filter trên tab Drawing List */
        this.detailViewFilterFormGroup.valueChanges.subscribe((res) => {
            const { drawingsFormControl, selectedFolderFormControl, activationFormControl, isNotExistOnHardiskControl } = res
            this.activationToggleStatus = activationFormControl
            // const data = this.handlerDetailViewFilterFormGroup(drawingsFormControl, selectedFolderFormControl, activationFormControl)
            this.currentData = this.handlerDetailViewFilterFormGroup(
                drawingsFormControl,
                selectedFolderFormControl,
                activationFormControl,
                isNotExistOnHardiskControl
            )

            this.createPages()
            this.changePage(0)
        })

        this.rowsPerPageFormControl.valueChanges.subscribe((res) => {
            if (res <= 0) {
                this.sharedService.showMessage({
                    content: {
                        value: 'qc_manage_drawings.tabs.update_drawing_by_csv.rows_per_page_must_be_greater_than_zero',
                    },
                    status: 'danger',
                    title: 'Error',
                })

                return
            }
            this.rowsEachPage = res
            this.createPages()
            this.changePage(0)
        })

        /** Bắt sự kiện khi người dùng thao tác filter/kéo/chọn CSV file trên tab Update By CSV */
        this.updateCSVViewFilterFormGroup.valueChanges.subscribe((res) => {
            const { drawingsFormControl } = res

            this.handlerUpdateCSVViewFilterFormGroup(drawingsFormControl)
        })
    }

    ngOnInit(): void {
        // this.getDirectory()
        // this.getDrawings()
        this.reloadDetailView()
        this.settingsService.getQCAdminSettings().subscribe(
            (res) => {
                this.settingsInfo = res.data
            },
            () => { }
        )
    }

    reloadDetailView() {
        this.getDrawings()
        this.getDirectory()
    }

    handlerDetailViewFilterFormGroup = (
        drawingsFormControl,
        selectedFolderFormControl,
        activationFormControl,
        isNotExistOnHardiskControl,
        data = this.data
    ) => {
        let newData: any = data
        if (drawingsFormControl) {
            const drawingsFormControlLower = drawingsFormControl.toString().toLocaleLowerCase()
            newData = data.filter((e) => {
                const fileNameSearch =
                    e.drawing_file_name &&
                    e.drawing_file_name
                        .toString()
                        .toLocaleLowerCase()
                        .includes(drawingsFormControlLower)
                const customerSearch =
                    e.drawing_customer &&
                    e.drawing_customer
                        .toString()
                        .toLocaleLowerCase()
                        .includes(drawingsFormControlLower)
                const koubanSearch =
                    e.drawing_kouban &&
                    e.drawing_kouban
                        .toString()
                        .toLocaleLowerCase()
                        .includes(drawingsFormControlLower)
                const partNameSearch =
                    e.drawing_part_name &&
                    e.drawing_part_name
                        .toString()
                        .toLocaleLowerCase()
                        .includes(drawingsFormControlLower)
                const createdBySearch =
                    e.drawing_created_by_full_name &&
                    e.drawing_created_by_full_name
                        .toString()
                        .toLocaleLowerCase()
                        .includes(drawingsFormControlLower)
                const updateBySearch =
                    e.drawing_updated_by_full_name &&
                    e.drawing_updated_by_full_name
                        .toString()
                        .toLocaleLowerCase()
                        .includes(drawingsFormControlLower)

                return fileNameSearch || customerSearch || koubanSearch || partNameSearch || createdBySearch || updateBySearch
            })
        }

        if (selectedFolderFormControl) {
            newData = newData.filter((e) => {
                const relativePathSearch = e.drawing_relative_path === selectedFolderFormControl
                return relativePathSearch
            })
        }

        if (!activationFormControl) {
            newData = newData.filter((e) => {
                const activationSearch = e.drawing_is_deleted === activationFormControl
                return activationSearch
            })
        }

        // console.log('Hha', isNotExistOnHardiskControl)
        if (isNotExistOnHardiskControl) {
            newData = newData.filter((e) => {
                const isNotExistOnHardiskSearch = e.drawing_is_exist_on_hardisk !== isNotExistOnHardiskControl
                return isNotExistOnHardiskSearch
            })
        }

        return newData
    }

    handlerUpdateCSVViewFilterFormGroup = (drawingsFormControl) => {
        if (drawingsFormControl) {
            const drawingsFormControlLower = drawingsFormControl.toString().toLocaleLowerCase()
            const data = this.dataCSV.filter((e) => {
                const fileNameSearch =
                    e.data.drawing_file_name &&
                    e.data.drawing_file_name
                        .toString()
                        .toLocaleLowerCase()
                        .includes(drawingsFormControlLower)
                const customerSearch =
                    e.data.drawing_customer &&
                    e.data.drawing_customer
                        .toString()
                        .toLocaleLowerCase()
                        .includes(drawingsFormControlLower)
                const koubanSearch =
                    e.data.drawing_kouban &&
                    e.data.drawing_kouban
                        .toString()
                        .toLocaleLowerCase()
                        .includes(drawingsFormControlLower)
                const partNameSearch =
                    e.data.drawing_part_name &&
                    e.data.drawing_part_name
                        .toString()
                        .toLocaleLowerCase()
                        .includes(drawingsFormControlLower)
                const createdBySearch =
                    e.data.drawing_created_by_full_name &&
                    e.data.drawing_created_by_full_name
                        .toString()
                        .toLocaleLowerCase()
                        .includes(drawingsFormControlLower)
                const updateCountSearch = Number(e.data.drawing_updated_count) === drawingsFormControl

                return fileNameSearch || customerSearch || koubanSearch || partNameSearch || createdBySearch || updateCountSearch
            })

            return this.applyNewDataCSV(data)
        }

        this.applyNewDataCSV(this.dataCSV)
    }

    openAddDrawingFile() {
        this.addDrawingFileFakeInput.nativeElement.click()
    }

    getDrawings(data: any = { drawing_ids: [], drawing_relative_paths: [] }, isCSV = false) {
        const {
            drawingsFormControl,
            selectedFolderFormControl,
            activationFormControl,
            isNotExistOnHardiskControl,
        } = this.detailViewFilterFormGroup.getRawValue()
        return this.manageDrawingService.getDrawings(data).subscribe({
            next: (next: any) => {
                const {
                    data: { returnedData },
                } = next

                if (isCSV) {
                    this.dataCSV = returnedData

                    this.createTableCSV(returnedData)
                    this.getDirectory()

                    return
                }

                this.data = returnedData
                // this.currentData = returnedData

                this.currentData = this.handlerDetailViewFilterFormGroup(
                    drawingsFormControl,
                    selectedFolderFormControl,
                    activationFormControl,
                    isNotExistOnHardiskControl,
                    returnedData
                )
                this.createPages()
                this.changePage(0)
            },
            error: () => { },
            complete: () => { },
        })
    }

    createPages() {
        this.pages = Math.ceil(this.currentData.length / this.rowsEachPage)
        this.currentPage = 1
        // const end = Math.ceil(this.currentData.length / this.rowsEachPage)
        // for (let i = 1; i <= end; i += 1) {
        //     this.pages.push(i)
        // }
    }

    createTable(data) {
        this.allColumns = [...this.leftFakeColumns, ...this.middleFakeColumns, ...this.rightFakeColumns]
        const {
            drawingsFormControl,
            selectedFolderFormControl,
            activationFormControl,
            isNotExistOnHardiskControl,
        } = this.detailViewFilterFormGroup.getRawValue()
        const newData = this.convertDataToDisplayableData(
            this.handlerDetailViewFilterFormGroup(drawingsFormControl, selectedFolderFormControl, activationFormControl, isNotExistOnHardiskControl, data)
        )
        this.show = true
        this.applyNewData(newData)
    }

    createTableCSV(data) {
        this.allColumns = [...this.leftFakeColumns, ...this.middleFakeColumns, ...this.rightFakeColumns]
        this.dataCSV = this.convertDataToDisplayableData(data)
        this.applyNewDataCSV(this.dataCSV)
        this.showCSV = true
    }

    resetTable() {
        this.allColumns = []
        this.applyNewDataCSV([])
    }

    /** View Type = true */
    createDrawingRealMiddleColumns(flagColumnName) {
        return createDrawingMiddleRealColumns(flagColumnName)
    }

    createDrawingLeftRealColumns(flagColumnName) {
        return createDrawingLeftRealColumns(flagColumnName)
    }

    createDrawingRightRealColumns(flagColumnName) {
        return createDrawingRightRealColumns(flagColumnName)
    }

    convertDataToDisplayableData(data) {
        let no = 0
        return data.map((e) => {
            no += 1

            return {
                data: {
                    no,
                    ...e,
                },
            }
        })
    }

    applyNewData(data) {
        this.dataSource = this.dataSourceBuilder.create(data)
    }

    applyNewDataCSV(data) {
        this.dataSourceCSV = this.dataSourceBuilder.create(data)
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

    getDirectory() {
        const source = {
            type: 'qc',
            arrRelativePath: this.arrRelativePath,
        }

        return this.manageDrawingService.getDirectory(source).subscribe({
            next: (next: any) => {
                const { files, directories, baseFiles, baseDirectories } = next
                this.folders = directories
                this.files = files

                this.baseFiles = baseFiles
                this.baseFolders = baseDirectories

                this.searchDrawing()
                this.checkAsyncDrawings()
            },
            error: () => { },
            complete: () => { },
        })
    }

    syncDrawings(data) {
        return this.manageDrawingService.syncDrawings(data).subscribe({
            next: () => {
                this.getDrawings()
            },
            error: () => {
                this.sharedService.showMessage({
                    title: 'Error',
                    content: {
                        value: 'qc_manage_drawings.sync_drawing.alert_fail',
                    },
                    status: 'danger',
                })
            },
        })
    }

    checkAsyncDrawings() {
        const data = {
            drawing_relative_path: this.arrRelativePath.join('/'),
            drawing_file_names: this.files,
        }

        return this.manageDrawingService.checkAsyncDrawings(data).subscribe({
            next: (next: any) => {
                const {
                    data: { needSyncDrawings, needSyncFolder },
                } = next

                this.syncDrawings({ needSyncDrawings, needSyncFolder })
            },
        })
    }

    searchDrawing() {
        const { drawingsFormControl } = this.folderViewFilterFormGroup.getRawValue()

        if (drawingsFormControl) {
            const drawingsFormControlLower = drawingsFormControl.toString().toLocaleLowerCase()
            this.folders = this.folders.filter((e) => {
                return e
                    .toString()
                    .toLocaleLowerCase()
                    .includes(drawingsFormControlLower)
            })

            this.files = this.files.filter((e) => {
                return e
                    .toString()
                    .toLocaleLowerCase()
                    .relativePath.includes(drawingsFormControlLower)
            })
        }
    }

    selectFolder(folder: any) {
        this.selectedFolder = folder
        this.arrRelativePath.push(folder)
        this.getDirectory()
    }

    goBack() {
        this.arrRelativePath.pop()
        this.selectedFolder = this.arrRelativePath[0] || 'root'
        this.getDirectory()
    }

    openFile(file) {
        let path = ``
        this.arrRelativePath.forEach((element) => {
            path += `${element}/`
        })
        path += file.relativePath ? file.relativePath : file
        window.open(this.settingsService.openFile(`get-qc-file/${encodeURIComponent(path)}`))
    }

    editCustomer() {
        this.isEditCustomer = true
    }

    addDrawingFolder() {
        const data = {
            folderName: '',
        }

        return this.manageDrawingService.addDrawingFolder(data).subscribe({
            next: () => {
                this.getDirectory()
                this.sharedService.showMessage({
                    type: 'create',
                    title: 1,
                    object: 'object.drawing_folder',
                })
            },
            error: () => {
                this.sharedService.showMessage({
                    type: 'create',
                    title: 0,
                    object: 'object.drawing_folder',
                })
            },
            complete: () => { },
        })
    }

    renameDrawingFolder() {
        this.isEditCustomer = false
        const customerNameElement: any = document.getElementById('customerName')
        const newFolderName = customerNameElement.value
        const oldFolderName = this.arrRelativePath[this.arrRelativePath.length - 1]

        if (newFolderName === oldFolderName) {
            return
        }

        const data = {
            oldFolderName,
            newFolderName,
        }

        return this.manageDrawingService.renameDrawingFolder(data).subscribe({
            next: () => {
                this.arrRelativePath[this.arrRelativePath.length - 1] = newFolderName
                this.getDirectory()
                this.sharedService.showMessage({
                    content: {
                        value: 'response_text.manage_drawings.file_explorer.rename_drawing_folder',
                        params: {
                            param1: oldFolderName,
                            param2: newFolderName,
                        },
                    },
                    title: 1,
                })
            },
            error: () => {
                this.sharedService.showMessage({
                    content: {
                        value: 'response_text.manage_drawings.file_explorer.rename_drawing_folder_fail',
                        params: {
                            param1: oldFolderName,
                            param2: newFolderName,
                        },
                    },
                    title: 0,
                })
            },
            complete: () => { },
        })
    }

    addDrawing() {
        const { selectedFolderFormControl } = this.detailViewFilterFormGroup.getRawValue()
        if (!selectedFolderFormControl) {
            return this.sharedService.showMessage({
                content: {
                    value: 'response_text.manage_drawings.drawing_list.no_selected_drawing_folder',
                },
                title: 0,
            })
        }

        this.nbDialogService
            .open(DrawingDetailComponent, { context: { data: { drawing_relative_path: selectedFolderFormControl }, type: 'create' } })
            .onClose.subscribe(() => {
                this.reloadDetailView()
            })
    }

    openDrawing(drawingFile) {
        this.nbDialogService.open(DrawingDetailComponent, { context: { data: drawingFile, type: 'edit' } }).onClose.subscribe(() => {
            const drawing_ids = this.dataCSV.map((e) => e.data.drawing_id)
            const newData = { drawing_ids }
            if (drawing_ids.length !== 0) {
                this.getDrawings(newData, true)
            } else {
                this.reloadDetailView()
            }
        })
    }

    handleAddDrawingFileInput(file) {
        const fileName = file[0].name
        this.fileToUpload = file[0]

        const formData = new FormData()
        formData.append('file', this.fileToUpload, fileName)
        const relativePath = this.arrRelativePath.join('/')
        const dataTest = {
            fileName,
            relativePath,
            bkFolderName: 'garbage',
        }
        formData.append('data', JSON.stringify(dataTest))

        this.manageDrawingService.uploadDrawing(formData).subscribe({
            next: () => {
                this.sharedService.showMessage({
                    content: {
                        value: 'response_text.common.upload_success',
                        params: {
                            param1: fileName,
                        },
                    },
                    title: 1,
                })

                this.getDirectory()
            },
            error: () => { },
            complete: () => { },
        })
    }

    addFolder() { }

    showUpdatingDrawingToCSV(updating = []) {
        updating.forEach((e) => {
            this.sharedService.showMessage({
                content: {
                    value: 'response_text.manage_drawings.update_csv.show_updating',
                    params: {
                        param1: e.drawing_file_name,
                    },
                },
                title: 1,
            })
        })
    }

    showMissingDrawingToCSV(missing = []) {
        missing.forEach((e) => {
            this.sharedService.showMessage({
                content: {
                    value: 'response_text.manage_drawings.update_csv.show_missing',
                    params: {
                        param1: e,
                    },
                },
                title: 0,
            })
        })
    }

    showErrorDrawingToCSV(error = []) {
        error.forEach((e) => {
            this.sharedService.showMessage({
                content: {
                    value: 'response_text.manage_drawings.update_csv.show_error',
                    params: {
                        param1: e,
                    },
                },
                title: 0,
            })
        })
    }

    showHistoryFailToCSV(historyFails = []) {
        historyFails.forEach((e) => {
            this.sharedService.showMessage({
                content: {
                    value: 'response_text.manage_drawings.update_csv.show_history_fail',
                    params: {
                        param1: e,
                    },
                },
                title: 0,
            })
        })
    }

    /** Xử lý khi người dùng thả file CSV */
    droppedCSV(files: NgxFileDropEntry[]) {
        for (const droppedFile of files) {
            /** Is it a file ? */
            if (droppedFile.fileEntry.isFile) {
                const fileEntry = droppedFile.fileEntry as FileSystemFileEntry
                fileEntry.file((file: File) => {
                    const extensions = file.name.split('.')
                    const extension = extensions[extensions.length - 1]
                    if (extension !== 'csv') {
                        this.sharedService.showMessage({
                            title: 'Error',
                            content: {
                                value: 'qc_manage_drawings.drop_csv.wrong_extension',
                            },
                            status: 'danger',
                        })

                        return
                    }
                    /** Here you can access the real file */
                    const formData = new FormData()
                    formData.append('file', file, droppedFile.relativePath)
                    this.isLoadingSomething = true
                    this.manageDrawingService.searchDrawingByCSV(formData).subscribe({
                        next: (next: any) => {
                            this.sharedService.showMessage({
                                content: {
                                    value: 'qc_manage_drawings.drop_csv.read_csv_success',
                                },
                                status: 'success',
                                title: 'Success',
                            })

                            const {
                                data: { updating, creating, error, historyFails },
                            } = next

                            if (updating && creating) {
                                const newData = {
                                    drawing_ids: updating.concat(creating).map((e) => e.drawing_id),
                                }

                                /** Hiển thị lên màn hình thông tin chi tiết của các drawing đã được cập nhật */
                                this.getDrawings(newData, true)
                            }

                            /* Thông báo những drawing nào đã được cập nhật,
                             * những drawing nào bị thiếu trong database,
                             * những drawing nào bị lỗi khi cập nhật,
                             * những drawing nào không ghi lại được lịch sử
                             * (không ghi lại được lịch sử cũng đồng nghĩa là không cập nhật) */

                            if (updating) {
                                this.showUpdatingDrawingToCSV(updating)
                            }

                            if (error) {
                                this.showErrorDrawingToCSV(error)
                            }

                            if (historyFails) {
                                this.showHistoryFailToCSV(historyFails)
                            }

                            this.isLoadingSomething = false
                        },
                        error: () => {
                            this.isLoadingSomething = false

                            this.resetTable()

                            this.sharedService.showMessage({
                                title: 'Error',
                                content: {
                                    value: 'qc_manage_drawings.drop_csv.can_not_read_csv',
                                },
                                status: 'danger',
                            })
                        },
                        complete: () => {
                            this.isLoadingSomething = false
                        },
                    })
                })
            } else {
            }
        }
    }

    fileOverCSV() { }

    fileLeaveCSV() { }

    /** Hop lai */
    createFormData(droppedFile: NgxFileDropEntry) {
        return new Promise((resolve, reject) => {
            try {
                const fileEntry = droppedFile.fileEntry as FileSystemFileEntry
                fileEntry.file((file: File) => {
                    /** Here you can access the real file */
                    const formData = new FormData()
                    formData.append('file', file, droppedFile.relativePath)
                    const relativePath = this.arrRelativePath.join('/')
                    const dataTest = {
                        fileName: file.name,
                        relativePath,
                        bkFolderName: 'garbage',
                    }
                    formData.append('data', JSON.stringify(dataTest))
                    resolve(formData)
                })
            } catch (error) {
                reject(error)
            }
        })
    }

    /** Xử lý khi người dùng kéo thả files bỏ vào trong màn hình File Explorer */
    async droppedDrawings(files: NgxFileDropEntry[]) {
        /** Không cho kéo thả khi chưa chọn Customer (Folder) nào */
        if (this.arrRelativePath.length === 0) {
            this.sharedService.showMessage({
                content: {
                    value: 'response_text.manage_drawings.file_explorer.no_customer',
                },
                title: 0,
            })

            return
        }

        /** Tạo dữ liệu upload cho từng file */
        const task1 = []
        for (const droppedFile of files) {
            const {
                fileEntry: { name },
            } = droppedFile
            const extensions = name.split('.')
            const extension = extensions[extensions.length - 1]
            /** Là file thì tạo dữ liệu */
            if (droppedFile.fileEntry.isFile) {
                if (extension === 'pdf') {
                    task1.push(this.createFormData(droppedFile))
                } else {
                    this.sharedService.showMessage({
                        title: 'Error',
                        content: {
                            value: 'qc_manage_drawings.drop_drawings.alert_extension_fail',
                        },
                        status: 'danger',
                    })
                }
            } else {
                /** Không phải file thì làm sao ? */
            }
        }

        const result1 = await Promise.all(task1.map((e) => e.catch((error) => console.log(error))))

        const task2 = []

        result1.forEach((e) => {
            task2.push(this.manageDrawingService.uploadDrawing(e))
        })

        if (task2.length !== 0) {
            this.isLoadingSomething = true

            forkJoin(task2).subscribe({
                next: (next: any) => {
                    next.forEach((e) => {
                        const {
                            data: { returnedData },
                        } = e

                        this.sharedService.showMessage({
                            content: {
                                value: 'response_text.common.upload_success',
                                params: {
                                    param1: returnedData,
                                },
                            },
                            title: 1,
                        })

                        // this.sharedService.showMessage({
                        //     content: `${returnedData} has been uploaded successfully !`,
                        //     title: 'Successfully',
                        //     status: 'primary',
                        // })
                    })

                    this.getDirectory()

                    this.isLoadingSomething = false
                },
                error: () => {
                    this.isLoadingSomething = false
                },
                complete: () => { },
            })
        }
    }

    fileOverDrawings() { }

    fileLeaveDrawings() { }

    dateTimeInString(date) {
        return dateTimeInString(date)
    }

    openFileAtDrawingList(file) {
        let path = ``
        if (!file && !file.drawing_file_name) {
            return
        }
        if (file && !file.drawing_is_exist_on_hardisk) {
            this.sharedService.showMessage({
                content: {
                    value: 'qc_manage_drawings.drop_drawings.alert_not_exists_drawing',
                },
                title: 'Alert',
                status: 'warning',
            })
            return
        }
        path += `${file.drawing_relative_path}/${file.drawing_file_name}.pdf`
        window.open(this.settingsService.openFile(`get-qc-file/${encodeURIComponent(path)}`))
    }

    deleteFile(file) {
        this.nbDialogService.open(ConfirmationComponent, {
            context: {
                data: {
                    contentType: 3,
                    onYes: (() => {
                        const data = {
                            folderName: this.arrRelativePath[this.arrRelativePath.length - 1],
                            fileName: file,
                        }

                        this.manageDrawingService.deleteDrawingFile(data).subscribe({
                            next: (next) => {
                                this.sharedService.showMessage({
                                    title: 'Success',
                                    content: {
                                        value: 'response_text.manage_drawings.file_explorer.delete_drawing_file_success',
                                        params: {
                                            param1: data.fileName,
                                        },
                                    },
                                    status: 'success',
                                })
                            },
                            error: (error) => {
                                this.sharedService.showMessage({
                                    title: 'Success',
                                    content: {
                                        value: 'response_text.manage_drawings.file_explorer.delete_drawing_file_error',
                                        params: {
                                            param1: data.fileName,
                                        },
                                    },
                                    status: 'danger',
                                })
                            },
                            complete: () => {
                                this.reloadDetailView()
                            },
                        })
                    }).bind(this),
                },
            },
        })
    }

    deleteFolder(folder) { }

    changePage(page) {
        const newPage = page !== 0 ? this.currentPage + page : 1

        if (newPage <= 0 || (newPage > this.pages && this.pages !== 0)) {
            return
        }
        this.currentPage = newPage
        const startIndex = (newPage - 1) * this.rowsEachPage
        const endIndex = newPage * this.rowsEachPage - 1

        const newData = this.currentData.slice(startIndex, endIndex + 1)

        this.createTable(newData)

        this.currentShowing = `${startIndex + 1} - ${startIndex + newData.length} of ${this.currentData.length}`
    }
}
