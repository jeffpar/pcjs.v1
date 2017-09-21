---
layout: page
title: IBM Pascal Compiler 1.00
permalink: /disks/pcx86/tools/ibm/pascal/1.00/
---

IBM Pascal Compiler 1.00
------------------------

When the IBM Pascal Compiler 1.00 was originally released in August 1981, the standard IBM PC contained at most
two diskette drives (no hard drive), so compiling Pascal programs required using a "scratch disk" in drive B:
and then inserting each of the three 160Kb Pascal Compiler disks into drive A: to complete the compilation and
linking process.  Moreover, the user was required to copy LINK.EXE from their PC-DOS 1.00 diskette (the only version
of PC-DOS available at the time) to the third disk.

To make life a bit simpler (but only a bit), we've combined the contents of all three diskettes onto a 360Kb "Combined"
diskette, along with LINK.EXE from PC-DOS 1.00.  Here's the [DiskDump](/modules/diskdump/) command used to produce the
diskette image:

	diskdump --path="archive/PAS1/PAS1.EXE;PASKEY;ENTX6S.ASM;FILKQQ.INC;FILUQQ.INC;archive/PAS2/PAS2.EXE;
	archive/PAS3/PASCAL;PASCAL.LIB;../../../../dos/ibm/1.00/archive/PCDOS100/LINK.EXE" --format=json --label=PASCAL100
	--output=PASCAL100-DISKS.json --manifest 

It's important to use the original PC-DOS linker, because not all linkers will process IBM Pascal 1.00 object files
properly.  Given this dependency, it's odd that IBM didn't simply distribute the PC-DOS 1.00 linker on the third IBM
Pascal disk; there was certainly room for it, so it wouldn't have cost anything, and it would have reduced the risk
of using a newer and potentially incompatible linker.

### Directory of IBM Pascal 1.00 (Disk 1)

### Directory of IBM Pascal 1.00 (Disk 2)

### Directory of IBM Pascal 1.00 (Disk 3)

### Directory of IBM Pascal 1.00 (Combined)
