import Link from "next/link";

export default function Home() {
  return (
    <main className="max-w-2xl mx-auto py-12 px-4 sm:px-8 font-sans">
      <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-center">
        Honkai: Star Rail Eidolon and Signature Lightcone Value Analysis
      </h1>
      <p className="text-lg text-gray-700 dark:text-gray-300 mb-10 text-center">
        Analyze the value proposition of different Eidolon levels and signature
        lightcone for characters in Honkai: Star Rail, helping players make
        informed decisions about whether to pull for additional copies of
        characters or signature lightcone.
      </p>
      <div className="flex justify-center">
        <Link href="/dashboard">
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg px-8 py-3 text-lg shadow transition-colors duration-200">
            Dashboard
          </button>
        </Link>
      </div>
      <h2 className="text-2xl font-bold mb-6 text-center mt-8">
        Eidolon & Signature Light Cone Value Analysis
      </h2>
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Key Plots</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <span className="font-semibold">Average Damage by Eidolon:</span>{" "}
            Shows total damage increase at each Eidolon level (E0 = 100%),
            highlighting which levels give the biggest boosts.
          </li>
          <li>
            <span className="font-semibold">Damage per Pull Efficiency:</span>{" "}
            Reveals how efficiently each pull increases damage, helping you spot
            diminishing returns as you invest more.
          </li>
          <li>
            <span className="font-semibold">
              Marginal Value of Each Eidolon:
            </span>{" "}
            Displays the extra damage gained per pull when moving to the next
            Eidolon, identifying the best value &quot;sweet spots.&quot;
          </li>
        </ul>
        <h2 className="text-xl font-semibold mb-2 mt-6">
          Eidolon vs Signature Lightcone
        </h2>
        <ul className="list-disc pl-6 space-y-2 mt-4">
          <li>
            <span className="font-semibold">Light Cone (LC) Analysis:</span>{" "}
            Compares the signature Light Cone’s impact to Eidolon upgrades,
            showing if the LC offers better value for your pulls.
          </li>
        </ul>
      </div>
      <p className="italic text-gray-500 mb-8">
        Note: These results are based on simulations; actual gameplay may vary
        with team, gear, and playstyle.
      </p>
    </main>
  );
}
