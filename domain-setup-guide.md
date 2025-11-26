# Domain Setup Guide - family-activity.local

This guide shows how to set up the friendly domain name `family-activity.local` so you can access the app easily from any device on your network.

---

## Prerequisites

- App is running on PC with IP: `192.168.88.36` (check with `ipconfig`)
- SSL certificates regenerated to include the domain (see below)
- Windows Firewall rules configured

---

## Step 1: Regenerate SSL Certificate

The SSL certificate must include the new domain name.

**On your PC (PowerShell as Admin):**
```powershell
cd C:\Users\krish\Apps\family-activity-finder-planner\backend\certs

# Generate new certificate including the friendly domain
mkcert -cert-file localhost.pem -key-file localhost-key.pem `
  localhost `
  127.0.0.1 `
  ::1 `
  family-activity.local `
  192.168.88.36
```

This creates certificates valid for:
- `localhost` (local access)
- `127.0.0.1` (loopback)
- `family-activity.local` (friendly domain)
- `192.168.88.36` (your IP)

---

## Step 2: Configure Domain Resolution

Choose ONE of the following methods:

### Option A: Windows Hosts File (PC Running Server)

**Run the automated script (PowerShell as Admin):**
```powershell
cd C:\Users\krish\Apps\family-activity-finder-planner
.\setup-domain.ps1
```

**Or manually edit hosts file:**
1. Open PowerShell as Administrator
2. Run: `notepad C:\Windows\System32\drivers\etc\hosts`
3. Add at the end:
   ```
   # Family Activity Finder - Local Development
   192.168.88.36    family-activity.local
   ```
4. Save and close

**Verify:**
```powershell
ping family-activity.local
# Should respond from 192.168.88.36
```

---

### Option B: Router DNS (Network-Wide - Recommended)

**Access your router:**
1. Open browser and go to your router admin panel:
   - Common addresses: `192.168.88.1`, `192.168.1.1`, `192.168.0.1`
   - Check router label or manual for address
2. Login with admin credentials
3. Look for **DNS Settings** or **Local DNS** or **Static DNS**
4. Add entry:
   - **Hostname:** `family-activity.local`
   - **IP Address:** `192.168.88.36`
5. Save settings

**Router-specific guides:**
- **TP-Link**: Advanced → Network → DHCP Server → Address Reservation
- **Netgear**: Advanced → Setup → LAN Setup → Address Reservation
- **ASUS**: LAN → DHCP Server → Manual Assignment
- **Linksys**: Local Network → DHCP Reservations

**Benefits:**
- ✅ Automatic for all devices on the network
- ✅ No configuration needed on individual devices
- ✅ Works on iPhone, Android, laptops, etc.

---

## Step 3: Configure Other Devices

### iPhone / iPad

**Option 1: Router DNS (Easiest)**
If you configured router DNS (Option B above), it just works! No additional steps.

**Option 2: DNS Profile (If router DNS not available)**
1. Use a DNS profile app like "DNS Override" or "DNSCloak"
2. Add custom DNS entry for `family-activity.local` → `192.168.88.36`

**Note:** iPhone doesn't allow editing the hosts file without jailbreak.

**Certificate Trust:**
1. Open Safari: `https://192.168.88.36:3001/health`
2. Accept certificate warning
3. Or install mkcert CA (see troubleshooting-guide.md)

---

### Android Phone / Tablet

**Option 1: Router DNS (Easiest)**
If you configured router DNS, it just works automatically.

**Option 2: Private DNS (Android 9+)**
1. Settings → Network & Internet → Advanced → Private DNS
2. Choose "Private DNS provider hostname"
3. Won't work for local domains - use router DNS instead

**Option 3: Hosts File (Rooted devices only)**
1. Install a hosts file editor app
2. Add: `192.168.88.36 family-activity.local`

**Certificate Trust:**
Open Chrome: `https://192.168.88.36:3001/health` and accept the warning.

---

### Windows PC / Laptop (Other Computers)

**Edit hosts file:**
1. Open Notepad as Administrator
2. File → Open: `C:\Windows\System32\drivers\etc\hosts`
3. Add at the end:
   ```
   192.168.88.36    family-activity.local
   ```
4. Save

**Flush DNS cache:**
```powershell
ipconfig /flushdns
```

**Verify:**
```powershell
ping family-activity.local
```

---

### Mac

**Edit hosts file:**
1. Open Terminal
2. Run: `sudo nano /etc/hosts`
3. Add: `192.168.88.36    family-activity.local`
4. Save: `Ctrl+O`, `Enter`, `Ctrl+X`
5. Flush DNS: `sudo dscacheutil -flushcache`

**Verify:**
```bash
ping family-activity.local
```

---

## Step 4: Access the App

Once configured, you can access from any device:

**Frontend:**
```
https://family-activity.local:5174
```

**Backend Health Check:**
```
https://family-activity.local:3001/health
```

**First-time access:**
- You may see a certificate warning
- Click "Advanced" → "Proceed" to accept
- Or install the mkcert CA certificate on the device

---

## Troubleshooting

### "Server not found" or "Can't resolve host"

**Check DNS resolution:**
```bash
# Windows
nslookup family-activity.local

# Should show: Address: 192.168.88.36
```

**If not resolving:**
1. Verify entry in hosts file (or router DNS)
2. Flush DNS cache: `ipconfig /flushdns` (Windows) or `sudo dscacheutil -flushcache` (Mac)
3. Restart browser
4. Check you're on the same network

---

### Certificate Error "NET::ERR_CERT_COMMON_NAME_INVALID"

**Cause:** SSL certificate doesn't include `family-activity.local`

**Fix:** Regenerate certificate (see Step 1 above)

**Verify certificate includes domain:**
```bash
cd C:\Users\krish\Apps\family-activity-finder-planner\backend\certs
openssl x509 -in localhost.pem -text -noout | findstr DNS
```

Should show: `DNS:family-activity.local`

---

### Works on PC but not on mobile

**Check firewall:**
```powershell
# Verify firewall rules exist
netsh advfirewall firewall show rule name="Node.js Server"
netsh advfirewall firewall show rule name="Vite Dev Server"
```

**Check servers are running:**
```powershell
netstat -ano | findstr :3001
netstat -ano | findstr :5174
```

**Check network connectivity:**
```bash
# From mobile device browser
https://192.168.88.36:3001/health

# If this works, it's a DNS issue
# If this doesn't work, check firewall or VPN
```

---

## Quick Reference

### URLs to Access
| Location | Frontend | Backend |
|----------|----------|---------|
| **Friendly Domain** | https://family-activity.local:5174 | https://family-activity.local:3001 |
| **IP Address** | https://192.168.88.36:5174 | https://192.168.88.36:3001 |
| **Localhost** | https://localhost:5174 | https://localhost:3001 |

### Configuration Files
| OS | Hosts File Location |
|----|---------------------|
| Windows | `C:\Windows\System32\drivers\etc\hosts` |
| Mac/Linux | `/etc/hosts` |
| iOS | Not accessible (use router DNS) |
| Android | `/system/etc/hosts` (root required) |

### Commands
```powershell
# Check IP address
ipconfig

# Flush DNS cache (Windows)
ipconfig /flushdns

# Test domain resolution
ping family-activity.local
nslookup family-activity.local

# Check if servers are running
netstat -ano | findstr :3001
netstat -ano | findstr :5174
```

---

## Benefits of Using a Friendly Domain

1. **Easy to Remember**: `family-activity.local` vs `192.168.88.36:5174`
2. **Share with Family**: "Open family-activity.local on your phone"
3. **IP Changes**: If your IP changes, update once in router/hosts
4. **Professional**: Looks more polished and production-like
5. **Consistent**: Same URL across all devices

---

## Alternative Domain Names

Don't like `family-activity.local`? You can use any `.local` domain:

- `activity-finder.local`
- `family-fun.local`
- `activities.local`
- `weekend-planner.local`

Just update:
1. Hosts file entry (or router DNS)
2. SSL certificate generation command
3. Share the new URL with your family!
