import "./App.css";
import { Router, Route } from "@solidjs/router";
import Home from "./routes/Home";
import About from "./routes/About";
import Contact from "./routes/Contact";
import { JSXElement } from "solid-js";

function Layout(props: { children: JSXElement }) {
  return (
    <div class="App">
      <nav class="navigation">
        <a href="/" class="nav-link">
          Home
        </a>
        <a href="/about" class="nav-link">
          About
        </a>
        <a href="/contact" class="nav-link">
          Contact
        </a>
      </nav>

      <main class="main-content"> {props.children}</main>
    </div>
  );
}

export default function App({ path }: { path?: string }) {
  return (
    <Router url={path} root={(props) => <Layout children={props.children} />}>
      <Route path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/contact" component={Contact} />
    </Router>
  );
}
