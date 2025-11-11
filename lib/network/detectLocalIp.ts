export async function detectLocalIP(): Promise<string> {
  // Try server-provided host first (useful in dev when Next prints the LAN host)
  try {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), 800);
    const res = await fetch('/api/host-ip', { signal: controller.signal });
    clearTimeout(id);
    if (res.ok) {
      const data = await res.json();
      if (data && data.host) return data.host;
    }
  } catch (e) {
    // ignore and fallback
  }

  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !window.RTCPeerConnection) {
      resolve(window.location.host);
      return;
    }

    const pc = new RTCPeerConnection({ iceServers: [] });
    let resolved = false;

    try { pc.createDataChannel(''); } catch (e) {}

    pc.createOffer()
      .then(offer => pc.setLocalDescription(offer))
      .catch(() => {});

    pc.onicecandidate = (e) => {
      if (!e || !e.candidate) return;
      const cand = e.candidate.candidate;
      const ipMatch = cand.match(/(?:[0-9]{1,3}\.){3}[0-9]{1,3}/);
      if (ipMatch) {
        const ip = ipMatch[0];
        if (ip.startsWith('192.') || ip.startsWith('10.') || ip.startsWith('172.')) {
          if (!resolved) {
            resolved = true;
            pc.close();
            resolve(ip + ':' + window.location.port);
          }
        } else {
          if (!resolved) {
            resolved = true;
            pc.close();
            resolve(ip + ':' + window.location.port);
          }
        }
      }
    };

    setTimeout(() => {
      if (!resolved) {
        resolved = true;
        try { pc.close(); } catch (e) {}
        resolve(window.location.host);
      }
    }, 1500);
  });
}
