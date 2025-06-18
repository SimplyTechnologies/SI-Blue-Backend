import cloudinary from '../configs/cloudinary';

export const getUserAvatarUrlFromId = (avatarPublicId?: string | null) => {
  if (!avatarPublicId) return;
  return `https://res.cloudinary.com/${cloudinary.config().cloud_name}/image/upload/c_fill,g_auto,q_auto,f_auto/${avatarPublicId}`;
};

