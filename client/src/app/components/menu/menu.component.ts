import {
    adminItemsEN,
    qcAdminItemsEN,
    officeAdminItemsEN,
    qcUserItemsEN,
    officeUserItemsEN,
    defaultTopItemsEN,
    defaultBottomItemsEN,
    adminItemsJP,
    qcUserItemsJP,
    qcAdminItemsJP,
    officeAdminItemsJP,
    officeUserItemsJP,
    defaultBottomItemsJP,
    defaultTopItemsJP,
    adminItemsVN,
    qcUserItemsVN,
    qcAdminItemsVN,
    officeAdminItemsVN,
    officeUserItemsVN,
    defaultBottomItemsVN,
    defaultTopItemsVN,
} from './../../../common/constants'
import { Component, OnInit } from '@angular/core'
import { NbMenuService } from '@nebular/theme'
import { NbMenuItem } from '@nebular/theme'
import { AuthenticationService } from 'src/app/authentication/authentication.service'
import { SharedService } from '@app/services/shared.service'
import { TranslateService } from '@ngx-translate/core'
import { SettingsService } from '@app/services/settings.service'
import { saveAs } from 'file-saver'

@Component({
    selector: 'app-menu',
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {
    defaultTopItems: NbMenuItem[] = defaultTopItemsVN
    defaultBottomItems: NbMenuItem[] = defaultBottomItemsVN
    adminItems: NbMenuItem[] = adminItemsVN
    qcAdminItems: NbMenuItem[] = qcAdminItemsVN
    officeAdminItems: NbMenuItem[] = officeAdminItemsVN
    qcUserItems: NbMenuItem[] = qcUserItemsVN
    officeUserItems: NbMenuItem[] = officeUserItemsVN
    menuStatus
    items = []

    constructor(
        private nbMenuService: NbMenuService,
        private authenticationService: AuthenticationService,
        public sharedService: SharedService,
        private translateService: TranslateService,
        private settingsService: SettingsService
    ) {
        /** Xử lý khi người dùng đóng mở menu */
        this.sharedService.getMenuStatus().subscribe((res) => {
            this.menuStatus = res
        })

        /** Xử lý khi người dùng click vào menu */
        this.nbMenuService.onItemClick().subscribe((res: any) => {
            const {
                item: { id },
            } = res

            /** Khi người dùng bấm vào Log out */
            if (id === 'log_out') {
                // this.authenticationService.setUser = null
                // this.router.navigate(['login'])
                this.authenticationService.logout(true)
            }
            if (id === 'manual') {
                window.open(this.settingsService.openManualFile())
                // this.settingsService.openManualFile().subscribe({
                //     next: (res2) => {
                //         saveAs(res2, 'DMS-Manual')
                //     },
                //     error: () => {},
                //     complete: () => {},
                // })
            }
        })

        /** Mặc định là mở menu */
        this.changeToNormalMode()

        /** Xử lý khi người dùng đổi ngôn ngữ thì ngôn ngữ menu cũng đổi theo, tại làm biếng nên làm 2 cái menu riêng cho 2 ngôn ngữ chứ không dịch hihi */
        this.translateService.onLangChange.subscribe((res) => {
            const menuStatus = this.sharedService.getMenuStatus().value
            if (menuStatus === 'normal') {
                this.changeToNormalMode()
            }
            // const { lang } = res
            // const isEN = lang === 'en'
            //
            // this.adminItems = isEN ? adminItems : adminItemsJP
            // this.qcAdminItems = isEN ? qcAdminItems : qcAdminItemsJP
            // this.officeAdminItems = isEN ? officeAdminItems : officeAdminItemsJP
            // this.qcUserItems = isEN ? qcUserItems : qcUserItemsJP
            // this.officeUserItems = isEN ? officeUserItems : officeUserItemsJP
            // this.defaultTopItems = isEN ? defaultTopItems : defaultTopItemsJP
            // this.defaultBottomItems = isEN ? defaultBottomItems : defaultBottomItemsJP
            //
            //     this.adminItems = isEN ? adminItems : adminItemsJP
            //     this.qcAdminItems = isEN ? qcAdminItems : qcAdminItemsJP
            //     this.officeAdminItems = isEN ? officeAdminItems : officeAdminItemsJP
            //     this.qcUserItems = isEN ? qcUserItems : qcUserItemsJP
            //     this.officeUserItems = isEN ? officeUserItems : officeUserItemsJP
            //     this.defaultTopItems = isEN ? defaultTopItems : defaultTopItemsJP
            //     this.defaultBottomItems = isEN ? defaultBottomItems : defaultBottomItemsJP
            //     this.changeToNormalMode()
            // }
        })
    }

    changeToNormalMode() {
        const isEN = this.translateService.currentLang === 'en'
        const language = this.translateService.currentLang
        const { user_permission_code } = this.authenticationService.getUserValue

        switch (user_permission_code) {
            case '19':
                // this.items = isEN ? qcAdminItemsEN : qcAdminItemsJP
                if (language === 'en') {
                    this.items = qcAdminItemsEN
                } else if (language === 'jp') {
                    this.items = qcAdminItemsJP
                } else if (language === 'vn') {
                    this.items = qcAdminItemsVN
                }
                break

            case '09':
                // this.items = isEN ? officeAdminItemsEN : officeAdminItemsJP
                if (language === 'en') {
                    this.items = officeAdminItemsEN
                } else if (language === 'jp') {
                    this.items = officeAdminItemsJP
                } else if (language === 'vn') {
                    this.items = officeAdminItemsVN
                }
                break

            case '01':
                // this.items = isEN ? officeUserItemsEN : officeUserItemsJP
                break

            case '11':
                // this.items = isEN ? qcUserItemsEN : qcUserItemsJP
                if (language === 'en') {
                    this.items = qcUserItemsEN
                } else if (language === 'jp') {
                    this.items = qcUserItemsJP
                } else if (language === 'vn') {
                    this.items = qcUserItemsVN
                }
                break

            default:
                // this.items = isEN ? adminItemsEN : adminItemsJP
                if (language === 'en') {
                    this.items = adminItemsEN
                } else if (language === 'jp') {
                    this.items = adminItemsJP
                } else if (language === 'vn') {
                    this.items = adminItemsVN
                }
                break
        }
        if (language === 'en') {
            this.defaultTopItems = defaultTopItemsEN
            this.defaultBottomItems = defaultBottomItemsEN
        } else if (language === 'jp') {
            this.defaultTopItems = defaultTopItemsJP
            this.defaultBottomItems = defaultBottomItemsJP
        } else if (language === 'vn') {
            this.defaultTopItems = defaultTopItemsVN
            this.defaultBottomItems = defaultBottomItemsVN
        }
        let newData = []
        newData = this.defaultBottomItems
        this.defaultBottomItems = user_permission_code !== '99' ? newData : newData.filter((e) => e.id !== 'manual')
        this.items = [...this.defaultTopItems, ...this.items, ...this.defaultBottomItems]
        this.sharedService.setMenuStatus('normal')
    }

    changeToMiniMode() {
        let newItems = []
        this.items.forEach((e) => {
            const hasChildren = !!e.children
            if (hasChildren) {
                const newChildren = e.children.map((e1) => {
                    return {
                        ...e1,
                        title: '',
                    }
                })
                newItems = newItems.concat(newChildren)
                return
            }

            newItems.push({
                ...e,
                title: '',
            })
        })

        this.items = newItems

        this.sharedService.setMenuStatus('mini')
    }

    ngOnInit(): void {}
}
