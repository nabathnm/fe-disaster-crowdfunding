# DESIGN.md — PeduliChain Design Direction

> Single source of truth for PeduliChain's brand identity, color system, typography, and craftsmanship.
> Read by agents for visual direction, then filtered through `.agents/skills/antislop/SKILL.md`.

---

## 1. Brand Identity & Personality

- **Product Name**: PeduliChain
- **Core Mission**: Platform penggalangan dana kemanusiaan dan tanggap darurat bencana transparan berbasis smart contract Ethereum Sepolia dan pembayaran mudah Midtrans.
- **Personality**: Empatik, Amanah, Tanggap Cepat, Transparan, dan Modern.
- **Feeling**: Hangat, peduli, bersih, dan menenangkan (bukan tech-bro dingin atau korporat kaku).

---

## 2. Color Palette (Caring Green Theme)

PeduliChain menggunakan palet hijau zamrud (*caring emerald*) yang melambangkan kehidupan, pemulihan pasca-bencana, dan kepedulian yang tulus.

### Core Colors (2-3 Colors Max per R-29)

| Role | Color Name | Hex Code | Purpose & Usage |
|:---|:---|:---|:---|
| **Base Surface** | Pure White / Slate 50 | `#FFFFFF` / `#F8FAFC` | Latar belakang bersih dan tenang |
| **Primary Brand** | Caring Emerald 600 | `#059669` | Tombol CTA utama, badge aktif, aksen penting |
| **Primary Dark** | Deep Emerald 700 | `#047857` | State hover CTA, judul utama penekanan |
| **Primary Deep** | Forest Emerald 900 | `#064E3B` | Header gradient, teks badge kontras tinggi |
| **Neutral Text** | Slate 900 | `#0F172A` | Teks judul dan isi utama (kontras 14:1+) |
| **Muted Text** | Slate 600 | `#475569` | Label keterangan sekunder (kontras 5.2:1+) |
| **Subtle Border** | Emerald 100 / 200 | `#D1FAE5` / `#A7F3D0` | Garis pemisah lembut kartu & tabel |

### Status Accents (Restrained Usage)

| Status | Color Name | Hex Code | Usage |
|:---|:---|:---|:---|
| **Pending / Review** | Warm Amber 600 | `#D97706` | Status menunggu kurasi admin (`bg-amber-50`) |
| **Verified On-Chain**| Teal 600 | `#0D9488` | Indikator smart contract Sepolia (`bg-teal-50`) |
| **Emergency / Error** | Crimson Red 600 | `#DC2626` | Notifikasi darurat, penolakan, atau hapus |

### Anti-Slop Color Rules:
- **TIDAK MENGGUNAKAN** gradien ungu-biru generic AI (`#2563EB` to `#9333EA`).
- **TIDAK MENGGUNAKAN** orb radial glow neon di belakang hero.
- Seluruh pasangan teks dan latar belakang wajib lolos **WCAG AA (minimal 4.5:1)**.

---

## 3. Typography Scale

- **Primary Font**: `Poppins`, `Inter`, -apple-system, sans-serif.
- **Monospace Font (Wallet & Tx Hash)**: `ui-monospace`, `SFMono-Regular`, `Menlo`, `monospace`.

| Token | Size | Weight | Line Height | Usage |
|:---|:---|:---|:---|:---|
| `display-1` | 2.5rem - 3.5rem (40-56px) | Extrabold (800) | 1.15 | Hero headline utama |
| `heading-1` | 1.75rem - 2rem (28-32px) | Extrabold (800) | 1.25 | Judul halaman portal |
| `heading-2` | 1.25rem - 1.5rem (20-24px) | Bold (700) | 1.3 | Judul kartu & modal |
| `body-base` | 0.875rem - 1rem (14-16px) | Regular (400) | 1.6 | Deskripsi cerita bencana |
| `caption` | 0.75rem (12px) | Medium (500) | 1.4 | Tanggal, target info, metadata |
| `mono-code` | 0.6875rem - 0.75rem (11-12px) | Semibold (600) | 1.4 | Alamat wallet `0x...` dan hash `tx` |

---

## 4. Shape, Radius, and Elevation Hierarchy

Hindari membuat seluruh elemen menjadi pill (`rounded-full`) seragam (R-11). Terapkan hierarki radius berjenjang:

- **Tags & Inputs**: `rounded-xl` (12px)
- **Cards & Banners**: `rounded-2xl` (16px)
- **Modals & Dialogs**: `rounded-3xl` (24px)
- **Pill Badges (Hanya status kecil)**: `rounded-full` (khusus status aktif / tag 1 kata)

### Elevation (Shadows):
- Permukaan dasar tetap datar (*flat ground plane*).
- Gunakan `shadow-none` atau `shadow-xs` pada kartu statis.
- Batasi `shadow-md` atau `shadow-lg` hanya pada elemen yang mengambang di atas layer lain (*dialog modal, active dropdown*).

---

## 5. Tone of Voice & Copywriting (Anti-Slop R-02 & R-16)

- Bahasa Indonesia yang santun, empatik, langsung pada inti, dan transparan.
- **DILARANG**:
  - Menggunakan em dash (`—`) pada teks UI yang dibuat agent.
  - Menggunakan kata-kata AI klise: "revolusioner", "seamless", "elevate your journey", "unlock the future".
  - Membuat data atau testimoni fiktif (C-5, R-17, R-18). Seluruh angka donasi dan status harus riil dari smart contract dan API backend.
