"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { supabase } from "@/lib/supabase";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  LogIn,
  AlertCircle,
  Loader2,
} from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [lihatPassword, setLihatPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cekAuth, setCekAuth] = useState(true);

  useEffect(() => {
    let batal = false;
    (async () => {
      try {
        const { data } = await supabase.auth.getSession();
        const sesi = data.session;
        if (!batal && sesi?.user) {
          const { data: pengguna } = await supabase
            .from("pengguna")
            .select("peran")
            .eq("auth_id", sesi.user.id)
            .single();
          if (pengguna?.peran === "manager") router.replace("/manager");
          else if (pengguna?.peran === "karyawan") router.replace("/karyawan");
        }
      } catch {}
      if (!batal) setCekAuth(false);
    })();
    return () => {
      batal = true;
    };
  }, [router]);

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error: errAuth } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (errAuth || !data.user) {
        setError("Email atau password salah.");
        setLoading(false);
        return;
      }

      const user = data.user;
      const { data: pengguna, error: errPengguna } = await supabase
        .from("pengguna")
        .select("nama, peran")
        .eq("auth_id", user.id)
        .single();

      if (errPengguna || !pengguna) {
        setError("Akun ini belum terdaftar sebagai pengguna. Hubungi Manager.");
        await supabase.auth.signOut();
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

      if (redirect) {
        router.replace(redirect);
      } else if (pengguna.peran === "manager") {
        router.replace("/manager");
      } else if (pengguna.peran === "karyawan") {
        router.replace("/karyawan");
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

  if (cekAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#E8F5E9]">
        <div className="flex items-center gap-3 text-[#558B2F]">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span className="font-bold text-sm">Memeriksa sesi login...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-[#E8F5E9] p-3 sm:p-4 sm:p-6">
      <div className="flex flex-col md:flex-row w-full max-w-5xl mx-auto bg-white rounded-3xl overflow-hidden shadow-2xl border border-[#558B2F]/10">
        {/* Bagian Kiri: Brand / Gambar */}
        <div className="w-full md:w-[46%] h-52 sm:h-64 md:h-auto relative bg-gradient-to-br from-[#558B2F] via-[#689F38] to-[#8BC34A]">
          <Image
            src="/login.png"
            alt="Warung WOW"
            fill
            className="object-cover mix-blend-overlay opacity-1000"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B3B6E]/90 via-[#2563EB]/30 to-transparent" />

          <div className="absolute bottom-5 left-5 sm:bottom-7 sm:left-7 text-white max-w-xs">
            <Link href="/" className="inline-flex items-center gap-2 bg-white/95 rounded-2xl p-2 shadow mb-4 hover:scale-105 transition">
              <Image
                src="/logo.png"
                alt="Warung WOW"
                width={42}
                height={42}
              />
            </Link>
            <h2 className="font-extrabold text-2xl sm:text-3xl tracking-tight leading-tight mb-1.5">
              Warung WOW
            </h2>
            <p className="text-xs sm:text-sm text-white/90 font-semibold mb-3">
              Nusantara Rasa, Harga Bersahabat
            </p>
            <div className="space-y-1.5 text-[11px] sm:text-xs text-white/85 font-medium">
              <p className="flex items-center gap-1.5">
                <ShieldCheck size={13} /> Dashboard Manager &amp; Karyawan
              </p>
              <p className="flex items-center gap-1.5">
                <ShieldCheck size={13} /> Data terenkripsi via Supabase
              </p>
            </div>
          </div>
        </div>

        {/* Bagian Kanan: Form Login */}
        <div className="w-full md:w-[54%] flex items-center justify-center p-5 sm:p-7 md:p-10">
          <div className="w-full max-w-md">
            <div className="mb-6 sm:mb-7">
              <p className="text-xs sm:text-sm font-bold text-[#558B2F] uppercase tracking-[0.18em] mb-1.5">
                Dashboard Access
              </p>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">
                Selamat Datang
              </h1>
              <p className="text-sm sm:text-base text-gray-500 mt-1.5">
                Masukkan kredensial untuk melanjutkan
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4.5 sm:space-y-5">
              {/* Email */}
              <div>
                <label className="block text-xs sm:text-sm font-bold text-gray-900 mb-1.5">
                  Alamat Email
                </label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600">
                    <Mail size={18} />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@warungwow.id"
                    autoComplete="email"
                    className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-2xl text-sm font-semibold placeholder:text-gray-500 focus:outline-none focus:ring-4 focus:ring-[#558B2F]/15 focus:border-[#558B2F] transition-all"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs sm:text-sm font-bold text-gray-900 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600">
                    <Lock size={18} />
                  </div>
                  <input
                    type={lihatPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Masukkan password"
                    autoComplete="current-password"
                    className="w-full pl-11 pr-12 py-3 border-2 border-gray-200 rounded-2xl text-sm font-semibold placeholder:text-gray-500 focus:outline-none focus:ring-4 focus:ring-[#558B2F]/15 focus:border-[#558B2F] transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setLihatPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-800 transition w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100"
                    aria-label={lihatPassword ? "Sembunyikan password" : "Tampilkan password"}
                  >
                    {lihatPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Error Banner */}
              {error && (
                <div className="flex items-start gap-2.5 px-3.5 py-3 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-xs sm:text-sm shadow-sm animate-[fadeIn_0.2s_ease-out]">
                  <AlertCircle size={17} className="flex-shrink-0 mt-0.5" />
                  <span className="font-semibold leading-relaxed">{error}</span>
                </div>
              )}

              {/* Ingat Saya & Lupa */}
              <div className="flex items-center justify-between text-xs sm:text-sm pt-1">
                <label className="flex items-center gap-2 text-gray-700 font-bold cursor-pointer select-none">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-4 h-4 sm:w-[18px] sm:h-[18px] border-2 border-gray-300 rounded text-[#558B2F] focus:ring-[#558B2F] focus:ring-offset-0"
                  />
                  Ingat saya
                </label>
              </div>

              {/* Tombol Masuk */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full bg-gradient-to-r from-[#558B2F] to-[#689F38] text-white py-3.5 rounded-2xl font-extrabold text-sm sm:text-base hover:from-[#4A7A29] hover:to-[#558B2F] transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-[#558B2F]/20 active:scale-[0.99]`}
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <LogIn size={18} />
                    Masuk ke Dashboard
                  </>
                )}
              </button>

              {/* Kembali ke Beranda */}
              <Link
                href="/"
                className="block w-full text-center text-[#558B2F] font-bold text-xs sm:text-sm hover:underline py-1.5"
              >
                &larr; Kembali ke Beranda Pelanggan
              </Link>
            </form>

            <div className="mt-8 sm:mt-9 text-center text-gray-400 font-semibold text-[11px] sm:text-xs tracking-wide">
              &copy; 2026 Warung WOW · All rights reserved
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#E8F5E9]">
        <div className="flex items-center gap-3 text-[#558B2F]">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span className="font-bold text-sm">Menyiapkan halaman login...</span>
        </div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
