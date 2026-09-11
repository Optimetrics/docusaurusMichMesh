---
sidebar_label: Getting Started
---
# Getting Started

From an unopened radio to your first message. Everything here works anywhere
in the world; the Michigan-specific parts (channels, MQTT, which role to pick)
are on [Michigan Meshtastic Settings](./Michigan%20Settings.md),
and this page sends you there when it's time.

## Wait a minute, this is confusing!
Yeah, there are some terms that get used differently depending on where they are used. Freq channels are also called channel slots or just channels, but general chat channels are also called channels? Yeah, it's a mess. Organic growth in the app and documentation have made things confusing. Don't worry about asking questions if you are unsure - we all had to figure it out and most of us are pretty friendly about answering questions.

## 1. Get a device

Any Meshtastic-compatible LoRa radio for the US 915 MHz band. If you don't
have one yet, the [Meshtastic overview](./index.md#what-nodes-should-i-get)
lists what people here actually carry, mount in cars, and put on rooftops.
Ask on Discord before you buy; what's working well changes.

:::warning
Never power on a LoRa radio without an antenna attached. It can permanently
damage the transmitter.
:::

## 2. Flash the firmware

Use the [Meshtastic Web Flasher](https://flasher.meshtastic.org) from Chrome
or Edge (it needs Web Serial). Plug the device in over a data cable, pick your
board, pick the latest stable firmware, and flash. Most devices come with
Meshtastic already on them; flashing anyway gets you current firmware.

Updating later is easier — see [OTA Updating](./OTA_Meshtastic_Updates.md).

## 3. Install the app and pair

Install the Meshtastic app for [Android](https://play.google.com/store/apps/details?id=com.geeksville.mesh)
or [iOS](https://apps.apple.com/us/app/meshtastic/id1586432531). Pair with
the device over Bluetooth. If the device has a screen, the pairing PIN shows
there; if not, the default is `123456`.

## 4. Set your region and preset

In the app: **Radio Configuration → LoRa**.

| Setting | Value |
| --- | --- |
| Region | `US` |
| Modem preset | `LongFast` |

That's the Michigan default. Leave the frequency slot alone. Save, and the
device reboots on the right frequency.

## 5. Set your name

**Radio Configuration → User**: a long name (what people see) and a 4-character
short name. Save.

## 6. Join the Michigan network

You're on the air, but only on the default channel. To reach everyone else in
the state — and to show up on the maps — go to
[Michigan Meshtastic Settings](./Michigan%20Settings.md) and:

- add the `Michigan` channel (and your regional one)
- set up MQTT with the `msh/US/MI` topic
- pick the right device role for where the node lives

## 7. Say hello

Send a message on the `Michigan` channel and come say hi on
[Discord](https://discord.gg/3A5RREcBcc) so someone can confirm they heard you.

## Do I need to change frequency/channel number in order to connect with other people?
Most likely, no. The standard `LongFast` channel preset will cover your area. Some people are playing with using faster (shorter range) and slower (longer range) channels, but this is usually coordinated and not used long term.
