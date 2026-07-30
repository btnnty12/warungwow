"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
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

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState<Role>("manager");
  const [email, setEmail] = useState(AKUN_DEFAULT[role].email);
  const [password, setPassword] = useState(AKUN_DEFAULT[role].password);
  const [lihatPassword, setLihatPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pilihRole = (r: Role) => {
    setRole(r);
    setEmail(AKUN_DEFAULT[r].email);
    setPassword(AKUN_DEFAULT[r].password);
    setError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    setTimeout(() => {
      const acc = AKUN_DEFAULT[role];
      const emailOk = email.trim().toLowerCase() === acc.email.toLowerCase();
      const passOk = password === acc.password;

      if (!emailOk || !passOk) {
        setError(
          `Email atau password salah. Gunakan ${acc.email} / ${acc.password} untuk role ${role}.`
        );
        setLoading(false);
        return;
      }

      try {
        localStorage.setItem(
          "auth_user",
          JSON.stringify({
            role,
            email: acc.email,
            nama: role === "manager" ? "Manager" : "Karyawan",
            loginPada: Date.now(),
          })
        );
      } catch {}

      router.push(`/${role}`);
      setLoading(false);
    }, 450);
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
                      className={`px-3 py-2.5 rounded-xl font-bold text-sm transition flex items-center justify-center gap-1.5 border-2 ${
                        aktif
                          ? "bg-[#558B2F] text-white border-[#558B2F] shadow-md"
                          : "bg-white text-gray-700 border-gray-200 hover:border-[#558B2F]/50 hover:bg-green-50"
                      }`}
                    >
                      <User size={15} />
                      {r === "manager" ? "Manager" : "Karyawan"}
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
                    <option value="karyawan">Karyawan</option>
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
          </div>
        </div>
      </div>
    </div>
  );
}
