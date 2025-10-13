# Instrukcja wdrożenia strony SORED na GitHub Pages

## Krok 1: Utwórz konto na GitHub (jeśli jeszcze nie masz)

Przejdź na [github.com](https://github.com) i załóż darmowe konto.

## Krok 2: Utwórz nowe repozytorium

1. Zaloguj się na GitHub
2. Kliknij przycisk **"New"** lub **"+"** w prawym górnym rogu → **"New repository"**
3. Wypełnij dane:
   - **Repository name**: `sored` (lub dowolna nazwa)
   - **Description**: "SORED - System Oceny Rozwoju Edukacji Dostępnej"
   - **Visibility**: Public (wymagane dla darmowego GitHub Pages)
4. **NIE** zaznaczaj "Add a README file"
5. Kliknij **"Create repository"**

## Krok 3: Przygotuj lokalne repozytorium

Otwórz terminal w katalogu projektu i wykonaj następujące komendy:

```bash
# Zainicjuj repozytorium git
git init

# Dodaj wszystkie pliki projektu
git add .

# Utwórz pierwszy commit
git commit -m "Initial commit: SORED website"
```

## Krok 4: Połącz z GitHub i wypchnij kod

Zastąp `TWOJA-NAZWA-UZYTKOWNIKA` swoją nazwą użytkownika GitHub:

```bash
# Dodaj zdalne repozytorium
git remote add origin https://github.com/TWOJA-NAZWA-UZYTKOWNIKA/sored.git

# Zmień nazwę głównej gałęzi na 'main' (jeśli potrzeba)
git branch -M main

# Wypchnij kod na GitHub
git push -u origin main
```

## Krok 5: Włącz GitHub Pages

1. Przejdź do swojego repozytorium na GitHub
2. Kliknij **"Settings"** (Ustawienia)
3. W menu po lewej stronie znajdź **"Pages"**
4. W sekcji **"Source"** wybierz:
   - Branch: **main**
   - Folder: **/ (root)**
5. Kliknij **"Save"**

## Krok 6: Poczekaj na wdrożenie

GitHub Pages automatycznie zbuduje i wdroży Twoją stronę. To może zająć 1-3 minuty.

Twoja strona będzie dostępna pod adresem:
```
https://TWOJA-NAZWA-UZYTKOWNIKA.github.io/sored/
```

## Aktualizacja strony w przyszłości

### Gdy zmienisz plik Excel z wskaźnikami:

```bash
# 1. Zaktualizuj mapowanie (jeśli potrzeba)
# Otwórz SORED_mapowanie_wymiary_wskazniki.xlsx i popraw mapowanie

# 2. Wygeneruj nowy JSON
python3 update_website_indicators.py

# 3. Zaktualizuj definicje (jeśli potrzeba)
python3 extract_definitions.py

# 4. Dodaj zmiany do git
git add static/indicators_for_website.json static/indicator_definitions.json

# 5. Utwórz commit
git commit -m "Aktualizacja wskaźników"

# 6. Wypchnij na GitHub
git push origin main
```

### Gdy zmienisz kod HTML/CSS:

```bash
# 1. Dodaj zmienione pliki
git add .

# 2. Utwórz commit z opisem zmian
git commit -m "Opis zmian"

# 3. Wypchnij na GitHub
git push origin main
```

Strona automatycznie zaktualizuje się w ciągu 1-3 minut po wypchnięciu zmian.

## Własna domena (opcjonalnie)

Jeśli chcesz użyć własnej domeny (np. `sored.edu.pl`):

1. W Settings → Pages → Custom domain wpisz swoją domenę
2. W ustawieniach DNS swojej domeny dodaj:
   - Typ: `CNAME`
   - Host: `www` (lub `@`)
   - Value: `TWOJA-NAZWA-UZYTKOWNIKA.github.io`

## Rozwiązywanie problemów

### Strona nie działa (404 Error)
- Upewnij się, że GitHub Pages jest włączony w Settings → Pages
- Sprawdź, czy branch jest ustawiony na `main`
- Poczekaj kilka minut - wdrożenie może chwilę potrwać

### Wskaźniki nie ładują się
- Sprawdź konsolę przeglądarki (F12)
- Upewnij się, że pliki JSON znajdują się w folderze `static/`
- Sprawdź, czy pliki zostały dodane do git: `git status`

### JSON pokazuje 404
- Upewnij się, że pushujesz wszystkie pliki: `git add static/`
- Sprawdź wielkość liter w nazwach plików (Linux jest case-sensitive)

## Dodatkowe wskazówki

### Dodaj plik .gitignore

Utwórz plik `.gitignore` aby nie przesyłać zbędnych plików:

```
# Python
__pycache__/
*.py[cod]
*$py.class
.Python
venv/
env/

# Mac
.DS_Store

# Excel temporary files
~$*.xlsx

# Editor files
.vscode/
.idea/
```

### Zabezpiecz Excel z mapowaniem

Możesz nie dodawać pliku Excel do repozytorium, jeśli zawiera wrażliwe dane:

```bash
# Dodaj do .gitignore
echo "SORED_mapowanie_wymiary_wskazniki.xlsx" >> .gitignore
echo "SORED_obszary_wskaźniki_MATRYCA.xlsx" >> .gitignore
```

W takim przypadku trzymaj te pliki lokalnie i przesyłaj tylko wygenerowane pliki JSON.

---

## Gotowe! 🎉

Twoja strona SORED jest teraz dostępna online przez GitHub Pages!

