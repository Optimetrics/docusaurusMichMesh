---
sidebar_label: Intro
---

# Michigan Mesh

Welcome to MichMesh, a community effort to bring free, off-grid mesh
networking to Michigan. This page explains what a mesh network is in about
two minutes, then points you at the system that fits what you want to do.

## The Basic Idea

Normally your phone talks to a cell tower, and the tower talks to the
internet. No tower, no signal. Mesh cuts the tower out. Small radios
("nodes") talk directly to each other, and if yours can't reach the person
you're messaging, it hands the message to a closer node, which hands it to
another, until it arrives. Each handoff is a "hop."

## Nodes, Repeaters, and Range

A **node** is any device on the network: in your pocket, in your car, on a
windowsill. A **repeater** is a node placed somewhere high with a clear view,
whose job is relaying other people's messages. These radios reach for miles,
but hills, buildings, and thick woods block them like any other radio, so
line of sight matters and height beats transmit power. Every hop adds a
little delay and a little risk, which is why where repeaters sit matters.

## Who Does the Repeating

When a node hears a message that isn't for it, does it pass it along? This
is the biggest difference between the systems on this site.

- **Every node repeats.** A handful of radios with no setup form a working
  network on the spot, anywhere. The cost is noise: as the mesh grows, more
  airtime goes to everyone repeating everyone.
- **Only repeaters repeat.** Personal radios listen and talk but don't
  forward. The network stays quiet and reliable as it grows, but there has
  to be a repeater in range for a message to go anywhere.

The first is built for dropping into a place with nothing set up yet; the
second is built for permanent coverage of a city or region. Each system's
section explains how its routing works in more detail.

## The Three Systems in Michigan

Pick by what you want to do, not by name. Plenty of people run more than one.

### MeshCore

Only repeaters repeat. Most of the new repeater coverage going up in
Michigan right now is MeshCore. Best for everyday messaging across a city or
region, and for anyone who wants to put up a repeater and extend the
network.

[MeshCore section →](./03-MeshCore/index.md)

### Meshtastic

Every node repeats. Works anywhere, including places with no repeaters at
all, and has the widest range of off-the-shelf hardware. Best for search and
rescue, camping and hiking groups, and bringing the whole network with you.

[Meshtastic section →](./02-Meshtastic/index.md)

### Reticulum

A networking layer that runs over LoRa, packet radio, WiFi, the internet, or
several at once, carrying text, voice, files, and services. Powerful, and
technical: expect config files and a computer in the loop. Right if you want
to build and run things on a mesh, wrong if you want to pair a radio and
start texting.

[Reticulum section →](./04-Reticulum/index.md)

## Which One?

- **Talk to people near you day to day, and be part of Michigan's
  coverage** — MeshCore.
- **Carry a network into places that have none** — Meshtastic.
- **Build and run services over a mesh** — Reticulum.

Ask on the [Contact page](./08-Contact.md) what's already on the air where
you live before you buy anything.

## Get Involved

Test the howtos and send [yNos](./08-Contact.md) updates or screenshots as
things change.
