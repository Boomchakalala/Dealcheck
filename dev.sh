#!/bin/bash
# Unset the old OpenAI API key so .env.local takes precedence
unset OPENAI_API_KEY
# Start the Next.js dev server
exec next dev
