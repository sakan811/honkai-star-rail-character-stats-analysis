export default function AnaxaPage() {
  return (
    <div className="flex flex-col items-center p-6 w-full h-full min-h-screen">
      <iframe
        className="w-full h-[80vh] border-0"
        src="https://lookerstudio.google.com/embed/reporting/d02f20cc-0710-4be7-87e2-ece693d00805/page/9R4IF"
        allowFullScreen
        sandbox="allow-storage-access-by-user-activation allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
        title="Anaxa Looker Studio Dashboard"
      />
    </div>
  );
}
