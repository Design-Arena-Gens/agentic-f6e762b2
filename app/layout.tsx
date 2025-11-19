import type { Metadata } from 'next';
import './globals.css';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Configuraci?n y Aseguramiento de un Router de Sucursal',
  description: 'Pr?ctica guiada con simulador CLI para routers',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-gray-50">
        <header className="border-b bg-white">
          <nav className="container-max flex items-center justify-between py-4">
            <Link href="/" className="flex items-center gap-2 font-semibold text-gray-800">
              <span className="badge">Pr?ctica</span>
              <span>Router de Sucursal Remota</span>
            </Link>
            <div className="flex gap-4 text-sm">
              <Link href="/" className="text-gray-600 hover:text-gray-900">Inicio</Link>
              <Link href="/teoria" className="text-gray-600 hover:text-gray-900">Teor?a</Link>
              <Link href="/guia" className="text-gray-600 hover:text-gray-900">Gu?a</Link>
              <Link href="/simulador" className="text-gray-600 hover:text-gray-900">Simulador CLI</Link>
            </div>
          </nav>
        </header>
        <main className="container-max py-8">
          {children}
        </main>
        <footer className="mt-16 border-t bg-white">
          <div className="container-max py-6 text-xs text-gray-500">
            ? {new Date().getFullYear()} Pr?ctica de Redes ? Sucursal Remota
          </div>
        </footer>
      </body>
    </html>
  );
}
