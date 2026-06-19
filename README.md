# Textforge

> **LLM Textwerkzeuge** – eine clientseitige Single-Shot-Werkzeugsammlung für Übersetzung, Rechtschreib-/Grammatikkorrektur und Code-Kommentierung, betrieben mit jedem OpenAI-kompatiblen LLM-Endpoint.

<p align="center">
  <a href="https://adriandeutsch.github.io/textforge/"><img alt="Live demo" src="https://img.shields.io/badge/Live_demo-GitHub_Pages-222?logo=githubpages&logoColor=white" /></a>
  <a href="https://github.com/AdrianDeutsch/textforge/actions/workflows/ci.yml"><img alt="CI" src="https://github.com/AdrianDeutsch/textforge/actions/workflows/ci.yml/badge.svg" /></a>
  <a href="LICENSE"><img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-blue.svg" /></a>
  <img alt="React" src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white" />
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript&logoColor=white" />
  <img alt="Vite" src="https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white" />
  <img alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind_CSS-4-38BDF8?logo=tailwindcss&logoColor=white" />
</p>

**🔗 Live: [adriandeutsch.github.io/textforge](https://adriandeutsch.github.io/textforge/)** — eigenen API-Key eintragen und loslegen.

---

## Einleitung

**LLM Textwerkzeuge** ist eine reine Frontend-App (kein Backend, kein Server), die im Browser direkt mit einem OpenAI-kompatiblen Chat-Completions-Endpoint spricht.
Jede Anfrage ist ein **Single-Shot** ohne Konversationshistorie – ideal für fokussierte, reproduzierbare Textaufgaben.
Gedacht für Entwickler:innen und Lernende, die schnell und ohne Setup-Aufwand eigene API-Keys (z. B. den Google-Gemini-Free-Tier oder ein lokales LM-Studio) ausprobieren möchten.

## Features

- 🌍 **Übersetzung** in mehrere Zielsprachen
- ✍️ **Rechtschreib- & Grammatikkorrektur** – wahlweise als reiner Text oder mit hervorgehobenen Änderungen (Diff-Markup)
- 💬 **Code-Kommentierung** in gängigen Doku-Standards (JSDoc, Python Docstrings, Javadoc, XML-Doc, Doxygen, Rustdoc u. a.)
- 📄 **Datei-Import** von PDF und DOCX (clientseitig geparst via `pdf.js` und `mammoth`)
- 🔑 **Eigener API-Key** über ein Eingabefeld – persistiert im `localStorage`, kein Server sieht den Key
- 🌗 **Light- & Dark-Theme** mit Umschalter; respektiert die System-Präferenz und merkt sich die Wahl
- ⚡ **Tastenkürzel** `Strg`/`Cmd` + `Enter` zum Absenden
- 🧩 **Frei konfigurierbar**: Base-URL, Modellname, Temperature und Max-Output-Tokens
- 🚀 **Statisch hostbar** – läuft als statische Seite auf GitHub Pages

## Tech Stack

| Bereich        | Technologie                                            |
| -------------- | ------------------------------------------------------ |
| UI-Framework   | React 19 (Functional Components & Hooks)               |
| Sprache        | TypeScript                                             |
| Build-Tool     | Vite 8                                                 |
| Styling        | Tailwind CSS v4 (Utility-first), an CSS-Custom-Property-Tokens gekoppelt |
| Datei-Parsing  | `pdfjs-dist` (PDF), `mammoth` (DOCX)                    |
| Persistenz     | `localStorage` (API-Konfiguration & Theme)             |
| Deployment     | GitHub Pages via GitHub Actions                        |

## Getting Started

Voraussetzung: **Node.js ≥ 20** und npm.

```bash
# 1. Repository klonen und hineinwechseln
git clone https://github.com/AdrianDeutsch/textforge.git
cd textforge

# 2. Abhängigkeiten installieren
npm install

# 3. Entwicklungsserver starten (Hot Module Replacement)
npm run dev

# 4. Produktions-Build erzeugen (Ausgabe in ./dist)
npm run build

# 5. Build lokal vorschauen
npm run preview
```

## Konfiguration

Die API-Zugangsdaten werden **nicht** im Code hinterlegt, sondern zur Laufzeit in der UI eingegeben:

1. App öffnen → Panel **„Einstellungen"**.
2. **Base-URL**, **API-Key** und **Modell** eintragen (Temperature und Max-Tokens sind optional).
3. Werte werden automatisch im `localStorage` gespeichert und beim nächsten Laden wiederhergestellt.

**Schnellstart Google Gemini (Free Tier):** Auf [aistudio.google.com](https://aistudio.google.com) einen API-Key erstellen, als Base-URL `https://generativelanguage.googleapis.com/v1beta/openai` und als Modell z. B. `gemini-2.5-flash` eintragen.

> ⚠️ **Sicherheitshinweis:** In einer rein clientseitigen App ist der API-Key im Browser sichtbar und wird direkt vom Client an den Endpoint gesendet. Verwende ausschließlich persönliche Keys (idealerweise Free-Tier oder mit Ausgabenlimit) und teile die laufende Instanz nicht mit hinterlegtem Key.

## Deployment (GitHub Pages)

Der Workflow [`.github/workflows/deploy-pages.yml`](.github/workflows/deploy-pages.yml) baut die App und veröffentlicht den Inhalt von `dist/` automatisch.

1. Im Repository: **Settings → Pages → Source = GitHub Actions**.
2. Push auf `main` (oder Workflow manuell über **Run workflow** starten) → der Build wird gebaut und deployed.

Live-URL: **https://adriandeutsch.github.io/textforge/**

Die Vite-Konfiguration nutzt `base: './'` (relative Pfade), sodass die App unter jedem Pages-Unterpfad funktioniert, ohne den Repository-Namen fest zu verdrahten.

## Projektstruktur

```text
textforge/                      # Repository-Root (App liegt direkt hier)
├── .github/workflows/          # GitHub-Actions: Build & Pages-Deploy
├── public/                     # statische Assets (favicon, icons)
├── index.html                  # Einstiegspunkt + Theme-Bootstrap (Anti-FOUC)
├── vite.config.ts              # Vite-Konfiguration (base: './', Tailwind-Plugin)
└── src/
    ├── main.tsx                # React-Mount
    ├── App.tsx                 # App-Shell, Provider-Komposition
    ├── components/             # UI-Komponenten (reine .tsx mit Tailwind-Utilities)
    │   ├── Header/             # Branding, Theme-Toggle, Einstellungs-Toggle
    │   ├── Tabs/               # Modus-Auswahl (Übersetzen/Korrigieren/Kommentieren)
    │   ├── ModeOptions/        # modusspezifische Optionen
    │   ├── SettingsPanel/      # API-Konfiguration (Base-URL, Key, Modell ...)
    │   ├── InputPanel/         # Texteingabe + Datei-Import
    │   ├── OutputPanel/        # Ergebnis-Anzeige + Diff-Markup
    │   ├── SubmitBar/          # Senden-Button + Status
    │   ├── ErrorBanner/        # Fehleranzeige
    │   ├── Panel/              # generische Panel-Hülle + IconButton (DRY)
    │   └── Spinner/            # Ladeindikator
    ├── context/                # React-Context-Provider
    │   ├── SettingsContext.tsx # API-/Modus-Einstellungen
    │   └── ThemeContext.tsx    # Light/Dark-Theme + Persistenz
    ├── hooks/
    │   └── useLlmRequest.ts    # Anfrage-Orchestrierung (Loading/Fehler/Timing)
    ├── services/               # Domänenlogik (Separation of Concerns)
    │   ├── api/                # LLM-Client, URL-Builder, Prompt-Builder
    │   ├── files/              # PDF-/DOCX-Parser + Registry
    │   └── storage/            # SettingsRepository (localStorage)
    ├── styles/
    │   └── globals.css         # Tailwind-Import + Tokens + @theme-Bindung + Basis-Styles
    └── types/                  # TypeScript-Typen (api, settings ...)
```

## Architektur-Notizen

- **Token-getriebenes Theming:** Tailwinds `@theme inline` bindet die Utility-Klassen (`bg-surface`, `text-accent` …) an CSS-Custom-Properties als einzige Farbquelle. Ein Wechsel von `data-theme` auf `<html>` re-themt damit jede Utility auf einmal – Light/Dark teilen sich denselben Komponenten-Code, ohne doppelte Palette.
- **Separation of Concerns:** UI (`components`), Zustandslogik (`context`/`hooks`) und Domänenlogik (`services`) sind klar getrennt; ein Parser pro Dateityp hinter einer gemeinsamen `FileParserRegistry`.
- **Single-Shot by Design:** Der `LlmApiClient` ist zustandslos – jede Anfrage trägt nur System- und User-Prompt, niemals eine Historie.
