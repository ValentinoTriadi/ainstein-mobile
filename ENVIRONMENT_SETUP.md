# Environment Setup for AInstein v2 Frontend

This document explains how to set up the environment variables needed for Better Auth integration.

## Required Environment Variables

Since `.env` files are typically git-ignored, you'll need to configure these environment variables in your `app.json` file or through your deployment platform.

### app.json Configuration

Update the `extra` section in your `app.json` file:

```json
{
  "expo": {
    // ... other config
    "extra": {
      "authUrl": "YOUR_BACKEND_AUTH_URL"
    }
  }
}
```

### Environment Variables Needed

1. **Backend Auth URL**
   - Update `authUrl` in `app.json` → `extra` section
   - Should point to your Better Auth backend endpoint
   - Example: `"http://localhost:3000/api/auth"` for local development
   - Example: `"https://yourdomain.com/api/auth"` for production

## Backend Setup Required

Your backend server should have Better Auth configured with:

1. **Better Auth Configuration** (`lib/auth.ts` on backend):
```typescript
import { betterAuth } from "better-auth";
import { expo } from "@better-auth/expo";

export const auth = betterAuth({
  plugins: [expo()],
  trustedOrigins: ["ainsteinv2fe://"], // Match your app scheme
  // Add your database and social provider configs
});
```

2. **Google OAuth Setup**:
   - Create a Google OAuth application in Google Cloud Console
   - Configure authorized redirect URIs to include your backend auth callback
   - Add Google client ID and secret to your backend environment

3. **Trusted Origins**:
   - Add your app scheme (`ainsteinv2fe://`) to the `trustedOrigins` array
   - This allows deep linking back to your app after OAuth

## Deep Linking

The app is configured with the scheme `ainsteinv2fe` (from app.json). After successful Google OAuth, Better Auth will redirect back to your app using this scheme.

## Development vs Production

- **Development**: Use `http://localhost:3000/api/auth` or your local backend URL
- **Production**: Use your deployed backend URL (e.g., `https://api.yourdomain.com/auth`)

## Notes

- Make sure your backend Better Auth instance is running and accessible
- The Google OAuth flow requires a properly configured backend with Google credentials
- Test the deep linking by ensuring the app opens correctly after OAuth completion 