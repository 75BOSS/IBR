import Image from 'next/image';
import { Card } from '@/components/Card';
import { CopyButton } from '@/components/CopyButton';
import { PageHeader } from '@/components/PageHeader';
import { WhatsAppButton } from '@/components/WhatsAppButton';
import { getSiteConfig } from '@/lib/config';
import { type BankAccount, parseBankAccounts } from '@/lib/config-fields';
import { pageMetadata } from '@/lib/seo';

export const revalidate = 300;

export const metadata = pageMetadata({
  title: 'Dar',
  description:
    'Diezmos y ofrendas para la Iglesia Bíblica Riobamba: cuentas bancarias y código QR para transferir.',
  path: '/dar',
});

const DEFAULT_INTRO =
  'Dar es una forma de adorar a Dios y de agradecerle por lo que nos da. Tu ofrenda sostiene la obra de la iglesia en Riobamba: la enseñanza de la Biblia, el cuidado de las familias y la ayuda a quienes lo necesitan.';

function AccountCard({ account, featured }: { account: BankAccount; featured: boolean }) {
  return (
    <Card
      as="li"
      tone={featured ? 'surface' : 'sunken'}
      emphasis={featured ? 'featured' : 'normal'}
      accentColor={featured ? 'var(--color-accent)' : undefined}
    >
      <p className="text-sm font-semibold tracking-wide text-accent-strong uppercase">
        {account.banco}
      </p>
      <p className="text-ink-soft">
        {account.tipo ? `Cuenta ${account.tipo.toLowerCase()}` : 'Cuenta'}
      </p>
      <p
        className={`mt-2 font-display font-semibold tracking-wide text-ink tabular-nums ${featured ? 'text-h2' : 'text-h3'}`}
      >
        {account.numero}
      </p>
      <dl className="mt-3 grid gap-1 text-[0.95rem]">
        {account.titular && (
          <div className="flex flex-wrap gap-x-2">
            <dt className="text-ink-soft">Titular:</dt>
            <dd className="font-semibold text-ink">{account.titular}</dd>
          </div>
        )}
        {account.ruc_ci && (
          <div className="flex flex-wrap gap-x-2">
            <dt className="text-ink-soft">RUC/CI:</dt>
            <dd className="font-semibold text-ink tabular-nums">{account.ruc_ci}</dd>
          </div>
        )}
      </dl>
      <div className="mt-4">
        <CopyButton
          text={account.numero.replace(/\s/g, '')}
          label="Copiar número"
          copiedMessage={`Número de ${account.banco} copiado`}
          variant={featured ? 'primary' : 'secondary'}
        />
      </div>
    </Card>
  );
}

export default async function DarPage() {
  const config = await getSiteConfig();
  const accounts = parseBankAccounts(config.dar_cuentas);
  const intro = config.dar_intro || DEFAULT_INTRO;

  return (
    <div className="container-page flex flex-col gap-[clamp(1.5rem,4vw,3rem)] py-[clamp(2rem,6vw,4.5rem)]">
      <PageHeader eyebrow="Diezmos y ofrendas" title="Dar con alegría" />
      <div className="grid gap-[clamp(1.25rem,3vw,2rem)] lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
        <div className="flex flex-col gap-4">
          <Card tone="brand" emphasis="featured">
            <p className="font-display text-h3 leading-snug whitespace-pre-line">{intro}</p>
            <p className="mt-4 text-surface/80">
              «Cada uno dé como propuso en su corazón: no con tristeza, ni por necesidad, porque
              Dios ama al dador alegre.» 2 Corintios 9:7
            </p>
          </Card>
          {config.whatsapp && (
            <Card tone="sunken">
              <p className="text-ink-soft">
                ¿Hiciste una transferencia y quieres que la registremos, o tienes una pregunta?
                Escríbenos.
              </p>
              <div className="mt-3">
                <WhatsAppButton
                  number={config.whatsapp}
                  label="Enviar comprobante"
                  message="Hola, les envío el comprobante de mi ofrenda."
                />
              </div>
            </Card>
          )}
        </div>

        <section aria-labelledby="cuentas" className="flex flex-col gap-4">
          <h2 id="cuentas" className="text-h2 font-semibold text-ink">
            Transferencia o depósito
          </h2>
          {accounts.length > 0 ? (
            <ul className="grid gap-4 md:grid-cols-2">
              {accounts.map((account, i) => (
                <AccountCard
                  key={`${account.banco}-${account.numero}`}
                  account={account}
                  featured={i === 0}
                />
              ))}
            </ul>
          ) : (
            <Card tone="sunken">
              <p className="text-ink-soft">
                Muy pronto publicaremos las cuentas de la iglesia. Mientras tanto, puedes dar tu
                ofrenda en cualquiera de nuestras reuniones.
              </p>
            </Card>
          )}
          {config.dar_qr_url && (
            <Card title="Pagar con código QR" as="section">
              <div className="flex flex-col items-center gap-4 xs:flex-row xs:items-start">
                <Image
                  src={config.dar_qr_url}
                  alt="Código QR para transferir a la iglesia"
                  width={200}
                  height={200}
                  className="size-[clamp(10rem,40vw,12.5rem)] rounded-xl bg-surface object-contain p-2 ring-1 ring-line"
                />
                <p className="text-ink-soft">
                  Abre la app de tu banco, elige «Pagar con QR» o «Transferir con QR» y apunta la
                  cámara al código.
                </p>
              </div>
            </Card>
          )}
        </section>
      </div>
    </div>
  );
}
