export default function Footer() {
  return (
    <footer className="border-t border-gray-200 mt-16 py-8 text-center text-sm text-gray-500">
      <p className="font-serif text-lg font-bold text-ink mb-1">Voice of Democracy</p>
      <p>© {new Date().getFullYear()} Voice of Democracy. All rights reserved.</p>
    </footer>
  );
}
