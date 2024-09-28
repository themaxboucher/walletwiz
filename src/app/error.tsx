"use client";

export default function ErrorPage() {
  return (
    <main className="flex justify-center items-center h-screen w-full">
      <div className="flex flex-col justify-start items-center gap-4">
        <div className="text-center">
          <h1 className="font-bold text-2xl">Woops!</h1>
          <p>Somthing went wrong.</p>
        </div>
      </div>
    </main>
  );
}
