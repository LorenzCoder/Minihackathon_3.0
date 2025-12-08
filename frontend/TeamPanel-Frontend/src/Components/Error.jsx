export default function Error() {
  return (
    <>
      <div className="flex flex-col items-center justify-center w-full h-screen">
        <div>
          <h1 className="m-5 text-xl">TeamPanel - Page Not Found</h1>
        </div>
        <div>
          <p>Error 404</p>
        </div>
        <div className="mt-5">
          <p>The page you are looking for does not exist.</p>
        </div>
        <div className="mt-5">
          <a href="/" className="text-blue-500 underline">
            Go back to Home
          </a>
        </div>
      </div>
    </>
  );
}
