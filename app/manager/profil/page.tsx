"use client";

import { useState } from "react";
import { Calendar, Bell } from "lucide-react";

export default function ProfileManagerPage() {
  const [nama, setNama] = useState("Manager Warung");
  const [email, setEmail] = useState("manager@wow.com");
  const [telepon, setTelepon] = useState("0812 3456 7890");

  const handleSubmit = () => {
    alert("Perubahan berhasil disimpan");
  };

  return (
    <div className="min-h-screen bg-[#F5F6FA] p-8">


      {/* Header Profile */}
      <div className="flex items-center justify-between mb-8">

        {/* Judul */}
        <h1 className="text-3xl font-bold text-gray-800">
          Profile
        </h1>


        {/* Tanggal dan Notifikasi */}
        <div className="flex items-center gap-2">


          {/* Tanggal */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 rounded-lg border border-gray-200">

            <Calendar
              size={14}
              className="text-gray-600"
            />

            <span className="text-gray-700 font-medium text-sm">
              20 Mei 2026
            </span>

          </div>


          {/* Bell */}
          <button
            className="
              w-9
              h-9
              rounded-lg
              bg-gray-50
              border
              border-gray-200
              flex
              items-center
              justify-center
              hover:bg-gray-100
              transition
            "
          >

            <Bell
              size={16}
              className="text-gray-700"
            />

          </button>


        </div>

      </div>



      {/* Card Profile */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 w-[850px]">


        <div className="space-y-6">


          {/* Nama */}
          <div className="flex items-center gap-6">

            <label className="w-40 text-base font-semibold text-gray-700">
              Nama Lengkap
            </label>


            <input
              type="text"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              className="
                flex-1
                h-12
                rounded-lg
                border border-gray-300
                px-4
                text-base
                text-black
                focus:outline-none
                focus:ring-2
                focus:ring-[#64A51C]
              "
            />

          </div>



          {/* Email */}
          <div className="flex items-center gap-6">

            <label className="w-40 text-base font-semibold text-gray-700">
              Email
            </label>


            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="
                flex-1
                h-12
                rounded-lg
                border border-gray-300
                px-4
                text-base
                text-black
                focus:outline-none
                focus:ring-2
                focus:ring-[#64A51C]
              "
            />

          </div>



          {/* Telepon */}
          <div className="flex items-center gap-6">

            <label className="w-40 text-base font-semibold text-gray-700">
              No. Telepon
            </label>


            <input
              type="text"
              value={telepon}
              onChange={(e) => setTelepon(e.target.value)}
              className="
                flex-1
                h-12
                rounded-lg
                border border-gray-300
                px-4
                text-base
                text-black
                focus:outline-none
                focus:ring-2
                focus:ring-[#64A51C]
              "
            />

          </div>



          {/* Tombol */}
          <div className="flex justify-end pt-4">

            <button
              onClick={handleSubmit}
              className="
                bg-[#64A51C]
                hover:bg-[#558B2F]
                text-white
                font-semibold
                rounded-lg
                px-7
                py-2.5
                text-sm
              "
            >
              Simpan Perubahan
            </button>

          </div>


        </div>


      </div>


    </div>
  );
}