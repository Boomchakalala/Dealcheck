#!/bin/bash

echo "🚀 TermLift Environment Setup"
echo "================================"
echo ""
echo "I'll ask you for your API keys one by one."
echo "Just paste them when prompted and press Enter."
echo ""

# Supabase URL
echo "📍 Step 1/4: Supabase Project URL"
echo "Example: https://abcdefghijk.supabase.co"
read -p "Paste your Supabase URL: " SUPABASE_URL

# Supabase Anon Key
echo ""
echo "🔑 Step 2/4: Supabase Anon Key (public)"
echo "This is the long key that starts with eyJhbGc..."
read -p "Paste your Anon Key: " SUPABASE_ANON_KEY

# Supabase Service Role Key
echo ""
echo "🔐 Step 3/4: Supabase Service Role Key (secret)"
echo "This is another long key that starts with eyJhbGc..."
read -p "Paste your Service Role Key: " SUPABASE_SERVICE_KEY

# OpenAI API Key
echo ""
echo "🤖 Step 4/4: OpenAI API Key"
echo "Starts with sk-"
echo "(Press Enter to skip for now if you don't have it yet)"
read -p "Paste your OpenAI Key: " OPENAI_KEY

# Set default if empty
if [ -z "$OPENAI_KEY" ]; then
  OPENAI_KEY="sk-placeholder-get-this-from-openai"
fi

# Create .env.local file
cat > .env.local << EOF
# Supabase
NEXT_PUBLIC_SUPABASE_URL=$SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=$SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=$SUPABASE_SERVICE_KEY

# OpenAI
OPENAI_API_KEY=$OPENAI_KEY

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
EOF

echo ""
echo "✅ All done! Your .env.local file has been created!"
echo ""
echo "🎯 Next steps:"
echo "   1. Restart your dev server: bun dev"
echo "   2. Open http://localhost:3000"
echo ""

if [ "$OPENAI_KEY" == "sk-placeholder-get-this-from-openai" ]; then
  echo "⚠️  Remember to get your OpenAI key later!"
  echo "   Run this script again when you have it."
  echo ""
fi
