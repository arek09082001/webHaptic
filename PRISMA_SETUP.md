# Prisma Setup und Verwendung

Dieses Projekt verwendet **Prisma** als ORM für die Verwaltung der PostgreSQL-Datenbank (Supabase).

## 📋 Voraussetzungen

- PostgreSQL-Datenbank (z.B. Supabase)
- Node.js und npm installiert

## 🚀 Ersteinrichtung

### 1. Umgebungsvariablen konfigurieren

Erstelle eine `.env` Datei im Projekt-Root (basierend auf `.env.example`):

```env
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@[YOUR-PROJECT-REF].supabase.co:5432/postgres
```

**Supabase Connection String finden:**
1. Gehe zu deinem Supabase-Projekt
2. Navigiere zu Settings → Database
3. Kopiere die "Connection string" (unter "Connection pooling" für beste Performance)
4. Ersetze `[YOUR-PASSWORD]` mit deinem Datenbank-Passwort

### 2. Prisma Client generieren

```bash
npm run prisma:generate
```

Dieser Befehl generiert den Prisma Client basierend auf dem Schema in `prisma/schema.prisma`.

## 📖 Verwendung

### Prisma Client importieren

```typescript
import { prisma } from '@/lib/prisma';

// Beispiel: Alle Clubs abrufen
const clubs = await prisma.club.findMany();

// Beispiel: Club mit Mitgliedern erstellen
const club = await prisma.club.create({
  data: {
    name: 'FC Example',
    primaryColor: '#FF0000',
    secondaryColor: '#FFFFFF',
    members: {
      create: {
        userId: 'user-id',
        role: 'admin'
      }
    }
  },
  include: {
    members: true
  }
});

// Beispiel: Posts mit Relations abrufen
const posts = await prisma.post.findMany({
  where: {
    clubId: 'club-id'
  },
  include: {
    club: true,
    team: true,
    template: true,
    creator: true
  }
});
```

## 🛠️ Nützliche Befehle

### Prisma Studio (Datenbank-GUI)
```bash
npm run prisma:studio
```
Öffnet eine grafische Oberfläche zum Anzeigen und Bearbeiten der Daten auf `http://localhost:5555`

### Schema-Synchronisierung

**Schema zur Datenbank pushen (Development):**
```bash
npm run prisma:push
```
⚠️ **Achtung:** Dieser Befehl überschreibt die Datenbank ohne Migration. Nur für Development!

**Schema aus Datenbank pullen:**
```bash
npm run prisma:pull
```
Erstellt ein Prisma-Schema aus einer bestehenden Datenbank.

### Migrationen (Production)

**Migration erstellen:**
```bash
npm run prisma:migrate
```
Erstellt eine neue Migration basierend auf Schema-Änderungen.

**Migration deployen:**
```bash
npm run prisma:migrate:deploy
```
Wendet ausstehende Migrationen in der Production-Umgebung an.

## 🔄 Workflow beim Schema-Update

1. **Schema anpassen** in `prisma/schema.prisma`
2. **Client neu generieren:**
   ```bash
   npm run prisma:generate
   ```
3. **Für Development:**
   ```bash
   npm run prisma:push
   ```
4. **Für Production:**
   ```bash
   npm run prisma:migrate
   ```

## 📊 Schema-Übersicht

Das Prisma-Schema enthält folgende Modelle:

- **User** - Benutzer
- **Club** - Vereine
- **ClubMember** - Vereinsmitgliedschaften
- **Team** - Teams
- **Asset** - Medien-Assets
- **Template** - Post-Templates
- **Post** - Social Media Posts
- **Sponsor** - Sponsoren
- **SponsorAssignment** - Sponsor-Team-Zuordnungen
- **MatchEvent** - Spiele/Events
- **MatchEventPost** - Verknüpfung zwischen Events und Posts

## 🔐 Row Level Security (RLS)

⚠️ **Wichtig:** Die Prisma-Queries umgehen die Row Level Security (RLS) von Supabase, da sie die Service Role verwenden. 

**Sicherheitshinweise:**
- Verwende Prisma nur in **serverseitigen API-Routes** (nicht im Client!)
- Implementiere **manuelle Authorization-Checks** in deinen API-Endpoints
- Die bestehenden RLS-Policies gelten nur für direkte Supabase-Client-Queries

```typescript
// Beispiel: Authorization-Check in API-Route
export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return new Response('Unauthorized', { status: 401 });
  }
  
  // Nur Clubs abrufen, bei denen der User Mitglied ist
  const clubs = await prisma.club.findMany({
    where: {
      members: {
        some: {
          userId: session.user.id
        }
      }
    }
  });
  
  return Response.json(clubs);
}
```

## 🔗 Supabase + Prisma

Prisma und Supabase arbeiten gut zusammen:
- **Supabase Auth** wird weiterhin für Authentifizierung verwendet
- **Supabase Storage** kann weiterhin für Datei-Uploads genutzt werden
- **Prisma ORM** verwaltet die Datenbankzugriffe
- **Bestehende SQL-Schema** bleibt erhalten

## 📚 Weitere Ressourcen

- [Prisma Dokumentation](https://www.prisma.io/docs)
- [Prisma mit Next.js](https://www.prisma.io/docs/guides/other/troubleshooting-orm/help-articles/nextjs-prisma-client-dev-practices)
- [Supabase + Prisma Guide](https://supabase.com/docs/guides/integrations/prisma)

## ❓ Häufige Probleme

### "PrismaClient is unable to be run in the browser"
→ Stelle sicher, dass du Prisma nur in Server-Components oder API-Routes verwendest, **nicht** in Client-Components.

### "Too many connections"
→ Verwende Connection Pooling in Supabase (Transaction-Modus in der Connection-String).

### Schema-Änderungen werden nicht übernommen
→ Führe `npm run prisma:generate` aus, nachdem du das Schema geändert hast.
