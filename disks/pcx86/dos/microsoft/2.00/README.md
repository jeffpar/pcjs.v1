---
layout: page
title: Microsoft MS-DOS 2.00
permalink: /disks/pcx86/dos/microsoft/2.00/
machines:
  - id: ibm5160
    type: pcx86
    config: /devices/pcx86/machine/5160/mda/256kb/debugger/machine.xml
    drives: '[{name:"10Mb Hard Disk",type:3,path:"/pcjs-disks/pcx86/dos/microsoft/2.00/MSDOS2X-SRC.json"}]'
    autoMount:
      A:
        name: PC DOS 2.00 (Disk 1)
      B:
        name: PC DOS 2.00 (Disk 2)
    autoStart: true
    autoType: $date\r$time\r
---

Microsoft MS-DOS 2.00
---------------------

There was no MS-DOS 2.00 product *per se*.  Instead, there were OEM releases of MS-DOS based on version 2.00,
including:

* [COMPAQ MS-DOS 2.12](/disks/pcx86/dos/compaq/2.12/)

MS-DOS 2.00 Source Code
-----------------------

On March 25, 2014, the source code upon which OEMs based their MS-DOS 1.x and 2.x releases was made available to the
public by the [Computer History Museum](http://www.computerhistory.org/atchm/microsoft-ms-dos-early-source-code/),
with the permission of Microsoft.

![MS-DOS 2.00]({{ site.pcjs-disks.baseurl }}/pcjs-disks/pcx86/dos/microsoft/2.00/MSDOS200-DISKS.jpg)

Unfortunately, the Computer History Museum chose not to divulge the original contents of the diskettes in its possession.
Instead, they released a ZIP archive that aggregated the contents of the MS-DOS 2.x diskettes into two folders, `v20object`
and `v20source`, with no clear indication which files came from which disk, why some files were renamed (and what the
original names were), and what (if anything) was omitted.

To underscore the confusion, some [WordStar 3.20](/disks/pcx86/apps/other/wordstar/3.20/) binary files were included in the
`v20source` folder, completely unrelated to MS-DOS and also completely useless, since the main executable, `WS.COM`, was *not*
included.

Finally, it isn't entirely correct to describe these files as the sources for "MS-DOS 2.0".  It's actually a much later
snapshot of the code used to build MS-DOS 2.11, so we refer to this collection as MS-DOS 2.x source code.

**UPDATE**: On September 28, 2018, Microsoft
[re-released](https://blogs.msdn.microsoft.com/commandline/2018/09/28/re-open-sourcing-ms-dos-1-25-and-2-0/)
the MS-DOS 1.x and 2.x source files on [GitHub](https://github.com/microsoft/ms-dos).  The files are identical to the
original CHM release, so no effort was made to improve the previous release, remove irrelevant files, organize them by
original diskette, etc.  And while I'm a big fan of GitHub, one downside to using a Git repository to "archive" old files
is that all the original file modification dates and times are lost.

Microsoft's sole improvement of the 2018 re-release was to quietly relax restrictions on the reuse of the source code,
by releasing it under an [MIT License](https://en.wikipedia.org/wiki/MIT_License), instead of the older and much more restrictive
[Microsoft Research License Agreement](http://www.computerhistory.org/atchm/microsoft-research-license-agreement-msdos-v1-1-v2-0/).

Building MS-DOS 2.x Source Code
-------------------------------

For the machine below, a 10Mb hard disk image was built containing all the MS-DOS 2.x sources:

    diskdump --dir=archive/src/ --format=json --output=MSDOS2X-SRC.json --label=MSDOS.SRC --size=10000 --normalize --overwrite

Tips for building MS-DOS 2.x binaries, along with some live demonstrations, will be coming at a later date.

{% include machine.html id="ibm5160" %}
