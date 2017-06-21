---
layout: page
title: Disk Libraries
permalink: /disks/
---

Disk Libraries
--------------

Browse these PCjs Disk Libraries:

* [IBM PC](pcx86/)
* [Challenger 1P](c1p/)
* [DEC](dec/)

Additional selected software is available in the PCjs [Software Archives](/apps/).

---

### PCx86 Disk Image Formats

PCx86 works best with disk images in a **JSON** format, to save conversion time, so that's the
only disk format you'll find in the [PCjs Project](https://github.com/jeffpar/pcjs).

There are several ways you can convert a PCjs **JSON** disk image back into a binary **IMG** file:

- Load the desired disk into a PCjs machine and click the **Save** button
- Use the [DiskDump API](/api/v1/dump) (available only in the [PCjs Node Web Server](/server.js))

When using the [DiskDump API](/api/v1/dump), set the *format* parameter set to `img` instead of `json`.
For example:

	{{ site.url }}/api/v1/dump?disk=/disks/pcx86/dos/ibm/2.00/PCDOS200-DISK1.json&format=img

The [PCjs Node Web Server](/server.js) also generates "onclick" handlers for links to **JSON** disk
images that automatically invoke the API for you.

See [Creating PCx86-Compatible Disk Images](/docs/pcx86/#creating-pcx86-compatible-disk-images)
in the [PCx86 Documentation](/docs/pcx86/) for more information about supported disks and formats.
