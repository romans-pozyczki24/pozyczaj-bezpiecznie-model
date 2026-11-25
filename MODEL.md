# Specyfikacja modelu obliczeniowego `2026-11-v1`

Model służy do edukacyjnej symulacji kosztów pożyczki dla kwot od **100 zł do 20 000 zł** (z dokładnością do 1 grosza) oraz okresu od **1 do 24 miesięcy**.

Przyjęte stawki są wartościami przykładowymi — nie są średnią rynkową ani ofertą konkretnego pożyczkodawcy i nie sprawdzają ustawowych limitów kosztów dla konkretnej umowy.

## 1. Podstawowe założenia

- Jedna wypłata kapitału na starcie (`t = 0`).
- Równe miesiące trwające dokładnie `1/12` roku.
- Terminowa spłata wszystkich zobowiązań.
- Brak osobno doliczanych prowizji czy ubezpieczeń — całkowity koszt wynika wprost z przyjętych przepływów w harmonogramie.
- Wszystkie kwoty wewnętrznie liczone są w **groszach** (liczby całkowite), żeby uniknąć błędów zmiennoprzecinkowych.

## 2. Dwa tryby spłaty

### A. Spłata jednorazowa (1–3 miesiące)

Dla krótkich okresów model zakłada jedną płatność na koniec okresu, wyliczaną jako procent pożyczonej kwoty (zaokrąglony do grosza):

| Okres | Przykładowy koszt całkowity | Liczba płatności |
| :--- | :---: | :---: |
| 1 miesiąc | 12% kwoty | 1 (na koniec 1. mies.) |
| 2 miesiące | 18% kwoty | 1 (na koniec 2. mies.) |
| 3 miesiące | 24% kwoty | 1 (na koniec 3. mies.) |

### B. Raty miesięczne (4–24 miesiące)

Od 4 miesięcy model buduje harmonogram równych rat annuitetowych na podstawie przykładowej docelowej rocznej stopy efektywnej:

| Okres spłaty | Przykładowa docelowa stopa roczna |
| :--- | :---: |
| 4–6 miesięcy | 85% |
| 7–9 miesięcy | 72% |
| 10–12 miesięcy | 60% |
| 13–15 miesięcy | 55% |
| 16–18 miesięcy | 50% |
| 19–21 miesięcy | 45% |
| 22–24 miesiące | 40% |

**Sposób liczenia rat i zaokrągleń:**
1. Miesięczna stopa efektywna: `r_m = (1 + stopa_roczna)^(1/12) - 1`.
2. Bazowa rata miesięczna obliczana jest klasycznym wzorem annuitetowym i zaokrąglana do najbliższego grosza.
3. W każdym miesiącu odsetki to `round(pozostały_kapitał * r_m)`.
4. **Ostatnia rata** rozlicza pozostały kapitał i ostatnie odsetki, więc może różnić się o kilka groszy od zwykłej raty.

## 3. Wyznaczanie RRSO symulacji

RRSO nie jest przepisywane z tabelki na sztywno — jest wyliczane z faktycznego, zaokrąglonego do grosza harmonogramu spłat.

Szukamy stopy `RRSO`, dla której suma zdyskontowanych płatności równa się wypłaconej kwocie:

```text
Suma po wszystkich płatnościach: płatność_k * (1 + RRSO)^(-miesiąc_k / 12) = kwota_pożyczki
```

Dla stabilności numerycznej równanie zapisywane jest przez podstawienie `x = ln(1 + RRSO)` i rozwiązywane metodą **bisekcji** w 120 krokach, a wynik wraca jako `(exp(x) - 1) * 100%`.
