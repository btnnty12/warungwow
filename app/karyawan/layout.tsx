"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ChefHat,
  BookOpen,
  ClipboardCheck,
  LogOut,
  User,
  Menu,
  X,
  Timer,
  Package,
  Loader2,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

const menuItems = [
  { href: "/karyawan", label: "Antrian Masak", icon: ChefHat, exact: true },
  { href: "/karyawan/menu", label: "Menu", icon: BookOpen },
  { href: "/karyawan/pesanan", label: "Semua Pesanan", icon: ClipboardCheck },
  { href: "/login", label: "Keluar", icon: LogOut, logout: true },
];

type ProfilPengguna = {
  nama: string | null;
  peran: string;
};

export default function KaryawanLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profil, setProfil] = useState<ProfilPengguna | null>(null);
  const [cekAuth, setCekAuth] = useState(true);

  const isActive = (item: (typeof menuItems)[number]) => {
    if (item.exact) return pathname === item.href;
    return !!pathname?.startsWith(item.href);
  };

  useEffect(() => {
    let batal = false;

    async function validasi() {
      try {
        const { data } = await supabase.auth.getSession();
        const sesi = data.session;
        if (!sesi?.user) {
          if (!batal) router.replace("/login?redirect=" + encodeURIComponent(pathname || "/karyawan"));
          return;
        }

        const { data: pengguna, error: errP } = await supabase
          .from("pengguna")
          .select("nama, peran")
          .eq("auth_id", sesi.user.id)
          .single();

        if (errP || !pengguna) {
          await supabase.auth.signOut();
          if (!batal) router.replace("/login");
          return;
        }

        if (pengguna.peran !== "karyawan") {
          if (pengguna.peran === "manager") {
            if (!batal) router.replace("/manager");
          } else {
            await supabase.auth.signOut();
            if (!batal) router.replace("/login");
          }
          return;
        }

        try {
          localStorage.setItem(
            "auth_user",
            JSON.stringify({
              role: pengguna.peran,
              email: sesi.user.email,
              nama: pengguna.nama,
              loginPada: Date.now(),
            })
          );
        } catch {}

        if (!batal) setProfil({ nama: pengguna.nama, peran: pengguna.peran });
      } catch (e) {
        console.error("Auth guard karyawan error:", e);
        if (!batal) router.replace("/login");
      } finally {
        if (!batal) setCekAuth(false);
      }
    }

    validasi();

    const { data: listener } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") {
        try { localStorage.removeItem("auth_user"); } catch {}
        router.replace("/login");
      }
    });

    return () => {
      batal = true;
      listener?.subscription.unsubscribe();
    };
  }, [router, pathname]);

  async function handleLogout(e: React.MouseEvent) {
    e.preventDefault();
    try {
      await supabase.auth.signOut();
      localStorage.removeItem("auth_user");
    } catch {}
    router.replace("/login");
  }

  function onClickNav(item: (typeof menuItems)[number]) {
    if (item.logout) {
      try { localStorage.removeItem("auth_user"); } catch {}
    }
    setSidebarOpen(false);
  }

  if (cekAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="flex items-center gap-3 text-[#558B2F]">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span className="font-bold text-sm">Memeriksa akses Karyawan / Dapur...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-[#558B2F] z-40 flex items-center justify-between px-3 shadow-md">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.png" alt="Warung WOW" width={36} height={36} />
        </Link>
        <button
          onClick={() => setSidebarOpen(true)}
          className="w-9 h-9 rounded-lg bg-white/10 text-white flex items-center justify-center"
        >
          <Menu size={20} />
        </button>
      </div>

      {/* Backdrop mobile */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex pt-14 lg:pt-0">
        {/* Sidebar */}
        <aside
          className={`fixed lg:sticky top-0 left-0 h-screen z-50 lg:z-30 w-60 flex-shrink-0 bg-[#558B2F] text-white transition-transform duration-300 shadow-xl ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }`}
        >
          <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="h-14 lg:h-16 flex items-center justify-between px-4 border-b border-white/10">
              <Link href="/karyawan" className="flex items-center gap-2">
                <Image
                  src="/logo.png"
                  alt="Warung WOW"
                  width={42}
                  height={42}
                  className="rounded-full"
                />
                <span className="font-extrabold text-xl tracking-tight hidden sm:block">
                  Warung WOW
                </span>
              </Link>
              <button
                className="lg:hidden w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center"
                onClick={() => setSidebarOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            {/* Menu */}
            <nav className="flex-1 pt-4 px-3 space-y-1 overflow-y-auto">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const aktif = isActive(item);
                const Wrapper = item.logout ? "a" : Link;
                return (
                  <Wrapper
                    key={item.href}
                    // @ts-expect-error polymorphic wrapper
                    href={item.href}
                    onClick={item.logout ? handleLogout : () => onClickNav(item)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-bold text-sm transition ${
                      aktif && !item.logout
                        ? "bg-[#FBC02D] text-gray-800 shadow"
                        : "text-white/90 hover:bg-white/10"
                    }`}
                  >
                    <Icon size={20} className="flex-shrink-0" />
                    <span>{item.label}</span>
                  </Wrapper>
                );
              })}
            </nav>

            {/* Footer User */}
            <div className="p-3 border-t border-white/15">
              <div className="flex items-center gap-2.5 px-2 py-2 rounded-xl bg-white/10">
                <div className="w-9 h-9 rounded-full bg-white text-[#558B2F] flex items-center justify-center flex-shrink-0 overflow-hidden">
                  <User size={18} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-white truncate">
                    {profil?.nama || "Karyawan"}
                  </p>
                  <p className="text-[10px] text-white/70 flex items-center gap-1">
                    <Timer size={10} /> Karyawan Aktif
                  </p>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0 w-full p-4 sm:p-5">{children}</main>
      </div>
    </div>
  );
}
