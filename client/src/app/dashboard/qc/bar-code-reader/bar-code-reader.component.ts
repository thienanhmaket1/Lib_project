import { Component, OnInit, ViewChild, TemplateRef, ElementRef } from '@angular/core'
import { NbDialogService } from '@nebular/theme'
import { ScannerComponent } from 'src/app/components/scanner/scanner.component'
import { SettingsService } from 'src/app/services/settings.service'
import { SharedService } from '@app/services/shared.service'
import { FormGroup, FormControl } from '@angular/forms'

@Component({
    selector: 'app-bar-code-reader',
    templateUrl: './bar-code-reader.component.html',
    styleUrls: ['./bar-code-reader.component.scss'],
})
export class BarCodeReaderComponent implements OnInit {
    @ViewChild('scannerResponse', { read: TemplateRef, static: false }) scannerResponseTemplate: TemplateRef<HTMLElement>

    settingsInfo: any
    fileURL: any
    barCodeFormGroup = new FormGroup({
        barCodeFormControl: new FormControl(''),
    })
    @ViewChild('barCodeInput') barCodeInput: ElementRef

    constructor(private nbDialogService: NbDialogService, private settingsService: SettingsService, private sharedService: SharedService) {}

    ngOnInit(): void {
        this.settingsService.getQCAdminSettings().subscribe(
            (res) => {
                this.settingsInfo = res.data
                this.barCodeInput.nativeElement.focus()
            },
            () => {}
        )
    }

    onKeyup(event) {
        const { barCodeFormControl } = this.barCodeFormGroup.getRawValue()
        if (barCodeFormControl) {
            return this.settingsService.getParentFoldersByOnlyFileName({ filename: `${barCodeFormControl}.pdf` }).subscribe({
                next: (next) => {
                    const {
                        data: { returnedData },
                    } = next
                    if (returnedData.length === 0) {
                        this.sharedService.showMessage({
                            content: {
                                value: 'response_text.common.file_not_found',
                            },
                            title: 0,
                        })

                        return
                    }
                    returnedData.forEach((el) => {
                        window.open(this.settingsService.openFile(`get-qc-file/${encodeURIComponent(`${el}/${barCodeFormControl}.pdf`)}`))
                    })
                },
            })
        }
    }

    openScanner() {
        const dialogRef = this.nbDialogService.open(ScannerComponent, { autoFocus: true, hasBackdrop: true })
        dialogRef.onClose.subscribe((res) => {
            if (res) {
                const { data } = res
                return this.settingsService.getParentFoldersByOnlyFileName({ filename: `${data}.pdf` }).subscribe({
                    next: (next) => {
                        const {
                            data: { returnedData },
                        } = next
                        if (returnedData.length === 0) {
                            this.sharedService.showMessage({
                                content: {
                                    value: 'response_text.common.file_not_found',
                                },
                                title: 0,
                            })

                            return
                        }
                        returnedData.forEach((e) => {
                            window.open(this.settingsService.openFile(`get-qc-file/${encodeURIComponent(`${e}/${data}.pdf`)}`))
                        })
                    },
                })
            }

            // window.open(this.settingsService.getParentFoldersByOnlyFileName(`get-qc-file-by-only-file-name/${encodeURIComponent(data)}.pdf`))
            // const fileName = `${this.settingsInfo.qc_path_value}/${data}.pdf`
            // window.open(this.settingsService.openFile(`get-qc-file/${encodeURIComponent(fileName)}`))
        })
    }
}
