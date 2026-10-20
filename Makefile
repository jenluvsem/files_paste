.PHONY: all appstore clean install build test lint

APP_NAME=files_paste
APP_VERSION=1.0.0

all: build

install:
	composer install --no-dev --optimize-autoloader

build:
	npm run build

test:
	npm test

lint:
	for f in $$(find lib -name '*.php'); do php -l $$f || exit 1; done
	npm run lint

appstore: build
	rm -rf build/artifacts
	mkdir -p build/artifacts
	rm -rf build/pkg
	mkdir -p build/pkg/files_paste
	cp -r appinfo build/pkg/files_paste/
	cp -r lib build/pkg/files_paste/
	cp -r js build/pkg/files_paste/
	tar -czf build/artifacts/$(APP_NAME)-$(APP_VERSION).tar.gz -C build/pkg files_paste
	rm -rf build/pkg
	@echo "Built: build/artifacts/$(APP_NAME)-$(APP_VERSION).tar.gz"

clean:
	rm -rf node_modules
	rm -rf js
	rm -rf build/artifacts
	rm -rf vendor

distclean: clean
	rm -rf package-lock.json
	rm -rf composer.lock
