import { Component, OnInit, Input } from '@angular/core'
import { NbDialogRef } from '@nebular/theme'

@Component({
    selector: 'app-confirmation',
    templateUrl: './confirmation.component.html',
    styleUrls: ['./confirmation.component.scss'],
})
export class ConfirmationComponent implements OnInit {
    @Input() data: any

    constructor(public selfDialog: NbDialogRef<Component>) {}

    ngOnInit(): void {}

    onYes() {
        const { onYes } = this.data

        if (onYes) {
            onYes()
        }

        this.selfDialog.close()
    }

    onNo() {
        const { onNo } = this.data

        if (onNo) {
            onNo()
        }

        this.selfDialog.close()
    }

    getTranslateIDByContentType(contentType) {
        let result = ''
        switch (contentType) {
            case 1:
                result = 'confirmation.create_content'
                break

            case 0:
                result = 'confirmation.update_content'
                break

            case -1:
                result = 'confirmation.deactivate_content'
                break

            case 2:
                result = 'confirmation.activate_content'
                break

            case 3:
                result = 'confirmation.delete_content'
                break

            default:
                break
        }

        return result
    }
}
