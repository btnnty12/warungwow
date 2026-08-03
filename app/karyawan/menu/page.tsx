"use client";

import { supabase } from "@/lib/supabase";
import { useEffect, useState, useMemo, useRef } from "react";
import {
  Search,
  Plus,
  Calendar,
  Bell,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Check,
  Pencil,
  Trash2,
  X,
  Save,
  AlertTriangle,
  Image as ImageIcon,
  Upload,
  Link2,
  BookOpen,
  FolderPlus,
  FolderEdit,
  ShieldCheck,
  Copy as CopyIcon,
} from "lucide-react";

type ProdukRow = {
  id: number;
  nama_produk?: string | null;
  deskripsi?: string | null;
  harga?: number | null;
  stok?: number | null;
  status?: string | null;
  gambar?: string | null;
  kategori_id?: number | null;
  kategori?: { nama_kategori?: string | null } | null;
};

type KategoriRow = {
  id: number;
  nama_kategori?: string | null;
};

type ProdukView = {
  id: number;
  name: string;
  category: string;
  price: string;
  status: string;
  image: string;
  statusRaw: string;
};

type FormProduk = {
  nama_produk: string;
  kategori_id: string;
  deskripsi: string;
  gambar: string;
  harga: string;
  stok: string;
  status: "tersedia" | "habis";
};

const FORM_KOSONG: FormProduk = {
  nama_produk: "",
  kategori_id: "",
  deskripsi: "",
  gambar: "",
  harga: "",
  stok: "0",
  status: "tersedia",
};

const SQL_STORAGE_POLICY = `-- Aktifkan akses baca (public) untuk gambar di bucket menu-produk
CREATE POLICY IF NOT EXISTS "menu-produk_select_public"
ON storage.objects FOR SELECT
USING (bucket_id = 'menu-produk');

-- Aktifkan akses upload (INSERT) untuk semua user (anon + authenticated)
CREATE POLICY IF NOT EXISTS "menu-produk_insert_all"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'menu-produk');

-- (Opsional) Aktifkan akses update/delete untuk ganti/hapus gambar
CREATE POLICY IF NOT EXISTS "menu-produk_update_all"
ON storage.objects FOR UPDATE
USING (bucket_id = 'menu-produk');

CREATE POLICY IF NOT EXISTS "menu-produk_delete_all"
ON storage.objects FOR DELETE
USING (bucket_id = 'menu-produk');
`;

export default function ManagerMenuPage() {
  // ---- Produk & Kategori ----
  const [produk, setProduk] = useState<ProdukRow[]>([]);
  const [kategori, setKategori] = useState<KategoriRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [cari, setCari] = useState("");
  const [kategoriTerpilih, setKategoriTerpilih] = useState<number | "semua">("semua");
  const [dropdownBuka, setDropdownBuka] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // ---- Modal Produk ----
  const [modalBuka, setModalBuka] = useState<"tambah" | "edit" | "hapus" | null>(null);
  const [produkEdit, setProdukEdit] = useState<ProdukRow | null>(null);
  const [form, setForm] = useState<FormProduk>(FORM_KOSONG);
  const [submitting, setSubmitting] = useState(false);
  const [pesanError, setPesanError] = useState<string | null>(null);
  const [pesanSukses, setPesanSukses] = useState<string | null>(null);
  const [pesanPeringatan, setPesanPeringatan] = useState<string | null>(null);

  // ---- Upload Gambar ----
  const [modeGambar, setModeGambar] = useState<"upload" | "url">("upload");
  const [fileDipilih, setFileDipilih] = useState<File | null>(null);
  const [uploadingGambar, setUploadingGambar] = useState(false);
  const [previewFile, setPreviewFile] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [tampilPanduanStorage, setTampilPanduanStorage] = useState(false);

  // ---- Kelola Kategori (CRUD mini) ----
  const [modalKategori, setModalKategori] = useState<"tambah" | "edit" | null>(null);
  const [kategoriEdit, setKategoriEdit] = useState<KategoriRow | null>(null);
  const [formKategori, setFormKategori] = useState<string>("");
  const [submittingKategori, setSubmittingKategori] = useState(false);
  const [copyPolicy, setCopyPolicy] = useState(false);

  // ===================================================
  // DATA FETCHING (Produk + Kategori)
  // ===================================================

  async function ambilData() {
    setLoading(true);
    try {
      const [
        { data: p, error: ep },
        { data: k, error: ek },
      ] = await Promise.all([
        supabase
          .from("produk")
          .select("*, kategori:kategori_id (nama_kategori)")
          .order("id", { ascending: false }),
        supabase.from("kategori").select("*").order("id", { ascending: true }),
      ]);
      if (ep) console.error("Error fetch produk:", ep);
      if (ek) console.error("Error fetch kategori:", ek);
      setProduk((p as ProdukRow[]) || []);
      setKategori((k as KategoriRow[]) || []);
    } catch (err) {
      console.error("Gagal ambil data:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    ambilData();
  }, []);

  useEffect(() => {
    function handlerClickLuar(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownBuka(false);
      }
    }
    document.addEventListener("mousedown", handlerClickLuar);
    return () => document.removeEventListener("mousedown", handlerClickLuar);
  }, []);

  useEffect(() => {
    if (pesanSukses) {
      const t = setTimeout(() => setPesanSukses(null), 2500);
      return () => clearTimeout(t);
    }
  }, [pesanSukses]);
  useEffect(() => {
    if (pesanError) {
      const t = setTimeout(() => setPesanError(null), 4000);
      return () => clearTimeout(t);
    }
  }, [pesanError]);
  useEffect(() => {
    if (pesanPeringatan) {
      const t = setTimeout(() => setPesanPeringatan(null), 8000);
      return () => clearTimeout(t);
    }
  }, [pesanPeringatan]);

  // ===================================================
  // DERIVED / VIEW
  // ===================================================

  const products: ProdukView[] = useMemo(() => {
    return (produk || []).map((p) => ({
      id: p.id,
      name: p.nama_produk || "Produk",
      category: (p as any).kategori?.nama_kategori || "Umum",
      price: p.harga ? `Rp ${Number(p.harga).toLocaleString("id-ID")}` : "Rp 0",
      status: p.status === "tersedia" ? "Tersedia" : "Habis",
      image: p.gambar || "/warung.png",
      statusRaw: p.status || "tersedia",
    }));
  }, [produk]);

  const labelKategoriTerpilih = useMemo(() => {
    if (kategoriTerpilih === "semua") return "Semua Kategori";
    const k = kategori.find((x) => x.id === kategoriTerpilih);
    return k?.nama_kategori || "Kategori";
  }, [kategori, kategoriTerpilih]);

  const terfilter = useMemo(() => {
    const q = cari.trim().toLowerCase();
    return products.filter((p) => {
      const sesuaiKategori =
        kategoriTerpilih === "semua"
          ? true
          : (produk.find((x) => x.id === p.id)?.kategori_id ?? null) ===
            kategoriTerpilih;
      const sesuaiCari =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q);
      return sesuaiKategori && sesuaiCari;
    });
  }, [products, produk, kategoriTerpilih, cari]);

  // ---- Pagination Produk ----
  const PRODUK_PER_HALAMAN = 12;
  const [halaman, setHalaman] = useState(1);
  const totalHalaman = Math.max(1, Math.ceil(terfilter.length / PRODUK_PER_HALAMAN));
  useEffect(() => {
    if (halaman > totalHalaman) setHalaman(1);
  }, [totalHalaman, halaman]);
  const produkDiHalaman = useMemo(() => {
    const awal = (halaman - 1) * PRODUK_PER_HALAMAN;
    return terfilter.slice(awal, awal + PRODUK_PER_HALAMAN);
  }, [terfilter, halaman]);
  const nomorHalaman = useMemo(() => {
    const arr: number[] = [];
    for (let i = 1; i <= totalHalaman; i++) arr.push(i);
    return arr;
  }, [totalHalaman]);

  // ===================================================
  // CRUD PRODUK HELPERS
  // ===================================================

  function formDariProduk(p: ProdukRow): FormProduk {
    return {
      nama_produk: p.nama_produk || "",
      kategori_id: p.kategori_id ? String(p.kategori_id) : "",
      deskripsi: p.deskripsi || "",
      gambar: p.gambar || "",
      harga: p.harga != null ? String(p.harga) : "",
      stok: p.stok != null ? String(p.stok) : "0",
      status: p.status === "habis" ? "habis" : "tersedia",
    };
  }

  function bukaTambah() {
    setForm(FORM_KOSONG);
    setProdukEdit(null);
    setPesanError(null);
    setModeGambar("upload");
    setFileDipilih(null);
    setPreviewFile(null);
    setModalBuka("tambah");
  }

  function bukaEdit(p: ProdukRow) {
    setProdukEdit(p);
    setForm(formDariProduk(p));
    setPesanError(null);
    setModeGambar(p.gambar ? "url" : "upload");
    setFileDipilih(null);
    setPreviewFile(null);
    setModalBuka("edit");
  }

  function bukaHapus(p: ProdukRow) {
    setProdukEdit(p);
    setPesanError(null);
    setModalBuka("hapus");
  }

  function tutupModal() {
    setModalBuka(null);
    setProdukEdit(null);
    setForm(FORM_KOSONG);
    setPesanError(null);
    setModeGambar("upload");
    setFileDipilih(null);
    setPreviewFile(null);
  }

  async function uploadGambar(file: File): Promise<{ url: string; path: string; warning?: string }> {
    const ext = file.name.split(".").pop()?.toLowerCase() || "png";
    const namaBersih = (form.nama_produk.trim() || "produk")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    const path = `menu/${Date.now()}-${namaBersih}.${ext}`;

    const { error: errUpload } = await supabase.storage
      .from("menu-produk")
      .upload(path, file, {
        cacheControl: "3600",
        upsert: true,
        contentType: file.type || "image/png",
      });
    if (errUpload) {
      const msg = String(errUpload.message || "");
      const isBucketNotFound =
        msg.includes("does not exist") ||
        msg.includes("bucket") ||
        String(errUpload.name || "").includes("Bucket");
      const isRLSViolation =
        msg.toLowerCase().includes("row-level security") ||
        msg.toLowerCase().includes("policy") ||
        msg.includes("42501") ||
        String((errUpload as any)?.code || "").includes("42501");
      if (isBucketNotFound) {
        return {
          url: "/warung.png",
          path,
          warning:
            "BUCKET BELUM ADA: Menu tersimpan dengan gambar placeholder. Ikuti panduan 'Setup Storage' untuk upload gambar asli.",
        };
      }
      if (isRLSViolation) {
        return {
          url: "/warung.png",
          path,
          warning:
            "STORAGE POLICY BELUM ADA: Menu tersimpan dengan gambar placeholder. Buka panduan 'Setup Storage' lalu jalankan SQL copy-paste untuk izinkan upload.",
        };
      }
      return {
        url: "/warung.png",
        path,
        warning: `Upload gagal (${msg}) — menu tersimpan pakai gambar placeholder. Lihat panduan Setup Storage.`,
      };
    }

    const { data: urlData } = supabase.storage.from("menu-produk").getPublicUrl(path);
    if (!urlData?.publicUrl) throw new Error("Gagal mendapatkan URL gambar.");
    return { url: urlData.publicUrl, path };
  }

  function handlePilihFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] || null;
    setFileDipilih(f);
    if (f) {
      const reader = new FileReader();
      reader.onload = () => setPreviewFile(String(reader.result));
      reader.readAsDataURL(f);
    } else {
      setPreviewFile(null);
    }
  }

  function validasiForm(): string | null {
    if (!form.nama_produk.trim()) return "Nama produk wajib diisi.";
    if (!form.kategori_id) return kategori.length === 0
        ? "Belum ada kategori. Klik tombol '+' di samping field Kategori untuk menambah kategori terlebih dahulu."
        : "Pilih kategori terlebih dahulu.";
    if (!form.harga.trim()) return "Harga wajib diisi.";
    const h = Number(form.harga);
    if (Number.isNaN(h) || h < 0) return "Harga tidak valid.";
    return null;
  }

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    const err = validasiForm();
    if (err) {
      setPesanError(err);
      return;
    }
    setSubmitting(true);
    setPesanError(null);
    try {
      let urlGambar = form.gambar.trim() || null;
      let warningUpload: string | undefined;
      if (modeGambar === "upload" && fileDipilih) {
        setUploadingGambar(true);
        const { url, warning } = await uploadGambar(fileDipilih);
        urlGambar = url;
        warningUpload = warning;
        setUploadingGambar(false);
      }
      const payload = {
        nama_produk: form.nama_produk.trim(),
        kategori_id: Number(form.kategori_id),
        deskripsi: form.deskripsi.trim() || null,
        gambar: urlGambar,
        harga: Number(form.harga),
        stok: Number(form.stok) || 0,
        status: form.status,
      };
      if (modalBuka === "tambah") {
        const { error } = await supabase
          .from("produk")
          .insert([payload])
          .select("id");
        if (error) throw error;
        setPesanSukses("Menu berhasil ditambahkan!");
      } else if (modalBuka === "edit" && produkEdit) {
        const { error } = await supabase
          .from("produk")
          .update(payload)
          .eq("id", produkEdit.id);
        if (error) throw error;
        setPesanSukses("Menu berhasil diperbarui!");
      }
      if (warningUpload) {
        setPesanPeringatan(warningUpload);
      }
      tutupModal();
      await ambilData();
    } catch (err: any) {
      console.error(err);
      setPesanError(err?.message || "Terjadi kesalahan saat menyimpan.");
    } finally {
      setUploadingGambar(false);
      setSubmitting(false);
    }
  }

  async function handleHapus() {
    if (!produkEdit) return;
    setSubmitting(true);
    setPesanError(null);
    try {
      const { error } = await supabase
        .from("produk")
        .delete()
        .eq("id", produkEdit.id);
      if (error) throw error;
      setPesanSukses("Menu berhasil dihapus!");
      tutupModal();
      await ambilData();
    } catch (err: any) {
      console.error(err);
      setPesanError(err?.message || "Terjadi kesalahan saat menghapus.");
    } finally {
      setSubmitting(false);
    }
  }

  // ===================================================
  // CRUD KATEGORI MINI (modal popup dalam form produk)
  // ===================================================

  function bukaTambahKategori() {
    setKategoriEdit(null);
    setFormKategori("");
    setModalKategori("tambah");
  }
  function bukaEditKategori() {
    const id = Number(form.kategori_id);
    const k = kategori.find((x) => x.id === id) || null;
    if (!k) return;
    setKategoriEdit(k);
    setFormKategori(k.nama_kategori || "");
    setModalKategori("edit");
  }
  function tutupModalKategori() {
    setModalKategori(null);
    setKategoriEdit(null);
    setFormKategori("");
  }
  async function submitKategori(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    const nama = formKategori.trim();
    if (!nama) return;
    setSubmittingKategori(true);
    try {
      if (modalKategori === "tambah") {
        const { data, error } = await supabase
          .from("kategori")
          .insert([{ nama_kategori: nama }])
          .select("id, nama_kategori")
          .single();
        if (error) throw error;
        if (data) {
          setForm((f) => ({ ...f, kategori_id: String((data as KategoriRow).id) }));
        }
      } else if (modalKategori === "edit" && kategoriEdit) {
        const { error } = await supabase
          .from("kategori")
          .update({ nama_kategori: nama })
          .eq("id", kategoriEdit.id);
        if (error) throw error;
      }
      tutupModalKategori();
      await ambilData();
    } catch (err: any) {
      console.error(err);
      setPesanError(err?.message || "Gagal menyimpan kategori.");
    } finally {
      setSubmittingKategori(false);
    }
  }
  async function hapusKategori() {
    if (!kategoriEdit) return;
    const dipakai = produk.some((p) => p.kategori_id === kategoriEdit.id);
    if (dipakai) {
      setPesanError("Kategori ini sedang dipakai oleh menu. Pindahkan dulu menu ke kategori lain.");
      return;
    }
    if (!confirm(`Hapus kategori "${kategoriEdit.nama_kategori}"?`)) return;
    setSubmittingKategori(true);
    try {
      const { error } = await supabase
        .from("kategori")
        .delete()
        .eq("id", kategoriEdit.id);
      if (error) throw error;
      if (String(kategoriTerpilih) === String(kategoriEdit.id)) {
        setKategoriTerpilih("semua");
      }
      if (Number(form.kategori_id) === kategoriEdit.id) {
        setForm((f) => ({ ...f, kategori_id: "" }));
      }
      tutupModalKategori();
      await ambilData();
    } catch (err: any) {
      console.error(err);
      setPesanError(err?.message || "Gagal menghapus kategori.");
    } finally {
      setSubmittingKategori(false);
    }
  }

  // ===================================================
  // RENDER
  // ===================================================

  return (
    <div className="bg-white rounded-2xl p-3 sm:p-4 lg:p-5 shadow-sm border border-gray-100 relative">
      {/* Toast Sukses */}
      {pesanSukses && (
        <div className="absolute top-4 right-4 z-40 px-4 py-2.5 bg-green-600 text-white rounded-xl shadow-xl text-sm font-bold flex items-center gap-2 animate-[fadeIn_0.2s_ease-out]">
          <Check size={16} /> {pesanSukses}
        </div>
      )}
      {/* Toast Peringatan (untuk bucket not found) */}
      {pesanPeringatan && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-40 max-w-lg w-[92%] px-4 py-3 bg-yellow-50 border-2 border-yellow-300 text-yellow-900 rounded-xl shadow-xl text-xs sm:text-sm font-bold animate-[fadeIn_0.2s_ease-out] flex items-start gap-2.5">
          <AlertTriangle size={16} className="flex-shrink-0 mt-0.5 text-yellow-600" />
          <div>
            <p>{pesanPeringatan}</p>
            <button
              onClick={() => {
                setPesanPeringatan(null);
                setTampilPanduanStorage(true);
                bukaTambah();
              }}
              className="mt-1.5 px-2.5 py-1 bg-yellow-200 hover:bg-yellow-300 text-yellow-900 rounded-lg text-[11px] font-extrabold transition"
            >
              Buka Panduan Setup →
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-1 flex items-center gap-2">
            <BookOpen className="text-[#558B2F]" size={26} /> Menu
          </h1>
          <p className="text-sm text-gray-600">
            Kelola daftar menu makanan &amp; minuman lengkap dengan kategori
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 rounded-lg border border-gray-200">
            <Calendar size={14} className="text-gray-600" />
            <span className="text-gray-700 font-medium text-sm">
              {new Date().toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}
            </span>
          </div>
          <button className="w-9 h-9 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition">
            <Bell size={16} className="text-gray-700" />
          </button>
        </div>
      </div>

      {/* Stat Card Mini */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
        <div className="px-3 py-2.5 rounded-xl border border-gray-100 bg-white">
          <p className="text-[10px] sm:text-xs text-gray-500 font-semibold">Total Menu</p>
          <p className="text-lg sm:text-xl font-extrabold text-gray-800">{produk.length}</p>
        </div>
        <div className="px-3 py-2.5 rounded-xl border border-gray-100 bg-white">
          <p className="text-[10px] sm:text-xs text-gray-500 font-semibold">Kategori</p>
          <p className="text-lg sm:text-xl font-extrabold text-[#558B2F]">{kategori.length}</p>
        </div>
        <div className="px-3 py-2.5 rounded-xl border border-green-100 bg-green-50">
          <p className="text-[10px] sm:text-xs text-green-600 font-semibold">Tersedia</p>
          <p className="text-lg sm:text-xl font-extrabold text-green-700">
            {products.filter((p) => p.statusRaw === "tersedia").length}
          </p>
        </div>
        <div className="px-3 py-2.5 rounded-xl border border-red-100 bg-red-50">
          <p className="text-[10px] sm:text-xs text-red-600 font-semibold">Habis</p>
          <p className="text-lg sm:text-xl font-extrabold text-red-700">
            {products.filter((p) => p.statusRaw === "habis").length}
          </p>
        </div>
      </div>

      {/* Search & Actions */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 mb-4">
        <div className="relative w-full md:w-72 lg:w-80">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            value={cari}
            onChange={(e) => setCari(e.target.value)}
            placeholder="Cari menu..."
            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#558B2F]/30 focus:border-[#558B2F] text-gray-700 placeholder:text-gray-400 text-sm"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {/* Dropdown Kategori */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownBuka((b) => !b)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-white border-2 border-[#558B2F] text-[#558B2F] rounded-lg font-bold hover:bg-green-50 transition text-sm min-w-[160px] justify-between"
            >
              <span className="truncate">{labelKategoriTerpilih}</span>
              <ChevronDown
                size={14}
                className={`flex-shrink-0 transition-transform ${dropdownBuka ? "rotate-180" : ""}`}
              />
            </button>
            {dropdownBuka && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setDropdownBuka(false)}
                />
                <div className="absolute right-0 top-full mt-1 z-20 bg-white shadow-xl border border-gray-200 rounded-xl py-1.5 w-56 max-h-72 overflow-y-auto">
                  <button
                    onClick={() => {
                      setKategoriTerpilih("semua");
                      setDropdownBuka(false);
                    }}
                    className={`w-full text-left px-3.5 py-2 text-xs sm:text-sm transition flex items-center justify-between ${
                      kategoriTerpilih === "semua"
                        ? "text-[#558B2F] bg-green-50 font-bold"
                        : "text-gray-700 hover:bg-gray-50 font-semibold"
                    }`}
                  >
                    <span>Semua Kategori</span>
                    {kategoriTerpilih === "semua" && <Check size={14} />}
                  </button>
                  <div className="my-1 border-t border-gray-100" />
                  {(kategori || []).map((k) => {
                    const aktif = kategoriTerpilih === k.id;
                    return (
                      <button
                        key={k.id}
                        onClick={() => {
                          setKategoriTerpilih(k.id);
                          setDropdownBuka(false);
                        }}
                        className={`w-full text-left px-3.5 py-2 text-xs sm:text-sm transition flex items-center justify-between ${
                          aktif
                            ? "text-[#558B2F] bg-green-50 font-bold"
                            : "text-gray-700 hover:bg-gray-50 font-semibold"
                        }`}
                      >
                        <span>{k.nama_kategori || "Kategori"}</span>
                        {aktif && <Check size={14} />}
                      </button>
                    );
                  })}
                  <div className="my-1 border-t border-gray-100" />
                  <button
                    onClick={() => {
                      setDropdownBuka(false);
                      bukaTambahKategori();
                      setModalBuka(null);
                    }}
                    className="w-full text-left px-3.5 py-2 text-xs sm:text-sm transition flex items-center gap-1.5 text-[#558B2F] hover:bg-green-50 font-bold"
                  >
                    <FolderPlus size={14} /> Tambah Kategori
                  </button>
                </div>
              </>
            )}
          </div>
          <button
            onClick={bukaTambah}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-[#558B2F] text-white rounded-lg font-bold hover:bg-[#4a7a29] transition shadow-sm text-sm"
          >
            <Plus size={14} />
            <span>Tambah Menu</span>
          </button>
        </div>
      </div>

      {/* Loading / Empty / Grid */}
      {loading ? (
        <div className="py-12 text-center">
          <div className="inline-block w-6 h-6 border-2 border-[#558B2F]/30 border-t-[#558B2F] rounded-full animate-spin mb-2" />
          <p className="text-gray-400 text-sm">Memuat menu...</p>
        </div>
      ) : terfilter.length === 0 ? (
        <div className="py-12 text-center">
          <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-3">
            <BookOpen size={28} className="text-gray-300" />
          </div>
          <p className="text-gray-500 text-sm font-semibold mb-1">
            {cari || kategoriTerpilih !== "semua"
              ? "Tidak ada menu yang sesuai."
              : "Belum ada menu."}
          </p>
          <p className="text-gray-400 text-xs mb-3">
            {kategori.length === 0
              ? "Tambahkan kategori terlebih dahulu, lalu tambahkan menu."
              : "Klik 'Tambah Menu' untuk menambahkan daftar menu warung."}
          </p>
          <div className="flex items-center justify-center gap-2">
            {kategori.length === 0 && (
              <button
                onClick={bukaTambahKategori}
                className="px-3.5 py-2 rounded-lg border border-[#558B2F] text-[#558B2F] font-bold text-xs sm:text-sm hover:bg-green-50 transition flex items-center gap-1.5"
              >
                <FolderPlus size={14} /> Tambah Kategori
              </button>
            )}
            <button
              onClick={bukaTambah}
              disabled={kategori.length === 0}
              className="px-3.5 py-2 rounded-lg bg-[#558B2F] text-white font-bold text-xs sm:text-sm hover:bg-[#4a7a29] transition flex items-center gap-1.5 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              <Plus size={14} /> Tambah Menu
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 mb-4">
            {produkDiHalaman.map((product) => {
              const row = produk.find((x) => x.id === product.id)!;
              return (
                <div
                  key={product.id}
                  className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group relative"
                >
                  {/* Action Buttons */}
                  <div className="absolute top-2 right-2 flex gap-1 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => bukaEdit(row)}
                      title="Edit menu"
                      className="w-7 h-7 rounded-lg bg-white/95 text-[#558B2F] border border-gray-200 flex items-center justify-center hover:bg-green-50 shadow-sm transition"
                    >
                      <Pencil size={13} />
                    </button>
                    <button
                      onClick={() => bukaHapus(row)}
                      title="Hapus menu"
                      className="w-7 h-7 rounded-lg bg-white/95 text-red-600 border border-red-200 flex items-center justify-center hover:bg-red-50 shadow-sm transition"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                  <div className="relative h-28 sm:h-32 md:h-36 bg-gray-50 overflow-hidden">
                    <div
                      className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-300"
                      style={{
                        backgroundImage: `url(${product.image})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    />
                  </div>
                  <div className="p-2.5 sm:p-3">
                    <h3 className="font-bold text-gray-800 text-sm mb-0.5 truncate pr-10">
                      {product.name}
                    </h3>
                    <p className="text-gray-500 text-[11px] mb-2">
                      {product.category}
                    </p>
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-gray-800 text-sm">
                        {product.price}
                      </p>
                      <span
                        className={`font-semibold text-[10px] sm:text-xs px-2 py-0.5 rounded ${
                          product.statusRaw === "tersedia"
                            ? "bg-green-50 text-[#558B2F]"
                            : "bg-red-50 text-red-500"
                        }`}
                      >
                        {product.status}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination Produk */}
          {totalHalaman > 1 && (
            <div className="flex justify-center items-center gap-1.5 pt-1">
              <button
                onClick={() => setHalaman((h) => Math.max(1, h - 1))}
                disabled={halaman === 1}
                className="w-8 h-8 rounded-lg border border-gray-200 bg-white flex items-center justify-center text-gray-500 hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={14} />
              </button>
              {nomorHalaman.map((page) => (
                <button
                  key={page}
                  onClick={() => setHalaman(page)}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold transition text-sm ${
                    halaman === page
                      ? "bg-[#558B2F] text-white shadow"
                      : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setHalaman((h) => Math.min(totalHalaman, h + 1))}
                disabled={halaman === totalHalaman}
                className="w-8 h-8 rounded-lg border border-gray-200 bg-white flex items-center justify-center text-gray-500 hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          )}
        </>
      )}

      {/* ================= MODAL TAMBAH / EDIT PRODUK ================= */}
      {(modalBuka === "tambah" || modalBuka === "edit") && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={tutupModal}
        >
          <form
            onSubmit={handleSubmit}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl w-full max-w-xl shadow-2xl border border-gray-200 overflow-hidden max-h-[90vh] flex flex-col"
          >
            <div className="bg-[#558B2F] px-5 py-4 flex items-center justify-between gap-3">
              <div className="text-white min-w-0">
                <p className="text-xs opacity-90">
                  {modalBuka === "tambah" ? "Tambah Menu Baru" : "Perbarui Menu"}
                </p>
                <p className="text-lg font-extrabold truncate">
                  {modalBuka === "tambah"
                    ? "Tambah Produk"
                    : form.nama_produk || "Edit Produk"}
                </p>
              </div>
              <button
                type="button"
                onClick={tutupModal}
                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
              >
                <X size={16} />
              </button>
            </div>
            <div className="p-5 space-y-4 overflow-y-auto">
              {pesanError && (
                <div className="flex items-start gap-2 px-3.5 py-2.5 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs sm:text-sm">
                  <AlertTriangle size={16} className="flex-shrink-0 mt-0.5" />
                  <span>{pesanError}</span>
                </div>
              )}
              <div>
                <label className="block text-xs sm:text-sm text-gray-900 font-bold mb-1.5">
                  Nama Produk <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.nama_produk}
                  onChange={(e) =>
                    setForm({ ...form, nama_produk: e.target.value })
                  }
                  placeholder="Misal: Nasi Goreng Spesial"
                  className="w-full px-3.5 py-2.5 border-2 border-gray-300 rounded-xl text-sm font-semibold text-gray-900 placeholder:text-gray-500 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#558B2F]/30 focus:border-[#558B2F]"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs sm:text-sm text-gray-900 font-bold mb-1.5 flex items-center justify-between gap-2">
                    <span>
                      Kategori <span className="text-red-500">*</span>
                    </span>
                    <div className="flex items-center gap-0.5">
                      <button
                        type="button"
                        title="Tambah Kategori Baru"
                        onClick={bukaTambahKategori}
                        className="w-6 h-6 rounded-md bg-green-50 hover:bg-green-100 text-[#558B2F] border border-[#558B2F]/30 flex items-center justify-center transition"
                      >
                        <FolderPlus size={12} />
                      </button>
                      {form.kategori_id && (
                        <button
                          type="button"
                          title="Edit Kategori Terpilih"
                          onClick={bukaEditKategori}
                          className="w-6 h-6 rounded-md bg-white hover:bg-gray-50 text-[#558B2F] border border-[#558B2F]/30 flex items-center justify-center transition"
                        >
                          <FolderEdit size={12} />
                        </button>
                      )}
                    </div>
                  </label>
                  <div className="relative">
                    <select
                      value={form.kategori_id}
                      onChange={(e) =>
                        setForm({ ...form, kategori_id: e.target.value })
                      }
                      className="w-full pl-3.5 pr-10 py-2.5 border-2 border-gray-300 rounded-xl text-sm font-semibold text-gray-900 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[#558B2F]/30 focus:border-[#558B2F] appearance-none cursor-pointer"
                    >
                      <option value="">-- Pilih --</option>
                      {(kategori || []).map((k) => (
                        <option key={k.id} value={String(k.id)}>
                          {k.nama_kategori || "Kategori"}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                      <ChevronDown size={16} />
                    </div>
                  </div>
                  {kategori.length === 0 && (
                    <p className="mt-1 text-[11px] text-orange-600 font-semibold flex items-center gap-1">
                      <AlertTriangle size={12} />
                      Belum ada kategori. Klik tombol + di atas untuk menambah.
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-xs sm:text-sm text-gray-900 font-bold mb-1.5">
                    Status
                  </label>
                  <div className="relative">
                    <select
                      value={form.status}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          status: e.target.value as "tersedia" | "habis",
                        })
                      }
                      className="w-full pl-3.5 pr-10 py-2.5 border-2 border-gray-300 rounded-xl text-sm font-semibold text-gray-900 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[#558B2F]/30 focus:border-[#558B2F] appearance-none cursor-pointer"
                    >
                      <option value="tersedia">Tersedia</option>
                      <option value="habis">Habis</option>
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                      <ChevronDown size={16} />
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs sm:text-sm text-gray-900 font-bold mb-1.5">
                    Harga (Rp) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={form.harga}
                    onChange={(e) => setForm({ ...form, harga: e.target.value })}
                    placeholder="Misal: 25000"
                    className="w-full px-3.5 py-2.5 border-2 border-gray-300 rounded-xl text-sm font-semibold text-gray-900 placeholder:text-gray-500 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#558B2F]/30 focus:border-[#558B2F]"
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm text-gray-900 font-bold mb-1.5">
                    Stok
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={form.stok}
                    onChange={(e) => setForm({ ...form, stok: e.target.value })}
                    placeholder="0"
                    className="w-full px-3.5 py-2.5 border-2 border-gray-300 rounded-xl text-sm font-semibold text-gray-900 placeholder:text-gray-500 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#558B2F]/30 focus:border-[#558B2F]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs sm:text-sm text-gray-900 font-bold mb-1.5 flex items-center justify-between gap-2">
                  <span className="flex items-center gap-1.5">
                    <ImageIcon size={14} /> Gambar Produk
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() =>
                        setTampilPanduanStorage((v) => !v)
                      }
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-extrabold flex items-center gap-1 transition ${
                        tampilPanduanStorage
                          ? "bg-[#558B2F] text-white shadow-sm"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      <AlertTriangle size={11} />
                      {tampilPanduanStorage ? "Tutup Panduan" : "Setup Storage"}
                    </button>
                  </div>
                </label>

                {/* Panduan Setup Supabase Storage (collapsible) */}
                {tampilPanduanStorage && (
                  <div className="mb-3 rounded-xl border-2 border-[#558B2F]/30 bg-green-50 p-3.5 text-[11px] sm:text-xs space-y-3 shadow-sm animate-[fadeIn_0.15s_ease-out]">
                    <div className="flex items-start gap-2">
                      <div className="w-6 h-6 rounded-full bg-[#558B2F]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <ShieldCheck size={13} className="text-[#558B2F]" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-extrabold text-gray-900 text-xs sm:text-sm">
                          Setup Storage Bucket &quot;menu-produk&quot;
                        </p>
                        <p className="text-green-800 mt-0.5">
                          Jalankan SQL copy-paste di bawah ini untuk mengizinkan upload &amp; baca gambar:
                        </p>
                      </div>
                    </div>

                    <div className="rounded-xl border-2 border-gray-800 bg-gray-900 overflow-hidden shadow-inner">
                      <div className="flex items-center justify-between px-2.5 py-1.5 bg-gray-800 border-b border-gray-700">
                        <div className="flex items-center gap-1.5">
                          <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                          <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                          <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                        </div>
                        <span className="text-[10px] text-gray-400 font-bold tracking-wide">
                          Supabase SQL Editor
                        </span>
                        <button
                          type="button"
                          onClick={async () => {
                            try {
                              await navigator.clipboard.writeText(SQL_STORAGE_POLICY);
                              setCopyPolicy(true);
                              setTimeout(() => setCopyPolicy(false), 2000);
                            } catch {}
                          }}
                          className={`px-2 py-0.5 rounded text-white text-[10px] font-extrabold transition flex items-center gap-1 ${
                            copyPolicy ? "bg-green-500" : "bg-green-600 hover:bg-green-500"
                          }`}
                        >
                          {copyPolicy ? (
                            <>
                              <Check size={10} /> COPIED
                            </>
                          ) : (
                            <>
                              <CopyIcon size={10} /> COPY SQL
                            </>
                          )}
                        </button>
                      </div>
                      <pre className="p-2.5 text-[10.5px] sm:text-[11px] leading-relaxed font-mono text-green-300 overflow-x-auto max-h-60 overflow-y-auto">
{SQL_STORAGE_POLICY.trim()}
                      </pre>
                    </div>

                    <div className="rounded-lg bg-white border border-green-200 p-2.5 text-green-800 flex items-start gap-2">
                      <span className="text-green-600 font-extrabold mt-0.5">Done?</span>
                      <span>
                        Setelah SQL di-<b>Run</b> → tutup modal ini lalu <b>upload gambar lagi</b>.
                      </span>
                    </div>

                    <div className="rounded-lg bg-white border border-amber-200 p-2.5 text-amber-800 flex items-start gap-2">
                      <span className="text-amber-600 font-bold mt-0.5">Sementara:</span>
                      <span>
                        Pilih tab <b>URL</b> &amp; isi <code className="px-1 bg-amber-50 rounded font-mono">/warung.png</code> sebagai gambar placeholder sampai policy selesai di-setup.
                      </span>
                    </div>
                  </div>
                )}

                {/* Tab Switcher Upload/URL */}
                <div className="grid grid-cols-2 gap-1.5 mb-3 p-1 bg-gray-100 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setModeGambar("upload")}
                    className={`py-2 rounded-lg text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition ${
                      modeGambar === "upload"
                        ? "bg-white text-[#558B2F] shadow-sm border border-gray-200"
                        : "text-gray-600 hover:text-gray-800"
                    }`}
                  >
                    <Upload size={13} /> Upload File
                  </button>
                  <button
                    type="button"
                    onClick={() => setModeGambar("url")}
                    className={`py-2 rounded-lg text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition ${
                      modeGambar === "url"
                        ? "bg-white text-[#558B2F] shadow-sm border border-gray-200"
                        : "text-gray-600 hover:text-gray-800"
                    }`}
                  >
                    <Link2 size={13} /> URL
                  </button>
                </div>

                {modeGambar === "upload" ? (
                  <div className="space-y-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handlePilihFile}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploadingGambar}
                      className="w-full py-6 border-2 border-dashed border-gray-300 rounded-xl hover:border-[#558B2F] hover:bg-green-50/50 transition flex flex-col items-center justify-center gap-2 text-gray-500 hover:text-[#558B2F] disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {uploadingGambar ? (
                        <>
                          <span className="inline-block w-6 h-6 border-2 border-[#558B2F]/30 border-t-[#558B2F] rounded-full animate-spin" />
                          <span className="text-xs sm:text-sm font-semibold">
                            Mengupload gambar...
                          </span>
                        </>
                      ) : (
                        <>
                          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                            <Upload size={18} />
                          </div>
                          <div className="text-center px-4">
                            <p className="text-xs sm:text-sm font-bold">
                              {fileDipilih
                                ? fileDipilih.name
                                : "Klik untuk pilih gambar"}
                            </p>
                            <p className="text-[10px] sm:text-xs text-gray-400 mt-0.5">
                              PNG / JPG / WebP - maks. 5MB
                            </p>
                          </div>
                        </>
                      )}
                    </button>
                    {previewFile && (
                      <div className="w-full h-32 rounded-xl border border-gray-200 overflow-hidden bg-gray-50 relative">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={previewFile}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setFileDipilih(null);
                            setPreviewFile(null);
                            if (fileInputRef.current)
                              fileInputRef.current.value = "";
                          }}
                          className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={form.gambar}
                      onChange={(e) =>
                        setForm({ ...form, gambar: e.target.value })
                      }
                      placeholder="https://... atau /warung.png (opsional)"
                      className="w-full px-3.5 py-2.5 border-2 border-gray-300 rounded-xl text-sm font-semibold text-gray-900 placeholder:text-gray-500 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#558B2F]/30 focus:border-[#558B2F]"
                    />
                    {form.gambar.trim() && (
                      <div className="w-full h-24 rounded-xl border border-gray-200 overflow-hidden bg-gray-50">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={form.gambar}
                          alt="Preview"
                          onError={(e) =>
                            ((e.target as HTMLImageElement).style.display =
                              "none")
                          }
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div>
                <label className="block text-xs sm:text-sm text-gray-900 font-bold mb-1.5">
                  Deskripsi
                </label>
                <textarea
                  value={form.deskripsi}
                  onChange={(e) =>
                    setForm({ ...form, deskripsi: e.target.value })
                  }
                  rows={3}
                  placeholder="Deskripsi singkat produk (opsional)"
                  className="w-full px-3.5 py-2.5 border-2 border-gray-300 rounded-xl text-sm font-semibold text-gray-900 placeholder:text-gray-500 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#558B2F]/30 focus:border-[#558B2F] resize-none"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 p-5 pt-0">
              <button
                type="button"
                onClick={tutupModal}
                className="py-2.5 rounded-xl bg-gray-100 text-gray-700 font-bold hover:bg-gray-200 transition text-sm"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="py-2.5 rounded-xl bg-[#558B2F] text-white font-bold hover:bg-[#497825] transition text-sm shadow disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
              >
                {submitting ? (
                  <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Save size={15} />
                )}
                {modalBuka === "tambah" ? "Simpan" : "Perbarui"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ================= MODAL HAPUS PRODUK ================= */}
      {modalBuka === "hapus" && produkEdit && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={tutupModal}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-gray-200 overflow-hidden"
          >
            <div className="bg-red-600 px-5 py-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center flex-shrink-0">
                <AlertTriangle size={20} className="text-white" />
              </div>
              <div className="text-white min-w-0">
                <p className="text-xs opacity-90">Konfirmasi Hapus</p>
                <p className="text-lg font-extrabold truncate">Hapus Menu?</p>
              </div>
            </div>
            <div className="p-5 space-y-4">
              {pesanError && (
                <div className="flex items-start gap-2 px-3.5 py-2.5 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs sm:text-sm">
                  <AlertTriangle size={16} className="flex-shrink-0 mt-0.5" />
                  <span>{pesanError}</span>
                </div>
              )}
              <p className="text-sm text-gray-700">
                Anda yakin ingin menghapus menu{" "}
                <span className="font-extrabold text-gray-900">
                  &quot;{produkEdit.nama_produk || "Produk"}&quot;
                </span>
                ? Tindakan ini tidak dapat dibatalkan.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 p-5 pt-0">
              <button
                onClick={tutupModal}
                className="py-2.5 rounded-xl bg-gray-100 text-gray-700 font-bold hover:bg-gray-200 transition text-sm"
              >
                Batal
              </button>
              <button
                onClick={handleHapus}
                disabled={submitting}
                className="py-2.5 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700 transition text-sm shadow disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
              >
                {submitting ? (
                  <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Trash2 size={15} />
                )}
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL KATEGORI (TAMBAH / EDIT) ================= */}
      {modalKategori && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={tutupModalKategori}
        >
          <form
            onSubmit={submitKategori}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl w-full max-w-sm shadow-2xl border border-gray-200 overflow-hidden"
          >
            <div className={`px-5 py-4 flex items-center justify-between gap-3 text-white ${modalKategori === "edit" ? "bg-blue-600" : "bg-[#558B2F]"}`}>
              <div>
                <p className="text-xs opacity-90">
                  {modalKategori === "edit" ? "Edit Kategori" : "Tambah Kategori"}
                </p>
                <p className="text-lg font-extrabold truncate">
                  {modalKategori === "edit" ? kategoriEdit?.nama_kategori : "Kategori Baru"}
                </p>
              </div>
              <button
                type="button"
                onClick={tutupModalKategori}
                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
              >
                <X size={16} />
              </button>
            </div>
            <div className="p-5 space-y-4">
              {pesanError && (
                <div className="flex items-start gap-2 px-3 py-2 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs">
                  <AlertTriangle size={14} className="flex-shrink-0 mt-0.5" />
                  <span>{pesanError}</span>
                </div>
              )}
              <div>
                <label className="block text-xs font-semibold text-gray-800 mb-1.5">
                  Nama Kategori <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formKategori}
                  onChange={(e) => setFormKategori(e.target.value)}
                  placeholder="Misal: Makanan Berat, Minuman, Snack"
                  autoFocus
                  className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl text-sm font-semibold placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#558B2F]/30 focus:border-[#558B2F]"
                />
              </div>
              <p className="text-[11px] text-gray-500 flex items-center gap-1.5 bg-gray-50 rounded-lg px-3 py-2">
                <FolderPlus size={13} className="text-[#558B2F]" />
                Total kategori saat ini: <b className="text-gray-800">{kategori.length}</b>
              </p>
            </div>
            <div className={`p-5 pt-0 grid gap-2 ${modalKategori === "edit" ? "grid-cols-3" : "grid-cols-2"}`}>
              {modalKategori === "edit" && (
                <button
                  type="button"
                  disabled={submittingKategori}
                  onClick={hapusKategori}
                  className="py-2.5 rounded-xl bg-red-50 text-red-600 font-bold border border-red-200 hover:bg-red-100 transition text-sm disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
                >
                  <Trash2 size={14} /> Hapus
                </button>
              )}
              <button
                type="button"
                onClick={tutupModalKategori}
                className="py-2.5 rounded-xl bg-gray-100 text-gray-700 font-bold hover:bg-gray-200 transition text-sm"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={submittingKategori || !formKategori.trim()}
                className="py-2.5 rounded-xl text-white font-bold transition text-sm shadow disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
                style={{
                  backgroundColor: submittingKategori ? "#9ca3af" : (modalKategori === "edit" ? "#2563eb" : "#558B2F"),
                }}
              >
                {submittingKategori ? (
                  <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Save size={15} />
                )}
                {modalKategori === "edit" ? "Simpan" : "Tambah"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}