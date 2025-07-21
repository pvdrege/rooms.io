import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { User } from '../../types';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  user?: User | null;
}

export default function Layout({ children, title = 'Rooms - Professional Networking', user }: LayoutProps) {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="Professional networking platform connecting investors, entrepreneurs, freelancers, and mentors" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Navigation */}
        <nav className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <div 
                  className="flex items-center cursor-pointer"
                  onClick={() => router.push('/')}
                >
                  <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                    R
                  </div>
                  <span className="ml-2 text-xl font-bold text-gray-900">Rooms</span>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                {user ? (
                  <>
                    <button
                      onClick={() => router.push('/discovery')}
                      className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium"
                    >
                      Keşfet
                    </button>
                    <button
                      onClick={() => router.push('/profile')}
                      className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium"
                    >
                      Profil
                    </button>
                    <button
                      onClick={() => router.push('/connections')}
                      className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium"
                    >
                      Bağlantılar
                    </button>
                    <div className="flex items-center space-x-2">
                      {user.pictureUrl ? (
                        <img
                          src={user.pictureUrl}
                          alt={user.name}
                          className="w-8 h-8 rounded-full"
                        />
                      ) : (
                        <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                          <span className="text-primary-600 font-medium text-sm">
                            {user.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => router.push('/login')}
                      className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium"
                    >
                      Giriş Yap
                    </button>
                    <button
                      onClick={() => router.push('/register')}
                      className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                    >
                      Üye Ol
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </nav>

        {/* Main content */}
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </>
  );
} 