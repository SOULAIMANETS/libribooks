'use client';

import { JsonLd } from 'react-schemaorg';
import { WebSite } from 'schema-dts';

export function JsonLdScript({ name, url }: { name: string, url: string }) {
  return (
    <JsonLd<WebSite>
      item={{
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: name,
        url: url,
        potentialAction: {
          '@type': 'SearchAction',
          target: `${url}/?q={search_term_string}`,
          'query': 'required name=search_term_string',
        },
      }}
    />
  );
}
