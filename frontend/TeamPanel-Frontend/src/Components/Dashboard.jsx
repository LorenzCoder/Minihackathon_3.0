import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      const { data, error } = await supabase.auth.getUser();

      if (error || !data?.user) {
        // nicht eingeloggt -> direkt zurück zum Login
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

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-50">
      <nav className="flex items-center justify-between w-full px-8 py-6 backdrop-blur-sm bg-slate-900/40 border-b border-slate-800/70">
        <a
          href="/"
          className="text-sm text-slate-200 hover:text-white hover:underline transition-colors"
        >
          NovaPanel
        </a>

        <h1 className="text-2xl font-semibold">Dashboard</h1>

        <span className="text-xs text-slate-500">
          {user ? user.email : "Unbekannt"}
        </span>
      </nav>

      <main className="flex-1 flex flex-col items-center justify-center px-6 py-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 text-[11px] font-medium tracking-wide uppercase rounded-full border border-sky-400/50 bg-sky-500/10 text-sky-200/90 mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
          Mini Hackathon 3.0 – NovaPanel Dashboard
        </div>

        <div className="max-w-3xl text-center space-y-4">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            Willkommen im{" "}
            <span className="bg-gradient-to-r from-sky-400 via-cyan-300 to-sky-500 bg-clip-text text-transparent">
              NovaPanel
            </span>
          </h2>

          <p className="text-sm md:text-base text-slate-300 leading-relaxed">
            Hier kannst du später deine Boards, Tasks und Teams organisieren.
          </p>
        </div>
      </main>
    </div>
  );
}
