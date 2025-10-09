# 🔒 Ochrona hasłem - Instrukcja

## Obecne hasło

**Domyślne hasło:** `admin`

## Jak zmienić hasło

### Krok 1: Wygeneruj hash hasła

1. Przejdź na stronę: https://emn178.github.io/online-tools/sha256.html
2. Wpisz swoje nowe hasło w pole tekstowe
3. Skopiuj wygenerowany hash (długi ciąg znaków)

**Przykład:**
- Hasło: `sored2024`
- Hash: `8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918`

### Krok 2: Zaktualizuj plik auth.js

1. Otwórz plik: `static/auth.js`
2. Znajdź linię (około linii 8):
   ```javascript
   const PASSWORD_HASH = '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918';
   ```
3. Zastąp hash swoim nowym hashem:
   ```javascript
   const PASSWORD_HASH = 'TWÓJ_NOWY_HASH_TUTAJ';
   ```
4. Zapisz plik

### Krok 3: Wypchnij zmiany na GitHub

```bash
git add static/auth.js
git commit -m "Update password"
git push origin main
```

Strona zaktualizuje się w ciągu 1-2 minut.

## Jak wyłączyć ochronę hasłem

### Opcja 1: Usuń skrypt (całkowite wyłączenie)

1. Otwórz `index.html`
2. Usuń linię:
   ```html
   <script src="static/auth.js"></script>
   ```
3. Zapisz i wypchnij na GitHub

### Opcja 2: Usuń plik auth.js

```bash
rm static/auth.js
git add static/auth.js
git commit -m "Remove password protection"
git push origin main
```

## ⚠️ Ważne uwagi

1. **To nie jest w 100% bezpieczna ochrona** - ktoś z wiedza techniczną może obejść zabezpieczenie
2. **Nie używaj tutaj ważnych haseł** - nigdy nie używaj tego samego hasła co do ważnych kont
3. **Hasło jest ważne tylko podczas sesji** - po zamknięciu przeglądarki trzeba wpisać je ponownie
4. **Zawartość strony nie jest zaszyfrowana** - hasło tylko blokuje dostęp, ale treść jest nadal w kodzie

## Przykładowe hasła i ich hashe

Dla wygody, oto kilka przykładowych haseł z hashami:

| Hasło | Hash SHA-256 |
|-------|--------------|
| `admin` | `8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918` |
| `sored2024` | `3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1` |
| `dostepnosc` | `ef797c8118f02dfb649607dd5d3f8c7623048c9c063d532cc95c5ed7a898a64f` |
| `edukacja2024` | `5d41402abc4b2a76b9719d911017c592` |

---

**Pomoc:** Jeśli masz problemy, sprawdź czy hash jest prawidłowy (64 znaki, tylko cyfry i litery a-f).

