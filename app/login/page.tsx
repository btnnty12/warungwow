import Image from "next/image";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex bg-[#E8F5E9] p-4">
      {/* Container Utama yang Nyatu */}
      <div className="flex flex-col md:flex-row w-full bg-white rounded-2xl overflow-hidden shadow-lg">
        {/* Bagian Kiri: Gambar (desktop) & Header Gambar (mobile) */}
        <div className="w-full md:w-1/2 h-48 md:h-auto relative">
          <Image
            src="/login.png"
            alt="Warung WOW"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Bagian Kanan: Form Login */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-[#558B2F]">LOGIN</h1>
              <p className="text-gray-500 text-lg mt-2">Masuk untuk Melanjutkan</p>
            </div>

            <form className="space-y-6">
              {/* Pilih Role */}
              <div>
                <label className="block text-base font-semibold text-black mb-2">
                  Pilih Role
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2">
                    <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                    </svg>
                  </div>
                  <select className="w-full pl-14 pr-4 py-4 border-2 border-[#558B2F] rounded-xl text-lg font-semibold bg-white focus:outline-none focus:ring-2 focus:ring-[#558B2F] appearance-none cursor-pointer">
                    <option value="manager">Manager</option>
                    <option value="karyawan">Karyawan</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg className="w-5 h-5 text-[#558B2F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </div>
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-base font-semibold text-black mb-2">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2">
                    <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                    </svg>
                  </div>
                  <input
                    type="email"
                    placeholder="Masukkan Email"
                    className="w-full pl-14 pr-4 py-4 border-2 border-gray-300 rounded-xl text-lg font-semibold placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#558B2F] focus:border-[#558B2F]"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-base font-semibold text-black mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2">
                    <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                    </svg>
                  </div>
                  <input
                    type="password"
                    placeholder="Masukkan password"
                    className="w-full pl-14 pr-12 py-4 border-2 border-gray-300 rounded-xl text-lg font-semibold placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#558B2F] focus:border-[#558B2F]"
                  />
                  <button
                    type="button"
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path>
                    </svg>
                  </button>
                </div>
              </div>

              {/* Ingat Saya & Lupa Password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="remember" className="w-5 h-5 border-2 border-gray-300 rounded" />
                  <label htmlFor="remember" className="text-base font-semibold text-black">
                    Ingat Saya
                  </label>
                </div>
                <button type="button" className="text-[#558B2F] font-semibold hover:underline">
                  Lupa Password ?
                </button>
              </div>

              {/* Tombol Masuk */}
              <button
                type="submit"
                className="w-full bg-[#558B2F] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#33691E] transition"
              >
                Masuk
              </button>
            </form>

            {/* Footer */}
            <div className="mt-6 text-center text-gray-500 font-semibold text-lg">
              @ 2026 warung wow. All right reserved
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
