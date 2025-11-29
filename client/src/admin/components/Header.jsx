export default function Header() {
  return (
    <div className="h-14 bg-white shadow flex items-center px-4 justify-between">
      <h2 className="text-lg font-semibold">Admin Dashboard</h2>

      <div className="flex items-center gap-4">
        <span className="text-gray-600">Hello Admin</span>
      </div>
    </div>
  );
}
