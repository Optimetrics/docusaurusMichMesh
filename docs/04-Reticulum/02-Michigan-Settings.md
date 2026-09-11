---
sidebar_label: Michigan Settings
---

# Michigan Reticulum Settings

Reticulum doesn't care what it runs over, so there's no radio preset to match.
Joining the Michigan network means adding the MichMesh interface and, if you
want group chat, the distribution group. For installing a client, see
[Reticulum Getting Started](./01-Getting_Started.md).

## MichMesh testnet interface

| Setting | Value |
| --- | --- |
| Interface type | TCP Client |
| Target host | `RNS.MichMesh.net` |
| Target port | `7822` |

**In Meshchat:** Interfaces → Add Interface → name it `Michmesh Testnet`, type
TCP Client Interface, host and port from the table → Add.

**In a Reticulum config file** (`~/.reticulum/config` or your venv's config):

```ini
[[MichMesh Testnet]]
  type = TCPClientInterface
  enabled = yes
  target_host = RNS.MichMesh.net
  target_port = 7822
```

This is an internet-connected testnet interface. To reach the mesh over LoRa
instead, add an [RNode](./03-RNode.md) or one of the
[other interfaces](./04-OtherInterfaces.md).

## Statewide distribution group

Group chat on Reticulum runs through a distribution group. Send a message to
the MichMesh group to join:

`lxmf://6e54f24ffb316ce6f5e5217e98664fa7`

How distribution groups work and how to run your own:
[Common Services](./05-Services.md).

## Services

There's a beta script that installs and configures RNS, the LXMF propagation
node, and the common services in one go:
[Beta Script](./06-beta_script.md). It's still beta — read the
prompts.
