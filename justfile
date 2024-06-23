export PATH := justfile_directory() + "/node_modules/.bin:" + env_var('PATH')

default:
    @just --list

setup:
    @echo ""
    @echo "🍜 Setting up project"
    @echo ""

    ./template/tools.sh

    @echo ""
    @echo "👍 Done"
    @echo ""

# runs nekos/act with the current branch
test:
    @echo ""
    @echo "🧪 Running tests"
    @echo ""

    act \
        -P ubuntu-latest=nektos/act-environments-ubuntu:18.04 \
        --secret-file .secrets \
        --env-file .env \
        -W .github/workflows/test.yml

    @echo ""
    @echo "👍 Done"
    @echo ""
