import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

const FEATURES = [
  {
    title: "Dashboard",
    tag: "Core",
    description:
      "Zentrale Übersicht über dein Team: offene Tasks, aktive Boards und Ankündigungen auf einen Blick.",
  },
  {
    title: "Team erstellen",
    tag: "Teammgmt",
    description:
      "Team anlegen mit Teamnamen, Teamgröße, Beschreibung und optionalen Usernames deiner Members.",
  },
  {
    title: "Notizboard wie Trello",
    tag: "Board",
    description:
      "Kanban-Board mit Spalten (To Do, In Progress, Review, Done, Bugs) zum Verwalten aller Aufgaben.",
  },
  {
    title: "TeamOverview",
    tag: "Übersicht",
    description:
      "Zeigt dir alle Mitglieder, Rollen und Aktivität im Team – wer arbeitet woran, wer ist online.",
  },
  {
    title: "TeamInvite im Nachhinein",
    tag: "Invite",
    description:
      "Lade neue Mitglieder per Link oder E-Mail in bereits bestehende Teams ein – auch nach Projektstart.",
  },
  {
    title: "Announcements",
    tag: "Info",
    description:
      "Globale Team-Ankündigungen an einem Ort: wichtige Updates, Deadlines und Hinweise für alle.",
  },
];

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);
  const navigate = useNavigate();

  // Form-States
  const [showForm, setShowForm] = useState(false);
  const [teamName, setTeamName] = useState("");
  const [teamSize, setTeamSize] = useState("");
  const [description, setDescription] = useState("");
  const [memberNames, setMemberNames] = useState(""); // optional
  const [featureTodo, setFeatureTodo] = useState(true);
  const [featureManager, setFeatureManager] = useState(true);
  const [featureAnnouncements, setFeatureAnnouncements] = useState(true);
  const [creating, setCreating] = useState(false);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");

  // Team-Liste
  const [teams, setTeams] = useState([]);
  const [loadingTeams, setLoadingTeams] = useState(true);
  const [teamsError, setTeamsError] = useState("");

  // Teams aus Supabase laden
  async function loadTeams() {
    setTeamsError("");
    setLoadingTeams(true);

    const { data, error } = await supabase
      .from("teams")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      setTeamsError("Teams konnten nicht geladen werden.");
    } else {
      setTeams(data || []);
    }

    setLoadingTeams(false);
  }

  // 🔐 Guard: nur eingeloggte User + danach Teams laden
  useEffect(() => {
    const checkUser = async () => {
      const { data, error } = await supabase.auth.getUser();

      if (error || !data?.user) {
        navigate("/login");
        return;
      }

      setUser(data.user);
      setChecking(false);
      loadTeams();
    };

    checkUser();
  }, [navigate]);

  const handleCreateTeam = async (e) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");

    if (!teamName.trim()) {
      setFormError("Teamname ist erforderlich.");
      return;
    }

    setCreating(true);
    try {
      const selectedFeatures = [];
      if (featureTodo) selectedFeatures.push("todo-list");
      if (featureManager) selectedFeatures.push("team-manager");
      if (featureAnnouncements) selectedFeatures.push("announcements");

      const memberList = memberNames
        .split(",")
        .map((m) => m.trim())
        .filter(Boolean);

      const { data, error } = await supabase
        .from("teams")
        .insert([
          {
            name: teamName,
            description: description || "",
          },
        ])
        .select()
        .single();

      if (error) {
        console.error("Fehler beim Team-Anlegen:", error);
        setFormError(error.message || "Team konnte nicht erstellt werden.");
        return;
      }

      setFormSuccess(`Team "${data.name}" wurde erstellt.`);
      setTeamName("");
      setTeamSize("");
      setDescription("");
      setMemberNames("");
      setFeatureTodo(true);
      setFeatureManager(true);
      setFeatureAnnouncements(true);

      // Liste neu laden
      loadTeams();

      // Direkt auf TeamBoard
      navigate(`/team/${data.id}`, {
        state: {
          team: data,
          features: selectedFeatures,
          members: memberList,
          teamSize,
        },
      });
    } catch (err) {
      console.error(err);
      setFormError("Unerwarteter Fehler beim Erstellen des Teams.");
    } finally {
      setCreating(false);
    }
  };

  const handleJoinTeam = (team) => {
    // Solange Features nicht in der DB sind: Standard-Feature-Set
    const defaultFeatures = ["todo-list", "team-manager", "announcements"];

    navigate(`/team/${team.id}`, {
      state: {
        team,
        features: defaultFeatures,
        members: [],
        teamSize: "",
      },
    });
  };

  if (checking) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-900 text-slate-50">
        <p className="text-sm text-slate-400">Prüfe Login-Status...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-50">
      {/* Navbar */}
      <nav className="flex items-center justify-between w-full px-8 py-6 border-b backdrop-blur-sm bg-slate-900/40 border-slate-800/70">
        <a
          href="/"
          className="text-sm transition-colors text-slate-200 hover:text-white hover:underline"
        >
          NovaPanel
        </a>

        <h1 className="text-2xl font-semibold">Dashboard</h1>

        <span className="text-xs text-slate-500">
          {user ? user.email : "Unbekannt"}
        </span>
      </nav>

      {/* Main */}
      <main className="flex flex-col items-center flex-1 px-6 py-10">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 text-[11px] font-medium tracking-wide uppercase rounded-full border border-sky-400/50 bg-sky-500/10 text-sky-200/90 mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
          Mini Hackathon 3.0 – NovaPanel Dashboard
        </div>

        {/* Intro + Button */}
        <div className="flex flex-col w-full max-w-4xl gap-4 mb-8 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl space-y-2">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              Willkommen im{" "}
              <span className="text-transparent bg-gradient-to-r from-sky-400 via-cyan-300 to-sky-500 bg-clip-text">
                NovaPanel
              </span>
            </h2>

            <p className="text-sm leading-relaxed md:text-base text-slate-300">
              Erstelle neue Teams, verwalte deine Boards und plane eure Tasks.
              Unten siehst du die geplanten Hauptfeatures unseres Tools.
            </p>
          </div>

          <button
            onClick={() => setShowForm((prev) => !prev)}
            className="self-start px-5 py-2.5 rounded-full bg-sky-500 hover:bg-sky-400 text-sm font-semibold text-slate-900 shadow-md shadow-sky-900/40 transition-all duration-150"
          >
            {showForm ? "Formular schließen" : "Neues Team erstellen"}
          </button>
        </div>

        {/* Team-Formular */}
        {showForm && (
          <section className="w-full max-w-4xl mb-10">
            <div className="p-6 space-y-5 border shadow-lg bg-slate-900/80 border-slate-800 rounded-2xl shadow-slate-950/50">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-lg font-semibold text-slate-50">
                  Neues Team erstellen
                </h3>
                <span className="text-[11px] text-slate-500">
                  Felder mit * sind Pflicht
                </span>
              </div>

              <form
                className="grid gap-4 md:grid-cols-2"
                onSubmit={handleCreateTeam}
              >
                <div className="space-y-1 md:col-span-2">
                  <label className="text-sm text-slate-200">Teamname *</label>
                  <input
                    className="w-full px-3 py-2 text-sm border rounded-lg outline-none bg-slate-950 border-slate-700 text-slate-100 focus:border-sky-400 focus:ring-1 focus:ring-sky-500"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    placeholder="z.B. NovaPanel Core Team"
                    required
                  />
                </div>

                <div className="space-y-1 md:col-span-2">
                  <label className="text-sm text-slate-200">Beschreibung</label>
                  <textarea
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-sm text-slate-100 outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-500 min-h-[80px]"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Kurze Beschreibung des Teams oder Projekts"
                  />
                </div>

                <div className="space-y-1 md:col-span-2">
                  <label className="text-sm text-slate-200">
                    Usernames der Teammember (optional)
                  </label>
                  <textarea
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-sm text-slate-100 outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-500 min-h-[60px]"
                    value={memberNames}
                    onChange={(e) => setMemberNames(e.target.value)}
                    placeholder="Komma-getrennt, z.B. hube, lorenz, julian"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <p className="text-sm text-slate-200">Features aktivieren:</p>
                  <div className="flex flex-wrap gap-3 text-sm">
                    <label className="inline-flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={featureTodo}
                        onChange={(e) => setFeatureTodo(e.target.checked)}
                        className="rounded border-slate-600 bg-slate-950"
                      />
                      <span>Todo List</span>
                    </label>

                    <label className="inline-flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={featureManager}
                        onChange={(e) => setFeatureManager(e.target.checked)}
                        className="rounded border-slate-600 bg-slate-950"
                      />
                      <span>Teammanager</span>
                    </label>

                    <label className="inline-flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={featureAnnouncements}
                        onChange={(e) =>
                          setFeatureAnnouncements(e.target.checked)
                        }
                        className="rounded border-slate-600 bg-slate-950"
                      />
                      <span>Announcements</span>
                    </label>
                  </div>
                </div>

                {/* Fehlermeldungen */}
                <div className="space-y-2 md:col-span-2">
                  {formError && (
                    <p className="px-3 py-2 text-xs text-red-400 rounded-lg bg-red-950/40">
                      {formError}
                    </p>
                  )}
                  {formSuccess && (
                    <p className="px-3 py-2 text-xs rounded-lg text-emerald-400 bg-emerald-950/40">
                      {formSuccess}
                    </p>
                  )}
                </div>

                <div className="flex justify-end md:col-span-2">
                  <button
                    type="submit"
                    disabled={creating}
                    className="px-5 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-400 disabled:bg-emerald-700 text-sm font-semibold text-slate-900 shadow-md shadow-emerald-900/40 transition-all duration-150"
                  >
                    {creating ? "Erstelle Team..." : "Team anlegen"}
                  </button>
                </div>
              </form>
            </div>
          </section>
        )}

        {/* Team-Liste */}
        <section className="w-full max-w-4xl mb-10">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-slate-100">
              Deine Teams
            </h3>
            {loadingTeams && (
              <span className="text-[11px] text-slate-500">Lade...</span>
            )}
          </div>

          {teamsError && (
            <p className="mb-2 text-xs text-red-400">{teamsError}</p>
          )}

          {teams.length === 0 && !loadingTeams ? (
            <p className="text-xs text-slate-500">
              Du hast noch keine Teams erstellt.
            </p>
          ) : (
            <div className="space-y-2">
              {teams.map((team) => (
                <div
                  key={team.id}
                  className="flex items-center justify-between gap-3 bg-slate-900/80 border border-slate-800 rounded-xl px-4 py-2.5"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate text-slate-100">
                      {team.name}
                    </p>
                    {team.description && (
                      <p className="text-[11px] text-slate-500 truncate">
                        {team.description}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleJoinTeam(team)}
                      className="px-3 py-1.5 rounded-full bg-sky-500 hover:bg-sky-400 text-[11px] font-semibold text-slate-900"
                    >
                      Beitreten
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Feature-Karten */}
        <section className="grid w-full max-w-4xl gap-4 md:grid-cols-2">
          {FEATURES.map((feature) => (
            <article
              key={feature.title}
              className="flex items-start gap-3 px-4 py-3 border shadow-md rounded-2xl bg-slate-900/80 border-slate-800 shadow-slate-950/40"
            >
              <div className="flex items-center justify-center w-10 h-10 mt-1 shadow-inner rounded-xl bg-amber-500/90 shadow-amber-900/70">
                <span className="text-xl text-slate-950">!</span>
              </div>

              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-medium truncate text-slate-100">
                    {feature.title}
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wide bg-slate-800 text-slate-300">
                    {feature.tag}
                  </span>
                </div>
                <p className="text-xs leading-snug text-slate-400">
                  {feature.description}
                </p>
              </div>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}
