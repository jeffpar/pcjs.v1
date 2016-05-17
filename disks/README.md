---
layout: page
title: Disk Libraries
permalink: /disks/
---

Disk Libraries
---
Browse [IBM PC](pcx86/) and [Challenger 1P](c1p/) disk libraries.

---

### PCx86 Disk Image Formats

PCx86 works best with disk images in a **JSON** format, to save conversion time, so that's the only disk image format
you'll find in the PCjs Project.

To convert any of our **JSON** disk images back into an **IMG** file, you can use the [DiskDump API](/api/v1/dump)
with the *format* parameter set to `img` instead of `json`.  For example:

	{{ site.url }}/api/v1/dump?disk=/disks/pcx86/dos/ibm/2.00/PCDOS200-DISK1.json&format=img

As an added bonus, when browsing the disk library with the PCjs Node web server, links to JSON-encoded disk images
automatically include "onclick" handlers that invoke the API for you.

See **Creating PCx86-Compatible Disk Images** in the [PCx86 Documentation](/docs/pcx86/#creating-pcx86-compatible-disk-images)
for more information about supported disks and formats.
