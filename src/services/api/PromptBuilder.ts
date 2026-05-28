import type { ModeSettings } from '../../types/settings';

/**
 * Constructs the system and user prompts for the configured mode.
 *
 * Single responsibility: prompt assembly only — no network or storage.
 * Open for extension: add a new mode by extending the switch in `buildUserPrompt`.
 */
export class PromptBuilder {
  static readonly SYSTEM_PROMPT =
    'Du bist das Backend einer Single Page Application. Verarbeite die Anfrage im Single-Shot-Verfahren. ' +
    'Halte dich strikt an die XML-Instruktionen des Users und antworte AUSSCHLIESSLICH mit dem bereinigten ' +
    'Ergebnis ohne jegliche Einleitung, Erklärungen oder Markdown-Code-Block-Wrapper außerhalb des Ergebnisses.';

  buildSystemPrompt(): string {
    return PromptBuilder.SYSTEM_PROMPT;
  }

  buildUserPrompt(input: string, modeSettings: ModeSettings): string {
    const { modus, optionen } = this.resolveModeInstruction(modeSettings);
    return `<Konfiguration>
Modus: ${modus}
Optionen: ${optionen}
</Konfiguration>
<Inhalt>
${input}
</Inhalt>`;
  }

  private resolveModeInstruction(s: ModeSettings): { modus: string; optionen: string } {
    switch (s.mode) {
      case 'translate':
        return {
          modus: 'Übersetzung',
          optionen:
            `Zielsprache: ${s.targetLang}. Übersetze den Inhalt vollständig in die Zielsprache. ` +
            'Behalte Formatierung, Zeilenumbrüche und Absätze bei. Gib keine Erklärungen oder Anmerkungen aus.',
        };
      case 'correct':
        return {
          modus: 'Korrektur',
          optionen:
            s.correctionStyle === 'diff'
              ? 'Korrigiere Rechtschreibung, Grammatik und Zeichensetzung. Markiere Änderungen direkt im Text: ' +
                'Eingefügte/ersetzte Wörter mit ((add:NEU)), entfernte/falsche Wörter mit ((del:ALT)). ' +
                'Behalte den restlichen Text exakt bei. Beispiel: Aus "Er gehte ins Haus" wird ' +
                '"Er ((del:gehte))((add:ging)) ins Haus". Keine Erklärungen.'
              : 'Korrigiere Rechtschreibung, Grammatik und Zeichensetzung. Gib NUR den vollständig korrigierten ' +
                'Text aus, ohne Markierungen, ohne Anmerkungen, ohne Liste der Änderungen.',
        };
      case 'comment':
        return {
          modus: 'Code-Kommentierung',
          optionen:
            `Standard: ${s.commentStyle}. Erkenne die Programmiersprache automatisch. ` +
            'Füge passende Dokumentations-Kommentare (im angegebenen Stil) direkt in den Code ein: ' +
            'über Funktionen, Klassen und Methoden, sowie sinnvolle Inline-Kommentare bei nicht-trivialen Stellen. ' +
            'Verändere die Logik oder Formatierung des bestehenden Codes NICHT. ' +
            'Gib AUSSCHLIESSLICH den vollständigen kommentierten Code aus, OHNE umschließenden Markdown-Code-Block ' +
            '(kein ```), ohne Erklärungen davor oder danach.',
        };
    }
  }
}
