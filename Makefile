pre-commit:
	pnpm test
	pnpm run lint:fix
	pnpm run format
	pnpm run spell-check
	pnpm run check-types

deploy:
	pnpm run build
	cd ./apps/server && rm -r ./node_modules && yarn install --production

install:
	cd ./apps/server && rm -r ./node_modules
	pnpm install


