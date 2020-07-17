--
-- PostgreSQL database dump
--

-- Dumped from database version 11.3
-- Dumped by pg_dump version 11.3

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
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: tbl_drawings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tbl_drawings (
    drawing_id integer NOT NULL,
    drawing_customer character varying(32),
    drawing_kouban character varying(32),
    drawing_file_name text,
    drawing_relative_path text,
    drawing_created_at timestamp with time zone DEFAULT now(),
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
    drawing_history_created_at timestamp with time zone DEFAULT now(),
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
    folder_short_name text,
    folder_root_id integer
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
7	\N	\N	66T0084E.pdf	SEJ	2020-05-29 16:44:39.085621+07	5e8260ce-4761-4c1c-bea2-c09689f5b60c	\N	\N	f	\N
9	\N	\N	123456789.txt	DERS	2020-05-29 16:45:20.527496+07	5e8260ce-4761-4c1c-bea2-c09689f5b60c	\N	\N	f	\N
11	\N	\N	Jellyfish.jpg	DERS	2020-05-29 16:45:20.527496+07	5e8260ce-4761-4c1c-bea2-c09689f5b60c	\N	\N	f	\N
12	\N	\N	S__5750787.jpg	DERS	2020-05-29 16:45:20.527496+07	5e8260ce-4761-4c1c-bea2-c09689f5b60c	\N	\N	f	\N
13	\N	\N	06062006.pdf	NEV	2020-05-29 17:56:52.030432+07	5e8260ce-4761-4c1c-bea2-c09689f5b60c	\N	\N	f	\N
14	\N	\N	11223344.pdf	CUBE	2020-05-29 17:57:55.404764+07	5e8260ce-4761-4c1c-bea2-c09689f5b60c	\N	\N	f	\N
15	\N	\N	456789.pdf	CUBE	2020-05-29 17:57:55.404764+07	5e8260ce-4761-4c1c-bea2-c09689f5b60c	\N	\N	f	\N
16	\N	\N	789321.pdf	CUBE	2020-05-29 17:57:55.404764+07	5e8260ce-4761-4c1c-bea2-c09689f5b60c	\N	\N	f	\N
17	\N	\N	backupdms.sql	CUBE	2020-06-05 13:50:28.983224+07	5e8260ce-4761-4c1c-bea2-c09689f5b60c	\N	\N	f	\N
10	DERS	22P29-DERS-102-#02	DERS29-0724-A.pdf	DERS	2020-05-29 16:45:20.527496+07	5e8260ce-4761-4c1c-bea2-c09689f5b60c	\N	\N	f	Vending9-SRV
2	NKE	22P19-NKE-102-#02	NKE19-0724-A.pdf	NKE	2020-05-29 16:44:11.885976+07	5e8260ce-4761-4c1c-bea2-c09689f5b60c	\N	\N	f	Vending1
4	NKE	22P23-NKE-102-#02	NKE23-0724-A.pdf	NKE	2020-05-29 16:44:11.885976+07	5e8260ce-4761-4c1c-bea2-c09689f5b60c	\N	\N	f	Vending3
3	NKE	22P20-NKE-102-#02	NKE20-07-A.pdf	NKE	2020-05-29 16:44:11.885976+07	5e8260ce-4761-4c1c-bea2-c09689f5b60c	\N	\N	f	Vending2
6	NKE	22P29-NKE-102-#02	NKE29-0724-A.pdf	NKE	2020-05-29 16:44:11.885976+07	5e8260ce-4761-4c1c-bea2-c09689f5b60c	\N	\N	f	Vending5
5	NKE	22P25-NKE-102-#02	NKE25-0724-A.pdf	NKE	2020-05-29 16:44:11.885976+07	5e8260ce-4761-4c1c-bea2-c09689f5b60c	\N	\N	f	Vending4
8	SEJ	22P29-SEJ-102-#02	SEJ29-0724-A.pdf	SEJ	2020-05-29 16:44:39.085621+07	5e8260ce-4761-4c1c-bea2-c09689f5b60c	\N	\N	f	Vending3
18	DERS	22P29-DERS22-102-#022	DERS29-0724-A222.pdf	DERS	2020-06-17 13:08:44.123682+07	5e8260ce-4761-4c1c-bea2-c09689f5b60c	\N	\N	f	Vending9-SRV22
19	DERS	22P29-DERS11-102-#011	DERS29-0724-A1111.pdf	DERS	2020-06-17 13:08:44.12414+07	5e8260ce-4761-4c1c-bea2-c09689f5b60c	\N	\N	f	Vending9-SRV11
\.


--
-- Data for Name: tbl_drawings_history; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tbl_drawings_history (drawing_history_id, drawing_id, drawing_customer, drawing_kouban, drawing_file_name, drawing_relative_path, drawing_created_at, drawing_created_by, drawing_updated_at, drawing_updated_by, drawing_is_deleted, drawing_part_name, drawing_history_created_at, drawing_history_created_by) FROM stdin;
2	2	\N	\N	NKE19-0724-A.pdf	NKE	2020-05-29 16:44:11.885976+07	5e8260ce-4761-4c1c-bea2-c09689f5b60c	\N	\N	f	\N	2020-05-29 16:45:11.64832+07	5e8260ce-4761-4c1c-bea2-c09689f5b60c
3	3	\N	\N	NKE20-07-A.pdf	NKE	2020-05-29 16:44:11.885976+07	5e8260ce-4761-4c1c-bea2-c09689f5b60c	\N	\N	f	\N	2020-05-29 16:45:11.650501+07	5e8260ce-4761-4c1c-bea2-c09689f5b60c
4	4	\N	\N	NKE23-0724-A.pdf	NKE	2020-05-29 16:44:11.885976+07	5e8260ce-4761-4c1c-bea2-c09689f5b60c	\N	\N	f	\N	2020-05-29 16:45:11.656731+07	5e8260ce-4761-4c1c-bea2-c09689f5b60c
5	5	\N	\N	NKE25-0724-A.pdf	NKE	2020-05-29 16:44:11.885976+07	5e8260ce-4761-4c1c-bea2-c09689f5b60c	\N	\N	f	\N	2020-05-29 16:45:11.656827+07	5e8260ce-4761-4c1c-bea2-c09689f5b60c
6	6	\N	\N	NKE29-0724-A.pdf	NKE	2020-05-29 16:44:11.885976+07	5e8260ce-4761-4c1c-bea2-c09689f5b60c	\N	\N	f	\N	2020-05-29 16:45:11.659706+07	5e8260ce-4761-4c1c-bea2-c09689f5b60c
7	8	\N	\N	SEJ29-0724-A.pdf	SEJ	2020-05-29 16:44:39.085621+07	5e8260ce-4761-4c1c-bea2-c09689f5b60c	\N	\N	f	\N	2020-05-29 16:45:11.659828+07	5e8260ce-4761-4c1c-bea2-c09689f5b60c
8	2	NKE	22P19-NKE-102-#02	NKE19-0724-A.pdf	NKE	2020-05-29 16:44:11.885976+07	5e8260ce-4761-4c1c-bea2-c09689f5b60c	\N	\N	f	Vending1	2020-05-29 16:45:52.40898+07	5e8260ce-4761-4c1c-bea2-c09689f5b60c
9	4	NKE	22P23-NKE-102-#02	NKE23-0724-A.pdf	NKE	2020-05-29 16:44:11.885976+07	5e8260ce-4761-4c1c-bea2-c09689f5b60c	\N	\N	f	Vending3	2020-05-29 16:45:52.413017+07	5e8260ce-4761-4c1c-bea2-c09689f5b60c
10	3	NKE	22P20-NKE-102-#02	NKE20-07-A.pdf	NKE	2020-05-29 16:44:11.885976+07	5e8260ce-4761-4c1c-bea2-c09689f5b60c	\N	\N	f	Vending2	2020-05-29 16:45:52.413994+07	5e8260ce-4761-4c1c-bea2-c09689f5b60c
11	5	NKE	22P25-NKE-102-#02	NKE25-0724-A.pdf	NKE	2020-05-29 16:44:11.885976+07	5e8260ce-4761-4c1c-bea2-c09689f5b60c	\N	\N	f	Vending4	2020-05-29 16:45:52.418354+07	5e8260ce-4761-4c1c-bea2-c09689f5b60c
12	8	SEJ	22P29-SEJ-102-#02	SEJ29-0724-A.pdf	SEJ	2020-05-29 16:44:39.085621+07	5e8260ce-4761-4c1c-bea2-c09689f5b60c	\N	\N	f	Vending3	2020-05-29 16:45:52.418499+07	5e8260ce-4761-4c1c-bea2-c09689f5b60c
13	10	\N	\N	DERS29-0724-A.pdf	DERS	2020-05-29 16:45:20.527496+07	5e8260ce-4761-4c1c-bea2-c09689f5b60c	\N	\N	f	\N	2020-05-29 16:45:52.421149+07	5e8260ce-4761-4c1c-bea2-c09689f5b60c
14	6	NKE	22P29-NKE-102-#02	NKE29-0724-A.pdf	NKE	2020-05-29 16:44:11.885976+07	5e8260ce-4761-4c1c-bea2-c09689f5b60c	\N	\N	f	Vending5	2020-05-29 16:45:52.421472+07	5e8260ce-4761-4c1c-bea2-c09689f5b60c
15	3	NKE	22P20-NKE-102-#02	NKE20-07-A.pdf	NKE	2020-05-29 16:44:11.885976+07	5e8260ce-4761-4c1c-bea2-c09689f5b60c	\N	\N	f	Vending2	2020-06-16 11:02:44.265003+07	5e8260ce-4761-4c1c-bea2-c09689f5b60c
16	5	NKE	22P25-NKE-102-#02	NKE25-0724-A.pdf	NKE	2020-05-29 16:44:11.885976+07	5e8260ce-4761-4c1c-bea2-c09689f5b60c	\N	\N	f	Vending4	2020-06-16 11:02:44.267572+07	5e8260ce-4761-4c1c-bea2-c09689f5b60c
17	6	NKE	22P29-NKE-102-#02	NKE29-0724-A.pdf	NKE	2020-05-29 16:44:11.885976+07	5e8260ce-4761-4c1c-bea2-c09689f5b60c	\N	\N	f	Vending5	2020-06-16 11:02:44.297423+07	5e8260ce-4761-4c1c-bea2-c09689f5b60c
18	4	NKE	22P23-NKE-102-#02	NKE23-0724-A.pdf	NKE	2020-05-29 16:44:11.885976+07	5e8260ce-4761-4c1c-bea2-c09689f5b60c	\N	\N	f	Vending3	2020-06-16 11:02:44.298393+07	5e8260ce-4761-4c1c-bea2-c09689f5b60c
19	2	NKE	22P19-NKE-102-#02	NKE19-0724-A.pdf	NKE	2020-05-29 16:44:11.885976+07	5e8260ce-4761-4c1c-bea2-c09689f5b60c	\N	\N	f	Vending1	2020-06-16 11:02:44.303588+07	5e8260ce-4761-4c1c-bea2-c09689f5b60c
20	8	SEJ	22P29-SEJ-102-#02	SEJ29-0724-A.pdf	SEJ	2020-05-29 16:44:39.085621+07	5e8260ce-4761-4c1c-bea2-c09689f5b60c	\N	\N	f	Vending3	2020-06-16 11:02:44.316681+07	5e8260ce-4761-4c1c-bea2-c09689f5b60c
21	10	DERS	22P29-DERS-102-#02	DERS29-0724-A.pdf	DERS	2020-05-29 16:45:20.527496+07	5e8260ce-4761-4c1c-bea2-c09689f5b60c	\N	\N	f	Vending9-SRV	2020-06-16 11:02:44.334395+07	5e8260ce-4761-4c1c-bea2-c09689f5b60c
22	5	NKE	22P25-NKE-102-#02	NKE25-0724-A.pdf	NKE	2020-05-29 16:44:11.885976+07	5e8260ce-4761-4c1c-bea2-c09689f5b60c	\N	\N	f	Vending4	2020-06-16 11:09:25.221524+07	cc47abb1-a324-4948-82bf-aa9a28a2935c
23	2	NKE	22P19-NKE-102-#02	NKE19-0724-A.pdf	NKE	2020-05-29 16:44:11.885976+07	5e8260ce-4761-4c1c-bea2-c09689f5b60c	\N	\N	f	Vending1	2020-06-16 11:09:25.224365+07	cc47abb1-a324-4948-82bf-aa9a28a2935c
24	4	NKE	22P23-NKE-102-#02	NKE23-0724-A.pdf	NKE	2020-05-29 16:44:11.885976+07	5e8260ce-4761-4c1c-bea2-c09689f5b60c	\N	\N	f	Vending3	2020-06-16 11:09:25.233787+07	cc47abb1-a324-4948-82bf-aa9a28a2935c
25	10	DERS	22P29-DERS-102-#02	DERS29-0724-A.pdf	DERS	2020-05-29 16:45:20.527496+07	5e8260ce-4761-4c1c-bea2-c09689f5b60c	\N	\N	f	Vending9-SRV	2020-06-16 11:09:25.24997+07	cc47abb1-a324-4948-82bf-aa9a28a2935c
26	3	NKE	22P20-NKE-102-#02	NKE20-07-A.pdf	NKE	2020-05-29 16:44:11.885976+07	5e8260ce-4761-4c1c-bea2-c09689f5b60c	\N	\N	f	Vending2	2020-06-16 11:09:25.257962+07	cc47abb1-a324-4948-82bf-aa9a28a2935c
27	8	SEJ	22P29-SEJ-102-#02	SEJ29-0724-A.pdf	SEJ	2020-05-29 16:44:39.085621+07	5e8260ce-4761-4c1c-bea2-c09689f5b60c	\N	\N	f	Vending3	2020-06-16 11:09:25.265764+07	cc47abb1-a324-4948-82bf-aa9a28a2935c
28	6	NKE	22P29-NKE-102-#02	NKE29-0724-A.pdf	NKE	2020-05-29 16:44:11.885976+07	5e8260ce-4761-4c1c-bea2-c09689f5b60c	\N	\N	f	Vending5	2020-06-16 11:09:25.304957+07	cc47abb1-a324-4948-82bf-aa9a28a2935c
29	2	NKE	22P19-NKE-102-#02	NKE19-0724-A.pdf	NKE	2020-05-29 16:44:11.885976+07	5e8260ce-4761-4c1c-bea2-c09689f5b60c	\N	\N	f	Vending1	2020-06-17 13:08:44.054012+07	5e8260ce-4761-4c1c-bea2-c09689f5b60c
30	3	NKE	22P20-NKE-102-#02	NKE20-07-A.pdf	NKE	2020-05-29 16:44:11.885976+07	5e8260ce-4761-4c1c-bea2-c09689f5b60c	\N	\N	f	Vending2	2020-06-17 13:08:44.057645+07	5e8260ce-4761-4c1c-bea2-c09689f5b60c
31	4	NKE	22P23-NKE-102-#02	NKE23-0724-A.pdf	NKE	2020-05-29 16:44:11.885976+07	5e8260ce-4761-4c1c-bea2-c09689f5b60c	\N	\N	f	Vending3	2020-06-17 13:08:44.059789+07	5e8260ce-4761-4c1c-bea2-c09689f5b60c
32	5	NKE	22P25-NKE-102-#02	NKE25-0724-A.pdf	NKE	2020-05-29 16:44:11.885976+07	5e8260ce-4761-4c1c-bea2-c09689f5b60c	\N	\N	f	Vending4	2020-06-17 13:08:44.060769+07	5e8260ce-4761-4c1c-bea2-c09689f5b60c
33	6	NKE	22P29-NKE-102-#02	NKE29-0724-A.pdf	NKE	2020-05-29 16:44:11.885976+07	5e8260ce-4761-4c1c-bea2-c09689f5b60c	\N	\N	f	Vending5	2020-06-17 13:08:44.061355+07	5e8260ce-4761-4c1c-bea2-c09689f5b60c
34	8	SEJ	22P29-SEJ-102-#02	SEJ29-0724-A.pdf	SEJ	2020-05-29 16:44:39.085621+07	5e8260ce-4761-4c1c-bea2-c09689f5b60c	\N	\N	f	Vending3	2020-06-17 13:08:44.062023+07	5e8260ce-4761-4c1c-bea2-c09689f5b60c
\.


--
-- Data for Name: tbl_drop_down; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tbl_drop_down (drop_down_id, drop_down_name, folder_id, drop_down_data, drop_down_created_at, drop_down_created_by, drop_down_updated_at, drop_down_updated_by, drop_down_is_deleted) FROM stdin;
2	Bumon	2	[{"id": "1", "name": "GPS"}, {"id": "2", "name": "FAS"}, {"id": "3", "name": "SAS"}, {"id": "4", "name": "PUR"}]	2020-05-29 16:55:51.434024+07	5e8260ce-4761-4c1c-bea2-c09689f5b60c	\N	\N	f
3	Maker	2	[{"id": "1", "name": "Electronic"}, {"id": "2", "name": "LG"}, {"id": "3", "name": "Dell"}]	2020-05-29 16:56:10.286805+07	5e8260ce-4761-4c1c-bea2-c09689f5b60c	\N	\N	f
4	Customer	2	[{"id": "1", "name": "NKE"}, {"id": "2", "name": "SEJ"}, {"id": "3", "name": "DERS"}, {"id": "4", "name": "NEV"}]	2020-05-29 16:57:48.089603+07	5e8260ce-4761-4c1c-bea2-c09689f5b60c	\N	\N	f
5	Status	2	[{"id": "1", "name": "In use"}, {"id": "2", "name": "Abandoned"}]	2020-05-29 16:58:45.849549+07	5e8260ce-4761-4c1c-bea2-c09689f5b60c	\N	\N	f
\.


--
-- Data for Name: tbl_files; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tbl_files (file_id, file_created_at, file_created_by, file_updated_at, file_updated_by, file_is_deleted, folder_id, file_properties, file_authorized_users, file_group, file_file_name, file_rule_id) FROM stdin;
5	2020-05-29 17:08:29.328623+07	5e8260ce-4761-4c1c-bea2-c09689f5b60c	\N	\N	f	3	[{"id": 1, "max_width": "20", "dropdown_id": "2", "property_name": "Bumon!@#$%^&*()所管部門", "property_value": ["2"], "property_data_type": "dropdown_2", "property_is_show_in_detail": true}, {"id": 2, "max_width": 40, "property_name": "Regulation Name!@#$%^&*()規程要則 名称", "property_value": "Regulation FAS", "property_data_type": "text", "property_is_show_in_detail": true}]	{}	office	[{"id": "1", "file_name": "456789 - Copy (4).pdf", "file_title": "Regulation FAS JP"}, {"id": "2", "file_name": "456789 - Copy (5).pdf", "file_title": "Regulation FAS VN"}]	FAS-REG20-002
2	2020-05-29 17:01:18.795395+07	5e8260ce-4761-4c1c-bea2-c09689f5b60c	2020-05-29 17:27:13.501356+07	5e8260ce-4761-4c1c-bea2-c09689f5b60c	f	2	[{"id": 1, "max_width": "20", "dropdown_id": "2", "property_name": "Bumon!@#$%^&*()所管部門", "property_value": ["1"], "property_data_type": "dropdown_2", "property_is_show_in_detail": true}, {"id": 2, "max_width": 40, "property_name": "Regulation Name!@#$%^&*()規程要則 名称", "property_value": "Regulation GPS salary", "property_data_type": "text", "property_is_show_in_detail": true}]	{f14b8265-13bf-4e07-8b89-585d925ebb2c}	office	[{"id": "1", "file_name": "456789.pdf", "file_title": "Regulation GPS salary JP"}, {"id": "2", "file_name": "789321.pdf", "file_title": "Regulation GPS salary VN"}]	GPS-REG20-001
3	2020-05-29 17:02:06.697848+07	5e8260ce-4761-4c1c-bea2-c09689f5b60c	2020-05-29 17:27:22.863548+07	5e8260ce-4761-4c1c-bea2-c09689f5b60c	f	2	[{"id": 1, "max_width": "20", "dropdown_id": "2", "property_name": "Bumon!@#$%^&*()所管部門", "property_value": ["1"], "property_data_type": "dropdown_2", "property_is_show_in_detail": true}, {"id": 2, "max_width": 40, "property_name": "Regulation Name!@#$%^&*()規程要則 名称", "property_value": "Regulation GPS Rule", "property_data_type": "text", "property_is_show_in_detail": true}]	{f9e3c243-0c81-4a5a-91c3-166e4b2989a9,f14b8265-13bf-4e07-8b89-585d925ebb2c}	office	[{"id": "1", "file_name": "11223344.pdf", "file_title": "Regulation GPS Rule JP"}, {"id": "2", "file_name": "06062006.pdf", "file_title": "Regulation GPS Rule VN"}]	GPS-REG20-002
4	2020-05-29 17:07:32.164994+07	5e8260ce-4761-4c1c-bea2-c09689f5b60c	2020-05-29 17:22:45.735056+07	5e8260ce-4761-4c1c-bea2-c09689f5b60c	f	3	[{"id": 1, "max_width": "20", "dropdown_id": "2", "property_name": "Bumon!@#$%^&*()所管部門", "property_value": ["2"], "property_data_type": "dropdown_2", "property_is_show_in_detail": true}, {"id": 2, "max_width": 40, "property_name": "Regulation Name!@#$%^&*()規程要則 名称", "property_value": "Regulation FAS Rule", "property_data_type": "text", "property_is_show_in_detail": true}]	{}	office	[{"id": "1", "file_name": "456789 - Copy (2).pdf", "file_title": "Regulation FAS Rule JP"}, {"id": "2", "file_name": "456789 - Copy (3).pdf", "file_title": "Regulation FAS Rule VN"}]	FAS-REG20-001
13	2020-05-29 17:23:16.681953+07	5e8260ce-4761-4c1c-bea2-c09689f5b60c	\N	\N	f	8	[{"id": 1, "max_width": "20", "property_name": "Report Title!@#$%^&*()報告書 タイトル", "property_value": "DOC20-002  - Report Title 1", "property_data_type": "text", "property_is_show_in_detail": true}, {"id": 2, "max_width": "20", "dropdown_id": "4", "property_name": "Report To!@#$%^&*()提出先", "property_value": ["3"], "property_data_type": "dropdown_4", "property_is_show_in_detail": true}, {"id": 3, "max_width": "20", "property_name": "Containt!@#$%^&*()報告概要", "property_value": "Product management", "property_data_type": "text", "property_is_show_in_detail": true}, {"id": 4, "max_width": "20", "property_name": "Author!@#$%^&*()報告書 作成者", "property_value": "Lily", "property_data_type": "text", "property_is_show_in_detail": true}]	{}	office	[{"id": "1", "file_name": "test4.pdf", "file_title": "Product management JP"}, {"id": "2", "file_name": "test5.pdf", "file_title": "Product management VN"}]	DOC20-002
16	2020-05-29 17:26:55.249518+07	5e8260ce-4761-4c1c-bea2-c09689f5b60c	2020-05-29 17:27:05.709941+07	5e8260ce-4761-4c1c-bea2-c09689f5b60c	f	4	[{"id": 1, "max_width": "20", "dropdown_id": "2", "property_name": "Bumon!@#$%^&*()所管部門", "property_value": ["4"], "property_data_type": "dropdown_2", "property_is_show_in_detail": true}, {"id": 2, "max_width": 40, "property_name": "Regulation Name!@#$%^&*()規程要則 名称", "property_value": "Regulation PUR management", "property_data_type": "text", "property_is_show_in_detail": true}]	{f9e3c243-0c81-4a5a-91c3-166e4b2989a9}	office	[{"id": "1", "file_name": "test6.pdf", "file_title": "Regulation PUR management JP"}, {"id": "2", "file_name": "test7.pdf", "file_title": "Regulation PUR management VN"}]	PUR-REG20-001
17	2020-05-29 17:27:22.994754+07	5e8260ce-4761-4c1c-bea2-c09689f5b60c	2020-05-29 17:28:34.668422+07	5e8260ce-4761-4c1c-bea2-c09689f5b60c	f	7	[{"id": 1, "max_width": "20", "dropdown_id": "2", "property_name": "Bumon!@#$%^&*()所管部門", "property_value": ["3"], "property_data_type": "dropdown_2", "property_is_show_in_detail": true}, {"id": 2, "max_width": 40, "property_name": "Rule Name!@#$%^&*()規程要則 名称", "property_value": "Something Any", "property_data_type": "text", "property_is_show_in_detail": true}]	{}	office	[{"id": "1", "file_name": "SAS-001.pdf", "file_title": "Human Rule Management JP"}, {"id": "2", "file_name": "SAS-002.pdf", "file_title": "Human Rule Management VN"}]	SAS-RUL20-001
24	2020-05-29 17:33:00.61141+07	5e8260ce-4761-4c1c-bea2-c09689f5b60c	2020-05-29 17:33:06.867102+07	5e8260ce-4761-4c1c-bea2-c09689f5b60c	f	6	[{"id": 1, "max_width": "20", "dropdown_id": "2", "property_name": "Bumon!@#$%^&*()所管部門", "property_value": ["2"], "property_data_type": "dropdown_2", "property_is_show_in_detail": true}, {"id": 2, "max_width": 40, "property_name": "Rule Name!@#$%^&*()規程要則 名称", "property_value": "Rule outfit", "property_data_type": "text", "property_is_show_in_detail": true}]	{f9e3c243-0c81-4a5a-91c3-166e4b2989a9}	office	[{"id": "1", "file_name": "test15.pdf", "file_title": "Rule outfit JP"}, {"id": "2", "file_name": "test13.pdf", "file_title": "Rule outfit VN"}]	FAS-RUL20-002
25	2020-05-29 17:33:48.648298+07	5e8260ce-4761-4c1c-bea2-c09689f5b60c	\N	\N	f	5	[{"id": 1, "max_width": "20", "dropdown_id": "2", "property_name": "Bumon!@#$%^&*()所管部門", "property_value": ["1"], "property_data_type": "dropdown_2", "property_is_show_in_detail": true}, {"id": 2, "max_width": 40, "property_name": "Rule Name!@#$%^&*()規程要則 名称", "property_value": "Find My", "property_data_type": "text", "property_is_show_in_detail": true}]	{}	office	[{"id": "1", "file_name": "Map_Sea.pdf", "file_title": "Map Sea"}, {"id": "2", "file_name": "Map_Forest.pdf", "file_title": "Map Forest"}]	GPS-RUL20-002
12	2020-05-29 17:20:48.110689+07	5e8260ce-4761-4c1c-bea2-c09689f5b60c	2020-05-29 17:29:04.745562+07	5e8260ce-4761-4c1c-bea2-c09689f5b60c	f	8	[{"id": 1, "max_width": "20", "property_name": "Report Title!@#$%^&*()報告書 タイトル", "property_value": "DOC20-001 - Report Title 1", "property_data_type": "text", "property_is_show_in_detail": true}, {"id": 2, "max_width": "20", "dropdown_id": "4", "property_name": "Report To!@#$%^&*()提出先", "property_value": ["2"], "property_data_type": "dropdown_4", "property_is_show_in_detail": true}, {"id": 3, "max_width": "20", "property_name": "Containt!@#$%^&*()報告概要", "property_value": "Order Management", "property_data_type": "text", "property_is_show_in_detail": true}, {"id": 4, "max_width": "20", "property_name": "Author!@#$%^&*()報告書 作成者", "property_value": "Mia", "property_data_type": "text", "property_is_show_in_detail": true}]	{}	office	[{"id": "1", "file_name": "", "file_title": "Order Management JP"}, {"id": "2", "file_name": "", "file_title": "Order Management VN"}]	DOC20-001
11	2020-05-29 17:17:56.142833+07	5e8260ce-4761-4c1c-bea2-c09689f5b60c	2020-05-29 17:27:31.895115+07	5e8260ce-4761-4c1c-bea2-c09689f5b60c	f	10	[{"id": 1, "max_width": "20", "property_name": "FA Name!@#$%^&*()設備名称", "property_value": "Computer managent", "property_data_type": "text", "property_is_show_in_detail": true}, {"id": 2, "max_width": "20", "dropdown_id": "3", "property_name": "Maker!@#$%^&*()設備メーカー", "property_value": ["1"], "property_data_type": "dropdown_3", "property_is_show_in_detail": true}, {"id": 3, "max_width": "20", "dropdown_id": "2", "property_name": "Bumon!@#$%^&*()所管部門", "property_value": ["1"], "property_data_type": "dropdown_2", "property_is_show_in_detail": true}, {"id": 4, "max_width": "20", "property_name": "Depreciation years!@#$%^&*()償却年数", "property_value": "5", "property_data_type": "text", "property_is_show_in_detail": true}, {"id": 5, "max_width": "20", "property_name": "Acquisition amount!@#$%^&*()取得金額", "property_value": "1000", "property_data_type": "text", "property_is_show_in_detail": true}, {"id": 6, "max_width": "20", "dropdown_id": "5", "property_name": "Status!@#$%^&*()使用中 or  廃却済", "property_value": ["1"], "property_data_type": "dropdown_5", "property_is_show_in_detail": true}]	{f14b8265-13bf-4e07-8b89-585d925ebb2c}	office	[{"id": "1", "file_name": "NKE19-0724-A.pdf", "file_title": "Computer managent JP"}, {"id": "2", "file_name": "SEJ29-0724-A.pdf", "file_title": "Computer managent VN"}]	FA20-001
14	2020-05-29 17:25:05.706119+07	5e8260ce-4761-4c1c-bea2-c09689f5b60c	2020-05-29 17:27:36.932269+07	5e8260ce-4761-4c1c-bea2-c09689f5b60c	f	10	[{"id": 1, "max_width": "20", "property_name": "FA Name!@#$%^&*()設備名称", "property_value": "Manage moniter", "property_data_type": "text", "property_is_show_in_detail": true}, {"id": 2, "max_width": "20", "dropdown_id": "3", "property_name": "Maker!@#$%^&*()設備メーカー", "property_value": ["1"], "property_data_type": "dropdown_3", "property_is_show_in_detail": true}, {"id": 3, "max_width": "20", "dropdown_id": "2", "property_name": "Bumon!@#$%^&*()所管部門", "property_value": ["3"], "property_data_type": "dropdown_2", "property_is_show_in_detail": true}, {"id": 4, "max_width": "20", "property_name": "Depreciation years!@#$%^&*()償却年数", "property_value": "2020", "property_data_type": "text", "property_is_show_in_detail": true}, {"id": 5, "max_width": "20", "property_name": "Acquisition amount!@#$%^&*()取得金額", "property_value": "100000000", "property_data_type": "text", "property_is_show_in_detail": true}, {"id": 6, "max_width": "20", "dropdown_id": "5", "property_name": "Status!@#$%^&*()使用中 or  廃却済", "property_value": ["1"], "property_data_type": "dropdown_5", "property_is_show_in_detail": true}]	{f9e3c243-0c81-4a5a-91c3-166e4b2989a9}	office	[{"id": "1", "file_name": "test5.pdf", "file_title": "Manage moniter JP"}, {"id": "2", "file_name": "test6.pdf", "file_title": "Manage moniter VN"}]	FA20-002
20	2020-05-29 17:28:44.764553+07	5e8260ce-4761-4c1c-bea2-c09689f5b60c	\N	\N	f	4	[{"id": 1, "max_width": "20", "dropdown_id": "2", "property_name": "Bumon!@#$%^&*()所管部門", "property_value": ["4"], "property_data_type": "dropdown_2", "property_is_show_in_detail": true}, {"id": 2, "max_width": 40, "property_name": "Regulation Name!@#$%^&*()規程要則 名称", "property_value": "Regulation PUR management device", "property_data_type": "text", "property_is_show_in_detail": true}]	{}	office	[{"id": "1", "file_name": "test10.pdf", "file_title": "Regulation PUR management device JP"}, {"id": "2", "file_name": "test15.pdf", "file_title": "Regulation PUR management device VN"}]	PUR-REG20-002
21	2020-05-29 17:28:54.830775+07	5e8260ce-4761-4c1c-bea2-c09689f5b60c	\N	\N	f	7	[{"id": 1, "max_width": "20", "dropdown_id": "2", "property_name": "Bumon!@#$%^&*()所管部門", "property_value": ["3"], "property_data_type": "dropdown_2", "property_is_show_in_detail": true}, {"id": 2, "max_width": 40, "property_name": "Rule Name!@#$%^&*()規程要則 名称", "property_value": "Rule SAS", "property_data_type": "text", "property_is_show_in_detail": true}]	{}	office	[{"id": "1", "file_name": "SAS-003.pdf", "file_title": "SAS-003"}, {"id": "2", "file_name": "SAS-004.pdf", "file_title": "SAS-004"}]	SAS-RUL20-002
22	2020-05-29 17:31:41.322907+07	5e8260ce-4761-4c1c-bea2-c09689f5b60c	2020-05-29 17:31:45.795147+07	5e8260ce-4761-4c1c-bea2-c09689f5b60c	f	6	[{"id": 1, "max_width": "20", "dropdown_id": "2", "property_name": "Bumon!@#$%^&*()所管部門", "property_value": ["2"], "property_data_type": "dropdown_2", "property_is_show_in_detail": true}, {"id": 2, "max_width": 40, "property_name": "Rule Name!@#$%^&*()規程要則 名称", "property_value": "Rule Time", "property_data_type": "text", "property_is_show_in_detail": true}]	{f9e3c243-0c81-4a5a-91c3-166e4b2989a9}	office	[{"id": "1", "file_name": "test9.pdf", "file_title": "Rule Time JP"}, {"id": "2", "file_name": "test11.pdf", "file_title": "Rule Time VN"}]	FAS-RUL20-001
23	2020-05-29 17:31:47.126172+07	5e8260ce-4761-4c1c-bea2-c09689f5b60c	\N	\N	f	5	[{"id": 1, "max_width": "20", "dropdown_id": "2", "property_name": "Bumon!@#$%^&*()所管部門", "property_value": ["1"], "property_data_type": "dropdown_2", "property_is_show_in_detail": true}, {"id": 2, "max_width": 40, "property_name": "Rule Name!@#$%^&*()規程要則 名称", "property_value": "Map", "property_data_type": "text", "property_is_show_in_detail": true}]	{}	office	[{"id": "1", "file_name": "Map_JP.pdf", "file_title": "Map JP"}, {"id": "2", "file_name": "Map_VN.pdf", "file_title": "Map VN"}]	GPS-RUL20-001
26	2020-06-16 11:01:04.918076+07	5e8260ce-4761-4c1c-bea2-c09689f5b60c	\N	\N	f	9	[{"id": 1, "max_width": "20", "property_name": "Business Title", "property_value": "Softbank HRM buisiness", "property_data_type": "text", "property_is_show_in_detail": true}]	{}	office	[{"id": "1", "file_name": "BIÊN LAI CHUYỂN TIỀN Nguyet cau Khai.pdf", "file_title": "Softbank HRM buisiness JP"}, {"id": "2", "file_name": "BIÊN LAI CHUYỂN TIỀN Tri 6 2020.pdf", "file_title": "Softbank HRM buisiness VN"}]	BUS20-001
27	2020-06-16 17:05:46.789127+07	cc47abb1-a324-4948-82bf-aa9a28a2935c	\N	\N	f	9	[{"id": 1, "max_width": "20", "property_name": "Business Title", "property_value": "UERI", "property_data_type": "text", "property_is_show_in_detail": true}]	{}	office	[{"id": "1", "file_name": "Manual-start-stop-server.txt", "file_title": "sdfs"}, {"id": "2", "file_name": "", "file_title": ""}]	BUS20-002
28	2020-06-16 17:07:14.383171+07	cc47abb1-a324-4948-82bf-aa9a28a2935c	2020-06-17 13:07:44.745298+07	5e8260ce-4761-4c1c-bea2-c09689f5b60c	f	18	[{"id": 1, "max_width": "20", "property_name": "Bus2Prop", "property_value": "Prop12323", "property_data_type": "text", "property_is_show_in_detail": true}]	{}	office	[{"id": "1", "file_name": "Vietnam Airlines_10, Jun, 2020_YVVSDB_ANH TUAN LE.pdf", "file_title": "BUS220-001 JP"}, {"id": "2", "file_name": "Vietnam Airlines_09, Jun, 2020_YVVSDB_ANH TUAN LE.pdf", "file_title": "BUS220-001 VN"}]	BUS220-001
\.


--
-- Data for Name: tbl_files_history; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tbl_files_history (file_history_id, file_id, file_created_at, file_created_by, file_updated_at, file_updated_by, file_is_deleted, folder_id, file_file_name, file_properties, file_authorized_users, file_group, file_rule_id, file_history_created_at, file_history_created_by) FROM stdin;
2	3	2020-05-29 17:02:06.697848+07	5e8260ce-4761-4c1c-bea2-c09689f5b60c	\N	\N	f	2	[{"id": "1", "file_name": "11223344.pdf", "file_title": "Regulation SAS Rule JP"}, {"id": "2", "file_name": "06062006.pdf", "file_title": "Regulation SAS Rule VN"}]	[{"id": 1, "max_width": "20", "dropdown_id": "2", "property_name": "Bumon!@#$%^&*()所管部門", "property_value": ["3"], "property_data_type": "dropdown_2", "property_is_show_in_detail": true}, {"id": 2, "max_width": 40, "property_name": "Regulation Name!@#$%^&*()規程要則 名称", "property_value": "Regulation SAS Rule", "property_data_type": "text", "property_is_show_in_detail": true}]	{}	office	GPS-REG20-002	2020-05-29 17:03:08.592633+07	5e8260ce-4761-4c1c-bea2-c09689f5b60c
3	3	2020-05-29 17:02:06.697848+07	5e8260ce-4761-4c1c-bea2-c09689f5b60c	2020-05-29 17:03:08.617904+07	5e8260ce-4761-4c1c-bea2-c09689f5b60c	f	2	[{"id": "1", "file_name": "11223344.pdf", "file_title": "Regulation SAS Rule JP"}, {"id": "2", "file_name": "06062006.pdf", "file_title": "Regulation SAS Rule VN"}]	[{"id": 1, "max_width": "20", "dropdown_id": "2", "property_name": "Bumon!@#$%^&*()所管部門", "property_value": ["3"], "property_data_type": "dropdown_2", "property_is_show_in_detail": true}, {"id": 2, "max_width": 40, "property_name": "Regulation Name!@#$%^&*()規程要則 名称", "property_value": "Regulation GPS Rule", "property_data_type": "text", "property_is_show_in_detail": true}]	{}	office	GPS-REG20-002	2020-05-29 17:03:18.027006+07	5e8260ce-4761-4c1c-bea2-c09689f5b60c
4	2	2020-05-29 17:01:18.795395+07	5e8260ce-4761-4c1c-bea2-c09689f5b60c	\N	\N	f	2	[{"id": "1", "file_name": "456789.pdf", "file_title": "Regulation GPS salary JP"}, {"id": "2", "file_name": "789321.pdf", "file_title": "Regulation GPS salary VN"}]	[{"id": 1, "max_width": "20", "dropdown_id": "2", "property_name": "Bumon!@#$%^&*()所管部門", "property_value": ["2"], "property_data_type": "dropdown_2", "property_is_show_in_detail": true}, {"id": 2, "max_width": 40, "property_name": "Regulation Name!@#$%^&*()規程要則 名称", "property_value": "Regulation GPS salary", "property_data_type": "text", "property_is_show_in_detail": true}]	{}	office	GPS-REG20-001	2020-05-29 17:03:31.546138+07	5e8260ce-4761-4c1c-bea2-c09689f5b60c
5	3	2020-05-29 17:02:06.697848+07	5e8260ce-4761-4c1c-bea2-c09689f5b60c	2020-05-29 17:03:18.051827+07	5e8260ce-4761-4c1c-bea2-c09689f5b60c	f	2	[{"id": "1", "file_name": "11223344.pdf", "file_title": "Regulation GPS Rule JP"}, {"id": "2", "file_name": "06062006.pdf", "file_title": "Regulation GPS Rule VN"}]	[{"id": 1, "max_width": "20", "dropdown_id": "2", "property_name": "Bumon!@#$%^&*()所管部門", "property_value": ["3"], "property_data_type": "dropdown_2", "property_is_show_in_detail": true}, {"id": 2, "max_width": 40, "property_name": "Regulation Name!@#$%^&*()規程要則 名称", "property_value": "Regulation GPS Rule", "property_data_type": "text", "property_is_show_in_detail": true}]	{}	office	GPS-REG20-002	2020-05-29 17:03:37.672155+07	5e8260ce-4761-4c1c-bea2-c09689f5b60c
6	6	2020-05-29 17:11:05.293156+07	5e8260ce-4761-4c1c-bea2-c09689f5b60c	\N	\N	f	9	[{"id": "1", "file_name": "456789 - Copy (6) - Copy.pdf", "file_title": "Business Title 2020 JP"}, {"id": "2", "file_name": "456789 - Copy (7) - Copy.pdf", "file_title": "Business Title 2020 VN"}]	[{"id": 1, "max_width": "20", "property_name": "Business Title!@#$%^&*()業連タイトル", "property_value": "Business Title 2020", "property_data_type": "text", "property_is_show_in_detail": true}]	{}	office	BUS20-001	2020-05-29 17:14:52.209862+07	5e8260ce-4761-4c1c-bea2-c09689f5b60c
7	4	2020-05-29 17:07:32.164994+07	5e8260ce-4761-4c1c-bea2-c09689f5b60c	\N	\N	f	3	[{"id": "1", "file_name": "456789 - Copy (2).pdf", "file_title": "Regulation FAS Rule JP"}, {"id": "2", "file_name": "456789 - Copy (3).pdf", "file_title": "Regulation FAS Rule VN"}]	[{"id": 1, "max_width": "20", "dropdown_id": "2", "property_name": "Bumon!@#$%^&*()所管部門", "property_value": ["2"], "property_data_type": "dropdown_2", "property_is_show_in_detail": true}, {"id": 2, "max_width": 40, "property_name": "Regulation Name!@#$%^&*()規程要則 名称", "property_value": "Regulation FAS Rule", "property_data_type": "text", "property_is_show_in_detail": true}]	{}	office	FAS-REG20-001	2020-05-29 17:22:45.710143+07	5e8260ce-4761-4c1c-bea2-c09689f5b60c
8	14	2020-05-29 17:25:05.706119+07	5e8260ce-4761-4c1c-bea2-c09689f5b60c	\N	\N	f	10	[{"id": "1", "file_name": "test5.pdf", "file_title": "Manage moniter JP"}, {"id": "2", "file_name": "test6.pdf", "file_title": "Manage moniter VN"}]	[{"id": 1, "max_width": "20", "property_name": "FA Name!@#$%^&*()設備名称", "property_value": "Manage moniter", "property_data_type": "text", "property_is_show_in_detail": true}, {"id": 2, "max_width": "20", "dropdown_id": "3", "property_name": "Maker!@#$%^&*()設備メーカー", "property_value": ["2", "1"], "property_data_type": "dropdown_3", "property_is_show_in_detail": true}, {"id": 3, "max_width": "20", "dropdown_id": "2", "property_name": "Bumon!@#$%^&*()所管部門", "property_value": ["3"], "property_data_type": "dropdown_2", "property_is_show_in_detail": true}, {"id": 4, "max_width": "20", "property_name": "Depreciation years!@#$%^&*()償却年数", "property_value": "2020", "property_data_type": "text", "property_is_show_in_detail": true}, {"id": 5, "max_width": "20", "property_name": "Acquisition amount!@#$%^&*()取得金額", "property_value": "100000000", "property_data_type": "text", "property_is_show_in_detail": true}, {"id": 6, "max_width": "20", "dropdown_id": "5", "property_name": "Status!@#$%^&*()使用中 or  廃却済", "property_value": ["1"], "property_data_type": "dropdown_5", "property_is_show_in_detail": true}]	{}	office	FA20-002	2020-05-29 17:25:41.245637+07	5e8260ce-4761-4c1c-bea2-c09689f5b60c
9	16	2020-05-29 17:26:55.249518+07	5e8260ce-4761-4c1c-bea2-c09689f5b60c	\N	\N	f	4	[{"id": "1", "file_name": "test6.pdf", "file_title": "Regulation PUR management JP"}, {"id": "2", "file_name": "test7.pdf", "file_title": "Regulation PUR management VN"}]	[{"id": 1, "max_width": "20", "dropdown_id": "2", "property_name": "Bumon!@#$%^&*()所管部門", "property_value": ["4"], "property_data_type": "dropdown_2", "property_is_show_in_detail": true}, {"id": 2, "max_width": 40, "property_name": "Regulation Name!@#$%^&*()規程要則 名称", "property_value": "Regulation PUR management", "property_data_type": "text", "property_is_show_in_detail": true}]	{}	office	PUR-REG20-001	2020-05-29 17:27:05.684736+07	5e8260ce-4761-4c1c-bea2-c09689f5b60c
10	2	2020-05-29 17:01:18.795395+07	5e8260ce-4761-4c1c-bea2-c09689f5b60c	2020-05-29 17:03:31.570711+07	5e8260ce-4761-4c1c-bea2-c09689f5b60c	f	2	[{"id": "1", "file_name": "456789.pdf", "file_title": "Regulation GPS salary JP"}, {"id": "2", "file_name": "789321.pdf", "file_title": "Regulation GPS salary VN"}]	[{"id": 1, "max_width": "20", "dropdown_id": "2", "property_name": "Bumon!@#$%^&*()所管部門", "property_value": ["1"], "property_data_type": "dropdown_2", "property_is_show_in_detail": true}, {"id": 2, "max_width": 40, "property_name": "Regulation Name!@#$%^&*()規程要則 名称", "property_value": "Regulation GPS salary", "property_data_type": "text", "property_is_show_in_detail": true}]	{}	office	GPS-REG20-001	2020-05-29 17:27:13.4758+07	5e8260ce-4761-4c1c-bea2-c09689f5b60c
11	3	2020-05-29 17:02:06.697848+07	5e8260ce-4761-4c1c-bea2-c09689f5b60c	2020-05-29 17:03:37.697874+07	5e8260ce-4761-4c1c-bea2-c09689f5b60c	f	2	[{"id": "1", "file_name": "11223344.pdf", "file_title": "Regulation GPS Rule JP"}, {"id": "2", "file_name": "06062006.pdf", "file_title": "Regulation GPS Rule VN"}]	[{"id": 1, "max_width": "20", "dropdown_id": "2", "property_name": "Bumon!@#$%^&*()所管部門", "property_value": ["1"], "property_data_type": "dropdown_2", "property_is_show_in_detail": true}, {"id": 2, "max_width": 40, "property_name": "Regulation Name!@#$%^&*()規程要則 名称", "property_value": "Regulation GPS Rule", "property_data_type": "text", "property_is_show_in_detail": true}]	{}	office	GPS-REG20-002	2020-05-29 17:27:22.838995+07	5e8260ce-4761-4c1c-bea2-c09689f5b60c
12	11	2020-05-29 17:17:56.142833+07	5e8260ce-4761-4c1c-bea2-c09689f5b60c	\N	\N	f	10	[{"id": "1", "file_name": "NKE19-0724-A.pdf", "file_title": "Computer managent JP"}, {"id": "2", "file_name": "SEJ29-0724-A.pdf", "file_title": "Computer managent VN"}]	[{"id": 1, "max_width": "20", "property_name": "FA Name!@#$%^&*()設備名称", "property_value": "Computer managent", "property_data_type": "text", "property_is_show_in_detail": true}, {"id": 2, "max_width": "20", "dropdown_id": "3", "property_name": "Maker!@#$%^&*()設備メーカー", "property_value": ["1"], "property_data_type": "dropdown_3", "property_is_show_in_detail": true}, {"id": 3, "max_width": "20", "dropdown_id": "2", "property_name": "Bumon!@#$%^&*()所管部門", "property_value": ["1"], "property_data_type": "dropdown_2", "property_is_show_in_detail": true}, {"id": 4, "max_width": "20", "property_name": "Depreciation years!@#$%^&*()償却年数", "property_value": "5", "property_data_type": "text", "property_is_show_in_detail": true}, {"id": 5, "max_width": "20", "property_name": "Acquisition amount!@#$%^&*()取得金額", "property_value": "1000", "property_data_type": "text", "property_is_show_in_detail": true}, {"id": 6, "max_width": "20", "dropdown_id": "5", "property_name": "Status!@#$%^&*()使用中 or  廃却済", "property_value": ["1"], "property_data_type": "dropdown_5", "property_is_show_in_detail": true}]	{}	office	FA20-001	2020-05-29 17:27:31.86815+07	5e8260ce-4761-4c1c-bea2-c09689f5b60c
13	14	2020-05-29 17:25:05.706119+07	5e8260ce-4761-4c1c-bea2-c09689f5b60c	2020-05-29 17:25:41.269856+07	5e8260ce-4761-4c1c-bea2-c09689f5b60c	f	10	[{"id": "1", "file_name": "test5.pdf", "file_title": "Manage moniter JP"}, {"id": "2", "file_name": "test6.pdf", "file_title": "Manage moniter VN"}]	[{"id": 1, "max_width": "20", "property_name": "FA Name!@#$%^&*()設備名称", "property_value": "Manage moniter", "property_data_type": "text", "property_is_show_in_detail": true}, {"id": 2, "max_width": "20", "dropdown_id": "3", "property_name": "Maker!@#$%^&*()設備メーカー", "property_value": ["1"], "property_data_type": "dropdown_3", "property_is_show_in_detail": true}, {"id": 3, "max_width": "20", "dropdown_id": "2", "property_name": "Bumon!@#$%^&*()所管部門", "property_value": ["3"], "property_data_type": "dropdown_2", "property_is_show_in_detail": true}, {"id": 4, "max_width": "20", "property_name": "Depreciation years!@#$%^&*()償却年数", "property_value": "2020", "property_data_type": "text", "property_is_show_in_detail": true}, {"id": 5, "max_width": "20", "property_name": "Acquisition amount!@#$%^&*()取得金額", "property_value": "100000000", "property_data_type": "text", "property_is_show_in_detail": true}, {"id": 6, "max_width": "20", "dropdown_id": "5", "property_name": "Status!@#$%^&*()使用中 or  廃却済", "property_value": ["1"], "property_data_type": "dropdown_5", "property_is_show_in_detail": true}]	{}	office	FA20-002	2020-05-29 17:27:36.906949+07	5e8260ce-4761-4c1c-bea2-c09689f5b60c
14	17	2020-05-29 17:27:22.994754+07	5e8260ce-4761-4c1c-bea2-c09689f5b60c	\N	\N	f	7	[{"id": "1", "file_name": "SAS-001.pdf", "file_title": "SAS-001"}, {"id": "2", "file_name": "SAS-002.pdf", "file_title": "SAS-002"}]	[{"id": 1, "max_width": "20", "dropdown_id": "2", "property_name": "Bumon!@#$%^&*()所管部門", "property_value": [], "property_data_type": "dropdown_2", "property_is_show_in_detail": true}, {"id": 2, "max_width": 40, "property_name": "Rule Name!@#$%^&*()規程要則 名称", "property_value": "Something Any", "property_data_type": "text", "property_is_show_in_detail": true}]	{}	office	SAS-RUL20-001	2020-05-29 17:28:24.902892+07	5e8260ce-4761-4c1c-bea2-c09689f5b60c
15	17	2020-05-29 17:27:22.994754+07	5e8260ce-4761-4c1c-bea2-c09689f5b60c	2020-05-29 17:28:24.928083+07	5e8260ce-4761-4c1c-bea2-c09689f5b60c	f	7	[{"id": "1", "file_name": "SAS-001.pdf", "file_title": "Human Rule Management JP"}, {"id": "2", "file_name": "SAS-002.pdf", "file_title": "Human Rule Management VN"}]	[{"id": 1, "max_width": "20", "dropdown_id": "2", "property_name": "Bumon!@#$%^&*()所管部門", "property_value": [], "property_data_type": "dropdown_2", "property_is_show_in_detail": true}, {"id": 2, "max_width": 40, "property_name": "Rule Name!@#$%^&*()規程要則 名称", "property_value": "Something Any", "property_data_type": "text", "property_is_show_in_detail": true}]	{}	office	SAS-RUL20-001	2020-05-29 17:28:34.643579+07	5e8260ce-4761-4c1c-bea2-c09689f5b60c
16	12	2020-05-29 17:20:48.110689+07	5e8260ce-4761-4c1c-bea2-c09689f5b60c	\N	\N	f	8	[{"id": "1", "file_name": "", "file_title": "Order Management JP"}, {"id": "2", "file_name": "", "file_title": "Order Management VN"}]	[{"id": 1, "max_width": "20", "property_name": "Report Title!@#$%^&*()報告書 タイトル", "property_value": "DOC20-001 - Report Title 1", "property_data_type": "text", "property_is_show_in_detail": true}, {"id": 2, "max_width": "20", "dropdown_id": "4", "property_name": "Report To!@#$%^&*()提出先", "property_value": ["2", "1"], "property_data_type": "dropdown_4", "property_is_show_in_detail": true}, {"id": 3, "max_width": "20", "property_name": "Containt!@#$%^&*()報告概要", "property_value": "Order Management", "property_data_type": "text", "property_is_show_in_detail": true}, {"id": 4, "max_width": "20", "property_name": "Author!@#$%^&*()報告書 作成者", "property_value": "Mia", "property_data_type": "text", "property_is_show_in_detail": true}]	{}	office	DOC20-001	2020-05-29 17:29:04.720171+07	5e8260ce-4761-4c1c-bea2-c09689f5b60c
17	22	2020-05-29 17:31:41.322907+07	5e8260ce-4761-4c1c-bea2-c09689f5b60c	\N	\N	f	6	[{"id": "1", "file_name": "test9.pdf", "file_title": "Rule Time JP"}, {"id": "2", "file_name": "test11.pdf", "file_title": "Rule Time VN"}]	[{"id": 1, "max_width": "20", "dropdown_id": "2", "property_name": "Bumon!@#$%^&*()所管部門", "property_value": ["2"], "property_data_type": "dropdown_2", "property_is_show_in_detail": true}, {"id": 2, "max_width": 40, "property_name": "Rule Name!@#$%^&*()規程要則 名称", "property_value": "Rule Time", "property_data_type": "text", "property_is_show_in_detail": true}]	{}	office	FAS-RUL20-001	2020-05-29 17:31:45.769573+07	5e8260ce-4761-4c1c-bea2-c09689f5b60c
18	24	2020-05-29 17:33:00.61141+07	5e8260ce-4761-4c1c-bea2-c09689f5b60c	\N	\N	f	6	[{"id": "1", "file_name": "test15.pdf", "file_title": "Rule outfit JP"}, {"id": "2", "file_name": "test13.pdf", "file_title": "Rule outfit VN"}]	[{"id": 1, "max_width": "20", "dropdown_id": "2", "property_name": "Bumon!@#$%^&*()所管部門", "property_value": ["2"], "property_data_type": "dropdown_2", "property_is_show_in_detail": true}, {"id": 2, "max_width": 40, "property_name": "Rule Name!@#$%^&*()規程要則 名称", "property_value": "Rule outfit", "property_data_type": "text", "property_is_show_in_detail": true}]	{}	office	FAS-RUL20-002	2020-05-29 17:33:06.841556+07	5e8260ce-4761-4c1c-bea2-c09689f5b60c
19	7	2020-05-29 17:15:47.117127+07	5e8260ce-4761-4c1c-bea2-c09689f5b60c	\N	\N	f	9	[{"id": "1", "file_name": "", "file_title": ""}, {"id": "2", "file_name": "", "file_title": ""}]	[{"id": 1, "max_width": "20", "property_name": "Business Title!@#$%^&*()業連タイトル", "property_value": "Business Title 2019", "property_data_type": "text", "property_is_show_in_detail": true}]	{}	office	BUS20-002	2020-06-01 10:11:55.077482+07	5e8260ce-4761-4c1c-bea2-c09689f5b60c
20	7	2020-05-29 17:15:47.117127+07	5e8260ce-4761-4c1c-bea2-c09689f5b60c	2020-06-01 10:11:55.104089+07	5e8260ce-4761-4c1c-bea2-c09689f5b60c	f	9	[{"id": "1", "file_name": "bk-tbl-folder.sql", "file_title": "asdasd"}, {"id": "2", "file_name": "evidence.xlsx", "file_title": "asdasd"}]	[{"id": 1, "max_width": "20", "property_name": "Business Title!@#$%^&*()業連タイトル", "property_value": "Business Title 2019", "property_data_type": "text", "property_is_show_in_detail": true}]	{}	office	BUS20-002	2020-06-01 10:12:08.277112+07	5e8260ce-4761-4c1c-bea2-c09689f5b60c
21	7	2020-05-29 17:15:47.117127+07	5e8260ce-4761-4c1c-bea2-c09689f5b60c	2020-06-01 10:12:08.302336+07	5e8260ce-4761-4c1c-bea2-c09689f5b60c	t	9	[{"id": "1", "file_name": "", "file_title": ""}, {"id": "2", "file_name": "", "file_title": ""}]	[{"id": 1, "max_width": "20", "property_name": "Business Title!@#$%^&*()業連タイトル", "property_value": "Business Title 2019", "property_data_type": "text", "property_is_show_in_detail": true}]	{}	office	BUS20-002	2020-06-01 10:13:36.219671+07	5e8260ce-4761-4c1c-bea2-c09689f5b60c
22	7	2020-05-29 17:15:47.117127+07	5e8260ce-4761-4c1c-bea2-c09689f5b60c	2020-06-01 10:13:36.245394+07	5e8260ce-4761-4c1c-bea2-c09689f5b60c	f	9	[{"id": "1", "file_name": "", "file_title": ""}, {"id": "2", "file_name": "", "file_title": ""}]	[{"id": 1, "max_width": "20", "property_name": "Business Title!@#$%^&*()業連タイトル", "property_value": "Business Title 2019", "property_data_type": "text", "property_is_show_in_detail": true}]	{}	office	BUS20-002	2020-06-01 10:18:31.464521+07	5e8260ce-4761-4c1c-bea2-c09689f5b60c
23	6	2020-05-29 17:11:05.293156+07	5e8260ce-4761-4c1c-bea2-c09689f5b60c	2020-05-29 17:14:52.236913+07	5e8260ce-4761-4c1c-bea2-c09689f5b60c	f	9	[{"id": "1", "file_name": "test1.pdf", "file_title": "Business Title 2020 JP"}, {"id": "2", "file_name": "test2.pdf", "file_title": "Business Title 2020 VN"}]	[{"id": 1, "max_width": "20", "property_name": "Business Title!@#$%^&*()業連タイトル", "property_value": "Business Title 2020", "property_data_type": "text", "property_is_show_in_detail": true}]	{}	office	BUS20-001	2020-06-16 10:52:47.424822+07	cc47abb1-a324-4948-82bf-aa9a28a2935c
24	7	2020-05-29 17:15:47.117127+07	5e8260ce-4761-4c1c-bea2-c09689f5b60c	2020-06-01 10:18:31.490425+07	5e8260ce-4761-4c1c-bea2-c09689f5b60c	t	9	[{"id": "1", "file_name": "", "file_title": ""}, {"id": "2", "file_name": "", "file_title": ""}]	[{"id": 1, "max_width": "20", "property_name": "Business Title!@#$%^&*()業連タイトル", "property_value": "Business Title 2019", "property_data_type": "text", "property_is_show_in_detail": true}]	{}	office	BUS20-002	2020-06-16 10:54:19.667339+07	cc47abb1-a324-4948-82bf-aa9a28a2935c
25	28	2020-06-16 17:07:14.383171+07	cc47abb1-a324-4948-82bf-aa9a28a2935c	\N	\N	f	18	[{"id": "1", "file_name": "Zumen.csv", "file_title": "54345"}, {"id": "2", "file_name": "", "file_title": ""}]	[{"id": 1, "max_width": "20", "property_name": "Bus2Prop", "property_value": "Prop12323", "property_data_type": "text", "property_is_show_in_detail": true}]	{}	office	BUS220-001	2020-06-17 13:07:44.719991+07	5e8260ce-4761-4c1c-bea2-c09689f5b60c
\.


--
-- Data for Name: tbl_folders; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tbl_folders (folder_id, folder_name, folder_structure, folder_properties, folder_created_at, folder_created_by, folder_updated_at, folder_updated_by, folder_is_deleted, folder_authorized_users, folder_term_year, folder_report, folder_note, folder_group, folder_is_show_updated_count, folder_is_show_created_at, folder_is_show_updated_at, folder_can_open_file_detail, folder_document_no, folder_short_name, folder_root_id) FROM stdin;
15	Fixed Asset Book	\N	\N	2020-06-16 10:04:23.458684+07	5e8260ce-4761-4c1c-bea2-c09689f5b60c	\N	\N	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
16	Document Book	\N	\N	2020-06-16 10:04:36.806365+07	5e8260ce-4761-4c1c-bea2-c09689f5b60c	\N	\N	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
5	Rule GPS	\N	[{"id": 1, "max_width": "20", "property_name": "Bumon", "property_data_type": "dropdown_2", "property_is_show_in_list": true, "property_is_show_in_detail": true}, {"id": 2, "max_width": 40, "property_name": "Rule Name", "property_data_type": "text", "property_is_show_in_list": true, "property_is_show_in_detail": true}]	2020-05-29 17:03:41.844326+07	5e8260ce-4761-4c1c-bea2-c09689f5b60c	\N	2020-06-16 12:56:52.120769+09	f	{}	\N	\N	\N	\N	t	t	t	\N	Rule ID	GPS-RUL	12
14	Business Book	\N	\N	2020-06-16 10:03:15.011918+07	5e8260ce-4761-4c1c-bea2-c09689f5b60c	2020-06-16 10:58:08.575974+07	5e8260ce-4761-4c1c-bea2-c09689f5b60c	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
3	Regulation FAS	\N	[{"id": 1, "max_width": "20", "property_name": "Bumon", "property_data_type": "dropdown_2", "property_is_show_in_list": true, "property_is_show_in_detail": true}, {"id": 2, "max_width": 40, "property_name": "Regulation Name", "property_data_type": "text", "property_is_show_in_list": true, "property_is_show_in_detail": true}]	2020-05-29 17:01:55.09981+07	5e8260ce-4761-4c1c-bea2-c09689f5b60c	\N	2020-06-16 12:55:47.477435+09	f	{}	\N	\N	\N	\N	t	t	t	\N	Regulation ID	FAS-REG	11
11	Regulation Book	\N	\N	2020-06-16 10:01:36.883998+07	5e8260ce-4761-4c1c-bea2-c09689f5b60c	2020-06-16 10:42:29.178963+07	cc47abb1-a324-4948-82bf-aa9a28a2935c	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
2	Regulation GPS	\N	[{"id": 1, "max_width": "20", "property_name": "Bumon", "property_data_type": "dropdown_2", "property_is_show_in_list": true, "property_is_show_in_detail": true}, {"id": 2, "max_width": 40, "property_name": "Regulation Name", "property_data_type": "text", "property_is_show_in_list": true, "property_is_show_in_detail": true}]	2020-05-29 16:55:16.273151+07	5e8260ce-4761-4c1c-bea2-c09689f5b60c	\N	2020-06-16 12:56:03.562118+09	f	{}	\N	\N	\N	\N	t	t	t	\N	Regulation ID	GPS-REG	11
4	Regulation PUR	\N	[{"id": 1, "max_width": "20", "property_name": "Bumon", "property_data_type": "dropdown_2", "property_is_show_in_list": true, "property_is_show_in_detail": true}, {"id": 2, "max_width": 40, "property_name": "Regulation Name", "property_data_type": "text", "property_is_show_in_list": true, "property_is_show_in_detail": true}]	2020-05-29 17:02:54.578269+07	5e8260ce-4761-4c1c-bea2-c09689f5b60c	\N	2020-06-16 12:56:14.920346+09	f	{}	\N	\N	\N	\N	t	t	t	\N	Regulation ID	PUR-REG	11
12	Rule Book	\N	\N	2020-06-16 10:02:09.208985+07	5e8260ce-4761-4c1c-bea2-c09689f5b60c	2020-06-16 10:42:43.092611+07	cc47abb1-a324-4948-82bf-aa9a28a2935c	f	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
9	Business	\N	[{"id": 1, "max_width": "20", "property_name": "Business Title", "property_data_type": "text", "property_is_show_in_list": true, "property_is_show_in_detail": true}]	2020-05-29 17:07:57.264423+07	5e8260ce-4761-4c1c-bea2-c09689f5b60c	\N	2020-06-16 12:45:08.502533+09	f	{}	\N	\N	\N	\N	f	t	f	\N	Business ID	BUS	14
10	Fixed Asset	\N	[{"id": 1, "max_width": "20", "property_name": "FA Name", "property_data_type": "text", "property_is_show_in_list": true, "property_is_show_in_detail": true}, {"id": 2, "max_width": "20", "property_name": "Maker", "property_data_type": "dropdown_3", "property_is_show_in_list": true, "property_is_show_in_detail": true}, {"id": 3, "max_width": "20", "property_name": "Bumon", "property_data_type": "dropdown_2", "property_is_show_in_list": true, "property_is_show_in_detail": true}, {"id": 4, "max_width": "20", "property_name": "Depreciation years", "property_data_type": "text", "property_is_show_in_list": true, "property_is_show_in_detail": true}, {"id": 5, "max_width": "20", "property_name": "Acquisition amount", "property_data_type": "text", "property_is_show_in_list": true, "property_is_show_in_detail": true}, {"id": 6, "max_width": "20", "property_name": "Status", "property_data_type": "dropdown_5", "property_is_show_in_list": true, "property_is_show_in_detail": true}]	2020-05-29 17:12:09.465586+07	5e8260ce-4761-4c1c-bea2-c09689f5b60c	\N	2020-06-16 12:46:30.669838+09	f	{}	\N	\N	\N	\N	f	t	f	\N	Fixed asset ID	FA	15
6	Rule FAS	\N	[{"id": 1, "max_width": "20", "property_name": "Bumon", "property_data_type": "dropdown_2", "property_is_show_in_list": true, "property_is_show_in_detail": true}, {"id": 2, "max_width": 40, "property_name": "Rule Name", "property_data_type": "text", "property_is_show_in_list": true, "property_is_show_in_detail": true}]	2020-05-29 17:04:27.861218+07	5e8260ce-4761-4c1c-bea2-c09689f5b60c	\N	2020-06-16 12:56:41.670689+09	f	{}	\N	\N	\N	\N	t	t	t	\N	Rule ID	FAS-RUL	12
8	Document	\N	[{"id": 1, "max_width": "20", "property_name": "Report Title", "property_data_type": "text", "property_is_show_in_list": true, "property_is_show_in_detail": true}, {"id": 2, "max_width": "20", "property_name": "Report To", "property_data_type": "dropdown_4", "property_is_show_in_list": true, "property_is_show_in_detail": true}, {"id": 3, "max_width": "20", "property_name": "Containt", "property_data_type": "text", "property_is_show_in_list": true, "property_is_show_in_detail": true}, {"id": 4, "max_width": "20", "property_name": "Author", "property_data_type": "text", "property_is_show_in_list": true, "property_is_show_in_detail": true}]	2020-05-29 17:07:06.408244+07	5e8260ce-4761-4c1c-bea2-c09689f5b60c	\N	2020-06-16 12:45:36.883608+09	f	{}	\N	\N	\N	\N	t	t	t	\N	Document ID	DOC	16
7	Rule SAS	\N	[{"id": 1, "max_width": "20", "property_name": "Bumon", "property_data_type": "dropdown_2", "property_is_show_in_list": true, "property_is_show_in_detail": true}, {"id": 2, "max_width": 40, "property_name": "Rule Name", "property_data_type": "text", "property_is_show_in_list": true, "property_is_show_in_detail": true}]	2020-05-29 17:05:10.978221+07	5e8260ce-4761-4c1c-bea2-c09689f5b60c	\N	2020-06-16 12:57:02.697664+09	f	{}	\N	\N	\N	\N	t	t	t	\N	Rule ID	SAS-RUL	12
18	Business 2	\N	[{"id": 1, "max_width": "20", "property_name": "Bus2Prop", "property_data_type": "text", "property_is_show_in_list": true, "property_is_show_in_detail": true}]	2020-06-16 17:06:48.84687+07	cc47abb1-a324-4948-82bf-aa9a28a2935c	\N	\N	f	{}	\N	\N	\N	\N	t	t	t	\N	QWE	BUS2	14
17	Testdsfsd	\N	\N	2020-06-16 16:20:01.095178+07	cc47abb1-a324-4948-82bf-aa9a28a2935c	2020-06-16 16:23:41.503027+07	cc47abb1-a324-4948-82bf-aa9a28a2935c	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
\.


--
-- Data for Name: tbl_messages; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tbl_messages (message_id, message_content, created_at, created_by, message_group, updated_at, updated_by, message_title, message_attachment_name) FROM stdin;
36	Welcome	2020-06-17 09:35:13.269846+07	\N	admin	\N	\N	Welcome	\N
37	Welcome to Bac Ninh Nissin Electric Tien Son\nSon Son Son	2020-06-17 13:06:30.505466+07	5e8260ce-4761-4c1c-bea2-c09689f5b60c	admin	\N	\N	Welcome to Bac Ninh Nissin Electric	dms_favicon.ico
38	Its a joke.hahaha.☺️	2020-06-17 16:26:46.39513+07	5e8260ce-4761-4c1c-bea2-c09689f5b60c	admin	\N	\N	Emergency (D1-2 Macine destroyed 	\N
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
2	F:\\dms\\office	F:\\dms\\qc	default	\N	\N	cc47abb1-a324-4948-82bf-aa9a28a2935c	2020-06-17 11:42:16.322774+07	F:\\dms\\office/Business 2	\N
\.


--
-- Data for Name: tbl_users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tbl_users (user_id, user_username, user_email, user_phone, user_is_deleted, user_permission_code, user_password, user_group, user_salt, user_iteration, user_theme, user_fullname, user_created_at, user_updated_at, user_authen_updated_at) FROM stdin;
bfc18e2b-231b-4b57-aacc-52b2f12975a6	qcadmin	qcadmin@emailaddress.com	011635464545	f	19	1590746101484$10$5e1f5c6e91c54687d54eb6be3b503050	qc	1590746101484	10	default	QC Admin	2020-05-29 16:55:01.508138+07	\N	2020-05-29 16:55:01.508138+07
aa69166d-f10c-4383-8e65-f92dffa9d295	qcuser	qcuser@emailaddress.com	0123456789	f	11	1590746171921$10$8496b22e8079f2632294befa7cbd26b8	qc	1590746171921	10	default	QC User	2020-05-29 16:55:32.890529+07	\N	2020-05-29 16:56:11.944753+07
f9e3c243-0c81-4a5a-91c3-166e4b2989a9	officeadmin	officeadmin@emailaddress.com	0123456789	f	09	1590746032746$10$d21f277121d853dacdfa175be6f661ce	office	1590746032746	10	default	Office Admin	2020-05-29 16:53:52.770159+07	\N	2020-05-29 16:53:52.770159+07
cc47abb1-a324-4948-82bf-aa9a28a2935c	superuser	superuser@emailadress.com	014861218	f	99	1591612985616$10$e5bc790eb1a58289effc4ccfba75abbd	admin	1591612985616	10	default	Super User	2020-06-08 17:43:05.641043+07	\N	2020-06-08 17:43:05.641043+07
5e8260ce-4761-4c1c-bea2-c09689f5b60c	admin	testadmin@gmail.com	2384294829555	f	99	1590746200922$10$2560914b60d7301d71e45fdd995b5bb6	admin	1590749367925	10	default	Admin	2020-05-29 16:40:34.408978+07	\N	2020-05-29 16:56:40.944319+07
f14b8265-13bf-4e07-8b89-585d925ebb2c	officeuser	officeuser@emailaddress.com	0123456789	t	01	1590746064116$10$aab4599197fb80df2279946a28f1a0f0	office	1590746064116	10	default	Office User	2020-05-29 16:54:24.14051+07	\N	2020-05-29 16:54:24.14051+07
\.


--
-- Name: tbl_drawings_drawing_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tbl_drawings_drawing_id_seq', 19, true);


--
-- Name: tbl_drawings_history_drawing_history_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tbl_drawings_history_drawing_history_id_seq', 34, true);


--
-- Name: tbl_drop_down_drop_down_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tbl_drop_down_drop_down_id_seq', 5, true);


--
-- Name: tbl_files_file_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tbl_files_file_id_seq', 28, true);


--
-- Name: tbl_files_history_file_history_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tbl_files_history_file_history_id_seq', 25, true);


--
-- Name: tbl_folder_folder_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tbl_folder_folder_id_seq', 1, false);


--
-- Name: tbl_folders_folder_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tbl_folders_folder_id_seq', 18, true);


--
-- Name: tbl_messages_message_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tbl_messages_message_id_seq', 38, true);


--
-- Name: tbl_property_data_type_property_data_type_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tbl_property_data_type_property_data_type_id_seq', 1, false);


--
-- Name: tbl_settings_settings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tbl_settings_settings_id_seq', 2, true);


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

