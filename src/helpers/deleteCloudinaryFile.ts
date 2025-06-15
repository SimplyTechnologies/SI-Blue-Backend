import cloudinary from "../configs/cloudinary";

export const deleteCloudinaryFile = async (publicId: string) => {
  if (!publicId) return;
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Failed to delete file from Cloudinary:', error);
  }
};