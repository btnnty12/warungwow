"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ChevronDown,
  ShieldCheck,
  LogIn,
  AlertCircle,
  Database,
  Copy,
  Check,
  ChevronRight,
} from "lucide-react";

type Role = "manager" | "karyawan";

const AKUN_DEFAULT: Record<Role, { email: string; password: string }> = {
  manager: {
    email: "manager@warungwow.id",
    password: "manager123",
  },
  karyawan: {
    email: "karyawan@warungwow.id",
    password: "karyawan123",
  },
};

const LABEL_ROLE: Record<Role, string> = {
  manager: "Manager",
  karyawan: "Karyawan / Dapur",
};

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState<Role>("manager");
  const [email, setEmail] = useState(AKUN_DEFAULT[role].email);
  const [password, setPassword] = useState(AKUN_DEFAULT[role].password);
  const [lihatPassword, setLihatPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bukaSqlUser, setBukaSqlUser] = useState(false);
  const [copied, setCopied] = useState(false);

  const SQL_INSERT_AKUN = `-- =====================================================
-- WARUNGWOW: INSERT AKUN DEFAULT KE SUPABASE
-- (1) Pastikan enum public.peran ada di database
-- (2) Jalankan kode ini di SQL Editor Dashboard Supabase
-- =====================================================

-- Pastikan pgcrypto extension aktif untuk bcrypt
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- (A) INSERT USER MANAGER ke auth.users
-- Email   : manager@warungwow.id
-- Password: manager123
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  is_sso_user,
  phone_confirmed_at,
  banned_until,
  reauthentication_token,
  recovery_token,
  deleted_at
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'manager@warungwow.id',
  crypt('manager123', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"nama":"Manager Warung WOW","peran":"manager"}'::jsonb,
  false,
  false,
  now(),
  NULL,
  '',
  '',
  NULL
)
ON CONFLICT (email) DO NOTHING;

-- (B) INSERT USER KARYAWAN / DAPUR ke auth.users
-- Email   : karyawan@warungwow.id
-- Password: karyawan123
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  is_sso_user,
  phone_confirmed_at,
  banned_until,
  reauthentication_token,
  recovery_token,
  deleted_at
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'karyawan@warungwow.id',
  crypt('karyawan123', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"nama":"Karyawan Warung WOW","peran":"karyawan"}'::jsonb,
  false,
  false,
  now(),
  NULL,
  '',
  '',
  NULL
)
ON CONFLICT (email) DO NOTHING;

-- (C) INSERT SINKRON KE public.pengguna
--     Jika auth trigger belum jalan / mau manual
INSERT INTO public.pengguna (nama, email, peran, auth_id, dibuat_pada, diperbarui_pada)
SELECT
  COALESCE(raw_user_meta_data->>'nama', split_part(email, '@', 1)) AS nama,
  u.email,
  CASE
    WHEN u.email = 'manager@warungwow.id'  THEN CAST('manager'  AS peran)
    WHEN u.email = 'karyawan@warungwow.id' THEN CAST('karyawan' AS peran)
    ELSE CAST('karyawan' AS peran)
  END AS peran,
  u.id AS auth_id,
  now() AS dibuat_pada,
  now() AS diperbarui_pada
FROM auth.users u
WHERE u.email IN ('manager@warungwow.id', 'karyawan@warungwow.id')
ON CONFLICT (email) DO UPDATE
SET
  nama       = EXCLUDED.nama,
  peran      = EXCLUDED.peran,
  auth_id    = EXCLUDED.auth_id,
  diperbarui_pada = now();

-- =====================================================
-- VERIFIKASI: Setelah di-run, cek hasil dengan query ini:
-- SELECT * FROM public.pengguna WHERE email IN ('manager@warungwow.id','karyawan@warungwow.id');
-- SELECT id, email, peran FROM auth.users WHERE email IN ('manager@warungwow.id','karyawan@warungwow.id');
-- =====================================================
`;

  const pilihRole = (r: Role) => {
    setRole(r);
    setEmail(AKUN_DEFAULT[r].email);
    setPassword(AKUN_DEFAULT[r].password);
    setError(null);
  };

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        setError("Email atau password salah.");
        setLoading(false);
        return;
      }

      const user = data.user;
      if (!user) {
        setError("Gagal mendapatkan data user.");
        setLoading(false);
        return;
      }

      const { data: pengguna, error: errorProfil } = await supabase
        .from("pengguna")
        .select("nama, peran")
        .eq("auth_id", user.id)
        .single();

      if (errorProfil || !pengguna) {
        setError("Data pengguna tidak ditemukan. Jalankan SQL setup akun dulu.");
        setLoading(false);
        return;
      }

      try {
        localStorage.setItem(
          "auth_user",
          JSON.stringify({
            role: pengguna.peran,
            email: user.email,
            nama: pengguna.nama,
            loginPada: Date.now(),
          })
        );
      } catch {}

      if (pengguna.peran === "manager") {
        router.push("/manager");
      } else if (pengguna.peran === "karyawan") {
        router.push("/karyawan");
      } else {
        setError(`Role "${pengguna.peran}" tidak dikenal.`);
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      setError("Terjadi kesalahan saat login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#E8F5E9] p-3 sm:p-4 sm:p-6">
      <div className="flex flex-col md:flex-row w-full max-w-6xl mx-auto bg-white rounded-2xl overflow-hidden shadow-xl">
        {/* Bagian Kiri: Gambar */}
        <div className="w-full md:w-1/2 h-44 sm:h-52 md:h-auto relative">
          <Image
            src="/login.png"
            alt="Warung WOW"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#558B2F]/70 via-transparent md:from-[#558B2F]/30 to-transparent" />
          <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 text-white max-w-sm">
            <div className="flex items-center gap-2 mb-2">
              <Link href="/" className="bg-white/90 rounded-xl p-1.5 shadow">
                <Image
                  src="/logo.png"
                  alt="Warung WOW"
                  width={38}
                  height={38}
                />
              </Link>
              <div>
                <p className="font-extrabold text-lg sm:text-xl tracking-tight">
                  Warung WOW
                </p>
                <p className="text-[11px] sm:text-xs opacity-90">
                  Nusantara Rasa, Harga Bersahabat
                </p>
              </div>
            </div>
            <p className="text-xs sm:text-sm opacity-95 leading-relaxed hidden sm:block">
              Selamat datang kembali! Kelola operasional warung dan layani
              pelanggan dengan lebih cepat.
            </p>
          </div>
        </div>

        {/* Bagian Kanan: Form Login */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-5 sm:p-6 md:p-8">
          <div className="w-full max-w-md">
            <div className="text-center mb-5 sm:mb-6">
              <h1 className="text-3xl sm:text-4xl font-bold text-[#558B2F] tracking-tight">
                LOGIN
              </h1>
              <p className="text-gray-500 text-sm sm:text-base mt-1.5">
                Masuk untuk Melanjutkan
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              {/* Quick Role Pill */}
              <div className="grid grid-cols-2 gap-2">
                {(Object.keys(AKUN_DEFAULT) as Role[]).map((r) => {
                  const aktif = role === r;
                  return (
                    <button
                      key={r}
                      type="button"
                      onClick={() => pilihRole(r)}
                      className={`px-2 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition flex items-center justify-center gap-1 sm:gap-1.5 border-2 ${
                        aktif
                          ? "bg-[#558B2F] text-white border-[#558B2F] shadow-md"
                          : "bg-white text-gray-700 border-gray-200 hover:border-[#558B2F]/50 hover:bg-green-50"
                      }`}
                    >
                      <User size={14} className="sm:w-[15px] sm:h-[15px]" />
                      {LABEL_ROLE[r]}
                    </button>
                  );
                })}
              </div>

              {/* Pilih Role (select) */}
              <div>
                <label className="block text-sm font-semibold text-black mb-1.5">
                  Pilih Role
                </label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600">
                    <User size={20} />
                  </div>
                  <select
                    value={role}
                    onChange={(e) => pilihRole(e.target.value as Role)}
                    className="w-full pl-12 pr-10 py-3 border-2 border-[#558B2F] rounded-xl text-base font-semibold bg-white focus:outline-none focus:ring-2 focus:ring-[#558B2F] focus:ring-opacity-40 appearance-none cursor-pointer"
                  >
                    <option value="manager">Manager</option>
                    <option value="karyawan">Karyawan / Dapur</option>
                  </select>
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#558B2F]">
                    <ChevronDown size={18} />
                  </div>
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-black mb-1.5">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600">
                    <Mail size={20} />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Masukkan Email"
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-xl text-base font-semibold placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#558B2F] focus:ring-opacity-40 focus:border-[#558B2F]"
                  />
                </div>
                <p className="mt-1.5 text-[11px] sm:text-xs text-gray-500 flex items-center gap-1">
                  <ShieldCheck size={12} className="text-[#558B2F]" />
                  Default: <code className="bg-gray-100 rounded px-1.5 py-0.5 ml-0.5 font-mono">{AKUN_DEFAULT[role].email}</code>
                </p>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-semibold text-black mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600">
                    <Lock size={20} />
                  </div>
                  <input
                    type={lihatPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Masukkan password"
                    className="w-full pl-12 pr-12 py-3 border-2 border-gray-300 rounded-xl text-base font-semibold placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#558B2F] focus:ring-opacity-40 focus:border-[#558B2F]"
                  />
                  <button
                    type="button"
                    onClick={() => setLihatPassword((v) => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition"
                    aria-label={lihatPassword ? "Sembunyikan password" : "Tampilkan password"}
                  >
                    {lihatPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                <p className="mt-1.5 text-[11px] sm:text-xs text-gray-500 flex items-center gap-1">
                  <ShieldCheck size={12} className="text-[#558B2F]" />
                  Default: <code className="bg-gray-100 rounded px-1.5 py-0.5 ml-0.5 font-mono">{AKUN_DEFAULT[role].password}</code>
                </p>
              </div>

              {/* Error */}
              {error && (
                <div className="flex items-start gap-2 px-3.5 py-2.5 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs sm:text-sm">
                  <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {/* Ingat Saya & Lupa Password */}
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <label className="flex items-center gap-2 text-black font-semibold cursor-pointer select-none">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-gray-300 rounded text-[#558B2F] focus:ring-[#558B2F]"
                  />
                  Ingat Saya
                </label>
                <button
                  type="button"
                  onClick={() => pilihRole(role)}
                  className="text-[#558B2F] font-semibold hover:underline"
                >
                  Isi otomatis?
                </button>
              </div>

              {/* Tombol Masuk */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full bg-[#558B2F] text-white py-3.5 rounded-xl font-bold text-base hover:bg-[#33691E] transition flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-md`}
              >
                {loading ? (
                  <span className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <LogIn size={18} />
                    Masuk
                  </>
                )}
              </button>

              {/* Kembali ke Beranda */}
              <Link
                href="/"
                className="block w-full text-center text-[#558B2F] font-semibold text-xs sm:text-sm hover:underline py-1"
              >
                ← Kembali ke Beranda Pelanggan
              </Link>
            </form>

            <div className="mt-5 sm:mt-6 text-center text-gray-400 font-semibold text-[11px] sm:text-xs">
              @ 2026 warung wow. All right reserved
            </div>

            {/* Panel Setup Akun Default Supabase (Collapsible) */}
            <div className="mt-4 rounded-xl border-2 border-[#558B2F]/25 bg-[#558B2F]/5 overflow-hidden shadow-sm">
              <button
                type="button"
                onClick={() => setBukaSqlUser((v) => !v)}
                className="w-full px-3.5 py-2.5 flex items-center justify-between gap-3 text-[#558B2F] hover:bg-[#558B2F]/10 transition"
              >
                <span className="flex items-center gap-1.5 text-xs sm:text-sm font-extrabold">
                  <Database size={14} />
                  Setup Akun Default (Manager &amp; Karyawan)
                </span>
                <span className="flex items-center gap-1.5 text-[11px]">
                  <span className="hidden sm:inline font-semibold opacity-80">
                    {bukaSqlUser ? "Sembunyikan" : "Lihat SQL Copy-Paste"}
                  </span>
                  <ChevronRight
                    size={14}
                    className={`transition-transform ${bukaSqlUser ? "rotate-90" : ""}`}
                  />
                </span>
              </button>
              {bukaSqlUser && (
                <div className="border-t border-[#558B2F]/20 animate-[fadeIn_0.15s_ease-out]">
                  {/* Ringkasan Akun */}
                  <div className="grid grid-cols-2 gap-2 p-3 bg-white">
                    <div className="rounded-lg border border-green-200 bg-green-50 p-2.5 text-green-900">
                      <p className="text-[10px] sm:text-[11px] font-bold text-green-700">
                        MANAGER
                      </p>
                      <p className="text-xs sm:text-sm font-extrabold mt-0.5 truncate">
                        manager@warungwow.id
                      </p>
                      <p className="text-[10px] sm:text-[11px] font-mono text-green-800 mt-0.5">
                        manager123
                      </p>
                    </div>
                    <div className="rounded-lg border border-amber-200 bg-amber-50 p-2.5 text-amber-900">
                      <p className="text-[10px] sm:text-[11px] font-bold text-amber-700">
                        KARYAWAN / DAPUR
                      </p>
                      <p className="text-xs sm:text-sm font-extrabold mt-0.5 truncate">
                        karyawan@warungwow.id
                      </p>
                      <p className="text-[10px] sm:text-[11px] font-mono text-amber-800 mt-0.5">
                        karyawan123
                      </p>
                    </div>
                  </div>

                  {/* Langkah-langkah */}
                  <div className="px-3 pb-1 pt-2 bg-white text-[11px] sm:text-xs text-gray-700 space-y-1">
                    <p className="font-extrabold text-[#558B2F] text-xs sm:text-sm">
                      Cara Pakai:
                    </p>
                    <ol className="pl-5 list-decimal space-y-0.5 marker:font-bold">
                      <li>Buka Dashboard Supabase → klik menu <b>SQL Editor</b> (kiri)</li>
                      <li>Klik tombol <b>New Query</b> (+) untuk buat query baru</li>
                      <li>Klik tombol <b>COPY SQL</b> di bawah → paste ke editor</li>
                      <li>Klik tombol <b>Run</b> (▶) di kanan bawah → tunggu selesai</li>
                      <li>(Opsional) Jalankan query VERIFIKASI di komentar paling bawah untuk cek akun</li>
                    </ol>
                  </div>

                  {/* Block SQL */}
                  <div className="p-3 pt-2 bg-white">
                    <div className="rounded-xl border-2 border-gray-800 bg-gray-900 overflow-hidden shadow-inner">
                      <div className="flex items-center justify-between px-2.5 py-1.5 bg-gray-800 border-b border-gray-700">
                        <div className="flex items-center gap-1.5">
                          <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                          <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                          <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                        </div>
                        <span className="text-[10px] text-gray-400 font-bold tracking-wide">
                          WARUNGWOW_INSERT_DEFAULT_USERS.sql
                        </span>
                        <button
                          type="button"
                          onClick={async () => {
                            try {
                              await navigator.clipboard.writeText(SQL_INSERT_AKUN);
                              setCopied(true);
                              setTimeout(() => setCopied(false), 2000);
                            } catch {}
                          }}
                          className={`px-2 py-0.5 rounded text-white text-[10px] font-extrabold transition flex items-center gap-1 ${
                            copied
                              ? "bg-green-500"
                              : "bg-[#558B2F] hover:bg-[#4a7a29]"
                          }`}
                        >
                          {copied ? (
                            <>
                              <Check size={11} /> COPIED
                            </>
                          ) : (
                            <>
                              <Copy size={11} /> COPY SQL
                            </>
                          )}
                        </button>
                      </div>
                      <pre className="p-2.5 text-[10px] sm:text-[10.5px] leading-relaxed font-mono text-green-300 overflow-x-auto max-h-72 overflow-y-auto">
{SQL_INSERT_AKUN}
                      </pre>
                    </div>
                    <p className="text-[10px] sm:text-[11px] text-gray-500 mt-1.5">
                      Password dienkripsi otomatis pakai <code className="font-mono bg-gray-100 rounded px-1">crypt() + bcrypt (gen_salt(&apos;bf&apos;))</code> via pgcrypto extension.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
