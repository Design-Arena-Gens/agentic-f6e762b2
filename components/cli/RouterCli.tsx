"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

type InterfaceId = 'g0/0' | 'g0/1' | 'g0/2';

type InterfaceState = {
  name: InterfaceId;
  ipAddress?: string;
  netmask?: string;
  isShutdown: boolean;
  description?: string;
  aclIn?: number;
  aclOut?: number;
};

type StaticRoute = {
  network: string;
  netmask: string;
  nextHop: string;
};

type AclEntry = {
  number: number;
  action: 'permit' | 'deny';
  protocol: 'ip';
  src: 'any';
  dst: 'any';
};

export type Scenario = {
  lan: { network: string; mask: string; interface: InterfaceId; ip: string };
  wan: { network: string; mask: string; interface: InterfaceId; ip: string; peer: string };
  isp: { network: string; mask: string; interface: InterfaceId; ip: string; gw: string };
};

type Mode = 'userExec' | 'privExec' | 'global' | 'ifconfig';

function formatPrompt(hostname: string, mode: Mode, ifName?: string): string {
  if (mode === 'userExec') return `${hostname}>`;
  if (mode === 'privExec') return `${hostname}#`;
  if (mode === 'global') return `${hostname}(config)#`;
  return `${hostname}(config-if-${ifName})#`;
}

function pad(str: string, len: number): string {
  return str + ' '.repeat(Math.max(0, len - str.length));
}

function isValidIp(ip: string): boolean {
  const parts = ip.split('.');
  if (parts.length !== 4) return false;
  return parts.every((p) => {
    const n = Number(p);
    return Number.isInteger(n) && n >= 0 && n <= 255;
  });
}

export function RouterCli({ initialHostname, scenario }: { initialHostname: string; scenario: Scenario }) {
  const [hostname, setHostname] = useState<string>(initialHostname);
  const [mode, setMode] = useState<Mode>('userExec');
  const [currentIf, setCurrentIf] = useState<InterfaceId | undefined>(undefined);
  const [history, setHistory] = useState<string[]>([`${formatPrompt(hostname, mode)}`]);
  const [cliInput, setCliInput] = useState<string>('');
  const [routes, setRoutes] = useState<StaticRoute[]>([]);
  const [acls, setAcls] = useState<AclEntry[]>([]);

  const interfaces = useMemo<Record<InterfaceId, InterfaceState>>(
    () => ({
      'g0/0': { name: 'g0/0', isShutdown: true },
      'g0/1': { name: 'g0/1', isShutdown: true },
      'g0/2': { name: 'g0/2', isShutdown: true },
    }),
    []
  );
  const [ifs, setIfs] = useState<Record<InterfaceId, InterfaceState>>(interfaces);

  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => inputRef.current?.focus(), []);

  const append = useCallback((lines: string[]) => {
    setHistory((h) => {
      const next = [...h];
      // replace last prompt with output and then add a new prompt
      next[next.length - 1] = next[next.length - 1];
      next.push(...lines);
      next.push(formatPrompt(hostname, mode, currentIf));
      return next;
    });
  }, [hostname, mode, currentIf]);

  const replacePrompt = useCallback(() => {
    setHistory((h) => {
      const base = h.slice(0, -1);
      return [...base, formatPrompt(hostname, mode, currentIf)];
    });
  }, [hostname, mode, currentIf]);

  useEffect(() => {
    replacePrompt();
  }, [hostname, mode, currentIf, replacePrompt]);

  const showIpIntBrief = useCallback(() => {
    const header = 'Interface       IP-Address      OK? Method Status    Protocol';
    const lines = [header];
    (['g0/0', 'g0/1', 'g0/2'] as InterfaceId[]).forEach((id) => {
      const itf = ifs[id];
      const ip = itf.ipAddress ?? 'unassigned';
      const status = itf.isShutdown ? 'administratively down' : 'up';
      const proto = itf.isShutdown ? 'down' : 'up';
      lines.push(
        `${pad(id, 15)} ${pad(ip, 15)} YES manual ${pad(status, 10)} ${proto}`
      );
    });
    return lines;
  }, [ifs]);

  const showRun = useCallback(() => {
    const lines: string[] = [];
    lines.push('Building configuration...');
    lines.push('');
    lines.push(`hostname ${hostname}`);
    (['g0/0', 'g0/1', 'g0/2'] as InterfaceId[]).forEach((id) => {
      const itf = ifs[id];
      lines.push(`interface ${id}`);
      if (itf.description) lines.push(` description ${itf.description}`);
      if (itf.ipAddress && itf.netmask) lines.push(` ip address ${itf.ipAddress} ${itf.netmask}`);
      if (typeof itf.aclIn === 'number') lines.push(` ip access-group ${itf.aclIn} in`);
      if (typeof itf.aclOut === 'number') lines.push(` ip access-group ${itf.aclOut} out`);
      lines.push(itf.isShutdown ? ' shutdown' : ' no shutdown');
      lines.push('!');
    });
    routes.forEach((r) => lines.push(`ip route ${r.network} ${r.netmask} ${r.nextHop}`));
    return lines;
  }, [hostname, ifs, routes]);

  const showIpRoute = useCallback(() => {
    const lines: string[] = [];
    routes.forEach((r) => {
      lines.push(`S    ${r.network} ${r.netmask} [1/0] via ${r.nextHop}`);
    });
    if (lines.length === 0) lines.push('Gateway of last resort is not set');
    return lines;
  }, [routes]);

  const showAccessLists = useCallback(() => {
    const byNum = new Map<number, AclEntry[]>();
    for (const entry of acls) {
      const arr = byNum.get(entry.number) ?? [];
      arr.push(entry);
      byNum.set(entry.number, arr);
    }
    const lines: string[] = [];
    const keys = Array.from(byNum.keys()).sort((a, b) => a - b);
    keys.forEach((num) => {
      lines.push(`Standard IP access list ${num}`);
      for (const e of byNum.get(num)!) {
        lines.push(`    ${e.action} ${e.protocol} any any`);
      }
    });
    if (lines.length === 0) lines.push('No access list is configured');
    return lines;
  }, [acls]);

  const parseInterfaceId = (tok: string): InterfaceId | undefined => {
    const t = tok.toLowerCase();
    if (t === 'g0/0' || t === 'gigabitethernet0/0') return 'g0/0';
    if (t === 'g0/1' || t === 'gigabitethernet0/1') return 'g0/1';
    if (t === 'g0/2' || t === 'gigabitethernet0/2') return 'g0/2';
    return undefined;
  };

  const handleCommand = useCallback((raw: string) => {
    const input = raw.trim();
    if (!input) return;

    const tokens = input.split(/\s+/);
    const cmd = tokens[0].toLowerCase();
    const out: string[] = [];

    // Global commands available in many modes
    if (cmd === 'end') {
      setMode('privExec');
      setCurrentIf(undefined);
      append([]);
      return;
    }
    if (cmd === 'exit') {
      if (mode === 'ifconfig') {
        setMode('global');
        setCurrentIf(undefined);
      } else if (mode === 'global') {
        setMode('privExec');
      } else if (mode === 'privExec') {
        setMode('userExec');
      }
      append([]);
      return;
    }

    if (mode === 'userExec') {
      if (cmd === 'enable') {
        setMode('privExec');
      } else {
        out.push('% Invalid input detected at '^' marker.');
      }
      append(out);
      return;
    }

    if (mode === 'privExec') {
      if (cmd === 'configure' && tokens[1]?.toLowerCase() === 'terminal') {
        setMode('global');
        append([]);
        return;
      }
      if (cmd === 'show') {
        const sub = tokens[1]?.toLowerCase();
        if (sub === 'ip' && tokens[2]?.toLowerCase() === 'interface' && tokens[3]?.toLowerCase() === 'brief') {
          append(showIpIntBrief());
          return;
        }
        if (sub === 'running-config') {
          append(showRun());
          return;
        }
        if (sub === 'ip' && tokens[2]?.toLowerCase() === 'route') {
          append(showIpRoute());
          return;
        }
        if (sub === 'access-lists') {
          append(showAccessLists());
          return;
        }
      }
      out.push('% Unrecognized command');
      append(out);
      return;
    }

    if (mode === 'global') {
      if (cmd === 'hostname' && tokens[1]) {
        setHostname(tokens[1]);
        append([]);
        return;
      }
      if (cmd === 'interface' && tokens[1]) {
        const id = parseInterfaceId(tokens[1]);
        if (!id) {
          append(['% Invalid interface']);
          return;
        }
        setCurrentIf(id);
        setMode('ifconfig');
        append([]);
        return;
      }
      if (cmd === 'ip' && tokens[1]?.toLowerCase() === 'route') {
        const [network, netmask, nextHop] = [tokens[2], tokens[3], tokens[4]];
        if (!network || !netmask || !nextHop || !isValidIp(nextHop)) {
          append(['% Incomplete or invalid command']);
          return;
        }
        setRoutes((prev) => {
          const exists = prev.some((r) => r.network === network && r.netmask === netmask && r.nextHop === nextHop);
          if (exists) return prev;
          return [...prev, { network, netmask, nextHop }];
        });
        append([]);
        return;
      }
      if (cmd === 'no' && tokens[1]?.toLowerCase() === 'ip' && tokens[2]?.toLowerCase() === 'route') {
        const [network, netmask, nextHop] = [tokens[3], tokens[4], tokens[5]];
        setRoutes((prev) => prev.filter((r) => !(r.network === network && r.netmask === netmask && r.nextHop === nextHop)));
        append([]);
        return;
      }
      if (cmd === 'access-list') {
        const num = Number(tokens[1]);
        const action = tokens[2]?.toLowerCase();
        if (!Number.isInteger(num) || num < 1 || num > 199 || (action !== 'permit' && action !== 'deny')) {
          append(['% Invalid access-list definition']);
          return;
        }
        // Simplified: only support "ip any any"
        setAcls((prev) => [...prev, { number: num, action: action as 'permit' | 'deny', protocol: 'ip', src: 'any', dst: 'any' }]);
        append([]);
        return;
      }
      if (cmd === 'show') {
        const sub = tokens[1]?.toLowerCase();
        if (sub === 'access-lists') {
          append(showAccessLists());
          return;
        }
      }
      append(['% Unrecognized command in config mode']);
      return;
    }

    if (mode === 'ifconfig') {
      const id = currentIf!;
      if (cmd === 'ip' && tokens[1]?.toLowerCase() === 'address') {
        const ip = tokens[2];
        const mask = tokens[3];
        if (!ip || !mask || !isValidIp(ip) || !isValidIp(mask)) {
          append(['% Invalid IP address or mask']);
          return;
        }
        setIfs((prev) => ({ ...prev, [id]: { ...prev[id], ipAddress: ip, netmask: mask } }));
        append([]);
        return;
      }
      if (cmd === 'description') {
        const desc = tokens.slice(1).join(' ');
        setIfs((prev) => ({ ...prev, [id]: { ...prev[id], description: desc } }));
        append([]);
        return;
      }
      if (cmd === 'shutdown') {
        setIfs((prev) => ({ ...prev, [id]: { ...prev[id], isShutdown: true } }));
        append([]);
        return;
      }
      if (cmd === 'no' && tokens[1]?.toLowerCase() === 'shutdown') {
        setIfs((prev) => ({ ...prev, [id]: { ...prev[id], isShutdown: false } }));
        append([]);
        return;
      }
      if (cmd === 'ip' && tokens[1]?.toLowerCase() === 'access-group') {
        const num = Number(tokens[2]);
        const dir = tokens[3]?.toLowerCase();
        if (!Number.isInteger(num) || (dir !== 'in' && dir !== 'out')) {
          append(['% Invalid access-group']);
          return;
        }
        setIfs((prev) => ({
          ...prev,
          [id]: { ...prev[id], ...(dir === 'in' ? { aclIn: num } : { aclOut: num }) },
        }));
        append([]);
        return;
      }
      append(['% Unrecognized interface config command']);
      return;
    }
  }, [append, mode, currentIf, setIfs, setRoutes, setAcls, showIpIntBrief, showRun, showIpRoute, showAccessLists]);

  const onSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const command = cliInput;
      setCliInput('');
      setHistory((h) => {
        const base = h.slice(0, -1);
        return [...base, `${formatPrompt(hostname, mode, currentIf)} ${command}`];
      });
      handleCommand(command);
    },
    [cliInput, hostname, mode, currentIf, handleCommand]
  );

  return (
    <div className="grid md:grid-rows-[1fr_auto] h-[600px]">
      <div className="bg-black text-green-200 rounded-t-md p-3 font-mono text-sm overflow-auto border border-b-0 border-gray-800">
        {history.map((line, idx) => (
          <div key={idx} className="whitespace-pre-wrap">
            {line}
          </div>
        ))}
      </div>
      <form onSubmit={onSubmit} className="flex border border-t-0 border-gray-800 rounded-b-md">
        <div className="px-3 py-2 bg-gray-900 text-green-300 font-mono">$</div>
        <input
          ref={inputRef}
          value={cliInput}
          onChange={(e) => setCliInput(e.target.value)}
          className="flex-1 px-3 py-2 font-mono bg-black text-green-200 outline-none"
          autoComplete="off"
          placeholder="Escribe un comando y presiona Enter"
        />
      </form>
    </div>
  );
}
