
"use server";

import pool from "@/lib/db";
import { requireApprovedSeller } from "@/lib/authorization";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function updateStore(formData) {
  const user = await requireApprovedSeller();

  const storeName = String(
    formData.get("store_name") || ""
  ).trim();

  const description = String(
    formData.get("description") || ""
  ).trim();

  const address = String(
    formData.get("address") || ""
  ).trim();

  const imageUrl = String(
    formData.get("image_url") || ""
  ).trim();

  // VALIDASI
  if (!storeName || storeName.length > 100) {
    throw new Error("Nama toko harus berisi 1-100 karakter.");
  }

  if (description.length > 2000) {
    throw new Error("Deskripsi terlalu panjang.");
  }

  if (address.length > 500) {
    throw new Error("Alamat terlalu panjang.");
  }

  if (imageUrl) {
    let valid = false;

    if (
      imageUrl.startsWith("/") &&
      !imageUrl.startsWith("//") &&
      !imageUrl.includes("\\")
    ) {
      valid = true;
    } else {
      try {
        const url = new URL(imageUrl);
        valid = ["http:", "https:"].includes(url.protocol);
      } catch {
        valid = false;
      }
    }

    if (!valid) {
      throw new Error("URL gambar tidak valid.");
    }
  }

  // UPDATE TOKO MILIK SELLER YANG LOGIN
  const result = await pool.query(
    `UPDATE stores
     SET store_name = $1,
         description = $2,
         address = $3,
         image_url = $4
     WHERE user_id = $5
       AND status = 'approved'
     RETURNING id`,
    [
      storeName,
      description || null,
      address || null,
      imageUrl || null,
      user.id,
    ]
  );

  if (result.rows.length === 0) {
    throw new Error("Toko tidak ditemukan atau belum disetujui.");
  }

  revalidatePath("/seller/store");
  revalidatePath("/seller");

  redirect("/seller/store?saved=1");
}
