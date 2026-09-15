---
sidebar_label: Regions and Scoping
---

# Regions and Scoping

:::caution Recommendations, not rules
Nothing on this page can be enforced. Michigan's repeaters are run by
independent operators, and every operator makes their own call. What's under **Where we are** is what's actually configured today.
Everything under **The proposal** is a recommendation with the consequences
spelled out, so operators can decide with their eyes open. Change history is at the bottom.
:::

## The map

Reference boundaries for the five subregions. They're drawn from county
groupings and marked as reference assignments, not borders; a repeater
carries the region of the coverage it actually serves. Local regions like
`grr` and `azo` follow observed coverage and aren't drawn.

<iframe
  src="https://optimetrics.github.io/mesh-region-map/"
  title="Michigan MeshCore region map"
  style={{width: '100%', height: '560px', border: '1px solid var(--ifm-color-emphasis-300)', borderRadius: '8px'}}
  loading="lazy"
></iframe>

[Open the map full screen](https://optimetrics.github.io/mesh-region-map/) ·
[Map source and data](https://github.com/Optimetrics/mesh-region-map)

## The short version

**What this is really about.** Chicago traffic is what brought this up, but
it's not the reason for it. MeshCore is growing fast across the United States,
and the Netherlands and the rest of Europe have already shown what happens
when a mesh fills in with no scoping: every flood packet from every area gets
repeated everywhere it can reach, and the local mesh stops being usable for
the people standing under it. That's coming for Michigan whether or not a
duct ever forms over Lake Michigan again — Grand Rapids packets already reach
Muskegon regularly, the Thumb often, and Detroit is filling in.

The goal is to get ahead of it while the network is still small enough to
change: keep the mesh usable for people in their own area by default, and
make reaching far-away areas something you do selectively — a scoped channel,
a deliberate choice — instead of something every message does every time,
bogging down every repeater between here and there.

**The trigger.** West Michigan repeaters regularly hear flood traffic from
Chicago, carried across Lake Michigan by tropospheric ducting. The link is
one-way, so it's pure noise here, and every Grand Rapids repeater that hears
a packet re-floods it. One audible out-of-area node becomes airtime loss
across the whole local mesh. It's the clearest example of the problem above
happening today, which is why it's the case study through the rest of this
page.

**Why regions alone don't fix it.** MeshCore's region tags let a repeater
forward traffic scoped to regions it belongs to and ignore traffic scoped to
regions it doesn't. But the Chicago traffic is *unscoped* — nobody sending it
attached a region — and unscoped traffic is forwarded by every repeater
regardless of tags. Regions do nothing about unscoped traffic unless you also
decide what to do with unscoped traffic.

**Why we don't just block it.** Every new user starts out unscoped. Blocking
unscoped traffic (`region denyf *`) silences them until they've configured a
region they don't know exists yet. That's the wrong trade for a network that
wants to grow.

**Where we're going.** Three steps, in this order:

1. **Tag everything.** Every repeater carries the Michigan region hierarchy.
   This is purely additive — it drops nothing and breaks nothing — and it has
   to be everywhere *before* anything else, because a repeater without `mi`
   configured won't forward `mi`-tagged traffic. Kalamazoo has already done
   this.
2. **Cap unscoped floods on every repeater.** `flood.max.unscoped 3`, tall
   and heavily-linked sites first, everyone else as they get to it. Unscoped
   traffic still works locally, so new users get through; multi-hop unscoped
   floods that arrive with hops already on them get dropped wherever they
   enter the mesh instead of re-broadcast.
3. **Strict forwarding, maybe, later.** `region denyf *` only once nearly
   every companion in an area has a default scope set, and only coordinated
   across neighboring repeaters. No date on this.

**What a user does.** Set default scope to `mi` in the app, scope your
channels per the table below, and you're unaffected by anything a repeater
decides about unscoped traffic.

## Where we are

### Naming

Michigan follows Kaylee's [RFC-001](https://github.com/AniMeiGrrl/mi-region-rfc):
short, flat, lowercase names with hyphens. The parent/child hierarchy is set
by `region put` on the repeater, not encoded into the name. The `#` prefix is
gone; firmware adds it internally.

```
midwest
└── mi
    ├── mi-west
    │   ├── grr        Grand Rapids / Kent County
    │   └── azo        Kalamazoo
    ├── mi-east
    ├── mi-north
    └── mi-upper
```

Only the tags in the table below are live. The rest of the tree shows where
new local tags slot in: a local group picks its lowest-level tag and the
parent chain above it is already defined.

### Adopted

| Tag | Scope | Status |
| --- | --- | --- |
| `midwest`, `mi`, `mi-west`, `azo` | Kalamazoo repeaters | **Live.** Kalamazoo has completed step 1. |
| `midwest`, `mi`, `mi-west`, `grr` | Grand Rapids / Kent County repeaters | **In progress.** Being added repeater by repeater. |

Step 2 (the unscoped cap) is not yet enabled on any repeater. Step 3 is not planned.

### Firmware

Regions only work on firmware that has them. Before changing anything, know
what your repeater is running (`ver` from the CLI).

| Feature | Minimum version |
| --- | --- |
| Region configuration and filtering on repeaters | Repeater firmware 1.10 |
| Region discovery from the app (Scan Local / Discover Regions) | Repeater firmware 1.12 |
| Default scope on companions and repeaters (`region default`) | Firmware 1.15, MeshCore app 1.43 |
| `flood.max.unscoped` | Repeater firmware 1.16 |
| `region def` single-line hierarchy command | Firmware 1.16 |

Solar and remote sites that nobody can easily reflash are the ones to check
first.

## The proposal

Written from a Grand Rapids perspective as an addendum to RFC-001, which
defines the names but is explicit that adding named regions does not by
itself disable unscoped flooding. Every item below is a recommendation with
its consequence beside it.

### Step 1 — tag every repeater

**Recommendation:** every Michigan repeater carries the full hierarchy for its
location and, where the firmware supports it, sets its default scope to `mi`.

**Consequence of skipping it:** a repeater without `mi` configured won't
forward `mi`-tagged traffic. Until every repeater has it, anyone who scopes to
`mi` gets *less* reach than the unscoped users, not more, and early adopters
will conclude regions are broken. This step has to be complete before step 2
starts.

**The commands depend on your firmware.** Check first:

```bash
ver
```

Then use the block for your version. All examples are for a Grand Rapids
repeater; Kalamazoo replaces `grr` with `azo`, and other local regions follow
RFC-001 as they're adopted. Confirm with `region` (prints the tree) — it
persists across reboots once saved.

**Repeater firmware 1.16 or later** — one-line hierarchy, default scope, and
the unscoped cap are all available:

```bash
region def midwest mi mi-west grr
region default mi
region save
```

**Repeater firmware 1.15** — no `region def`, so build the tree one level at
a time; default scope is available:

```bash
region put midwest
region put mi midwest
region put mi-west mi
region put grr mi-west
region default mi
region save
```

**Repeater firmware 1.10 through 1.14** — tagging works, but `region default`
does not exist yet, so the repeater's own adverts stay unscoped. It still
forwards scoped Michigan traffic correctly, which is what step 1 needs.
Discovery from the app needs 1.12 or later.

```bash
region put midwest
region put mi midwest
region put mi-west mi
region put grr mi-west
region save
```

**Repeater firmware below 1.10** — regions don't exist. Upgrade before doing
anything else. If the site can't be reached to reflash, say so in the group
so it's accounted for in step 2 planning.

### Step 2 — cap unscoped floods on every repeater

**Recommendation:** `flood.max.unscoped 3` on every Michigan repeater. This is
the value the MeshCore docs suggest as the alternative to `region denyf *`.

**Rollout order:** tall and heavily-linked sites first. They hear the most
out-of-area traffic and re-flood the most, so that's where the airtime comes
back soonest. Everyone else as they get to it.

**Why every repeater and not just the tall ones:** a duct can drop Chicago
into any lakefront repeater. If only the high sites are capped, a packet that
lands on an uncapped repeater gets re-flooded from there, and the high sites
end up hearing it from inside Michigan with fewer hops on it than the direct
path had. Capping everywhere means it dies within a couple of hops of
wherever it enters. One rule that applies to every repeater is also easier to
adopt and check than a list of sites.

**How it works:** the repeater drops an unscoped flood packet once its path
already has 3 hops on it. A brand-new user's zero-hop advert and first
messages get through to their local repeaters; a Chicago packet that has
already been repeated three times before crossing the lake does not get a
fourth.

**Consequence:** an unscoped user can't be heard more than 3 hops out. A
companion with a default scope set is unaffected, so the cost falls only on
users who haven't set one yet, and the remedy is the one setting we're asking
everyone to make anyway.

**Sparse-area carve-out:** in parts of the state where a new user would need
more than 3 hops to reach anyone — much of the Northern Lower Peninsula and
the UP today — operators may reasonably leave the cap at default until
coverage fills in. Their call. Operators who do are asked to say so in the
group, so "my new radio can't reach anyone" reports can be diagnosed.

```bash
set flood.max.unscoped 3
get flood.max.unscoped
```

Operators are asked to trial it for a week and share numbers before making it
permanent (see Verification).

### Step 3 — strict forwarding (future, optional)

`region denyf *` is appropriate only when the operator is satisfied that
companions in its coverage have broadly set a default scope, and only in
coordination with neighboring repeaters. This proposal sets no date or
trigger. An operator who enables it earlier is asked to say so in the group,
so "my new radio can't reach anyone" reports can be diagnosed.

### Companion configuration

In the MeshCore app (1.43 or later, companion firmware 1.15 or later):

1. Settings → Experimental → **Default scope region**: `mi`
2. Channel scopes:

| Channel | Scope |
| --- | --- |
| `#michigan` | `mi` |
| `#wmi` | `mi-west` |
| `#grr` | `grr` |
| `#azo` | `azo` |
| Public | your local region (`grr`, `azo`) for everyday chat; `mi-west` or `mi` when the conversation warrants it |

Default scope covers everything a channel scope doesn't: adverts, DMs, logins,
requests. Someone who only tags the Michigan channel is still sending unscoped
adverts and DMs, and those hit the cap. A companion with default scope set
and channels scoped is unaffected by any unscoped policy a repeater adopts,
including strict forwarding.

### Verification

- **Regions:** from the app, run Discover Regions (Scan Local). Every repeater
  in direct range that has done step 1 reports `mi` and its local ancestry.
- **Airtime:** operators with an observer or CoreScope record, before and
  after a site enables the cap, the share of received packets that are
  unscoped with more than 3 hops, and the site's own transmit airtime.
  Expected: a large drop in re-transmitted unscoped packets at the capped site,
  no change in scoped Michigan traffic. Sharing those numbers in the group is
  how the trial gets evaluated.
- **New users:** a freshly flashed companion with no default scope can still
  zero-hop advert, reach a repeater within 3 hops, and complete a first direct
  message. If it can't, either the user is in a sparse area where 3 hops
  doesn't reach anyone, or a nearby repeater has enabled strict forwarding.

### Open items

- Which default scope Kalamazoo companions use, and whether Kalamazoo wants
  cross-region discovery with Grand Rapids.
- Coordination with Chicago-area and other neighboring communities on
  `midwest`, so it's a channel choice there as well and not a default.

### References

- [MeshCore CLI reference](https://docs.meshcore.io/cli_commands/) — region and flood settings
- [MeshCore blog: region filtering](https://blog.meshcore.io/2026/01/20/region-filtering) — naming and discovery
- [MeshCore blog: default scope](https://blog.meshcore.io/2026/04/17/default-scope)
- [MeshCore 1.16.0 release notes](https://blog.meshcore.io/2026/06/06/release-1-16-0)
- [`flood.max.unscoped` implementation](https://github.com/meshcore-dev/MeshCore/pull/2661)
- [Pacific Northwest region rollout](https://gessaman.com/meshcore/regions/rollout/) — the phase structure this follows
- [RFC-001: Michigan regions](https://github.com/AniMeiGrrl/mi-region-rfc)

## Change history

- 2026-09 — Page created. Kalamazoo live on `azo`; Grand Rapids in progress on
  `grr`. Unscoped cap proposed at 3 on every repeater, tall sites first,
  following the MeshCore docs recommendation; sparse-area carve-out noted.
  Strict forwarding not planned.
