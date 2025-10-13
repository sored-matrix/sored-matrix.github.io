#!/bin/bash

# Quick deployment script for SORED to GitHub Pages
# Usage: ./QUICK_DEPLOY.sh YOUR-GITHUB-USERNAME

if [ -z "$1" ]; then
    echo "❌ Błąd: Podaj nazwę użytkownika GitHub"
    echo "Użycie: ./QUICK_DEPLOY.sh TWOJA-NAZWA-UZYTKOWNIKA"
    exit 1
fi

USERNAME=$1
echo "🚀 Wdrażanie SORED na GitHub Pages..."
echo "📦 Repozytorium: https://github.com/$USERNAME/sored"
echo ""

# Initialize git if not already done
if [ ! -d .git ]; then
    echo "📝 Inicjalizacja git..."
    git init
fi

# Add all files
echo "➕ Dodawanie plików..."
git add .

# Commit
echo "💾 Tworzenie commit..."
git commit -m "Deploy SORED website to GitHub Pages"

# Add remote (if not exists)
if ! git remote | grep -q 'origin'; then
    echo "🔗 Dodawanie zdalnego repozytorium..."
    git remote add origin "https://github.com/$USERNAME/sored.git"
fi

# Rename branch to main if needed
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "main" ]; then
    echo "🔀 Zmiana nazwy gałęzi na 'main'..."
    git branch -M main
fi

# Push to GitHub
echo "🚀 Wysyłanie na GitHub..."
git push -u origin main

echo ""
echo "✅ Gotowe!"
echo ""
echo "📍 Następne kroki:"
echo "1. Przejdź na: https://github.com/$USERNAME/sored"
echo "2. Kliknij 'Settings' → 'Pages'"
echo "3. Wybierz Branch: main, Folder: / (root)"
echo "4. Kliknij 'Save'"
echo ""
echo "🌐 Twoja strona będzie dostępna za 1-3 minuty pod adresem:"
echo "   https://$USERNAME.github.io/sored/"
echo ""

