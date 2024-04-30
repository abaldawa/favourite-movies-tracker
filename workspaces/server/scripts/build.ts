import esbuild from "esbuild";
import { readFile } from "fs/promises";
import path from "path";
import { ChildProcess, fork } from "child_process";

type BuildOptions = esbuild.BuildOptions & {
  env: "production" | "development";
};

export async function createContext(options: BuildOptions) {
  const { env, ...buildOptions } = options;

  const nodeVersion = (
    await readFile(path.join(__dirname, "../../../.node-version"), "utf8")
  ).trim();

  return await esbuild.context({
    entryPoints: ["./src/server.ts"],
    outfile: "./dist/server.js",
    define: {
      "process.env.NODE_ENV": `"${env}"`,
    },
    external: ["express"], // Some libraries have to be marked as external
    platform: "node", // When building for node we need to setup the environment for it
    target: `node${nodeVersion}`,
    bundle: true,
    minify: env === "production",
    sourcemap: env === "development",
    ...buildOptions,
  });
}

async function dev() {
  let serverProc: ChildProcess;

  const restartServer = () => {
    serverProc?.kill();
    serverProc = fork("./dist/server.js");
    serverProc.on("error", () => {
      console.log("error, killing process...");
      serverProc.kill();
    });
  };

  const context = await createContext({
    env: "development",
    plugins: [
      {
        name: "build-plugin",
        setup(build) {
          let count = 0;
          build.onEnd((result) => {
            if (count++ > 0) {
              console.log("Build succeeded.");
              console.log("Restarting server...");
            }
            restartServer();
          });
        },
      },
    ],
  });

  await context.watch();

  console.log("Watching for changes...");
}

async function build() {
  const context = await createContext({ env: "production" });

  await context.dispose();
}

const args = process.argv.slice(2);
if (args[0] === "dev") {
  dev();
} else {
  build();
}
