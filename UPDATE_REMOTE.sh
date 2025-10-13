#!/bin/bash

# Po przeniesieniu repozytorium do organizacji wykonaj:

echo "🔄 Aktualizacja zdalnego repozytorium..."

git remote set-url origin https://github.com/sored/sored.github.io.git

echo "✅ Remote zaktualizowany!"
echo ""
echo "Sprawdź:"
git remote -v
echo ""
echo "🚀 Teraz możesz pushować do nowej lokalizacji:"
echo "   git push origin main"
echo ""
echo "🌐 Twoja strona będzie dostępna pod:"
echo "   https://sored.github.io"

