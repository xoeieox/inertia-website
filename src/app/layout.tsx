// src/app/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Link from 'next/link'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Inertia - Data-Driven Beyblade Performance',
  description: 'Transform your Beyblade training with precision measurement, consistent practice, and objective competition verification.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <nav className="bg-slate-900 text-white shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <h1 className="text-2xl font-bold">Inertia</h1>
                </div>
                <div className="hidden md:block">
                  <div className="ml-10 flex items-baseline space-x-4">
                    <Link href="/" className="hover:bg-slate-700 px-3 py-2 rounded-md text-sm font-medium">
                      Home
                    </Link>
                    <Link href="/products" className="hover:bg-slate-700 px-3 py-2 rounded-md text-sm font-medium">
                      Products
                    </Link>
                    <Link href="/technology" className="hover:bg-slate-700 px-3 py-2 rounded-md text-sm font-medium">
                      Technology
                    </Link>
                    <Link href="/about" className="hover:bg-slate-700 px-3 py-2 rounded-md text-sm font-medium">
                      About
                    </Link>
                    <Link href="/blog" className="hover:bg-slate-700 px-3 py-2 rounded-md text-sm font-medium">
                      Blog
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </nav>
        
        <main className="min-h-screen bg-white">
          {children}
        </main>
        
        <footer className="bg-slate-900 text-white">
          <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">Inertia Ecosystem</h3>
                <p className="text-slate-300">
                  Transforming Beyblade through data-driven performance analysis and training.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Products</h3>
                <ul className="text-slate-300 space-y-2">
                  <li><Link href="/products/insight" className="hover:text-white">Insight</Link></li>
                  <li><Link href="/products/catalyst" className="hover:text-white">Catalyst</Link></li>
                  <li><Link href="/products/axis" className="hover:text-white">Axis</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Connect</h3>
                <ul className="text-slate-300 space-y-2">
                  <li><Link href="/about" className="hover:text-white">About</Link></li>
                  <li><Link href="/blog" className="hover:text-white">Blog</Link></li>
                  <li><a href="https://github.com" className="hover:text-white">GitHub</a></li>
                </ul>
              </div>
            </div>
            <div className="mt-8 pt-8 border-t border-slate-700 text-center text-slate-300">
              <p>&copy; 2025 Inertia. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}