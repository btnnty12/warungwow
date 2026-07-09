export default function LayoutPelanggan({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-gray-100">

      <div className="max-w-[1440px] mx-auto">

        {children}

      </div>

    </main>
  );
}