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
    selector: 'app-higher-folder-detail',
    templateUrl: './higher-folder-detail.component.html',
    styleUrls: ['./higher-folder-detail.component.scss'],
})
export class HigherFolderDetailComponent implements OnInit {
    @Input() data: any
    @Input() type: any
    editFolderFormGroup = new FormGroup({})

    fakeFolderProperties = ['higher_folder_name', 'folder_is_deleted']

    realFolderProperties = [
        'office_manage_folder.folder_detail.higher_folder_name',
        'office_manage_folder.folder_detail.folder_is_deleted',
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
    hiddenColumn = ['no', 'folder_created_at', 'folder_created_by', 'folder_id']

    constructor(
        private authenticationService: AuthenticationService,
        private folderService: FolderDetailService,
        private toastService: NbToastrService,
        private nbDialogRef: NbDialogRef<HigherFolderDetailComponent>,
        private dialogService: NbDialogService,
        private sharedService: SharedService,
    ) { }

    ngOnInit(): void {
        const { user_permission_code } = this.authenticationService.getUserValue
        this.folder = { ...this.data }
        this.rows = Object.keys(this.folder)
        this.createFormControls()

        this.isViewing = this.type === 'view' || this.type === 'edit'
        this.isEditable = this.type === 'edit' && (user_permission_code === '99' || user_permission_code === '09')
        this.isCreating = this.type === 'create'
        this.isReadOnly = this.isRestrictedEditable ? true : false
    }

    createFormControls() {
        this.rows.forEach((e) => {

            this.editFolderFormGroup.addControl(
                e,
                new FormControl(this.folder[e], {
                    validators: Validators.required,
                })
            )
        })
    }

    translate(property_name = '') {
        return this.realFolderProperties[this.fakeFolderProperties.indexOf(property_name)]
    }

    editFolder() {
        this.isViewing = false
        this.isEditing = true
        this.isCreating = false
    }

    createFolder() {
        const { higher_folder_name } = this.editFolderFormGroup.getRawValue()
        this.editFolderFormGroup.get('higher_folder_name').patchValue(higher_folder_name.trim())
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
            folder_name: higher_folder_name.trim(),
        }

        this.folderService.createHigherFolder(folder).subscribe((res) => {
            if (res.code === 0) {
                this.sharedService.showMessage({
                    type: 'create',
                    title: 1,
                    object: 'object.folder',
                })
                this.nbDialogRef.close({ data: folder })
            } else if (res.detail) {
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
        })
    }

    saveFolder() {
        const { higher_folder_name } = this.editFolderFormGroup.getRawValue()
        this.editFolderFormGroup.get('higher_folder_name').patchValue(higher_folder_name.trim())
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
            folder_name: higher_folder_name.trim(),
            folder_id: this.folder.folder_id,
        }

        this.folderService.updateHigherFolder(folder).subscribe((res) => {
            if (res.code === 0) {
                this.sharedService.showMessage({
                    type: 'update',
                    title: 1,
                    object: 'object.folder',
                })
                this.nbDialogRef.close({ data: folder })
            } else if (res.detail) {
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
        })
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

    closeDialog() {
        this.nbDialogRef.close()
    }
}
