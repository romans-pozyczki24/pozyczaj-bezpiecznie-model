# Pożyczaj bezpiecznie — model obliczeń (2026-11-v1) i 8 punktów kontroli

To repozytorium zawiera jawną specyfikację matematyczną, wzorcowy kod obliczeń (czysty JavaScript bez zewnętrznych bibliotek) oraz dokumentację 8-punktowej listy kontrolnej z bezpłatnej aplikacji edukacyjnej **[Pożyczaj bezpiecznie](https://www.pozyczki-24.pl/aplikacja/)**.

Aplikacja powstała po to, żeby każdy mógł spokojnie — jeszcze przed złożeniem wniosku — zobaczyć przybliżoną ratę, całkowity koszt, harmonogram spłaty i RRSO, a potem samodzielnie sprawdzić firmę oraz umowę.

## Co znajdziesz w tym repozytorium

- [`MODEL.md`](./MODEL.md) — pełny opis założeń kalkulatora (model `2026-11-v1`), wzoru na RRSO i zasad zaokrągleń do grosza.
- [`model.js`](./model.js) — samodzielny moduł obliczeniowy w czystym JavaScript (bez zależności).
- [`test.mjs`](./test.mjs) — zestaw prostych testów sprawdzających poprawność wyliczeń (do uruchomienia lokalnie poleceniem `node test.mjs` w Node.js 22+).
- [`KONTROLA_8_KROKOW.md`](./KONTROLA_8_KROKOW.md) — opis 8 punktów weryfikacji oferty pożyczki z linkami do oficjalnych źródeł urzędowych (KNF, UOKiK, Rzecznik Finansowy, Gov.pl, ELI).

## Ważne zastrzeżenia

- To wyłącznie narzędzie edukacyjne. Nie udziela pożyczek, nie przyjmuje wniosków, nie ocenia zdolności kredytowej i nie zastępuje indywidualnej porady prawnej ani finansowej.
- Sama aplikacja nie zawiera reklam, analityki, kont użytkowników ani linków afiliacyjnych. Dane zostają wyłącznie na urządzeniu użytkownika.
- Portal [Pozyczki-24.pl](https://www.pozyczki-24.pl/autor.htm) działa w modelu afiliacyjnym, dlatego narzędzie edukacyjne zostało od niego wyraźnie oddzielone.

## Autor

**Roman Sommer (RomanS)** — niezależny analityk rynku pożyczek pozabankowych w Polsce od 2007 r., redaktor naczelny Pozyczki-24.pl od 2012 r.  
Profil autora: [pozyczki-24.pl/autor.htm](https://www.pozyczki-24.pl/autor.htm) · Kontakt: `romans@pozyczki-24.pl`

---

*English summary: Public mathematical specification, zero-dependency reference JS implementation, verification tests, and 8-step borrower safety checklist powering the free educational Polish PWA [Pożyczaj bezpiecznie](https://www.pozyczki-24.pl/aplikacja/).*
