import { Component, OnInit, Input, ElementRef, ViewChild } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { SettingsService } from '@app/services/settings.service'
import { NbToastrService, NbDialogRef } from '@nebular/theme'
import { SharedService } from '@app/services/shared.service'
import { NgxFileDropEntry, FileSystemFileEntry } from 'ngx-file-drop'
import { saveAs } from 'file-saver'

@Component({
    selector: 'app-message-detail',
    templateUrl: './message-detail.component.html',
    styleUrls: ['./message-detail.component.scss'],
})
export class MessageDetailComponent implements OnInit {
    @Input() data: any
    @Input() status: any

    messageFormGroup = new FormGroup({
        // messageTitleFormControl: new FormControl(),
        // messageContentFormControl: new FormControl(),
        // messageGroupFormControl: new FormControl(),
    })
    canSwitchGroup = false
    attachment: File = null
    @ViewChild('fileUploadInput') fileUploadInput: ElementRef
    btnUploadAttachment = ''

    constructor(
        private settingsService: SettingsService,
        private toastService: NbToastrService,
        private nbDialogRef: NbDialogRef<MessageDetailComponent>,
        public sharedService: SharedService
    ) {}

    ngOnInit(): void {
        this.messageFormGroup.addControl('messageTitleFormControl', new FormControl(this.data.message_title, { validators: Validators.required }))
        this.messageFormGroup.addControl('messageContentFormControl', new FormControl(this.data.message_content, { validators: Validators.required }))
        // this.messageFormGroup.addControl(
        //     'messageGroupFormControl',
        //     new FormControl({ value: this.data.message_group, disabled: this.status === 'readonly' ? true : false })
        // )

        // this.messageFormGroup.get(`messageTitleFormControl`).patchValue(this.data.message_title)
        // this.messageFormGroup.get(`messageContentFormControl`).patchValue(this.data.message_content)
        // this.messageFormGroup.get(`messageGroupFormControl`).patchValue(this.data.message_group)
        this.data.user_permission_code === '99' ? (this.canSwitchGroup = true) : (this.canSwitchGroup = false)
        this.btnUploadAttachment = this.data.message_attachment_name ? this.data.message_attachment_name : ''
    }

    uploadFileAttachment() {
        this.fileUploadInput.nativeElement.click()
    }

    handleAttachmentInput(event) {
        if (event.target.files.length > 0) {
            const file = event.target.files[0]
            this.attachment = file
            this.btnUploadAttachment = file.name
        }
    }

    createMessage() {
        if (this.messageFormGroup.invalid) {
            const config = {
                content: {
                    value: 'response_text.manage_folders.fields_required',
                },
                title: 0,
            }
            this.sharedService.showMessage(config)
            return
        }
        const { messageTitleFormControl, messageContentFormControl } = this.messageFormGroup.getRawValue()
        const data = {
            message_title: messageTitleFormControl,
            message_content: messageContentFormControl,
            message_group: 'admin',
            message_attachment: this.attachment ? this.attachment.name : null,
        }

        const formData = new FormData()
        formData.append('data', JSON.stringify(data))
        if (this.attachment) {
            formData.append('file', this.attachment)
        }

        this.settingsService.saveMessage(formData).subscribe((res) => {
            if (res.code === 0) {
                this.sharedService.showMessage({
                    title: 1,
                    type: 'create',
                    object: 'object.message',
                })
                this.nbDialogRef.close({ code: 0 })
            }
            if (res.code !== 0) {
                this.sharedService.showMessage({
                    title: 0,
                    type: 'create',
                    object: 'object.message',
                })
            }
            // this.messageFormGroup.get('adminMessageFormControl').setValue('')
            // this.messageFormGroup.get('adminMessageTitleFormControl').setValue('')
            // this.attachment = null
            // this.fileUploadInput.nativeElement.value = ''
            // this.btnUploadAttachment = ''
        })
    }

    saveMessage() {
        if (this.messageFormGroup.invalid) {
            const config = {
                content: {
                    value: 'response_text.manage_folders.fields_required',
                },
                title: 0,
            }
            this.sharedService.showMessage(config)
            return
        }
        const data = {
            message_id: this.data.message_id,
            message_title: this.messageFormGroup.get(`messageTitleFormControl`).value,
            message_content: this.messageFormGroup.get(`messageContentFormControl`).value,
            message_group: this.data.message_group,
            message_attachment: this.attachment ? this.attachment.name : null,
            old_attachment: this.data.message_attachment_name,
        }
        // console.log(data)
        const formData = new FormData()
        formData.append('data', JSON.stringify(data))
        if (this.attachment) {
            formData.append('file', this.attachment)
        }

        this.settingsService.updateMessage(formData).subscribe(
            (res) => {
                if (res.code === 0) {
                    this.nbDialogRef.close({ code: 0 })
                    this.sharedService.showMessage({
                        title: 1,
                        type: 'update',
                        object: 'object.message',
                    })
                } else {
                    this.sharedService.showMessage({
                        title: 0,
                        type: 'update',
                        object: 'object.message',
                    })
                }
            },
            (err) => {
                this.sharedService.showMessage({
                    title: 0,
                    type: 'update',
                    object: 'object.message',
                })
            }
        )
    }

    /** Can hop lai cho nay neu trung fileName, co search theo customer luon hay khong hay chi la search theo fileName */
    droppedFile(files: NgxFileDropEntry[], whichInput) {
        for (const droppedFile of files) {
            /** Is it a file ? */
            if (droppedFile.fileEntry.isFile) {
                const fileEntry = droppedFile.fileEntry as FileSystemFileEntry
                fileEntry.file((file: File) => {
                    if (whichInput === 'fileUploadInput') {
                        this.attachment = file
                        this.btnUploadAttachment = file.name
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

    fileOver() {}

    fileLeave() {}

    downloadAttachment() {
        const data = {
            filename: this.data.message_attachment_name,
            group: this.data.message_group,
        }
        if (data.filename) {
            this.settingsService.downloadAttachment(data).subscribe(
                (res) => {
                    saveAs(res, this.data.message_attachment_name)
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
    }

    closeDialog() {
        this.nbDialogRef.close()
    }

    editFile() {
        this.status = 'edit'
        // this.fileToUpload = this.data.file_file_name
    }
}
