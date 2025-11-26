# Troubleshooting Guide - SSL/HTTPS & LAN Accessibility

This guide documents common issues encountered during SSL/HTTPS setup and LAN network accessibility implementation, along with their solutions.

---

## Issue 1: mkcert Installation Requires Admin Privileges

**Problem:**
Installing mkcert via Chocolatey failed with permission errors:
```
Access to the path 'C:\ProgramData\chocolatey\lib-bad' is denied.
```

**Root Cause:**
Chocolatey requires administrator privileges to install packages.

**Solution:**
Run PowerShell as Administrator and install mkcert:
```powershell
# Open PowerShell as Admin (Windows + X → PowerShell (Admin))
choco install mkcert -y

# Install the local Certificate Authority
mkcert -install

# Generate certificates
cd C:\Users\krish\Apps\family-activity-finder-planner\backend
mkdir certs
mkcert -cert-file certs/localhost.pem -key-file certs/localhost-key.pem localhost 127.0.0.1 ::1
```

**Prevention:**
Always run Chocolatey commands in an elevated PowerShell session.

---

## Issue 2: Brave Browser Blocking Localhost HTTPS Requests

**Problem:**
Browser console error: `ERR_BLOCKED_BY_CLIENT`
The app worked on Edge but not on Brave browser.

**Root Cause:**
Brave's aggressive privacy shields block cross-origin requests by default, even on localhost. Since the frontend (port 5174) was calling the backend (port 3001), Brave treated it as a third-party request.

**Solution:**
Disable Brave Shields for localhost:
1. Click the Brave lion icon in the address bar
2. Toggle "Shields" to OFF for `https://localhost:5174`
3. Refresh the page

**Alternative Solution:**
Add localhost to trusted sites in Brave settings:
- Go to `brave://settings/shields`
- Under "Sites that will never use Shields", add:
  - `https://localhost:5174`
  - `https://localhost:3001`

**Tech Note:**
This is only needed in development. In production, frontend and backend will be on the same domain, avoiding cross-origin issues.

---

## Issue 3: iPhone Can't Connect - Certificate Not Trusted

**Problem:**
iPhone shows "This Connection Is Not Private" when accessing `https://192.168.88.36:5174`

**Root Cause:**
iOS Safari doesn't trust the mkcert Certificate Authority by default.

**Solution (Quick - per session):**
1. Open Safari on iPhone
2. Go to `https://192.168.88.36:3001/health` first
3. Tap "Show Details" → "visit this website" → "Visit Website"
4. Accept the certificate warning
5. Now go to `https://192.168.88.36:5174` and use the app

**Solution (Permanent):**
Install mkcert CA on iPhone:
1. On PC, find the CA certificate:
   ```bash
   mkcert -CAROOT
   ```
2. Email or AirDrop the `rootCA.pem` file to your iPhone
3. On iPhone:
   - Open the certificate file → Install Profile
   - Settings → Profile Downloaded → Install
   - Settings → General → About → Certificate Trust Settings
   - Enable full trust for the mkcert CA

---

## Issue 4: VPN Interfering with LAN Access

**Problem:**
Server showed network IP as `10.5.0.2` (VPN interface) instead of actual WiFi IP `192.168.88.36`

**Diagnosis:**
```bash
ipconfig
```
Showed two active interfaces:
- **NordLynx (VPN)**: 10.5.0.2
- **Wi-Fi**: 192.168.88.36

**Root Cause:**
VPN routes all traffic through its tunnel, changing the network interface that servers bind to.

**Solution:**
Use the correct Wi-Fi IP address:
- Access from network devices using: `https://192.168.88.36:5174`
- Not the VPN IP: `https://10.5.0.2:5174`

**Alternative:**
Temporarily disable VPN for local development, or configure VPN to allow local network access (split tunneling).

---

## Issue 5: Windows Firewall Blocking Ports

**Problem:**
Backend accessible from localhost but not from LAN devices. Connection timeout errors.

**Root Cause:**
Windows Firewall blocks incoming connections on ports 3001 and 5174 by default.

**Solution:**
Add firewall rules in PowerShell (Admin):
```powershell
# Allow backend server (port 3001)
netsh advfirewall firewall add rule name="Node.js Server" dir=in action=allow protocol=TCP localport=3001

# Allow frontend dev server (port 5174)
netsh advfirewall firewall add rule name="Vite Dev Server" dir=in action=allow protocol=TCP localport=5174
```

**Verification:**
```powershell
netsh advfirewall firewall show rule name="Node.js Server"
```

---

## Issue 6: CORS Preflight Failures from Network

**Problem:**
Browser console error when accessing from LAN:
```
Access to fetch at 'https://192.168.88.36:3001/api/search' from origin
'https://192.168.88.36:5174' has been blocked by CORS policy: Response to
preflight request doesn't pass access control check: No 'Access-Control-Allow-Origin'
header is present on the requested resource.
```

**Root Cause:**
CORS configuration was too restrictive and didn't allow requests from the actual Wi-Fi network IP.

**Solution:**
Updated `backend/src/server.ts` to allow all origins in development:
```typescript
const corsOptions = {
  origin: process.env.NODE_ENV === 'development'
    ? true  // Allow all origins in development
    : [...specific origins for production],
  credentials: true,
};
```

**Tech Note:**
Setting `origin: true` allows all origins in development, making it easier to test from multiple devices. In production, this should be restricted to specific domains.

---

## Issue 7: Frontend Hardcoded to Localhost

**Problem:**
Frontend always called `https://localhost:3001/api`, which doesn't work from network devices (localhost refers to the device making the request, not the PC running the server).

**Root Cause:**
`.env` file had hardcoded API URL: `VITE_API_URL=https://localhost:3001/api`

**Solution:**
Made API URL dynamic in `client/src/services/api.ts`:
```typescript
function getApiBaseUrl(): string {
  // If VITE_API_URL is set and we're on localhost, use it
  if (import.meta.env.VITE_API_URL && window.location.hostname === 'localhost') {
    return import.meta.env.VITE_API_URL;
  }

  // Otherwise, use the current hostname with backend port
  const protocol = window.location.protocol; // http: or https:
  const hostname = window.location.hostname; // localhost or 192.168.88.36
  const backendPort = 3001;

  return `${protocol}//${hostname}:${backendPort}/api`;
}
```

**How it works:**
- Accessing via `https://localhost:5174` → calls `https://localhost:3001/api`
- Accessing via `https://192.168.88.36:5174` → calls `https://192.168.88.36:3001/api`

---

## Summary of Required Changes

### Backend (`backend/src/server.ts`)
1. ✅ Import `https`, `http`, `fs`, `os` modules
2. ✅ Add `getLocalIP()` helper function
3. ✅ Configure CORS to allow all origins in development
4. ✅ Update server to support HTTPS with certificates
5. ✅ Display both local and network URLs on startup

### Frontend (`client/vite.config.ts`)
1. ✅ Import `fs` and `path` modules
2. ✅ Configure HTTPS with mkcert certificates
3. ✅ Set `host: true` to expose to LAN

### Frontend API (`client/src/services/api.ts`)
1. ✅ Add `getApiBaseUrl()` function for dynamic API URLs
2. ✅ Auto-detect hostname and protocol

### Environment Variables
1. ✅ `backend/.env`: Add `USE_HTTPS=true`
2. ✅ `backend/.env.example`: Update with HTTPS URLs
3. ✅ `client/.env`: Update to HTTPS (for localhost development)

### Git Ignore
1. ✅ Add `certs/` to `backend/.gitignore` (never commit SSL private keys!)

---

## Testing Checklist

### Localhost (Same Machine)
- [ ] Frontend accessible at `https://localhost:5174`
- [ ] Backend accessible at `https://localhost:3001/health`
- [ ] Search functionality works
- [ ] No certificate warnings (mkcert CA installed)
- [ ] Works on Chrome/Edge
- [ ] Works on Brave (with shields disabled)

### LAN Network (Other Devices)
- [ ] Frontend accessible at `https://[YOUR_IP]:5174`
- [ ] Backend accessible at `https://[YOUR_IP]:3001/health`
- [ ] Search functionality works from network devices
- [ ] Certificate warning can be accepted (or CA installed on device)
- [ ] Windows Firewall rules applied
- [ ] VPN disabled or configured for local network access

---

## Architecture Notes

### Why Dynamic API URLs?
Hardcoding API URLs to `localhost` only works when accessing from the same machine. By detecting the current hostname dynamically, the app works seamlessly whether accessed locally or from the network.

### Why HTTPS in Development?
1. **Browser APIs**: Geolocation, service workers, and other modern browser APIs require HTTPS
2. **Production Parity**: Development environment matches production
3. **Security**: Catches mixed-content issues early
4. **Trust**: mkcert creates locally-trusted certificates without browser warnings

### Why Bind to 0.0.0.0?
Binding to `0.0.0.0` makes the server listen on all network interfaces, allowing access from:
- `localhost` (127.0.0.1)
- LAN IP (e.g., 192.168.88.36)
- VPN IP (e.g., 10.5.0.2)

---

## Quick Reference Commands

### Find Process on Port
```bash
netstat -ano | findstr :3001
```

### Kill Process (PowerShell Admin)
```powershell
Stop-Process -Id [PID] -Force
```

### Check Firewall Rules
```powershell
netsh advfirewall firewall show rule name="Node.js Server"
```

### Find mkcert CA Location
```bash
mkcert -CAROOT
```

### Get Local IP Address
```bash
ipconfig | findstr "IPv4"
```

---

## Future Improvements

1. **Automated Certificate Setup**: Add npm script to generate certificates automatically
2. **Environment Detection**: Auto-detect if mkcert is installed and enable HTTPS accordingly
3. **Mobile-Friendly Error Messages**: Show QR code with network URL for easy mobile access
4. **Certificate Installation Guide**: Add interactive guide for installing CA on mobile devices
5. **Network Detection**: Auto-detect if accessed from LAN and show appropriate instructions
