import {useEffect, useMemo, useState} from 'react';
import Link from '@docusaurus/Link';
import CodeBlock from '@theme/CodeBlock';
import Admonition from '@theme/Admonition';
import {RFC_REPO, fetchRfcData, normalize} from './regionData.mjs';
// Bundled copy of the RFC data, used until the live copy loads and whenever
// it can't. Refresh with `npm run sync:regions`; see README.md.
import snapshot from './snapshot.json';
import styles from './styles.module.css';

const SNAPSHOT = normalize(snapshot);
const SNAPSHOT_COMMIT = snapshot._source.commit.slice(0, 7);

// Firmware 1.16 is the minimum: region def and flood.max.unscoped arrived
// in it, and older versions need different commands.
function repeaterCommands({subregion, local, neighbor}) {
  const lines = [`region def midwest mi ${subregion}${local ? ` ${local}` : ''}`];
  if (neighbor) lines.push(`region def midwest mi ${neighbor}`);
  lines.push('region save');
  return lines.join('\n');
}

const CHECK_COMMANDS = ['region', 'region default', 'get flood.max.unscoped'].join('\n');

function Chips({tags}) {
  return (
    <div className={styles.chips}>
      {tags.map((t) => (
        <code key={t}>
          {t}
        </code>
      ))}
    </div>
  );
}

export default function RegionConfigurator() {
  const [data, setData] = useState(SNAPSHOT);
  const [source, setSource] = useState('snapshot');
  const [city, setCity] = useState('');
  const [county, setCounty] = useState('');
  const [role, setRole] = useState('repeater');
  const [current, setCurrent] = useState(true);
  const [subregion, setSubregion] = useState('');
  const [local, setLocal] = useState('');
  const [bridge, setBridge] = useState(false);
  const [neighbor, setNeighbor] = useState('');

  // Load the RFC repo's current data, so a local region merged there shows up
  // here without a site change. Anything wrong (offline, GitHub down, a file
  // in an unexpected shape) leaves the bundled snapshot in place.
  useEffect(() => {
    const controller = new AbortController();
    fetchRfcData({signal: controller.signal})
      .then((raw) => {
        setData(normalize(raw));
        setSource('live');
      })
      .catch(() => {});
    return () => controller.abort();
  }, []);

  const counties = useMemo(() => Object.keys(data.counties).sort(), [data]);
  const places = useMemo(() => Object.keys(data.places).sort(), [data]);
  const subregions = Object.keys(data.subregions);

  // Picking a place resets coverage to that county's defaults; the operator
  // can then override them, since coverage beats the county line.
  const pickCounty = (c) => {
    setCounty(c);
    const sub = data.counties[c] || '';
    setSubregion(sub);
    // Pre-select a local region whose suggested counties include this one.
    const suggested = data.locals.find((l) => l.subregion === sub && l.suggestedCounties.includes(c));
    setLocal(suggested ? suggested.tag : '');
    setNeighbor('');
    setBridge(false);
  };
  const onCity = (value) => {
    setCity(value);
    const c = data.places[value];
    if (c) pickCounty(c);
  };

  const localsHere = data.locals.filter((l) => l.subregion === subregion);
  const proposedHere = data.proposed.filter((l) => l.subregion === subregion);
  const neighbors = subregions.filter((s) => s !== subregion);
  const chosenNeighbor = bridge && neighbor && neighbor !== subregion ? neighbor : '';
  const chain = subregion ? ['midwest', 'mi', subregion, ...(local ? [local] : [])] : [];

  const commands = useMemo(
    () => (subregion && current ? repeaterCommands({subregion, local, neighbor: chosenNeighbor}) : ''),
    [current, subregion, local, chosenNeighbor],
  );

  return (
    <div className={styles.configurator}>
      <fieldset className={styles.fieldset}>
        <legend>1. Where is the node?</legend>
        <div className={styles.row}>
          <label className={styles.field}>
            City or town
            <input
              type="text"
              list="region-configurator-cities"
              value={city}
              placeholder="Start typing, e.g. Lansing"
              autoComplete="off"
              onChange={(e) => onCity(e.target.value)}
            />
          </label>
          <label className={styles.field}>
            County
            <select value={county} onChange={(e) => pickCounty(e.target.value)}>
              <option value="">Choose a county</option>
              {counties.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
        </div>
        <datalist id="region-configurator-cities">
          {places.map((c) => (
            <option key={c} value={c} />
          ))}
        </datalist>
        {county && (
          <p className={styles.note}>
            {county} County is in <code>{data.counties[county]}</code> ({data.subregions[data.counties[county]]}).
          </p>
        )}
      </fieldset>

      <fieldset className={styles.fieldset}>
        <legend>2. What is it?</legend>
        <label className={styles.radio}>
          <input type="radio" name="region-configurator-role" checked={role === 'repeater'} onChange={() => setRole('repeater')} />
          Repeater or room server
        </label>
        <label className={styles.radio}>
          <input type="radio" name="region-configurator-role" checked={role === 'companion'} onChange={() => setRole('companion')} />
          Companion (the radio you carry)
        </label>
      </fieldset>

      {role === 'companion' && (
        <Admonition type="info" title="Nothing you need to set">
          <p>
            Unscoped messages reach everyone, so a companion doesn't need a scope. Experimenting with a scoped channel
            is fine; keep your default scope blank so your adverts and direct messages aren't affected, and{' '}
            <Link to="/docs/MeshCore/Getting-Started#undo-region-scoping">clear it</Link> if messages stop getting
            through.
          </p>
          {chain.length > 0 && (
            <>
              <p>
                It's fine to <Link to="/docs/MeshCore/Getting-Started#add-regions-to-app">add regions to your app's list</Link>{' '}
                so they're ready. Repeaters near you should carry:
              </p>
              <Chips tags={chain} />
            </>
          )}
        </Admonition>
      )}

      {role === 'repeater' && (
        <>
          <fieldset className={styles.fieldset}>
            <legend>3. Repeater firmware</legend>
            <p className={styles.note}>
              Run <code>ver</code> on the repeater.
            </p>
            <label className={styles.radio}>
              <input type="radio" name="region-configurator-firmware" checked={current} onChange={() => setCurrent(true)} />
              1.16 or later
            </label>
            <label className={styles.radio}>
              <input type="radio" name="region-configurator-firmware" checked={!current} onChange={() => setCurrent(false)} />
              Older than 1.16
            </label>
          </fieldset>

          {county && (
            <fieldset className={styles.fieldset}>
              <legend>4. What does it cover?</legend>
              <p className={styles.note}>
                Defaults come from the county. A repeater carries the regions of the area it actually covers, so change
                these if its footprint is mostly somewhere else.
              </p>
              <div className={styles.row}>
                <label className={styles.field}>
                  Subregion
                  <select
                    value={subregion}
                    onChange={(e) => {
                      setSubregion(e.target.value);
                      setLocal('');
                    }}>
                    {subregions.map((s) => (
                      <option key={s} value={s}>
                        {s} ({data.subregions[s]})
                      </option>
                    ))}
                  </select>
                </label>
                <label className={styles.field}>
                  Local region
                  <select value={local} onChange={(e) => setLocal(e.target.value)} disabled={!localsHere.length}>
                    <option value="">None</option>
                    {localsHere.map((l) => (
                      <option key={l.tag} value={l.tag}>
                        {l.tag} ({l.name})
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              {!localsHere.length && (
                <p className={styles.note}>
                  No local region is listed under <code>{subregion}</code>. If your area uses one, propose it below so it can be added; otherwise stop at the subregion.
                </p>
              )}
              {proposedHere.length > 0 && (
                <p className={styles.note}>
                  Proposed here but not settled: {proposedHere.map((l) => <code key={l.tag}>{l.tag}</code>).reduce((a, b) => [a, ', ', b])}.
                  Check with operators near you before carrying one.
                </p>
              )}
              <label className={styles.radio}>
                <input type="checkbox" checked={bridge} onChange={(e) => setBridge(e.target.checked)} />
                It also serves companions in a neighboring subregion
              </label>
              {bridge && (
                <label className={styles.field}>
                  Neighboring subregion
                  <select value={neighbor} onChange={(e) => setNeighbor(e.target.value)}>
                    <option value="">Choose one</option>
                    {neighbors.map((s) => (
                      <option key={s} value={s}>
                        {s} ({data.subregions[s]})
                      </option>
                    ))}
                  </select>
                </label>
              )}
              {chosenNeighbor && (
                <p className={styles.note}>
                  That makes this repeater a <Link to="/docs/MeshCore/Repeater-Setup#region-boundary">bridge</Link>.
                  Announce it in the group first.
                </p>
              )}
            </fieldset>
          )}

          {!county && <p className={styles.note}>Pick a city or county to get the commands.</p>}

          {county && !current && (
            <Admonition type="warning" title="Upgrade first">
              <p>
                Michigan's region setup needs repeater firmware 1.16 or later, and the latest release is best. Update
                it from the <Link to="https://flasher.meshcore.io/">web flasher</Link>, then come back for the
                commands.
              </p>
            </Admonition>
          )}

          {commands && (
            <>
              <h3 className={styles.heading}>Commands</h3>
              <Chips tags={[...chain, ...(chosenNeighbor ? [chosenNeighbor] : [])]} />
              <CodeBlock language="bash">{commands}</CodeBlock>
              <Admonition type="note" title="Define only">
                <p>
                  Scoping is on hold, so these commands don't set <code>region default</code> or cap unscoped messages. If you set
                  either earlier, <Link to="/docs/MeshCore/Repeater-Setup#undo-scoping">undo it</Link>.
                </p>
              </Admonition>
              <h3 className={styles.heading}>Check it</h3>
              <CodeBlock language="bash">{CHECK_COMMANDS}</CodeBlock>
              <p className={styles.note}>
                Every line of <code>region</code> should end in <code>F</code>, <code>region default</code> should
                answer <code>default scope is &lt;null&gt;</code>, and <code>get flood.max.unscoped</code> should answer{' '}
                <code>&gt; 64</code>. Then finish the rest of <Link to="/docs/MeshCore/Repeater-Setup">Repeater Setup</Link>.
              </p>
            </>
          )}
        </>
      )}

      <p className={styles.note}>
        Region data from <Link to={`https://github.com/${RFC_REPO}/tree/main/data`}>the Michigan regions RFC</Link>
        {source === 'live' ? ', loaded just now.' : `, bundled copy (${SNAPSHOT_COMMIT}).`} Need a local region for your
        area? <Link to={`https://github.com/${RFC_REPO}/issues/new?template=local-region.yml`}>Propose one</Link>.
      </p>
    </div>
  );
}
