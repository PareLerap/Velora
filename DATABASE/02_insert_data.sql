INSERT INTO categories (category_name, description)
VALUES
('Elektronik', 'Produk elektronik dan perangkat teknologi'),
('Fashion', 'Pakaian, sepatu, dan aksesoris'),
('Makanan', 'Makanan dan minuman'),
('Kecantikan', 'Produk perawatan dan kecantikan'),
('Rumah Tangga', 'Perlengkapan rumah tangga');

SELECT * FROM categories;

INSERT INTO users (name, email, password, role)
VALUES
(
    'Admin VELORA',
    'admin@velora.test',
    '$2b$10$PiULZOgLI9ipLpVo/aTVyuyLJP6dF72ru/2Ofi1oHQlNGmdnFs.yq',
    'admin'
),
(
    'Seller Demo',
    'seller@velora.test',
    '$2b$10$PiULZOgLI9ipLpVo/aTVyuyLJP6dF72ru/2Ofi1oHQlNGmdnFs.yq',
    'seller'
),
(
    'Buyer Demo',
    'buyer@velora.test',
    '$2b$10$PiULZOgLI9ipLpVo/aTVyuyLJP6dF72ru/2Ofi1oHQlNGmdnFs.yq',
    'buyer'
);

SELECT id, name, email, role
FROM users;

INSERT INTO stores (user_id, store_name, description, address, status)
VALUES
(
    2,
    'Velora Tech Store',
    'Toko yang menyediakan berbagai produk elektronik dan teknologi.',
    'Makassar, Sulawesi Selatan',
    'approved'
);

SELECT * FROM stores;

INSERT INTO products (
    store_id,
    category_id,
    product_name,
    description,
    price,
    stock
)
VALUES
(
    1,
    1,
    'Wireless Headphone',
    'Headphone wireless dengan kualitas suara jernih.',
    250000,
    20
);

SELECT * FROM products;

SELECT
    products.product_name,
    stores.store_name,
    categories.category_name,
    products.price,
    products.stock
FROM products
JOIN stores ON products.store_id = stores.id
JOIN categories ON products.category_id = categories.id;

INSERT INTO products (
    store_id,
    category_id,
    product_name,
    description,
    price,
    stock
)
VALUES (
    1,
    2,
    'Basic Oversized T-Shirt',
    'Kaos oversized nyaman untuk aktivitas sehari-hari.',
    120000,
    35
);

INSERT INTO carts (user_id)
VALUES (3);

INSERT INTO cart_items (cart_id, product_id, quantity)
VALUES
(1, 1, 1),
(1, 2, 2);

SELECT
    users.name AS buyer,
    products.product_name,
    products.price,
    cart_items.quantity,
    products.price * cart_items.quantity AS subtotal
FROM carts
JOIN users ON carts.user_id = users.id
JOIN cart_items ON carts.id = cart_items.cart_id
JOIN products ON cart_items.product_id = products.id;

INSERT INTO orders (user_id, store_id, total_price, status)
VALUES (
    3,
    1,
    490000,
    'pending'
);

INSERT INTO order_items (order_id, product_id, quantity, price)
VALUES
(1, 1, 1, 250000),
(1, 2, 2, 120000);

SELECT
    orders.id AS order_id,
    users.name AS buyer,
    stores.store_name,
    products.product_name,
    order_items.quantity,
    order_items.price,
    orders.status
FROM orders
JOIN users ON orders.user_id = users.id
JOIN stores ON orders.store_id = stores.id
JOIN order_items ON orders.id = order_items.order_id
JOIN products ON order_items.product_id = products.id;

INSERT INTO reviews (
    user_id,
    product_id,
    order_id,
    rating,
    comment
)
VALUES (
    3,
    1,
    1,
    5,
    'Produk bagus, kualitas suara jernih dan sesuai deskripsi.'
);

SELECT * FROM reviews;