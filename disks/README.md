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

### Saving PCjs Disk Images

There are several ways you can convert a PCjs **JSON** disk image back into a binary **IMG** file:

- Load the disk into a PCjs machine and click **Save** (PCx86 machines only)
- Use the [DiskDump API](/api/v1/dump) (available only with the [PCjs Node Web Server](#saving-disks-with-the-diskdump-api))
- Use the [DiskDump Command-line Utility](/modules/diskdump/) (requires Node)

Note that whenever you **Save** a disk being used by a PCjs machine, it is saved exactly as it exists
at that point in time.  So, if you made any changes to the disk, those changes will be preserved
in your saved copy.  Otherwise, the disk image should be an exact copy of the original PCjs disk.

### Saving Disks with the DiskDump API

If you're running the PCjs Node Web Server locally, then you also have the option of using the
[DiskDump API](/api/v1/dump).  Set the *format* parameter set to `img` instead of `json`.  For example:

	http://localhost:8088/api/v1/dump?disk=/disks/pcx86/dos/ibm/2.00/PCDOS200-DISK1.json&format=img

The [HTMLOut Component](https://github.com/jeffpar/pcjs/blob/master/modules/htmlout/lib/htmlout.js)
of the PCjs Node Web Server also generates "onclick" handlers for links to **JSON** disk
images that automatically invoke the API for you.

Instructions for running the PCjs Node Web Server can be found in the [PCjs Repository](https://github.com/jeffpar/pcjs#installing-pcjs-with-node).
  
Also see [Creating PCx86-Compatible Disk Images](/docs/pcx86/#creating-pcx86-compatible-disk-images)
in the [PCx86 Documentation](/docs/pcx86/) for more information about supported disks and formats.
