--
-- PostgreSQL database dump
--

-- Dumped from database version 12.2
-- Dumped by pg_dump version 12.2

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: tbl_drawings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tbl_drawings (
    drawing_id integer NOT NULL,
    drawing_customer character varying(32),
    drawing_kouban character varying(32),
    drawing_file_name text,
    drawing_relative_path text,
    drawing_created_at timestamp with time zone DEFAULT '2020-05-11 18:04:36.402742+09'::timestamp with time zone,
    drawing_created_by text,
    drawing_updated_at timestamp with time zone,
    drawing_updated_by text,
    drawing_is_deleted boolean DEFAULT false,
    drawing_part_name text
);


ALTER TABLE public.tbl_drawings OWNER TO postgres;

--
-- Name: tbl_drawings_drawing_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tbl_drawings_drawing_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.tbl_drawings_drawing_id_seq OWNER TO postgres;

--
-- Name: tbl_drawings_drawing_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tbl_drawings_drawing_id_seq OWNED BY public.tbl_drawings.drawing_id;


--
-- Name: tbl_drawings_history; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tbl_drawings_history (
    drawing_history_id integer NOT NULL,
    drawing_id integer NOT NULL,
    drawing_customer character varying(32),
    drawing_kouban character varying(32),
    drawing_file_name text,
    drawing_relative_path text,
    drawing_created_at timestamp with time zone,
    drawing_created_by text,
    drawing_updated_at timestamp with time zone,
    drawing_updated_by text,
    drawing_is_deleted boolean DEFAULT false,
    drawing_part_name text,
    drawing_history_created_at timestamp with time zone DEFAULT '2020-05-11 18:04:36.402742+09'::timestamp with time zone,
    drawing_history_created_by text NOT NULL
);


ALTER TABLE public.tbl_drawings_history OWNER TO postgres;

--
-- Name: tbl_drawings_history_drawing_history_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tbl_drawings_history_drawing_history_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.tbl_drawings_history_drawing_history_id_seq OWNER TO postgres;

--
-- Name: tbl_drawings_history_drawing_history_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tbl_drawings_history_drawing_history_id_seq OWNED BY public.tbl_drawings_history.drawing_history_id;


--
-- Name: tbl_drop_down; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tbl_drop_down (
    drop_down_id integer NOT NULL,
    drop_down_name text,
    folder_id integer,
    drop_down_data jsonb,
    drop_down_created_at timestamp with time zone,
    drop_down_created_by text,
    drop_down_updated_at timestamp with time zone,
    drop_down_updated_by text,
    drop_down_is_deleted boolean DEFAULT false
);


ALTER TABLE public.tbl_drop_down OWNER TO postgres;

--
-- Name: tbl_drop_down_drop_down_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tbl_drop_down_drop_down_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.tbl_drop_down_drop_down_id_seq OWNER TO postgres;

--
-- Name: tbl_drop_down_drop_down_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tbl_drop_down_drop_down_id_seq OWNED BY public.tbl_drop_down.drop_down_id;


--
-- Name: tbl_files; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tbl_files (
    file_id integer NOT NULL,
    file_created_at timestamp with time zone,
    file_created_by text,
    file_updated_at timestamp with time zone,
    file_updated_by text,
    file_is_deleted boolean DEFAULT false,
    folder_id integer,
    file_properties jsonb,
    file_authorized_users text[],
    file_group text,
    file_file_name jsonb,
    file_rule_id text
);


ALTER TABLE public.tbl_files OWNER TO postgres;

--
-- Name: tbl_files_file_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tbl_files_file_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.tbl_files_file_id_seq OWNER TO postgres;

--
-- Name: tbl_files_file_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tbl_files_file_id_seq OWNED BY public.tbl_files.file_id;


--
-- Name: tbl_files_history; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tbl_files_history (
    file_history_id integer NOT NULL,
    file_id integer NOT NULL,
    file_created_at timestamp with time zone,
    file_created_by text,
    file_updated_at timestamp with time zone,
    file_updated_by text,
    file_is_deleted boolean DEFAULT false,
    folder_id integer,
    file_file_name jsonb,
    file_properties jsonb,
    file_authorized_users text[],
    file_group text,
    file_rule_id text,
    file_history_created_at timestamp with time zone,
    file_history_created_by text
);


ALTER TABLE public.tbl_files_history OWNER TO postgres;

--
-- Name: tbl_files_history_file_history_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tbl_files_history_file_history_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.tbl_files_history_file_history_id_seq OWNER TO postgres;

--
-- Name: tbl_files_history_file_history_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tbl_files_history_file_history_id_seq OWNED BY public.tbl_files_history.file_history_id;


--
-- Name: tbl_folder_folder_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tbl_folder_folder_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.tbl_folder_folder_id_seq OWNER TO postgres;

--
-- Name: tbl_folders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tbl_folders (
    folder_id integer NOT NULL,
    folder_name character varying(32),
    folder_structure jsonb,
    folder_properties jsonb,
    folder_created_at timestamp with time zone,
    folder_created_by text,
    folder_updated_at timestamp with time zone,
    folder_updated_by text,
    folder_is_deleted boolean DEFAULT false,
    folder_authorized_users text[],
    folder_term_year text,
    folder_report text,
    folder_note text,
    folder_group text,
    folder_is_show_updated_count boolean,
    folder_is_show_created_at boolean,
    folder_is_show_updated_at boolean,
    folder_can_open_file_detail boolean,
    folder_document_no text,
    folder_short_name text
);


ALTER TABLE public.tbl_folders OWNER TO postgres;

--
-- Name: tbl_folders_folder_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tbl_folders_folder_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.tbl_folders_folder_id_seq OWNER TO postgres;

--
-- Name: tbl_folders_folder_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tbl_folders_folder_id_seq OWNED BY public.tbl_folders.folder_id;


--
-- Name: tbl_messages; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tbl_messages (
    message_id integer NOT NULL,
    message_content text NOT NULL,
    created_at timestamp with time zone,
    created_by text,
    message_group text,
    updated_at timestamp with time zone,
    updated_by text,
    message_title text,
    message_attachment_name text
);


ALTER TABLE public.tbl_messages OWNER TO postgres;

--
-- Name: tbl_messages_message_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tbl_messages_message_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.tbl_messages_message_id_seq OWNER TO postgres;

--
-- Name: tbl_messages_message_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tbl_messages_message_id_seq OWNED BY public.tbl_messages.message_id;


--
-- Name: tbl_property_data_type; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tbl_property_data_type (
    property_data_type_id integer NOT NULL,
    property_data_type_name character varying(32),
    property_data_type_is_number boolean DEFAULT true,
    property_data_type_is_short_text boolean DEFAULT false,
    property_data_type_is_long_text boolean DEFAULT false,
    property_data_type_is_drop_down boolean DEFAULT false,
    property_data_type_created_at timestamp with time zone,
    property_data_type_created_by integer,
    property_data_type_updated_at timestamp with time zone,
    property_data_type_updated_by integer,
    property_data_type_is_deleted boolean DEFAULT false,
    property_data_type_drop_down_id integer
);


ALTER TABLE public.tbl_property_data_type OWNER TO postgres;

--
-- Name: tbl_property_data_type_property_data_type_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tbl_property_data_type_property_data_type_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.tbl_property_data_type_property_data_type_id_seq OWNER TO postgres;

--
-- Name: tbl_property_data_type_property_data_type_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tbl_property_data_type_property_data_type_id_seq OWNED BY public.tbl_property_data_type.property_data_type_id;


--
-- Name: tbl_settings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tbl_settings (
    settings_id integer NOT NULL,
    office_path_value text,
    qc_path_value text,
    theme_color text,
    created_by text,
    created_date timestamp with time zone,
    updated_by text,
    updated_date timestamp with time zone,
    temp_path text,
    logo_title text
);


ALTER TABLE public.tbl_settings OWNER TO postgres;

--
-- Name: tbl_settings_settings_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tbl_settings_settings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.tbl_settings_settings_id_seq OWNER TO postgres;

--
-- Name: tbl_settings_settings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tbl_settings_settings_id_seq OWNED BY public.tbl_settings.settings_id;


--
-- Name: tbl_users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tbl_users (
    user_id text DEFAULT public.uuid_generate_v4() NOT NULL,
    user_username character varying(32) NOT NULL,
    user_email text,
    user_phone character varying(21),
    user_is_deleted boolean DEFAULT false,
    user_permission_code character(2),
    user_password text,
    user_group text,
    user_salt text,
    user_iteration integer,
    user_theme text,
    user_fullname character varying(32),
    user_created_at timestamp with time zone DEFAULT now(),
    user_updated_at timestamp with time zone,
    user_authen_updated_at timestamp with time zone
);


ALTER TABLE public.tbl_users OWNER TO postgres;

--
-- Name: tbl_drawings drawing_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tbl_drawings ALTER COLUMN drawing_id SET DEFAULT nextval('public.tbl_drawings_drawing_id_seq'::regclass);


--
-- Name: tbl_drawings_history drawing_history_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tbl_drawings_history ALTER COLUMN drawing_history_id SET DEFAULT nextval('public.tbl_drawings_history_drawing_history_id_seq'::regclass);


--
-- Name: tbl_drop_down drop_down_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tbl_drop_down ALTER COLUMN drop_down_id SET DEFAULT nextval('public.tbl_drop_down_drop_down_id_seq'::regclass);


--
-- Name: tbl_files file_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tbl_files ALTER COLUMN file_id SET DEFAULT nextval('public.tbl_files_file_id_seq'::regclass);


--
-- Name: tbl_files_history file_history_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tbl_files_history ALTER COLUMN file_history_id SET DEFAULT nextval('public.tbl_files_history_file_history_id_seq'::regclass);


--
-- Name: tbl_folders folder_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tbl_folders ALTER COLUMN folder_id SET DEFAULT nextval('public.tbl_folders_folder_id_seq'::regclass);


--
-- Name: tbl_messages message_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tbl_messages ALTER COLUMN message_id SET DEFAULT nextval('public.tbl_messages_message_id_seq'::regclass);


--
-- Name: tbl_property_data_type property_data_type_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tbl_property_data_type ALTER COLUMN property_data_type_id SET DEFAULT nextval('public.tbl_property_data_type_property_data_type_id_seq'::regclass);


--
-- Name: tbl_settings settings_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tbl_settings ALTER COLUMN settings_id SET DEFAULT nextval('public.tbl_settings_settings_id_seq'::regclass);


--
-- Data for Name: tbl_drawings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tbl_drawings (drawing_id, drawing_customer, drawing_kouban, drawing_file_name, drawing_relative_path, drawing_created_at, drawing_created_by, drawing_updated_at, drawing_updated_by, drawing_is_deleted, drawing_part_name) FROM stdin;
\.


--
-- Data for Name: tbl_drawings_history; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tbl_drawings_history (drawing_history_id, drawing_id, drawing_customer, drawing_kouban, drawing_file_name, drawing_relative_path, drawing_created_at, drawing_created_by, drawing_updated_at, drawing_updated_by, drawing_is_deleted, drawing_part_name, drawing_history_created_at, drawing_history_created_by) FROM stdin;
\.


--
-- Data for Name: tbl_drop_down; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tbl_drop_down (drop_down_id, drop_down_name, folder_id, drop_down_data, drop_down_created_at, drop_down_created_by, drop_down_updated_at, drop_down_updated_by, drop_down_is_deleted) FROM stdin;
\.


--
-- Data for Name: tbl_files; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tbl_files (file_id, file_created_at, file_created_by, file_updated_at, file_updated_by, file_is_deleted, folder_id, file_properties, file_authorized_users, file_group, file_file_name, file_rule_id) FROM stdin;
\.


--
-- Data for Name: tbl_files_history; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tbl_files_history (file_history_id, file_id, file_created_at, file_created_by, file_updated_at, file_updated_by, file_is_deleted, folder_id, file_file_name, file_properties, file_authorized_users, file_group, file_rule_id, file_history_created_at, file_history_created_by) FROM stdin;
\.


--
-- Data for Name: tbl_folders; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tbl_folders (folder_id, folder_name, folder_structure, folder_properties, folder_created_at, folder_created_by, folder_updated_at, folder_updated_by, folder_is_deleted, folder_authorized_users, folder_term_year, folder_report, folder_note, folder_group, folder_is_show_updated_count, folder_is_show_created_at, folder_is_show_updated_at, folder_can_open_file_detail, folder_document_no, folder_short_name) FROM stdin;
\.


--
-- Data for Name: tbl_messages; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tbl_messages (message_id, message_content, created_at, created_by, message_group, updated_at, updated_by, message_title, message_attachment_name) FROM stdin;
\.


--
-- Data for Name: tbl_property_data_type; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tbl_property_data_type (property_data_type_id, property_data_type_name, property_data_type_is_number, property_data_type_is_short_text, property_data_type_is_long_text, property_data_type_is_drop_down, property_data_type_created_at, property_data_type_created_by, property_data_type_updated_at, property_data_type_updated_by, property_data_type_is_deleted, property_data_type_drop_down_id) FROM stdin;
\.


--
-- Data for Name: tbl_settings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tbl_settings (settings_id, office_path_value, qc_path_value, theme_color, created_by, created_date, updated_by, updated_date, temp_path, logo_title) FROM stdin;
\.


--
-- Data for Name: tbl_users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tbl_users (user_id, user_username, user_email, user_phone, user_is_deleted, user_permission_code, user_password, user_group, user_salt, user_iteration, user_theme, user_fullname, user_created_at, user_updated_at, user_authen_updated_at) FROM stdin;
\.


--
-- Name: tbl_drawings_drawing_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tbl_drawings_drawing_id_seq', 81, true);


--
-- Name: tbl_drawings_history_drawing_history_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tbl_drawings_history_drawing_history_id_seq', 12, true);


--
-- Name: tbl_drop_down_drop_down_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tbl_drop_down_drop_down_id_seq', 12, true);


--
-- Name: tbl_files_file_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tbl_files_file_id_seq', 92, true);


--
-- Name: tbl_files_history_file_history_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tbl_files_history_file_history_id_seq', 47, true);


--
-- Name: tbl_folder_folder_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tbl_folder_folder_id_seq', 1, false);


--
-- Name: tbl_folders_folder_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tbl_folders_folder_id_seq', 42, true);


--
-- Name: tbl_messages_message_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tbl_messages_message_id_seq', 40, true);


--
-- Name: tbl_property_data_type_property_data_type_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tbl_property_data_type_property_data_type_id_seq', 1, false);


--
-- Name: tbl_settings_settings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tbl_settings_settings_id_seq', 4, true);


--
-- Name: tbl_drawings_history tbl_drawings_history_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tbl_drawings_history
    ADD CONSTRAINT tbl_drawings_history_pkey PRIMARY KEY (drawing_history_id);


--
-- Name: tbl_drawings tbl_drawings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tbl_drawings
    ADD CONSTRAINT tbl_drawings_pkey PRIMARY KEY (drawing_id);


--
-- Name: tbl_drop_down tbl_drop_down_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tbl_drop_down
    ADD CONSTRAINT tbl_drop_down_pkey PRIMARY KEY (drop_down_id);


--
-- Name: tbl_files_history tbl_files_history_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tbl_files_history
    ADD CONSTRAINT tbl_files_history_pkey PRIMARY KEY (file_history_id);


--
-- Name: tbl_files tbl_files_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tbl_files
    ADD CONSTRAINT tbl_files_pkey PRIMARY KEY (file_id);


--
-- Name: tbl_folders tbl_folders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tbl_folders
    ADD CONSTRAINT tbl_folders_pkey PRIMARY KEY (folder_id);


--
-- Name: tbl_messages tbl_messages_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tbl_messages
    ADD CONSTRAINT tbl_messages_pkey PRIMARY KEY (message_id);


--
-- Name: tbl_property_data_type tbl_property_data_type_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tbl_property_data_type
    ADD CONSTRAINT tbl_property_data_type_pkey PRIMARY KEY (property_data_type_id);


--
-- Name: tbl_settings tbl_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tbl_settings
    ADD CONSTRAINT tbl_settings_pkey PRIMARY KEY (settings_id);


--
-- Name: tbl_users tbl_users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tbl_users
    ADD CONSTRAINT tbl_users_pkey PRIMARY KEY (user_id);


--
-- Name: tbl_files unique_file_rule_id; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tbl_files
    ADD CONSTRAINT unique_file_rule_id UNIQUE (file_rule_id);


--
-- Name: tbl_folders unique_folder_name; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tbl_folders
    ADD CONSTRAINT unique_folder_name UNIQUE (folder_name);


--
-- Name: tbl_users unique_user_email; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tbl_users
    ADD CONSTRAINT unique_user_email UNIQUE (user_email);


--
-- Name: tbl_users unique_user_username; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tbl_users
    ADD CONSTRAINT unique_user_username UNIQUE (user_username);


--
-- Name: tbl_drawings_drawing_file_name_unique_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX tbl_drawings_drawing_file_name_unique_idx ON public.tbl_drawings USING btree (drawing_file_name) WHERE (drawing_is_deleted = false);


--
-- PostgreSQL database dump complete
--

