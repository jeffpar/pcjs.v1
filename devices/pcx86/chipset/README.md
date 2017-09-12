---
layout: page
title: IBM PC ChipSet Configurations
permalink: /devices/pcx86/chipset/
---

IBM PC ChipSet Configurations
-----------------------------

The following predefined *[ChipSet](/pubs/pcx86/chipset/)* XML configurations are currently available:

- [IBM Model 5150 w/CGA](5150-cga-max.xml)
- [AT&amp;T Personal Computer 6300](att6300-cga-max.xml)
- [Columbia Data Products MPC 1600](mpc1600-cga-max.xml)
- [Zenith Z-150](z150-cga-max.xml)

However, most machines use their own *[ChipSet](/pubs/pcx86/chipset/)* model, DIP switch settings, etc; e.g.:

```xml
<chipset id="chipset" model="5160" sw1="01001001"/>
```
