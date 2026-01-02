'use server'

import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import type { Article } from '@/lib/types';

export async function addArticle(articleData: Omit<Article, "slug" | "id">) {
  const { title, content, author_id, coverImage } = articleData;
  if (!title || !author_id) {
    return { success: false, message: "Title and author are required." };
  }

  const slug = title
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^\-+/, '')
    .replace(/\-+$/, '');

  try {
    await db.query(
      "INSERT INTO articles (title, slug, content, author_id, image, published_date) VALUES ($1, $2, $3, $4, $5, NOW())",
      [
        title,
        slug,
        content,
        author_id,
        coverImage ||
          `https://picsum.photos/1200/800?random=${Date.now()}`,
      ]
    );
    revalidatePath("/admin/dashboard/articles");
    return { success: true, message: "Article added successfully." };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred.";
    return { success: false, message: `Failed to add article: ${errorMessage}` };
  }
}

export async function updateArticle(articleData: Article) {
  const { id, title, content, coverImage, author_id } = articleData;
  if (!title) {
    return { success: false, message: "Article title is required." };
  }

  const newSlug = title
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^\-+/, '')
    .replace(/\-+$/, '');

  try {
    await db.query(
      "UPDATE articles SET title = $1, content = $2, image = $3, author_id = $4, slug = $5 WHERE id = $6",
      [title, content, coverImage, author_id, newSlug, id]
    );
    revalidatePath("/admin/dashboard/articles");
    revalidatePath(`/articles/${newSlug}`);
    return { success: true, message: "Article updated successfully." };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred.";
    return {
      success: false,
      message: `Failed to update article: ${errorMessage}`,
    };
  }
}

export async function deleteArticle(articleId: number) {
  try {
    const result = await db.query("DELETE FROM articles WHERE id = $1", [
      articleId,
    ]);

    if (result?.rowCount && result.rowCount > 0) {
      revalidatePath("/admin/dashboard/articles");
      return { success: true, message: "Article deleted successfully." };
    } else {
      throw new Error("Article not found or already deleted.");
    }
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred.";
    return {
      success: false,
      message: `Failed to delete article: ${errorMessage}`,
    };
  }
}
