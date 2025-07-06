#!/usr/bin/env node

import { execSync } from "child_process";
import { existsSync } from "fs";

const S3_ARTEFACT_BUCKET =
  process.env.S3_ARTEFACT_BUCKET ||
  "boardgame-assistant-artefacts-dev-eu-west-1";
const S3_PREFIX =
  process.env.S3_PREFIX !== undefined
    ? process.env.S3_PREFIX
    : "vue-boardgame-assistant";
const AWS_PROFILE = process.env.AWS_PROFILE || "default";
const CLOUDFRONT_DISTRIBUTION_ID = 
  process.env.CLOUDFRONT_DISTRIBUTION_ID || "E2TG71WCF6SOU";
const DIST_DIR = "dist";

if (!S3_ARTEFACT_BUCKET) {
  console.error(
    "❌ Error: S3_ARTEFACT_BUCKET environment variable is required"
  );
  console.log("Usage: S3_ARTEFACT_BUCKET=your-bucket-name bun run deploy:s3");
  process.exit(1);
}

if (!existsSync(DIST_DIR)) {
  console.error(
    "❌ Error: dist/ directory not found. Run 'bun run build:s3' first"
  );
  process.exit(1);
}

const prefixToUse = S3_PREFIX ? `${S3_PREFIX}/` : "";
const targetPath = `s3://${S3_ARTEFACT_BUCKET}/${prefixToUse}`;

console.log(`🚀 Uploading to S3 bucket: ${S3_ARTEFACT_BUCKET}`);
console.log(`🏷️ Prefix: ${S3_PREFIX || "(root)"}`);
console.log(`☁️ CloudFront Distribution: ${CLOUDFRONT_DISTRIBUTION_ID}`);

try {
  execSync("aws --version", { stdio: "pipe" });
} catch (error) {
  console.error("❌ AWS CLI not found. Please install it first.");
  process.exit(1);
}

try {
  console.log("📦 Syncing files to S3...");
  const syncCommand = `aws s3 sync ${DIST_DIR}/ ${targetPath} --profile ${AWS_PROFILE} --delete`;

  execSync(syncCommand, { stdio: "inherit" });

  console.log("✅ S3 upload completed!");

  // Invalidate CloudFront cache
  console.log("🔄 Invalidating CloudFront cache...");
  const invalidateCommand = `aws cloudfront create-invalidation --distribution-id ${CLOUDFRONT_DISTRIBUTION_ID} --paths "/*" --profile ${AWS_PROFILE}`;
  
  const invalidationResult = execSync(invalidateCommand, { encoding: "utf8" });
  const invalidationData = JSON.parse(invalidationResult);
  const invalidationId = invalidationData.Invalidation.Id;
  
  console.log(`✅ CloudFront invalidation created: ${invalidationId}`);
  console.log("⏳ Cache invalidation typically takes 1-3 minutes to complete");
  console.log("🌐 Your website should reflect the latest changes shortly!");

} catch (error) {
  console.error("❌ Deployment failed:", error.message);
  process.exit(1);
}
