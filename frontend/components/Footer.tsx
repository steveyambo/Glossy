export function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="container-lueur flex flex-col items-center justify-between gap-3 py-10 text-sm text-muted sm:flex-row">
        <p>© {new Date().getFullYear()} LUEUR. Tous droits réservés.</p>
        <p>Formulé et pensé à la main.</p>
      </div>
    </footer>
  );
}
