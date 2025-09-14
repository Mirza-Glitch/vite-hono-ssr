export default function About() {
  return (
    <div class="about-page">
      <h1>About Page</h1>
      <div class="card">
        <h2>About This Project</h2>
        <p>
          This is a SolidJS application with Vite and Hono for SSR. It
          demonstrates routing capabilities with multiple pages.
        </p>
        <ul>
          <li>Built with SolidJS for reactive UI</li>
          <li>Vite for fast development and building</li>
          <li>Hono for server-side rendering</li>
          <li>SolidJS Router for client-side routing</li>
        </ul>
      </div>
      <p class="read-the-docs">
        Navigate between pages using the navigation menu above.
      </p>
    </div>
  );
}
