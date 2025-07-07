.PHONY: help
help:
	@echo "Available commands:"
	@echo "  dev     - Start development server"
	@echo "  build   - Build for production"
	@echo "  upload  - Upload to artefact bucket"
	@echo "  deploy  - Deploy to live bucket + invalidate cache"
	@echo "  clean   - Clean build artifacts"

.PHONY: dev
dev:
	bun run dev

.PHONY: build
build:
	bun run build:s3

.PHONY: clean
clean:
	bun run clean

.PHONY: upload
upload: build
	S3_ARTEFACT_BUCKET=boardgame-assistant-artefacts-dev-eu-west-1 bun run deploy:s3

.PHONY: deploy
deploy: build
	S3_ARTEFACT_BUCKET=boardgame-assistant-dev-eu-west-1 S3_PREFIX= bun run deploy:s3
	bun run invalidate 