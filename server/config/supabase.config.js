// Supabase configuration
module.exports = {
  SUPABASE_URL: process.env.SUPABASE_URL || "https://cpfifhokwyhyfynfbwfz.supabase.co",
  SUPABASE_KEY: process.env.SUPABASE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNwZmlmaG9rd3loeWZ5bmZid2Z6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgxNDMzMDUsImV4cCI6MjA2MzcxOTMwNX0._yuVQ32DCsXYaRSjnf23qjO64fg5ejf3Z4KmurOhOA0",
  // Schema configuration for tables
  SCHEMA: "public", // default schema in Supabase
}; 