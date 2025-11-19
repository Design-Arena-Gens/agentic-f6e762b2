export default function HomePage() {
  return (
    <div className="space-y-8">
      <section className="grid md:grid-cols-3 gap-6">
        <div className="card p-6 md:col-span-2">
          <h1 className="text-2xl font-semibold mb-3">Configuraci?n y Aseguramiento de un Router de Sucursal Remota</h1>
          <p className="text-gray-600 mb-4">
            Duraci?n estimada: <span className="font-medium">90 minutos</span>
          </p>
          <p className="text-gray-700">
            Una peque?a empresa ha establecido una nueva sucursal remota y necesita configurar un router
            para interconectar esta sucursal con la oficina central, as? como proporcionar acceso seguro a Internet para
            los empleados locales. En esta pr?ctica aprender?s a realizar la configuraci?n inicial, el enrutamiento est?tico y
            las ACLs b?sicas para controlar el tr?fico y mejorar la seguridad.
          </p>
        </div>
        <div className="card p-6">
          <h2 className="font-semibold mb-3">Objetivos</h2>
          <ul className="list-disc list-inside space-y-1 text-gray-700">
            <li>Entender componentes y funcionamiento de routers</li>
            <li>Aprender el proceso de arranque y configuraci?n inicial</li>
            <li>Configurar modos, contrase?as e interfaces</li>
            <li>Configurar enrutamiento est?tico y validar tabla de rutas</li>
            <li>Comprender y aplicar ACLs est?ndar y extendidas</li>
          </ul>
        </div>
      </section>

      <section className="card p-6">
        <h2 className="font-semibold mb-4">Topolog?a de Referencia</h2>
        <div className="text-gray-700 space-y-2">
          <p><span className="font-medium">Sucursal:</span> LAN 192.168.10.0/24 en <code>GigabitEthernet0/0</code></p>
          <p><span className="font-medium">WAN a Central:</span> 10.0.12.0/30 ? Sucursal <code>10.0.12.2</code> ? Central <code>10.0.12.1</code> en <code>GigabitEthernet0/1</code></p>
          <p><span className="font-medium">Internet (ISP):</span> 203.0.113.0/30 ? Sucursal <code>203.0.113.2</code> ? ISP <code>203.0.113.1</code> en <code>GigabitEthernet0/2</code></p>
        </div>
      </section>

      <section className="grid md:grid-cols-2 gap-6">
        <a href="/teoria" className="card p-6 hover:ring-2 ring-primary-200">
          <h3 className="font-semibold mb-2">Teor?a</h3>
          <p className="text-gray-600">Componentes, proceso de arranque, modos, archivos, y m?s.</p>
        </a>
        <a href="/guia" className="card p-6 hover:ring-2 ring-primary-200">
          <h3 className="font-semibold mb-2">Gu?a Paso a Paso</h3>
          <p className="text-gray-600">Secuencia recomendada de comandos para completar la pr?ctica.</p>
        </a>
        <a href="/simulador" className="card p-6 hover:ring-2 ring-primary-200 md:col-span-2">
          <h3 className="font-semibold mb-2">Simulador CLI</h3>
          <p className="text-gray-600">Practica en un entorno seguro con validaci?n de comandos.</p>
        </a>
      </section>
    </div>
  );
}
