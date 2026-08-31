<?php

namespace App\Services;

class AiCopilotService
{
    /**
     * Analyze message sentiment (-1.00 to 1.00)
     */
    public function analyzeSentiment(string $text): float
    {
        $positiveWords = ['tertarik', 'keren', 'bagus', 'butuh', 'proyek', 'segera', 'kerjasama', 'cepat', 'deal', 'ok', 'mantap', 'aplikasi', 'website'];
        $negativeWords = ['kecewa', 'lambat', 'rusak', 'error', 'batal', 'mahal', 'sulit', 'kendala', 'masalah', 'down'];

        $lower = mb_strtolower($text);
        $score = 0.50; // Neutral-positive baseline

        foreach ($positiveWords as $word) {
            if (str_contains($lower, $word)) {
                $score += 0.15;
            }
        }

        foreach ($negativeWords as $word) {
            if (str_contains($lower, $word)) {
                $score -= 0.25;
            }
        }

        return (float) max(-1.00, min(1.00, round($score, 2)));
    }

    /**
     * Generate suggested auto-reply based on message and Intelecta's 3 core offerings
     */
    public function generateSuggestedReply(string $text, string $senderName = 'Bapak/Ibu'): string
    {
        $lower = mb_strtolower($text);

        if (str_contains($lower, 'mobile') || str_contains($lower, 'flutter') || str_contains($lower, 'android') || str_contains($lower, 'ios')) {
            return "Halo {$senderName}, terima kasih telah menghubungi Intelecta. Terkait kebutuhan pengembangan Mobile App (iOS & Android) menggunakan stack performa tinggi kami, kami siap menjadwalkan sesi technical scoping untuk mendiskusikan arsitektur dan timeline MVP Anda. Kapan waktu yang sesuai untuk brief singkat bersama Lead Mobile Engineer kami?";
        }

        if (str_contains($lower, 'web app') || str_contains($lower, 'saas') || str_contains($lower, 'erp') || str_contains($lower, 'dashboard') || str_contains($lower, 'portal')) {
            return "Halo {$senderName}, salam hangat dari tim Intelecta! Kami sangat berpengalaman membangun Web App berskala enterprise & platform SaaS (React/Next.js & Laravel Cloud API). Kami dapat memaparkan arsitektur modular dan estimasi sprint pengerjaannya. Apakah ada dokumen PRD atau brief awal yang dapat kami review?";
        }

        if (str_contains($lower, 'website') || str_contains($lower, 'company profile') || str_contains($lower, 'landing') || str_contains($lower, 'e-commerce')) {
            return "Halo {$senderName}, terima kasih atas minat Anda pada layanan Web Development Intelecta. Kami membangun web modern berkecepatan tinggi, SEO-optimized, dan berdesain premium. Tim kami siap mengirimkan proposal paket pengembangan serta portofolio proyek serupa. Boleh kami tahu perkiraan target peluncuran website Anda?";
        }

        return "Halo {$senderName}, terima kasih telah menghubungi Intelecta Technology Solutions. Pesan Anda telah kami terima di command center kami. Lead Consultant kami akan segera meninjau kebutuhan sistem Anda dan memberikan estimasi solusi terbaik dalam waktu singkat.";
    }
}
