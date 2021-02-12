import yargs from "yargs";
import { createServer } from "./server";

const LISTEN_DOMAIN = "local.s2n.tech";

const argv = yargs
  .option("origin-port", {
    alias: "p",
    description: "origin server port number",
    type: "number",
    demandOption: true,
  })
  .option("listen-port", {
    alias: "P",
    description: "listening port number",
    type: "number",
    default: 5000,
  })
  .help()
  .locale("en").argv;

createServer(argv["origin-port"], argv["listen-port"])
  .then(() =>
    console.log(`Proxy server is now ready: https://${LISTEN_DOMAIN}:${argv["listen-port"]}`),
  )
  .catch(console.error);
