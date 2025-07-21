import React from 'react';
import { useRouter } from 'next/router';
import { Toaster } from 'react-hot-toast';

export default function HomePage() {
  const router = useRouter();

  return (
    <>
      <Toaster position="top-right" />
      <div className="min-h-screen bg-gradient-to-br from-primary-600 to-primary-800">
        {/* Navigation */}
        <nav className="px-4 sm:px-6 lg:px-8 py-6">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <span className="text-primary-600 font-bold text-xl">R</span>
              </div>
              <span className="text-2xl font-bold text-white">Rooms</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/login')}
                className="text-white hover:text-primary-200 transition-colors"
              >
                Giriş Yap
              </button>
              <button
                onClick={() => router.push('/register')}
                className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-6 py-2 rounded-lg border border-white border-opacity-30 transition-all"
              >
                Üye Ol
              </button>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-8 leading-tight">
              Profesyonel <br/>
              <span className="bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
                Ağını Genişlet
              </span>
            </h1>
            
            <p className="text-xl text-white text-opacity-90 max-w-3xl mx-auto mb-12 leading-relaxed">
              Yatırımcıları girişimcilerle, freelancerları müşterilerle, 
              mentorları öğrencilerle buluşturan platform. Ücretsiz ve etkili.
            </p>

            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6 mb-20">
              <button
                onClick={() => router.push('/register')}
                className="bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
              >
                Hemen Başla
              </button>
              <button
                onClick={() => router.push('/discovery')}
                className="border-2 border-white border-opacity-30 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:bg-opacity-10 transition-all"
              >
                Profilleri Keşfet
              </button>
            </div>

            {/* Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-8 border border-white border-opacity-20">
                <div className="w-16 h-16 bg-white bg-opacity-20 rounded-xl flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl">⚡</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">
                  Hızlı Eşleştirme
                </h3>
                <p className="text-white text-opacity-80 leading-relaxed">
                  Hashtag sistemi ile ortak ilgi alanlarına sahip kişilerle anında bağlantı kur.
                </p>
              </div>

              <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-8 border border-white border-opacity-20">
                <div className="w-16 h-16 bg-white bg-opacity-20 rounded-xl flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl">💰</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">
                  Tamamen Ücretsiz
                </h3>
                <p className="text-white text-opacity-80 leading-relaxed">
                  Temel özellikler tamamen ücretsiz. Premium seçenekler ile daha fazla imkan.
                </p>
              </div>

              <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-8 border border-white border-opacity-20">
                <div className="w-16 h-16 bg-white bg-opacity-20 rounded-xl flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl">👥</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">
                  Güvenilir Topluluk
                </h3>
                <p className="text-white text-opacity-80 leading-relaxed">
                  Doğrulanmış profiller ve kaliteli bağlantılar ile güvenli networking deneyimi.
                </p>
              </div>
            </div>

            {/* Backend Status */}
            <div className="mt-20 bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-8 border border-white border-opacity-20 max-w-2xl mx-auto">
              <h3 className="text-xl font-semibold text-white mb-6">🚀 Platform Durumu</h3>
              <div className="space-y-3 text-white text-opacity-90">
                <p>✅ Backend API: Çalışıyor</p>
                <p>✅ Veritabanı: 70+ hashtag hazır</p>
                <p>✅ Real-time altyapı: Hazır</p>
                <p>✅ Frontend: Modern UI ile güncellendi!</p>
              </div>
              <a 
                href="https://rooms-backend-wvte.onrender.com/api/hashtags" 
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-4 text-primary-200 hover:text-white underline transition-colors"
              >
                Backend API Test Et →
              </a>
            </div>
          </div>
        </main>
      </div>
    </>
  );
} 