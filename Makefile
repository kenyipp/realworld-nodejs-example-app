test-build:
	yarn clean && yarn build 
	node ./apps/users/cron.js

qa:
	yarn prettify && yarn check-types && yarn lint:fix

size-check:
	echo "Installing the production dependencies..."
	yarn install --production --frozen-lockfile --silent
	du -sh node_modules/* | sort -hr
	echo "Installing the development dependencies..."
	yarn install --frozen-lockfile --silent

reset-head:
	git checkout develop
	git fetch origin
	git reset --hard origin/develop

spell-check:
	./node_modules/cspell/bin.mjs ./apps/* ./packages/* --no-progress -u
