// src/app/page.tsx
export default function HomePage() {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-6xl font-bold text-slate-900 mb-6">
              Welcome to <span className="text-indigo-600">Inertia</span>
            </h1>
            <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto">
              Transform your Beyblade training with precision measurement, consistent practice, 
              and objective competition verification. The future of competitive Beyblade is data-driven.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/products" 
                className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
              >
                Explore Products
              </a>
              <a 
                href="/technology" 
                className="border border-indigo-600 text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-indigo-50 transition-colors"
              >
                Learn Technology
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Products Preview */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-16 text-slate-900">
            The Inertia Ecosystem
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-xl">
              <div className="w-16 h-16 bg-blue-500 rounded-lg flex items-center justify-center mb-6">
                <span className="text-white text-2xl font-bold">I</span>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-slate-900">Insight</h3>
              <p className="text-slate-600 mb-6">
                Advanced Beyblade performance analytics and training insights. 
                Measure launch angle, RPM, and consistency to perfect your technique.
              </p>
              <a href="/products/insight" className="text-blue-600 font-semibold hover:text-blue-700">
                Learn more →
              </a>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-xl">
              <div className="w-16 h-16 bg-green-500 rounded-lg flex items-center justify-center mb-6">
                <span className="text-white text-2xl font-bold">C</span>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-slate-900">Catalyst</h3>
              <p className="text-slate-600 mb-6">
                Programmable launching system for consistent training and strategy testing. 
                Practice against repeatable, precise launches.
              </p>
              <a href="/products/catalyst" className="text-green-600 font-semibold hover:text-green-700">
                Learn more →
              </a>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-8 rounded-xl">
              <div className="w-16 h-16 bg-purple-500 rounded-lg flex items-center justify-center mb-6">
                <span className="text-white text-2xl font-bold">A</span>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-slate-900">Axis</h3>
              <p className="text-slate-600 mb-6">
                Machine vision system for objective battle analysis and verification. 
                Eliminate disputes with automated, accurate judging.
              </p>
              <a href="/products/axis" className="text-purple-600 font-semibold hover:text-purple-700">
                Learn more →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-slate-900">
              Why Choose Inertia?
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Transform intuition into knowledge with scientific measurement and analysis.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-indigo-600 text-2xl">📊</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Objective Measurement</h3>
              <p className="text-slate-600">Replace guesswork with precise data</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-green-600 text-2xl">🎯</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Consistent Training</h3>
              <p className="text-slate-600">Accelerate improvement with repeatable practice</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-purple-600 text-2xl">✅</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Verified Competition</h3>
              <p className="text-slate-600">Ensure fair play with automated judging</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 text-2xl">🌐</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Global Community</h3>
              <p className="text-slate-600">Connect with players worldwide</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}