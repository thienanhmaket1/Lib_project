-- 2020-04-17

    ALTER TABLE public.tbl_files
        ADD COLUMN file_group text;

-- 2020-04-19

    CREATE TABLE tbl_drawings (
        drawing_id SERIAL,
        drawing_title VARCHAR(32),
        drawing_customer VARCHAR(32),
        drawing_kouban VARCHAR(32),
        drawing_file_name VARCHAR(32),
        drawing_relative_path TEXT,
        drawing_created_at TIMESTAMP WITH TIME ZONE default 'now()',
        drawing_created_by TEXT,
        drawing_updated_at TIMESTAMP WITH TIME ZONE,
        drawing_updated_by TEXT,
        
        PRIMARY KEY (drawing_id)
    );

    -- ONLY DEMO --
    INSERT INTO tbl_drawings (drawing_title, drawing_customer, drawing_kouban, drawing_file_name) VALUES (
        'Test 1 Title', 'Test 1 Customer', 'Test 1 Kouban', 'test1filename'
    ), (
        'Test 2 Title', 'Test 2 Customer', 'Test 2 Kouban', 'test2filename'
    ), (
        'Test 3 Title', 'Test 3 Customer', 'Test 3 Kouban', 'test3filename'
    );

-- 2020-04-20

    ALTER TABLE tbl_property_data_type ADD COLUMN property_data_type_drop_down_id INTEGER;

-- 2020-04-21

    ALTER TABLE tbl_drop_down ADD COLUMN folder_id integer;

--2020-04-23

    ALTER TABLE tbl_drop_down ADD COLUMN drop_down_name character varying(32);

-- 2020-04-24

    ALTER TABLE tbl_drawings ADD COLUMN drawing_is_deleted BOOLEAN default FALSE;

    CREATE UNIQUE INDEX tbl_drawings_relative_path_file_name_unique_idx ON tbl_drawings (drawing_relative_path, drawing_file_name) WHERE drawing_is_deleted = FALSE;

-- 2020-04-27

    ALTER TABLE public.tbl_drop_down
    ALTER COLUMN drop_down_created_by TYPE text;

    ALTER TABLE public.tbl_drop_down
    ALTER COLUMN drop_down_updated_by TYPE text;

    ALTER TABLE public.tbl_drop_down
    ADD COLUMN folder_id integer;

    ALTER TABLE public.tbl_drop_down
    ADD COLUMN drop_down_name text;

    alter table tbl_drop_down alter column drop_down_updated_at drop default;
    
	alter table tbl_drop_down alter column drop_down_created_at drop default;

-- 2020-04-28

    ALTER TABLE public.tbl_messages
    ADD COLUMN updated_at timestamp with time zone;

    ALTER TABLE public.tbl_messages
    ADD COLUMN updated_by text;

-- 2020-04-29: Khang

    UPDATE tbl_messages
    SET message_group = 'admin'
    WHERE message_group = 'all';

--  2020-05-04
    ALTER TABLE public.tbl_folders
    ADD COLUMN folder_group text;

    ALTER TABLE public.tbl_folders
    ADD COLUMN folder_is_show_updated_count boolean;

    ALTER TABLE public.tbl_folders
    ADD COLUMN folder_is_show_created_at boolean;

    ALTER TABLE public.tbl_folders
    ADD COLUMN folder_is_show_updated_at boolean;

    ALTER TABLE public.tbl_folders
    ADD COLUMN folder_can_open_file_detail boolean;

-- 2020-05-05: Thien

    CREATE TABLE tbl_drawings_history (
        drawing_history_id SERIAL,
        drawing_id integer NOT NULL,
        drawing_customer character varying(32),
        drawing_kouban character varying(32),
        drawing_file_name character varying(32),
        drawing_relative_path text,
        drawing_created_at timestamp with time zone,
        drawing_created_by text,
        drawing_updated_at timestamp with time zone,
        drawing_updated_by text,
        drawing_is_deleted boolean DEFAULT false,
        drawing_part_name text,
        drawing_history_created_at timestamp with time zone DEFAULT now(),
        
        PRIMARY KEY (drawing_history_id)
    );

    DROP TABLE tbl_drawings;

    CREATE TABLE public.tbl_drawings (
        drawing_id SERIAL,
        drawing_customer character varying(32),
        drawing_kouban character varying(32),
        drawing_file_name character varying(32),
        drawing_relative_path text,
        drawing_created_at timestamp with time zone DEFAULT 'now()',
        drawing_created_by text,
        drawing_updated_at timestamp with time zone,
        drawing_updated_by text,
        drawing_is_deleted boolean DEFAULT false,
        drawing_part_name text,

        PRIMARY KEY (drawing_id)
    );

    CREATE UNIQUE INDEX tbl_drawings_drawing_file_name_unique_idx ON tbl_drawings (drawing_file_name) WHERE drawing_is_deleted = FALSE;

-- 2020-05-05: Khang

    ALTER TABLE public.tbl_folders
    ADD COLUMN folder_document_no text;
 
-- 2020-05-07: Thien Anh

    ALTER TABLE public.tbl_users
    ADD COLUMN user_theme text;

-- Khang

    ALTER TABLE public.tbl_folders
    ADD COLUMN folder_short_name text;

    ALTER TABLE public.tbl_users DROP CONSTRAINT unique_user_username_and_email;

    ALTER TABLE public.tbl_users
        ADD CONSTRAINT unique_user_username UNIQUE (user_username);

    ALTER TABLE public.tbl_users
        ADD CONSTRAINT unique_user_email UNIQUE (user_email);
        
    ALTER TABLE public.tbl_files DROP COLUMN file_file_name;

    ALTER TABLE public.tbl_files
        ADD COLUMN file_file_name jsonb;

    ALTER TABLE public.tbl_files
    ADD COLUMN file_rule_id text;

-- 2020-05-08: Khang

    ALTER TABLE public.tbl_messages
    ADD COLUMN message_title text;

    ALTER TABLE public.tbl_files
    ADD CONSTRAINT unique_file_rule_id UNIQUE (file_rule_id);

-- 2020-05-11: Khang
    ALTER TABLE public.tbl_messages
    ADD COLUMN message_attachment_name text;

    -- Table: public.tbl_files_history
    -- DROP TABLE public.tbl_file_histories;
    -- DROP TABLE public.tbl_files_history;

    CREATE TABLE public.tbl_files_history
    (
        file_history_id SERIAL,
        file_id integer NOT NULL,
        file_created_at timestamp with time zone,
        file_created_by text COLLATE pg_catalog."default",
        file_updated_at timestamp with time zone,
        file_updated_by text COLLATE pg_catalog."default",
        file_is_deleted boolean DEFAULT false,
        folder_id integer,
        file_file_name jsonb,
        file_properties jsonb,
        file_authorized_users text[] COLLATE pg_catalog."default",
        file_group text COLLATE pg_catalog."default",
        file_rule_id text COLLATE pg_catalog."default",
        file_history_created_at timestamp with time zone,
        file_history_created_by text COLLATE pg_catalog."default",
        CONSTRAINT tbl_files_history_pkey PRIMARY KEY (file_history_id)
    )

    TABLESPACE pg_default;

    ALTER TABLE public.tbl_files_history
        OWNER to postgres;

-- 2020-05-11: Thien

    ALTER TABLE public.tbl_drawings_history
    ADD COLUMN drawing_history_created_by text NOT NULL;

-- 2020-05012: Thien

    DROP TABLE tbl_drawings_history;

    CREATE TABLE tbl_drawings_history (
        drawing_history_id SERIAL,
        drawing_id integer NOT NULL,
        drawing_customer character varying(32),
        drawing_kouban character varying(32),
        drawing_file_name character varying(32),
        drawing_relative_path text,
        drawing_created_at timestamp with time zone,
        drawing_created_by text,
        drawing_updated_at timestamp with time zone,
        drawing_updated_by text,
        drawing_is_deleted boolean DEFAULT false,
        drawing_part_name text,
        drawing_history_created_at timestamp with time zone DEFAULT now(),
        drawing_history_created_by text NOT NULL,

        PRIMARY KEY (drawing_history_id)
    );

    DROP TABLE tbl_drawings;

    CREATE TABLE public.tbl_drawings (
        drawing_id SERIAL,
        drawing_customer character varying(32),
        drawing_kouban character varying(32),
        drawing_file_name character varying(32),
        drawing_relative_path text,
        drawing_created_at timestamp with time zone DEFAULT now(),
        drawing_created_by text,
        drawing_updated_at timestamp with time zone,
        drawing_updated_by text,
        drawing_is_deleted boolean DEFAULT false,
        drawing_part_name text,

        PRIMARY KEY (drawing_id)
    );

    CREATE UNIQUE INDEX tbl_drawings_drawing_file_name_unique_idx ON tbl_drawings (drawing_file_name) WHERE drawing_is_deleted = FALSE;

-- 2020-05-13: Thien

    ALTER TABLE tbl_users ADD COLUMN user_fullname VARCHAR(32);

    ALTER TABLE tbl_users DROP COLUMN user_firstname;

    ALTER TABLE tbl_users DROP COLUMN user_lastname;

-- 2020-05-15: Khang

    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
    DROP TABLE public.tbl_users;

    CREATE TABLE public.tbl_users
    (
        user_id text DEFAULT uuid_generate_v4(),
        user_username character varying(32) COLLATE pg_catalog."default" NOT NULL,
        user_email text COLLATE pg_catalog."default",
        user_phone character varying(21) COLLATE pg_catalog."default",
        user_is_deleted boolean DEFAULT false,
        user_permission_code character(2) COLLATE pg_catalog."default",
        user_password text COLLATE pg_catalog."default",
        user_group text COLLATE pg_catalog."default",
        user_salt text COLLATE pg_catalog."default",
        user_iteration integer,
        user_theme text COLLATE pg_catalog."default",
        user_fullname character varying(32) COLLATE pg_catalog."default",
        CONSTRAINT tbl_users_pkey PRIMARY KEY (user_id),
        CONSTRAINT unique_user_email UNIQUE (user_email)
    ,
        CONSTRAINT unique_user_username UNIQUE (user_username)

    )
    WITH (
        OIDS = FALSE
    )
    TABLESPACE pg_default;

    ALTER TABLE public.tbl_users
        OWNER to postgres;

    --2020-05-26: Khang 
    ALTER TABLE public.tbl_settings
    ADD COLUMN logo_title text;

    --2020-05-28: Khang
    ALTER TABLE public.tbl_users
        ADD COLUMN user_created_at timestamp with time zone DEFAULT now();

    ALTER TABLE public.tbl_users
        ADD COLUMN user_updated_at timestamp with time zone;

    ALTER TABLE public.tbl_users
        ADD COLUMN user_authen_updated_at timestamp with time zone;

    --default User: 
        --username: admin
        --password: 123456789
    INSERT INTO tbl_users (user_username, user_fullname, user_email, user_phone, user_permission_code, user_salt, user_iteration, user_password, user_group, user_theme, user_authen_updated_at)
            VAlUES ('admin', 'Admin', 'testadmin@gmail.com', '2384294829', '99',
            '1589534670162', 10, '1589534670162$10$77992cc653f8f6335e65e5c324d78cc3', 'admin', 'default', now())

    -- 2020-06-01: Khang
    ALTER TABLE public.tbl_users DROP CONSTRAINT unique_user_email;

    --2020-06-05: Khang
    ALTER TABLE public.tbl_drawings
    ALTER COLUMN drawing_file_name TYPE text COLLATE pg_catalog."default";

    --2020-06-08: Khang
    ALTER TABLE public.tbl_drawings_history
    ALTER COLUMN drawing_file_name TYPE text COLLATE pg_catalog."default";

    --2020-06-11: Khang
    ALTER TABLE public.tbl_folders
    ADD COLUMN folder_root_id integer;

    --2020-06-22: Khang
    ALTER TABLE public.tbl_files
    ADD COLUMN file_department_id integer;
    
    --2020-07-06: Khang
    ALTER TABLE public.tbl_users
    ADD COLUMN user_department_id integer;

    ALTER TABLE public.tbl_folders
    ADD COLUMN folder_setting_number json;