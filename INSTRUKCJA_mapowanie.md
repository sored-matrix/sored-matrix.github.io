# 📋 Instrukcja: Aktualizacja wskaźników na stronie

## 🎯 Szybka aktualizacja (w przyszłości)

Gdy chcesz zmienić wskaźniki na stronie:

1. **Otwórz plik**: `SORED_mapowanie_wymiary_wskazniki.xlsx`
2. **Edytuj** mapowanie wskaźników do wymiarów (kolumna A ma dropdown)
3. **Zapisz** plik Excel
4. **Uruchom** w terminalu:
   ```bash
   cd /Users/michalpalinski/Desktop/ibe/sored
   python3 update_website_indicators.py
   ```
5. **Gotowe!** Odśwież stronę w przeglądarce - nowe wskaźniki się pojawią ✨

---

## 📝 Szczegółowe instrukcje

### Struktura pliku Excel

**SORED_mapowanie_wymiary_wskazniki.xlsx** zawiera 3 kolumny:

1. **"Wymiar na stronie (popraw jeśli trzeba)"** 
   - Ma dropdown z 9 wymiarami:
     - OSIĄGNIĘCIA EDUKACYJNE
     - UCZESTNICTWO
     - DYDAKTYKA
     - KADRY
     - ZASOBY
     - ORGANIZACJA
     - ARCHITEKTURA
     - CYFROWA
     - KOMUNIKACJA

2. **"Źródłowy wymiar z matrycy"**
   - Oryginalna nazwa z pliku SORED_obszary_wskaźniki_MATRYCA.xlsx
   - Tylko do informacji, nie edytuj

3. **"Wskaźnik"**
   - Treść wskaźnika
   - Możesz edytować tekst wskaźnika jeśli potrzeba

### Jak działa system

1. **Plik Excel** (`SORED_mapowanie_wymiary_wskazniki.xlsx`) to Twoje źródło danych
2. **Skrypt Python** (`update_website_indicators.py`) konwertuje Excel → JSON
3. **Strona internetowa** (`index.html`) automatycznie wczytuje `static/indicators_for_website.json`

### Dodatkowe pliki

- `static/indicators_for_website.json` - wygenerowane dane (NIE edytuj ręcznie)
- `indicators_data.json` - surowe dane z matrycy (backup)
- `create_mapping_xlsx.py` - skrypt do regeneracji pliku Excel z matrycy

## Obecne statystyki

Sugerowane mapowanie zawiera:
- **OSIĄGNIĘCIA EDUKACYJNE**: 15 wskaźników
- **ORGANIZACJA**: 14 wskaźników  
- **ARCHITEKTURA**: 8 wskaźników
- **DYDAKTYKA**: 6 wskaźników
- **KADRY**: 5 wskaźników
- **UCZESTNICTWO**: 5 wskaźników
- **KOMUNIKACJA**: 3 wskaźniki
- **CYFROWA**: 2 wskaźniki
- **ZASOBY**: 1 wskaźnik

**RAZEM: 59 wskaźników**

