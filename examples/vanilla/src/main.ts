import "./style.css";
import { Redis } from "@upstash/redis";

const redis = new Redis({ url: "", token: "" });
console.log(redis);

// eslint-disable-next-line no-undef
const app = document.querySelector<HTMLDivElement>("#app")!;

app.innerHTML =
	`
  <h1>Hello Vite!</h1>
  <a href="https://vitejs.dev/guide/features.html" target="_blank">Documentation</a>
`;
