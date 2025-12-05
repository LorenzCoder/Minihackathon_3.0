import { useState } from "react";

export default function Dashboard() {
  const [showAddTeamPanel, setShowAddTeamPanel] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center w-full h-screen ">
      <h1 className="text-2xl">Herzlich willkommen im Teampanel</h1>
      <button
        onClick={() => setShowAddTeamPanel(true)}
        className="px-6 py-2 m-2 font-bold text-white bg-blue-500 rounded-lg hover:bg-blue-700"
      >
        Team anlegen
      </button>

      {showAddTeamPanel && (
        <AddTeamPanel onExit={() => setShowAddTeamPanel(false)} />
      )}
    </div>
  );
}

function AddTeamPanel({ onExit }) {
  const [teamName, setTeamName] = useState("");
  const [description, setDescription] = useState("");
  const [newMembername, setNewMembername] = useState("");
  const [members, setMembers] = useState([]);

  function handleAddMember(e) {
    e.preventDefault();
    if (newMembername.trim() === "") return;
    setMembers((prevMembers) => [...prevMembers, newMembername]);
    setNewMembername("");
  }

  function handleRemoveMember(e, index) {
    e.preventDefault();
    setMembers((prevMembers) => prevMembers.filter((_, i) => i !== index));
  }

  function handleSubmit(e) {
    e.preventDefault();
    // Hier der API request zum Erstellen des Teams
  }

  return (
    <div className="absolute w-[500px] h-[300px] md:w-[600px] md:h-[400px] lg:w-[800px] lg:h-[500px] rounded-lg bg-slate-200 flex flex-col">
      <div className="flex items-center justify-end">
        <button onClick={onExit} className="p-3">
          X
        </button>
      </div>
      <form className="flex flex-col items-center justify-between w-full h-full">
        <div className="flex flex-col items-center justify-center w-full ">
          <div className="flex items-center justify-between w-10/12">
            <input
              className="w-1/3 p-2 m-2 rounded-lg"
              placeholder="Teamname"
              onChange={(e) => setTeamName(e.target.value)}
            ></input>
            <input
              className="w-2/3 p-2 m-2 rounded-lg"
              placeholder="Beschreibung"
              onChange={(e) => setDescription(e.target.value)}
            ></input>
          </div>
          <div className="flex items-center justify-between w-10/12">
            <input
              onChange={(e) => setNewMembername(e.target.value)}
              className="w-2/3 p-2 m-2 rounded-lg"
              placeholder="Username eingeben ..."
            ></input>
            <button
              onClick={handleAddMember}
              className="w-1/3 p-2 m-2 text-white bg-blue-500 rounded-lg hover:bg-blue-700"
            >
              Mitglied hinzufügen
            </button>
          </div>
          <div className="w-10/12 p-2">
            <ul className="w-full mt-6">
              {members.map((member, index) => (
                <li key={index} className="p-1">
                  <div className="flex items-center justify-between w-full">
                    <p>{member}</p>
                    <button onClick={(e) => handleRemoveMember(e, index)}>
                      Entfernen
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <button
          type="submit"
          className="px-6 py-2 m-8 font-bold text-white bg-green-500 rounded-lg hover:bg-green-700"
          onSubmit={handleSubmit}
        >
          Team erstellen
        </button>
      </form>
    </div>
  );
}
