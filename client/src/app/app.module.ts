import { ManageDropdownComponent } from './dashboard/manage-dropdown/manage-dropdown.component'
import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'
import { HttpClientModule, HttpClient } from '@angular/common/http'
import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { LoginComponent } from './login/login.component'
import { HomeComponent } from './dashboard/home/home.component'
import { OfficeComponent } from './dashboard/office/office.component'
import { MenuComponent } from './components/menu/menu.component'
import { QcComponent } from './dashboard/qc/qc.component'
import { BarCodeReaderComponent } from './dashboard/qc/bar-code-reader/bar-code-reader.component'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import {
    NbThemeModule,
    NbLayoutModule,
    NbInputModule,
    NbButtonModule,
    NbMenuModule,
    NbCardModule,
    NbSelectModule,
    NbTreeGridModule,
    NbIconModule,
    NbDialogModule,
    NbWindowModule,
    NbToastrModule,
    NbListModule,
    NbRadioModule,
    NbToggleModule,
    NbSpinnerModule,
    NbUserModule,
    NbTooltipModule,
    NbTabsetModule,
    NbPopoverModule,
    NbCheckboxModule,
} from '@nebular/theme'
import { MatChipsModule, MatInputModule, MatIconModule } from '@angular/material'
import { NbEvaIconsModule } from '@nebular/eva-icons'
import { DashboardComponent } from './dashboard/dashboard.component'
import { ManageFolderComponent } from './dashboard/office/manage-folder/manage-folder.component'
import { SearchFileComponent } from './dashboard/office/search-file/search-file.component'
import { ReactiveFormsModule } from '@angular/forms'
import { ScannerComponent } from './components/scanner/scanner.component'
import { ManageDrawingComponent } from './dashboard/qc/manage-drawing/manage-drawing.component'
import { ManageUserComponent } from './dashboard/manage-user/manage-user.component'
import { FileDetailComponent } from './components/file-detail/file-detail.component'
import { ManageFileComponent } from './dashboard/office/manage-file/manage-file.component'
import { CreateFileComponent } from './dashboard/office/manage-file/create-file/create-file.component'
import { FolderDetailComponent } from './components/folder-detail/folder-detail.component'
import { UserDetailComponent } from './components/user-detail/user-detail.component'
import { SettingsComponent } from './components/settings/settings.component'
import { OfficeSettingsComponent } from './components/settings/office-settings/office-settings.component'
import { QcSettingsComponent } from './components/settings/qc-settings/qc-settings.component'
import { RegisterComponent } from './register/register.component'
import { FormsModule } from '@angular/forms'
import { AdminSettingsComponent } from './components/settings/admin-settings/admin-settings.component'
import { httpInterceptorProviders } from './http-interceptors/index'
import { NgxFileDropModule } from 'ngx-file-drop'
import { DatatypeComponent } from './components/settings/datatype/datatype.component'
import { DropdownDetailComponent } from './components/dropdown-detail/dropdown-detail.component'
import { DrawingDetailComponent } from './components/drawing-detail/drawing-detail.component'
import { TranslateModule, TranslateLoader } from '@ngx-translate/core'
import { TranslateHttpLoader } from '@ngx-translate/http-loader'
import { ProfileDetailComponent } from './components/profile-detail/profile-detail.component'
import { MessageDetailComponent } from './components/message-detail/message-detail.component'
import { ConfirmationComponent } from './components/confirmation/confirmation.component'
// import { ManageHigherFolderComponent } from './dashboard/office/manage-higher-folder/manage-higher-folder.component'
// import { HigherFolderDetailComponent } from './components/higher-folder-detail/higher-folder-detail.component'

export function createTranslateLoader(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json')
}
@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        HomeComponent,
        OfficeComponent,
        MenuComponent,
        QcComponent,
        BarCodeReaderComponent,
        DashboardComponent,
        ManageFolderComponent,
        ManageFileComponent,
        SearchFileComponent,
        ScannerComponent,
        ManageDrawingComponent,
        ManageUserComponent,
        FileDetailComponent,
        CreateFileComponent,
        FolderDetailComponent,
        UserDetailComponent,
        SettingsComponent,
        OfficeSettingsComponent,
        QcSettingsComponent,
        ConfirmationComponent,
        RegisterComponent,
        AdminSettingsComponent,
        DatatypeComponent,
        ManageDropdownComponent,
        ProfileDetailComponent,
        DropdownDetailComponent,
        MessageDetailComponent,
        DrawingDetailComponent,
        ProfileDetailComponent,
        MessageDetailComponent,
        ConfirmationComponent,
        // ManageHigherFolderComponent,
        // HigherFolderDetailComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        MatChipsModule,
        MatInputModule,
        MatIconModule,
        NbThemeModule.forRoot({ name: 'default' }),
        NbLayoutModule,
        NbEvaIconsModule,
        NbInputModule,
        NbButtonModule,
        NbMenuModule.forRoot(),
        NbCardModule,
        ReactiveFormsModule,
        NbSelectModule,
        NbTreeGridModule,
        NbIconModule,
        NbDialogModule.forRoot(),
        NbWindowModule.forRoot(),
        NbToastrModule.forRoot(),
        NbListModule,
        NbRadioModule,
        NbToggleModule,
        NbPopoverModule,
        HttpClientModule,
        FormsModule,
        NgxFileDropModule,
        NbSpinnerModule,
        NbUserModule,
        NbTooltipModule,
        NbTabsetModule,
        NbCheckboxModule,
        TranslateModule.forRoot({
            defaultLanguage: 'en',
            loader: {
                provide: TranslateLoader,
                useFactory: createTranslateLoader,
                deps: [HttpClient],
            },
        }),
    ],
    providers: [httpInterceptorProviders],
    bootstrap: [AppComponent],
})
export class AppModule { }
