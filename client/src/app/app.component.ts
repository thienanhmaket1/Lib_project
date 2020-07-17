import { dateTimeInString } from './../common/functions'
import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core'
import { NbThemeService, NbDialogService } from '@nebular/theme'
import { AuthenticationService } from './authentication/authentication.service'
import { permission } from '../common/constants'
import { ManageUserService } from './services/manage-user.service'
import { BehaviorSubject } from 'rxjs'
import { FormControl } from '@angular/forms'
import { TranslateService } from '@ngx-translate/core'
import { ProfileDetailComponent } from './components/profile-detail/profile-detail.component'
import { SharedService } from './services/shared.service'
import { AdminSettingsComponent } from './components/settings/admin-settings/admin-settings.component'
import { SettingsService } from './services/settings.service'

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit {
    // @ViewChild('avatar') avatar: ElementRef

    title = 'D-CUBE'
    now = Date.now()
    user: any = ''
    permissionInfo
    name
    srcImg
    language = 'EN'
    languageFormControl = new FormControl(true)
    theme
    public profileChanged: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false)
    logoImg = ``

    constructor(
        private themeService: NbThemeService,
        private authenticationService: AuthenticationService,
        private userService: ManageUserService,
        private nbDialogService: NbDialogService,
        private translateService: TranslateService,
        public sharedService: SharedService,
        private settingsService: SettingsService
    ) {
        /** Kiểm tra theme trong local, nếu có thì đổi thành theme đó hoặc lấy mặc định là default */
        this.theme = localStorage.getItem('user_theme') || 'default'
        this.themeService.changeTheme(this.theme)

        /** Kiểm tra language trong local, nếu có thì đổi thành language đó hoặc lấy mặc định là en */
        const last_lang = localStorage.getItem('last_lang') || 'vn'
        this.translateService.use(last_lang)
        // this.languageFormControl.setValue(last_lang === 'en')

        this.logoImg = `../assets/images/Nissin_Electric_company_logo.svg-1.png`

        /** Xử lý tăng giây cho đồng hồhồ */
        setInterval(() => {
            this.now = Date.now()
        }, 1000)

        /** Xử lý thông tin của người dùng hiện hành để hiển thị lên màn hìnhhình */
        this.authenticationService.getUser.subscribe((res) => {
            this.user = res
            if (this.user) {
                const { user_fullname, user_permission_code } = this.user
                this.name = user_fullname
                this.getImage()
                this.permissionInfo = permission.find((e) => e.permission_code === user_permission_code)

                if (this.user.user_theme) {
                    this.themeService.changeTheme(this.user.user_theme)
                    this.theme = this.user.user_theme
                }

                // console.log(this.defaultImage)
            }
        })

        /** Bắt sự kiện người dùng thay đổi ngôn ngữ */
        // this.languageFormControl.valueChanges.subscribe((res) => {
        //     if (res) {
        //         this.language = 'EN'
        //     } else {
        //         this.language = 'JP'
        //     }

        //     this.translateService.use(this.language.toLowerCase())

        //     localStorage.setItem('last_lang', this.language.toLowerCase())
        // })

        /** Xử lý khi người dùng đổi logo */
        this.settingsService.logoImg.subscribe((res) => {
            this.logoImg = this.sharedService.getLogo(res)
        })

        /** Xử lý khi người dùng đổi tên ứng dụng */
        this.settingsService.logoTitle.subscribe((res) => {
            this.settingsService.getOfficeAdminSettings().subscribe({
                next: (next) => {
                    const { data } = next
                    this.title = data.length !== 0 && data[0].logo_title ? data[0].logo_title : this.title
                },
                error: () => {},
                complete: () => {
                    if (res !== '') {
                        this.title = res
                    }
                },
            })
        })
    }

    ngAfterViewInit() {
        /** Tính toán chiều cao của phần body của ứng dụng */
        document.getElementById('div-main-layout').style.height = `${window.innerHeight / this.getScale() - 5 - 3 - 0.5 - 0.5}rem`
    }

    getImage() {
        // this.avatar.nativeElement.setAttribute('data', this.userService.getImage(`${this.user.user_id}.png?v=${Date.now()}`))
        this.srcImg = this.userService.getImage(`${this.user.user_id}.png?v=${Date.now()}`)
    }

    openDialogEditProfile() {
        // this.profileChanged.next(false)
        this.nbDialogService.open(ProfileDetailComponent, { context: { data: this.user }, hasBackdrop: true, autoFocus: false })
    }

    getScale() {
        const innerWidth = window.innerWidth
        let scale = 12

        if (innerWidth >= 2560) {
            scale = 16
        } else if (innerWidth >= 1920 && innerWidth < 2560) {
            scale = 15
        } else if (innerWidth >= 1600 && innerWidth < 1920) {
            scale = 14
        } else if (innerWidth >= 1280 && innerWidth < 1600) {
            scale = 13
        }

        return scale
    }

    selectLanguage(language) {
        this.translateService.use(language.toLowerCase())
        localStorage.setItem('last_lang', language.toLowerCase())
    }
}
