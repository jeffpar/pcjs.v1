---
layout: page
title: Disk Libraries
menu_title: Disks
menu_order: 4
permalink: /disks/
---

Disk Libraries
---
Browse these PCjs Disk Libraries:

- [IBM PC](pcx86/)
- [Challenger 1P](c1p/)

---

### PCx86 Disk Image Formats

PCx86 works best with disk images in a **JSON** format, to save conversion time, so that's the only disk image format
you'll find in the [PCjs Project](https://github.com/jeffpar/pcjs).

If you're running the PCjs Node web server, you can convert any of our **JSON** disk images into an **IMG** file
with the [DiskDump API](/api/v1/dump), by setting the *format* parameter set to `img` instead of `json`.  For example:

	{{ site.url }}/api/v1/dump?disk=/disks/pcx86/dos/ibm/2.00/PCDOS200-DISK1.json&format=img

As an added bonus, the PCjs Node web server automatically provides "onclick" handlers for all links to JSON-encoded disk
images, automatically invoking the API for you.

See [Creating PCx86-Compatible Disk Images](/docs/pcx86/#creating-pcx86-compatible-disk-images) in the
[PCx86 Documentation](/docs/pcx86/) for more information about supported disks and formats.
