function App() {
  return (
    <>
      <div className="flex flex-col items-center justify-center w-full h-screen">
        <div>
          <h1 className="m-5 text-xl">TeamPanel</h1>
        </div>
        <div>
          <p>Welcome to TeamPanel Frontend!</p>
        </div>
        <div className="grid grid-cols-4 gap-2 mt-5 ">
          <SectionPanel title={"Test"} description={"description test"} />
          <SectionPanel />
          <SectionPanel />
          <SectionPanel />
          <SectionPanel />
          <SectionPanel />
          <SectionPanel />
          <SectionPanel />
        </div>
      </div>
    </>
  );
}

export default App;

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
