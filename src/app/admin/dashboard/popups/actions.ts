'use server'

import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import type { PopupAd } from '@/lib/types';

export async function addPopup(popupData: Omit<PopupAd, "id">) {
  const { name, content, display_delay, display_duration, is_active } = popupData;
  if (!name) {
    return { success: false, message: "Popup name is required." };
  }

  try {
    await sql.query(
      "INSERT INTO popups (name, content, display_delay, display_duration, is_active) VALUES ($1, $2, $3, $4, $5)",
      [name, content, display_delay, display_duration, is_active]
    );
    revalidatePath("/admin/dashboard/popups");
    return { success: true, message: "Popup added successfully." };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred.";
    return { success: false, message: `Failed to add popup: ${errorMessage}` };
  }
}

export async function updatePopup(popupData: PopupAd) {
  const { id, name, content, display_delay, display_duration, is_active } =
    popupData;
  if (!name) {
    return { success: false, message: "Popup name is required." };
  }

  try {
    await sql.query(
      "UPDATE popups SET name = $1, content = $2, display_delay = $3, display_duration = $4, is_active = $5 WHERE id = $6",
      [name, content, display_delay, display_duration, is_active, id]
    );
    revalidatePath("/admin/dashboard/popups");
    return { success: true, message: "Popup updated successfully." };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred.";
    return {
      success: false,
      message: `Failed to update popup: ${errorMessage}`,
    };
  }
}

export async function getActivePopup(): Promise<PopupAd | null> {
  try {
    // Ensure the query correctly fetches an active popup.
    // If there are no active popups, it should return null.
    const result = await sql.query<PopupAd>(
      "SELECT id, name, content, display_delay, display_duration, is_active, created_at FROM popups WHERE is_active = TRUE ORDER BY created_at DESC LIMIT 1"
    );
    // Check if result.rows is not empty before accessing index 0
    return result.rows.length > 0 ? result.rows[0] : null;
  } catch (error) {
    console.error("Failed to fetch active popup:", error);
    // Return null in case of any error during fetch
    return null;
  }
}

export async function deletePopup(popupId: number) {
  try {
    const result = await sql.query('DELETE FROM popups WHERE id = $1', [popupId]);

    if (result?.rowCount && result.rowCount > 0) {
      revalidatePath('/admin/dashboard/popups');
      return { success: true, message: 'Popup deleted successfully.' };
    } else {
      throw new Error('Popup not found or already deleted.');
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return { success: false, message: `Failed to delete popup: ${errorMessage}` };
  }
}

export async function togglePopupActive(popupId: number, currentState: boolean) {
  try {
    await sql.query("UPDATE popups SET is_active = $1 WHERE id = $2", [
      !currentState,
      popupId,
    ]);
    revalidatePath("/admin/dashboard/popups");
    return { success: true, message: "Popup status toggled successfully." };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred.";
    return {
      success: false,
      message: `Failed to toggle popup status: ${errorMessage}`,
    };
  }
}
