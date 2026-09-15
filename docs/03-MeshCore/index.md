---
sidebar_label: MeshCore
---
# MeshCore

MeshCore is an open-source system for secure, off-grid text messaging over
LoRa radios, built around dedicated repeaters. Where Meshtastic asks every
node to relay, MeshCore asks only repeaters to, and that one decision shapes
everything else about it: quieter airtime, more reliable delivery as the
network grows, and a network that has to be built rather than one that just
appears. Most of the new repeater coverage going up in Michigan right now is
MeshCore.

## How MeshCore Routes

Only repeaters forward. Your companion radio listens and talks; it never
repeats someone else's packet. A companion with no repeater in range can
only reach other companions in direct radio range.

Two kinds of traffic move differently:

- **Adverts and channel messages flood.** When a node announces itself or
  posts to a channel, every repeater that hears it repeats it, out to a hop
  limit. This is how nodes find each other and how group chat reaches
  everyone.
- **Direct messages follow a path.** The first message to someone floods so
  it can find them. Each repeater that relays it stamps its ID into the
  packet, so when the reply comes back, your node has the whole route. Later
  messages carry that route and go nowhere else. If it fails a few times,
  the node floods again and learns a fresh one.

Because repeaters stamp their IDs into the path, repeater prefixes have to
be unique; the [Repeater Setup guide](./03-Repeater-Setup.md) covers
claiming one.

Region tags let repeaters scope traffic so a message meant for Grand Rapids
isn't repeated in Detroit. How Michigan will use them is still being worked
out and hasn't been rolled out yet, but it's close; Kalamazoo has already
tagged its repeaters. The proposal, the map, and where things stand are on
[Regions and Scoping](./04-Regions-and-Scoping.md).

## What This Means in Michigan

**There's no MQTT.** Messages stay on the radio network; nothing bridges them
to the internet. That's the point, and it also means there's no free map: to
see the network, someone has to put an observer on the air. Michigan has
several, and the maps and analyzers they feed are on the
[Applications](./02-MeshCore-Applications.md) page.

**Coverage exists, and it's growing.** Grand Rapids, Kalamazoo, Detroit,
Flint, the Tri-Cities, and mid-Michigan each have a MeshMapper zone with
repeaters on the air. Before you buy anything, check the zone nearest you on
the Applications page, and ask on the [Contact page](../08-Contact.md) what
people are actually hearing where you live.

**The settings matter.** Because repeaters do the work, a companion that
doesn't match the network's preset and path settings will hear nothing. The
[Getting Started](./01-Getting-Started.md) page walks through them.

**Meshtastic still has its place.** For a hiking group or a search team with
no repeaters anywhere, a network where every radio relays is the right tool.
MeshCore also doesn't do the things Meshtastic's modules do: no telemetry
plugins, no position sharing to a public map, no internet bridging. It sends
messages, well, and stops there. Plenty of people carry both. Austin Mesh's
[MeshCore vs. Meshtastic](https://www.austinmesh.org/learn/meshcore-vs-meshtastic/)
goes deeper on the differences than this page does.

## Node Role Types (Don't be THAT person)

- **Companion** — what 99% of people want. Your personal radio, paired to
  your phone over Bluetooth or USB. WiFi, serial, and Ethernet builds exist
  for the few boards that support them.
- **Repeater** — stationary, with altitude. Not for vehicles or anything
  that moves. No Bluetooth in repeater firmware; manage it over USB or over
  LoRa from a companion. See the [Repeater Setup guide](./03-Repeater-Setup.md).
- **Room Server** — hosts a chat room. Managed the same way a repeater is.
- **Sensor** — reports readings instead of chatting, and stays quiet until a
  companion asks, so it sips battery. The firmware auto-detects common I2C
  sensors and some boards (T1000-E, SenseCAP Solar Node) have them built in.
  The web flasher doesn't offer this role, so sensor builds are compiled and
  flashed by hand; see the
  [sensor commands](https://docs.meshcore.io/cli_commands/#sensors-when-sensor-support-is-compiled-in)
  in the MeshCore docs.

## Where to Go Next

1. [Getting Started](./01-Getting-Started.md) — flash a companion, pair it, set it up for Michigan.
2. [Applications](./02-MeshCore-Applications.md) — find your zone, see who's on the air.
3. [Repeater Setup](./03-Repeater-Setup.md) — when you're ready to be THAT person, in the good way. You'll need a site with altitude, power, and about an hour.

Further reading: the [MeshCore project site](https://meshcore.io/) and the
[MeshCore docs](https://docs.meshcore.io/).
