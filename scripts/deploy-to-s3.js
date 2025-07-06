#!/usr/bin/env node

import { execSync } from "child_process";
import { existsSync } from "fs";

const S3_ARTEFACT_BUCKET = process.env.S3_ARTEFACT_BUCKET || "boardgame-assistant-artefacts-dev-eu-west-1";
const S3_PREFIX = process.env.S3_PREFIX || "vue-boardgame-assistant";
const AWS_PROFILE = process.env.AWS_PROFILE || "default";
const DIST_DIR = "dist";

if (!S3_ARTEFACT_BUCKET) {
  console.error("❌ Error: S3_ARTEFACT_BUCKET environment variable is required");
  console.log("Usage: S3_ARTEFACT_BUCKET=your-bucket-name bun run deploy:s3");
  process.exit(1);
}

if (!existsSync(DIST_DIR)) {
  console.error(
    "❌ Error: dist/ directory not found. Run 'bun run build:s3' first"
  );
  process.exit(1);
}

console.log(`🚀 Uploading to S3 bucket: ${S3_ARTEFACT_BUCKET}`);

try {
  execSync("aws --version", { stdio: "pipe" });
} catch (error) {
  console.error("❌ AWS CLI not found. Please install it first.");
  process.exit(1);
}

try {
  console.log("Syncing files...");

  execSync(
    `aws s3 sync ${DIST_DIR}/ s3://${S3_ARTEFACT_BUCKET}/${S3_PREFIX}/ --profile ${AWS_PROFILE} --delete`,
    { stdio: "inherit" }
  );

  console.log("✅ Upload completed!");
} catch (error) {
  console.error("❌ Upload failed:", error.message);
  process.exit(1);
}
