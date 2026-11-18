#!/usr/bin/env node
import { spawn } from "node:child_process";
import { copyFileSync, existsSync } from "node:fs";
import { createServer } from "node:net";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const preferredPorts = [8787, 8788, 8789, 8790];

function run(command, args) {
  return new Promise(function (resolve, reject) {
    const child = spawn(command, args, {
      cwd: root,
      stdio: "inherit",
      shell: true,
      env: process.env,
    });
    child.on("error", reject);
    child.on("exit", function (code) {
      if (code === 0) resolve();
      else reject(new Error(command + " exited with code " + code));
    });
  });
}

function portFree(port) {
  return new Promise(function (resolve) {
    const server = createServer();
    server.unref();
    server.once("error", function () {
      resolve(false);
    });
    server.once("listening", function () {
      server.close(function () {
        resolve(true);
      });
    });
    server.listen(port, "127.0.0.1");
  });
}

async function pickPort() {
  for (const port of preferredPorts) {
    if (await portFree(port)) return port;
  }
  throw new Error("No free port in " + preferredPorts.join(", "));
}

function ensureDevVars() {
  const varsPath = join(root, ".dev.vars");
  const examplePath = join(root, ".dev.vars.example");
  if (existsSync(varsPath)) return false;
  if (!existsSync(examplePath)) {
    throw new Error("Missing .dev.vars and .dev.vars.example");
  }
  copyFileSync(examplePath, varsPath);
  return true;
}

async function main() {
  if (ensureDevVars()) {
    console.log("Created .dev.vars from .dev.vars.example");
    console.log("Set ADMIN_PASSWORD to 8+ characters before first admin login.");
  }

  console.log("Applying local D1 migrations...");
  await run("npx", ["wrangler", "d1", "migrations", "apply", "northgo-w4", "--local"]);

  console.log("Building site...");
  await run("node", ["build.mjs"]);

  const port = await pickPort();
  console.log("");
  console.log("Starting local Worker on http://127.0.0.1:" + port);
  console.log("  Contact: http://127.0.0.1:" + port + "/zh-tw/contact");
  console.log("  Admin:   http://127.0.0.1:" + port + "/admin/login");
  console.log("");

  const child = spawn("npx", ["wrangler", "dev", "--port", String(port)], {
    cwd: root,
    stdio: "inherit",
    shell: true,
    env: process.env,
  });
  child.on("error", function (err) {
    console.error(err.message || err);
    process.exit(1);
  });
  child.on("exit", function (code) {
    process.exit(code == null ? 0 : code);
  });
}

main().catch(function (err) {
  console.error(err.message || err);
  process.exit(1);
});
