import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/dashboard",
          "/dashboard/*",
          "/api",
          "/api/*",
          "/login",
          "/signup",
          "/reset",
          "/reset/*",
        ],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/dashboard", "/api", "/login", "/signup", "/reset"],
      },
    ],
    sitemap: "https://mailzeno.dev/sitemap.xml",
    host: "https://mailzeno.dev",
  };
}