

export function DatabaseUnavailable() {
  return <div className="max-w-md rounded-2xl border border-border bg-white p-8 text-center shadow-lg"> <h2 className="text-lg font-semibold text-brand-navy mb-2">Database not configured</h2> <p className="text-sm text-muted-foreground">Set  <code className="text-xs">DATABASE_URL</code> in your  <code className="text-xs">.env</code> file, then run  <code className="text-xs">npm run db:push</code> and  <code className="text-xs">npm run db:seed</code>.</p></div>;
}


