# manage it Weilburg e.V. – Events & Catering

Bearbeitbare Onepage-Website in HTML, CSS und Vanilla JavaScript. Es sind keine Installation, kein Framework und kein Build-Schritt nötig.

## Start

- `index.html` direkt im Browser öffnen, oder
- den Ordner `site/` in VS Code öffnen und mit Live Server starten.

Für die zuverlässigste Vorschau kann im Ordner `site/` auch `python3 -m http.server 4173` verwendet werden. Danach `http://localhost:4173` öffnen.

## Struktur

- `index.html` – semantische Seitenstruktur und Texte
- `styles.css` – Designsystem, Layout und responsive Breakpoints
- `script.js` – Navigation, Reveal-Effekte, Galerie, Lightbox und Demo-Formular
- `assets/images/` – austauschbare KI-Demobilder
- `assets/brand/` – Logo-Nachzeichnung
- `screenshots/` – Browser-Prüfbilder, sofern lokal erzeugt

## Design- und Typografieentscheidung

Verglichen wurden:

1. `Manrope + Instrument Serif`: modern und markant, benötigt jedoch externe oder zusätzlich gebündelte Fontdateien.
2. `Plus Jakarta Sans + Cormorant Garamond`: elegant, für kleine UI-Texte aber etwas dekorativer als gewünscht.
3. `Avenir Next + Iowan Old Style`: klare, ruhige Premium-Sans mit einer zurückhaltenden editorialen Kursivschrift; funktioniert lokal ohne Webfont-Anfrage.

Gewählt wurde `Avenir Next` mit `Iowan Old Style`. Die Serif wird nur für einzelne Schlüsselwörter eingesetzt. System-Fallbacks sind definiert (`Avenir`, `Helvetica Neue`, `Baskerville`, `Times New Roman`). So bleibt die Seite auch offline nutzbar und blockiert keine Darstellung durch externe Font-Downloads.

## Verhalten

- Sprungnavigation und zugängliches Mobile-Menü mit Escape- und Außenklick-Schließen
- manuelles Bilderkarussell mit Pfeilen, Touch-/Pointer-Swipe, Tastatursteuerung sowie Lightbox
- keine automatische Galeriebewegung
- Demo-Anfrage erzeugt ausschließlich lokal einen kopierbaren Text
- `prefers-reduced-motion` wird berücksichtigt
- sichtbare Fokuszustände, semantische Überschriften und Formularlabels

## Wichtiger Status

Dies ist ein Entwurf. Alle Eventmotive sind KI-generierte Stimmungsbilder und keine Aufnahmen der Wilhelm-Knapp-Schule. Das Logo ist eine Nachzeichnung. Formularversand, Kontaktangaben, rechtliche Seiten und Freigaben müssen vor einem Livegang ergänzt werden.

