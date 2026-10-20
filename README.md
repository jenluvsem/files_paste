# Files Paste

A Nextcloud app that allows you to paste clipboard images directly into the Files app using Ctrl+V / Cmd+V.

## Features

- **Paste images directly** from clipboard into any folder in the Files app
- **Automatic naming** with timestamp: `Screenshot YYYY-MM-DD HH-mm-ss.png`
- **Collision handling** - never overwrites existing files
- **Supports multiple images** - paste several images at once
- **Supported formats**: PNG, JPEG, GIF, WebP

## Supported Views

- All Files
- Favorites
- Shared folders

Not supported: Recent view (no folder context)

## Installation

### From Nextcloud App Store

1. Go to your Nextcloud instance
2. Navigate to Apps > Productivity
3. Find "Files Paste" and enable it

### Manual Installation

1. Download the latest release from GitHub
2. Extract to your Nextcloud apps directory:
   ```bash
   tar -xzf files_paste-1.0.0.tar.gz -C /path/to/nextcloud/apps/
   ```
3. Enable the app via Nextcloud admin panel or:
   ```bash
   occ app:enable files_paste
   ```

## Usage

1. Take a screenshot (Snipaste, screenshot tool, or Print Screen)
2. Open Nextcloud Files app
3. Navigate to any folder
4. Press Ctrl+V (Windows/Linux) or Cmd+V (Mac)
5. The image will appear in the folder

### What happens if...

- **Same filename exists**: Automatically adds `(2)`, `(3)`, etc.
- **No folder selected**: Shows "Open a folder to paste" message
- **Paste in input field**: Works normally (not intercepted)
- **Text in clipboard**: Normal paste behavior (not intercepted)

## Requirements

- Nextcloud 34.x
- Modern browser with clipboard API support

## Development

### Prerequisites

- Node.js 20+
- PHP 8.2+
- Composer

### Setup

```bash
# Install dependencies
make install

# Run tests
make test

# Build for production
make build
```

### Building for App Store

```bash
make appstore
```

This creates `build/artifacts/files_paste-1.0.0.tar.gz`

## License

AGPL-3.0-or-later - see LICENSE file for details
