import { useState } from "react";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    console.log("Username:", username);
    console.log("Password:", password);

    // Hier der API request zum Einloggen
  }

  return (
    <div className="flex flex-col items-center justify-center w-full h-screen ">
      <h1 className="text-3xl">Login Page</h1>
      <form className="flex flex-col gap-4 mt-5" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          className="p-2 m-2 border border-gray-300 rounded-lg"
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="p-2 m-2 border border-gray-300 rounded-lg"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="submit"
          className="px-6 py-2 m-2 font-bold text-white bg-blue-500 rounded-lg hover:bg-blue-700"
        >
          Login
        </button>
      </form>
    </div>
  );
}
