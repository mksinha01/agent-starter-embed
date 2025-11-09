import ChatInterface from "@/components/ChatInterface";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="w-full max-w-4xl">
        <h1 className="text-4xl font-bold text-center mb-2 text-gray-800 dark:text-white">
          Voice AI Chat
        </h1>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
          Powered by Pipecat - Talk or type with AI
        </p>
        <ChatInterface />
      </div>
    </main>
  );
}
