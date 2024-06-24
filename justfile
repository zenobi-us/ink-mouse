export PATH := justfile_directory() + "/node_modules/.bin:" + env_var('PATH')

default:
    @just --list

setup:
    @echo ""
    @echo "🍜 Setting up project"
    @echo ""

    @yarn install

    @echo ""
    @echo "👍 Done"
    @echo ""

lint:
    @eslint --ext .ts .

types:
    @tsc --noEmit \
        --project \
        ./tsconfig.json

unittest:
    @vitest \
        --dir ./src

integrationtest:
    @echo 0

dev:
    @tsx \
        --watch \
        ./src/demo/index.tsx

build:
    @tsup \
        --dts \
        --cjsInterop

    @attw --pack

docs:
    @typedoc \
        --plugin typedoc-plugin-markdown \
        --tsconfig ./tsconfig.lib.json \
        --out dist/docs \
        ./src/ink-mouse.ts \
            --hideBreadcrumbs true \
            --namedAnchors true \
            --disableSources \
            --readme ./README.md \
            --hideInPageTOC true \
            --hidePageTitle true \
            --hideGenerator true

    @inject-markdown ./README.md

    @rm -rf dist/docs

publish TAG="next":
    yarn npm publish \
        --tag "{{TAG}}"
