---
layout: page
title: IBM PC BASIC ROMs
permalink: /devices/pcx86/rom/5150/basic/
redirect_from:
  - /devices/pcx86/basic/
---

IBM PC BASIC ROMs
---

The project contains the following IBM PC BASIC ROMs:

* [IBM BASIC C1.00](BASIC100.json)
* [IBM BASIC C1.10](../../5160/basic/BASIC110.json)

These built-in versions of BASIC were also referred to as Cassette BASIC, because no disk drive was required.
Only the original IBM PC (Model 5150) actually provided a cassette interface, but IBM continued to use that
name to describe the built-in BASIC, at least up through the IBM PC AT (Model 5170).

Both versions of Cassette BASIC where 32Kb and spanned physical addresses 0xF6000-0xFDFFF.  They were produced by
Microsoft, and unlike the IBM PC BIOS ROMs, no source code listings of these BASIC ROMs were ever published.

Here's an [IBM PC Machine](/devices/pcx86/machine/) XML excerpt that shows how to include a BASIC ROM:

	<rom id="romBASIC" addr="0xf6000" size="0x8000" file="/devices/pcx86/rom/5150/basic/BASIC100.json"/>
