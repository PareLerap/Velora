
import Link from "next/link";
import pool from "@/lib/db";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import VeloraNavbar from "@/components/VeloraNavbar";

export const dynamic = "force-dynamic";

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
    pending: "text-yellow-400 bg-yellow-500/10 border-yellow-500/30",
    processing: "text-blue-400 bg-blue-500/10 border-blue-500/30",
    shipped: "text-purple-400 bg-purple-500/10 border-purple-500/30",
    completed: "text-green-400 bg-green-500/10 border-green-500/30",
    cancelled: "text-red-400 bg-red-500/10 border-red-500/30",
  };

  return (
    colors[status] ||
    "text-zinc-400 bg-zinc-800 border-zinc-700"
  );
}

function statusDescription(status) {
  const descriptions = {
    pending: "Pesanan menunggu diproses oleh Seller.",
    processing: "Pesanan sedang diproses oleh Seller.",
    shipped: "Pesanan sedang dalam proses pengiriman.",
    completed: "Pesanan telah selesai.",
    cancelled: "Pesanan telah dibatalkan.",
  };

  return descriptions[status] || "Status pesanan belum tersedia.";
}

export default async function MyOrdersPage() {
  const user = await getSession();

  // HANYA BUYER YANG BISA MENGAKSES
  if (!user) {
    redirect("/login");
  }

  if (user.role !== "buyer") {
    redirect("/");
  }

  // AMBIL PESANAN BUYER
  const result = await pool.query(
    `SELECT
       o.id,
       o.total_price,
       o.status,
       o.created_at,
       oi.id AS item_id,
       oi.product_id,
       oi.quantity,
       oi.price,
       p.product_name
     FROM orders o
     LEFT JOIN order_items oi
       ON oi.order_id = o.id
     LEFT JOIN products p
       ON p.id = oi.product_id
     WHERE o.user_id = $1
     ORDER BY
       o.created_at DESC,
       o.id DESC,
       oi.id ASC`,
    [user.id]
  );

  // KELOMPOKKAN PRODUK BERDASARKAN PESANAN
  const ordersMap = new Map();

  for (const row of result.rows) {
    if (!ordersMap.has(row.id)) {
      ordersMap.set(row.id, {
        id: row.id,
        total_price: row.total_price,
        status: row.status,
        created_at: row.created_at,
        items: [],
      });
    }

    if (row.item_id !== null) {
      ordersMap.get(row.id).items.push({
        id: row.item_id,
        product_id: row.product_id,
        product_name: row.product_name,
        quantity: row.quantity,
        price: row.price,
      });
    }
  }

  const orders = Array.from(ordersMap.values());

  // STATISTIK BUYER
  const totalOrders = orders.length;

  const completedOrders = orders.filter(
    (order) => order.status === "completed"
  ).length;

  return (
    <div className="min-h-screen bg-black text-white">

      {/* NAVBAR BERSAMA - 80PX */}
      <VeloraNavbar user={user} />

      {/* MAIN */}
      <main className="mx-auto max-w-6xl px-6 py-12 md:px-12">

        {/* HEADER */}
        <div className="animate-fade-up">
          <p className="mb-4 text-xs tracking-[0.3em] text-zinc-400">
            YOUR SHOPPING JOURNEY
          </p>

          <h1 className="text-4xl font-black tracking-tight md:text-6xl">
            My Orders.
          </h1>

          <p className="mt-4 text-zinc-400">
            Welcome back, {user.name}.
            Track your purchases and order status.
          </p>

          <Link
            href="/#produk"
            className="mt-6 inline-flex items-center gap-2 text-sm text-zinc-400 transition hover:text-white"
          >
            ← Continue Shopping
          </Link>
        </div>

        {/* STATISTICS */}
        <div className="mt-12 grid gap-5 sm:grid-cols-2">

          <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6">
            <p className="text-sm text-zinc-400">
              Total Orders
            </p>

            <h2 className="mt-4 text-4xl font-black">
              {totalOrders}
            </h2>
          </div>

          <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6">
            <p className="text-sm text-zinc-400">
              Completed Orders
            </p>

            <h2 className="mt-4 text-4xl font-black text-green-400">
              {completedOrders}
            </h2>
          </div>

        </div>

        {/* ORDER HISTORY */}
        <section className="mt-14">

          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold">
                Order History.
              </h2>

              <p className="mt-2 text-sm text-zinc-400">
                Monitor your recent purchases.
              </p>
            </div>

            <span className="text-sm text-zinc-400">
              {totalOrders} Orders
            </span>
          </div>

          {/* EMPTY STATE */}
          {orders.length === 0 ? (

            <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-12 text-center">

              <div className="text-4xl">
                🛒
              </div>

              <h3 className="mt-6 text-xl font-bold">
                No Orders Yet.
              </h3>

              <p className="mt-4 text-zinc-400">
                Kamu belum melakukan pembelian.
              </p>

              <Link
                href="/#produk"
                className="mt-8 inline-block rounded-full bg-white px-8 py-4 font-bold text-black transition hover:bg-zinc-300"
              >
                Start Shopping ↗
              </Link>

            </div>

          ) : (

            <div className="space-y-6">

              {orders.map((order) => (

                <article
                  key={order.id}
                  className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6 md:p-8"
                >

                  {/* ORDER HEADER */}
                  <div className="flex flex-wrap items-start justify-between gap-4 border-b border-zinc-800 pb-6">

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

                  {/* ORDER ITEMS */}
                  <div className="mt-6 space-y-4">

                    {order.items.map((item) => (

                      <div
                        key={item.id}
                        className="flex flex-col justify-between gap-4 rounded-2xl border border-zinc-800 bg-black p-5 sm:flex-row sm:items-center"
                      >

                        <div>
                          <h4 className="font-semibold">
                            {item.product_name ||
                              "Produk tidak tersedia"}
                          </h4>

                          <p className="mt-2 text-sm text-zinc-400">
                            Quantity: {item.quantity}
                          </p>

                          <p className="mt-1 text-xs text-zinc-500">
                            Unit Price: {formatPrice(item.price)}
                          </p>

                          {item.product_name && (
                            <Link
                              href={`/products/${item.product_id}`}
                              className="mt-3 inline-block text-xs text-zinc-300 underline transition hover:text-white"
                            >
                              View Product ↗
                            </Link>
                          )}
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

                  {/* TOTAL */}
                  <div className="mt-6 flex items-center justify-between border-t border-zinc-800 pt-6">

                    <p className="text-sm text-zinc-400">
                      Total Payment
                    </p>

                    <p className="text-xl font-black">
                      {formatPrice(order.total_price)}
                    </p>

                  </div>

                  {/* STATUS DESCRIPTION */}
                  <div className="mt-6 rounded-xl border border-zinc-800 bg-black p-4">

                    <p className="text-sm text-zinc-400">
                      {statusDescription(order.status)}
                    </p>

                  </div>

                </article>

              ))}

            </div>

          )}

        </section>

      </main>

      {/* FOOTER */}
      <footer className="mt-16 border-t border-zinc-800 py-8 text-center text-xs text-zinc-500">
        © 2026 VELORA. Buyer Order History.
      </footer>

    </div>
  );
}
