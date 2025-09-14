## 🚀 Vite SSR + Hono Server

A modern SSR (Server-Side Rendering) setup using [Vite](https://vitejs.dev/) and [vite-ssr](https://vite.dev/guide/ssr), powered by a fast [Hono](https://hono.dev/) server.

---

### 📦 Quickstart via Git (Gitpick)

You can clone just this folder from a monorepo or template using:

```bash
bunx gitpick Mirza-Glitch/vite-hono-ssr/solid-ssr my-app

# or

npx degit Mirza-Glitch/vite-hono-ssr/solid-ssr my-app
```

---

### 🧱 Stack

- ⚡️ **Vite** – blazing fast dev server & bundler
- 🌐 **Hono** – ultrafast web framework for building backend APIs & SSR apps
- 📦 Optional: **Bun**, **Node.js**, or **Deno** (your choice)

---

### 📁 Project Structure

```
.
├── dist/                   # Built files (client + server)
│   ├── client/
│   │   └── index.html/         # index file with other assets
│   └── server/
│       └── entry-server.js
├── src/
│   ├── entry-client.ts     # Vite client entry
│   ├── entry-server.ts     # vite-ssr server entry
│   └── router/              # App pages (code-based routing)
├── server.ts               # Hono server
├── index.html              # Vite HTML template
└── vite.config.ts
```

---

### 📦 Install Dependencies

```bash
bun install
```

---

### 🧪 Development

```bash
bun run dev
```

- Starts Vite and uses it as middleware
- Hono handles SSR and static file fallback

---

### 🏗️ Build

```bash
bun run build
```

This will:

1. Build the client-side app: `vite build`
2. Build the SSR entry and manifest

---

### 🚀 Start (Production)

```bash
bun run preview
```

Starts the **Hono server in production mode**, serving pre-built assets and handling SSR.

---

### ⚙️ Custom Static File Handling

Static files (like `.js`, `.css`, `.png`) are served **only if the request has a file extension**. All other routes are handled via SSR.

Example in `server.ts`:

```ts
if (/\.[^\/]+$/.test(c.req.path)) {
  serveStatic({
    root: "./dist/client",
  })(c, next);
}
```

---

### 🔌 Backend Integration

Easily extend this setup by adding your own **Hono RPC**, **tRPC**, or even **REST** routes of your own choice to handle backend logic alongside SSR.

---

### 🤝 Contributions

Feel free to open issues or submit pull requests!
Whether it’s a bug fix, new template, or just some ✨ polish ✨ — your contributions are always welcome.
