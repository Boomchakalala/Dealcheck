// Metadata for this route lives in page.tsx itself (a page-level `metadata`
// export overrides a layout-level one for the same route), so it isn't
// duplicated here — that duplication is exactly the kind of drift this
// product-repositioning pass is meant to eliminate.

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
