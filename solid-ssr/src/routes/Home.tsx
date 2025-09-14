import { createSignal } from "solid-js";
import solidLogo from "../assets/solid.svg";

export default function Home() {
  const [count, setCount] = createSignal(0);

  return (
    <div class="home-page">
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src="/vite.svg" class="logo" alt="Vite logo" />
        </a>
        <a href="https://www.solidjs.com" target="_blank">
          <img src={solidLogo} class="logo solid" alt="Solid logo" />
        </a>
      </div>
      <h1>Welcome to Vite + Solid</h1>
      <div class="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count()}
        </button>
        <p>
          This is the Home page. Edit <code>src/routes/Home.tsx</code> and save
          to test HMR
        </p>
      </div>
      <p class="read-the-docs">
        Click on the Vite and Solid logos to learn more
      </p>
    </div>
  );
}
