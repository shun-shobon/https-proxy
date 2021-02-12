import { fastify, FastifyInstance, FastifyLoggerInstance } from "fastify";
import fastifyHttpProxy from "fastify-http-proxy";
import { execSync } from "child_process";
import { join } from "path";
import { Http2SecureServer, Http2ServerRequest, Http2ServerResponse } from "http2";

export type Server = FastifyInstance<
  Http2SecureServer,
  Http2ServerRequest,
  Http2ServerResponse,
  FastifyLoggerInstance
>;
export const createServer = async (originPort: number, listenPort: number): Promise<Server> => {
  const keyPath = join(__dirname, "..", "key.yml");
  const stdOut = execSync(["sops", "--output-type", "json", "-d", keyPath].join(" "));
  const { cert, key } = JSON.parse(stdOut.toString("utf-8"));
  const server = fastify({
    http2: true,
    https: { cert, key },
  });

  server.register(fastifyHttpProxy, {
    upstream: `http://localhost:${originPort}`,
  });

  await server.listen({ host: "localhost", port: listenPort });

  return server;
};
