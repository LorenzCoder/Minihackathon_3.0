export default function Home() {
  return (
    <>
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-50">
        {/* Navbar */}
        <nav className="flex items-center justify-between w-full px-8 py-6 backdrop-blur-sm bg-slate-900/40 border-b border-slate-800/70">
          <a
            href="/login"
            className="text-sm text-slate-200 hover:text-white hover:underline transition-colors"
          >
            Login
          </a>

          <h1 className="text-2xl font-semibold text-white cursor-default transition-all duration-300 hover:scale-105 drop-shadow-[0_0_0_rgba(255,255,255,0)] hover:drop-shadow-[0_0_20px_rgba(255,255,255,0.9)]">
            NovaPanel
          </h1>

          {/* Platzhalter rechts, kannst du später nutzen */}
          <span className="text-sm text-slate-500">v1.0</span>
        </nav>

        {/* Main-Bereich, schön verteilt */}
        <main className="flex-1 flex flex-col items-center justify-center px-6 py-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 text-[11px] font-medium tracking-wide uppercase rounded-full border border-sky-400/50 bg-sky-500/10 text-sky-200/90">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
            Mini Hackathon 3.0 – Projektabgabe
          </div>
          <div className="max-w-3xl text-center space-y-4">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              Willkommen auf dem{" "}
              <span className="bg-gradient-to-r from-sky-400 via-cyan-300 to-sky-500 bg-clip-text text-transparent">
                NovaPanel
              </span>
            </h2>

            <p className="text-sm md:text-base text-slate-300 leading-relaxed">
              Willkommen auf dem NovaPanel, einem Team-Organisations-Tool, das
              viel Wert auf Perfektion und Ordnung legt. Dieses Projekt ist eine
              Abgabe von Julian, Lorenz, Pietro und Hube für den Mini Hackathon
              (3.0) von Kevin Chromik.
            </p>
          </div>

      <div className="flex flex-col items-center px-6 pt-16 pb-12">
        {/* Hero */}
        <section className="flex flex-col items-center text-center max-w-3xl mb-10 gap-4">

          <a
            href="/login"
            className="mt-4 px-6 py-3 text-sm font-semibold rounded-full bg-sky-500 hover:bg-sky-400 text-slate-900 shadow-md shadow-sky-900/50 transition-all duration-200"
          >
            Zum Login
          </a>

          <p className="mt-4 text-xs text-slate-400">
            Ein Projekt von{" "}
            <span className="font-medium text-slate-200">
              Julian, Lorenz, Pietro und Hube
            </span>{" "}
            für den Mini Hackathon (3.0) von Kevin Chromik.
          </p>
                </section>
          </div>

        </main>
      </div>
    </>
  );
}

// Kannst du später benutzen, aktuell optional
function SectionPanel({ title, description }) {
  return (
    <section className="w-32 h-64 m-1 mt-5 transition-transform bg-slate-100 hover:scale-105">
      <div className="flex flex-col items-center justify-center h-full">
        <h2 className="mb-2 text-lg">{title}</h2>
        <p className="text-sm text-center">{description}</p>
      </div>
    </section>
  );
}
