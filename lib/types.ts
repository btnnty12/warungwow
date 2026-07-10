export type Meja = {
  id: number;
  nomor_meja: string;
  qr_code?: string;
  status?: string;
  dibuat_pada?: string;
  diperbarui_pada?: string;
};

export type Kategori = {
  id: number;
  nama_kategori: string;
  dibuat_pada?: string;
  diperbarui_pada?: string;
};

export type Produk = {
  id: number;
  kategori_id?: number;
  nama_produk?: string;
  deskripsi?: string;
  gambar?: string;
  harga?: number | string;
  stok?: number;
  status?: string;
  dibuat_pada?: string;
  diperbarui_pada?: string;
};
