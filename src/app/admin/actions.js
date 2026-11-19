"use server";
import { updateUser, deleteUser } from "@/queries/users";
import { requireRole } from "@/lib/authorization";
import { updateSellerStatus } from "@/queries/sellers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { removeProductByAdmin } from "@/queries/products";
import {
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/queries/categories";

export async function approveSeller(formData) {
  // MEMASTIKAN USER ADALAH ADMIN
  await requireRole("admin");

  const storeId = Number(formData.get("storeId"));

  const updated = await updateSellerStatus(
    storeId,
    "approved"
  );

  revalidatePath("/admin");
  revalidatePath("/admin/sellers");

  redirect(
    updated
      ? "/admin/sellers?success=approved"
      : "/admin/sellers?error=not-updated"
  );
}

export async function rejectSeller(formData) {
  // MEMASTIKAN USER ADALAH ADMIN
  await requireRole("admin");

  const storeId = Number(formData.get("storeId"));

  const updated = await updateSellerStatus(
    storeId,
    "rejected"
  );

  revalidatePath("/admin");
  revalidatePath("/admin/sellers");

  redirect(
    updated
      ? "/admin/sellers?success=rejected"
      : "/admin/sellers?error=not-updated"
  );
}
// EDIT DATA PENGGUNA
export async function editUser(formData) {
  const admin = await requireRole("admin");

  const userId = Number(formData.get("userId"));

  const name = String(
    formData.get("name") || ""
  ).trim();

  const email = String(
    formData.get("email") || ""
  ).trim().toLowerCase();

  // VALIDASI ID
  if (
    !Number.isInteger(userId) ||
    userId <= 0 ||
    userId > 2147483647
  ) {
    redirect("/admin/users");
  }

  // MELINDUNGI AKUN ADMIN SENDIRI
  if (userId === admin.id) {
    redirect("/admin/users?error=self");
  }

  // VALIDASI INPUT
  if (
    !name ||
    name.length > 100 ||
    !email ||
    email.length > 100 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  ) {
    redirect(`/admin/users/${userId}/edit?error=invalid`);
  }

  let errorCode = null;

  try {
    const updated = await updateUser(
      userId,
      name,
      email,
      admin.id
    );

    if (!updated) {
      errorCode = "not-found";
    }
  } catch (error) {
    errorCode =
      error.code === "23505"
        ? "duplicate"
        : "database";
  }

  if (errorCode) {
    redirect(
      `/admin/users/${userId}/edit?error=${errorCode}`
    );
  }

  revalidatePath("/admin/users");
  revalidatePath("/admin/sellers");

  redirect("/admin/users?success=updated");
}

// MENGHAPUS AKUN PENGGUNA
export async function removeUser(formData) {
  const admin = await requireRole("admin");

  const userId = Number(formData.get("userId"));

  // VALIDASI ID
  if (
    !Number.isInteger(userId) ||
    userId <= 0 ||
    userId > 2147483647
  ) {
    redirect("/admin/users?error=invalid");
  }

  // MELINDUNGI AKUN ADMIN SENDIRI
  if (userId === admin.id) {
    redirect("/admin/users?error=self");
  }

  // MENJALANKAN QUERY DELETE
  const result = await deleteUser(userId, admin.id);

  if (result !== "deleted") {
    redirect(`/admin/users?error=${result}`);
  }

  // MEMPERBARUI HALAMAN
  revalidatePath("/admin");
  revalidatePath("/admin/users");
  revalidatePath("/admin/sellers");
  revalidatePath("/");

  redirect("/admin/users?success=deleted");
}

// MENAMBAHKAN KATEGORI
export async function addCategory(formData) {
  await requireRole("admin");

  const name = String(
    formData.get("name") || ""
  ).trim();

  const description = String(
    formData.get("description") || ""
  ).trim();

  if (!name || name.length > 100 || description.length > 1000) {
    redirect("/admin/categories?error=invalid");
  }

  let errorCode = null;

  try {
    await createCategory(name, description);
  } catch (error) {
    errorCode =
      error.code === "23505"
        ? "duplicate"
        : "database";
  }

  if (errorCode) {
    redirect(`/admin/categories?error=${errorCode}`);
  }

  revalidatePath("/admin/categories");
  revalidatePath("/");

  redirect("/admin/categories?success=created");
}


// MENGEDIT KATEGORI
export async function editCategory(formData) {
  await requireRole("admin");

  const id = Number(formData.get("categoryId"));

  const name = String(
    formData.get("name") || ""
  ).trim();

  const description = String(
    formData.get("description") || ""
  ).trim();

  if (
    !Number.isInteger(id) ||
    id <= 0 ||
    id > 2147483647 ||
    !name ||
    name.length > 100 ||
    description.length > 1000
  ) {
    redirect("/admin/categories?error=invalid");
  }

  let errorCode = null;

  try {
    const updated = await updateCategory(
      id,
      name,
      description
    );

    if (!updated) {
      errorCode = "not-found";
    }

  } catch (error) {
    errorCode =
      error.code === "23505"
        ? "duplicate"
        : "database";
  }

  if (errorCode) {
    redirect(`/admin/categories?error=${errorCode}`);
  }

  revalidatePath("/admin/categories");
  revalidatePath("/");

  redirect("/admin/categories?success=updated");
}


// MENGHAPUS KATEGORI
export async function removeCategory(formData) {
  await requireRole("admin");

  const id = Number(formData.get("categoryId"));

  if (
    !Number.isInteger(id) ||
    id <= 0 ||
    id > 2147483647
  ) {
    redirect("/admin/categories?error=invalid");
  }

  let errorCode = null;

  try {
    const deleted = await deleteCategory(id);

    if (!deleted) {
      errorCode = "not-deleted";
    }

  } catch (error) {
    errorCode =
      error.code === "23503"
        ? "has-products"
        : "database";
  }

  if (errorCode) {
    redirect(`/admin/categories?error=${errorCode}`);
  }

  revalidatePath("/admin/categories");
  revalidatePath("/");

  redirect("/admin/categories?success=deleted");
}
// MENONAKTIFKAN PRODUK OLEH ADMIN
export async function removeAdminProduct(formData) {
  await requireRole("admin");

  const id = Number(formData.get("productId"));

  if (
    !Number.isInteger(id) ||
    id <= 0 ||
    id > 2147483647
  ) {
    redirect("/admin/products?error=invalid");
  }

  let errorCode = null;

  try {
    const removed = await removeProductByAdmin(id);

    if (!removed) {
      errorCode = "not-removed";
    }
  } catch (error) {
    errorCode = "database";
  }

  if (errorCode) {
    redirect(`/admin/products?error=${errorCode}`);
  }

  revalidatePath("/admin/products");
  revalidatePath("/products");
  revalidatePath(`/products/${id}`);
  revalidatePath("/");

  redirect("/admin/products?success=removed");
}


