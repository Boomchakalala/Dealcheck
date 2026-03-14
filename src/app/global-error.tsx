'use client'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body>
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'system-ui, sans-serif', padding: '20px' }}>
          <div style={{ textAlign: 'center', maxWidth: '400px' }}>
            <h1 style={{ fontSize: '20px', fontWeight: 'bold', color: '#0f172a', marginBottom: '8px' }}>Something went wrong</h1>
            <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '24px' }}>An unexpected error occurred.</p>
            <button
              onClick={reset}
              style={{ padding: '10px 20px', fontSize: '14px', fontWeight: '600', borderRadius: '8px', backgroundColor: '#059669', color: 'white', border: 'none', cursor: 'pointer' }}
            >
              Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  )
}
