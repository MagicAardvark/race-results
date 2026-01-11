# Clerk Webhook Setup TODO

This document outlines the steps needed to set up the Clerk webhook for automatic user creation.

## Overview

The application uses a Clerk webhook to automatically create users in the database when they register. When a new user signs up in Clerk, the webhook endpoint receives a `user.created` event and:

1. Creates the user in the database
2. Automatically assigns them the 'user' role

## Prerequisites

- Clerk account with an application configured
- Access to the Clerk Dashboard
- Environment variables file (`.env.local` or `.env`)

## Setup Steps

### 1. Install Dependencies

Install the `svix` package which is required for webhook signature verification:

```bash
pnpm add svix
```

### 2. Configure Environment Variables

Add the Clerk webhook secret to your environment variables file:

```env
CLERK_WEBHOOK_SECRET=whsec_...
```

**Note:** You'll get this secret in step 3 when creating the webhook endpoint in Clerk.

### 3. Create Webhook Endpoint in Clerk Dashboard

1. **Navigate to Clerk Dashboard**
    - Go to [https://dashboard.clerk.com](https://dashboard.clerk.com)
    - Sign in to your Clerk account
    - Select your application

2. **Go to Webhooks Section**
    - In the left sidebar, click on **"Webhooks"**
    - Click **"Add Endpoint"** button

3. **Configure the Webhook**
    - **Endpoint URL**: Enter your webhook URL
        - For local development: `https://your-ngrok-url.ngrok.io/api/webhooks/clerk`
        - For production: `https://your-domain.com/api/webhooks/clerk`
    - **Events to subscribe to**: Select **`user.created`**
    - Click **"Create"**

4. **Copy the Signing Secret**
    - After creating the endpoint, Clerk will display a **Signing Secret**
    - Copy this secret (it starts with `whsec_`)
    - Add it to your `.env` file as `CLERK_WEBHOOK_SECRET`

### 4. Local Development Setup (Optional)

If you're testing locally, you'll need to expose your local server:

1. **Using ngrok** (recommended):

    ```bash
    ngrok http 3000
    ```

    - Copy the HTTPS URL (e.g., `https://abc123.ngrok.io`)
    - Use this URL in Clerk webhook configuration: `https://abc123.ngrok.io/api/webhooks/clerk`

2. **Update Clerk Webhook URL**:
    - Go back to Clerk Dashboard → Webhooks
    - Edit your webhook endpoint
    - Update the URL with your ngrok URL
    - Save changes

### 5. Verify Setup

1. **Start your development server**:

    ```bash
    pnpm dev
    ```

2. **Test the webhook**:
    - Create a new user in Clerk (sign up through your app)
    - Check your server logs for: `User created via webhook: <user_id> (<display_name>) with role: user`
    - Verify the user exists in your database with the 'user' role assigned

3. **Check Clerk Dashboard**:
    - Go to Webhooks → Your endpoint
    - Check the "Recent deliveries" section
    - You should see successful deliveries (200 status)

## Troubleshooting

### Webhook Not Receiving Events

- **Check webhook URL**: Ensure the URL is correct and accessible
- **Verify ngrok is running** (if testing locally)
- **Check Clerk Dashboard**: Look at "Recent deliveries" for error messages
- **Check server logs**: Look for webhook verification errors

### User Not Created in Database

- **Check server logs**: Look for errors in the webhook handler
- **Verify database connection**: Ensure `DATABASE_URL` is set correctly
- **Check role exists**: Ensure you've run `pnpm seed` to create the 'user' role
- **Check webhook secret**: Verify `CLERK_WEBHOOK_SECRET` matches the one in Clerk Dashboard

### Signature Verification Errors

- **Verify webhook secret**: Ensure `CLERK_WEBHOOK_SECRET` in `.env` matches Clerk Dashboard
- **Check svix headers**: Ensure Clerk is sending the webhook with proper headers
- **Check server logs**: Look for "Error verifying webhook" messages

## Production Deployment

1. **Update Webhook URL**:
    - Go to Clerk Dashboard → Webhooks
    - Edit your webhook endpoint
    - Update URL to your production domain: `https://your-domain.com/api/webhooks/clerk`
    - Save changes

2. **Set Environment Variable**:
    - Add `CLERK_WEBHOOK_SECRET` to your production environment variables
    - Ensure it matches the secret from Clerk Dashboard

3. **Test in Production**:
    - Create a test user in production
    - Verify user is created in database
    - Check production logs for webhook events

## Webhook Endpoint Details

- **Route**: `/api/webhooks/clerk`
- **Method**: `POST`
- **Authentication**: Verified via Svix signature using `CLERK_WEBHOOK_SECRET`
- **Events Handled**: `user.created`

## What Happens When a User Registers

1. User signs up in Clerk
2. Clerk sends `user.created` webhook event to `/api/webhooks/clerk`
3. Webhook handler verifies the signature
4. Extracts user data (id, first_name, last_name, email)
5. Calls `usersRepository.create()` which:
    - Creates user in database
    - Automatically assigns 'user' role
6. Returns 200 status to Clerk

## Files Involved

- `/src/app/(global-api)/api/webhooks/clerk/route.ts` - Webhook handler
- `/src/db/repositories/users.repo.ts` - User creation and role assignment logic
- `/src/db/seed.ts` - Creates the 'user' role (must be run first)

## Next Steps After Setup

1. ✅ Install `svix` package
2. ✅ Add `CLERK_WEBHOOK_SECRET` to environment variables
3. ✅ Create webhook endpoint in Clerk Dashboard
4. ✅ Configure webhook URL (local or production)
5. ✅ Test user registration
6. ✅ Verify users are created with 'user' role
7. ✅ Update webhook URL for production deployment
