export default function GuiaPage() {
  return (
    <div className="card p-6 space-y-6">
      <h1 className="text-xl font-semibold">Gu?a Paso a Paso</h1>
      <ol className="list-decimal list-inside text-gray-700 space-y-3">
        <li>Entrar al modo privilegiado: <code>enable</code></li>
        <li>Entrar al modo de configuraci?n global: <code>configure terminal</code></li>
        <li>Configurar nombre de host: <code>hostname SucursalRTR</code></li>
        <li>Configurar interfaces:
          <ul className="list-disc list-inside ml-5 space-y-1">
            <li>LAN: <code>int g0/0</code> ? <code>ip address 192.168.10.1 255.255.255.0</code> ? <code>no shutdown</code></li>
            <li>WAN a Central: <code>int g0/1</code> ? <code>ip address 10.0.12.2 255.255.255.252</code> ? <code>no shutdown</code></li>
            <li>Internet: <code>int g0/2</code> ? <code>ip address 203.0.113.2 255.255.255.252</code> ? <code>no shutdown</code></li>
          </ul>
        </li>
        <li>Enrutamiento est?tico:
          <ul className="list-disc list-inside ml-5 space-y-1">
            <li>Rutas a redes de central seg?n sea necesario</li>
            <li>Ruta por defecto hacia ISP: <code>ip route 0.0.0.0 0.0.0.0 203.0.113.1</code></li>
          </ul>
        </li>
        <li>ACLs de ejemplo:
          <ul className="list-disc list-inside ml-5 space-y-1">
            <li>Permitir solo HTTP/HTTPS a Internet (extendida 100) y denegar el resto</li>
            <li>Aplicar en <code>g0/2</code> en salida: <code>ip access-group 100 out</code></li>
          </ul>
        </li>
        <li>Verificaci?n:
          <ul className="list-disc list-inside ml-5 space-y-1">
            <li><code>show ip interface brief</code></li>
            <li><code>show ip route</code></li>
            <li><code>show access-lists</code></li>
          </ul>
        </li>
      </ol>
      <p className="text-sm text-gray-500">Puedes practicar todos estos pasos en el Simulador CLI.</p>
    </div>
  );
}
