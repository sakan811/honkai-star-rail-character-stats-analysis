"use client";


export default function DashboardPage() {
  return (
    <main className="max-w-2xl mx-auto p-6">
      <div className="mb-4">
        <a
          href="/"
          className="inline-block bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg px-4 py-2 transition-colors duration-200 text-sm shadow"
        >
          Back to Home
        </a>
      </div>
      
      <h1 className="text-2xl font-bold mb-6 text-center">Eidolon & Signature Light Cone Value Analysis</h1>
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Key Plots</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li><span className="font-semibold">Average Damage by Eidolon:</span> Shows total damage increase at each Eidolon level (E0 = 100%), highlighting which levels give the biggest boosts.</li>
          <li><span className="font-semibold">Damage per Pull Efficiency:</span> Reveals how efficiently each pull increases damage, helping you spot diminishing returns as you invest more.</li>
          <li><span className="font-semibold">Marginal Value of Each Eidolon:</span> Displays the extra damage gained per pull when moving to the next Eidolon, identifying the best value "sweet spots."</li>
        </ul>
        <h2 className="text-xl font-semibold mb-2 mt-6">Eidolon vs Signature Lightcone</h2>
        <ul className="list-disc pl-6 space-y-2 mt-4">
          <li><span className="font-semibold">Light Cone (LC) Analysis:</span> Compares the signature Light Cone’s impact to Eidolon upgrades, showing if the LC offers better value for your pulls.</li>
        </ul>
      </div>
      <p className="italic text-gray-500 mb-8">
        Note: These results are based on simulations; actual gameplay may vary with team, gear, and playstyle.
      </p>
      
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Character Dashboards</h2>
        <div className="flex justify-center">
          <a
            href="/anaxa"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg px-6 py-3 transition-colors duration-200 text-lg shadow"
          >
            Anaxa
          </a>
        </div>
      </div>
    </main>
  );
}

