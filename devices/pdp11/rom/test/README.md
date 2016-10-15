---
layout: page
title: PDP-11 Test ROM
permalink: /devices/pdp11/rom/test/
---

PDP-11 Test ROM
---------------

This isn't a ROM so much as a read-only image that can be loaded in RAM by the ROM component.

[BOOT.MAC](boot.mac) was cross-assembled with [MACRO11](https://github.com/shattered/macro11) to produce [BOOT.LST](boot.lst),
which was then processed by [FileDump](/modules/filedump/) to produce [BOOT.JSON](boot.json).
