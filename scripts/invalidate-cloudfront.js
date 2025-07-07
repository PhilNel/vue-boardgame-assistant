#!/usr/bin/env node

import { execSync } from "child_process";

const CLOUDFRONT_DISTRIBUTION_ID =
  process.env.CLOUDFRONT_DISTRIBUTION_ID || "E2TG71WCF6SOU";
const AWS_PROFILE = process.env.AWS_PROFILE || "default";

console.log(`Invalidating CloudFront cache`);
console.log(`Distribution: ${CLOUDFRONT_DISTRIBUTION_ID}`);

try {
  const invalidateCommand = `aws cloudfront create-invalidation --distribution-id ${CLOUDFRONT_DISTRIBUTION_ID} --paths "/*" --profile ${AWS_PROFILE}`;

  const invalidationResult = execSync(invalidateCommand, { encoding: "utf8" });
  const invalidationData = JSON.parse(invalidationResult);
  const invalidationId = invalidationData.Invalidation.Id;

  console.log(`✅ CloudFront invalidation created: ${invalidationId}`);
} catch (error) {
  console.error("❌ CloudFront invalidation failed:", error.message);
  process.exit(1);
}
