import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">

      {/* Navbar */}

      <nav className="w-full">

        <div className="max-w-5xl mx-auto h-24 flex items-center">

          {/* Logo */}

          <div className="w-52">

            <Image
              src="/logo.png"
              alt="Warung WOW"
              width={120}
              height={90}
            />

          </div>

          {/* Menu */}

          <div className="flex gap-12">

            <Link
              href="/"
              className="font-semibold text-[#2F54EB] border-b-2 border-[#2F54EB] pb-1"
            >
              Beranda
            </Link>

            <Link
              href="/menu"
              className="font-semibold text-[#000000] hover:text-[#2F54EB]"
            >
              Menu
            </Link>

          </div>

        </div>

      </nav>

      {/* Hero */}

<section className="max-w-5xl mx-auto mt-10">

  <div className="flex items-center justify-between">

    {/* Kiri */}

    <div className="w-1/2">

      <h1 className="text-[64px] font-extrabold text-[#2F54EB] leading-none">

        Warung WOW

      </h1>

      <p className="mt-8 text-[22px] font-semibold leading-9 text-black">

        Nikmati Beragam Produk Mayora
        <br />
        Favoritmu Di Warung WOW Terdekat!

      </p>
      <div className="flex gap-8 mt-12">

      <button className="bg-[#2F54EB] text-white px-6 py-3 rounded-xl font-semibold">

        Warung Terdekat

      </button>

      <button className="border-2 border-[#2F54EB] text-[#2F54EB] px-6 py-3 rounded-xl font-semibold">

        Lihat Menu

      </button>

    </div>

    </div>

    {/* Kanan */}

    <div className="w-1/2 flex justify-end">

      <Image
        src="/warung.png"
        alt="Warung"
        width={550}
        height={550}
      />

    </div>

  </div>

    </section>

{/* ================= KATEGORI ================= */}

<section className="max-w-5xl mx-auto mt-20">

  <h2 className="text-2xl font-bold mb-5 text-black">
    Kategori Produk
  </h2>

  <div className="grid grid-cols-4 gap-8">

    {/* Minuman */}
    <div className="bg-white rounded-3xl shadow-lg h-56 flex flex-col justify-center items-center cursor-pointer hover:shadow-xl transition">

      <Image
        src="/category/minuman.png"
        alt="Minuman"
        width={110}
        height={110}
      />

      <p className="font-bold text-xl mt-5 text-black">
        Minuman
      </p>

    </div>

    {/* Makanan */}
    <div className="bg-white rounded-3xl shadow-lg h-56 flex flex-col justify-center items-center cursor-pointer hover:shadow-xl transition">

      <Image
        src="/category/makanan.png"
        alt="Makanan"
        width={110}
        height={110}
      />

      <p className="font-bold text-xl mt-5 text-black">
        Makanan
      </p>

    </div>

    {/* Snack */}
    <div className="bg-white rounded-3xl shadow-lg h-56 flex flex-col justify-center items-center cursor-pointer hover:shadow-xl transition">

      <Image
        src="/category/snack.png"
        alt="Snack"
        width={110}
        height={110}
      />

      <p className="font-bold text-xl mt-5 text-black">
        Snack
      </p>

    </div>

    {/* Produk Mayora */}
    <div className="bg-white rounded-3xl shadow-lg h-56 flex flex-col justify-center items-center cursor-pointer hover:shadow-xl transition">

      <Image
        src="/category/mayora.png"
        alt="Produk Mayora"
        width={130}
        height={130}
      />

      <p className="font-bold text-xl mt-5 text-black">
        Produk Mayora
      </p>

    </div>

  </div>

</section>

{/* ================= BEST SELLER ================= */}

<section className="max-w-5xl mx-auto mt-24">

  {/* Judul */}

  <div className="flex justify-between items-center mb-3">

    <h2 className="text-2xl font-bold text-black">
      Best Seller
    </h2>

    <button className="text-[#2F54EB] font-semibold hover:underline">
      Lihat Semua
    </button>

  </div>

  {/* Card Produk */}

  <div className="grid grid-cols-4 gap-8">

    {/* Produk 1 */}

    <div className="bg-white rounded-3xl shadow-lg p-5">

      <div className="flex justify-center">

        <Image
          src="/products/bengbeng.png"
          alt="Beng Beng"
          width={150}
          height={150}
        />

      </div>

      <h3 className="text-xl font-bold mt-5">
        Beng Beng
      </h3>

      <p className="text-[#2F54EB] font-semibold mt-2">
        Rp 3.500
      </p>

    </div>

    {/* Produk 2 */}

    <div className="bg-white rounded-3xl shadow-lg p-5">

      <div className="flex justify-center">

        <Image
          src="/products/energen.png"
          alt="Energen"
          width={150}
          height={150}
        />

      </div>

      <h3 className="text-xl font-bold mt-5">
        Energen
      </h3>

      <p className="text-[#2F54EB] font-semibold mt-2">
        Rp 4.000
      </p>

    </div>

    {/* Produk 3 */}

    <div className="bg-white rounded-3xl shadow-lg p-5">

      <div className="flex justify-center">

        <Image
          src="/products/roma.png"
          alt="Roma"
          width={150}
          height={150}
        />

      </div>

      <h3 className="text-xl font-bold mt-5">
        Roma Malkist
      </h3>

      <p className="text-[#2F54EB] font-semibold mt-2">
        Rp 8.000
      </p>

    </div>

    {/* Produk 4 */}

    <div className="bg-white rounded-3xl shadow-lg p-5">

      <div className="flex justify-center">

        <Image
          src="/products/tehpucuk.png"
          alt="Teh Pucuk"
          width={150}
          height={150}
        />

      </div>

      <h3 className="text-xl font-bold mt-5">
        Teh Pucuk
      </h3>

      <p className="text-[#2F54EB] font-semibold mt-2">
        Rp 5.000
      </p>

    </div>

  </div>

</section>

    </main>
  );
}