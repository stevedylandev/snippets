#!/usr/bin/env bash
set -euo pipefail

GITHUB_REPO="https://github.com/stevedylandev/snippets-cli"
CLI_NAME="snip"

INSTALL_DIR="$HOME/.local/share"
BIN_DIR="$INSTALL_DIR/snippets"

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

error() {
    echo -e "${RED}error:${NC} $*" >&2
    exit 1
}

success() {
    echo -e "${GREEN}$*${NC}"
}

# Detect platform
detect_platform() {
    local platform=$(uname -s)
    local arch=$(uname -m)

    case "$platform" in
        "Darwin")
            platform="Darwin"
            ;;
        "Linux")
            platform="Linux"
            ;;
        MINGW*|MSYS*|CYGWIN*)
            platform="Windows"
            ;;
        *)
            error "Unsupported platform: $platform"
            ;;
    esac

    case "$arch" in
        "x86_64"|"amd64")
            arch="x86_64"
            ;;
        "arm64"|"aarch64")
            arch="arm64"
            ;;
        "i386"|"i686")
            arch="i386"
            ;;
        *)
            error "Unsupported architecture: $arch"
            ;;
    esac

    echo "${platform}_${arch}"
}

# Download and install the CLI
install_cli() {
    local platform=$1
    local download_url="${GITHUB_REPO}/releases/latest/download/snippets-cli_${platform}.tar.gz"
    local temp_dir=$(mktemp -d)

    echo "Downloading ${CLI_NAME}..."
    curl -L "$download_url" -o "$temp_dir/${CLI_NAME}.tar.gz" || error "Failed to download ${CLI_NAME}"

    echo "Extracting ${CLI_NAME}..."
    tar -xzf "$temp_dir/${CLI_NAME}.tar.gz" -C "$temp_dir" || error "Failed to extract ${CLI_NAME}"

    mkdir -p "$BIN_DIR" || error "Failed to create bin directory"
    mv "$temp_dir/${CLI_NAME}" "$BIN_DIR/" || error "Failed to move ${CLI_NAME} to bin directory"
    chmod +x "$BIN_DIR/${CLI_NAME}" || error "Failed to make ${CLI_NAME} executable"

    rm -rf "$temp_dir"
}

# Update shell configuration
update_shell_config() {
    local shell_config
    case $SHELL in
        */zsh)
            shell_config="$HOME/.zshrc"
            ;;
        */bash)
            shell_config="$HOME/.bashrc"
            ;;
        */fish)
            shell_config="$HOME/.config/fish/config.fish"
            ;;
        *)
            echo "Unsupported shell. Please add the following to your shell configuration:"
            echo "export PATH=\"$BIN_DIR:\$PATH\""
            return
            ;;
    esac

    echo "Updating shell configuration..."
    echo "export PATH=\"$BIN_DIR:\$PATH\"" >> "$shell_config"
    echo "Shell configuration updated. Please restart your shell or run 'source $shell_config'"
}

main() {
    local platform=$(detect_platform)
    install_cli "$platform"
    update_shell_config
    success "${CLI_NAME} has been successfully installed to $BIN_DIR/${CLI_NAME}"
    echo "Run '${CLI_NAME} --help' to get started"
}

main
