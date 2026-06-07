// AI Service for PMB Chatbot and Recommendations
// Using mock responses - ready for OpenAI integration

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface ChatSession {
  id: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

// PMB Context - Information about the admission process
const PMB_CONTEXT = `
Anda adalah asisten PMB (Penerimaan Mahasiswa Baru) yang membantu calon mahasiswa dengan:
1. Informasi program studi dan jalur masuk
2. Persyaratan pendaftaran dan dokumen yang diperlukan
3. Jadwal dan gelombang pendaftaran
4. Proses verifikasi dan ujian
5. Status pendaftaran dan hasil seleksi

Berikan jawaban yang ramah, jelas, dan informatif dalam Bahasa Indonesia.
`;

// Mock PMB Knowledge Base
const PMB_KNOWLEDGE = {
  programs: [
    {
      name: 'Teknik Informatika',
      faculty: 'Teknik',
      description: 'Program studi yang fokus pada pengembangan software dan sistem informasi',
      requirements: 'Nilai rata-rata minimal 7.5, Nilai Matematika minimal 8.0',
      quota: 120,
    },
    {
      name: 'Manajemen Bisnis',
      faculty: 'Ekonomi dan Bisnis',
      description: 'Program studi untuk mengembangkan kompetensi manajemen bisnis modern',
      requirements: 'Nilai rata-rata minimal 7.0, Nilai Bahasa Indonesia minimal 7.5',
      quota: 100,
    },
    {
      name: 'Kedokteran',
      faculty: 'Kesehatan',
      description: 'Program studi kedokteran dengan fokus pada pelayanan kesehatan berkualitas',
      requirements: 'Nilai rata-rata minimal 8.5, Nilai Biologi dan Kimia minimal 8.5',
      quota: 80,
    },
    {
      name: 'Hukum',
      faculty: 'Hukum',
      description: 'Program studi hukum untuk menghasilkan legal professional',
      requirements: 'Nilai rata-rata minimal 7.5, Nilai Bahasa Indonesia minimal 8.0',
      quota: 90,
    },
    {
      name: 'Pendidikan Matematika',
      faculty: 'Pendidikan',
      description: 'Program studi untuk mencetak pendidik matematika profesional',
      requirements: 'Nilai rata-rata minimal 7.5, Nilai Matematika minimal 9.0',
      quota: 60,
    },
  ],
  entryRoutes: [
    { name: 'SNBP', description: 'Seleksi Nasional Berbasis Prestasi - Tidak ada ujian tulis' },
    { name: 'SNBT', description: 'Seleksi Nasional Berbasis Tes - Ujian tulis online' },
    { name: 'Mandiri', description: 'Jalur mandiri dengan ujian dan interview' },
    { name: 'Prestasi', description: 'Jalur khusus untuk peserta berprestasi' },
  ],
  timeline: {
    wave1: { start: '2024-01-15', end: '2024-02-15', name: 'Gelombang 1' },
    wave2: { start: '2024-02-20', end: '2024-03-20', name: 'Gelombang 2' },
    wave3: { start: '2024-03-25', end: '2024-04-25', name: 'Gelombang 3' },
  },
};

// Mock AI Response Generator
function generateMockResponse(userMessage: string): string {
  const lowerMessage = userMessage.toLowerCase();

  // Program-related questions
  if (
    lowerMessage.includes('program') ||
    lowerMessage.includes('prodi') ||
    lowerMessage.includes('studi')
  ) {
    return `Program studi yang kami tawarkan meliputi:\n\n${PMB_KNOWLEDGE.programs
      .map((p) => `• ${p.name} (${p.faculty})\n  ${p.description}`)
      .join('\n\n')}\n\nApa program studi yang Anda minati?`;
  }

  // Jalur Masuk questions
  if (lowerMessage.includes('jalur') || lowerMessage.includes('masuk')) {
    return `Kami menyediakan beberapa jalur masuk:\n\n${PMB_KNOWLEDGE.entryRoutes
      .map((r) => `• ${r.name}\n  ${r.description}`)
      .join('\n\n')}\n\nJalur mana yang Anda pilih?`;
  }

  // Requirements questions
  if (lowerMessage.includes('syarat') || lowerMessage.includes('persyaratan')) {
    return `Persyaratan pendaftaran umum meliputi:\n• Ijazah asli atau transkrip nilai\n• Fotokopi KTP/KK\n• Pas foto 4x6 (2 lembar)\n• Surat keterangan tidak buta warna (untuk program tertentu)\n• Sertifikat vaksinasi\n\nSetiap program studi mungkin memiliki persyaratan tambahan. Program apa yang Anda tanyakan?`;
  }

  // Jadwal questions
  if (
    lowerMessage.includes('jadwal') ||
    lowerMessage.includes('tanggal') ||
    lowerMessage.includes('gelombang') ||
    lowerMessage.includes('pendaftaran')
  ) {
    return `Jadwal pendaftaran kami:\n\n• Gelombang 1: 15 Januari - 15 Februari 2024\n• Gelombang 2: 20 Februari - 20 Maret 2024\n• Gelombang 3: 25 Maret - 25 April 2024\n\nUjian akan dilaksanakan sesuai dengan gelombang pendaftaran masing-masing.`;
  }

  // Ujian questions
  if (lowerMessage.includes('ujian') || lowerMessage.includes('tes')) {
    return `Proses ujian kami:\n\n1. SNBP: Tidak ada ujian tulis, hanya review prestasi akademik\n2. SNBT: Ujian online meliputi TPS (Tes Potensi Skolastik) dan TPA\n3. Jalur Mandiri: Ujian tulis + wawancara\n4. Jalur Prestasi: Interview dan presentasi prestasi\n\nJalur mana yang Anda minati? Saya dapat memberikan detail lebih lanjut.`;
  }

  // Verifikasi questions
  if (lowerMessage.includes('verifikasi') || lowerMessage.includes('dokumen')) {
    return `Proses verifikasi dokumen:\n\n1. Upload dokumen melalui portal\n2. Verifikasi dilakukan dalam 3-5 hari kerja\n3. Jika ada kekurangan, akan diberitahu via email\n4. Setelah lengkap, dokumen diterima\n\nDokumen apa yang ingin Anda verifikasi?`;
  }

  // Status questions
  if (lowerMessage.includes('status') || lowerMessage.includes('hasil')) {
    return `Untuk melihat status pendaftaran Anda:\n\n1. Login ke portal kami dengan akun Anda\n2. Buka menu "Status Pendaftaran"\n3. Anda dapat melihat:\n   - Status dokumen (diterima/ditolak)\n   - Status pembayaran\n   - Hasil ujian dan seleksi\n   - Pengumuman hasil akhir\n\nApakah Anda sudah memiliki akun? Jika belum, Anda dapat mendaftar di menu "Daftar Akun".`;
  }

  // Contact/Help questions
  if (
    lowerMessage.includes('hubungi') ||
    lowerMessage.includes('kontak') ||
    lowerMessage.includes('bantuan') ||
    lowerMessage.includes('help')
  ) {
    return `Jika Anda membutuhkan bantuan lebih lanjut, silakan hubungi:\n\n📧 Email: pmb@universitas.ac.id\n📞 Telepon: +62-XXX-XXXX-XXXX\n💬 WhatsApp: +62-XXX-XXXX-XXXX\n🏢 Kantor PMB: Gedung Rektorat Lt. 2\n⏰ Jam Kerja: Senin-Jumat 08:00-16:00 WIB\n\nAda yang lain yang bisa saya bantu?`;
  }

  // Default response
  return `Terima kasih atas pertanyaan Anda! Saya adalah asisten PMB yang siap membantu Anda dengan:\n\n• Informasi program studi dan jalur masuk\n• Persyaratan pendaftaran\n• Jadwal dan gelombang pendaftaran\n• Proses ujian dan verifikasi\n• Status pendaftaran Anda\n\nSilakan tanyakan hal apapun tentang penerimaan mahasiswa baru. Bagaimana saya bisa membantu Anda hari ini?`;
}

// Generate AI recommendation for program
export async function generateProgramRecommendation(
  scores: Record<string, number>,
  preferences: string[],
): Promise<{ program: string; reason: string; score: number }[]> {
  // Mock AI recommendation logic
  const recommendations = PMB_KNOWLEDGE.programs
    .map((program) => {
      let score = 50; // Base score

      // Score based on program name preferences
      if (preferences.some((p) => program.name.toLowerCase().includes(p.toLowerCase()))) {
        score += 30;
      }

      // Score based on average score
      const avgScore = Object.values(scores).reduce((a, b) => a + b, 0) / Object.keys(scores).length;
      score += avgScore * 3;

      return {
        program: program.name,
        reason: `Berdasarkan nilai Anda dan preferensi, ${program.name} cocok untuk Anda. Program ini menawarkan ${program.description.toLowerCase()}`,
        score: Math.min(100, Math.round(score)),
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  return recommendations;
}

// Chat completion with mock AI
export async function chatWithAI(userMessage: string, conversationHistory: Message[]): Promise<string> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  // Generate response using mock knowledge base
  const response = generateMockResponse(userMessage);

  return response;
}

// Create a new chat session
export function createChatSession(): ChatSession {
  return {
    id: `session-${Date.now()}`,
    messages: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

// Add message to session
export function addMessageToSession(
  session: ChatSession,
  role: 'user' | 'assistant',
  content: string,
): ChatSession {
  return {
    ...session,
    messages: [
      ...session.messages,
      {
        id: `msg-${Date.now()}`,
        role,
        content,
        timestamp: new Date(),
      },
    ],
    updatedAt: new Date(),
  };
}
