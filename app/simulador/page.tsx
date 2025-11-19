"use client";

import { useMemo } from 'react';
import { RouterCli } from '../../components/cli/RouterCli';

export default function SimuladorPage() {
  const scenario = useMemo(
    () => ({
      lan: { network: '192.168.10.0', mask: '255.255.255.0', interface: 'g0/0', ip: '192.168.10.1' },
      wan: { network: '10.0.12.0', mask: '255.255.255.252', interface: 'g0/1', ip: '10.0.12.2', peer: '10.0.12.1' },
      isp: { network: '203.0.113.0', mask: '255.255.255.252', interface: 'g0/2', ip: '203.0.113.2', gw: '203.0.113.1' }
    }),
    []
  );

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <div className="card p-5 lg:col-span-2">
        <h1 className="text-xl font-semibold mb-3">Simulador CLI de Router</h1>
        <RouterCli initialHostname="Router" scenario={scenario} />
      </div>
      <aside className="card p-5 space-y-4">
        <h2 className="font-semibold">Objetivo del Laboratorio</h2>
        <p className="text-gray-700 text-sm">
          Configura el router de la sucursal con interfaces LAN/WAN/ISP, a?ade una ruta por defecto hacia el ISP
          y aplica una ACL para permitir solo HTTP/HTTPS hacia Internet.
        </p>
        <div>
          <h3 className="font-semibold mb-2">Comandos Soportados (resumen)</h3>
          <ul className="text-sm text-gray-700 list-disc list-inside space-y-1">
            <li><code>enable</code>, <code>configure terminal</code>, <code>exit</code>, <code>end</code></li>
            <li><code>hostname NOMBRE</code></li>
            <li><code>interface g0/0|g0/1|g0/2</code>, <code>ip address A.B.C.D M.M.M.M</code>, <code>no shutdown</code>, <code>shutdown</code></li>
            <li><code>show ip interface brief</code>, <code>show running-config</code></li>
            <li><code>ip route RED MASCARA NEXT_HOP</code>, <code>no ip route ...</code>, <code>show ip route</code></li>
            <li><code>access-list N permit|deny ip any any</code> (N 1-199)</li>
            <li><code>ip access-group N in|out</code> (en modo interfaz)</li>
            <li><code>show access-lists</code></li>
          </ul>
        </div>
        <div className="text-xs text-gray-500">
          Nota: Este simulador simplifica el comportamiento de IOS para fines did?cticos.
        </div>
      </aside>
    </div>
  );
}
