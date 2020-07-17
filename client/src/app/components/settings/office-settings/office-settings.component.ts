import { Component, OnInit, ViewChild, ElementRef } from '@angular/core'
import { FormGroup, FormControl, Validators } from '@angular/forms'
import { SettingsService } from '../../../services/settings.service'
import { AuthenticationService } from 'src/app/authentication/authentication.service'
import { SharedService } from '@app/services/shared.service'
import { NgxFileDropEntry, FileSystemFileEntry } from 'ngx-file-drop'

@Component({
    selector: 'app-office-settings',
    templateUrl: './office-settings.component.html',
    styleUrls: ['./office-settings.component.scss'],
})
export class OfficeSettingsComponent implements OnInit {
    officeMessageFormGroup = new FormGroup({
        officeMessageTitleFormControl: new FormControl(``),
        officeMessageFormControl: new FormControl(``, { validators: Validators.required }),
    })
    @ViewChild('fileUploadInput') fileUploadInput: ElementRef
    group = 'office'
    attachment: File = null
    btnUploadAttachment = ''
    constructor(private settingsService: SettingsService, private authenticationService: AuthenticationService, public sharedService: SharedService) {}

    ngOnInit(): void {}

    saveMessage() {
        if (this.officeMessageFormGroup.invalid) {
            const config = {
                content: {
                    value: 'response_text.manage_folders.fields_required',
                },
                title: 0,
            }
            this.sharedService.showMessage(config)
            return
        }
        const { officeMessageFormControl, officeMessageTitleFormControl } = this.officeMessageFormGroup.getRawValue()
        const data = {
            // user: user_id,
            title: officeMessageTitleFormControl,
            message: officeMessageFormControl,
            group: this.group,
            attachment: this.attachment ? this.attachment.name : null,
        }
        const formData = new FormData()
        formData.append('data', JSON.stringify(data))
        if (this.attachment) {
            formData.append('file', this.attachment)
        }

        this.settingsService.saveMessage(formData).subscribe((res) => {
            if (res.code === 0) {
                this.sharedService.showMessage({
                    type: 'create',
                    title: 1,
                    object: 'object.message',
                })
            }
            if (res.code !== 0) {
                this.sharedService.showMessage({
                    type: 'create',
                    title: 0,
                    object: 'object.message',
                })
            }
            this.officeMessageFormGroup.get('officeMessageTitleFormControl').setValue('')
            this.officeMessageFormGroup.get('officeMessageFormControl').setValue('')
            this.attachment = null
            this.fileUploadInput.nativeElement.value = ''
            this.btnUploadAttachment = ''
        })
    }

    uploadFileAttachment() {
        this.fileUploadInput.nativeElement.click()
    }

    handleFileInput(event) {
        if (event.target.files.length > 0) {
            const file = event.target.files[0]
            this.attachment = file
            this.btnUploadAttachment = file.name
        }
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
}
