---
layout: post
title: Tidying The Project
date: 2016-02-06 10:00:00
permalink: /blog/2016/02/06/
---

The next release of PCjs (v1.20.8) is another fairly minor update.  It includes basic parallel port emulation, in the
form of a **ParallelPort** component that you include in a machine XML file with the &lt;parallel&gt; element, in much
the same way you include the **SerialPort** component with the &lt;serial&gt; element.

I've also tidied a few things in the [Devices](/devices/) folder.  ROM images used to be stored under
`/devices/pc/basic/` and `/devices/pc/bios/`, but BASIC and BIOS ROM images aren't actually devices; they are the
*contents* of ROM devices.  So, with that in mind, I've made the following rearrangements:

* `/devices/pc/basic/ibm-basic-1.00.json` => `/devices/pc/rom/5150/basic/BASIC100.json`
* `/devices/pc/basic/ibm-basic-1.10.json` => `/devices/pc/rom/5160/basic/BASIC110.json`
* `/devices/pc/bios/5150/*` => `/devices/pc/rom/5150/bios/*`
* `/devices/pc/bios/5160/*` => `/devices/pc/rom/5160/bios/*`
* `/devices/pc/bios/5170/*` => `/devices/pc/rom/5170/bios/*`
* `/devices/pc/bios/compaq/*` => `/devices/pc/rom/compaq/bios/*`

This structure mirrors what was done with **Machine** and **Video** devices, where the devices are organized
first by manufacturer (IBM or COMPAQ) and then by type (MDA, CGA, EGA, etc).

Here, the first **ROM** subdivision is either a manufacturer or a machine model.  A model implies a manufacturer;
for example, models 5150 through 5170 refer to IBM PC models.

---

The IBM BASIC ROMs require a bit more research.  I'm unclear on the exact history of those ROMs, how many variations
there were, or whether any of them were machine-dependent.

The project currently includes only two BASIC ROM versions, 1.00 and 1.10, which were initially released with the
first model 5150 and 5160 machines, respectively.  However, I've also read reports that later revisions of the model
5150 included BASIC ROM 1.10.

I believe there was also a version 1.20 released for IBM PCjr, but since PCjs does not yet emulate the PCjr, it has
not been added to the project.
