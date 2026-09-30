/**
 * Revisión responsive (Reglas Pixelia): captura cada ruta a 360, 768 y 1280 px y detecta
 * desborde horizontal (nada debe obligar a deslizar de lado).
 *
 *   npm run revisar -- --base=http://localhost:3000 --rutas=/,/admin/login --salida=/tmp/capturas
 *   REVISAR_EMAIL=... REVISAR_PASSWORD=... npm run revisar -- --rutas=/admin   (inicia sesión antes)
 *
 * Usa el Chromium de Playwright (PLAYWRIGHT_BROWSERS_PATH). Sale con código 1 si algo desborda.
 */
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { parseArgs } from 'node:util';
import { type Page, chromium } from 'playwright-core';

const VIEWPORTS = [
  { name: '360', width: 360, height: 780 },
  { name: '768', width: 768, height: 1024 },
  { name: '1280', width: 1280, height: 800 },
];

async function login(page: Page, base: string, email: string, password: string) {
  await page.goto(`${base}/admin/login`);
  await page.getByLabel('Correo').fill(email);
  await page.getByLabel('Contraseña').fill(password);
  await page.getByRole('button', { name: 'Entrar al panel' }).click();
  await page.waitForURL((url) => !url.pathname.startsWith('/admin/login'));
}

/** Elementos que se salen del ancho de la ventana (los primeros 5, para diagnosticar). */
function findOverflow(): { scrollWidth: number; offenders: string[] } {
  const width = document.documentElement.clientWidth;
  const offenders: string[] = [];
  for (const el of Array.from(document.querySelectorAll('body *'))) {
    const rect = el.getBoundingClientRect();
    if (rect.width > 0 && (rect.right > width + 1 || rect.left < -1)) {
      const id = el.id ? `#${el.id}` : '';
      const cls =
        typeof el.className === 'string' ? `.${el.className.split(' ').slice(0, 3).join('.')}` : '';
      offenders.push(
        `${el.tagName.toLowerCase()}${id}${cls} (${Math.round(rect.left)}→${Math.round(rect.right)})`,
      );
      if (offenders.length >= 5) break;
    }
  }
  return { scrollWidth: document.documentElement.scrollWidth, offenders };
}

async function main() {
  const { values } = parseArgs({
    options: {
      base: { type: 'string', default: 'http://localhost:3000' },
      rutas: { type: 'string', default: '/' },
      salida: { type: 'string', default: 'capturas' },
    },
  });
  const base = values.base.replace(/\/+$/, '');
  const routes = values.rutas
    .split(',')
    .map((r) => r.trim())
    .filter(Boolean);
  await mkdir(values.salida, { recursive: true });

  const browser = await chromium.launch();
  let failures = 0;
  try {
    for (const vp of VIEWPORTS) {
      const context = await browser.newContext({
        viewport: { width: vp.width, height: vp.height },
        locale: 'es-EC',
      });
      const page = await context.newPage();
      const { REVISAR_EMAIL: email, REVISAR_PASSWORD: password } = process.env;
      if (email && password) await login(page, base, email, password);

      for (const route of routes) {
        const response = await page.goto(`${base}${route}`, { waitUntil: 'networkidle' });
        const status = response?.status() ?? 0;
        const { scrollWidth, offenders } = await page.evaluate(findOverflow);
        const overflow = scrollWidth > vp.width;
        const file = path.join(
          values.salida,
          `${vp.name}${route.replace(/[/?=&]+/g, '_') || '_'}.png`,
        );
        await page.screenshot({ path: file, fullPage: true });
        const mark = overflow || status >= 400 ? '✖' : '✓';
        if (mark === '✖') failures++;
        console.log(
          `${mark} ${vp.name.padStart(4)}px ${route.padEnd(28)} HTTP ${status}  ancho ${scrollWidth}px  → ${file}`,
        );
        if (overflow) for (const o of offenders) console.log(`      desborda: ${o}`);
      }
      await context.close();
    }
  } finally {
    await browser.close();
  }
  if (failures) {
    console.error(`\n✖ ${failures} captura(s) con problemas.`);
    process.exit(1);
  }
  console.log('\n✓ Sin desborde horizontal.');
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
