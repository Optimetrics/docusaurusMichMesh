---
sidebar_label: Intro
---

# Michigan Mesh

Welcome to MichMesh — a community effort to bring free, off-grid mesh
networking to Michigan.

Before you pick a mesh system, it helps to know what a mesh network
actually *is* — because once you get this part, the differences between
the systems on this site will make a lot more sense.

## The Basic Idea

Normally, your phone talks to a cell tower, and the cell tower talks to the
internet. No tower, no signal. Mesh networking cuts the tower out entirely.

Instead, small radios ("nodes") talk directly to each other. If your node
can't reach the person you're messaging, it doesn't give up — it hands the
message to another node closer to them, which hands it to another, and so
on until it arrives. Every node that helps pass a message along is doing
one "hop."

## Nodes and Repeaters

- **Node** — any device on the network. Could be in your pocket, mounted in
  your car, sitting on a windowsill. If it can send and receive, it's a node.
- **Repeater** — a node placed somewhere high with a clear view of the area
  (a roof, a silo, a hilltop), whose main job is relaying other people's
  messages rather than being someone's personal radio. More repeaters in
  good spots = a bigger, more reliable network for everyone.

## Range and Hops

These radios can talk for miles, but they're not magic — hills, buildings,
and thick woods block or weaken the signal just like they would for any
other radio. Line of sight matters. That's why repeaters go up high: height
beats raw transmit power almost every time.

Every hop adds a small delay and a small chance the message doesn't make
it through. A message that takes 2 hops to arrive is faster and more
reliable than one that needs 6. This is a big part of why *where*
repeaters sit — and how many you need — matters so much.

## How Your Message Actually Finds Its Way

This is where mesh systems start to differ from each other, and it's worth
understanding the two basic approaches before you compare them:

- **Flood routing** — a node that hears a message just repeats it to
  everyone in range, and they repeat it to everyone in range, and so on,
  until it's gone about as far as it's allowed to. Nobody has to plan
  anything ahead of time; a handful of nodes with no setup can form a
  working network on the spot. The tradeoff: as more nodes join, all that
  repeating starts competing for the same airtime.
- **Directed routing** — nodes build up an understanding of the network's
  shape and send messages along a specific known path instead of shouting
  to everyone. It's more efficient and scales better, but it works best
  once there's already some real structure in place — repeaters that are
  up, staying up, and covering the area.

Neither approach is "wrong" — they're built for different situations, which
is exactly why the systems on this site make different tradeoffs depending
on whether you're dropping into an area with nothing set up yet, or
building toward permanent regional coverage.

## Join the Michigan Network

Three systems run in Michigan. Each has its own section on this site with a
Getting Started page (flash it, pair it) and a Michigan Settings page (what to
set so you're on the same network as everyone else here). This is the short
version:

| | Meshtastic | MeshCore | Reticulum |
| --- | --- | --- | --- |
| Best for | Works with nothing set up ahead of time; hiking, SAR, pop-up groups | Michigan's permanent repeater coverage; reliable regional messaging | More than texting: files, voice, services, over any link |
| Radio preset | `LongFast` (default) | USA/Canada (default) | n/a — any interface |
| Join the statewide network | Add the `Michigan` channel | Set `path.hash.mode 1` | Add the MichMesh testnet interface |
| Show up on maps | MQTT root topic `msh/US/MI` | Connect to a MeshMapper zone or the Analyzer | — |
| Start here | [Getting Started](./02-Meshtastic/Getting%20Started.md) | [Getting Started](./03-MeshCore/01-Getting-Started.md) | [Getting Started](./04-Reticulum/01-Getting_Started.md) |
| Michigan settings | [Meshtastic](./02-Meshtastic/Michigan%20Settings.md) | [MeshCore](./03-MeshCore/02-Michigan-Settings.md) | [Reticulum](./04-Reticulum/02-Michigan-Settings.md) |

Not sure which one? Meshtastic is the fastest way to see a mesh working today
with whatever's around you. MeshCore is where Michigan's repeater network is
being built, and it runs fine on the go too. You can run both.

Who else is out there, and how to reach us:
[Communities & Contact](./08-Contact.md).

## Get Involved

Please test the howtos and send [yNos](./08-Contact.md) any updates or
screenshots as things change.
