export const getImageUrl = (url: string) => {
  if (!url) return "";

  return url.replace(
    "https://api.jcblautomoto.com",
    "https://www.jcblautomoto.com"
  );
};