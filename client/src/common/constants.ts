export const office = {
    file: {
        leftFakeColumns: ['no'], //  'file_rule_id'
        leftRealColumns: ['office_manage_file.file_detail.file_file_no'], // '規程要則No.'

        rightFakeColumns: [
            // 'folder_name',
            'file_updated_count',
            'file_file_name',
            'file_created_at',
            'file_updated_at',
            'file_authorized_users',
            // 'file_is_deleted',
        ],
        rightRealColumns: [
            // 'office_manage_folder.folder_detail.folder_name',
            'office_manage_file.file_detail.file_updated_count',
            'office_manage_file.file_detail.file_file_name',
            'office_manage_file.file_detail.file_created_at',
            'office_manage_file.file_detail.file_updated_at',
            'office_manage_file.file_detail.file_authorized_users',
            // 'office_manage_file.file_detail.file_is_deleted',
        ],

        hiddenColumnsInDetailUpdate: [],
        hiddenColumnsInList: [],
    },

    folder: {
        fixedFakeColumns: [
            'no',
            'higher_folder_name',
            'folder_name',
            'folder_document_no',
            'folder_created_by',
            'folder_is_show_updated_count',
            'folder_is_show_created_at',
            'folder_is_show_updated_at',
            'folder_authorized_users',
            'folder_created_at',
            'folder_short_name',
            'folder_is_deleted',
            'property_data_type',
            'property_is_show_in_list',
            'property_is_show_in_detail',
            'file_latest_update',
        ],
        fixedRealColumns: [
            'office_manage_folder.folder_detail.folder_no',
            'office_manage_folder.folder_detail.higher_folder_name',
            'office_manage_folder.folder_detail.folder_name',
            'office_manage_folder.folder_detail.folder_document_no',
            'office_manage_folder.folder_detail.folder_created_by',
            'office_manage_folder.folder_detail.folder_is_show_updated_count',
            'office_manage_folder.folder_detail.folder_is_show_created_at',
            'office_manage_folder.folder_detail.folder_is_show_updated_at',
            'office_manage_folder.folder_detail.folder_authorized_users',
            'office_manage_folder.folder_detail.folder_created_at',
            'office_manage_folder.folder_detail.folder_short_name',
            'office_manage_folder.folder_detail.folder_is_deleted',
            'office_manage_folder.folder_detail.property_data_type',
            'office_manage_folder.folder_detail.property_is_show_in_list',
            'office_manage_folder.folder_detail.property_is_show_in_detail',
            'office_manage_folder.folder_detail.file_latest_update',
        ],
        fixedColumnsWidth: [5, 5, 5, 5, 5, 5, 5, 5],

        customFakeColumns: ['folder_structure'],
        customRealColumns: ['Folder Structure'],

        hiddenColumnsInDetail: [],
        hiddenColumnsInList: [],
    },
}

export const qc = {
    drawing: {
        leftFakeColumns: ['no'],
        leftRealColumns: ['№'],

        middleFakeColumns: [
            'drawing_id',
            'drawing_file_name',
            'drawing_customer',
            'drawing_kouban',
            'drawing_part_name',
            'drawing_created_by_full_name',
            'drawing_created_at',
            'drawing_updated_count',
            'drawing_updated_by_full_name',
            'drawing_updated_at',
            // 'drawing_is_deleted',
            'drawing_relative_path',
            'drawing_created_by',
            'drawing_updated_by',
        ],
        // middleRealColumns: [
        //     'Drawing ID',
        //     'File name',
        //     'Customer',
        //     'Kouban',
        //     'Part name',
        //     'Created by',
        //     'Created at',
        //     'Update count',
        //     'Updated by',
        //     'Updated at',
        //     'Activation',
        //     'Drawing Folder',
        //     'Created By Id',
        //     'Updated By Id',
        // ],
        middleRealColumns: [
            'qc_manage_drawings.drawing_detail.drawing_id',
            'qc_manage_drawings.drawing_detail.drawing_filename',
            'qc_manage_drawings.drawing_detail.drawing_customer',
            'qc_manage_drawings.drawing_detail.drawing_kouban',
            'qc_manage_drawings.drawing_detail.drawing_part_name',
            'qc_manage_drawings.drawing_detail.drawing_created_by',
            'qc_manage_drawings.drawing_detail.drawing_created_at',
            'qc_manage_drawings.drawing_detail.drawing_updated_count',
            'qc_manage_drawings.drawing_detail.drawing_updated_by',
            'qc_manage_drawings.drawing_detail.drawing_updated_at',
            // 'qc_manage_drawings.drawing_detail.drawing_is_deleted',
            'qc_manage_drawings.drawing_detail.drawing_relative_path',
            'qc_manage_drawings.drawing_detail.drawing_created_by_id',
            'qc_manage_drawings.drawing_detail.drawing_updated_by_id',
        ],

        rightFakeColumns: [],
        rightRealColumns: [],

        hiddenColumnsInDetailUpdate: ['no', 'drawing_id', 'drawing_id', 'drawing_created_by', 'drawing_updated_by'],
        hiddenColumnsInDetailCreate: [
            'no',
            'drawing_id',
            'drawing_id',
            'drawing_created_by',
            'drawing_updated_by',
            'drawing_created_at',
            'drawing_updated_at',
            'drawing_is_deleted',
            'drawing_updated_count',
        ],
        hiddenColumnsInList: ['drawing_id', 'drawing_created_by', 'drawing_updated_by'],

        disabledColumnsInDetail: [
            'drawing_id',
            'drawing_relative_path',
            'drawing_created_by_full_name',
            'drawing_updated_by_full_name',
            'drawing_updated_count',
        ],
        disabledColumnsInList: ['drawing_id', 'drawing_relative_path', 'drawing_created_by_full_name', 'drawing_updated_by_full_name', 'drawing_updated_count'],

        toggleColumnsInDetail: ['drawing_is_deleted'],
        toggleColumnsInList: ['drawing_is_deleted'],

        fileColumnsInDetail: ['drawing_file_name'],
        fileColumnsInList: ['drawing_file_name'],

        inputColumnsInDetail: ['drawing_customer', 'drawing_kouban', 'drawing_part_name'],
        inputColumnsInList: ['drawing_customer', 'drawing_kouban', 'drawing_part_name'],

        dateTimeColumns: ['drawing_created_at', 'drawing_updated_at'],

        defaultDrawing: {
            drawing_id: -1,
            drawing_customer: '',
            drawing_kouban: '',
            drawing_file_name: '',
            drawing_part_name: '',
            drawing_relative_path: '',
            drawing_created_at: '',
            drawing_created_by: '',
            drawing_updated_at: '',
            drawing_updated_by: '',
            drawing_is_deleted: false,
            drawing_updated_count: 0,
        },
    },
}

export const permission = [
    { permission_code: '99', permission_title: 'Admin' }, // Toàn quyền
    { permission_code: '09', permission_title: 'Office' }, // Xem Thêm Xóa Sửa Office, cấp quyền Edit thư mục, file cho User
    { permission_code: '19', permission_title: 'QC Admin' }, // Xem Thêm Xóa Sửa QC, cấp quyền Edit thư mục, file cho User
    { permission_code: '11', permission_title: 'QC User' }, // Xem QC. Có thể Edit thư mục, file đc cấp quyền
]

export const defaultTopItemsEN: any = [
    {
        title: 'Home',
        link: '/dashboard/home',
        icon: 'home',
        pathMatch: 'prefix',
    },
]


export const defaultBottomItemsEN: any = [
    {
        title: 'Log Out',
        icon: 'log-out',
        id: 'log_out',
        pathMatch: 'prefix',
    },
]

export const officeUserItemsEN: any = [
    // {
    //     title: 'Office',
    //     expanded: true,
    //     children: [
    //         // {
    //         //     title: 'Search',
    //         //     link: '/dashboard/office/search-file',
    //         //     icon: 'search',
    //         //     pathMatch: 'full',
    //         // },
    //     ],
    // },
]

export const officeAdminItemsEN: any = officeUserItemsEN.concat([
    {
        title: 'Document',
        link: '/dashboard/office/manage-higher-folder', // goes into angular `routerLink`
        icon: 'folder',
        pathMatch: 'full',
    },
])

export const qcUserItemsEN: any = officeAdminItemsEN.concat([
    {
        title: 'Bookstore',
        expanded: true,
        children: [
            {
                title: 'Scan',
                link: '/dashboard/qc/bar-code-reader', // goes into angular `routerLink`
                icon: 'bar-chart',
                pathMatch: 'full',
            },
            {
                title: 'Book',
                link: '/dashboard/qc/manage-drawing', // goes into angular `routerLink`
                icon: 'book',
                pathMatch: 'full',
            },
        ],
    },
])

export const qcAdminItemsEN: any = officeAdminItemsEN.concat([
    {
        title: 'Bookstore',
        expanded: true,
        children: [
            {
                title: 'Scan',
                link: '/dashboard/qc/bar-code-reader', // goes into angular `routerLink`
                icon: 'bar-chart',
                pathMatch: 'full',
            },
            {
                title: 'Books',
                link: '/dashboard/qc/manage-drawing', // goes into angular `routerLink`
                icon: 'book',
                pathMatch: 'full',
            },
        ],
    },
])

export const adminItemsEN: any = qcAdminItemsEN.concat([
    {
        title: 'Maintenance',
        expanded: false,
        children: [
            {
                title: 'Users',
                link: '/dashboard/settings/manage-users',
                icon: 'people',
                pathMatch: 'full',
            },
            {
                title: 'Settings',
                link: '/dashboard/settings/admin',
                icon: 'settings-2',
                pathMatch: 'full',
            },
        ],
    },
])

/** JP */
export const defaultTopItemsJP: any = [
    {
        title: 'Top Page',
        link: '/dashboard/home',
        icon: 'home',
        pathMatch: 'full',
    },
]

export const defaultBottomItemsJP: any = [
    {
        title: 'ログアウト',
        icon: 'log-out',
        id: 'log_out',
        pathMatch: 'full',
    },
]

export const officeUserItemsJP: any = [
    // {
    //     title: 'オフィス',
    //     expanded: true,
    //     children: [
    //         {
    //             title: '検索',
    //             link: '/dashboard/office/search-file',
    //             icon: 'search',
    //             pathMatch: 'full',
    //         },
    //     ],
    // },
]

export const officeAdminItemsJP: any = officeUserItemsJP.concat([
    {
        title: 'Web 台帳',
        link: '/dashboard/office/manage-higher-folder', // goes into angular `routerLink`
        icon: 'folder',
        pathMatch: 'full',

        // {
        //     title: '資料',
        //     link: '/dashboard/office/manage-file',
        //     icon: 'file-text-outline',
        //     pathMatch: 'full',
        // },
        // {
        //     title: '掲示板',
        //     link: '/dashboard/office/manage-message',
        //     icon: 'bell',
        //     pathMatch: 'full',
        // },
    },
])

export const qcUserItemsJP: any = officeAdminItemsJP.concat([
    {
        title: '図面管理システム',
        expanded: true,
        children: [
            {
                title: '図面閲覧',
                link: '/dashboard/qc/bar-code-reader', // goes into angular `routerLink`
                icon: 'bar-chart',
                pathMatch: 'full',
                permission: 'qc',
            },
        ],
    },
])

export const qcAdminItemsJP: any = officeAdminItemsJP.concat([
    {
        title: '図面管理システム',
        expanded: true,
        children: [
            {
                title: '図面閲覧',
                link: '/dashboard/qc/bar-code-reader', // goes into angular `routerLink`
                icon: 'bar-chart',
                pathMatch: 'full',
                permission: 'qc',
            },
            {
                title: '図面登録',
                link: '/dashboard/qc/manage-drawing', // goes into angular `routerLink`
                icon: 'color-palette',
                pathMatch: 'full',
                permission: 'admin',
            },
        ],
    },
])

// export const qcAdminItemsJP: any = qcUserItemsJP.concat([
//     {
//         title: 'QC管理者',
//         expanded: true,
//         children: [
//             {
//                 title: '図面',
//                 link: '/dashboard/qc/manage-drawing', // goes into angular `routerLink`
//                 icon: 'color-palette',
//                 pathMatch: 'full',
//             },
//             // {
//             //     title: '掲示板',
//             //     link: '/dashboard/qc/manage-message',
//             //     icon: 'bell',
//             //     pathMatch: 'full',
//             // },
//         ],
//     },
// ])

export const adminItemsJP: any = qcAdminItemsJP.concat([
    {
        title: 'メンテナンス',
        expanded: false,
        children: [
            {
                title: 'ユーザーメンテナンス',
                link: '/dashboard/settings/manage-users',
                icon: 'people',
                pathMatch: 'full',
            },
            {
                title: 'ドロップダウン',
                link: '/dashboard/settings/manage-dropdowns',
                icon: 'arrowhead-down',
                pathMatch: 'full',
            },
            {
                title: '設定',
                link: '/dashboard/settings/admin',
                icon: 'settings-2',
                pathMatch: 'full',
            },
        ],
    },
])

/** VN */
export const defaultTopItemsVN: any = [
    {
        title: 'Trang Chủ',
        link: '/dashboard/home',
        icon: 'home',
        pathMatch: 'full',
    },
]

export const defaultBottomItemsVN: any = [
    {
        title: 'Thoát',
        icon: 'log-out',
        id: 'log_out',
        pathMatch: 'prefix',
    },
]
export const officeUserItemsVN: any = [
    // {
    //     title: 'Office',
    //     expanded: true,
    //     children: [
    //         {
    //             title: 'Tìm kiếm',
    //             link: '/dashboard/office/search-file',
    //             icon: 'search',
    //             pathMatch: 'full',
    //         },
    //     ],
    // },
]

export const officeAdminItemsVN: any = officeUserItemsVN.concat([
    {
        title: 'Quản lý tài liệu',
        link: '/dashboard/office/manage-higher-folder', // goes into angular `routerLink`
        icon: 'folder',
        pathMatch: 'full',

        // {    
        //     title: 'Quản lý file',
        //     link: '/dashboard/office/manage-file',
        //     icon: 'file-text-outline',
        //     pathMatch: 'full',
        // },
        // {
        //     title: 'Thông báo',
        //     link: '/dashboard/office/manage-message',
        //     icon: 'bell',
        //     pathMatch: 'full',
        // },
    },
])

export const qcUserItemsVN: any = officeAdminItemsVN.concat([
    {
        title: 'Hiệu sách',
        expanded: true,
        children: [
            {
                title: 'Quét',
                link: '/dashboard/qc/bar-code-reader', // goes into angular `routerLink`
                icon: 'bar-chart',
                pathMatch: 'full',
            },
            {
                title: 'Sách',
                link: '/dashboard/qc/manage-drawing', // goes into angular `routerLink`
                icon: 'book',
                pathMatch: 'full',
            },
        ],
    },
])

export const qcAdminItemsVN: any = officeAdminItemsVN.concat([
    {
        title: 'Hiệu sách',
        expanded: true,
        children: [
            {
                title: 'Quét',
                link: '/dashboard/qc/bar-code-reader', // goes into angular `routerLink`
                icon: 'bar-chart',
                pathMatch: 'full',
            },
            {
                title: 'Sách',
                link: '/dashboard/qc/manage-drawing', // goes into angular `routerLink`
                icon: 'book',
                pathMatch: 'full',
            },
        ],
    },
])

export const adminItemsVN: any = qcAdminItemsVN.concat([
    {
        title: 'Bảo trì',
        expanded: false,
        children: [
            {
                title: 'Người dùng',
                link: '/dashboard/settings/manage-users',
                icon: 'people',
                pathMatch: 'full',
            },
            {
                title: 'Cài đặt',
                link: '/dashboard/settings/admin',
                icon: 'settings-2',
                pathMatch: 'full',
            },
        ],
    },
])

export const defaultMessageConfig = {
    content: {
        value: '',
        param: '',
    },
    title: 1,
    status: 'primary',
    position: 4,
    duration: 3000,
}

export const dropdownsettings = {
    dropdown: {
        leftFakeColumns: [
            'no',
            'drop_down_name',
            'drop_down_created_at',
            'drop_down_updated_at',
            'folder_name',
            'folder_id',
        ],
        leftRealColumns: [
            'admin_manage_dropdowns.drop_down_detail.new_dropdown_no',
            'admin_manage_dropdowns.drop_down_detail.new_dropdown_name',
            'admin_manage_dropdowns.drop_down_detail.new_dropdown_created_at',
            'admin_manage_dropdowns.drop_down_detail.new_dropdown_updated_at',
            'admin_manage_dropdowns.drop_down_detail.new_dropdown_folder',
            'admin_manage_dropdowns.drop_down_detail.new_dropdown_folder',
        ],

        rightFakeColumns: ['drop_down_data'],
        rightRealColumns: ['admin_manage_dropdowns.drop_down_detail.new_dropdown_data'],
    },
}

export const defaultSetting = {
    settings_id: -1,
    office_path_value: null,
    qc_path_value: null,
    theme_color: 'default',
    created_by: null,
    created_date: new Date(),
    updated_by: null,
    updated_date: new Date(),
    temp_path: '',
}
