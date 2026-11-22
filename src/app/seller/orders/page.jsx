
import Link from "next/link";
import pool from "@/lib/db";
import { requireApprovedSeller } from "@/lib/authorization";
import { updateOrderStatus } from "./actions";
import VeloraNavbar from "@/components/VeloraNavbar";

export const dynamic = "force-dynamic";

// ALUR STATUS PESANAN
const statusTransitions = {
  pending: ["processing", "cancelled"],
  processing: ["shipped", "cancelled"],
  shipped: ["completed"],
  completed: [],
  cancelled: [],
};

function formatPrice(value) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number(value));
}

function formatDate(value) {
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Makassar",
  }).format(new Date(value));
}

function statusColor(status) {
  const colors = {
    pending: "border-yellow-500/30 bg-yellow-500/10 text-yellow-400",
    processing: "border-blue-500/30 bg-blue-500/10 text-blue-400",
    shipped: "border-purple-500/30 bg-purple-500/10 text-purple-400",
    completed: "border-green-500/30 bg-green-500/10 text-green-400",
    cancelled: "border-red-500/30 bg-red-500/10 text-red-400",
  };

  return (
    colors[status] ||
    "border-zinc-700 bg-zinc-800 text-zinc-300"
  );
}

export default async function SellerOrdersPage() {
  const user = await requireApprovedSeller();

  // AMBIL TOKO SELLER
  const storeResult = await pool.query(
    `SELECT id, store_name
     FROM stores
     WHERE user_id = $1
       AND status = 'approved'
     LIMIT 1`,
    [user.id]
  );

  const store = storeResult.rows[0];

  if (!store) {
    return (
      <div className="min-h-screen bg-black text-white">
        <VeloraNavbar user={user} />

        <main className="mx-auto max-w-7xl px-6 py-12">
          <h1 className="text-3xl font-bold">
            Store Unavailable
          </h1>

          <p className="mt-4 text-zinc-400">
            Toko kamu belum tersedia atau belum disetujui.
          </p>

          <Link
            href="/seller"
            className="mt-6 inline-block underline"
          >
            Back to Dashboard
          </Link>
        </main>
      </div>
    );
  }

  // AMBIL PESANAN TOKO
  const ordersResult = await pool.query(
    `SELECT
       o.id,
       o.status,
       o.created_at,
       o.store_id,

       COALESCE((
         SELECT SUM(oi.quantity * oi.price)
         FROM order_items oi
         JOIN products p ON p.id = oi.product_id
         WHERE oi.order_id = o.id
           AND p.store_id = $1
       ), 0) AS seller_total,

       EXISTS (
         SELECT 1
         FROM order_items oi
         JOIN products p ON p.id = oi.product_id
         WHERE oi.order_id = o.id
           AND p.store_id <> $1
       ) AS has_other_stores

     FROM orders o

     WHERE EXISTS (
       SELECT 1
       FROM order_items oi
       JOIN products p ON p.id = oi.product_id
       WHERE oi.order_id = o.id
         AND p.store_id = $1
     )

     ORDER BY o.created_at DESC, o.id DESC`,
    [store.id]
  );

  // AMBIL DETAIL PRODUK PESANAN
  const itemsResult = await pool.query(
    `SELECT
       oi.id,
       oi.order_id,
       p.product_name,
       oi.quantity,
       oi.price
     FROM order_items oi
     JOIN products p ON p.id = oi.product_id
     WHERE p.store_id = $1
     ORDER BY oi.order_id DESC, oi.id ASC`,
    [store.id]
  );

  const orders = ordersResult.rows;
  const allItems = itemsResult.rows;

  // STATISTIK
  const totalOrders = orders.length;

  const pendingOrders = orders.filter(
    (order) => order.status === "pending"
  ).length;

  const completedOrders = orders.filter(
    (order) => order.status === "completed"
  ).length;

  const totalSales = orders
    .filter((order) => order.status === "completed")
    .reduce(
      (total, order) =>
        total + Number(order.seller_total),
      0
    );

  const stats = [
    {
      title: "Total Orders",
      value: totalOrders,
      color: "text-white",
    },
    {
      title: "Pending Orders",
      value: pendingOrders,
      color: "text-yellow-400",
    },
    {
      title: "Completed Orders",
      value: completedOrders,
      color: "text-green-400",
    },
    {
      title: "Completed Sales",
      value: formatPrice(totalSales),
      color: "text-white",
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white">

      {/* NAVBAR BERSAMA - 80PX */}
      <VeloraNavbar user={user} />

      {/* MAIN CONTENT */}
      <main className="mx-auto max-w-7xl px-6 py-12 md:px-12">

        {/* HEADER */}
        <div className="animate-fade-up">

          <p className="mb-4 text-xs tracking-[0.3em] text-zinc-400">
            SELLER CONTROL CENTER
          </p>

          <h1 className="text-4xl font-black tracking-tight md:text-6xl">
            Manage Orders.
          </h1>

          <p className="mt-4 text-zinc-400">
            Track and manage customer orders at{" "}
            {store.store_name}.
          </p>

          <Link
            href="/seller"
            className="mt-6 inline-block text-sm text-zinc-400 transition hover:text-white"
          >
            ← Back to Seller Dashboard
          </Link>

        </div>

        {/* STATISTICS */}
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

          {stats.map((stat) => (
            <div
              key={stat.title}
              className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6"
            >
              <p className="text-sm text-zinc-400">
                {stat.title}
              </p>

              <h2
                className={`mt-5 break-words text-3xl font-black ${stat.color}`}
              >
                {stat.value}
              </h2>
            </div>
          ))}

        </div>

        {/* ORDERS SECTION */}
        <section className="mt-14">

          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">

            <div>
              <h2 className="text-2xl font-bold">
                Customer Orders.
              </h2>

              <p className="mt-2 text-sm text-zinc-400">
                Monitor and update incoming orders.
              </p>
            </div>

            <span className="text-sm text-zinc-400">
              {orders.length} Orders
            </span>

          </div>

          {/* EMPTY STATE */}
          {orders.length === 0 ? (

            <div className="rounded-3xl border border-zinc-800 bg-zinc-900 px-6 py-16 text-center">

              <div className="text-5xl">
                🛒
              </div>

              <h3 className="mt-6 text-xl font-bold">
                No Orders Yet.
              </h3>

              <p className="mt-3 text-zinc-400">
                Pesanan pelanggan akan muncul di sini
                ketika produk toko kamu dibeli.
              </p>

            </div>

          ) : (

            <div className="space-y-6">

              {orders.map((order) => {
                const items = allItems.filter(
                  (item) => item.order_id === order.id
                );

                // VALIDASI KEPEMILIKAN PESANAN
                const canManage =
                  !order.has_other_stores &&
                  (
                    order.store_id === null ||
                    Number(order.store_id) === Number(store.id)
                  );

                // STATUS YANG BOLEH DIPILIH
                const nextStatuses =
                  statusTransitions[order.status] || [];

                const showStatusForm =
                  canManage && nextStatuses.length > 0;

                return (
                  <article
                    key={order.id}
                    className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6 md:p-8"
                  >

                    {/* ORDER HEADER */}
                    <div className="flex flex-wrap items-start justify-between gap-5 border-b border-zinc-800 pb-6">

                      <div>
                        <p className="text-xs uppercase tracking-widest text-zinc-500">
                          Order Number
                        </p>

                        <h3 className="mt-2 text-2xl font-black">
                          #{order.id}
                        </h3>

                        <p className="mt-2 text-sm text-zinc-400">
                          {formatDate(order.created_at)}
                        </p>
                      </div>

                      <span
                        className={`rounded-full border px-4 py-2 text-xs font-bold uppercase ${statusColor(order.status)}`}
                      >
                        {order.status || "Unknown"}
                      </span>

                    </div>

                    {/* ORDERED PRODUCTS */}
                    <div className="mt-6">

                      <h4 className="mb-4 text-sm font-semibold">
                        Ordered Products
                      </h4>

                      <div className="space-y-4">

                        {items.map((item) => (
                          <div
                            key={item.id}
                            className="flex flex-col gap-4 rounded-2xl border border-zinc-800 bg-black p-5 sm:flex-row sm:items-center sm:justify-between"
                          >

                            <div>
                              <p className="font-semibold">
                                {item.product_name}
                              </p>

                              <p className="mt-2 text-sm text-zinc-400">
                                Quantity: {item.quantity}
                              </p>

                              <p className="mt-1 text-xs text-zinc-500">
                                Unit Price: {formatPrice(item.price)}
                              </p>
                            </div>

                            <p className="font-bold">
                              {formatPrice(
                                Number(item.price) *
                                Number(item.quantity)
                              )}
                            </p>

                          </div>
                        ))}

                      </div>

                    </div>

                    {/* STORE SUBTOTAL */}
                    <div className="mt-6 flex items-center justify-between border-t border-zinc-800 pt-6">

                      <span className="text-sm text-zinc-400">
                        Store Subtotal
                      </span>

                      <span className="text-xl font-black">
                        {formatPrice(order.seller_total)}
                      </span>

                    </div>

                    {/* STATUS MANAGEMENT */}
                    <div className="mt-8 rounded-2xl border border-zinc-800 bg-black p-5">

                      <h4 className="font-semibold">
                        Order Status
                      </h4>

                      {showStatusForm ? (

                        <form
                          action={updateOrderStatus}
                          className="mt-5 flex flex-col gap-3 sm:flex-row"
                        >

                          <input
                            type="hidden"
                            name="order_id"
                            value={order.id}
                          />

                          <select
                            name="status"
                            defaultValue=""
                            required
                            className="min-w-0 flex-1 rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-white outline-none focus:border-white"
                          >

                            <option value="" disabled>
                              Select Next Status
                            </option>

                            {nextStatuses.map((status) => (
                              <option
                                key={status}
                                value={status}
                              >
                                {status.charAt(0).toUpperCase() +
                                  status.slice(1)}
                              </option>
                            ))}

                          </select>

                          <button
                            type="submit"
                            className="rounded-xl bg-white px-6 py-3 text-sm font-bold text-black transition hover:bg-zinc-300"
                          >
                            Update Status ↗
                          </button>

                        </form>

                      ) : (

                        <p className="mt-4 text-sm text-zinc-400">
                          {!canManage
                            ? "Status pesanan tidak dapat diubah karena melibatkan toko lain atau tidak dimiliki sepenuhnya oleh toko kamu."
                            : order.status === "completed"
                            ? "Pesanan sudah selesai. Status tidak dapat diubah lagi."
                            : order.status === "cancelled"
                            ? "Pesanan telah dibatalkan. Status tidak dapat diubah lagi."
                            : "Tidak ada perubahan status yang tersedia."}
                        </p>

                      )}

                    </div>

                  </article>
                );
              })}

            </div>

          )}

        </section>

      </main>

      {/* FOOTER */}
      <footer className="mt-16 border-t border-zinc-800 py-8 text-center text-xs text-zinc-500">
        © 2026 VELORA. Seller Order Management.
      </footer>

    </div>
  );
}
