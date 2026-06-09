import { retrieve } from "./retriever.js";

const results = retrieve("what are the interest rated for a fixed mortgage");
console.log(JSON.stringify(results, null, 2));
