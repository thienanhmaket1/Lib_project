import { Component, OnInit } from '@angular/core'
import { NbThemeService } from '@nebular/theme'
import { FormControl, FormGroup } from '@angular/forms'

@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
    colorFormGroup = new FormGroup({
        colorFormControl: new FormControl(this.nbThemeService.currentTheme),
    })
    // get colorFC(): any { return this.colorFormGroup.get('colorFormControl') }

    constructor(private nbThemeService: NbThemeService) {
        this.colorFormGroup.get('colorFormControl').valueChanges.subscribe((res) => {
            this.nbThemeService.changeTheme(res)
            // localStorage.setItem('theme-color', res)
        })
    }

    ngOnInit(): void {}
}
