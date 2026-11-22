# L'isola dei giochi

PWA educativa per iPad (Next.js static export + Serwist). Hub con 17 giochi; MVP giocabile: **Scoppia i palloncini giusti**.

## Sviluppo

```bash
npm install
npm run dev
```

In sviluppo il service worker è disattivato (`NODE_ENV=production` per test PWA).

## Build

```bash
npm run build
```

Genera `out/` e `public/sw.js`. Servi `out/` con un server statico (non `next start`).

## Deploy

Manuale (es. Cloudflare Pages): comando `npm run build`, cartella output `out`. Vedi [francesca-rella-website/documentations/CLOUDFLARE_STATIC_EXPORT.md](../francesca-rella-website/documentations/CLOUDFLARE_STATIC_EXPORT.md) come riferimento.