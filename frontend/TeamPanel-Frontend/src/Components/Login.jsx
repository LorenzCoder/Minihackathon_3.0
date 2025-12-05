export default function Login() {
  return (
    <div className="flex flex-col items-center justify-center w-full h-screen ">
      <h1 className="text-3xl">Login Page</h1>
      <form className="flex flex-col gap-4 mt-5"></form>
      <input
        type="text"
        placeholder="Username"
        className="p-2 m-2 border border-gray-300 rounded-lg"
      />
      <input
        type="password"
        placeholder="Password"
        className="p-2 m-2 border border-gray-300 rounded-lg"
      />
      <button
        type="submit"
        className="px-6 py-2 m-2 font-bold text-white bg-blue-500 rounded-lg hover:bg-blue-700"
      >
        Login
      </button>
    </div>
  );
}
