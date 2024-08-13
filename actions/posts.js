"use server";

import { redirect } from "next/navigation";
import { storePost, updatePostLikeStatus } from "@/lib/posts";
import { uploadImage } from "@/lib/cloudinary";
import { revalidatePath } from "next/cache";

export async function createPost(prevState, formData) {
  const title = formData.get("title");
  const image = formData.get("image");
  const content = formData.get("content");

  let errors = [];

  if (!title || title.trim().length === 0) {
    errors.push("Title Is Missing!");
  }
  if (!content || content.trim().length === 0) {
    errors.push("Content Is Required!");
  }
  if (!image || image.size === 0) {
    errors.push("Image Is Missing");
  }

  if (errors.length > 0) {
    return { errors };
  }
  let imageUrl;
  try {
    imageUrl = await uploadImage(image);
  } catch (error) {
    throw new Error("Image Upload Failed. Please Try Again");
  }

  await storePost({
    imageUrl: imageUrl,
    title,
    content,
    userId: 1,
  });
  revalidatePath("/" , "layout")
  redirect("/feed");
}
export default async function togglePostLikeStatus(postId){
   await updatePostLikeStatus(postId, 2)
   revalidatePath("/", "layout")
}