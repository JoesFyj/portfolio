#!/bin/bash
# front-end-skills verification script
echo "Running front-end-skills verification..."

# Check Node.js
if ! command -v node &> /dev/null; then
  echo "❌ Node.js not found. Please install Node.js first."
  exit 1
fi

# Check npm
if ! command -v npm &> /dev/null; then
  echo "❌ npm not found. Please install npm first."
  exit 1
fi

echo "✅ Node.js: $(node --version)"
echo "✅ npm: $(npm --version)"

# Check for essential front-end tools
echo ""
echo "Checking front-end toolchain..."

for tool in npx vite; do
  if command -v $tool &> /dev/null; then
    echo "✅ $tool found"
  else
    echo "⚠️ $tool not found (optional)"
  fi
done

echo ""
echo "✅ front-end-skills verification complete!"
