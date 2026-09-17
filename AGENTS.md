<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Bilingual site

English is served at the root and Spanish under `/es`; every page lives in
`src/app/[lang]/`. Read `src/i18n/README.md` before adding or changing any
user-visible text: copy lives in `src/i18n/*.ts` dictionaries, links go
through `@/components/LocaleLink`, and database copy has `*_es` columns.
