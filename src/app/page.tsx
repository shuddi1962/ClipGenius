export default function Home() {
  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Roshanal Smart Marketing & Content Generator
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          AI-powered marketing content and video generator
        </p>
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          ✅ Deployment Successful! The app is now working on Vercel.
        </div>
        <p className="text-sm text-gray-500">
          Build completed at: {new Date().toLocaleString()}
        </p>
      </div>
    </div>
  )
}