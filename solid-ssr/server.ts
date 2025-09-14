import { Hono } from "hono";
import type { ViteDevServer } from "vite";
import { render as renderFunc } from "./src/entry-server.js";
import { generateHydrationScript } from "solid-js/web";
import { createServer } from "vite";
import { serveStatic } from "hono/bun";

// Constants
const port = Number(process.env.PORT) || 5173;
const base = process.env.BASE || "/";
const isProduction = process.env.NODE_ENV == "production";

const app = new Hono();

app.use("/health", async (c) => c.text("OK", 200));

if (!isProduction) {
  const vite: ViteDevServer = await createServer({
    server: { middlewareMode: true },
    appType: "custom",
    base,
  });

  // Handle all static assets
  app.use("*", async (c, next) => {
    const url = new URL(c.req.url).pathname;

    try {
      // Optional - Skip if it's the root path or a route path
      // const routePaths = ["/", "/about", "/contact"];
      // if (routePaths.some((route) => url === route)) return next();

      // Handle Vite-specific routes
      if (url.startsWith("/@") || url.startsWith("/node_modules/")) {
        const transformed = await vite!.transformRequest(url, { ssr: false });
        if (transformed) {
          return new Response(transformed.code, {
            headers: {
              "Content-Type": "application/javascript",
              "Cache-Control": "no-cache",
            },
          });
        }
      }

      // Handle src files
      if (url.startsWith("/src/")) {
        const filePath = url.replace("/src/", "./src/");
        const file = Bun.file(filePath);

        if (await file.exists()) {
          const content = await file.text();
          const transformed = await vite!.transformRequest(url, { ssr: false });

          if (transformed) {
            return new Response(transformed.code, {
              headers: {
                "Content-Type": "application/javascript",
                "Cache-Control": "no-cache",
              },
            });
          }

          return new Response(content, {
            headers: {
              "Content-Type": getContentType(filePath),
              "Cache-Control": "no-cache",
            },
          });
        }
      }

      // Handle public files (files that start with / but not /src/ or /@)
      if (
        url.startsWith("/") &&
        !url.startsWith("/src/") &&
        !url.startsWith("/@")
      ) {
        const filePath = `./public${url}`;
        const file = Bun.file(filePath);

        if (await file.exists()) {
          const content = await file.arrayBuffer();
          return new Response(content, {
            headers: {
              "Content-Type": getContentType(filePath),
              "Cache-Control": "no-cache",
            },
          });
        }
      }
    } catch (e) {
      console.log("Asset serving error:", e);
    }

    return next();
  });

  // Serve HTML
  app.use("*", async (c) => {
    try {
      const url = new URL(c.req.url).pathname;

      let template: string;
      let render: typeof renderFunc;

      // Always read fresh template in development
      template = await Bun.file("./index.html").text();
      template = await (vite as ViteDevServer).transformIndexHtml(
        url,
        template
      );
      render = (
        await (vite as ViteDevServer).ssrLoadModule("/src/entry-server.tsx")
      ).render;

      const rendered = render(url);

      const head = generateHydrationScript();
      const html = template
        .replace(`<!--app-head-->`, head)
        .replace(`<!--app-html-->`, rendered.html ?? "");

      return c.html(html, {
        status: 200,
        headers: {
          "Content-Type": "text/html",
        },
      });
    } catch (e) {
      vite?.ssrFixStacktrace(e);
      console.log(e.stack);
      return c.text(e.stack ?? "Internal Server Error", {
        status: 500,
      });
    }
  });
} else {
  // @ts-ignore - this file might not exist initially
  const render = (await import("./dist/server/entry-server.js")).render;

  app.use(
    "/assets/*",
    serveStatic({
      root: "./dist/client",
      rewriteRequestPath: (path) => path.replace(/^\/assets/, "/assets"),
    })
  );

  // @ts-ignore - this file might not exist initially
  const template = await Bun.file("./dist/client/index.html").text();

  app.get("/index.html", (c) => c.redirect("/"));

  app.get("*", async (c, next) => {
    try {
      const url = c.req.path;

      // Check if the path has a file extension (like .js, .css, .png, etc.)
      if (/\.[^\/]+$/.test(url)) {
        return serveStatic({
          root: "./dist/client",
        })(c, next);
      }

      const rendered = render(url);
      const head = (rendered.head ?? "") + generateHydrationScript();

      const html = template
        .replace(`<!--app-head-->`, head)
        .replace(`<!--app-html-->`, rendered.html ?? "");

      return c.html(html, 200);
    } catch (e) {
      console.log(e.stack);
      return c.text(e.stack, 500);
    }
  });
}

function getContentType(filePath: string): string {
  const ext = filePath.split(".").pop()?.toLowerCase();
  let contentTypes = {
    js: "application/javascript",
    ts: "application/typescript",
    tsx: "application/javascript",
    jsx: "application/javascript",
    css: "text/css",
    html: "text/html",
    json: "application/json",
    svg: "image/svg+xml",
    png: "image/png",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    gif: "image/gif",
    ico: "image/x-icon",
    woff: "font/woff",
    woff2: "font/woff2",
    ttf: "font/ttf",
    eot: "application/vnd.ms-fontobject",
  };
  return contentTypes[ext as keyof typeof contentTypes] ?? "text/plain";
}

export default {
  port,
  fetch: app.fetch,
};
