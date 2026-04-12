import { Cloudinary } from "@cloudinary/url-gen";

const cld = new Cloudinary({
  cloud: {
    cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
  },
});

export default cld;

// Helper to get optimized URL
export const getCloudinaryImageUrl = (publicId: string) => {
  return cld.image(publicId).format('auto').quality('auto').toURL();
};

export const getCloudinaryVideoUrl = (publicId: string) => {
  return cld.video(publicId).format('auto').quality('auto').toURL();
};
