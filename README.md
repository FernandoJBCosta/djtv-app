# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/5bd0bda0-2783-4551-bbe2-c7fffad7bfb3

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/5bd0bda0-2783-4551-bbe2-c7fffad7bfb3) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

For iOS and Android mobile, your project already has Capacitor configured. To build:

1º Export to GitHub via "Export to GitHub" button
2º Clone and run npm install
3º Add platforms: npx cap add ios and/or npx cap add android
4º Run npm run build then npx cap sync
5º Open in IDE: npx cap open ios (requires Mac + Xcode) or npx cap open android (requires Android Studio)
For Apple TV and Android TV, Capacitor doesn't natively support TV platforms. Your options:

Platform Approach
Apple TV Requires native tvOS development in Swift/SwiftUI, or use a WebView wrapper (limited)
Android TV Requires Android Leanback library for TV-optimized UI, can extend Capacitor Android project
Recommendation: If TV support is important, consider building a responsive web app that works in TV browsers, or building separate native TV apps that share your backend/API.

Would you like me to focus on getting the mobile iOS/Android builds working first, or do you need specific guidance on one of the TV platforms?

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/5bd0bda0-2783-4551-bbe2-c7fffad7bfb3) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)

Setup (one-time):

Export to GitHub via the "Export to GitHub" button, then clone locally
Run npm install
Run npm run build
Add platforms: npx cap add ios and/or npx cap add android
Run on device/emulator:

iOS: npx cap run ios (requires Mac with Xcode)
Android: npx cap run android (requires Android Studio)
After making changes in Lovable:

Git pull the latest code
Run npx cap sync to update native projects
For AppleTV & AndroidTV: These require additional platform-specific configuration in the native projects after initial setup - AppleTV needs tvOS target in Xcode, AndroidTV needs Leanback library configuration in Android Studio.
