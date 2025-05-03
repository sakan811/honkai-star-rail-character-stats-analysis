export default function CastoricePage() {
  return (
    <div className="flex flex-col items-center p-6 w-full h-full min-h-screen">
      <a
        href="/dashboard"
        className="self-start mb-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded px-4 py-2 transition-colors duration-200"
      >
        ← Back
      </a>
      <iframe
        className="w-[140vh] h-[80vh] border-0"
        src="https://lookerstudio.google.com/embed/reporting/fefde0c5-1e9b-4e79-a3ba-ba036ee2b827/page/9R4IF"
        allowFullScreen
        sandbox="allow-storage-access-by-user-activation allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
        title="Anaxa Looker Studio Dashboard"
      />
    </div>
  );
}

