import { randomInt } from 'crypto';
import { nanoid } from 'nanoid';
import os from 'os';

/**
 * Determine the first non‑internal IPv4 address on the host machine. If none
 * are available (e.g. no active LAN), fall back to localhost. This is used
 * to construct a join URL that phones can reach over Wi‑Fi or a hotspot.
 */
export function pickLanIp(): string {
  const nets = os.networkInterfaces();
  type Candidate = { name: string; address: string };
  const candidates: Candidate[] = [];

  for (const name of Object.keys(nets)) {
    const interfaces = nets[name];
    if (!interfaces) continue;
    for (const iface of interfaces) {
      if (iface.family === 'IPv4' && !iface.internal && iface.address) {
        candidates.push({ name, address: iface.address });
      }
    }
  }

  if (candidates.length === 0) return 'localhost';

  // Score candidates: prefer common physical interface names (wifi/eth)
  // and private IPv4 ranges; penalize known virtual/adapters.
  const virtualKeywords = ['vbox', 'virtual', 'vmware', 'docker', 'host-only', 'loopback', 'hyper-v', 'vethernet', 'hamachi', 'vpn'];
  const preferredRegex = /^(en|eth|ethernet|wlan|wi-?fi|wifi|wl|enp|wlp)/i;
  const privateRegex = /^(10\.|192\.168\.|172\.(1[6-9]|2[0-9]|3[0-1])\.)/;

  function score(c: Candidate): number {
    let s = 0;
    if (preferredRegex.test(c.name)) s += 50;
    if (privateRegex.test(c.address)) s += 10;
    const lower = c.name.toLowerCase();
    for (const k of virtualKeywords) if (lower.includes(k)) s -= 100;
    return s;
  }

  candidates.sort((a, b) => score(b) - score(a));
  return candidates[0].address || 'localhost';
}
