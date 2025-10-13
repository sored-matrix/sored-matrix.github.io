# SORED - System Oceny Rozwoju Edukacji Dostępnej

Nowoczesna, w pełni dostępna strona internetowa prezentująca 9 wymiarów dostępności w edukacji.

## 🚀 Quick Start

Otwórz `index.html` w przeglądarce.

## ✨ Funkcje

### Dostępność (WCAG 2.1 AA/AAA)
- ✅ Tryb wysokiego kontrastu
- ✅ Regulacja rozmiaru czcionki (3 rozmiary)
- ✅ Nawigacja klawiaturą (Tab, Enter, Space)
- ✅ Skip links
- ✅ Obsługa czytników ekranu
- ✅ Respektowanie preferencji `prefers-reduced-motion`
- ✅ Semantyczny HTML z ARIA
- ✅ Kontrast 21:1 w trybie wysokiego kontrastu

### Wymiary Dostępności
1. **OSIĄGNIĘCIA EDUKACYJNE** - 15 wskaźników
2. **ORGANIZACJA** - 14 wskaźników
3. **ARCHITEKTURA** - 8 wskaźników
4. **DYDAKTYKA** - 6 wskaźników
5. **KADRY** - 5 wskaźników
6. **UCZESTNICTWO** - 5 wskaźników
7. **KOMUNIKACJA** - 3 wskaźniki
8. **CYFROWA** - 2 wskaźniki
9. **ZASOBY** - 1 wskaźnik

**Razem: 59 wskaźników**

### Interaktywność
- Klikalne karty wymiarów
- Płynne przewijanie do sekcji wskaźników
- **Definicje** - przycisk "Definicje" otwiera modal z definicjami pogrupowanymi według pełnych nazw wymiarów
- Animacje z respektowaniem preferencji użytkownika
- Responsywny design (mobile, tablet, desktop)

## 📝 Aktualizacja wskaźników

Aby zmienić wskaźniki na stronie:

1. Edytuj: `SORED_mapowanie_wymiary_wskazniki.xlsx`
2. Uruchom: `python3 update_website_indicators.py`
3. Odśwież stronę

Szczegóły w pliku: **INSTRUKCJA_mapowanie.md**

## 📁 Struktura projektu

```
/Users/michalpalinski/Desktop/ibe/sored/
├── index.html                              # Główna strona
├── static/
│   ├── styles.css                          # Style CSS
│   ├── logo_white.svg                      # Logo (białe)
│   ├── logo_color.svg                      # Logo (kolorowe)
│   ├── indicators_for_website.json         # Dane wskaźników (auto-generowane)
│   └── indicator_definitions.json          # Definicje wskaźników (auto-generowane)
├── SORED_mapowanie_wymiary_wskazniki.xlsx  # ⭐ EDYTUJ TEN PLIK aby zmienić wskaźniki
├── SORED_obszary_wskaźniki_MATRYCA.xlsx    # Oryginalna matryca
├── update_website_indicators.py            # Skrypt aktualizujący wskaźniki
├── create_mapping_xlsx.py                  # Regeneracja pliku mapowania
├── extract_definitions.py                  # Ekstrakcja definicji z matrycy
├── indicators_data.json                    # Surowe dane z matrycy
├── INSTRUKCJA_mapowanie.md                 # Instrukcje (PL)
└── README.md                               # Ten plik

```

## 🛠 Technologie

- HTML5, CSS3, JavaScript (Vanilla)
- Bootstrap 5.3
- Bootstrap Icons
- Python 3 + pandas, xlsxwriter (do aktualizacji danych)

## 🎨 Kolory

- **Normalny**: Gradient niebieski (#2d3a5f → #3a4ab8 → #0a7a8a)
- **Wysoki kontrast**: Czarno-biały (#000000 / #ffffff)

## 📄 Licencja

© 2025 IBE (Instytut Badań Edukacyjnych)

---

**Logo**: Link do https://ibe.edu.pl/pl/

