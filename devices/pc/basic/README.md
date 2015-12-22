---
layout: page
title: IBM PC BASIC ROMs
permalink: /devices/pc/basic/
---

BASIC ROMs
---

The project contains the following BASIC ROMs:

* [BASIC 1.00](ibm-basic-1.00.json)
* [BASIC 1.10](ibm-basic-1.10.json)

These built-in versions of BASIC were also referred to as *Cassette BASIC*, because no disk drive was required.
Only the original IBM PC (Model 5150) actually provided a cassette interface, but IBM continued to use that
name to describe the built-in BASIC at least up through the IBM PC AT (Model 5170).

Here's an [IBM PC Machine](/devices/pc/machine/) XML excerpt that shows how to include a BASIC ROM:

	<rom id="romBASIC" addr="0xf6000" size="0x8000" file="/devices/pc/basic/ibm-basic-1.10.json"/>
