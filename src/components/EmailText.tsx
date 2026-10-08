/**
 * Un correo en pantalla. Si no cabe en la línea se corta antes de la @ y no a mitad de palabra
 * («iglesiabiblicariobamba / @gmail.com»); solo si una parte sola no cabe, se parte donde haga falta.
 */
export function EmailText({ email }: { email: string }) {
  const at = email.indexOf('@');
  return (
    <span className="min-w-0 wrap-anywhere">
      {at > 0 ? (
        <>
          {email.slice(0, at)}
          <wbr />
          {email.slice(at)}
        </>
      ) : (
        email
      )}
    </span>
  );
}
