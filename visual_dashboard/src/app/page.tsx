import Link from "next/link";

export default function Home() {
  return (
    <main className="max-w-2xl mx-auto py-12 px-4 sm:px-8 font-sans">
      <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-center">
        Honkai: Star Rail Eidolon and Signature Lightcone Value Analysis
      </h1>
      <p className="text-lg text-gray-700 dark:text-gray-300 mb-10 text-center">
        Analyze the value proposition of different Eidolon levels and signature lightcone for characters in Honkai: Star Rail, helping players make informed decisions about whether to pull for additional copies of characters or signature lightcone.
      </p>
      <div className="flex justify-center">
        <Link href="/dashboard">
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg px-8 py-3 text-lg shadow transition-colors duration-200">
            Dashboard
          </button>
        </Link>
      </div>
    </main>
  );
}
