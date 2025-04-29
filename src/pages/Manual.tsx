import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Bot, ChevronLeft, MessageSquare, Settings, Users, FileText, BookOpen, Sparkles } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';

const Manual = () => {
  const { setShowAuthDialog } = useAuth();

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-purple-900/20"></div>
        <div className="absolute inset-0" 
          style={{ 
            backgroundImage: 'linear-gradient(rgba(66, 71, 112, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(66, 71, 112, 0.05) 1px, transparent 1px)', 
            backgroundSize: '50px 50px',
            perspective: '1000px',
            transform: 'rotateX(60deg) scale(4) translateZ(-10px)',
            transformOrigin: 'center bottom',
            backgroundPosition: 'center center'
          }}>
        </div>
        <div className="absolute -top-40 -left-20 w-96 h-96 bg-blue-500 rounded-full opacity-05 blur-2xl animate-pulse"></div>
        <div className="absolute -bottom-40 right-20 w-96 h-96 bg-purple-500 rounded-full opacity-05 blur-2xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Header */}
      <header className="relative z-10 px-6 py-4 flex justify-between items-center border-b border-gray-800/50 backdrop-blur-sm">
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <Bot className="w-8 h-8 text-blue-400 mr-2" />
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
              AIConverse
            </h1>
          </Link>
        </div>
        <div className="flex items-center gap-4">
        </div>
      </header>

      {/* Main content */}
      <main className="relative z-10 max-w-7xl mx-auto py-12 px-6">
        <div className="flex items-center mb-8">
          <Link to="/dashboard">
            <Button variant="outline" size="sm" className="mr-4 border-gray-600 hover:border-gray-500 text-blue-900 hover:text-black">
              <ChevronLeft className="h-4 w-4 mr-1" /> Kembali
            </Button>
          </Link>
          <h1 className="text-3xl font-bold flex items-center">
            <BookOpen className="h-6 w-6 mr-2 text-blue-400" />
            Manual Pengguna
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <Card className="bg-gray-900/90 border-gray-600 sticky top-6">
              <CardHeader>
                <CardTitle className="text-xl text-white font-semibold">Daftar Isi</CardTitle>
                <CardDescription className="text-gray-300">Panduan penggunaan AIConverse</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-base">
                  <li>
                    <a href="#intro" className="flex items-center text-blue-300 hover:text-blue-200">
                      <Bot className="h-4 w-4 mr-2" />
                      Pengenalan
                    </a>
                  </li>
                  <li>
                    <a href="#whatsapp" className="flex items-center text-blue-300 hover:text-blue-200">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Integrasi WhatsApp
                    </a>
                  </li>
                  <li>
                    <a href="#ai-profiles" className="flex items-center text-blue-300 hover:text-blue-200">
                      <Sparkles className="h-4 w-4 mr-2" />
                      Profil AI
                    </a>
                  </li>
                  <li>
                    <a href="#contacts" className="flex items-center text-blue-300 hover:text-blue-200">
                      <Users className="h-4 w-4 mr-2" />
                      Kontak
                    </a>
                  </li>
                  <li>
                    <a href="#templates" className="flex items-center text-blue-300 hover:text-blue-200">
                      <FileText className="h-4 w-4 mr-2" />
                      Template
                    </a>
                  </li>
                  <li>
                    <a href="#settings" className="flex items-center text-blue-300 hover:text-blue-200">
                      <Settings className="h-4 w-4 mr-2" />
                      Pengaturan
                    </a>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2 space-y-8">
            <section id="intro" className="scroll-mt-16">
              <Card className="bg-gray-900/90 border-gray-600">
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center text-white font-semibold">
                    <Bot className="h-5 w-5 mr-2 text-blue-400" />
                    Pengenalan
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-base text-gray-200">
                  <p>
                    AIConverse adalah aplikasi yang menghubungkan WhatsApp dengan kecerdasan buatan untuk memberikan
                    pengalaman layanan pelanggan yang luar biasa. Platform ini memungkinkan Anda untuk membuat profil AI
                    dengan kepribadian kustom dan mengotomatisasi percakapan dengan pelanggan.
                  </p>
                  <p>
                    Dengan AIConverse, Anda dapat:
                  </p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Menghubungkan WhatsApp Business API dengan AI</li>
                    <li>Membuat profil AI dengan kepribadian yang disesuaikan dengan brand Anda</li>
                    <li>Menggunakan model AI dari OpenAI atau Google Gemini</li>
                    <li>Menyiapkan template pesan untuk pertanyaan umum</li>
                    <li>Mengelola kontak dan percakapan dengan pelanggan</li>
                    <li>Melihat analitik performa layanan pelanggan</li>
                  </ul>
                </CardContent>
              </Card>
            </section>

            <section id="whatsapp" className="scroll-mt-16">
              <Card className="bg-gray-900/90 border-gray-600">
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center text-white font-semibold">
                    <MessageSquare className="h-5 w-5 mr-2 text-blue-400" />
                    Integrasi WhatsApp
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-base text-gray-200">
                  <p>
                    Untuk mengintegrasikan WhatsApp dengan AIConverse, Anda perlu:
                  </p>
                  
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1" className="border-gray-600">
                      <AccordionTrigger className="text-blue-300 hover:text-blue-200">1. Buat Akun WhatsApp Business</AccordionTrigger>
                      <AccordionContent className="text-gray-200">
                        <ol className="list-decimal pl-5 space-y-2">
                          <li>Kunjungi <a href="https://business.facebook.com" className="text-blue-300 hover:text-blue-200 underline">Meta Business Suite</a></li>
                          <li>Daftar dan buat akun bisnis</li>
                          <li>Verifikasi bisnis Anda melalui proses yang disediakan Meta</li>
                        </ol>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-2" className="border-gray-600">
                      <AccordionTrigger className="text-blue-300 hover:text-blue-200">2. Dapatkan Akses WhatsApp Business API</AccordionTrigger>
                      <AccordionContent className="text-gray-200">
                        <ol className="list-decimal pl-5 space-y-2">
                          <li>Pilih Business Solution Provider (BSP) atau gunakan hosting sendiri</li>
                          <li>Ikuti panduan integrasi dari Meta untuk WhatsApp Business API</li>
                          <li>Dapatkan kunci API dan kredensial yang diperlukan</li>
                        </ol>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-3" className="border-gray-600">
                      <AccordionTrigger className="text-blue-300 hover:text-blue-200">3. Konfigurasikan di AIConverse</AccordionTrigger>
                      <AccordionContent className="text-gray-200">
                        <ol className="list-decimal pl-5 space-y-2">
                          <li>Buka menu "Pengaturan" di AIConverse</li>
                          <li>Pilih tab "WhatsApp"</li>
                          <li>Masukkan kunci API dan kredensial yang diperlukan</li>
                          <li>Verifikasi koneksi dengan mengklik "Test Koneksi"</li>
                          <li>Simpan pengaturan dan aktifkan integrasi</li>
                        </ol>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>
            </section>

            <section id="ai-profiles" className="scroll-mt-16">
              <Card className="bg-gray-900/90 border-gray-600">
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center text-white font-semibold">
                    <Sparkles className="h-5 w-5 mr-2 text-blue-400" />
                    Profil AI
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-base text-gray-200">
                  <p>
                    Profil AI adalah kepribadian buatan yang akan berinteraksi dengan pelanggan Anda. Setiap profil memiliki
                    karakteristik dan perilaku yang dapat disesuaikan.
                  </p>

                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1" className="border-gray-600">
                      <AccordionTrigger className="text-blue-300 hover:text-blue-200">Cara Membuat Profil AI</AccordionTrigger>
                      <AccordionContent className="text-gray-200">
                        <ol className="list-decimal pl-5 space-y-2">
                          <li>Buka halaman "Profil AI" di dashboard</li>
                          <li>Klik tombol "Buat Profil AI"</li>
                          <li>Isi nama dan deskripsi profil</li>
                          <li>Pilih model AI (OpenAI GPT atau Google Gemini)</li>
                          <li>Tulis prompt sistem yang menjelaskan kepribadian, pengetahuan, dan cara berinteraksi AI</li>
                          <li>Klik "Buat Profil" untuk menyimpan</li>
                        </ol>
                        <div className="mt-4 p-3 bg-blue-900/20 rounded-lg">
                          <p className="text-sm font-medium">Contoh Prompt Sistem:</p>
                          <p className="text-xs text-gray-300 mt-1">
                            "Anda adalah asisten layanan pelanggan bernama Maya untuk toko online 'FashionKita'. Anda selalu ramah,
                            membantu, dan berbicara dengan bahasa Indonesia yang santai tapi profesional. Anda memiliki pengetahuan
                            tentang kebijakan pengembalian, pengiriman, dan produk fashion kami. Selalu tanggapi pertanyaan dengan
                            informasi yang akurat dan tunjukkan empati pada masalah pelanggan."
                          </p>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-2" className="border-gray-600">
                      <AccordionTrigger className="text-blue-300 hover:text-blue-200">Tips Membuat Prompt yang Efektif</AccordionTrigger>
                      <AccordionContent className="text-gray-200">
                        <ul className="list-disc pl-5 space-y-2">
                          <li>Berikan identitas yang jelas (nama, peran) untuk AI</li>
                          <li>Tentukan nada dan gaya bahasa yang diinginkan</li>
                          <li>Sertakan pengetahuan spesifik tentang bisnis Anda</li>
                          <li>Tetapkan batasan tentang apa yang boleh dan tidak boleh dikatakan</li>
                          <li>Berikan contoh cara menanggapi situasi umum</li>
                          <li>Jika menggunakan model Google Gemini, perhatikan bahwa responsnya mungkin berbeda dari OpenAI</li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>
            </section>

            <section id="contacts" className="scroll-mt-16">
              <Card className="bg-gray-900/90 border-gray-600">
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center text-white font-semibold">
                    <Users className="h-5 w-5 mr-2 text-blue-400" />
                    Kontak
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-base text-gray-200">
                  <p className="mb-4">
                    Kelola semua kontak pelanggan yang berkomunikasi dengan bisnis Anda melalui WhatsApp.
                  </p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Kontak secara otomatis ditambahkan ketika pelanggan baru menghubungi Anda</li>
                    <li>Tambahkan tag untuk mengkategorikan kontak</li>
                    <li>Lihat riwayat percakapan dengan setiap kontak</li>
                    <li>Tambahkan catatan dan informasi tambahan pada profil kontak</li>
                  </ul>
                </CardContent>
              </Card>
            </section>

            <section id="templates" className="scroll-mt-16">
              <Card className="bg-gray-900/90 border-gray-600">
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center text-white font-semibold">
                    <FileText className="h-5 w-5 mr-2 text-blue-400" />
                    Template
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-base text-gray-200">
                  <p className="mb-4">
                    Template memungkinkan Anda membuat respon standar yang dapat digunakan berulang kali.
                  </p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Buat template untuk pertanyaan dan situasi yang sering terjadi</li>
                    <li>Gunakan variabel seperti [nama_pelanggan] untuk personalisasi</li>
                    <li>Kategorikan template dengan tag</li>
                    <li>Template dapat dipilih saat berinteraksi dengan pelanggan</li>
                  </ul>
                </CardContent>
              </Card>
            </section>

            <section id="settings" className="scroll-mt-16">
              <Card className="bg-gray-900/90 border-gray-600">
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center text-white font-semibold">
                    <Settings className="h-5 w-5 mr-2 text-blue-400" />
                    Pengaturan
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-base text-gray-200">
                  <p className="mb-4">
                    Konfigurasikan AIConverse sesuai dengan kebutuhan Anda.
                  </p>

                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1" className="border-gray-600">
                      <AccordionTrigger className="text-blue-300 hover:text-blue-200">Kunci API AI</AccordionTrigger>
                      <AccordionContent className="text-gray-200">
                        <p className="mb-2">Untuk menggunakan model AI, Anda perlu menambahkan kunci API:</p>
                        <ul className="list-disc pl-5 space-y-2">
                          <li>OpenAI: Dapatkan kunci API dari <a href="https://platform.openai.com/api-keys" className="text-blue-300 hover:text-blue-200 underline">platform.openai.com</a></li>
                          <li>Google Gemini: Dapatkan kunci API dari <a href="https://aistudio.google.com/app/apikey" className="text-blue-300 hover:text-blue-200 underline">Google AI Studio</a></li>
                          <li>Tambahkan kunci API di halaman Pengaturan</li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-2" className="border-gray-600">
                      <AccordionTrigger className="text-blue-300 hover:text-blue-200">Bahasa Aplikasi</AccordionTrigger>
                      <AccordionContent className="text-gray-200">
                        <ul className="list-disc pl-5 space-y-2">
                          <li>AIConverse mendukung bahasa Indonesia sebagai default</li>
                          <li>Anda dapat mengubah bahasa melalui menu Pengaturan</li>
                          <li>Pengaturan bahasa akan mempengaruhi antarmuka pengguna</li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-3" className="border-gray-600">
                      <AccordionTrigger className="text-blue-300 hover:text-blue-200">Notifikasi</AccordionTrigger>
                      <AccordionContent className="text-gray-200">
                        <ul className="list-disc pl-5 space-y-2">
                          <li>Aktifkan atau nonaktifkan notifikasi</li>
                          <li>Konfigurasikan jenis notifikasi yang ingin Anda terima</li>
                          <li>Atur preferensi notifikasi untuk pesan baru, respons AI, dll.</li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>
            </section>
          </div>
        </div>
      </main>

      <footer className="relative z-10 py-8 px-6 border-t border-gray-800/50 backdrop-blur-sm mt-12">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-sm text-gray-400">
            © 2025 Hoed - AIConverse. Semua hak dilindungi.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Manual;