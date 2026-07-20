'use client';

export default function TombolSudahBayar() {
  const handleKlik = () => {
    const target = document.getElementById('status-pesanan');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <button
      onClick={handleKlik}
      className="w-full mt-6 h-12 rounded-xl bg-[#2F54EB] text-white font-bold text-base hover:bg-blue-700 transition"
    >
      Saya Sudah Bayar
    </button>
  );
}
