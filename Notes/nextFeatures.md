## Next Features

### QR Code
- Add a QR Code on the bottom of the page for quick scanning with a phone to open the website from the local network (should utilize whatever host IP address is on LAN).
    - If there is an env var "DEPLOYMENT=WEB" (can be NEXT_PUBLIC if needed) should use window.host instead (assuming a url).
- The QR code should only appears on screens larger than mobile phones.

### Drag and Drop
Primarily for desktop, but very nice to have there indeed.