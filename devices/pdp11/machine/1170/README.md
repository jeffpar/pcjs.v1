---
layout: page
title: PDP-11/70 Machine Configurations
permalink: /devices/pdp11/machine/1170/
---

PDP-11/70 Machine Configurations
--------------------------------

PDPjs supports a variety of PDP-11/70 machine configurations, including:

* [PDP-11/70 Boot Monitor](/devices/pdp11/machine/1170/monitor/)
* [PDP-11/70 with Front Panel](/devices/pdp11/machine/1170/panel/)
* [PDP-11/70 "Server Array"](/devices/pdp11/machine/1170/array/)
* [PDP-11/70 with VT100 Terminal](/devices/pdp11/machine/1170/vt100/)

The [PDP-11/70 with Front Panel](/devices/pdp11/machine/1170/panel/) also comes in a
[Debugger Configuration](/devices/pdp11/machine/1170/panel/debugger/), which features a section on
"[Toggle-Ins](/devices/pdp11/machine/1170/panel/debugger/#toggle-ins)" for your switch-toggling enjoyment.

Unless otherwise specified, the above configurations include 256Kb of RAM.  The PDP-11/70's 22-bit architecture
supports a maximum of 3,840Kb of RAM, since the last 256Kb is reserved for UNIBUS devices.  The top 8Kb is known
as the *I/O Page*, a region containing hardware registers belonging to the CPU, MMU, and assorted peripherals.
