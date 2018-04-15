---
layout: page
title: Disk Libraries
permalink: /disks/
---

Disk Libraries
--------------

Browse the following PCjs Disk Libraries.

* [IBM PC Disk Library](pcx86/)
* [Challenger 1P Disk Library](c1p/)
* [DEC Disk Library](dec/)

Additional software is available in the [Application Archives](/apps/).

---

### PCjs Disk Formats

PCjs machines work best with disk images stored in a **JSON** format, so that's all you'll find in the
[PCjs Project](https://github.com/jeffpar/pcjs).

In its simplest form, the **JSON** disk format looks like this:

    [   // array of cylinders
        [   // array of heads
            [   // array of sectors
                {"sector":1,"data":[128 32-bit values]},
                {"sector":2,"data":[128 32-bit values]},
                ...
            ],
            ...
        ],
        ...
    ]

Each array (with the exception of the `data` arrays) must be fully populated, because the size of each array determines
the disk's geometry.  For example, if a disk contains 40 cylinders, 2 heads, and 9 sectors per track, then the outer-most
array must have 40 elements, the middle arrays must have 2 elements, and the inner-most arrays must have 9 elements.
The inner-most elements are *sector* objects.  We refer to this three-dimensional array structure as the "CHS"
(Cylinder/Head/Sector) disk format.

Each *sector* object must contain a `sector` number and a `data` array containing the sector's data.  All sectors are
assumed to contain 512 bytes, unless the *sector* object also includes a `length` property specifying a different a
sector size.

Since the `data` array uses signed 32-bit values, a 512-byte sector will normally contain 128 values.  However, if a
sector ends with a series of identical 32-bit values (for example, -1, which is equivalent to 0xffffffff), then a `pattern`
property can be set to that value, which will be used to "fill out" the rest of the sector.  If no `pattern` is specified,
a default pattern of 0 is assumed.

Older **JSON**-encoded disks used a `bytes` array containing unsigned values from 0 to 255, and the optional `pattern` property
was a byte value as well.  PCjs still supports that format, but internally every *sector* `bytes` array is converted to
a `data` array.

Even older **JSON**-encoded disks used hex values, unquoted property names, and in some cases, comment strings that
contained ASCII representations of the sector data, but those were phased out, because JavaScript's JSON.parse() considered
them to be invalid.  PCjs will use eval() as a fall-back if it encounters any of those "invalid" disks, but that's not the
default, in part because eval() is considered "evil", but also because older browsers (like IE9) throw an exception when
eval() is passed a "large" amount data (how large is unclear).

Going forward, PCjs is adding support for additional metadata to be included in **JSON** disk images.  Some of this metadata
may be information that PCjs already stores in separate *manifest.xml* files.  PCjs will not make any assumptions about the
metadata, but if any metadata is present, then the `type` property should be set to "CHSDisk" and the `data` property should
contain the multi-dimensional "CHS" data described above; eg:

    {
        "type": "CHSDisk",
        "data":
        [   // array of cylinders
            [   // array of heads
                [   // array of sectors
                    {"sector":1,"data":[128 32-bit values]},
                    {"sector":2,"data":[128 32-bit values]},
                    ...
                ],
                ...
            ],
            ...
        ],
        ...
    }

Future additions to the metadata may, for example, include a `sectorLength` property that allows a non-default sector
length to be set for the entire disk, eliminating the need for each *sector* to specify its own `length`.

### Creating PCjs Disk Images

PCjs disk images are created with the [DiskDump](/modules/diskdump) utility.  It is normally run as a Node command-line
utility; eg:

	node modules/diskdump/bin/diskdump --disk=PCDOS100.img --format=json --output=PCDOS100.json

Alternatively, if you're running the PCjs Node [web server](/server.js), then you can also use the built-in
[DiskDump API](/api/v1/dump) to creates PCjs disk images:
	
	{{ site.url }}/api/v1/dump?disk=(file|url)&format=json

For example, if you wanted to convert **PCDOS100.img**:

	https://s3-us-west-2.amazonaws.com/archive.pcjs.org/disks/pcx86/dos/ibm/1.00/PCDOS100.img

you could issue the following request, save the resulting JSON file to a folder on your server, and then update your
machine XML file(s) to use **PCDOS100.json**:

	{{ site.url }}/api/v1/dump?disk=https://s3-us-west-2.amazonaws.com/archive.pcjs.org/disks/pcx86/dos/ibm/1.00/PCDOS100.img&format=json

Although PCx86 will accept IMG disk image files, it must call the [DiskDump API](/api/v1/dump) to convert the
image every time it's loaded, which is slower than using pre-converted JSON-encoded disk images and will only work
with the PCjs Node [web server](/server.js).

Remember that PC and PC XT machines supported only 160Kb diskettes (on any version of PC-DOS), 320Kb diskettes
(on PC-DOS 1.1 and higher), and 180Kb and 360Kb diskettes (on PC-DOS 2.0 and higher).

The 1.2Mb diskette format was introduced with the PC AT, and 720Kb and 1.44Mb diskette formats were supported later
on 8Mhz PC AT and PS/2 models.  So, when using any of these larger formats, be sure you're also using a compatible
machine configuration.

### Saving PCjs Disk Images

There are several ways you can convert a PCjs **JSON** disk image back into a binary **IMG** file:

- Load the disk into a PCjs machine and click **Save** (PCx86 machines only)
- Use the [DiskDump API](/api/v1/dump) (requires a PCjs Node web server; see [below](#saving-disks-with-the-diskdump-api))
- Use the [DiskDump Command-line Utility](/modules/diskdump/) (requires Node)

Note that whenever you **Save** a disk being used by a PCjs machine, it is saved exactly as it exists
at that point in time.  So, if you made any changes to the disk, those changes will be preserved
in your saved copy.  Otherwise, the disk image should be an exact copy of the original PCjs disk.

### Saving Disks with the DiskDump API

If you're running the PCjs Node [web server](/server.js) locally, then you also have the option of using the
[DiskDump API](/api/v1/dump) to convert a JSON disk image back into an IMG file.  Set the *format* parameter
set to `img` instead of `json`.  For example:

	{{ site.url }}/api/v1/dump?disk={{ site.url }}/disks/pcx86/dos/ibm/1.00/PCDOS100.json&format=img

The [HTMLOut Component](https://github.com/jeffpar/pcjs/blob/master/modules/htmlout/lib/htmlout.js)
of the PCjs Node web server also generates "onclick" handlers for links to **JSON** disk images that automatically
invoke the API for you.

Instructions for running the PCjs Node web server can be found in the [PCjs Repository](https://github.com/jeffpar/pcjs#installing-pcjs-with-node).
