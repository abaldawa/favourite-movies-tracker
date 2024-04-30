import esbuild from "esbuild";

type BuildOptions = esbuild.BuildOptions & {
  env: "production" | "development";
};

export async function createContext(options: BuildOptions) {
  const { env, ...buildOptions } = options;

  return await esbuild.context({
    entryPoints: ["./src/index.tsx"], // We read the React application from this entrypoint
    outfile: "./public/index.js", // We output a single file in the public/ folder (remember that the "script.js" is used inside our HTML page)
    define: {
      "process.env.NODE_ENV": `"${env}"`, // We need to define the Node.js environment in which the client is built
    },
    bundle: true,
    minify: env === "production",
    sourcemap: env === "development",
    ...buildOptions,
  });
}

async function dev() {
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
            }
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
