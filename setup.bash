#!/usr/bin/env bash

set -euo pipefail

HELP="
Usage:

bash $0 PACKAGE_NAME GH_USER AUTHOR_NAME LICENSE

All arguments are optional and will be interactively prompted when not given.

PACKAGE_NAME.
   A name for your new package.

EXPORT_NAME.
   The name of the package in the export map. Defaults to the package name with
   hyphens replaced by underscores and in lowercase.

GH_USER.
   Your GitHub/GitLab username.

AUTHOR_NAME.
   Your name, used for licensing.

GITHUB_REPO.
   The URL to the GitHub repository.

PRIMARY_BRANCH.
   The primary branch of the repository. Defaults to 'master'.

LICENSE.
   A license keyword.
   https://help.github.com/en/github/creating-cloning-and-archiving-repositories/licensing-a-repository#searching-github-by-license-type
"

ask_for() {
    local prompt="$1"
    local default_value="${2:-}"
    local alternatives="${3:-"[$default_value]"}"
    local value=""

    while [ -z "$value" ]; do
        echo "$prompt" >&2
        if [ "[]" != "$alternatives" ]; then
            echo -n "$alternatives " >&2
        fi
        echo -n "> " >&2
        read -r value
        echo >&2
        if [ -z "$value" ] && [ -n "$default_value" ]; then
            value="$default_value"
        fi
    done

    printf "%s\n" "$value"
}

download_license() {
    local keyword file
    keyword="$1"
    file="$2"

    curl -qsL "https://raw.githubusercontent.com/github/choosealicense.com/gh-pages/_licenses/${keyword}.txt" |
        extract_license >"$file"
}

extract_license() {
    awk '/^---/{f=1+f} f==2 && /^$/ {f=3} f==3'
}

test_url() {
    curl -fqsL -I "$1" | head -n 1 | grep 200 >/dev/null
}

ask_license() {
    local license keyword

    printf "%s\n" "Please choose a LICENSE keyword." >&2
    printf "%s\n" "See available license keywords at" >&2
    printf "%s\n" "https://help.github.com/en/github/creating-cloning-and-archiving-repositories/licensing-a-repository#searching-github-by-license-type" >&2

    while true; do
        license="$(ask_for "License keyword:" "APACHE-2.0" "MIT/APACHE-2.0/MPL-2.0/AGPL-3.0")"
        keyword=$(echo "$license" | tr '[:upper:]' '[:lower:]')

        url="https://choosealicense.com/licenses/$keyword/"
        if test_url "$url"; then
            break
        else
            printf "Invalid license keyword: %s\n" "$license"
        fi
    done

    printf "%s\n" "$keyword"
}

set_placeholder() {
    local name value out file tmpfile
    name="$1"
    value="$2"
    out="$3"

    # loop through file contents and replace placeholders
    git grep -P -l -F --untracked "$name" -- "$out" |
        while IFS=$'\n' read -r file; do
            tmpfile="$file.sed"
            sed "s#$name#$value#g" "$file" >"$tmpfile" && mv "$tmpfile" "$file"

            # if filename contains placeholder, rename it
            if echo "$file" | grep -q "$name"; then
                mv "$file" "${file/$name/$value}"
            fi
        done

}

setup() {
    local cwd
    local out
    local package_name
    local package_repo
    local author_name
    local github_username
    local ok
    local primary_branch

    cwd="$PWD"
    out="$cwd/out"

    # ask for arguments not given via CLI
    package_name="${1:-$(ask_for "Name for your package")}"
    package_name="${package_name/-/}"

    # export name will be
    # - the scope removed
    export_name="${2:-package_name/@/}"
    # - the package name with hyphens replaced by underscores
    export_name="${export_name//-/_}"
    # - and in lowercase
    export_name="${export_name,,}"

    github_username="${3:-$(ask_for "Your GitHub username")}"
    author_name="${4:-$(ask_for "Your name" "$(git config user.name 2>/dev/null)")}"
    package_repo="${5:-$(ask_for "The github repo" "https://github.com/$github_username/$package_name")}"
    primary_branch="${6:-"master"}"

    license_keyword="${7:-$(ask_license)}"
    license_keyword="$(echo "$license_keyword" | tr '[:upper:]' '[:lower:]')"

    cat <<-EOF
        Setting up package: $package_name

        author:        $author_name
        package repo:  $package_repo
        export name:   $export_name

        license:       https://choosealicense.com/licenses/$license_keyword/

        After confirmation, the \`$primary_branch\` will be replaced with the generated
        template using the above information. Please ensure all seems correct.
	EOF

    ok="${8:-$(ask_for "Type \`yes\` if you want to continue.")}"

    if [ "yes" != "$ok" ]; then
        printf "Nothing done.\n"
        exit 0
    fi

    (
        set -e
        # previous cleanup to ensure we can run this program many times
        git branch template 2>/dev/null || true
        git checkout -f template
        git worktree remove -f out 2>/dev/null || true
        git branch -D out 2>/dev/null || true

        # checkout a new worktree and replace placeholders there
        git worktree add --detach out

        cd "$out"
        git checkout --orphan out
        git rm -rf "$out" >/dev/null
        git read-tree --prefix="" -u template:template/

        download_license "$license_keyword" "$out/LICENSE"
        sed -i '1s;^;TODO: INSERT YOUR NAME & COPYRIGHT YEAR (if applicable to your license)\n;g' "$out/LICENSE"

        set_placeholder "<PACKAGE NAME>" "$package_name" "$out"
        set_placeholder "<PACKAGE REPO>" "$package_repo" "$out"
        set_placeholder "<EXPORT NAME>" "$export_name" "$out"
        set_placeholder "<YOUR NAME>" "$author_name" "$out"
        set_placeholder "<YOUR GITHUB USERNAME>" "$github_username" "$out"
        set_placeholder "<PRIMARY BRANCH>" "$primary_branch" "$out"

        git add "$out"

        # rename GitHub specific files to final filenames
        git commit -m "Generate $package_name package from template."

        cd "$cwd"
        git branch -M out "$primary_branch"
        git worktree remove -f out
        git checkout -f "$primary_branch"

        printf "All done.\n"
        printf "Your %s branch has been reset to an initial commit.\n" "$primary_branch"
        printf "Push to origin/%s with \`git push --force-with-lease\`\n" "$primary_branch"

        printf "Review these TODO items:\n"
        git grep -P -n -C 3 "TODO"
    ) || cd "$cwd"
}

case "${1:-}" in
"-h" | "--help" | "help")
    printf "%s\n" "$HELP"
    exit 0
    ;;
"tools")
    ./template/tools.sh
    ;;
*)
    setup "$@"
    ;;
esac
