/**
 * Prueba de punta a punta del acceso al panel (necesita el servidor y un admin creado).
 *
 *   REVISAR_EMAIL=admin@ibr.test REVISAR_PASSWORD='...' npm run probar:login -- --base=http://localhost:3000
 *
 * Cubre: deep link con ?next, errores por campo, contraseña incorrecta, ingreso, cookie segura,
 * logout en todos los dispositivos, cookie copiada revocada y ?next malicioso.
 * Cada navegador usa una IP distinta (X-Forwarded-For) para no chocar con el límite de intentos.
 */
import { parseArgs } from 'node:util';
import { type Browser, type Page, chromium } from 'playwright-core';

let failures = 0;
function check(name: string, ok: boolean, detail = '') {
  if (!ok) failures++;
  console.log(`${ok ? '✓' : '✖'} ${name}${detail ? ` — ${detail}` : ''}`);
}

async function main() {
  const { values } = parseArgs({
    options: { base: { type: 'string', default: 'http://localhost:3000' } },
  });
  const base = values.base.replace(/\/+$/, '');
  const email = process.env.REVISAR_EMAIL;
  const password = process.env.REVISAR_PASSWORD;
  if (!email || !password)
    throw new Error('Define REVISAR_EMAIL y REVISAR_PASSWORD (un admin de prueba).');

  const browser = await chromium.launch();
  const context = (b: Browser, ip: string) =>
    b.newContext({
      viewport: { width: 360, height: 800 },
      extraHTTPHeaders: { 'x-forwarded-for': ip },
    });
  const submit = async (page: Page, mail: string, pass: string) => {
    await page.getByLabel('Correo').fill(mail);
    await page.getByLabel('Contraseña').fill(pass);
    await page.getByRole('button', { name: 'Entrar al panel' }).click();
    await page.waitForFunction(() => !document.querySelector('button[aria-busy="true"]'));
  };

  try {
    const a = await context(browser, '198.51.100.1');
    const page = await a.newPage();
    await page.goto(`${base}/admin/registros`);
    const url = new URL(page.url());
    check(
      'deep link lleva al login con ?next',
      url.pathname === '/admin/login' && url.searchParams.get('next') === '/admin/registros',
    );

    await page.getByRole('button', { name: 'Entrar al panel' }).click();
    await page.getByText('Escribe tu correo.').waitFor();
    check(
      'envío vacío marca los campos',
      (await page.getByText('Escribe tu correo.').count()) === 1 &&
        (await page.getByLabel('Correo').getAttribute('aria-invalid')) === 'true',
    );

    await submit(page, email, 'contraseña-incorrecta');
    check(
      'contraseña incorrecta explica qué hacer',
      (await page.getByText('El correo o la contraseña no coinciden').count()) === 1,
    );
    check(
      'conserva el correo escrito',
      (await page.getByLabel('Correo').inputValue()) === email.toLowerCase(),
    );

    await submit(page, email, password);
    await page.waitForURL((u) => !u.pathname.startsWith('/admin/login'));
    check('ingreso vuelve a la ruta pedida', new URL(page.url()).pathname === '/admin/registros');
    const cookie = (await a.cookies()).find((c) => c.name === 'ibr_admin');
    check(
      'cookie httpOnly + SameSite=Lax',
      Boolean(cookie?.httpOnly) && cookie?.sameSite === 'Lax',
    );

    const b = await context(browser, '198.51.100.2');
    await b.addCookies([cookie!]);
    const copy = await b.newPage();
    await page.goto(`${base}/admin`);
    await page.getByRole('button', { name: 'Abrir menú del panel' }).click();
    await page.locator('dialog[open]').getByRole('button', { name: 'Cerrar sesión' }).click();
    await page.waitForURL(/aviso=salida/);
    check(
      'logout avisa que cerró en todos los dispositivos',
      (await page.getByText('Cerraste sesión en todos tus dispositivos').count()) === 1,
    );
    await copy.goto(`${base}/admin`);
    check('la cookie copiada queda revocada', new URL(copy.url()).pathname === '/admin/login');

    await page.goto(`${base}/admin/login?next=https://evil.example`);
    await submit(page, email, password);
    await page.waitForURL((u) => !u.pathname.startsWith('/admin/login'));
    check('?next externo se ignora', new URL(page.url()).origin === new URL(base).origin);
  } finally {
    await browser.close();
  }
  if (failures) {
    console.error(`\n✖ ${failures} prueba(s) fallaron.`);
    process.exit(1);
  }
  console.log('\n✓ Acceso al panel correcto.');
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
