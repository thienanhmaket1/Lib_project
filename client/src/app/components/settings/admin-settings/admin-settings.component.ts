import { Component, OnInit, ElementRef, ViewChild } from '@angular/core'
import { FormGroup, FormControl, Validators } from '@angular/forms'
import { SettingsService } from '../../../services/settings.service'
import { AuthenticationService } from 'src/app/authentication/authentication.service'
import { SharedService } from '@app/services/shared.service'
import { NgxFileDropEntry, FileSystemFileEntry, FileSystemDirectoryEntry } from 'ngx-file-drop'

@Component({
    selector: 'app-admin-settings',
    templateUrl: './admin-settings.component.html',
    styleUrls: ['./admin-settings.component.scss'],
})
export class AdminSettingsComponent implements OnInit {
    adminMessageFormGroup = new FormGroup({
        adminMessageTitleFormControl: new FormControl(``),
        adminMessageFormControl: new FormControl(``, { validators: Validators.required }),
    })
    rootFolderOfficeFormGroup = new FormGroup({
        rootFolderOfficeFormControl: new FormControl(`office/`),
    })
    rootFolderQCFormGroup = new FormGroup({
        rootFolderQCFormControl: new FormControl(`qc/2020/`),
    })
    adminCommonFormGroup = new FormGroup({
        adminCommonTitleFormControl: new FormControl(``),
    })
    group = 'admin'
    path_type = 'office'
    attachment: File = null
    webLogo: File = null
    manualAttachment: File = null
    @ViewChild('fileUploadInput') fileUploadInput: ElementRef
    @ViewChild('uploadLogo') uploadLogo: ElementRef
    @ViewChild('uploadManual') uploadManual: ElementRef
    logoImg: any
    btnUploadManual = ''
    btnUploadAttachment = ''

    constructor(private settingsService: SettingsService, private authenticationService: AuthenticationService, public sharedService: SharedService) {}

    ngOnInit(): void {
        this.logoImg = this.sharedService.getLogo('') || `../../../../assets/images/Nissin_Electric_company_logo.svg-1.png`
        this.adminCommonFormGroup.get('adminCommonTitleFormControl').patchValue(this.settingsService.logoTitle.value)
        this.settingsService.getOfficeAdminSettings().subscribe(
            (res) => {
                this.rootFolderOfficeFormGroup.get('rootFolderOfficeFormControl').setValue(res.data[0].office_path_value)
                this.rootFolderQCFormGroup.get('rootFolderQCFormControl').setValue(res.data[0].qc_path_value)
                this.adminCommonFormGroup.get('adminCommonTitleFormControl').setValue(res.data[0].logo_title)
            },
            () => {}
        )
    }

    checkSlashes(input) {
        /** Nếu người dùng nhập dấu '/' ngay đầu chuỗi, thì xóa đi */
        const firstCharIsSlash = input[0] === '/'
        let pathOfficeValue = firstCharIsSlash ? input.substring(1) : input
        /** Nếu người dùng nhập dấu '/' ngay cuối chuỗi, thì xóa đi */
        const lastCharIsSlash = input[input.length - 1] === '/'
        pathOfficeValue = lastCharIsSlash ? pathOfficeValue.substr(0, pathOfficeValue.length - 1) : pathOfficeValue
        return pathOfficeValue
    }

    savePath() {
        const { user_id } = this.authenticationService.getUserValue
        const { rootFolderOfficeFormControl } = this.rootFolderOfficeFormGroup.getRawValue()
        const { rootFolderQCFormControl } = this.rootFolderQCFormGroup.getRawValue()
        const officePath = this.checkSlashes(rootFolderOfficeFormControl)
        const qcPath = this.checkSlashes(rootFolderQCFormControl)

        // let array = pathValue.split('')
        // let i
        // let finalPathValue = ``
        // for (i = 0; i < array.length; i++) {
        //     if (array[i] == array[i + 1] && array[i] == "/") {
        //         i++
        //     }
        //     finalPathValue += array[i]
        // }
        const data = {
            user: user_id,
            // type: this.path_type,
            officePath,
            qcPath,
        }
        this.settingsService.savePath(data).subscribe((res) => {
            if (res.code === 0) {
                this.sharedService.showMessage({
                    title: 1,
                    type: 'update',
                    object: 'object.path',
                })
            }
            if (res.code !== 0) {
                this.sharedService.showMessage({
                    title: 0,
                    type: 'update',
                    object: 'object.path',
                })
            }
        })
    }

    saveMessage() {
        if (this.adminMessageFormGroup.invalid) {
            const config = {
                content: {
                    value: 'response_text.manage_folders.fields_required',
                },
                title: 0,
            }
            this.sharedService.showMessage(config)
            return
        }
        const { user_id } = this.authenticationService.getUserValue
        const { adminMessageFormControl, adminMessageTitleFormControl } = this.adminMessageFormGroup.getRawValue()
        const data = {
            message_user: user_id,
            message_title: adminMessageTitleFormControl,
            message_content: adminMessageFormControl,
            message_group: this.group,
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
            }
            if (res.code !== 0) {
                this.sharedService.showMessage({
                    title: 0,
                    type: 'create',
                    object: 'object.message',
                })
            }
            this.adminMessageFormGroup.get('adminMessageFormControl').setValue('')
            this.adminMessageFormGroup.get('adminMessageTitleFormControl').setValue('')
            this.attachment = null
            this.fileUploadInput.nativeElement.value = ''
            this.btnUploadAttachment = ''
        })
    }

    uploadFileAttachment() {
        this.fileUploadInput.nativeElement.click()
    }

    uploadFileManual() {
        this.uploadManual.nativeElement.click()
    }

    uploadImage() {
        this.uploadLogo.nativeElement.click()
    }

    handleAttachmentInput(event) {
        if (event.target.files.length > 0) {
            const file = event.target.files[0]
            this.attachment = file
            this.btnUploadAttachment = file.name
        }
    }

    handleLogoInput(event) {
        if (event.target.files.length > 0) {
            const file = event.target.files[0]
            this.webLogo = file
            const reader = new FileReader()
            reader.readAsDataURL(file)
            reader.onload = (_event) => {
                this.logoImg = reader.result
            }
        }
    }

    handleManualInput(event) {
        if (event.target.files.length > 0) {
            const file = event.target.files[0]
            this.manualAttachment = file
            this.btnUploadManual = file.name
        }
    }

    saveCommonSettings() {
        const { adminCommonTitleFormControl } = this.adminCommonFormGroup.getRawValue()
        const formData = new FormData()
        const data = {
            logo_title: adminCommonTitleFormControl,
        }
        this.settingsService.logoTitle.next(adminCommonTitleFormControl)
        formData.append('data', JSON.stringify(data))
        if (this.webLogo) {
            formData.append('file', this.webLogo)
        }
        if (this.manualAttachment) {
            formData.append('file', this.manualAttachment)
        }
        this.settingsService.saveCommonSettings(formData).subscribe(
            (res) => {
                if (res.code === 0) {
                    this.sharedService.showMessage({
                        content: {
                            value: 'response_text.common.saved',
                        },
                        title: 1,
                    })
                    this.settingsService.logoImg.next(res.file)
                    this.btnUploadManual = ''
                } else {
                    this.sharedService.showMessage({
                        content: {
                            value: 'response_text.common.unable_to_save_changes',
                        },
                        title: 0,
                    })
                }
            },
            () => {
                this.sharedService.showMessage({
                    content: {
                        value: 'response_text.common.unable_to_save_changes',
                    },
                    title: 0,
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
                    if (whichInput === 'uploadManual') {
                        this.manualAttachment = file
                        this.btnUploadManual = file.name
                    } else if (whichInput === 'fileUploadInput') {
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
