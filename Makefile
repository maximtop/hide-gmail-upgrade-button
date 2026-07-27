# Thin wrapper over pnpm scripts. Browser can be passed as an extra goal:
#   make dev chrome / make release firefox
BROWSERS := chrome edge firefox
BROWSER_TARGET := $(firstword $(filter $(BROWSERS),$(MAKECMDGOALS)))

.PHONY: install start dev release build lint typecheck test validate $(BROWSERS)

install:
	pnpm install

start:
	pnpm dev chrome --watch

dev:
	pnpm dev $(BROWSER_TARGET)

release:
	pnpm release $(BROWSER_TARGET)

build:
	pnpm build

lint:
	pnpm lint

typecheck:
	pnpm typecheck

test:
	pnpm test

validate:
	pnpm validate

# No-op targets so "make dev chrome" treats the browser as an argument.
$(BROWSERS):
	@:
