#!/usr/bin/env node

import { execSync } from "child_process";

console.log("🚀 Building for S3 deployment...");

console.log("🧹 Cleaning previous build...");
try {
  execSync("bun run clean", { stdio: "inherit" });
} catch (error) {
  console.log("No previous build to clean");
}

console.log("📦 Building application...");
execSync("bun run build:prod", { stdio: "inherit" });

console.log("✅ Build completed successfully!");
console.log("🔗 Ready for S3 deployment!");
