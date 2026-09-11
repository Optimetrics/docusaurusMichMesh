---
sidebar_label: Michigan Settings
---

# Michigan MeshCore Settings

What to set on a MeshCore node so it works with the repeaters already on the
air in Michigan. For flashing and first pairing, see
[MeshCore Getting Started](./01-Getting-Started.md). If you're
putting up a repeater, this page is the summary; the
[Repeater Setup Guide](./03-Repeater-Setup.md) is the full
walkthrough.

## Radio preset

Michigan runs the stock **USA/Canada (Recommended)** preset from the
[web flasher](https://flasher.meshcore.io/). If you picked it when flashing,
you're done with this part.

| Setting | Value |
| --- | --- |
| Frequency | 910.525 MHz |
| Bandwidth | 62.5 kHz |
| Spreading factor | 7 |
| Coding rate | 5 |

Read it back with `get radio` and `get tx`. If anything differs, set it with
`set radio 910.525,62.5,7,5`.

## The Michigan standard: `path.hash.mode 1`

Michigan settled on **`path.hash.mode 1`** as of May 20, 2026. Set it on every
repeater **and** on your companion. It widens the ID your node stamps into a
packet's path from 1 byte to 2, which is what keeps two repeaters in the same
area from being mistaken for each other. It affects what your node floods, not
what it receives.

```bash
set path.hash.mode 1
```

Full explanation: [path.hash.mode](./03-Repeater-Setup.md#pathhashmode-Path-ID-Size).

## Companion nodes

For a companion (the role 99% of people want), the Michigan-specific list is
short:

1. USA/Canada preset — set at flash time.
2. `path.hash.mode 1` — see above.
3. Set your name, and your lat/long if the node is stationary.

Everything else in the app is personal preference.

## Repeaters

Apply these after the first-run checklist in the
[Repeater Setup Guide](./03-Repeater-Setup.md). They're the
settings Michigan repeater operators have converged on.

```bash
set path.hash.mode 1
set advert.interval 240
set flood.advert.interval 24
set flood.max 32
set agc.reset.interval 500
set dutycycle 100
set loop.detect moderate
```

| Setting | Why |
| --- | --- |
| `path.hash.mode 1` | 2-byte path IDs (the Michigan standard) |
| `advert.interval 240` | Local advert every 4 hours, neighbors only |
| `flood.advert.interval 24` | Network-wide advert once a day |
| `flood.max 32` | Drop floods past 32 hops — the most a 2-byte path can hold anyway |
| `agc.reset.interval 500` | Reset the radio's AGC every ~8 min so RF interference can't deafen it |
| `dutycycle 100` | Remove the 50% airtime throttle the repeater firmware ships with |
| `loop.detect moderate` | Drop a flood that already carries this repeater's hash |

Leave `guest.password` blank — that's what lets community members query
repeater status.

Transmit delays depend on where the repeater sits (high site, mid site,
mobile). Those profiles are in the
[Repeater Setup Guide](./03-Repeater-Setup.md#common-repeater-settings).

### Claim a unique prefix

Repeaters identify themselves in a packet's path by the first two bytes of
their public key — four hex characters. Two repeaters in range of each other
with the same prefix both claim the same path entry and both retransmit.
Before a repeater goes live, check the prefixes already on the air near you
(your companion's contact list, your MeshMapper zone, or the Analyzer) and
generate a new key if yours collides. Do this **before** the repeater is
carrying traffic; rekeying later breaks every contact and admin session tied
to the old key.

How to check and rekey: [Claim a Unique Public Key Prefix](./03-Repeater-Setup.md#claim-a-unique-public-key-prefix).

## Regions

MeshCore's region tags (`region put` on repeaters) let flood traffic be scoped
so that a message meant for Grand Rapids doesn't get repeated in Kalamazoo. Region
naming for Michigan follows a shared hierarchy; which tags are live and which
are still proposed is tracked on
[Regions and Scoping](./04-Regions-and-Scoping.md).

## See the network

MeshCore has no built-in MQTT, so maps and analyzers depend on observers.
Connecting a node as an observer doesn't bridge your traffic to the internet —
it only lets the tools "hear" the mesh.

**MeshMapper zones in Michigan** (coverage maps built from observers and
wardriving):

| Zone | Covers |
| --- | --- |
| [GRR](https://grr.meshmapper.net) | Grand Rapids metro and parts of Ottawa County |
| [AZO](https://azo.meshmapper.net) | Kalamazoo |
| [DET](https://det.meshmapper.net) | Greater Detroit metro |
| [FNT](https://fnt.meshmapper.net) | Genesee County and parts of Lapeer |
| [MBS](https://mbs.meshmapper.net/index.php?lat=43.675&lon=-83.526&zoom=10.35) | Midland / Bay City / Saginaw and parts of the Thumb |
| [GDW](https://gdw.meshmapper.net) | Midland, Mount Pleasant, Houghton Lake, Traverse City, and the UP for now |

**Analyzers** (packet-level reliability and path data for repeater operators):

- [MeshCore Analyzer](https://analyzer.letsmesh.net/map?lat=43.35599&long=-84.7746&zoom=7) — statewide view
- [West Michigan CoreScope](https://map.westmichmesh.org) — Grand Rapids area

What these tools do and how to feed them is on
[MeshCore Applications](./05-MeshCore-Applications.md).
