import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

export default function TeamBoard() {
  const { teamId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

  const teamFromState = location.state?.team || null;
  const featuresFromState = location.state?.features || [];
  const membersFromState = location.state?.members || [];
  const teamSizeFromState = location.state?.teamSize || "";

  const [team] = useState(teamFromState);
  const [features] = useState(featuresFromState);
  const [members] = useState(membersFromState);
  const [teamSize] = useState(teamSizeFromState);

  const hasTodo = features.includes("todo-list");
  const hasManager = features.includes("team-manager");
  const hasAnnouncements = features.includes("announcements");

  const initialdata = {
    columns: [
      { id: "1", title: "Backlog", cardIds: ["1"] },
      { id: "2", title: "In Progress", cardIds: [] },
      { id: "3", title: "Done", cardIds: [] },
    ],
    cards: [{ id: "1", content: "Testaufgabe" }],
  };

  const [data, setData] = useState(initialdata);

  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    const startColumn = data.columns.find(
      (col) => col.id === source.droppableId
    );

    const finishColumn = data.columns.find(
      (col) => col.id === destination.droppableId
    );

    const sourceCardIds = Array.from(startColumn.cardIds);
    sourceCardIds.splice(source.index, 1);

    const destCardIds = Array.from(finishColumn.cardIds);
    destCardIds.splice(destination.index, 0, draggableId);

    const newColumns = data.columns.map((col) => {
      if (col.id === startColumn.id) return { ...col, cardIds: sourceCardIds };
      if (col.id === finishColumn.id) return { ...col, cardIds: destCardIds };
      return col;
    });

    setData({ ...data, columns: newColumns });
  };

  // 🔐 Guard: nur eingeloggt
  useEffect(() => {
    const checkUser = async () => {
      const { data, error } = await supabase.auth.getUser();

      if (error || !data?.user) {
        navigate("/login");
        return;
      }

      setUser(data.user);
      setChecking(false);
    };

    checkUser();
  }, [navigate]);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-slate-50">
        <p className="text-sm text-slate-400">Prüfe Login-Status...</p>
      </div>
    );
  }

  // Falls man /team/:id hart per URL lädt, ohne state
  if (!team) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-slate-50 px-4">
        <p className="text-sm text-slate-300 mb-4 text-center">
          Teamdaten konnten nicht geladen werden. Öffne das Team bitte über das
          Dashboard.
        </p>
        <button
          onClick={() => navigate("/dashboard")}
          className="px-5 py-2 rounded-full bg-sky-500 hover:bg-sky-400 text-sm font-semibold text-slate-900"
        >
          Zurück zum Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-50">
      {/* Navbar */}
      <nav className="flex items-center justify-between w-full px-8 py-6 backdrop-blur-sm bg-slate-900/40 border-b border-slate-800/70">
        <button
          onClick={() => navigate("/dashboard")}
          className="text-sm text-slate-200 hover:text-white hover:underline transition-colors"
        >
          Zurück zum Dashboard
        </button>

        <h1 className="text-2xl font-semibold">
          Teamboard – {team.name ?? "Team"}
        </h1>

        <span className="text-xs text-slate-500">
          {user ? user.email : "Unbekannt"}
        </span>
      </nav>

      <main className="flex-1 flex flex-col gap-8 px-6 py-8 max-w-6xl mx-auto w-full">
        {/* Team-Info */}
        <section className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg shadow-slate-950/40">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-3">
            <div>
              <h2 className="text-xl font-semibold text-slate-50">
                {team.name}
              </h2>
              <p className="text-xs text-slate-400">
                Team-ID: <span className="font-mono">{teamId}</span>
              </p>
            </div>

            <div className="flex flex-wrap gap-2 text-[11px]">
              {hasTodo && (
                <span className="px-2 py-1 rounded-full bg-sky-500/20 text-sky-200 border border-sky-500/40">
                  Todo List
                </span>
              )}
              {hasManager && (
                <span className="px-2 py-1 rounded-full bg-emerald-500/15 text-emerald-200 border border-emerald-500/40">
                  Teammanager
                </span>
              )}
              {hasAnnouncements && (
                <span className="px-2 py-1 rounded-full bg-amber-500/20 text-amber-100 border border-amber-500/40">
                  Announcements
                </span>
              )}
            </div>
          </div>

          {team.description && (
            <p className="text-sm text-slate-300 leading-relaxed mb-3">
              {team.description}
            </p>
          )}

          <div className="flex flex-wrap gap-3 text-xs text-slate-400">
            {teamSize && (
              <span>
                Teamgröße:{" "}
                <span className="text-slate-200 font-medium">{teamSize}</span>
              </span>
            )}
            {members.length > 0 && (
              <span>
                Members:{" "}
                <span className="text-slate-200 font-medium">
                  {members.join(", ")}
                </span>
              </span>
            )}
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-3">
          {/* Todo List */}
          {hasTodo && (
            <div className="lg:col-span-3 bg-slate-900/80 border border-slate-800 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-slate-100">
                  Todo Board
                </h3>
                <span className="text-[11px] text-slate-500">
                  Demo – Tasks können verschoben werden (Noch keine API
                  Anbindung)
                </span>
              </div>

              <DragDropContext onDragEnd={onDragEnd}>
                <div className="grid gap-3 md:grid-cols-3">
                  {data.columns.map((column) => (
                    <Droppable droppableId={column.id} key={column.id}>
                      {(provided, snapshot) => (
                        <div
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          className={`rounded-xl bg-slate-950/70 border border-slate-800 p-3 space-y-2 min-h-[200px] transition-all duration-200 ease-out`}
                        >
                          {/* Spaltenkopf */}
                          <div className="flex items-center justify-between mb-2 sticky top-0 z-10">
                            <p className="text-xs font-medium text-slate-200">
                              {column.title}
                            </p>
                            <button
                              className="text-xs text-red-500"
                              onClick={(e) => {
                                e.stopPropagation();
                                setData((prev) => ({
                                  ...prev,
                                  columns: prev.columns.filter(
                                    (col) => col.id !== column.id
                                  ),
                                  cards: prev.cards.filter(
                                    (c) => !column.cardIds.includes(c.id)
                                  ),
                                }));
                              }}
                            >
                              ✕
                            </button>
                          </div>

                          {/* Karten */}
                          {column.cardIds.map((cardId, index) => {
                            const card = data.cards.find(
                              (c) => c.id === cardId
                            );
                            return (
                              <Draggable
                                draggableId={cardId}
                                index={index}
                                key={cardId}
                              >
                                {(provided) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className="p-2 mb-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 cursor-pointer flex justify-between items-center hover:bg-slate-700 transition-transform duration-200 ease-out"
                                    style={{
                                      ...provided.draggableProps.style,
                                    }}
                                  >
                                    {card?.content}
                                    <button
                                      className="text-xs text-red-500"
                                      onClick={() => {
                                        setData((prev) => ({
                                          ...prev,
                                          columns: prev.columns.map((col) => ({
                                            ...col,
                                            cardIds: col.cardIds.filter(
                                              (id) => id !== cardId
                                            ),
                                          })),
                                          cards: prev.cards.filter(
                                            (c) => c.id !== cardId
                                          ),
                                        }));
                                      }}
                                    >
                                      ✕
                                    </button>
                                  </div>
                                )}
                              </Draggable>
                            );
                          })}

                          {snapshot.isDraggingOver && provided.placeholder}

                          {/* + Karte hinzufügen als „Karte“ */}
                          <div className="p-2 mb-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 cursor-pointer flex justify-center items-center hover:bg-slate-700 transition-transform duration-200 ease-out">
                            <button
                              className="w-full text-xs text-slate-200"
                              onClick={() => {
                                const content = prompt("Neue Karte eingeben:");
                                if (!content) return;
                                const newId = Date.now().toString();
                                setData((prev) => ({
                                  ...prev,
                                  cards: [
                                    ...prev.cards,
                                    { id: newId, content },
                                  ],
                                  columns: prev.columns.map((col) =>
                                    col.id === column.id
                                      ? {
                                          ...col,
                                          cardIds: [...col.cardIds, newId],
                                        }
                                      : col
                                  ),
                                }));
                              }}
                            >
                              + Karte hinzufügen
                            </button>
                          </div>
                        </div>
                      )}
                    </Droppable>
                  ))}
                </div>
              </DragDropContext>

              <button
                className="mt-3 w-full p-2 text-sm rounded bg-slate-700 text-slate-200 hover:bg-slate-600"
                onClick={() => {
                  const title = prompt("Name der neuen Spalte:");
                  if (!title) return;

                  const newId = Date.now().toString();

                  setData((prev) => ({
                    ...prev,
                    columns: [
                      ...prev.columns,
                      { id: newId, title, cardIds: [] },
                    ],
                  }));
                }}
              >
                + Neue Spalte
              </button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
