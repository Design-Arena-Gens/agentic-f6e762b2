export default function TeoriaPage() {
  return (
    <div className="space-y-8">
      <section className="card p-6">
        <h1 className="text-xl font-semibold mb-3">Componentes y Funcionamiento de Routers</h1>
        <ul className="list-disc list-inside text-gray-700 space-y-1">
          <li>Plano de control: protocolos de enrutamiento y construcci?n de tabla de rutas</li>
          <li>Plano de datos: reenv?o de paquetes (CEF, FIB)</li>
          <li>Interfaces: f?sicas (GE) y l?gicas (SVI, Loopback)</li>
          <li>Memorias: ROM (bootstrap), Flash (IOS), NVRAM (startup-config), RAM (running-config)</li>
        </ul>
      </section>

      <section className="card p-6">
        <h2 className="font-semibold mb-2">Proceso de Arranque</h2>
        <ol className="list-decimal list-inside text-gray-700 space-y-1">
          <li>POST y carga de bootstrap desde ROM</li>
          <li>Ubicaci?n y carga del IOS desde Flash</li>
          <li>Carga de <code>startup-config</code> a <code>running-config</code> desde NVRAM</li>
          <li>Si no hay configuraci?n, entra en modo inicial</li>
        </ol>
      </section>

      <section className="card p-6">
        <h2 className="font-semibold mb-2">Modos de Configuraci?n y Archivos</h2>
        <ul className="list-disc list-inside text-gray-700 space-y-1">
          <li>Usuario (<code>&gt;</code>), Privilegiado (<code>#</code>), Global (<code>(config)#</code>), Interfaz (<code>(config-if)#</code>)</li>
          <li>Archivos: <code>startup-config</code> en NVRAM y <code>running-config</code> en RAM</li>
          <li>Comandos: <code>copy running-config startup-config</code>, <code>show running-config</code>, <code>show startup-config</code></li>
        </ul>
      </section>

      <section className="card p-6">
        <h2 className="font-semibold mb-2">Enrutamiento Est?tico</h2>
        <p className="text-gray-700 mb-2">Formato: <code>ip route RED MASCARA NEXT_HOP</code></p>
        <ul className="list-disc list-inside text-gray-700 space-y-1">
          <li>Rutas a redes espec?ficas y ruta por defecto (<code>0.0.0.0 0.0.0.0</code>)</li>
          <li>Verificaci?n: <code>show ip route</code></li>
          <li>Eliminaci?n: <code>no ip route ...</code></li>
        </ul>
      </section>

      <section className="card p-6">
        <h2 className="font-semibold mb-2">Listas de Control de Acceso (ACLs)</h2>
        <ul className="list-disc list-inside text-gray-700 space-y-1">
          <li>Est?ndar (1-99): filtran por origen</li>
          <li>Extendidas (100-199): origen, destino, protocolo y puertos</li>
          <li>Ubicaci?n: lo m?s cerca posible del origen (extendidas) / destino (est?ndar)</li>
          <li>Aplicaci?n: <code>ip access-group N in|out</code> sobre la interfaz</li>
          <li>Verificaci?n: <code>show access-lists</code></li>
        </ul>
      </section>
    </div>
  );
}
