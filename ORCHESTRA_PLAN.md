# Orchestra IDE — Plan d'Architecture & Roadmap (Prototype CLI) v3.0

> Document de préparation projet. Cible code : repo dédié `maximelarrieu/orchestra-ide`
> (Rust / Tokio / ratatui). Ce document décrit la vision, l'architecture découplée et
> la décomposition en **5 phases incrémentales** (MVP / structure de fichiers / code minimal).

---

## 1. Vision

Moteur + interface d'un « IDE pour l'ère agentique » (**Orchestra**). Approche en deux temps :

1. **Phase actuelle** : application Terminal (TUI) très visuelle — écran radar du flux
   d'activité des agents, bordures ASCII, couleurs — via `ratatui` (+ `crossterm`).
2. **Phase future** : portage vers une UI graphique (**Tauri + React**), d'où la
   nécessité de **découpler strictement la logique métier de l'affichage**.

Décisions actées :
- **Repo cible** : `maximelarrieu/orchestra-ide` (dédié).
- **Moteur TUI** : `ratatui`.
- **Runtime** : `tokio`. **Communication agents ↔ UI** : `tokio::sync::mpsc`.

---

## 2. Maquette TUI cible

```text
┌────────────────────────────────────────────────────────────────────────────┐
│  ORCHESTRA IDE v1.0.0 | Espace actuel : [Recherche_Immo_Aix]                 │
├────────────────────────────────────────────────────────────────────────────┤
│ 🛰️  ÉCRAN RADAR (FLUX D'ACTIVITÉ DES AGENTS)                                 │
│ ├─ 🤖 Agent_Scraper  -> Initialisation du scraping (LeBonCoin)               │
│ ├─ 🤖 Agent_Scraper  -> 12 nouvelles annonces trouvées à Aix                 │
│ ├─ 🤖 Agent_Filtrage -> Analyse via LLM...                                   │
│ └─ 🤖 Agent_Filtrage -> ❌ 9 rejetées (Hors budget/critères)                 │
├────────────────────────────────────────────────────────────────────────────┤
│ 📋 OPTIONS & MENUS                                                           │
│ [1] Lancer une intention   [2] Voir les ADRs   [3] Changer d'Espace          │
└────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Architecture transverse — découplage strict (clé du futur port Tauri)

**Workspace Cargo multi-crates** :

```
orchestra-ide/
├─ Cargo.toml                 # [workspace] members = ["crates/*"]
├─ crates/
│  ├─ orchestra-core/         # lib — AUCUNE dépendance UI. Domaine pur.
│  │  └─ src/
│  │     ├─ lib.rs
│  │     ├─ error.rs          # OrchestraError (thiserror)
│  │     ├─ model/            # ContextSpace, ProjectConfig, ProjectType, Persona, Adr
│  │     ├─ skills/           # trait Skill + registre + implémentations
│  │     ├─ agents/           # trait Agent + Orchestrator
│  │     ├─ events.rs         # AgentEvent — CONTRAT cœur ↔ UI
│  │     └─ llm/              # trait LlmProvider (abstrait, mockable)
│  └─ orchestra-tui/          # bin — ratatui. Consomme orchestra-core via events.
│     └─ src/{main.rs, dashboard.rs, commands/}
└─ (futur) crates/orchestra-tauri/   # réutilise orchestra-core tel quel
```

**Règle d'or appliquée** : le cœur n'écrit **jamais** sur stdout ; il publie des
`AgentEvent` sur un canal `mpsc`. Le TUI (puis Tauri) est un simple *consommateur*.
Le port graphique consiste alors à remplacer `orchestra-tui` sans toucher au cœur.

**Dépendances clés** : `tokio`, `serde`/`serde_json`, `ratatui` + `crossterm`,
`dialoguer`, `clap`, `thiserror`, `async-trait`, puis (phases 4-5) `git2`, `reqwest`.

---

## 4. Modèle de données « Espace de Contexte » (agnostique)

Un espace = un dossier contenant `.orchestra/config.json` (+ `persona.md`, `adr/`).
100 % modulable, 4 types de projet hors-dev/dev : **Dev, Nutrition, Langue, Immobilier**.

`.orchestra/config.json` (agnostique, intégrations optionnelles) :

```json
{
  "project_name": "SaaS Vétérinaire",
  "project_type": "dev",
  "workspace_path": "C:/Users/dev/projects/saas-vet",
  "documentalist_enabled": true,
  "agents": ["Agent_Architecte", "Agent_Dev", "Agent_Documentaliste"],
  "skills": ["Read_File", "Write_File_Validated", "Execute_Terminal_Command"],
  "integrations": {
    "git":    { "auto_branching": true, "main_branch": "main" },
    "github": { "repo": "github.com/mon-compte/saas-vet", "token_env_var": "ORCHESTRA_GITHUB_TOKEN" },
    "jira":   { "project_key": "VET", "url": "https://mon-equipe.atlassian.net", "token_env_var": "ORCHESTRA_JIRA_TOKEN" }
  }
}
```

**Matrice Skills par défaut (spec §3)** :

| Type | Skills par défaut |
|------|-------------------|
| Dev | `Read_File`, `Write_File_Validated` (guardrail `cargo check`), `Execute_Terminal_Command` |
| Nutrition | `Web_Search`, `Calorie_Calculator`, `File_Append` |
| Langue | `Generate_Quiz`, `Translate_Text`, `Text_To_Speech` |
| Immobilier | `Scrape_Web_Page`, `Extract_JSON_From_HTML`, `Geocoding_Calcul` |

---

## 5. Décomposition en 5 phases incrémentales

### PHASE 1 — Modèle des Espaces + coquille ASCII (sans LLM)

**MVP** : charger un `.orchestra/config.json` en `ContextSpace` ; afficher le
dashboard ratatui en 3 zones (en-tête / radar vide / menu) ; `q` quitte.

**Fichiers** : `core/model/{project_type,config,space,skill_id}.rs`, `core/events.rs`,
`core/error.rs` ; `tui/{main,dashboard}.rs`.

**Code minimal (cœur)** :
```rust
#[derive(Debug, Clone, Copy, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum ProjectType { Dev, Nutrition, Langue, Immobilier }

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ProjectConfig {
    pub project_name: String,
    pub project_type: ProjectType,
    #[serde(default)] pub workspace_path: Option<PathBuf>,
    #[serde(default)] pub documentalist_enabled: bool,
    #[serde(default)] pub skills: Vec<String>,
    #[serde(default)] pub agents: Vec<String>,
    #[serde(default)] pub integrations: Integrations,
}

pub struct ContextSpace { pub root: PathBuf, pub config: ProjectConfig,
                          pub persona: Option<String>, pub adrs: Vec<Adr> }
impl ContextSpace {
    pub fn load(root: &Path) -> Result<Self, OrchestraError> {
        let cfg: ProjectConfig = serde_json::from_str(
            &fs::read_to_string(root.join(".orchestra/config.json"))?)?;
        Ok(Self { root: root.into(), config: cfg, persona: None, adrs: vec![] })
    }
}
```

**Code minimal (TUI)** :
```rust
let chunks = Layout::vertical([
    Constraint::Length(3),   // en-tête
    Constraint::Min(8),      // 🛰️ ÉCRAN RADAR (vide)
    Constraint::Length(4),   // 📋 OPTIONS & MENUS
]).split(area);
frame.render_widget(Block::bordered().title(header), chunks[0]);
frame.render_widget(Block::bordered().title("🛰️  ÉCRAN RADAR"), chunks[1]);
frame.render_widget(Block::bordered().title("📋 OPTIONS & MENUS"), chunks[2]);
```

**Vérif** : `cargo run -p orchestra-tui` dans un dossier avec `.orchestra/config.json`
exemple → 3 zones bordées, en-tête au nom de l'espace, radar vide, `q` restaure le terminal.

---

### PHASE 2 — Commande `orchestra init` (scaffolding) + templates par type

**MVP** : `orchestra init` interactif (`dialoguer`) → nom, type (Dev/Langue/Immobilier/
Nutrition), activation Documentaliste → génère `.orchestra/` + `.orchestra/adr/` +
`persona.md` (templatisé par type) + `config.json` (matrice Skills/Agents) + ASCII art succès.

**Fichiers** : `core/scaffold/{mod,templates}.rs` ; `tui/commands/init.rs` ;
`tui/main.rs` (clap : `init` | `dashboard`).

**Code minimal** (signature imposée par la spec) :
```rust
pub async fn run_init_command() -> Result<(), OrchestraError> {
    let name = Input::new().with_prompt("Nom du projet").interact_text()?;
    let kind = Select::new().items(&["Dev","Langue","Immobilier","Nutrition"]).interact()?;
    let doc  = Confirm::new().with_prompt("Agent Documentaliste ?").interact()?;
    let cfg  = ProjectConfig::default_for(kind.into(), &name, doc);
    scaffold::write_space(&env::current_dir()?, &cfg)?;
    print_success_ascii(&name);
    Ok(())
}
```
Template `persona.md` adapté (ex. Langue → demande niveau actuel + langue cible).

**Vérif** : `orchestra init` dans un dossier vide → relire le `config.json` généré, puis
`orchestra dashboard` charge l'espace créé.

---

### PHASE 3 — Runtime d'agents + flux temps réel (mpsc) → Radar vivant

**MVP** : l'Orchestrateur lance les agents en tâches `tokio`, chacun publie des
`AgentEvent` sur un `mpsc`. Le dashboard consomme le flux et fait défiler les lignes du
Radar. Agents **simulés**, Skills mockés via trait + registre (toujours sans LLM).

**Fichiers** : `core/agents/{mod,orchestrator,agent}.rs`, `core/skills/{mod,registry}.rs`,
maj `tui/dashboard.rs` (état scrollable).

**Code minimal** :
```rust
pub enum AgentEvent { Log { agent: String, msg: String }, Done { agent: String } }

#[async_trait] pub trait Agent { async fn run(&self, tx: Sender<AgentEvent>); }
#[async_trait] pub trait Skill { async fn execute(&self, input: Value)
                                   -> Result<Value, OrchestraError>; }
// orchestrator : for a in agents { let tx = tx.clone(); tokio::spawn(async move { a.run(tx).await }); }
// tui boucle : select! { Some(ev) = rx.recv() => radar.push(ev), key = events.next() => handle(key) }
```

**Vérif** : lancer une « intention » depuis le menu → lignes qui apparaissent en direct
dans le Radar sans bloquer le clavier.

---

### PHASE 4 — Intégration LLM + Skills écosystème Dev (Git / Jira / GitHub)

**MVP** : brancher un `LlmProvider` réel (derrière trait → mockable/swappable). Implémenter
les Skills Dev et câbler le **workflow JIRA-12** (spec §6.C).

**Skills** : `Jira_Fetch_Ticket` (reqwest, token via `token_env_var`), `Git_Lifecycle`
(`git2` : branche / commit / push), `GitHub_Open_PR` (API REST), `Write_File_Validated`
(guardrail `cargo check`), `Execute_Terminal_Command`.

**Workflow orchestré** :
1. « Prends le ticket JIRA-12 et traite-le ».
2. `Jira_Fetch_Ticket` → description + critères d'acceptation.
3. Agent_Architecte planifie (ticket + fichiers locaux du `workspace_path`).
4. `Git_Lifecycle(Create_Branch "feature/JIRA-12")`.
5. Agent_Dev code/teste via `Write_File_Validated`.
6. `Git_Lifecycle(Commit & Push)`.
7. `GitHub_Open_PR` → lien affiché en ASCII dans le Radar.

**Fichiers** : `core/llm/{mod,provider}.rs`, `core/skills/{git,jira,github,fs_validated,
terminal}.rs`. Secrets lus via `*_env_var` (jamais en clair).

**Vérif** : sur un repo Dev de test (tokens en env), dérouler jusqu'au lien de PR ;
`Write_File_Validated` doit bloquer si `cargo check` échoue.

---

### PHASE 5 — Agent Documentaliste + finitions & validation du découplage

**MVP** : agent `Documentaliste` déclenché **automatiquement** par l'Orchestrateur en fin
de tâche dev réussie (code écrit/compilé/testé), **avant** le commit final.

**Skills** : `Doc_Auto_Update` (MAJ intelligente des `.md` sans écraser l'existant) et
`Mermaid_Schema_Generator` (ERD Mermaid depuis migrations / structs Rust). Structure
maintenue dans le workspace : `docs/architecture/` (ADR), `docs/technical/` (Mermaid + API),
`docs/functional/`.

**Hook orchestrateur** :
```text
si config.documentalist_enabled et task.success :
    Documentaliste(ticket, diff) -> écrit/MAJ docs/  -> puis Git_Lifecycle(Commit final)
```

**Finitions** : visualiseur d'ADR ([2]), changement d'Espace ([3]), et **test de
découplage** : `orchestra-core` doit compiler sans aucune dépendance UI (preuve que le
port Tauri est faisable).

**Fichiers** : `core/agents/documentalist.rs`, `core/skills/{doc_update,mermaid}.rs`,
`tui/views/{adr,space_switch}.rs`.

**Vérif** : tâche dev complète avec Documentaliste activé → `docs/` peuplé/mis à jour,
ADR consultable dans la TUI, diagramme Mermaid valide, commit final incluant la doc.

---

## 6. Étapes d'exécution (au signal « go Phase 1 »)

1. Ajouter `maximelarrieu/orchestra-ide` au scope de session (`add_repo`), vérifier s'il est vide.
2. Brancher, scaffolder le workspace Cargo (crates `orchestra-core` + `orchestra-tui`).
3. Implémenter **uniquement la Phase 1**, puis s'arrêter (règle stricte de la spec).
