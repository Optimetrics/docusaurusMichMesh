---
sidebar_label: Michigan Settings
---

# Michigan Meshtastic Settings

Everything you need to change on a Meshtastic node to be part of the Michigan
network. For flashing and first pairing, see
[Meshtastic Getting Started](./Getting%20Started.md).

## Radio

| Setting | Value |
| --- | --- |
| Region | `US` |
| Modem preset | `LongFast` |
| Frequency slot | leave at default |

Most of the state is on the stock `LongFast` preset, so a new node with the
region set to US is already on the right frequency. Some groups experiment with
faster or longer-range presets for testing, but that's coordinated on Discord
and not something you need to change to get started.

## Channels

Every Michigan channel uses the same 1-byte key. Add the ones that match where
you are; `Michigan` is the statewide channel and is the one everyone should
have.

| Channel name | Covers | PSK |
| --- | --- | --- |
| `Michigan` | Statewide — add this one first | `MA==` |
| `WMI` | Western Michigan | `MA==` |
| `EMI` | Eastern Michigan | `MA==` |
| `Muskegon` | Muskegon area | `MA==` |
| `NMI` | Northern Lower Peninsula | `MA==` |
| `YOOPER` | Upper Peninsula | `MA==` |
| `Washtenaw` | Washtenaw County | `MA==` |

To add a channel:

1. iOS: **Config → Channels**. Android: **☰ → Radio Configuration → Channels**.
2. Tap **+**.
3. Enter the channel name exactly as shown in the table (case matters).
4. iOS only: set **Key Size** to `1 byte`.
5. Enter the PSK `MA==` — uppercase, no spaces.
6. Enable **Uplink** and **Downlink** so the channel reaches MQTT.
7. Enable **Position** if you want to share your location on that channel.
8. Save, then tap **Send** to push the channels to the node.

:::tip
On your primary `LongFast` channel, enable **Uplink** as well if you want your
node to appear on the maps.
:::

## MQTT

MQTT is what puts your node on the maps and bridges the regional meshes over
the internet. If you're a mobile node, or there's no MQTT gateway near you yet,
set one up.

| Setting | Value |
| --- | --- |
| Root topic | `msh/US/MI` |
| Server | `mqtt.michmesh.net` (bridged to the public Meshtastic broker) |
| Username / password | `meshdev` / `large4cats` |
| Proxy to Client | On, unless the node has its own network connection (ESP32 on WiFi, PoE WisBlock) |

Use `msh/US/MI`, not the default `msh/US` — the state topic keeps Michigan
traffic together and off the firehose. The MichMesh server is optional; the
public broker with the `msh/US/MI` topic works too.

1. iOS: **Config → Module Configuration**. Android: **☰ → Radio Configuration**.
2. Under **LoRa**, enable **OK to MQTT** and send.
3. Under **MQTT**, enable it, set the server and root topic from the table, and
   enable **Proxy to Client** if needed.
4. Save. The node reboots.
5. Then enable **Uplink**/**Downlink** on the channels you want bridged (see
   above).

Want to run your own broker? See [Custom MQTT Server](./mqtt%20server.md).

## Device role

The wrong role is the most common way a well-meaning node hurts the mesh. Pick
by where the node lives, not by how important it feels.

| Role | Use it when |
| --- | --- |
| `CLIENT_MUTE` | On your person, in a vehicle, or indoors in a city or suburb. Doesn't repeat. |
| `CLIENT_BASE` | Home tower, rooftop, anywhere under about 100 ft HAAT. |
| `CLIENT` | Outdoor node you want to repeat after infrastructure has had its turn; MQTT gateways; nodes mounted outside a vehicle. |
| `ROUTER_LATE` | 100–500 ft HAAT **and** you need prioritized routing. Both, not either. |
| `REPEATER` | 500+ ft HAAT, no screen, **and** you need prioritized routing. Won't show in node lists. |

The full explanation of what each role does to routing — and the HAAT
calculator — is in the [Meshtastic overview](./index.md#what-are-the-common-roles-and-when-should-i-use-them).

## Site planning

Before mounting anything, check line of sight. The MichMesh line-of-sight tool
supports shared workspaces: in the
[LoS tool](https://thatsfguy.github.io/Line-Of-Sight-Tool/index.html), choose
**local only**, set the API URL to `https://losapi.michmesh.net`, and enter or
generate a workspace key. More tools are on the
[LoS Tools and Links](../07-LoS%20Tools%20and%20Links.md) page.
