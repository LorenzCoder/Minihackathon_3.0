import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setErrorMsg(error.message);
      } else {
        console.log("Login erfolgreich:", data);
        setSuccessMsg("Login erfolgreich! 🎉");

        // nach kurzem Moment aufs Dashboard leiten
        setTimeout(() => {
          navigate("/dashboard");
        }, 300);
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Unerwarteter Fehler beim Login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-50">
        {/* Navbar – gleich wie auf Home */}
        <nav className="flex items-center justify-between w-full px-8 py-6 backdrop-blur-sm bg-slate-900/40 border-b border-slate-800/70">
          <a
            href="/"
            className="text-sm text-slate-200 hover:text-white hover:underline transition-colors"
          >
            Zur Startseite
          </a>

          <h1 className="text-2xl font-semibold text-white cursor-default transition-all duration-300 hover:scale-105 drop-shadow-[0_0_0_rgba(255,255,255,0)] hover:drop-shadow-[0_0_20px_rgba(255,255,255,0.9)]">
            NovaPanel
          </h1>

          <span className="text-sm text-slate-500">Login</span>
        </nav>

        {/* Main */}
        <main className="flex-1 flex flex-col items-center justify-center px-6 py-10">
          {/* Gleicher Badge wie auf Home */}
          <div className="inline-flex items-center gap-2 px-3 py-1 text-[11px] font-medium tracking-wide uppercase rounded-full border border-sky-400/50 bg-sky-500/10 text-sky-200/90 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
            Mini Hackathon 3.0 – NovaPanel Login
          </div>

          {/* Card */}
          <div className="w-full max-w-md bg-slate-900/70 border border-slate-800 rounded-2xl shadow-xl shadow-slate-950/50 p-6 space-y-5">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-semibold tracking-tight">
                Einloggen in{" "}
                <span className="bg-gradient-to-r from-sky-400 via-cyan-300 to-sky-500 bg-clip-text text-transparent">
                  NovaPanel
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Melde dich mit deinem Team-Account an, um Boards, Tasks und dein
                Panel zu verwalten.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-sm text-slate-200">E-Mail</label>
                <input
                  type="email"
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-sm text-slate-100 outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-500"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@team.dev"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm text-slate-200">Passwort</label>
                <input
                  type="password"
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-sm text-slate-100 outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-500"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                />
              </div>

              {errorMsg && (
                <p className="text-xs text-red-400 bg-red-950/40 px-3 py-2 rounded-lg">
                  {errorMsg}
                </p>
              )}

              {successMsg && (
                <p className="text-xs text-emerald-400 bg-emerald-950/40 px-3 py-2 rounded-lg">
                  {successMsg}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-2.5 rounded-full bg-sky-500 hover:bg-sky-400 disabled:bg-sky-700 text-slate-900 text-sm font-semibold shadow-md shadow-sky-900/40 transition-all duration-150"
              >
                {loading ? "Logge ein..." : "Einloggen"}
              </button>
            </form>

            <p className="text-[11px] text-slate-500 text-center">
              Accounts werden aktuell manuell im Team vergeben.
            </p>
          </div>
        </main>
      </div>
    </>
  );
}
