"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Home,
  BookOpen,
  ClipboardList,
  Package,
  LogOut,
  User,
  Menu,
  X,
} from "lucide-react";

const menuItems = [
  { href: "/karyawan", label: "Beranda", icon: Home, exact: true },
  { href: "/karyawan/menu", label: "Menu", icon: BookOpen },
  { href: "/karyawan/pesanan", label: "Pesanan", icon: ClipboardList },
  { href: "/karyawan/stok", label: "Stok", icon: Package },
  { href: "/login", label: "Keluar", icon: LogOut, logout: true },
];

export default function KaryawanLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-60 lg:w-56 xl:w-60 bg-[#558B2F] flex flex-col shadow-xl z-50 rounded-tr-2xl rounded-br-2xl transform transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="p-4 pb-2 flex items-center justify-between lg:block">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.png" alt="Warung WOW" width={42} height={42} />
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden w-9 h-9 rounded-lg bg-white/10 text-white flex items-center justify-center"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 px-3 py-1 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.exact
              ? pathname === item.href
              : pathname?.startsWith(item.href);
            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                  isActive
                    ? "bg-yellow-300 text-black font-bold shadow-sm"
                    : "text-white hover:bg-white/10"
                }`}
              >
                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-sm lg:text-base">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-3 mt-auto border-t border-white/20">
          <div className="flex items-center gap-2.5 px-1.5 py-1.5">
            <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-[#558B2F] flex-shrink-0">
              <User size={18} />
            </div>
            <div>
              <p className="font-bold text-white text-sm">Karyawan</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="pt-14 lg:pt-0 lg:ml-56 xl:ml-60 p-3 sm:p-4 lg:p-5 min-h-screen">
        {children}
      </main>
    </div>
  );
}
