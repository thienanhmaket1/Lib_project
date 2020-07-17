import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { LoginComponent } from './login/login.component'
import { HomeComponent } from './dashboard/home/home.component'
import { OfficeComponent } from './dashboard/office/office.component'
import { CreateFolderComponent } from './dashboard/office/manage-folder/create-folder/create-folder.component'
import { UpdateFolderComponent } from './dashboard/office/manage-folder/update-folder/update-folder.component'
import { ManageFileComponent } from './dashboard/office/manage-file/manage-file.component'
import { CreateFileComponent } from './dashboard/office/manage-file/create-file/create-file.component'
import { UpdateFileComponent } from './dashboard/office/manage-file/update-file/update-file.component'
import { QcComponent } from './dashboard/qc/qc.component'
import { BarCodeReaderComponent } from './dashboard/qc/bar-code-reader/bar-code-reader.component'
import { DashboardComponent } from './dashboard/dashboard.component'
import { ManageFolderComponent } from './dashboard/office/manage-folder/manage-folder.component'
import { SearchFileComponent } from './dashboard/office/search-file/search-file.component'
import { ManageDrawingComponent } from './dashboard/qc/manage-drawing/manage-drawing.component'
import { ManageUserComponent } from './dashboard/manage-user/manage-user.component'
import { OfficeSettingsComponent } from './components/settings/office-settings/office-settings.component'
import { QcSettingsComponent } from './components/settings/qc-settings/qc-settings.component'
import { AdminGuard } from './guard/admin.guard'
import { UnauthGuard } from './guard/unauth.guard'
import { AuthGuard } from './guard/auth.guard'
import { AdminSettingsComponent } from './components/settings/admin-settings/admin-settings.component'
import { ModOfficeGuard } from './guard/modOffice.guard'
import { ModQCGuard } from './guard/modQC.guard'
import { ManageDropdownComponent } from './dashboard/manage-dropdown/manage-dropdown.component'
import { ManageHigherFolderComponent } from './dashboard/office/manage-higher-folder/manage-higher-folder.component'

const routes: Routes = [
    {
        path: 'login',
        component: LoginComponent,
        canActivate: [UnauthGuard],
    },
    // {
    //     path: 'register',
    //     component: RegisterComponent,
    // },
    {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [AuthGuard],
        children: [
            {
                path: 'home',
                component: HomeComponent,
            },
            {
                path: 'office',
                component: OfficeComponent,
                // canActivate: [ModOfficeGuard],
                children: [
                    {
                        path: 'search-file',
                        component: SearchFileComponent,
                    },
                    {
                        path: 'manage-higher-folder',
                        component: ManageHigherFolderComponent,
                        // canActivate: [ModOfficeGuard],
                    },
                    {
                        path: 'manage-folder/:folder_id',
                        component: ManageFolderComponent,
                        // canActivate: [ModOfficeGuard],
                        children: [
                            {
                                path: 'create-folder',
                                component: CreateFolderComponent,
                                canActivate: [ModOfficeGuard],
                            },
                            {
                                path: 'update-folder',
                                component: UpdateFolderComponent,
                                canActivate: [ModOfficeGuard],
                            },
                        ],
                    },
                    {
                        path: 'manage-file/:folder_id',
                        component: ManageFileComponent,
                        // canActivate: [ModOfficeGuard],
                        children: [
                            {
                                path: 'create-file',
                                component: CreateFileComponent,
                                canActivate: [ModOfficeGuard],
                            },
                            {
                                path: 'update-file',
                                component: UpdateFileComponent,
                                canActivate: [ModOfficeGuard],
                            },
                        ],
                    },
                    {
                        path: 'manage-message',
                        component: OfficeSettingsComponent,
                        canActivate: [ModOfficeGuard],
                    },
                ],
            },
            {
                path: 'qc',
                component: QcComponent,
                // canActivate: [ModQCGuard],
                children: [
                    {
                        path: 'bar-code-reader',
                        component: BarCodeReaderComponent,
                    },
                    {
                        path: 'manage-drawing',
                        component: ManageDrawingComponent,
                        // canActivate: [ModQCGuard],
                    },
                    {
                        path: 'manage-message',
                        component: QcSettingsComponent,
                        canActivate: [ModQCGuard],
                    },
                ],
            },
            {
                path: 'settings',
                children: [
                    {
                        path: 'admin',
                        component: AdminSettingsComponent,
                        canActivate: [AdminGuard],
                    },
                    {
                        path: 'manage-users',
                        component: ManageUserComponent,
                        canActivate: [AdminGuard],
                    },
                    {
                        path: 'manage-dropdowns',
                        component: ManageDropdownComponent,
                        canActivate: [AdminGuard],
                    },
                ],
            },
            {
                path: 'profile',
                component: QcComponent,
                children: [
                    {
                        path: 'bar-code-reader',
                        component: BarCodeReaderComponent,
                    },
                ],
            },
        ],
    },
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: '**', redirectTo: 'login' },
]

@NgModule({
    imports: [RouterModule.forRoot(routes)], // , { useHash: true }
    exports: [RouterModule],
})
export class AppRoutingModule {}
