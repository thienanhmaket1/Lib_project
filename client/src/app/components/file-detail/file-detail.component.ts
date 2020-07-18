import { defaultSetting } from './../../../common/constants'
import { Component, OnInit, AfterViewInit, Input, ViewChild, ElementRef, ViewChildren, QueryList } from '@angular/core'
import { FormGroup, FormBuilder, FormControl } from '@angular/forms'
import { AuthenticationService } from 'src/app/authentication/authentication.service'
import { NbDialogRef, NbToastrService, NbGlobalPhysicalPosition, NbDialogService } from '@nebular/theme'
import { environment } from 'src/environments/environment'
import { SettingsService } from '../../services/settings.service'
import { FileDetailService } from '../../services/file-detail.service'
import { ManageUserService } from 'src/app/services/manage-user.service'
import { createMiddleRealColumns, createLeftRealColumns, createRightRealColumns } from 'src/common/functions'
import { SharedService } from '@app/services/shared.service'
import { trigger, state, style, transition, animate } from '@angular/animations'
import { DropdownService } from '@app/services/dropdown.service'
import { NgxFileDropEntry, FileSystemFileEntry, FileSystemDirectoryEntry } from 'ngx-file-drop'
import { ConfirmationComponent } from '../confirmation/confirmation.component'
import { TranslateService } from '@ngx-translate/core'

@Component({
    selector: 'app-file-detail',
    templateUrl: './file-detail.component.html',
    styleUrls: ['./file-detail.component.scss'],
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
export class FileDetailComponent implements OnInit, AfterViewInit {
    @Input() data: any
    @Input() type: any
    @Input() folder: any
    @Input() dropdown: any
    @Input() isAuthorized: any
    @ViewChild('editFileFakeInput') editFileFakeInput: ElementRef
    // @ViewChildren('editFileFakeInput') editFileFakeInput: QueryList<ElementRef>
    files = []

    fileFormGroup = new FormGroup({})

    fileToUpload: File[] = []
    rows
    file

    isViewing
    isEditing
    isEditable
    isRestrictedEditable
    isCreating

    isReadOnly = false

    buttonUploadFileName = []
    selectedButtonUpload = ''

    editFileFormGroup = new FormGroup({})
    createFileFormGroup = new FormGroup({})

    settingsInfo: any
    fileURL: any
    pathFromFolderStructure: any
    userList: any
    hiddenColumn = ['no', 'file_id', 'file_created_by', 'file_created_at', 'file_updated_at']
    originalFile
    file_histories = []
    historyStatus = 'hide'

    constructor(
        private authenticationService: AuthenticationService,
        private nbDialogRef: NbDialogRef<FileDetailComponent>,
        private settingsService: SettingsService,
        private fileDetailService: FileDetailService,
        private formBuilder: FormBuilder,
        private toastService: NbToastrService,
        private manageUserService: ManageUserService,
        private dialogService: NbDialogService,
        public sharedService: SharedService,
        private dropdownService: DropdownService,
        private translateService: TranslateService
    ) {}

    ngOnInit(): void {
        const { user_permission_code } = this.authenticationService.getUserValue
        let file = {}
        this.getUserList()
        // this.getFilesByFolderID()
        if (this.type === 'create') {
            // const fileSample = this.createFileSample(this.data)
            // fileSample.file_properties.forEach((e) => {
            //     file[`column_*_${e.property_name}`] = e.property_value
            // })
            file = this.createFileSample(this.data)
        } else {
            file = {
                ...this.data,
            }
        }

        this.file = file
        console.log(this.file)
        console.log(this.folder)

        if (!this.file.file_updated_at) {
            delete this.file.file_updated_at
        }
        if (!this.file.file_updated_by) {
            delete this.file.file_updated_by
        }
        if (!this.file.file_updated_count) {
            this.file.file_updated_count = 0
        }

        for (const element of this.file.file_file_name) {
            this.fileFormGroup.addControl(`file_title_${element.id}`, new FormControl(element.file_title))
        }
        // for (let index = 0; index < this.file.file_file_name.length; index += 1) {
        //     const element = this.file.file_file_name[index]
        //     this.fileFormGroup.addControl(`file_title_${element.id}`, new FormControl(element.file_title))
        // }
        // this.file
        this.rows = Object.keys(this.file)

        this.rows.forEach((e) => {
            if (this.file[e]) {
                if (this.file[e].dropdown_id) {
                    this.fileFormGroup.addControl(
                        `${e}_dropdown_id_${this.file[e].dropdown_id}`,
                        new FormControl(this.file[e].property_value ? this.file[e].property_value : [])
                    )
                }
                this.fileFormGroup.addControl(`${e}_property_value`, new FormControl(this.file[e].property_value ? this.file[e].property_value : ''))
            }
            this.fileFormGroup.addControl(e, new FormControl(this.file[e]))
        })

        this.isViewing = this.type === 'view' || this.type === 'edit'
        this.isEditable = this.type === 'edit' && (user_permission_code === '99' || user_permission_code === '09')
        this.isRestrictedEditable = this.type === 'view' && this.isAuthorized
        this.isCreating = this.type === 'create'
        this.isReadOnly = this.isRestrictedEditable ? true : false
        this.settingsService.getOfficeAdminSettings().subscribe(
            (res) => {
                const data = res.data[0]

                this.settingsInfo = data || defaultSetting
            },
            (err) => {
                this.settingsInfo = defaultSetting
            }
        )
        this.createFileFormGroup = this.formBuilder.group({
            fileUpload: [''],
        })
        // this.pathFromFolderStructure = `${this.folder.folder_name}/${this.folder.folder_structure.level_1}/${this.folder.folder_structure.level_2}`
        this.pathFromFolderStructure = `${this.folder.folder_name}`
        this.getOriginalFile()
        this.getFileHistory()
    }

    ngAfterViewInit() {}

    createRealColumns(flagColumnName: string) {
        if (this.hiddenColumn.includes(flagColumnName)) {
            return
        }
        if (flagColumnName.includes('!@#$%^&*()')) {
            return createMiddleRealColumns(flagColumnName).split('!@#$%^&*()')[this.translateService.currentLang === 'en' ? 0 : 1]
        }

        return this.sharedService.translate(
            createLeftRealColumns(flagColumnName) || createMiddleRealColumns(flagColumnName) || createRightRealColumns(flagColumnName)
        )
    }

    getUserList() {
        this.manageUserService.getSpecificGroupUser('office').subscribe((res) => {
            this.userList = res.data
        })
    }

    openFileName(file_name) {
        if (!file_name.includes('Browse file') && file_name !== '') {
            const fileName = `${this.pathFromFolderStructure}/${file_name}`
            window.open(this.settingsService.openFile(`get-office-file/${encodeURIComponent(fileName)}`))
        }
    }

    uploadFileName(input) {
        this.selectedButtonUpload = input
        this.editFileFakeInput.nativeElement.click()
        // this.editFileFakeInput.forEach((input: ElementRef) => {
        //     input.nativeElement.click()
        // })
    }

    editFile() {
        this.isViewing = false
        this.isEditing = true
        this.isCreating = false
        // this.fileToUpload = this.data.file_file_name
    }

    handleFileInput(event) {
        if (event.target.files.length > 0) {
            const file = event.target.files[0]
            // this.fileToUpload = file
            this.fileToUpload.push(file)
            // this.buttonUploadFileName = this.fileToUpload.name
            this.file.file_file_name = this.file.file_file_name.map((e) => {
                if (e.id === this.selectedButtonUpload) {
                    return {
                        ...e,
                        file_name: file.name,
                    }
                }

                return e
            })
        }
    }

    getOriginalFile() {
        this.fileDetailService.getSpecificFileByUser(this.data.file_id).subscribe((res) => {
            this.originalFile = res.data
        })
    }

    // getFilesByFolderID() {
    //     this.fileDetailService.getFilesByFolderID(this.data.folder_id).subscribe((res) => {
    //         this.filesCount = res.files.length
    //     })
    // }

    async saveFile() {
        const { user_fullname, user_id } = this.authenticationService.getUserValue
        // const file_file_name = this.fileToUpload ? this.fileToUpload.name : this.data.file_file_name
        this.file.file_file_name.forEach((element) => {
            element.file_title = this.fileFormGroup.get(`file_title_${element.id}`).value
        })

        const fileChanged = []

        this.originalFile.file_file_name.forEach((element) => {
            const find = this.data.file_file_name.find((e) => e.id === element.id)
            if (find.file_name !== element.file_name) {
                fileChanged.push(element)
            }
        })

        const file_file_name = this.fileToUpload.length !== 0 ? this.file.file_file_name : this.data.file_file_name
        const newFile = {
            file_id: this.data.file_id,
            file_rule_id: this.fileFormGroup.get(`file_rule_id`).value,
            file_properties: [],
            file_updated_by: user_id,
            file_file_name,
            file_authorized_users: this.fileFormGroup.get('file_authorized_users').value || [],
            folder_id: this.folder.folder_id,
            file_changed: fileChanged,
        }

        const obj = Object.keys(this.fileFormGroup.getRawValue())

        this.rows.forEach((e) => {
            const propertyName = createMiddleRealColumns(e)
            if (propertyName) {
                const property_value = this.fileFormGroup.get(e).value
                const eachProperty = {
                    property_name: propertyName,
                    property_value: this.fileFormGroup.get(`${e}_property_value`).value,
                    property_data_type: property_value.property_data_type,
                    property_is_show_in_detail: property_value.property_is_show_in_detail,
                    max_width: property_value.max_width,
                    id: property_value.id,
                }
                if (typeof property_value === 'object') {
                    if (property_value.hasOwnProperty('dropdown_id')) {
                        const { dropdown_id } = property_value
                        obj.some((element) => {
                            if (element.includes(`_dropdown_id_${dropdown_id}`)) {
                                eachProperty[`dropdown_id`] = property_value.dropdown_id
                                eachProperty.property_value = this.fileFormGroup.get(element).value
                                return true
                            }
                        })
                    }
                }

                newFile.file_properties.push(eachProperty)
            }
        })
        // this.rows.forEach((e) => {
        //     const propertyName = createMiddleRealColumns(e)
        //     if (propertyName) {
        //         const eachProperty = {
        //             property_name: propertyName,
        //             property_value: this.fileFormGroup.get(e).value,
        //         }
        //         newFile.file_properties.push(eachProperty)
        //     }
        // })

        const formData = new FormData()
        const tempPath = `${this.settingsInfo.office_path_value}/${this.pathFromFolderStructure}`
        // formData.append('file', this.createFileFormGroup.get('fileUpload').value)
        this.fileToUpload.forEach((element) => {
            const find = this.file.file_file_name.find((e) => e.file_name === element.name)
            if (find) {
                formData.append('file', element)
            }
        })
        const dataTest = {
            fileNames: fileChanged,
            tempPath,
            bkFolderName: fileChanged.length === 0 ? 'backup' : 'garbage',
        }

        const obsv1 = await this.fileDetailService
            .updateFile(newFile, this.isAuthorized)
            .toPromise()
            .catch((err) => err)
        if (obsv1.code === 0) {
            // if (this.fileToUpload === null || this.fileToUpload.name === this.data.file_file_name) {
            if (this.fileToUpload.length === 0) {
                // || fileChanged === []
                this.sharedService.showMessage({
                    type: 'update',
                    title: 1,
                    object: 'object.file',
                })

                this.nbDialogRef.close({ data: newFile })
            } else {
                const obsv2 = await this.fileDetailService
                    .updateTempPath(dataTest, this.isAuthorized)
                    .toPromise()
                    .catch((err) => err)
                const obsv3 = await this.fileDetailService
                    .copyFile(formData, this.isAuthorized)
                    .toPromise()
                    .catch((err) => err)
                if (obsv2.code === 0) {
                    if (obsv3.code === 0) {
                        this.sharedService.showMessage({
                            type: 'update',
                            title: 1,
                            object: 'object.file',
                        })
                        // newFile.file_created_by = `${user_firstname} ${user_lastname}`
                        this.nbDialogRef.close({ data: newFile })
                    } else {
                        this.sharedService.showMessage({
                            type: 'update',
                            title: 0,
                            object: 'object.file',
                        })
                        await this.fileDetailService.reverseCreatedFile(newFile.file_id).toPromise()
                    }
                }
            }
        } else if (obsv1.error.code === 3) {
            obsv1.error.data.forEach((element) => {
                this.sharedService.showMessage({
                    content: {
                        value: 'response_text.manage_files.file_name_exist',
                        params: {
                            param1: element,
                        },
                    },
                    title: 0,
                })
            })
        } else {
            this.sharedService.showMessage({
                type: 'update',
                title: 0,
                object: 'object.file',
            })
        }
    }

    async createFile() {
        const { user_fullname, user_id } = this.authenticationService.getUserValue

        this.file.file_file_name.forEach((element) => {
            element.file_title = this.fileFormGroup.get(`file_title_${element.id}`).value
        })
        const file_file_name = this.fileToUpload ? this.file.file_file_name : []
        const newFile = {
            file_rule_id: this.fileFormGroup.get(`file_rule_id`).value,
            file_created_by: user_id,
            folder_id: this.data.folder_id,
            file_properties: [],
            file_file_name,
            // file_file_name: this.fileToUpload ? this.fileToUpload.name : '',
            file_authorized_users: [],
        }
        const obj = Object.keys(this.fileFormGroup.getRawValue())

        this.rows.forEach((e) => {
            const propertyName = createMiddleRealColumns(e)
            if (propertyName) {
                const property_value = this.fileFormGroup.get(e).value
                const eachProperty = {
                    property_name: propertyName,
                    property_value: this.fileFormGroup.get(`${e}_property_value`).value,
                    property_data_type: property_value.property_data_type,
                    property_is_show_in_detail: property_value.property_is_show_in_detail,
                    max_width: property_value.max_width,
                    id: property_value.id,
                }
                if (typeof property_value === 'object') {
                    if (property_value.hasOwnProperty('dropdown_id')) {
                        const { dropdown_id } = property_value
                        obj.some((element) => {
                            if (element.includes(`_dropdown_id_${dropdown_id}`)) {
                                eachProperty[`dropdown_id`] = property_value.dropdown_id
                                eachProperty.property_value = this.fileFormGroup.get(element).value
                                return true
                            }
                        })
                    }
                }

                newFile.file_properties.push(eachProperty)
            }
        })
        const formData = new FormData()
        const tempPath = `${this.settingsInfo.office_path_value}/${this.pathFromFolderStructure}`
        this.fileToUpload.forEach((element) => {
            const find = this.file.file_file_name.find((e) => e.file_name === element.name)
            if (find) {
                formData.append('file', element)
            }
        })

        const dataTest = {
            fileNames: this.file.file_file_name,
            tempPath,
            bkFolderName: 'backup',
        }

        const obsv1 = await this.fileDetailService
            .createFile(newFile)
            .toPromise()
            .catch((err) => err)

        if (obsv1.code === 0) {
            const obsv2 = await this.fileDetailService
                .updateTempPath(dataTest)
                .toPromise()
                .catch((err) => err)
            const obsv3 = await this.fileDetailService
                .copyFile(formData)
                .toPromise()
                .catch((err) => err)
            if (obsv2.code === 0) {
                if (obsv3.code === 0) {
                    this.sharedService.showMessage({
                        type: 'create',
                        title: 1,
                        object: 'object.file',
                    })
                    // newFile.file_created_by = `${user_firstname} ${user_lastname}`
                    this.nbDialogRef.close({ data: newFile })
                } else {
                    this.sharedService.showMessage({
                        type: 'create',
                        title: 0,
                        object: 'object.file',
                    })

                    await this.fileDetailService.reverseCreatedFile(obsv1.data.file_id).toPromise()
                }
            }
        } else if (obsv1.error.code === 3) {
            obsv1.error.data.forEach((element) => {
                this.sharedService.showMessage({
                    content: {
                        value: 'response_text.manage_files.file_name_exist',
                        params: {
                            param1: element,
                        },
                    },
                    title: 0,
                })
            })
        } else {
            this.sharedService.showMessage({
                type: 'create',
                title: 0,
                object: 'object.file',
            })
        }
    }

    deleteFile() {
        const tempPath = `${this.settingsInfo.office_path_value}/${this.pathFromFolderStructure}`
        const contentType = this.file.file_is_deleted ? 2 : -1
        const dataTest = {
            fileNames: this.file.file_file_name,
            tempPath,
            bkFolderName: 'deleted',
        }
        const input = {
            file_id: this.file.file_id,
            status: this.file.file_is_deleted,
        }

        this.dialogService.open(ConfirmationComponent, {
            context: {
                data: {
                    contentType,
                    onYes: (() => {
                        this.fileDetailService.deleteFile(input).subscribe(
                            (res) => {
                                if (res.code === 0) {
                                    this.fileDetailService.updateTempPath(dataTest).subscribe((res2) => {
                                        if (res.code === 0) {
                                            this.sharedService.showMessage({
                                                type: contentType === 2 ? 'undelete' : 'delete',
                                                object: 'object.file',
                                                title: 1,
                                            })

                                            this.nbDialogRef.close()
                                        } else {
                                            this.sharedService.showMessage({
                                                type: contentType === 2 ? 'undelete' : 'delete',
                                                title: 0,
                                                object: 'object.file',
                                            })
                                        }
                                    })
                                } else {
                                    this.sharedService.showMessage({
                                        type: contentType === 2 ? 'undelete' : 'delete',
                                        title: 0,
                                        object: 'object.file',
                                    })
                                }
                            },
                            (err) => {
                                this.sharedService.showMessage({
                                    type: contentType === 2 ? 'undelete' : 'delete',
                                    title: 0,
                                    object: 'object.file',
                                })
                            }
                        )
                    }).bind(this),
                },
            },
        })
    }

    createFileSample(fromFolder) {
        const newFile = {}
        const last2DigitOfFullYear = new Date()
            .getFullYear()
            .toString()
            .substr(2, 2)
        const idNumber = (this.data.file_count < 10 ? '0' : '') + this.data.file_count
        const currentLang = this.translateService.currentLang
        newFile[`file_rule_id`] = `${this.folder.folder_short_name}${last2DigitOfFullYear}-0${idNumber}`
        fromFolder.folder_properties.forEach((e) => {
            const dropdown_id = e.property_data_type.split('dropdown_')[e.property_data_type.split('dropdown_').length - 1]
            newFile[`column_*_${e.property_name}`] = e.property_data_type.includes('dropdown')
                ? {
                      //   property_name: '',
                      property_value: '',
                      dropdown_id,
                      property_data_type: e.property_data_type,
                      property_is_show_in_detail: e.property_is_show_in_detail,
                      max_width: e.max_width,
                      id: e.id,
                  }
                : {
                      property_value: '',
                      property_data_type: e.property_data_type,
                      property_is_show_in_detail: e.property_is_show_in_detail,
                      max_width: e.max_width,
                      id: e.id,
                  }
        })
        newFile[`file_file_name`] = [
            {
                id: '1',
                file_title: '',
                file_name: '',
            },
            {
                id: '2',
                file_title: '',
                file_name: '',
            },
        ]

        return newFile
    }

    getFileHistory() {
        const { file_id } = this.data

        if (!file_id) {
            return
        }

        const data = {
            file_id,
        }
        return this.fileDetailService.getFileHistoriesByUser(data).subscribe({
            next: (next: any) => {
                const {
                    data: { returnedData },
                } = next

                this.file_histories = returnedData
            },
            error: () => {},
            complete: () => {},
        })
    }

    showHistory() {
        this.historyStatus = this.historyStatus === 'hide' ? 'show' : 'hide'
    }

    getDropdownDetailById(id) {
        const detail = this.dropdown.find((e) => e.drop_down_id === Number(id))
        if (detail) {
            return detail.drop_down_data
        }
        return []
    }
    /** Can hop lai cho nay neu trung fileName, co search theo customer luon hay khong hay chi la search theo fileName */
    droppedFile(files: NgxFileDropEntry[], id) {
        this.selectedButtonUpload = id
        for (const droppedFile of files) {
            /** Is it a file ? */
            if (droppedFile.fileEntry.isFile) {
                const fileEntry = droppedFile.fileEntry as FileSystemFileEntry
                fileEntry.file((file: File) => {
                    // console.log(file)
                    this.fileToUpload.push(file)
                    this.file.file_file_name = this.file.file_file_name.map((e) => {
                        if (e.id === this.selectedButtonUpload) {
                            return {
                                ...e,
                                file_name: file.name,
                            }
                        }

                        return e
                    })
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
                /** It was a directory (empty directories are added, otherwise only files) */
                const fileEntry = droppedFile.fileEntry as FileSystemDirectoryEntry
            }
        }
    }

    fileOver(event) {}

    fileLeave(event) {}

    checkCondition(row) {
        if (
            row !== 'file_file_name' &&
            row !== 'file_authorized_users' &&
            row !== 'file_is_deleted' &&
            this.file[row] &&
            !this.file[row].dropdown_id &&
            this.file[row] &&
            !this.file[row].property_data_type
        ) {
            return true
        }
        return false
    }

    displayRow(row) {
        if (this.hiddenColumn.includes(row)) {
            return false
        }
        if (row.includes('column_*_') && this.file[row]) {
            return this.file[row].property_is_show_in_detail
        }
        return true
    }
}
