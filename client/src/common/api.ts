import { environment } from 'src/environments/environment'

const apiURL = `${environment.server}/api`

export const allAPI = {
    /** Authen */
    authen_login: `${apiURL}/authen/login`,
    authen_verify_token: `${apiURL}/authen/verify-token`,

    /** Admin */
    admin_manage_users_list: `${apiURL}/users/manage-users/list`,
    admin_manage_users_get_specific_group_user: `${apiURL}/users/manage-users/list-specific-group`,
    admin_manage_users_create_user: `${apiURL}/users/manage-users/create-user`,
    admin_manage_users_delete_user: `${apiURL}/users/manage-users/delete-user`,
    admin_manage_users_edit_user: `${apiURL}/users/manage-users/edit-user`,
    admin_manage_settings_get_data_type: `${apiURL}/settings/admin-settings/get-data-type`,
    admin_manage_settings_create_data_type: `${apiURL}/settings/admin-settings/create-data-type`,
    admin_manage_settings_edit_data_type: `${apiURL}/settings/admin-settings/edit-data-type`,
    admin_manage_settings_delete_data_type: `${apiURL}/settings/admin-settings/delete-data-type`,
    admin_manage_settings_get_drop_down: `${apiURL}/settings/admin-settings/get-drop-down`,
    admin_manage_settings_create_drop_down: `${apiURL}/settings/admin-settings/create-drop-down`,
    admin_manage_settings_edit_drop_down: `${apiURL}/settings/admin-settings/edit-drop-down`,
    admin_manage_settings_delete_drop_down: `${apiURL}/settings/admin-settings/delete-drop-down`,
    admin_manage_settings_save_path: `${apiURL}/settings/admin-settings/save-path`,
    admin_manage_save_common_settings: `${apiURL}/settings/admin-settings/save-common-settings`,

    /** Office Admin */
    office_admin_manage_files_get_files: (group) => `${apiURL}/files/manage-files/get-files/${group}`,
    office_admin_manage_files_get_specific_files: `${apiURL}/files/manage-files/get-specific-files`,
    office_admin_manage_files_get_files_by_folder_id: `${apiURL}/files/manage-files/get-files-by-folder-id`,
    office_admin_manage_files_create_file: `${apiURL}/files/manage-files/create-file`,
    office_admin_manage_files_update_file: `${apiURL}/files/manage-files/update-file`,
    office_admin_manage_files_delete_file: `${apiURL}/files/manage-files/delete-file`,
    office_admin_manage_files_reverse_created_file: (id) => `${apiURL}/files/manage-files/reverse-created-file/${id}`,
    office_admin_manage_files_get_file_histories: `${apiURL}/files/manage-files/get-file-histories`,

    // office_admin_manage_settings_save_path: `${apiURL}/settings/office-settings/save-path`,
    office_admin_manage_folders_get_folders: `${apiURL}/folders/manage-folders/get-folders`,
    office_admin_manage_folders_create_folder: `${apiURL}/folders/manage-folders/create-folder`,
    office_admin_manage_folders_update_folder: `${apiURL}/folders/manage-folders/update-folder`,
    office_admin_manage_folders_delete_folder: `${apiURL}/folders/manage-folders/delete-folder`,
    office_admin_manage_file_update_temp_path: `${apiURL}/settings/office-settings/update-temp-path`,
    office_admin_manage_file_copy_file: `${apiURL}/settings/office-settings/copy-file`,
    office_admin_manage_file_upload_file_office: `${apiURL}/settings/office-settings/upload-file-office`,

    /** Office User */
    office_user_manage_files_update_file_by_authorized_user: `${apiURL}/files/update-file-by-authorized-user`,
    office_user_manage_file_update_temp_path_by_authorized_user: `${apiURL}/settings/update-temp-path-by-authorized-user`,
    office_user_manage_file_copy_file_by_authorized_user: `${apiURL}/settings/copy-file-by-authorized-user`,
    office_user_manage_folders_get_folders: `${apiURL}/folders/get-folders`,
    office_user_manage_files_get_files: (group) => `${apiURL}/files/get-files/${group}`,
    office_user_manage_files_get_file_histories: `${apiURL}/files/get-file-histories`,
    office_user_manage_files_get_specific_files: `${apiURL}/files/get-specific-files`,

    /** QC Admin */
    qc_admin_manage_drawings_search_file_by_csv: `${apiURL}/drawings/manage-drawings/search-file-by-csv`,
    // qc_admin_manage_settings_save_path: `${apiURL}/settings/qc-settings/save-path`,
    qc_admin_manage_drawings_get_drawings: `${apiURL}/drawings/manage-drawings/get-drawings`,
    qc_admin_manage_drawings_get_drawing_history: `${apiURL}/drawings/manage-drawings/get-drawing-history`,
    qc_admin_manage_drawings_create_drawing: `${apiURL}/drawings/manage-drawings/create-drawing`,
    qc_admin_manage_drawings_update_drawing: `${apiURL}/drawings/manage-drawings/update-drawing`,
    qc_admin_manage_drawings_delete_drawing: `${apiURL}/drawings/manage-drawings/delete-drawing`,
    qc_admin_manage_drawings_upload_drawing: `${apiURL}/drawings/manage-drawings/upload-drawing`,
    qc_admin_manage_drawings_check_async_drawings: `${apiURL}/drawings/manage-drawings/check-async-drawings`,
    qc_admin_manage_drawings_sync_drawings: `${apiURL}/drawings/manage-drawings/sync-drawings`,
    qc_admin_manage_drawings_add_drawing_folder: `${apiURL}/settings/qc-settings/upload-folder-qc`,
    qc_admin_manage_drawings_rename_drawing_folder: `${apiURL}/settings/qc-settings/rename-folder-qc`,
    qc_admin_manage_drawings_delete_drawing_file: `${apiURL}/settings/qc-settings/delete-file-qc`,
    qc_admin_manage_drawings_get_directory: `${apiURL}/drawings/manage-drawings/get-directory`,
    qc_admin_manage_drawings_open_drawing: (path) => `${apiURL}/files/${path}`,
    qc_admin_manage_drawings_download_drawing: (path) => `${apiURL}/files/${path}`,
    qc_admin_manage_drawings_upload_file_qc: `${apiURL}/settings/qc-settings/upload-file-qc`,

    /** QC User */
    qc_user_barcode_reader_get_parent_folders_by_only_file_name: `${apiURL}/files/get-parent-folders-by-file-name`,

    /** Messages */
    messages_manage_messages_create_message: `${apiURL}/messages/manage-messages/create-message`,
    messages_manage_messages_update_message: `${apiURL}/messages/manage-messages/update-message`,
    messages_get_messages: (group) => `${apiURL}/messages/get-messages/${group}`,
    messages_manage_messages_save_attachment: `${apiURL}/messages/manage-messages/save-attachment`,
    messages_download_attachment: `${apiURL}/messages/download-attachment`,
    messages_open_attachment: (path) => `${apiURL}/messages/open-attachment/${path}`,
    messages_open_manual: `${apiURL}/messages/open-manual`,

    /** Common Settings */
    common_settings_get_settings: `${apiURL}/settings/get-settings`,
    common_settings_get_drop_down: `${apiURL}/settings/get-drop-down`,
    common_settings_get_department: `${apiURL}/settings/get-department`,
    common_settings_get_department_en: `${apiURL}/settings/get-department-en`,

    /** Common Files */
    common_open_file: (path) => `${apiURL}/files/${path}`,
    user_change_picture: `${apiURL}/users/change-picture`,
    user_edit_profile: `${apiURL}/users/edit-profile`,
    get_users_by_id: `${apiURL}/users/get-user`,
}
