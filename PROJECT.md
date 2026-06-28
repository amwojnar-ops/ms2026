# Loza Ekspertow - MS 2026

## Cel projektu

Statyczny serwis GitHub Pages do prezentowania typow, wynikow, rankingu i fazy
pucharowej Mistrzostw Swiata 2026. Wyniki sa pobierane z football-data.org przez
GitHub Actions i zapisywane w `data/football-data.json`.

## Najwazniejsze adresy

- Produkcja: `hso.html`
- Testy: `hso-test.html`
- Formularze: `hso-typowanie16.html`, `hso-typowanie8.html`,
  `hso-typowanie4.html`, `hso-typowanie2.html`, `hso-typowanie1.html`

## Architektura

- `hso.html` - cienka strona produkcyjna i konfiguracja `production`.
- `hso-test.html` - cienka strona testowa i konfiguracja `test`.
- `hso.css` - wspolny wyglad obu wersji HSO.
- `hso-core.js` - wspolna logika, dane graczy, typy, ranking i wyswietlanie.
- `formularz-pucharowy.css` - wspolny wyglad formularzy pucharowych.
- `formularz-pucharowy.js` - wspolna logika formularzy pucharowych.
- `data/football-data.json` - ostatnia migawka API.
- `scripts/update-football-data.mjs` - pobieranie i zabezpieczanie danych API.
- `.github/workflows/football-data.yml` - uruchamianie aktualizacji.

Nie kopiujemy juz zmian miedzy `hso.html` i `hso-test.html`. Zmiany wygladu
wykonujemy w `hso.css`, a zmiany funkcji w `hso-core.js`.

## Krytyczne zasady

1. Typowany jest wynik po 90 minutach.
2. Nie zmieniac identyfikatorow meczow po rozpoczeciu typowania.
3. Nie zmieniac kluczy `localStorage` formularzy. W przegladarkach graczy sa
   zapisane czesciowo uzupelnione typy.
4. Reczne pary pucharowe uzupelniaja tylko puste pola z API. Dane API maja
   pierwszenstwo, gdy operator je opublikuje.
5. Wynik `FINISHED` jest traktowany jako ostateczny i nie powinien cofac sie do
   starszego statusu.
6. Statusy `PAUSED`, `IN_PLAY` i `LIVE` sa prezentowane jednakowo jako `Trwa`.
7. `hso.html` i `hso-test.html` powinny roznic sie tylko wartoscia trybu.
8. Po zmianie `hso.css` lub `hso-core.js` zwiekszyc identyczny parametr `?v=`
   w obu plikach HTML, aby telefony nie uzyly starej kopii z cache.
9. Migawka API zachowuje `fullTime`, `regularTime`, `halfTime` i `extraTime`;
   punktacja pucharowa po zakonczeniu korzysta z wyniku po 90 minutach.

## Test przed publikacja

Uruchomic:

```text
sprawdz-hso.bat
```

Test kontroluje m.in. skladnie JavaScript, wspolny rdzen obu stron, lokalne
zasoby, komplet i unikalnosc 16 par pucharowych oraz stale klucze zapisu typow.

## Bezpieczny sposob pracy

1. Zmienic wspolny plik (`hso-core.js`, `hso.css` albo pliki formularza).
2. Uruchomic `sprawdz-hso.bat`.
3. Otworzyc najpierw `hso-test.html`.
4. Po akceptacji opublikowac te same wspolne pliki - `hso.html` nie wymaga
   kopiowania zmian z wersji testowej.

## Punkt powrotu sprzed refaktoryzacji

Commit `8e813fb3` zawiera ostatnia monolityczna wersje obu plikow HTML. Nie nalezy
uzywac `git reset --hard`; w razie potrzeby pojedyncze pliki mozna odtworzyc z
historii GitHub Desktop.

## Proponowany start nowego czatu

> Pracujemy nad serwisem MS 2026. Najpierw przeczytaj `PROJECT.md`, sprawdz stan
> repozytorium i uruchom `sprawdz-hso.bat`. Zachowaj identyfikatory meczow oraz
> klucze localStorage. Zmiany funkcji wykonuj we wspolnym `hso-core.js`, a wyglad
> w `hso.css`.
