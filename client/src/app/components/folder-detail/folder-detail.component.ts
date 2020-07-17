import { ConfirmationComponent } from './../confirmation/confirmation.component'
import { Component, OnInit, Input } from '@angular/core'
import { AuthenticationService } from 'src/app/authentication/authentication.service'
import { FormGroup, FormControl, Validators } from '@angular/forms'
import { ManageUserService } from 'src/app/services/manage-user.service'
import { FolderDetailService } from 'src/app/services/folder-detail.service'
import { NbGlobalPhysicalPosition, NbToastrService, NbDialogRef, NbDialogService } from '@nebular/theme'
import { convertStringBooleanToBoolean } from 'src/common/functions'
import { SharedService } from '@app/services/shared.service'
import { DropdownService } from '@app/services/dropdown.service'
import { TranslateService } from '@ngx-translate/core'

@Component({
    selector: 'app-folder-detail',
    templateUrl: './folder-detail.component.html',
    styleUrls: ['./folder-detail.component.scss'],
})
export class FolderDetailComponent implements OnInit {
    @Input() data: any
    @Input() type: any

    editFolderFormGroup = new FormGroup({})

    fakeFolderProperties = [
        'folder_name',
        'folder_short_name',
        'folder_document_no',
        'folder_is_show_updated_count',
        'folder_is_show_created_at',
        'folder_is_show_updated_at',
        'folder_authorized_users',
        'folder_is_deleted',
        'property_data_type',
        'property_is_show_in_list',
        'property_is_show_in_detail',
        'max_width',
    ]
    realFolderProperties = [
        // 'office_manage_folder.folder_detail.folder_no',
        'office_manage_folder.folder_detail.folder_name',
        'office_manage_folder.folder_detail.folder_short_name',
        'office_manage_folder.folder_detail.folder_document_no',
        // 'office_manage_folder.folder_detail.folder_created_by',
        'office_manage_folder.folder_detail.folder_is_show_updated_count',
        'office_manage_folder.folder_detail.folder_is_show_created_at',
        'office_manage_folder.folder_detail.folder_is_show_updated_at',
        'office_manage_folder.folder_detail.folder_authorized_users',
        'office_manage_folder.folder_detail.folder_is_deleted',
        // 'office_manage_folder.folder_detail.folder_created_at',
        'office_manage_folder.folder_detail.property_data_type',
        'office_manage_folder.folder_detail.property_is_show_in_list',
        'office_manage_folder.folder_detail.property_is_show_in_detail',
        'office_manage_folder.folder_detail.max_width',
    ]

    folder
    isEditing
    isViewing
    isEditable
    isCreating
    rows = []
    secondRows = []
    propertiesCount = -1
    userList: any
    isRestrictedEditable
    isReadOnly = false
    hiddenColumn = [
        'no',
        'folder_id',
        'folder_properties',
        'folder_created_by',
        'folder_created_at',
        'folder_updated_by',
        'folder_updated_at',
        'folder_group',
        'max',
        'folder_authorized_users',
        'folder_root_id',
        'higher_folder_name',
        'file_latest_update',
    ]

    booleanColumn = ['folder_is_show_updated_count', 'folder_is_show_created_at', 'folder_is_show_updated_at']
    listOfDropDown = []
    secondRowLength = 0

    constructor(
        private authenticationService: AuthenticationService,
        private manageUserService: ManageUserService,
        private folderService: FolderDetailService,
        private toastService: NbToastrService,
        private nbDialogRef: NbDialogRef<FolderDetailComponent>,
        private dialogService: NbDialogService,
        private sharedService: SharedService,
        private dropdownService: DropdownService,
        private translateService: TranslateService,
        private nbToastrService: NbToastrService
    ) {}

    ngOnInit(): void {
        this.getUserList()
        this.getDropDown()
        const { user_permission_code } = this.authenticationService.getUserValue
        this.folder = { ...this.data }
        delete this.folder.folder_group

        this.booleanColumn.forEach((element) => {
            if (this.folder[element]) {
                this.folder[element] = this.folder[element].toString()
            }
        })
        for (let index = 0; index < this.folder.max; index++) {
            delete this.folder[`property_name_${index + 1}`]
        }
        this.rows = Object.keys(this.folder)
        // let index = 1
        this.secondRows = this.data.folder_properties
        this.propertiesCount += this.secondRows.length
        this.createFormControls()

        this.isViewing = this.type === 'view' || this.type === 'edit'
        this.isEditable = this.type === 'edit' && (user_permission_code === '99' || user_permission_code === '09')
        this.isCreating = this.type === 'create'
        this.isReadOnly = this.isRestrictedEditable ? true : false
    }

    getUserList() {
        this.manageUserService.getSpecificGroupUser('office').subscribe((res) => {
            this.userList = res.data
        })
    }

    getDropDown() {
        this.dropdownService.getDropDownByUser().subscribe((res) => {
            this.listOfDropDown = res.data
        })
    }

    async saveFolder() {
        const { user_id } = this.authenticationService.getUserValue
        const editFolderInfo = this.editFolderFormGroup.getRawValue()
        const {
            folder_name,
            folder_short_name,
            folder_is_show_created_at,
            folder_is_show_updated_at,
            folder_is_show_updated_count,
            folder_document_no,
            folder_authorized_users,
            folder_root_id,
        } = editFolderInfo

        if (this.editFolderFormGroup.invalid) {
            const config = {
                content: {
                    value: 'response_text.manage_folders.fields_required',
                },
                title: 0,
            }
            this.sharedService.showMessage(config)
            return
        }
        const folder_properties = []

        let index = 0
        this.secondRows.forEach((e) => {
            const newE = {
                // property_name: `${editFolderInfo[`property_name_en_${index}`]}!@#$%^&*()${editFolderInfo[`property_name_jp_${index}`]}`,
                property_name: `${editFolderInfo[`property_name_${index}`]}`,
                property_data_type: editFolderInfo[`property_data_type_${index}`],
                property_is_show_in_list: editFolderInfo[`property_is_show_in_list_${index}`],
                property_is_show_in_detail: editFolderInfo[`property_is_show_in_detail_${index}`],
                max_width: editFolderInfo[`max_width_${index}`],
                id: editFolderInfo[`id_${index}`],
            }

            folder_properties.push(newE)

            index += 1
        })
        const folder = {
            folder_id: this.data.folder_id,
            folder_name: folder_name.trim(),
            folder_short_name: folder_short_name.trim(),
            folder_document_no: folder_document_no.trim(),
            folder_is_show_updated_count,
            folder_is_show_created_at,
            folder_is_show_updated_at,
            folder_properties,
            folder_updated_by: user_id,
            folder_authorized_users: folder_authorized_users || [],
            folder_root_id,
        }
        const obsvSaveFolder = await this.folderService
            .updateFolder(folder)
            .toPromise()
            .catch((err) => err)
        if (obsvSaveFolder.code === 0) {
            this.sharedService.showMessage({
                type: 'update',
                title: 1,
                object: 'object.folder',
            })

            this.nbDialogRef.close({ data: folder })
        } else if (obsvSaveFolder.detail) {
            // this.nbToastrService.show(obsvSaveFolder.detail, 'Error', {
            //     status: 'danger',
            // })
            this.sharedService.showMessage({
                type: 'update',
                title: 0,
                object: 'response_text.common.folder_already_exists',
            })
        } else {
            this.sharedService.showMessage({
                type: 'update',
                title: 0,
                object: 'object.folder',
            })
        }
    }

    editFolder() {
        this.isViewing = false
        this.isEditing = true
        this.isCreating = false
    }

    toNumber(numericString) {
        return Number(numericString)
    }

    async createFolder() {
        const { user_id } = this.authenticationService.getUserValue
        const editFolderInfo = this.editFolderFormGroup.getRawValue()
        const {
            folder_name,
            folder_short_name,
            folder_is_show_created_at,
            folder_is_show_updated_at,
            folder_is_show_updated_count,
            folder_document_no,
            folder_authorized_users,
            folder_root_id,
        } = editFolderInfo

        this.editFolderFormGroup.get('folder_name').patchValue(folder_name.trim())
        this.editFolderFormGroup.get('folder_short_name').patchValue(folder_short_name.trim())
        this.editFolderFormGroup.get('folder_document_no').patchValue(folder_document_no.trim())

        // let index = 0
        const folder_properties = []

        this.secondRows.forEach((e) => {
            const index = e.id - 1

            if (this.editFolderFormGroup.get(`property_name_${index}`)) {
                this.editFolderFormGroup.get(`property_name_${index}`).patchValue(`${editFolderInfo[`property_name_${index}`]}`.trim())
            }
            const newE = {
                // property_name: `${editFolderInfo[`property_name_en_${index}`]}!@#$%^&*()${editFolderInfo[`property_name_jp_${index}`]}`,
                property_name: `${editFolderInfo[`property_name_${index}`]}`.trim(),
                property_data_type: editFolderInfo[`property_data_type_${index}`],
                property_is_show_in_list: editFolderInfo[`property_is_show_in_list_${index}`],
                property_is_show_in_detail: editFolderInfo[`property_is_show_in_detail_${index}`],
                max_width: editFolderInfo[`max_width_${index}`],
                id: editFolderInfo[`id_${index}`],
            }

            folder_properties.push(newE)

            // index += 1
        })
        // this.secondRows.forEach((e) => {
        //     const index = this.getPosition(e)
        //     e.property_name = this.editFolderFormGroup.get(`property_name_${index}`).value
        // })
        if (this.editFolderFormGroup.invalid) {
            const config = {
                content: {
                    value: 'response_text.manage_folders.fields_required',
                },
                title: 0,
            }
            this.sharedService.showMessage(config)
            return
        }
        const folder = {
            folder_id: '',
            folder_name: folder_name.trim(),
            folder_short_name: folder_short_name.trim(),
            folder_document_no: folder_document_no.trim(),
            folder_is_show_updated_count: convertStringBooleanToBoolean(folder_is_show_updated_count),
            folder_is_show_created_at: convertStringBooleanToBoolean(folder_is_show_created_at),
            folder_is_show_updated_at: convertStringBooleanToBoolean(folder_is_show_updated_at),
            folder_properties,
            folder_created_by: user_id,
            folder_authorized_users,
            folder_root_id,
        }

        const obsvCreateFolder = await this.folderService
            .createFolder(folder)
            .toPromise()
            .catch((err) => err)
        if (obsvCreateFolder.code === 0) {
            this.sharedService.showMessage({
                type: 'create',
                title: 1,
                object: 'object.folder',
            })
            this.nbDialogRef.close({ data: folder })
        } else if (obsvCreateFolder.detail) {
            // this.nbToastrService.show(obsvCreateFolder.detail, 'Error', {
            //     status: 'danger',
            // })
            this.sharedService.showMessage({
                type: 'create',
                title: 0,
                object: 'response_text.common.folder_already_exists',
            })
        } else {
            this.sharedService.showMessage({
                type: 'create',
                title: 0,
                object: 'object.folder',
            })
        }
    }

    deleteFolder() {
        const contentType = this.folder.folder_is_deleted ? 2 : -1
        const input = {
            folder_id: this.folder.folder_id,
            status: this.folder.folder_is_deleted,
        }

        this.dialogService.open(ConfirmationComponent, {
            context: {
                data: {
                    contentType,
                    onYes: (() => {
                        this.folderService.deleteFolder(input).subscribe(
                            (res) => {
                                if (res.code === 0) {
                                    this.sharedService.showMessage({
                                        type: contentType === 2 ? 'undelete' : 'delete',
                                        title: 1,
                                        object: 'object.folder',
                                    })
                                    this.nbDialogRef.close()
                                } else {
                                    this.sharedService.showMessage({
                                        type: contentType === 2 ? 'undelete' : 'delete',
                                        title: 0,
                                        object: 'object.folder',
                                    })
                                }
                            },
                            (err) => {
                                this.sharedService.showMessage({
                                    type: contentType === 2 ? 'undelete' : 'delete',
                                    title: 0,
                                    object: 'object.folder',
                                })
                            }
                        )
                    }).bind(this),
                },
            },
        })
    }

    translate(property_name = '') {
        return this.realFolderProperties[this.fakeFolderProperties.indexOf(property_name)]
    }

    createFormControls() {
        this.rows.forEach((e) => {
            // if (e === 'folder_structure') {
            //     Object.keys(this.data[e]).forEach((e1) => {
            //         this.editFolderFormGroup.addControl(e1, new FormControl(this.data[e][e1]))
            //     })
            // } else {
            if (e !== 'folder_authorized_users' && e !== 'file_latest_update') {
                this.editFolderFormGroup.addControl(e, new FormControl(this.folder[e], { validators: Validators.required }))
            } else {
                this.editFolderFormGroup.addControl(e, new FormControl(this.folder[e]))
            }

            // }
        })

        let index = 0
        // console.log(this.secondRows)
        if (this.secondRows.length !== 0) {
            this.secondRows.forEach((e) => {
                // this.editFolderFormGroup.addControl(
                //     `property_name_en_${index}`,
                //     new FormControl(e.property_name.split('!@#$%^&*()')[0], { validators: Validators.required })
                // )
                // this.editFolderFormGroup.addControl(
                //     `property_name_jp_${index}`,
                //     new FormControl(e.property_name.split('!@#$%^&*()')[0], { validators: Validators.required })
                // )
                this.editFolderFormGroup.addControl(`property_name_${index}`, new FormControl(e.property_name))
                this.editFolderFormGroup.addControl(`property_data_type_${index}`, new FormControl(e.property_data_type))
                this.editFolderFormGroup.addControl(`property_is_show_in_list_${index}`, new FormControl(!!e.property_is_show_in_list))
                this.editFolderFormGroup.addControl(`property_is_show_in_detail_${index}`, new FormControl(!!e.property_is_show_in_detail))
                this.editFolderFormGroup.addControl(`max_width_${index}`, new FormControl(e.max_width))
                this.editFolderFormGroup.addControl(`id_${index}`, new FormControl(e.id))
                index += 1
            })
        } else {
            this.addProperty()
        }
    }

    getPosition(row) {
        const index = this.secondRows.findIndex((e) => {
            return e.property_name === row.property_name && e.property_data_type === row.property_data_type
        })

        return index
    }

    addProperty() {
        this.propertiesCount += 1
        const countNext = this.propertiesCount + 1
        const newProperty = {
            property_data_type: 'text',
            property_is_show_in_detail: true,
            property_is_show_in_list: true,
            // property_name: `${countNext}!@#$%^&*()${countNext}`,
            property_name: `${countNext}`,
            max_width: '20',
            id: countNext,
        }

        this.secondRows.push(newProperty)
        // this.editFolderFormGroup.addControl(`property_name_jp_${this.propertiesCount}`, new FormControl('', { validators: Validators.required }))
        // this.editFolderFormGroup.addControl(`property_name_en_${this.propertiesCount}`, new FormControl('', { validators: Validators.required }))
        this.editFolderFormGroup.addControl(
            `property_name_${this.propertiesCount}`,
            new FormControl(newProperty.property_name, { validators: Validators.required })
        )
        this.editFolderFormGroup.addControl(`property_data_type_${this.propertiesCount}`, new FormControl(newProperty.property_data_type))
        this.editFolderFormGroup.addControl(`property_is_show_in_list_${this.propertiesCount}`, new FormControl(true))
        this.editFolderFormGroup.addControl(`property_is_show_in_detail_${this.propertiesCount}`, new FormControl(true))
        this.editFolderFormGroup.addControl(`max_width_${this.propertiesCount}`, new FormControl('20'))
        this.editFolderFormGroup.addControl(`id_${this.propertiesCount}`, new FormControl(countNext))

        // this.createFormControls()
    }

    translatePropertyName(input) {
        const currentLang = this.translateService.currentLang
        // if () {
        // }
        return input.split('!@#$%^&*()')[currentLang === 'en' ? 0 : 1]
    }

    removeProperty(input) {
        const index = this.getPosition(input)
        this.secondRows.splice(index, 1)

        this.editFolderFormGroup.removeControl(`property_name_${index}`)
        this.editFolderFormGroup.removeControl(`property_data_type_${index}`)
        this.editFolderFormGroup.removeControl(`property_is_show_in_list_${index}`)
        this.editFolderFormGroup.removeControl(`property_is_show_in_detail_${index}`)
        this.editFolderFormGroup.removeControl(`max_width_${index}`)
        this.editFolderFormGroup.removeControl(`id_${index}`)
        // console.log(this.secondRows)
    }

    closeDialog() {
        this.nbDialogRef.close()
    }
}
