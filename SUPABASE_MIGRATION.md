# MySQL to Supabase Migration Guide

This document outlines the steps to migrate the PathFinder application from MySQL to Supabase.

## Prerequisites

1. Create a Supabase account at [https://supabase.com](https://supabase.com)
2. Create a new Supabase project
3. Note down your Supabase project URL and API keys (anon key and service role key)

## Step 1: Configuration

1. Create a `.env` file in the root directory (copy from `.env.example` if needed)
2. Add your Supabase configuration:

```
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## Step 2: Set Up Supabase Schema

1. Log in to your Supabase dashboard
2. Go to the SQL Editor
3. Run the SQL functions from `server/scripts/supabase-sql-functions.sql`
4. This will create the necessary functions that will be used by the migration script

## Step 3: Run the Migration Scripts

1. First, run the schema migration script:

```bash
node server/scripts/migrate-to-supabase.js
```

2. Then, run the data migration script to transfer your data:

```bash
node server/scripts/migrate-data.js
```

## Step 4: Configure Authentication

1. In the Supabase dashboard, go to Authentication > Settings
2. Enable Email and Google auth providers (if needed)
3. Configure your Site URL and Redirect URLs

## Step 5: Update Environment

Make sure all instances of your application are using the new Supabase configuration.

## Verifying the Migration

After completing the migration, you can verify it by:

1. Checking the Supabase dashboard to ensure data is present
2. Running the application and testing key functionality
3. Monitoring the application logs for any errors

## Rollback Plan

If issues occur, you can continue using MySQL by:

1. Updating the `.env` file to only include MySQL configuration
2. Ensuring your `server/index.js` uses the MySQL models (before migration changes)

## Post-Migration Cleanup

Once the migration is successful and stable:

1. Consider removing MySQL-related code and dependencies
2. Update the application documentation
3. Consider decommissioning the MySQL database

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)
- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth) 