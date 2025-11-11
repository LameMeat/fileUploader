import os from 'os';
import type { NextApiRequest, NextApiResponse } from 'next';

function findLanIp(): string | null {
  const ifaces = os.networkInterfaces();
  for (const name of Object.keys(ifaces)) {
    const nets = ifaces[name];
    if (!nets) continue;
    for (const net of nets) {
      if (net.family === 'IPv4' && !net.internal) {
        // prefer common LAN ranges
        if (net.address.startsWith('192.') || net.address.startsWith('10.') || net.address.startsWith('172.')) {
          return net.address;
        }
      }
    }
  }
  // fallback: return first non-internal IPv4
  for (const name of Object.keys(ifaces)) {
    const nets = ifaces[name];
    if (!nets) continue;
    for (const net of nets) {
      if (net.family === 'IPv4' && !net.internal) {
        return net.address;
      }
    }
  }
  return null;
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const ip = findLanIp();
  const port = process.env.PORT || '3000';
  if (ip) {
    res.status(200).json({ host: `${ip}:${port}` });
  } else {
    res.status(200).json({ host: null });
  }
}
