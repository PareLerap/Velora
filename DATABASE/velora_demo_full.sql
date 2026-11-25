--
-- PostgreSQL database dump
--

\restrict H3s3EgHunssU8XbT8rDTLvWMO9CyzhQ1EXAHW0R6wOumapNGgMLnL5HVXGfdTJU

-- Dumped from database version 18.6
-- Dumped by pg_dump version 18.6

-- Started on 2026-11-25 09:13:06

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 230 (class 1259 OID 36318)
-- Name: cart_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.cart_items (
    id integer NOT NULL,
    cart_id integer NOT NULL,
    product_id integer NOT NULL,
    quantity integer DEFAULT 1,
    CONSTRAINT cart_items_quantity_check CHECK ((quantity > 0))
);


--
-- TOC entry 229 (class 1259 OID 36317)
-- Name: cart_items_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.cart_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5142 (class 0 OID 0)
-- Dependencies: 229
-- Name: cart_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.cart_items_id_seq OWNED BY public.cart_items.id;


--
-- TOC entry 228 (class 1259 OID 36301)
-- Name: carts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.carts (
    id integer NOT NULL,
    user_id integer NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- TOC entry 227 (class 1259 OID 36300)
-- Name: carts_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.carts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5143 (class 0 OID 0)
-- Dependencies: 227
-- Name: carts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.carts_id_seq OWNED BY public.carts.id;


--
-- TOC entry 224 (class 1259 OID 36257)
-- Name: categories; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.categories (
    id integer NOT NULL,
    category_name character varying(100) NOT NULL,
    description text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- TOC entry 223 (class 1259 OID 36256)
-- Name: categories_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5144 (class 0 OID 0)
-- Dependencies: 223
-- Name: categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.categories_id_seq OWNED BY public.categories.id;


--
-- TOC entry 234 (class 1259 OID 36361)
-- Name: order_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.order_items (
    id integer NOT NULL,
    order_id integer NOT NULL,
    product_id integer NOT NULL,
    quantity integer NOT NULL,
    price numeric(12,2) NOT NULL,
    CONSTRAINT order_items_price_check CHECK ((price >= (0)::numeric)),
    CONSTRAINT order_items_quantity_check CHECK ((quantity > 0))
);


--
-- TOC entry 233 (class 1259 OID 36360)
-- Name: order_items_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.order_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5145 (class 0 OID 0)
-- Dependencies: 233
-- Name: order_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.order_items_id_seq OWNED BY public.order_items.id;


--
-- TOC entry 232 (class 1259 OID 36342)
-- Name: orders; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.orders (
    id integer NOT NULL,
    user_id integer NOT NULL,
    total_price numeric(12,2) NOT NULL,
    status character varying(30) DEFAULT 'pending'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    store_id integer,
    CONSTRAINT orders_status_check CHECK (((status)::text = ANY ((ARRAY['pending'::character varying, 'processing'::character varying, 'shipped'::character varying, 'completed'::character varying, 'cancelled'::character varying])::text[]))),
    CONSTRAINT orders_total_price_check CHECK ((total_price >= (0)::numeric))
);


--
-- TOC entry 231 (class 1259 OID 36341)
-- Name: orders_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.orders_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5146 (class 0 OID 0)
-- Dependencies: 231
-- Name: orders_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.orders_id_seq OWNED BY public.orders.id;


--
-- TOC entry 226 (class 1259 OID 36271)
-- Name: products; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.products (
    id integer NOT NULL,
    store_id integer NOT NULL,
    category_id integer NOT NULL,
    product_name character varying(150) NOT NULL,
    description text,
    price numeric(12,2) NOT NULL,
    stock integer DEFAULT 0,
    status character varying(20) DEFAULT 'active'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    image_url text,
    CONSTRAINT products_price_check CHECK ((price >= (0)::numeric)),
    CONSTRAINT products_status_check CHECK (((status)::text = ANY ((ARRAY['active'::character varying, 'inactive'::character varying])::text[]))),
    CONSTRAINT products_stock_check CHECK ((stock >= 0))
);


--
-- TOC entry 225 (class 1259 OID 36270)
-- Name: products_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.products_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5147 (class 0 OID 0)
-- Dependencies: 225
-- Name: products_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.products_id_seq OWNED BY public.products.id;


--
-- TOC entry 236 (class 1259 OID 36385)
-- Name: reviews; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.reviews (
    id integer NOT NULL,
    user_id integer NOT NULL,
    product_id integer NOT NULL,
    order_id integer NOT NULL,
    rating integer NOT NULL,
    comment text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT reviews_rating_check CHECK (((rating >= 1) AND (rating <= 5)))
);


--
-- TOC entry 235 (class 1259 OID 36384)
-- Name: reviews_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.reviews_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5148 (class 0 OID 0)
-- Dependencies: 235
-- Name: reviews_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.reviews_id_seq OWNED BY public.reviews.id;


--
-- TOC entry 222 (class 1259 OID 36235)
-- Name: stores; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.stores (
    id integer NOT NULL,
    user_id integer NOT NULL,
    store_name character varying(100) NOT NULL,
    description text,
    address text,
    status character varying(20) DEFAULT 'pending'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    image_url text,
    CONSTRAINT stores_status_check CHECK (((status)::text = ANY ((ARRAY['pending'::character varying, 'approved'::character varying, 'rejected'::character varying])::text[])))
);


--
-- TOC entry 221 (class 1259 OID 36234)
-- Name: stores_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.stores_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5149 (class 0 OID 0)
-- Dependencies: 221
-- Name: stores_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.stores_id_seq OWNED BY public.stores.id;


--
-- TOC entry 220 (class 1259 OID 36220)
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    email character varying(100) NOT NULL,
    password character varying(255) NOT NULL,
    role character varying(20) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- TOC entry 219 (class 1259 OID 36219)
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5150 (class 0 OID 0)
-- Dependencies: 219
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- TOC entry 4909 (class 2604 OID 36321)
-- Name: cart_items id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cart_items ALTER COLUMN id SET DEFAULT nextval('public.cart_items_id_seq'::regclass);


--
-- TOC entry 4907 (class 2604 OID 36304)
-- Name: carts id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.carts ALTER COLUMN id SET DEFAULT nextval('public.carts_id_seq'::regclass);


--
-- TOC entry 4901 (class 2604 OID 36260)
-- Name: categories id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categories ALTER COLUMN id SET DEFAULT nextval('public.categories_id_seq'::regclass);


--
-- TOC entry 4914 (class 2604 OID 36364)
-- Name: order_items id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_items ALTER COLUMN id SET DEFAULT nextval('public.order_items_id_seq'::regclass);


--
-- TOC entry 4911 (class 2604 OID 36345)
-- Name: orders id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders ALTER COLUMN id SET DEFAULT nextval('public.orders_id_seq'::regclass);


--
-- TOC entry 4903 (class 2604 OID 36274)
-- Name: products id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.products ALTER COLUMN id SET DEFAULT nextval('public.products_id_seq'::regclass);


--
-- TOC entry 4915 (class 2604 OID 36388)
-- Name: reviews id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reviews ALTER COLUMN id SET DEFAULT nextval('public.reviews_id_seq'::regclass);


--
-- TOC entry 4898 (class 2604 OID 36238)
-- Name: stores id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.stores ALTER COLUMN id SET DEFAULT nextval('public.stores_id_seq'::regclass);


--
-- TOC entry 4896 (class 2604 OID 36223)
-- Name: users id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- TOC entry 5130 (class 0 OID 36318)
-- Dependencies: 230
-- Data for Name: cart_items; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.cart_items (id, cart_id, product_id, quantity) FROM stdin;
1	1	1	1
2	1	2	2
5	2	3	2
\.


--
-- TOC entry 5128 (class 0 OID 36301)
-- Dependencies: 228
-- Data for Name: carts; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.carts (id, user_id, created_at) FROM stdin;
1	3	2026-11-18 08:10:17.404158
2	4	2026-11-19 08:07:12.732834
\.


--
-- TOC entry 5124 (class 0 OID 36257)
-- Dependencies: 224
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.categories (id, category_name, description, created_at) FROM stdin;
1	Elektronik	Produk elektronik dan perangkat teknologi	2026-11-17 10:41:35.80661
2	Fashion	Pakaian, sepatu, dan aksesoris	2026-11-17 10:41:35.80661
3	Makanan	Makanan dan minuman	2026-11-17 10:41:35.80661
4	Kecantikan	Produk perawatan dan kecantikan	2026-11-17 10:41:35.80661
5	Rumah Tangga	Perlengkapan rumah tangga	2026-11-17 10:41:35.80661
6	olahraga	Peralatan dan perlengkapan olahraga.	2026-11-19 21:07:10.083966
\.


--
-- TOC entry 5134 (class 0 OID 36361)
-- Dependencies: 234
-- Data for Name: order_items; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.order_items (id, order_id, product_id, quantity, price) FROM stdin;
1	1	1	1	250000.00
2	1	2	2	120000.00
3	2	2	1	120000.00
4	3	3	1	125000.00
5	4	3	1	125000.00
6	5	1	2	250000.00
\.


--
-- TOC entry 5132 (class 0 OID 36342)
-- Dependencies: 232
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.orders (id, user_id, total_price, status, created_at, store_id) FROM stdin;
1	3	490000.00	completed	2026-11-18 08:11:10.102366	1
2	4	120000.00	processing	2026-11-22 10:30:19.972351	1
3	4	125000.00	pending	2026-11-23 14:49:52.318141	2
4	4	125000.00	completed	2026-11-23 14:49:59.055215	2
5	4	500000.00	pending	2026-11-23 17:20:45.114983	1
\.


--
-- TOC entry 5126 (class 0 OID 36271)
-- Dependencies: 226
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.products (id, store_id, category_id, product_name, description, price, stock, status, created_at, image_url) FROM stdin;
2	1	1	Smartwatch Active	Jam tangan pintar dengan desain minimalis, fitur pemantauan aktivitas, dan notifikasi pintar.	320000.00	12	active	2026-11-18 08:09:28.928929	/images/products/smartwatch-active.jpg
14	2	2	VELORA Essential Hoodie	Hoodie berbahan cotton fleece premium dengan desain minimalis, lembut, dan nyaman digunakan sehari-hari.	185000.00	22	active	2026-11-25 08:49:39.463639	/images/products/velora-essential-hoodie.jpg
15	2	2	VELORA Urban Cargo Pants	Celana cargo hitam berbahan cotton twill dengan desain modern, potongan relaxed fit, dan saku multifungsi yang cocok untuk aktivitas sehari-hari.	165000.00	30	active	2026-11-25 09:07:00.005813	/images/products/velora-urban-cargo-pants.png
1	1	1	Wireless Headphone	Headphone wireless dengan kualitas suara jernih.	250000.00	18	active	2026-11-18 08:08:15.924949	/images/products/headphone.jpg
3	2	2	Kaos VELORA Premium	kaos premium uji coba bahan nyaman	125000.00	35	active	2026-11-21 17:50:24.75318	/images/products/gambarv.jpg
5	3	3	Premium Chocolate Cookies	Kukis cokelat premium dengan tekstur renyah dan rasa manis yang pas.	45000.00	50	active	2026-11-25 08:35:01.313317	/images/products/premium-chocolate-cookies.jpg
6	3	3	Signature Arabica Coffee	Kopi arabika pilihan dengan aroma khas dan cita rasa seimbang dalam kemasan 250 gram.	85000.00	30	active	2026-11-25 08:37:36.750535	/images/products/signature-arabica-coffee.jpg
7	3	3	Cheese Milk Biscuit	Biskuit susu dengan rasa keju yang gurih dan tekstur renyah, cocok untuk camilan sehari-hari.	38000.00	40	active	2026-11-25 08:38:07.728789	/images/products/cheese-milk-biscuit.jpg
8	4	4	Brightening Face Serum	Serum wajah dengan formula ringan untuk membantu menjaga kelembapan dan merawat kulit.	79000.00	20	active	2026-11-25 08:39:10.032986	/images/products/brightening-face-serum.jpg
9	4	4	Hydrating Facial Wash	Sabun pembersih wajah dengan formula lembut untuk membersihkan kotoran dan menjaga kelembapan kulit.	55000.00	28	active	2026-11-25 08:39:31.574348	/images/products/hydrating-facial-wash.jpg
10	4	4	Soft Matte Lip Cream	Lip cream dengan tekstur ringan dan hasil akhir matte yang lembut, cocok untuk penggunaan sehari-hari.	49000.00	26	active	2026-11-25 08:39:58.066205	/images/products/soft-matte-lip-cream.jpg
11	5	5	Minimalist Table Lamp	Lampu meja minimalis dengan desain elegan dan pencahayaan hangat, cocok untuk meja kerja maupun kamar tidur.	175000.00	14	active	2026-11-25 08:41:22.064872	/images/products/minimalist-table-lamp.jpg
12	5	5	Storage Box Set	Set kotak penyimpanan serbaguna dengan desain minimalis untuk membantu merapikan berbagai perlengkapan rumah.	95000.00	25	active	2026-11-25 08:41:48.779555	/images/products/storage-box-set.jpg
13	5	5	Premium Bed Cover	Bed cover berbahan lembut dengan motif modern yang memberikan kenyamanan dan mempercantik kamar tidur.	230000.00	10	active	2026-11-25 08:42:14.059493	/images/products/premium-bed-cover.jpg
4	1	1	Wireless Earbuds Pro	Earbuds nirkabel dengan kualitas suara jernih, desain ergonomis, dan charging case yang praktis.	199000.00	24	active	2026-11-22 11:17:15.041072	/images/products/wireless-earbuds-pro.jpg
\.


--
-- TOC entry 5136 (class 0 OID 36385)
-- Dependencies: 236
-- Data for Name: reviews; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.reviews (id, user_id, product_id, order_id, rating, comment, created_at) FROM stdin;
1	3	1	1	5	Produk bagus, kualitas suara jernih dan sesuai deskripsi.	2026-11-18 08:12:28.120829
2	4	3	4	5	bagus bajunya hehe	2026-11-23 15:16:20.855321
\.


--
-- TOC entry 5122 (class 0 OID 36235)
-- Dependencies: 222
-- Data for Name: stores; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.stores (id, user_id, store_name, description, address, status, created_at, image_url) FROM stdin;
1	2	Velora Tech Store	Toko yang menyediakan berbagai produk elektronik dan teknologi.	Makassar, Sulawesi Selatan	approved	2026-11-18 08:07:18.700431	\N
2	5	VELORA Fashion Official	Toko Fashion Modern Dan Premium	Makassar, Sulawesi Selatan	approved	2026-11-19 08:08:18.134762	\N
3	8	Daily Bites	Menyediakan berbagai makanan, camilan, dan minuman berkualitas untuk menemani aktivitas sehari-hari.	\N	approved	2026-11-25 08:24:04.080348	\N
4	9	Aura Beauty	Menyediakan berbagai produk perawatan diri untuk kebutuhan sehari-hari.	\N	approved	2026-11-25 08:29:25.983162	\N
5	10	Homely Living	Menyediakan perlengkapan rumah tangga yang modern, minimalis, dan fungsional.	\N	approved	2026-11-25 08:29:55.034461	\N
\.


--
-- TOC entry 5120 (class 0 OID 36220)
-- Dependencies: 220
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.users (id, name, email, password, role, created_at) FROM stdin;
1	Admin VELORA	admin@velora.test	$2b$10$PiULZOgLI9ipLpVo/aTVyuyLJP6dF72ru/2Ofi1oHQlNGmdnFs.yq	admin	2026-11-18 08:06:19.653972
3	Buyer Demo	buyer@velora.test	$2b$10$PiULZOgLI9ipLpVo/aTVyuyLJP6dF72ru/2Ofi1oHQlNGmdnFs.yq	buyer	2026-11-18 08:06:19.653972
4	Test Buyer	testbuyer@velora.test	$2b$10$.dOSJP0.llV8logM1ywS9ugAx5sVR2vScsu7vye1Fdo5.vaDClOKS	buyer	2026-11-19 08:07:12.732834
5	Test Seller	testseller@velora.test	$2b$10$XXxNIMsj5IPInRS6dCQpre3Qsw9z7vqv8Y4eIbQoBM37kBMPVrP4.	seller	2026-11-19 08:08:18.134762
2	Seller Demo	seller@velora.test	$2b$12$anv57ulQweTOQmGBRQGApOsf2Yzwf87Q0eR67HIR7/ispF7GoOETS	seller	2026-11-18 08:06:19.653972
8	Daily Bites	dailybites@velora.test	$2b$10$z88bOJDi8JcX2H5m.9V2a.o9UJIuhw1Vxj682AzJmFPz32G7Rkzzq	seller	2026-11-25 08:24:04.080348
9	Aura Beauty	aurabeauty@velora.test	$2b$10$ah1ocLq6lLSLJgBDpImvjOf0D5I8k.0vpb0Y1pWCWwix.XpZnqgA2	seller	2026-11-25 08:29:25.983162
10	Homely Living	homelyliving@velora.test	$2b$10$CQNG1F1QazxZWwf/pQ/HiehuCO7kv2Wr/ALG/12uiT/m/wmWJdwDW	seller	2026-11-25 08:29:55.034461
\.


--
-- TOC entry 5151 (class 0 OID 0)
-- Dependencies: 229
-- Name: cart_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.cart_items_id_seq', 6, true);


--
-- TOC entry 5152 (class 0 OID 0)
-- Dependencies: 227
-- Name: carts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.carts_id_seq', 7, true);


--
-- TOC entry 5153 (class 0 OID 0)
-- Dependencies: 223
-- Name: categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.categories_id_seq', 7, true);


--
-- TOC entry 5154 (class 0 OID 0)
-- Dependencies: 233
-- Name: order_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.order_items_id_seq', 6, true);


--
-- TOC entry 5155 (class 0 OID 0)
-- Dependencies: 231
-- Name: orders_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.orders_id_seq', 5, true);


--
-- TOC entry 5156 (class 0 OID 0)
-- Dependencies: 225
-- Name: products_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.products_id_seq', 15, true);


--
-- TOC entry 5157 (class 0 OID 0)
-- Dependencies: 235
-- Name: reviews_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.reviews_id_seq', 2, true);


--
-- TOC entry 5158 (class 0 OID 0)
-- Dependencies: 221
-- Name: stores_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.stores_id_seq', 5, true);


--
-- TOC entry 5159 (class 0 OID 0)
-- Dependencies: 219
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.users_id_seq', 10, true);


--
-- TOC entry 4947 (class 2606 OID 36330)
-- Name: cart_items cart_items_cart_id_product_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT cart_items_cart_id_product_id_key UNIQUE (cart_id, product_id);


--
-- TOC entry 4949 (class 2606 OID 36328)
-- Name: cart_items cart_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT cart_items_pkey PRIMARY KEY (id);


--
-- TOC entry 4943 (class 2606 OID 36309)
-- Name: carts carts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.carts
    ADD CONSTRAINT carts_pkey PRIMARY KEY (id);


--
-- TOC entry 4945 (class 2606 OID 36311)
-- Name: carts carts_user_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.carts
    ADD CONSTRAINT carts_user_id_key UNIQUE (user_id);


--
-- TOC entry 4936 (class 2606 OID 36269)
-- Name: categories categories_category_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_category_name_key UNIQUE (category_name);


--
-- TOC entry 4938 (class 2606 OID 36267)
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- TOC entry 4953 (class 2606 OID 36373)
-- Name: order_items order_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_pkey PRIMARY KEY (id);


--
-- TOC entry 4951 (class 2606 OID 36354)
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);


--
-- TOC entry 4941 (class 2606 OID 36289)
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


--
-- TOC entry 4956 (class 2606 OID 36399)
-- Name: reviews reviews_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_pkey PRIMARY KEY (id);


--
-- TOC entry 4958 (class 2606 OID 36401)
-- Name: reviews reviews_user_id_product_id_order_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_user_id_product_id_order_id_key UNIQUE (user_id, product_id, order_id);


--
-- TOC entry 4932 (class 2606 OID 36248)
-- Name: stores stores_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.stores
    ADD CONSTRAINT stores_pkey PRIMARY KEY (id);


--
-- TOC entry 4934 (class 2606 OID 36250)
-- Name: stores stores_user_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.stores
    ADD CONSTRAINT stores_user_id_key UNIQUE (user_id);


--
-- TOC entry 4928 (class 2606 OID 36233)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 4930 (class 2606 OID 36231)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 4954 (class 1259 OID 36425)
-- Name: reviews_one_per_buyer_product; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX reviews_one_per_buyer_product ON public.reviews USING btree (user_id, product_id);


--
-- TOC entry 4939 (class 1259 OID 36424)
-- Name: unique_category_name; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX unique_category_name ON public.categories USING btree (lower(TRIM(BOTH FROM category_name)));


--
-- TOC entry 4963 (class 2606 OID 36331)
-- Name: cart_items cart_items_cart_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT cart_items_cart_id_fkey FOREIGN KEY (cart_id) REFERENCES public.carts(id) ON DELETE CASCADE;


--
-- TOC entry 4964 (class 2606 OID 36336)
-- Name: cart_items cart_items_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT cart_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- TOC entry 4962 (class 2606 OID 36312)
-- Name: carts carts_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.carts
    ADD CONSTRAINT carts_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- TOC entry 4965 (class 2606 OID 36419)
-- Name: orders fk_orders_store; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT fk_orders_store FOREIGN KEY (store_id) REFERENCES public.stores(id);


--
-- TOC entry 4967 (class 2606 OID 36374)
-- Name: order_items order_items_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id);


--
-- TOC entry 4968 (class 2606 OID 36379)
-- Name: order_items order_items_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- TOC entry 4966 (class 2606 OID 36355)
-- Name: orders orders_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- TOC entry 4960 (class 2606 OID 36295)
-- Name: products products_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id);


--
-- TOC entry 4961 (class 2606 OID 36290)
-- Name: products products_store_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_store_id_fkey FOREIGN KEY (store_id) REFERENCES public.stores(id);


--
-- TOC entry 4969 (class 2606 OID 36412)
-- Name: reviews reviews_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id);


--
-- TOC entry 4970 (class 2606 OID 36407)
-- Name: reviews reviews_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- TOC entry 4971 (class 2606 OID 36402)
-- Name: reviews reviews_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- TOC entry 4959 (class 2606 OID 36251)
-- Name: stores stores_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.stores
    ADD CONSTRAINT stores_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


-- Completed on 2026-11-25 09:13:07

--
-- PostgreSQL database dump complete
--

\unrestrict H3s3EgHunssU8XbT8rDTLvWMO9CyzhQ1EXAHW0R6wOumapNGgMLnL5HVXGfdTJU

