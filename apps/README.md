---
layout: page
title: Software Archives
permalink: /apps/
---

Software Archives
-----------------

PCjs includes archives of selected software:

* [IBM PC Application Demos](pcx86/)
* [Challenger 1P Applications](c1p/)
* [DEC PDP-10 Tapes and Diagnostics](pdp10/)
* [DEC PDP-11 Tapes and Diagnostics](pdp11/)

You can also browse our software archives by disk:

* [IBM PC Disk Library](/disks/pcx86/)
* [Challenger 1P Disk Library](/disks/c1p/)
* [DEC Disk Library](/disks/dec/)

---

### Software Application Manifests

In the PCjs Project, every complete software package is stored in its own folder, either as a set of individual
files (under [/apps](/apps/)) or as a set of disk images (under [/disks](/disks/)), along with a **manifest.xml**
file that describes the software.  The manifest format is still being developed, but at a minimum, it should contain
the following information about the software:

- Title
- Version
- Type (eg, Application, Game, OS, Diagnostic, Utility, etc)
- Category (eg, Productivity, Text Adventure, BASIC Compiler, etc)
- Company (eg, IBM, Microsoft, etc)
- Creation Date (of first version)
- Release Date (of this version, if different from creation date)
- Creator(s) (of first version)
- Author(s) (of this version, if different from creator(s))
- Contributors(s) (names of additional contributor(s) to this version)
- Publisher (name of publisher, if different from company)
- License (with link to current software license, if any)
- Machine (reference to PCjs machine.xml file capable of loading/running the software)
- Disk(s) (one or more entries describing sets of files and/or disk images)

The distinctions made by Type and Category are a bit arbitrary and likely to change.  For now,
Type is merely a reflection of how we initially filed the original [disks](/disks/pcx86/), while Category
provides more detail.

### Example: VisiCalc

VisiCalc is stored in an [/apps folder](/apps/pcx86/1981/visicalc/), and two relevant files are
described by &lt;file&gt; entries in its [manifest](/apps/pcx86/1981/visicalc/manifest.xml):

```xml
<manifest>
    <title>VisiCalc</title>
    <version>VC-176Y2-IBM-TEST</version>
    <type>Application</type>
    <category>Productivity</category>
    <company>Software Arts</company>
        <releaseDate>December 16, 1981</releaseDate>
    <machine href="/devices/pcx86/machine/5150/mda/64kb/machine.xml" state="/apps/pcx86/1981/visicalc/state.json"/>
    <disk id="disk" dir="/apps/pcx86/1981/visicalc/bin/">
        <file>VC.COM</file>
        <file dir="../">README.md</file>
        <link href="http://www.bricklin.com/history/vclicense.htm">VisiCalc License</link>
    </disk>
</manifest>
```

Since this [manifest](/apps/pcx86/1981/visicalc/manifest.xml) also contains a &lt;machine&gt; entry,
the default manifest stylesheet will automatically load and launch the associated
[PCjs machine](/devices/pcx86/machine/5150/mda/64kb/machine.xml).  The machine will boot or resume according
to its own &lt;[computer](/docs/pcx86/computer/)&gt; settings, unless the manifest overrides the machine's
default state with its own *state* setting; eg:

```xml
<machine href="/devices/pcx86/machine/5150/mda/64kb/machine.xml" state="/apps/pcx86/1981/visicalc/state.json"/>
```

The machine.xml file, in turn, refers to a [sample set](/disks/pcx86/samples.xml) of disk images, one of which is:
 
```xml
<manifest ref="/apps/pcx86/1981/visicalc/manifest.xml" disk="*"/>
```

which refers to the &lt;disk&gt; entry in the VisiCalc manifest -- which brings us full circle.

Since that &lt;disk&gt; entry is just a reference to a folder, PCjs must first convert it to a disk image,
using the following API request:

	http://localhost:8088/api/v1/dump?path=/apps/pcx86/1981/visicalc/bin/VC.COM;../README.md&format=json

The PCjs DiskDump module processes the dump request and generates a JSON-encoded DOS 2.x-compatible disk image
containing all the specified files.

However, to avoid the PCjs web server re-generating the same disk image for every user-initiated disk load, we
have saved that JSON-encoded image as static file on the server, and then added an *href* attribute to the manifest's
&lt;disk&gt; entry:

```xml
<manifest>
    <disk id="disk01" dir="/apps/pcx86/1981/visicalc/archive/" href="/apps/pcx86/1981/visicalc/disk.json">
        ...
    </disk>
</manifest>
```

PCjs always prefers a resource specified by *href*.  While the &lt;file&gt; entries are now superfluous, they
still serve to document the contents of the disk image, and are still necessary if the disk image ever needs to
be re-generated.

### Example: CP/M-86

CPM-86 is stored as two disk images in a [/disks folder](/disks/pcx86/cpm/1.1b/). The disk images are described in that
folder's [manifest](/disks/pcx86/cpm/1.1b/manifest.xml):

```xml
<manifest>
    <title>CP/M-86</title>
    <version>1.1B</version>
    <type>OS</type>
    <category>Operating System</category>
    <company href="http://en.wikipedia.org/wiki/Digital_Research">Digital Research</company>
    <publisher href="http://en.wikipedia.org/wiki/Eagle_Computer">Eagle Computer</publisher>
    <releaseDate>May 20, 1983</releaseDate>
    <machine href="/disks/pcx86/cpm/1.1b/machine.xml"/>
    <disk id="disk01" href="/disks/pcx86/cpm/1.1b/cpm86-disk1.json">
        <name>CP/M-86 (Disk 1)</name>
    </disk>
    <disk id="disk02" href="/disks/pcx86/cpm/1.1b/cpm86-disk2.json">
        <name>CP/M-86 (Disk 2)</name>
    </disk>
</manifest>
```

In this case, the software was "born" as disk images (non-DOS disk images at that), so we don't
bother listing the contents of those images with &lt;file&gt; entries inside the &lt;disk&gt; entries.

We do, however, include optional &lt;name&gt; entries that help describe (or at least differentiate)
the disk images.

If a machine file wanted to use only the first disk, then it would specify:

```xml
<manifest ref="/disks/pcx86/cpm/1.1b/manifest.xml" disk="disk01"/>
```

and if it wanted to use all the disks listed in the manifest, it would specify:

```xml
<manifest ref="/disks/pcx86/cpm/1.1b/manifest.xml" disk="*"/>
```

which is what our [CP/M Machine Configuration](/disks/pcx86/cpm/1.1b/machine.xml) does.
