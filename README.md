# Board Game Assistant Website

Vue.js frontend for the Board Game AI Rules Assistant, providing a chat interface for querying board game rules with citation support.

## Prerequisites

- Bun (or Node.js)
- AWS CLI configured (for deployment)

## Development

1. Install dependencies:

```bash
bun install
```

2. Start development server:

```bash
# Direct command
bun dev

# Or Make target
make dev
```

3. Build for production:

```bash
# Direct command
bun run build:s3

# Or Make target
make build
```

## Deployment

The application is deployed to AWS S3 with CloudFront distribution:

```bash
# Direct commands
bun run build:s3 && bun run deploy:s3 && bun run invalidate

# Or Make target
make deploy
```

## Related Repositories

- [`go-boardgame-assistant`](https://github.com/PhilNel/go-boardgame-assistant) - Collection of Lambdas used to process the knowledge base and provide an API to the Board Game Assistant project.

- [`infra-boardgame-assistant`](https://github.com/PhilNel/infra-boardgame-assistant) - Terraform configuration for deploying the infrastructure and managing Lambda permissions, S3 buckets, etc.

- [`knowledge-boardgame-assistant`](https://github.com/PhilNel/knowledge-boardgame-assistant) - Collection of structured board game rules in markdown format that forms the knowledge base for this project.

- [`pulumi-boardgame-assistant`](https://github.com/PhilNel/pulumi-boardgame-assistant) - Pulumi repository for adding references/citations used by knowledge base.
