Disk Archives
---
Browse [IBM PC](pc/) and [Challenger 1P](c1p/) disk images.

### PCjs Disk Image Formats

PCjs works best with disk images in a **JSON** format, to save conversion time, so that's the only
disk image format you'll find on the PCjs website.

To convert any of our **JSON** disk images back into an **IMG** file, you can use the **diskdump** API
with the *format* parameter set to `img` instead of `json`.  For example:

	http://www.pcjs.org/api/v1/dump?disk=/disks/pc/dos/ibm/2.00/PCDOS200-DISK1.json&format=img

In fact, when browsing the disk archives, the PCjs web server automatically provides "onclick" handlers
for links to JSON-encoded disk images, which will invoke the API for you.

See **Creating PCjs-Compatible Disk Images** in the [PCjs Documentation](/docs/pcjs/) for more information
about supported disks and formats.
