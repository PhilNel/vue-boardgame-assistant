.PHONY: help
help:
	@echo "Available commands:"
	@echo "  dev        - Start development server"
	@echo "  lint       - Run ESLint"
	@echo "  lint-fix   - Run ESLint with --fix"
	@echo "  format     - Format with Prettier (write)"
	@echo "  typecheck  - Vue/TypeScript check (vue-tsc --noEmit)"
	@echo "  check      - lint + typecheck (no file writes)"
	@echo "  fix        - lint-fix + format"
	@echo "  build      - Build for production"
	@echo "  upload     - Upload to artefact bucket"
	@echo "  deploy     - Deploy to live bucket + invalidate cache"
	@echo "  clean      - Clean build artifacts"

.PHONY: dev
dev:
	bun run dev

.PHONY: lint
lint:
	bun run lint

.PHONY: lint-fix
lint-fix:
	bun run lint:fix

.PHONY: format
format:
	bun run format

.PHONY: typecheck
typecheck:
	bun run typecheck

.PHONY: check
check: lint typecheck

.PHONY: fix
fix: lint-fix format

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
