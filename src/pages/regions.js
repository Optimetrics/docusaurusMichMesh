import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';

export default function Regions() {
  return (
    <Layout title="Michigan Region Map" description="MeshCore subregion reference boundaries for Michigan">
      <main className="container margin-vert--lg">
        <h1>Michigan MeshCore region map</h1>
        <p>
          Reference boundaries for Michigan's five MeshCore subregions, drawn from
          county groupings per RFC-001 Addendum B. These are defaults, not borders:
          a repeater carries the region of the coverage it actually serves. Local
          regions such as <code>grr</code> and <code>azo</code> follow observed
          coverage and are not drawn here; see their MeshMapper zones.
        </p>
        <p>
          Read the plan on <Link to="/docs/MeshCore/Regions-and-Scoping">Regions and Scoping</Link>.
        </p>
        <iframe
          src="/regions/map.html"
          title="Michigan MeshCore region map"
          style={{width: '100%', height: '720px', border: '1px solid var(--ifm-color-emphasis-300)', borderRadius: 8}}
          loading="lazy"
        />
      </main>
    </Layout>
  );
}
