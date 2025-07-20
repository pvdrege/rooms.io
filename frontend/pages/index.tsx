export default function HomePage() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      fontFamily: 'Arial, sans-serif'
    }}>
      {/* Navigation */}
      <nav style={{
        padding: '20px 40px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{
          fontSize: '28px',
          fontWeight: 'bold',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            background: 'white',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#667eea',
            fontWeight: 'bold',
            fontSize: '18px'
          }}>
            R
          </div>
          Rooms
        </div>
        
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          <a href="#" style={{ color: 'white', textDecoration: 'none' }}>
            Giriş Yap
          </a>
          <a href="#" style={{
            background: 'rgba(255,255,255,0.2)',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '8px',
            textDecoration: 'none',
            border: '1px solid rgba(255,255,255,0.3)'
          }}>
            Üye Ol
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <main style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '80px 40px',
        textAlign: 'center'
      }}>
        <h1 style={{
          fontSize: '4rem',
          fontWeight: 'bold',
          marginBottom: '30px',
          lineHeight: '1.1'
        }}>
          Profesyonel <br/>
          <span style={{
            background: 'linear-gradient(45deg, #fff, #f0f0f0)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Ağını Genişlet
          </span>
        </h1>
        
        <p style={{
          fontSize: '20px',
          marginBottom: '40px',
          opacity: '0.9',
          maxWidth: '600px',
          margin: '0 auto 40px',
          lineHeight: '1.6'
        }}>
          Yatırımcıları girişimcilerle, freelancerları müşterilerle, 
          mentorları öğrencilerle buluşturan platform. Ücretsiz ve etkili.
        </p>

        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '20px',
          marginBottom: '80px',
          flexWrap: 'wrap'
        }}>
          <a href="#" style={{
            background: 'white',
            color: '#667eea',
            padding: '16px 32px',
            borderRadius: '8px',
            textDecoration: 'none',
            fontWeight: 'bold',
            fontSize: '18px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
          }}>
            Hemen Başla
          </a>
          <a href="#" style={{
            background: 'transparent',
            color: 'white',
            padding: '16px 32px',
            borderRadius: '8px',
            textDecoration: 'none',
            fontWeight: 'bold',
            fontSize: '18px',
            border: '2px solid rgba(255,255,255,0.3)'
          }}>
            Profilleri Keşfet
          </a>
        </div>

        {/* Feature Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '30px',
          marginTop: '60px'
        }}>
          <div style={{
            background: 'rgba(255,255,255,0.1)',
            padding: '40px 30px',
            borderRadius: '12px',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.2)'
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              background: 'rgba(255,255,255,0.2)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              fontSize: '24px'
            }}>
              ⚡
            </div>
            <h3 style={{ fontSize: '22px', marginBottom: '15px' }}>
              Hızlı Eşleştirme
            </h3>
            <p style={{ opacity: '0.8', lineHeight: '1.5' }}>
              Hashtag sistemi ile ortak ilgi alanlarına sahip kişilerle anında bağlantı kur.
            </p>
          </div>

          <div style={{
            background: 'rgba(255,255,255,0.1)',
            padding: '40px 30px',
            borderRadius: '12px',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.2)'
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              background: 'rgba(255,255,255,0.2)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              fontSize: '24px'
            }}>
              💰
            </div>
            <h3 style={{ fontSize: '22px', marginBottom: '15px' }}>
              Tamamen Ücretsiz
            </h3>
            <p style={{ opacity: '0.8', lineHeight: '1.5' }}>
              Temel özellikler tamamen ücretsiz. Premium seçenekler ile daha fazla imkan.
            </p>
          </div>

          <div style={{
            background: 'rgba(255,255,255,0.1)',
            padding: '40px 30px',
            borderRadius: '12px',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.2)'
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              background: 'rgba(255,255,255,0.2)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              fontSize: '24px'
            }}>
              👥
            </div>
            <h3 style={{ fontSize: '22px', marginBottom: '15px' }}>
              Güvenilir Topluluk
            </h3>
            <p style={{ opacity: '0.8', lineHeight: '1.5' }}>
              Doğrulanmış profiller ve kaliteli bağlantılar ile güvenli networking deneyimi.
            </p>
          </div>
        </div>

        {/* Backend Status */}
        <div style={{
          marginTop: '80px',
          padding: '30px',
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '12px',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.2)'
        }}>
          <h3 style={{ marginBottom: '20px' }}>🚀 Platform Durumu</h3>
          <p style={{ marginBottom: '15px' }}>
            ✅ Backend API: Çalışıyor<br/>
            ✅ Veritabanı: 70+ hashtag hazır<br/>
            ✅ Real-time altyapı: Hazır<br/>
            ⏳ Frontend: Geliştiriliyor (Sprint 1 tamamlandı!)
          </p>
          <a 
            href="https://rooms-backend-wvte.onrender.com/api/hashtags" 
            target="_blank"
            style={{
              color: 'white',
              textDecoration: 'underline',
              opacity: '0.8'
            }}
          >
            Backend API Test Et →
          </a>
        </div>
      </main>
    </div>
  );
} 