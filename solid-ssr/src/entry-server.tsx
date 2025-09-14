import { renderToString } from "solid-js/web";
import App from "./App";

export function render(url: string) {
  const html = renderToString(() => <App path={url} />);
  return { html };
}
