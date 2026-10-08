# Region Configurator

The interactive form on [Region Configurator](../../../docs/03-MeshCore/05-Region-Configurator.mdx)
(michmesh.com/docs/MeshCore/Region-Configurator). Someone picks where a
repeater is and what it covers, and it writes out the `region def` commands
for MeshCore repeater firmware 1.16 or later.

## Where the data comes from

None of the region data lives in this repo. The single source is the
[`data/` folder](https://github.com/MichMesh/MC-Regional-Infrastructure-Planning/tree/main/data)
of the Michigan regions RFC, which explains every file and field in its own
README:

| RFC file | Used for |
| --- | --- |
| `county-subregions.json` | County list, each county's default subregion, subregion labels |
| `local-regions.json` | Local regions offered (`status: "in-use"`) and noted (`"proposed"`) |
| `places.json` | The city or town search box |

```
RFC repo data/ ──(page load, fetch from GitHub)──▶ component
      │                                               ▲
      └──(npm run sync:regions)──▶ snapshot.json ─────┘ fallback
```

1. **When the page opens**, the component fetches the three files from the
   RFC repo's `main` branch on raw.githubusercontent.com. A local region
   merged there shows up here within minutes, with no change to this repo.
2. **Until that finishes, or if it fails** (offline, GitHub down, a file in an
   unexpected shape), it uses `snapshot.json`, a bundled copy. The note at the
   bottom of the form says which one it's showing.
3. **`regionData.mjs`** holds the RFC location, the fetch, and `normalize()`,
   which checks the files and turns them into what the form needs. The
   component and the sync script both use it, so they can't disagree.

## Common jobs

**Add a local region or a town.** Don't edit anything here. Follow the RFC
repo's [Adding a local region](https://github.com/MichMesh/MC-Regional-Infrastructure-Planning/blob/main/data/README.md#adding-a-local-region).

**Refresh the bundled copy.** Run `npm run sync:regions` and commit
`snapshot.json`. Do this whenever you're working nearby; it only matters when
GitHub can't be reached. To try out RFC changes that haven't merged, point it
at a local checkout instead:

```bash
npm run sync:regions -- --from ../MC-Regional-Infrastructure-Planning
```

Don't commit a snapshot built from unmerged changes; `_source.commit` in the
file records where it came from.

**Change the commands.** `repeaterCommands()` in `index.js` builds them. Keep
them in step with [Set Regions](../../../docs/03-MeshCore/03-Repeater-Setup.md#step-7-regions)
in the Repeater Setup guide, and with the hold described there: while scoping
is on hold, the form only defines regions.

**The RFC data changed shape.** Update `normalize()` in `regionData.mjs`, run
`npm run sync:regions`, and check the page with `npm start`. Until then, the
page keeps working from the snapshot, because `normalize()` throws on data it
doesn't understand and the component ignores the live copy.

## Testing

- `npm start`, open `/docs/MeshCore/Region-Configurator`, and try a city
  (Holland), a county with a local region (Kent), one without (Ingham), a
  companion, older firmware, and a bridge site.
- To see the fallback, block `raw.githubusercontent.com` in the browser's
  developer tools (Network → Block request domain) and reload: the note at
  the bottom should say "bundled copy".
- `npm run build` catches broken links in the page.
