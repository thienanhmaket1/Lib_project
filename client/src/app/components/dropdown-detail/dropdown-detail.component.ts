import { Component, OnInit, Input, ElementRef, ViewChild, ɵConsole } from '@angular/core'
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms'
import { AuthenticationService } from '@app/authentication/authentication.service'
import { FileDetailComponent } from '../file-detail/file-detail.component'
import { NbDialogRef, NbToastrService, NbGlobalPhysicalPosition } from '@nebular/theme'
import { SettingsService } from '@app/services/settings.service'
import { FileDetailService } from '@app/services/file-detail.service'
import { ManageUserService } from '@app/services/manage-user.service'
import { createDropdownLeftRealColumns, createDropdownRightRealColumns } from 'src/common/functions'
import { NbEvaIconsModule } from '@nebular/eva-icons'
import { ChangeDetectionStrategy } from '@angular/core'
import { FolderDetailService } from '@app/services/folder-detail.service'
import { DropdownService } from '@app/services/dropdown.service'
import { COMMA, ENTER } from '@angular/cdk/keycodes'
import { MatChipInputEvent } from '@angular/material'
import { SharedService } from '@app/services/shared.service'

@Component({
    selector: 'app-dropdown-detail',
    templateUrl: './dropdown-detail.component.html',
    styleUrls: ['./dropdown-detail.component.scss'],
})
export class DropdownDetailComponent implements OnInit {
    @Input() data: any
    @Input() type: any
    @Input() folder: any

    // files = []
    dropdownFormGroup = new FormGroup({})

    // folderFormGroup = new FormGroup({
    //     folderFormControl: new FormControl(),
    // })

    allFolders = []

    plus = false
    rows
    dropdown

    isViewing
    isEditing
    isEditable
    isRestrictedEditable
    isCreating

    isReadOnly = false

    editDropdownFormGroup = new FormGroup({})
    createDropdownFormGroup = new FormGroup({})

    userList: any
    newArr = []
    hiddenRow = [
        'drop_down_id',
        'drop_down_created_at',
        'drop_down_created_by',
        'drop_down_updated_at',
        'drop_down_updated_by',
        'folder_name',
        'drop_down_is_deleted',
    ]
    readonly separatorKeysCodes: number[] = [ENTER, COMMA]
    visible = true
    selectable = true
    removable = true
    addOnBlur = true
    selectedItem = []

    constructor(
        private authenticationService: AuthenticationService,
        private nbDialogRef: NbDialogRef<DropdownDetailComponent>,
        private settingsService: SettingsService,
        private formBuilder: FormBuilder,
        private manageUserService: ManageUserService,
        private foldersService: FolderDetailService,
        private dropDownService: DropdownService,
        public sharedService: SharedService
    ) {}

    ngOnInit(): void {
        const { user_permission_code } = this.authenticationService.getUserValue
        this.getFolders()
        let dropdown = {}
        if (this.type === 'create') {
            dropdown = this.createDropdownSample(this.folder)
        } else {
            dropdown = {
                ...this.data,
            }
            // this.folderFormGroup.patchValue({ folderFormControl: this.data.folder_id })
        }
        this.dropdown = { ...dropdown }
        delete this.dropdown.no
        this.rows = Object.keys(this.dropdown)
        this.rows.forEach((e) => {
            if (e === 'drop_down_name') {
                this.dropdownFormGroup.addControl(
                    e,
                    new FormControl(this.dropdown[e], {
                        validators: Validators.required,
                    })
                )
            }
            this.dropdownFormGroup.addControl(e, new FormControl(this.dropdown[e]))
        })
        this.isViewing = this.type === 'view' || this.type === 'edit'
        this.isEditable = this.type === 'edit' && (user_permission_code === '99' || user_permission_code === '09')
        // this.isRestrictedEditable = this.type === 'view' && this.isAuthorized
        this.isCreating = this.type === 'create'
        // this.isReadOnly = this.isRestrictedEditable ? true : false
        // this.settingsService.getOfficeAdminSettings().subscribe()

        this.createDropdownFormGroup = this.formBuilder.group({})

        if (this.data.drop_down_data) {
            this.dropdownFormGroup.get('drop_down_data').patchValue(this.data.drop_down_data.map((e) => e.id))
        }
    }

    createRealColumns(flagColumnName: string) {
        return createDropdownLeftRealColumns(flagColumnName) || createDropdownRightRealColumns(flagColumnName)
    }

    editDropdown() {
        this.isViewing = false
        this.isEditing = true
        this.isCreating = false
    }

    getFolders() {
        this.foldersService.getChildFolders().subscribe((res) => {
            this.allFolders = res.data
        })
    }

    createDropdownSample(formDropdown) {
        const newDropDown = {
            folder_id: formDropdown ? formDropdown.folder_id : null,
            drop_down_name: '',
            drop_down_data: [],
        }
        // if (formDropdown) {
        // newDropDown['folder_name'] = formDropdown.folder_name
        // this.folderFormGroup.patchValue({ folderFormControl: formDropdown.folder_id })
        // }

        return newDropDown
    }

    showDialog() {
        this.plus = true
    }

    add(event: MatChipInputEvent): void {
        const newDropDownItem = {
            id:
                this.dropdown.drop_down_data.length !== 0
                    ? `${Math.max.apply(
                          Math,
                          this.dropdown.drop_down_data.map((o) => o.id)
                      ) + 1}`
                    : `1`,
            name: '',
        }
        const input = event.input
        const value = event.value

        // Add our fruit
        if ((value || '').trim()) {
            newDropDownItem.name = value.trim()
            this.dropdown.drop_down_data = this.dropdown.drop_down_data.concat([newDropDownItem])
        }

        // Reset the input value
        if (input) {
            input.value = ''
        }
    }

    remove(item): void {
        const index = this.dropdown.drop_down_data.indexOf(item)

        if (index >= 0) {
            this.dropdown.drop_down_data.splice(index, 1)
        }
    }

    prepareData() {
        const { user_id } = this.authenticationService.getUserValue
        let data = {}
        // let { drop_down_data } = this.dropdownFormGroup.getRawValue()
        // const { folderFormControl } = this.folderFormGroup.getRawValue()
        // const newDropdownArr = drop_down_data.map((e) => {
        //     return {
        //         id: e,
        //         name: this.dropdown.drop_down_data.find((i) => i.id === e).name,
        //     }
        // })

        this.dropdownFormGroup.get('drop_down_data').patchValue(this.dropdown.drop_down_data)
        // console.log(this.dropdownFormGroup.get('drop_down_data'))
        data = this.dropdownFormGroup.getRawValue()
        data[`user_id`] = user_id
        // if (this.folder !== '') {
        //     data[`folder_id`] = this.folder.folder_id
        // }
        // if (folderFormControl) {
        //     data[`folder_id`] = folderFormControl
        // }
        // console.log(data)
        return data
    }

    saveDropdown() {
        if (this.dropdownFormGroup.invalid) {
            this.sharedService.showMessage({
                content: {
                    value: 'response_text.manage_folders.fields_required',
                },
                title: 0,
            })

            return
        }
        const input = this.prepareData()
        this.dropDownService.editDropDown(input).subscribe(
            (res) => {
                if (res.code === 0) {
                    this.sharedService.showMessage({
                        type: 'update',
                        object: 'object.dropdown',
                        title: 1,
                    })

                    this.nbDialogRef.close({ code: 0 })
                } else {
                    this.sharedService.showMessage({
                        type: 'update',
                        object: 'object.dropdown',
                        title: 0,
                    })
                }
            },
            (err) => {
                this.sharedService.showMessage({
                    type: 'update',
                    object: 'object.dropdown',
                    title: 0,
                })
            }
        )
    }

    createDropdown() {
        if (this.dropdownFormGroup.invalid) {
            this.sharedService.showMessage({
                content: {
                    value: 'response_text.manage_folders.fields_required',
                },
                title: 0,
            })

            return
        }
        const input = this.prepareData()
        this.dropDownService.createDropDown(input).subscribe(
            (res) => {
                if (res.code === 0) {
                    this.sharedService.showMessage({
                        type: 'create',
                        object: 'object.dropdown',
                        title: 1,
                    })

                    this.nbDialogRef.close({ code: 0 })
                } else {
                    this.sharedService.showMessage({
                        type: 'create',
                        object: 'object.dropdown',
                        title: 0,
                    })
                }
            },
            (err) => {
                this.sharedService.showMessage({
                    type: 'create',
                    object: 'object.dropdown',
                    title: 0,
                })
            }
        )
    }

    deleteDropdown() {
        const contentType = this.dropdown.drop_down_is_deleted ? 2 : -1
        const input = {
            drop_down_id: this.dropdown.drop_down_id,
            status: this.dropdown.drop_down_is_deleted,
        }
        this.dropDownService.deleteDropDown(input).subscribe(
            (res) => {
                if (res.code === 0) {
                    this.sharedService.showMessage({
                        type: contentType === 2 ? 'undelete' : 'delete',
                        object: 'object.dropdown',
                        title: 1,
                    })

                    this.nbDialogRef.close({ code: 0 })
                } else {
                    this.sharedService.showMessage({
                        type: contentType === 2 ? 'undelete' : 'delete',
                        object: 'object.dropdown',
                        title: 0,
                    })
                }
            },
            (err) => {
                this.sharedService.showMessage({
                    type: contentType === 2 ? 'undelete' : 'delete',
                    object: 'object.dropdown',
                    title: 0,
                })
            }
        )
    }

    closeDialog() {
        this.nbDialogRef.close()
    }
}
