/**
 * Título con la última palabra en cursiva («Bienvenido a <em>casa</em>»): textos que vienen de
 * la configuración, donde la iglesia escribe solo el texto. El estilo del `<em>` está en
 * globals.css (Fraunces cursiva en terracota).
 */
export function EmphasizeLast({ text }: { text: string }) {
  const trimmed = text.trim();
  const cut = trimmed.lastIndexOf(' ');
  if (cut <= 0) return <>{trimmed}</>;
  return (
    <>
      {trimmed.slice(0, cut)} <em>{trimmed.slice(cut + 1)}</em>
    </>
  );
}
