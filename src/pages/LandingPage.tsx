
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Phone, MessageCircle, Bot, PieChart, ArrowRight } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 to-purple-900/30"></div>
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500"></div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500"></div>
        
        {/* Grid background */}
        <div className="absolute inset-0" 
          style={{ 
            backgroundImage: 'linear-gradient(rgba(66, 71, 112, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(66, 71, 112, 0.1) 1px, transparent 1px)', 
            backgroundSize: '30px 30px',
            perspective: '1000px',
            transform: 'rotateX(60deg) scale(4) translateZ(-10px)',
            transformOrigin: 'center bottom',
            backgroundPosition: 'center center'
          }}>
        </div>
        
        {/* Animated glow orbs */}
        <div className="absolute -top-40 -left-20 w-96 h-96 bg-blue-500 rounded-full opacity-20 blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 -right-40 w-80 h-80 bg-purple-500 rounded-full opacity-20 blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute -bottom-40 left-1/3 w-80 h-80 bg-cyan-500 rounded-full opacity-20 blur-3xl animate-pulse" style={{ animationDelay: '3.5s' }}></div>
      </div>

      {/* Header */}
      <header className="relative z-10 px-6 py-4 flex justify-between items-center border-b border-gray-800/50 backdrop-blur-sm">
        <div className="flex items-center">
          <Bot className="w-8 h-8 text-blue-400 mr-2" />
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            AIConverse
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/auth" className="text-sm text-gray-300 hover:text-white transition">Masuk</Link>
          <Button 
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300"
            onClick={() => navigate('/auth')}
          >
            Mulai Sekarang
          </Button>
        </div>
      </header>

      {/* Hero section */}
      <main className="relative z-10">
        <section className="py-28 px-6 max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-5xl font-bold leading-tight">
                <span className="block">Layanan</span>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">Pelanggan AI</span>
                <span className="block">Mutakhir</span>
              </h2>
              <p className="text-xl text-gray-400 max-w-lg">
                Integrasikan WhatsApp dengan AI untuk memberikan pengalaman pelanggan yang luar biasa, terasa manusiawi, responsif secara instan, dan membangun hubungan jangka panjang.
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full px-8 py-6 hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300 text-lg">
                  Coba Gratis
                </Button>
                <Button variant="outline" className="rounded-full px-8 py-6 border-gray-700 hover:border-gray-500 text-lg">
                  Lihat Demo <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
              
              <div className="flex gap-8 pt-8">
                <div>
                  <p className="text-3xl font-bold text-blue-400">98%</p>
                  <p className="text-sm text-gray-400">Kepuasan pelanggan</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-blue-400">24/7</p>
                  <p className="text-sm text-gray-400">Layanan pelanggan</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-blue-400">5min</p>
                  <p className="text-sm text-gray-400">Waktu setup rata-rata</p>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur-2xl opacity-20"></div>
              <div className="relative bg-gray-900/80 backdrop-blur-sm p-6 border border-gray-800 rounded-2xl overflow-hidden shadow-xl">
                <div className="flex items-center gap-2 mb-6">
                  <div className="h-3 w-3 rounded-full bg-red-400"></div>
                  <div className="h-3 w-3 rounded-full bg-yellow-400"></div>
                  <div className="h-3 w-3 rounded-full bg-green-400"></div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex gap-4 items-start">
                    <div className="w-8 h-8 rounded-full bg-gray-700 flex-shrink-0"></div>
                    <div className="bg-gray-800 rounded-2xl rounded-tl-none p-3 text-sm">
                      Hai! Saya punya masalah dengan pesanan #45678. Bisakah Anda membantu?
                    </div>
                  </div>
                  
                  <div className="flex gap-4 items-start flex-row-reverse">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex-shrink-0 flex items-center justify-center">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                    <div className="bg-gradient-to-r from-blue-600/50 to-purple-600/50 backdrop-blur-sm rounded-2xl rounded-tr-none p-3 text-sm">
                      Halo! Maaf mendengar tentang masalah dengan pesanan #45678. Saya melihat bahwa paket Anda sedang dalam pengiriman dan dijadwalkan tiba besok. Apakah Anda ingin saya mengirimkan tautan pelacakan?
                    </div>
                  </div>
                  
                  <div className="flex gap-4 items-start">
                    <div className="w-8 h-8 rounded-full bg-gray-700 flex-shrink-0"></div>
                    <div className="bg-gray-800 rounded-2xl rounded-tl-none p-3 text-sm">
                      Ya, tolong! Itu akan sangat membantu.
                    </div>
                  </div>
                  
                  <div className="flex gap-4 items-start flex-row-reverse">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex-shrink-0 flex items-center justify-center">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                    <div className="bg-gradient-to-r from-blue-600/50 to-purple-600/50 backdrop-blur-sm rounded-2xl rounded-tr-none p-3 text-sm">
                      Berikut tautan pelacakan Anda: https://track.delivery/85f4e2
                      <br /><br />Ada hal lain yang bisa saya bantu hari ini?
                    </div>
                  </div>
                </div>
                
                {/* Glowing lines */}
                <div className="absolute top-0 left-10 w-[1px] h-full bg-gradient-to-b from-blue-500/0 via-blue-500/50 to-blue-500/0"></div>
                <div className="absolute top-32 right-12 w-[1px] h-32 bg-gradient-to-b from-purple-500/0 via-purple-500/50 to-purple-500/0"></div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Features */}
        <section className="py-24 px-6 max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 mb-4">
              Masa Depan Layanan Pelanggan
            </h2>
            <p className="text-gray-400">Integrasi WhatsApp berbasis AI kami memberikan layanan pelanggan yang personal, cerdas, dan skalabel sesuai dengan pertumbuhan bisnis Anda.</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Phone className="h-8 w-8 text-blue-400" />,
                title: "Integrasi WhatsApp",
                description: "Terhubung langsung dengan pelanggan melalui platform pesan favorit mereka tanpa aplikasi tambahan."
              },
              {
                icon: <Bot className="h-8 w-8 text-indigo-400" />,
                title: "Profil AI",
                description: "Buat profil AI yang disesuaikan dengan suara merek dan kebutuhan layanan pelanggan Anda."
              },
              {
                icon: <MessageCircle className="h-8 w-8 text-purple-400" />,
                title: "Template Pesan",
                description: "Hemat waktu dengan template pesan untuk pertanyaan umum sambil tetap mempertahankan sentuhan personal."
              },
              {
                icon: <Bot className="h-8 w-8 text-cyan-400" />,
                title: "Pelatihan Pengetahuan",
                description: "Latih AI dengan pengetahuan perusahaan untuk memberikan informasi yang akurat dan konsisten kepada pelanggan."
              },
              {
                icon: <PieChart className="h-8 w-8 text-pink-400" />,
                title: "Dashboard Analitik",
                description: "Dapatkan wawasan tentang interaksi pelanggan dengan analitik komprehensif dan metrik kinerja."
              },
              {
                icon: <MessageCircle className="h-8 w-8 text-blue-400" />,
                title: "Dukungan Suara",
                description: "Tawarkan percakapan suara alami yang didukung oleh ElevenLabs untuk pengalaman pelanggan yang lebih baik."
              }
            ].map((feature, index) => (
              <div key={index} className="group p-6 bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10">
                <div className="p-3 bg-gray-800/50 rounded-lg w-fit mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-3 text-white group-hover:text-blue-400 transition-colors">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>
        
        {/* CTA */}
        <section className="py-20 px-6 max-w-5xl mx-auto">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/30 to-purple-600/30 rounded-2xl blur-xl"></div>
            <div className="relative bg-gray-900/70 backdrop-blur-md p-12 rounded-2xl border border-gray-800">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h2 className="text-3xl font-bold mb-4">Siap mengubah layanan pelanggan Anda?</h2>
                  <p className="text-gray-400 mb-6">Mulai bangun hubungan pelanggan yang lebih kuat dengan percakapan berbasis AI hari ini.</p>
                  <Button 
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full px-8 py-6 hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300 text-lg"
                    onClick={() => navigate('/auth')}
                  >
                    Mulai Sekarang
                  </Button>
                </div>
                <div className="hidden md:block relative">
                  <div className="absolute w-20 h-20 rounded-full bg-blue-500/30 blur-xl -top-10 -left-10 animate-pulse"></div>
                  <div className="absolute w-24 h-24 rounded-full bg-purple-500/30 blur-xl -bottom-10 -right-10 animate-pulse" style={{ animationDelay: '1s' }}></div>
                  <div className="bg-gray-800/80 backdrop-blur-sm p-6 rounded-xl border border-gray-700 shadow-xl">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-400">Total Percakapan</h4>
                        <p className="text-2xl font-bold text-white">3.257</p>
                      </div>
                      <div className="bg-gradient-to-r from-blue-500/20 to-blue-500/10 p-3 rounded-lg">
                        <MessageCircle className="h-6 w-6 text-blue-400" />
                      </div>
                    </div>
                    <div className="h-2 w-full bg-gray-700 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 w-3/4 rounded-full"></div>
                    </div>
                    <div className="flex justify-between mt-2 text-xs">
                      <span className="text-gray-500">0</span>
                      <span className="text-blue-400">75%</span>
                      <span className="text-gray-500">100%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="relative z-10 py-10 px-6 border-t border-gray-800/50 backdrop-blur-sm mt-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-6 md:mb-0">
            <Bot className="w-6 h-6 text-blue-400 mr-2" />
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
              AIConverse
            </h1>
          </div>
          <div className="flex gap-6 text-sm text-gray-400">
            <Link to="/" className="hover:text-white transition">Beranda</Link>
            <Link to="/auth" className="hover:text-white transition">Masuk</Link>
            <Link to="/manual" className="hover:text-white transition">Manual</Link>
            <Link to="/contact" className="hover:text-white transition">Kontak</Link>
          </div>
          <div className="mt-6 md:mt-0 text-sm text-gray-500">
            &copy; 2025 AIConverse. Hak Cipta Dilindungi.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
