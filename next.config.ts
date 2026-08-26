import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/category/automotive-battery",
        destination:
          "https://jcblbatteries.com/category/auto-starting-series/",
        permanent: true,
      },
      {
        source: "/category/backup-applications-batteries",
        destination:
          "https://jcblbatteries.com/category/backup-applications/",
        permanent: true,
      },
      {
        source: "/category/lithium-ion-batteries",
        destination:
          "https://jcblbatteries.com/category/lithium-ion-batteries/",
        permanent: true,
      },
      {
        source: "/category/motorcycle-starting-series",
        destination:
          "https://jcblbatteries.com/category/motorcycle-starting-series/",
        permanent: true,
      },
    ];
  },

  async rewrites() {
    return [
      {
        source: "/wp-content/:path*",
        destination:
          "https://api.jcblautomoto.com/wp-content/:path*",
      },
    ];
  },
};

export default nextConfig;