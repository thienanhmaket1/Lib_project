import { NbDialogRef } from '@nebular/theme'
import { Component, OnInit } from '@angular/core'
import { FormGroup, FormControl } from '@angular/forms'

@Component({
    selector: 'app-scanner',
    templateUrl: './scanner.component.html',
    styleUrls: ['./scanner.component.scss'],
})
export class ScannerComponent implements OnInit {
    barCodeFormGroup = new FormGroup({
        barCodeFormControl: new FormControl(''),
    })

    constructor(private nbDialogRef: NbDialogRef<Component>) {}

    ngOnInit(): void {}

    onKeydown(e) {
        const { barCodeFormControl } = this.barCodeFormGroup.getRawValue()
        this.nbDialogRef.close({ data: barCodeFormControl })
    }
}
