# Bumbee Blinko deployment gates

## Test environment

- Host: `nhutphamthewann-ai`
- Project: `/home/nhutpham/bumbee-test/bumbee-blinko`
- URL inside the Bumbee tailnet: `http://100.75.135.29:1111`
- Docker project: `bumbee-blinko-test`
- The test database and containers are independent from production.

## Promotion gates

1. The pull request CI web and Docker builds must pass.
2. The feature must be manually tested on the physical server.
3. The owner must explicitly approve production deployment.
4. Back up the production PostgreSQL database and Blinko data volume.
5. Deploy an immutable image tagged with the approved commit SHA.
6. Run the production health check and retain the prior image for rollback.

Production deployment is intentionally not automated before owner approval.
