
"use client";

import { useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import { removeUser } from "@/app/admin/actions";

function ConfirmButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="flex-1 rounded-full bg-red-600 px-5 py-3 text-sm font-bold text-white transition-all hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {pending ? "Deleting..." : "Confirm Delete"}
    </button>
  );
}

export default function DeleteUserButton({ userId, userName }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    dialogRef.current?.close();
  }, [userId]);

  function openModal() {
    dialogRef.current?.showModal();
  }

  function closeModal() {
    dialogRef.current?.close();
  }

  return (
    <>
      {/* DELETE BUTTON */}
      <button
        type="button"
        onClick={openModal}
        className="rounded-full border border-red-500/40 px-5 py-3 text-xs font-semibold text-red-400 transition-all duration-300 hover:bg-red-500/10 active:scale-95"
      >
        Delete User
      </button>

      {/* CONFIRMATION MODAL */}
      <dialog
        ref={dialogRef}
        aria-labelledby={`delete-title-${userId}`}
        className="fixed inset-0 m-auto w-[90%] max-w-md rounded-3xl border border-zinc-700 bg-zinc-900 p-8 text-white shadow-2xl backdrop:bg-black/70 backdrop:backdrop-blur-md"
      >
        <div className="animate-fade-up">

          {/* WARNING ICON */}
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-red-500/30 bg-red-500/10 text-3xl text-red-400">
            !
          </div>

          <p className="mb-3 text-xs tracking-[0.3em] text-red-400">
            DELETE ACCOUNT
          </p>

          <h2
            id={`delete-title-${userId}`}
            className="text-3xl font-black"
          >
            Delete User?
          </h2>

          <p className="mt-4 text-sm leading-relaxed text-zinc-400">
            Apakah Anda yakin ingin menghapus akun{" "}
            <strong className="text-white">
              {userName}
            </strong>
            ?
          </p>

          <p className="mt-3 text-xs text-red-400">
            Tindakan ini tidak dapat dibatalkan.
          </p>

          {/* ACTION BUTTONS */}
          <form
            action={removeUser}
            className="mt-8 flex flex-col gap-3 border-t border-zinc-700 pt-6 sm:flex-row"
          >
            <input
              type="hidden"
              name="userId"
              value={userId}
            />

            <button
              type="button"
              onClick={closeModal}
              autoFocus
              className="flex-1 rounded-full border border-zinc-600 px-5 py-3 text-sm font-semibold transition-all hover:bg-zinc-800"
            >
              Cancel
            </button>

            <ConfirmButton />

          </form>

        </div>
      </dialog>
    </>
  );
}
