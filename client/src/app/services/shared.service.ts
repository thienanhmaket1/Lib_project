import { dateTimeInString } from './../../common/functions'
import { NbToastrService, NbGlobalPhysicalPosition } from '@nebular/theme'
import { Injectable } from '@angular/core'
import { BehaviorSubject, Observable } from 'rxjs'
import { defaultMessageConfig } from 'src/common/constants'
import { environment } from '@env/environment'
import { TranslateService } from '@ngx-translate/core'

@Injectable({
    providedIn: 'root',
})
export class SharedService {
    private menuStatus: BehaviorSubject<string> = new BehaviorSubject('normal')
    constructor(private nbToastrService: NbToastrService, private translateService: TranslateService) {}

    setMenuStatus(newMenuStatus) {
        this.menuStatus.next(newMenuStatus)
    }

    getMenuStatus() {
        return this.menuStatus
    }

    showMessage(config) {
        const newConfig = {
            ...defaultMessageConfig,
            ...config,
        }
        let position = NbGlobalPhysicalPosition.BOTTOM_RIGHT

        switch (newConfig.position) {
            case 4:
                position = NbGlobalPhysicalPosition.BOTTOM_RIGHT
                break

            case 3:
                position = NbGlobalPhysicalPosition.BOTTOM_LEFT
                break

            case 2:
                position = NbGlobalPhysicalPosition.TOP_RIGHT
                break

            case 1:
                position = NbGlobalPhysicalPosition.TOP_LEFT
                break

            default:
                position = NbGlobalPhysicalPosition.BOTTOM_RIGHT
                break
        }

        if (newConfig.title === 1) {
            if (newConfig.type && newConfig.object) {
                newConfig.content.value = `response_text.common.${newConfig.type}_success`
                newConfig.content.params = {
                    param1: this.translate(newConfig.object),
                }
            }
            newConfig.title = this.translate('response_text.common.success')
            newConfig.status = 'success'
        }

        if (newConfig.title === 0) {
            if (newConfig.type && newConfig.object) {
                newConfig.content.value = `response_text.common.${newConfig.type}_error`
                newConfig.content.params = {
                    param1: this.translate(newConfig.object),
                }
            }
            newConfig.title = this.translate('response_text.common.error')
            newConfig.status = 'danger'
        }
        newConfig.content = this.translate(newConfig.content.value, newConfig.content.params)

        this.nbToastrService.show(newConfig.content, newConfig.title, {
            status: newConfig.status,
            position,
            duration: newConfig.duration,
        })
    }

    dateTimeInString(dateTime, format = null) {
        return dateTimeInString(dateTime, format)
    }

    getAvatar(userId) {
        return `${environment.server}/images/avatars/${userId}.png`
    }

    translate(id, params = {}): string {
        return this.translateService.instant(id, params)
    }

    getLogo(fileType) {
        return `${environment.server}/images/logo/logo${fileType ? fileType : '.png'}?v=${Date.now()}`
    }
}
