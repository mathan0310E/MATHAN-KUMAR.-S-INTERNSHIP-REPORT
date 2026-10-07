# Brand assets — source files

Reference copies of the official Cyber Wolf logos downloaded from
<https://www.cyberwolf360.in/>. These are **not** loaded by the site — they are
kept here so the derived crops in `assets/brand/` can be regenerated if the
branding changes.

| File | Origin |
|---|---|
| `cyberwolf-logo.png` | Primary logo, dark background |
| `cyberwolf-logo-portal.png` | Logo variant, portal/light treatment |

## Regenerating the site assets

`assets/brand/` holds the files the site actually loads:

| File | Used for | Notes |
|---|---|---|
| `cw-logo-light.png` | Top bar + organization section | Full lockup, transparent |
| `cw-emblem-light.png` | Hero + thank-you | Emblem only |
| `cw-emblem.png` | Unused alternate | Kept for future sections |
| `cw-logo-full.png` | Unused alternate | Kept for future sections |
| `cw-logo-mono.png` | Unused alternate | Kept for future sections |
| `certificate.jpg` | Section 10 | 1100×1554, the issued certificate |
| `certificate-blur.jpg` | Section 10 placeholder | 40×56 blur-up stand-in, 651 bytes |
| `favicon.png` | Browser tab | 32×32 |

The site loads only `cw-logo-light.png`, `cw-emblem-light.png`,
`certificate.jpg`, `certificate-blur.jpg` and `favicon.png`. Everything listed as
an unused alternate is a crop that was prepared but not needed — safe to delete.

## Certificate source

`../CyberWolf-Internship-Certificate-Mathan Kumar s-2194945281505_page-0001.jpg`
is the original issued certificate. `assets/brand/certificate.jpg` is a
downscaled copy so the page loads quickly. Never edit the details on the
certificate image — the on-page text must match the original exactly.
