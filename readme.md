# MiniHackathon 3.0

## Anleitung für Git

### 1. 📥 Projekt holen und Start

Um das Projekt auf deinen PC zu bringen und mit der Arbeit zu beginnen, führe diese Schritte aus:

1.  **Repo Klonen und in den Projektordner wechseln:**

    ```bash
    git clone [https://github.com/LorenzCoder/Minihackathon_3.0.git](https://github.com/LorenzCoder/Minihackathon_3.0.git)
    cd Minihackathon_3.0
    ```

2.  **Branches anzeigen:**
    ```bash
    # Zeigt alle Branches an, die lokal und auf GitHub existieren
    git branch -a
    ```

### 2. ↔️ Branch wechseln und Navigieren

Nach dem Klonen befindest du dich im `main`-Branch. Du musst sofort zu deinem Team-Branch (`dev-frontend` oder `dev-backend`) wechseln.

1.  **Zum Arbeitsbranch wechseln und aktualisieren:**

    ```bash
    # Wechsle zu deinem zuständigen Haupt-Branch (Beispiel)
    git switch dev-frontend

    # Änderungen der Teamkollegen abrufen
    git pull
    ```

2.  **Zwischen Branches navigieren:**

    ```bash
    # Wechselt zu einem existierenden Branch
    git switch [BRANCHNAME]

    # Beispiel: Zurück zum Backend-Basis-Branch
    # git switch dev-backend
    ```

---

## 3. 💾 Tägliche Arbeit: Speichern und Hochladen

Nachdem du deinen Code geschrieben hast, folge diesen Schritten, um ihn sicher zu speichern und hochzuladen:

| Schritt          | Befehl                                     | Zweck                                              |
| :--------------- | :----------------------------------------- | :------------------------------------------------- |
| **1. Prüfen**    | `git status`                               | Überprüft, welche Dateien geändert wurden.         |
| **2. Staging**   | `git add .`                                | Fügt **alle** geänderten Dateien zum Commit hinzu. |
| **3. Speichern** | `git commit -m "feat: Kurze Beschreibung"` | Speichert die Änderungen **lokal**.                |
| **4. Hochladen** | `git push`                                 | Lädt die lokalen Commits auf GitHub hoch.          |
