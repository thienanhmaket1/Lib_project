import { ConfirmationComponent } from './../confirmation/confirmation.component'
import { dateTimeInString, isValidExtension } from './../../../common/functions'
import { qc } from './../../../common/constants'
import { ManageDrawingService } from './../../dashboard/qc/manage-drawing/manage-drawing.service'
import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core'
import { FormGroup, FormControl } from '@angular/forms'
import { AuthenticationService } from '@app/authentication/authentication.service'
import { NbDialogRef, NbDialogService } from '@nebular/theme'
import { createDrawingMiddleRealColumns, createDrawingLeftRealColumns, createDrawingRightRealColumns } from 'src/common/functions'
import { SharedService } from '@app/services/shared.service'
import { trigger, state, style, transition, animate } from '@angular/animations'
import { NgxFileDropEntry, FileSystemFileEntry } from 'ngx-file-drop'

@Component({
    selector: 'app-drawing-detail',
    templateUrl: './drawing-detail.component.html',
    styleUrls: ['./drawing-detail.component.scss'],
    animations: [
        trigger('openClose', [
            // ...
            state(
                'open',
                style({
                    display: 'flex',
                    // height: '100%',
                })
            ),
            state(
                'closed',
                style({
                    display: 'none',
                    // height: 0,
                })
            ),
            transition('open => closed', [animate('0s')]),
            transition('closed => open', [animate('0s')]),
        ]),
        trigger('openClose1', [
            // ...
            state(
                'open',
                style({
                    transform: 'rotate(180deg)',
                })
            ),
            state(
                'closed',
                style({
                    transform: 'rotate(0deg)',
                })
            ),
            transition('open => closed', [animate('0s')]),
            transition('closed => open', [animate('0s')]),
        ]),
    ],
})
export class DrawingDetailComponent implements OnInit {
    @Input() data: any
    @Input() type: any
    @ViewChild('fileFakeInput') fileFakeInput: ElementRef

    drawingFormGroup = new FormGroup({})

    fileToUpload: File = null
    rows
    drawing

    isViewing
    isEditing
    isCreating

    isEditable

    buttonUploadDrawingName

    disabledColumns = qc.drawing.disabledColumnsInDetail
    toggleColumns = qc.drawing.toggleColumnsInDetail
    fileColumns = qc.drawing.fileColumnsInDetail
    inputColumns = qc.drawing.inputColumnsInDetail
    dateTimeColumns = qc.drawing.dateTimeColumns
    hiddenColumns = ['drawing_is_exist_on_hardisk']
    historyStatus = 'hide'
    drawing_histories = []

    constructor(
        private authenticationService: AuthenticationService,
        private nbDialogRef: NbDialogRef<DrawingDetailComponent>,
        public sharedService: SharedService,
        private manageDrawingService: ManageDrawingService,
        private nbDialogService: NbDialogService
    ) {}

    ngOnInit(): void {
        const { user_permission_code } = this.authenticationService.getUserValue
        let drawing: any = {}
        if (this.type === 'create') {
            drawing = this.createDrawingSample(this.data)
        } else {
            drawing = {
                ...this.data,
            }
        }

        if (!this.data.drawing_is_exist_on_hardisk) {
            this.buttonUploadDrawingName = 'Browse ...'
        } else {
            this.buttonUploadDrawingName = `${drawing.drawing_file_name}.pdf` || 'Browse ...'
        }
        this.drawing = drawing

        qc.drawing.hiddenColumnsInDetailUpdate.forEach((e) => {
            delete this.drawing[e]
        })

        this.rows = Object.keys(this.drawing)
        this.rows.forEach((e) => {
            this.drawingFormGroup.addControl(e, new FormControl(this.drawing[e]))
        })

        this.isViewing = this.type === 'view' || this.type === 'edit'
        this.isEditable = this.type === 'edit' && (user_permission_code === '99' || user_permission_code === '19')
        this.isCreating = this.type === 'create'

        this.getDrawingHistory()
        console.log(this.data)
    }

    createRealColumns(flagColumnName: string) {
        return createDrawingLeftRealColumns(flagColumnName) || createDrawingMiddleRealColumns(flagColumnName) || createDrawingRightRealColumns(flagColumnName)
    }

    getDrawingHistory() {
        const { drawing_id } = this.data

        if (!drawing_id) {
            return
        }

        const data = {
            drawing_id,
        }
        return this.manageDrawingService.getDrawingHistory(data).subscribe({
            next: (next: any) => {
                const {
                    data: { returnedData },
                } = next

                this.drawing_histories = returnedData
            },
            error: () => {},
            complete: () => {},
        })
    }

    showHistory() {
        this.historyStatus = this.historyStatus === 'hide' ? 'show' : 'hide'
    }

    openAndDownloadDrawingFile(fileName) {
        if (fileName) {
            // const randomNumber = Math.floor(Math.random() * 100 + 1)
            // const relativePath = `${this.drawing.drawing_relative_path}/${fileName}`
            // const download = window.open(this.manageDrawingService.downloadDrawing(`download-qc-file/${encodeURIComponent(relativePath)}`), 'Download')

            // setTimeout(() => {
            //     const get = window.open(this.manageDrawingService.openDrawing(`get-qc-file/${encodeURIComponent(relativePath)}`), 'Get')
            // }, 250)
            if (!this.data.drawing_is_exist_on_hardisk) {
                return
            }
            const relativePath = `${this.drawing.drawing_relative_path}/${fileName}.pdf`
            window.open(this.manageDrawingService.openDrawing(`get-qc-file/${encodeURIComponent(relativePath)}`), 'Get')

            return
        }

        return this.sharedService.showMessage({
            content: {
                value: 'qc_manage_drawings.drawing_detail.alert_no_drawing_file',
            },
            title: 'Error',
            status: 'danger',
        })
    }

    editDrawing() {
        this.isViewing = false
        this.isEditing = true
        this.isCreating = false
        // this.buttonUploadDrawingName = this.data.file_file_name
    }

    handleFileFakeInput(event) {
        if (event.target.files.length > 0) {
            const file = event.target.files[0]
            if (isValidExtension(file.name, ['pdf'])) {
                if (file.name === `${this.data.drawing_file_name}.pdf`) {
                    this.fileToUpload = file
                    this.buttonUploadDrawingName = this.fileToUpload.name
                } else {
                    this.sharedService.showMessage({
                        title: 'Error',
                        content: {
                            value: 'qc_manage_drawings.drop_drawings.alert_wrong_file',
                        },
                        status: 'danger',
                    })
                }
            } else {
                this.sharedService.showMessage({
                    title: 'Error',
                    content: {
                        value: 'qc_manage_drawings.drop_drawings.alert_extension_fail',
                    },
                    status: 'danger',
                })
            }
        }
    }

    /** Can hop lai cho nay neu trung fileName, co search theo customer luon hay khong hay chi la search theo fileName */
    droppedDrawings(files: NgxFileDropEntry[]) {
        for (const droppedFile of files) {
            /** Is it a file ? */
            if (droppedFile.fileEntry.isFile) {
                const fileEntry = droppedFile.fileEntry as FileSystemFileEntry
                fileEntry.file((file: File) => {
                    if (isValidExtension(file.name, ['pdf'])) {
                        console.log(file.name)
                        console.log(this.data.drawing_file_name)
                        if (file.name === `${this.data.drawing_file_name}.pdf`) {
                            this.fileToUpload = file
                            this.buttonUploadDrawingName = this.fileToUpload.name
                        } else {
                            this.sharedService.showMessage({
                                title: 'Error',
                                content: {
                                    value: 'qc_manage_drawings.drop_drawings.alert_wrong_file',
                                },
                                status: 'danger',
                            })
                        }
                    } else {
                        this.sharedService.showMessage({
                            title: 'Error',
                            content: {
                                value: 'qc_manage_drawings.drop_drawings.alert_extension_fail',
                            },
                            status: 'danger',
                        })
                    }
                    /** Here you can access the real file */
                    // const formData = new FormData()
                    // formData.append('file', file, droppedFile.relativePath)
                    // this.isLoadingSomething = true
                    // this.manageDrawingService.searchDrawingByCSV(formData).subscribe({
                    //     next: (next: any) => {
                    //         const {
                    //             data: { updating, missing, error },
                    //         } = next
                    //         const newData = {
                    //             drawing_ids: updating.map((e) => e.drawing_id),
                    //         }
                    //         this.getDrawings(newData, true)
                    //         this.showUpdatingDrawingToCSV(updating)
                    //         this.showMissingDrawingToCSV(missing)
                    //         this.showErrorDrawingToCSV(error)
                    //     },
                    //     error: (error) => {
                    //         this.isLoadingSomething = false
                    //         this.resetTable()
                    //     },
                    //     complete: () => {
                    //         this.isLoadingSomething = false
                    //     },
                    // })
                })
            } else {
            }
        }
    }

    fileOverDrawings() {}

    fileLeaveDrawings() {}

    createDrawingSample(data) {
        const newData = {
            ...qc.drawing.defaultDrawing,
            ...data,
        }

        qc.drawing.hiddenColumnsInDetailCreate.forEach((e) => {
            delete newData[e]
        })

        return newData
    }

    saveDrawing() {
        const formData = new FormData()

        const newData = this.drawingFormGroup.getRawValue()
        const oldData = this.data
        const data = {
            ...oldData,
            ...newData,
        }

        formData.append('data', JSON.stringify(data))

        if (this.fileToUpload) {
            formData.append('file', this.fileToUpload)
        }

        this.manageDrawingService.updateDrawing(formData).subscribe(
            () => {
                this.nbDialogRef.close()

                this.sharedService.showMessage({
                    title: 1,
                    type: 'update',
                    object: 'object.drawing',
                })
            },
            () => {
                this.nbDialogRef.close()

                this.sharedService.showMessage({
                    title: 0,
                    type: 'update',
                    object: 'object.drawing',
                })
            }
        )
    }

    createDrawing() {
        const formData = new FormData()

        const newData = this.drawingFormGroup.getRawValue()
        const oldData = this.data
        const data = {
            ...oldData,
            ...newData,
        }
        formData.append('data', JSON.stringify(data))

        if (this.fileToUpload) {
            formData.append('file', this.fileToUpload)
        }

        this.manageDrawingService.createDrawing(formData).subscribe(
            () => {
                this.nbDialogRef.close()

                this.sharedService.showMessage({
                    title: 1,
                    type: 'create',
                    object: 'object.drawing',
                })
            },
            () => {
                this.nbDialogRef.close()

                this.sharedService.showMessage({
                    title: 0,
                    type: 'create',
                    object: 'object.drawing',
                })
            }
        )
    }

    deleteDrawing() {
        const { drawing_id, drawing_relative_path, drawing_file_name, drawing_is_deleted } = this.data
        const contentType = drawing_is_deleted ? 2 : -1

        const data = {
            drawing_id,
            drawing_relative_path,
            drawing_file_name,
            drawing_is_deleted,
        }

        this.nbDialogService.open(ConfirmationComponent, {
            context: {
                data: {
                    contentType,
                    onYes: (() => {
                        this.manageDrawingService.deleteDrawing(data).subscribe(
                            () => {
                                this.nbDialogRef.close()

                                this.sharedService.showMessage({
                                    title: 1,
                                    type: contentType === 2 ? 'undelete' : 'delete',
                                    object: 'object.drawing',
                                })
                            },
                            () => {
                                this.sharedService.showMessage({
                                    title: 0,
                                    type: contentType === 2 ? 'undelete' : 'delete',
                                    object: 'object.drawing',
                                })
                            }
                        )
                    }).bind(this),
                },
            },
        })
    }

    addDrawingFile() {
        this.fileFakeInput.nativeElement.click()
    }

    dateTimeInString(dateTime) {
        return dateTimeInString(dateTime)
    }

    closeDialog() {
        this.nbDialogRef.close()
    }
}
