# ClipboardKeeper

A privacy-focused clipboard history manager for iOS built with Expo, TypeScript, and NativeWind.

## Features
- **Clipboard History**: View your recent clipboard entries.
- **Auto-Capture**: Optional background monitoring (while app is open).
- **Privacy First**: No background tracking when app is closed. No data leaves your device.
- **Persistence**: History is saved locally using AsyncStorage.
- **Management**: Copy back, share, or delete entries.
- **Import/Export**: Backup your history to JSON.

## Setup & Run

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Run on iOS Simulator**:
   ```bash
   npm run ios
   ```
   *Note: Requires Xcode installed on Mac.*

3. **Run Tests**:
   ```bash
   npm test
   ```

## Privacy & iOS Limitations
iOS has strict privacy controls for clipboard access.
- **Background Access**: Apps cannot access the clipboard while in the background (terminated or suspended) without specific entitlements usually reserved for specific use cases.
- **Auto-Capture**: This app only captures clipboard content while it is **active in the foreground**.
- **Notification**: iOS displays a "pasted from [App]" banner when the clipboard is accessed. This is a system feature and cannot be disabled.

### Recommended App Store Privacy Text
"ClipboardKeeper stores your clipboard history locally on your device. No data is transmitted to any external servers. Clipboard access is only performed when the app is in the foreground and 'Auto-Capture' is enabled by the user, or when manually triggered."

## Project Structure
- `src/screens`: Main application screens (Home, Modal).
- `src/components`: Reusable UI components (HistoryItem, FAB).
- `src/hooks`: Custom hooks (useClipboardHistory).
- `src/utils`: Helper functions (storage, clipboard).
- `__tests__`: Unit and component tests.

## Tech Stack
- **Expo (Managed)**
- **TypeScript**
- **NativeWind (Tailwind CSS)**
- **AsyncStorage**
- **Jest & Testing Library**
