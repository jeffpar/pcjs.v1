---
layout: page
title: Microsoft MS-DOS 2.00
permalink: /disks/pcx86/dos/microsoft/2.00/
machines:
  - id: ibm5160
    type: pcx86
    config: /devices/pcx86/machine/5160/cga/512kb/debugger/machine.xml
    drives: '[{name:"PC-DOS 2.00 w/Tools (10Mb)",type:3,path:"/pcjs-disks/pcx86/drives/10mb/PCDOS200-C400.json"},{name:"MS-DOS 2.x Source (10Mb)",type:3,path:"/pcjs-disks/pcx86/dos/microsoft/2.00/MSDOS2X-SRC.json"}]'
    autoMount:
      A:
        name: None
      B:
        name: None
    autoStart: true
    autoType: $date\r$time\rD:\r
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
original diskette, etc.  While GitHub is a great resource, one downside to using a Git repository to "archive" old files
is that all the original file modification dates and times are lost.

Microsoft's sole improvement of the 2018 re-release was to quietly relax restrictions on the reuse of the source code,
by releasing it under an [MIT License](https://en.wikipedia.org/wiki/MIT_License), instead of the older and much more restrictive
[Microsoft Research License Agreement](http://www.computerhistory.org/atchm/microsoft-research-license-agreement-msdos-v1-1-v2-0/).

Building MS-DOS 2.x Source Code
-------------------------------

For the machine below, we built a 10Mb hard disk image with all the MS-DOS 2.x sources:

    diskdump --dir=src --format=json --output=MSDOS2X-SRC.json --label=MSDOS2X --size=10000 --normalize --overwrite

We started with the source files from the CHM release, which had preserved the original file times:

      11648 Aug 18 14:26:36 1983 ALLOC.ASM
       6784 Jan 27 14:31:32 1983 ANSI.TXT
      14716 Aug 19 11:53:04 1983 BUF.ASM
      26880 Aug 18 16:10:38 1983 CHKDSK.ASM
      14080 Aug 18 16:14:44 1983 CHKMES.ASM
      40704 Aug 18 16:12:18 1983 CHKPROC.ASM
        900 Aug 25 15:06:18 1983 COMEQU.ASM
        128 Aug 18 15:18:16 1983 COMLINK
      23936 Aug 18 14:59:06 1983 COMMAND.ASM
        782 Aug 25 15:04:08 1983 COMSEG.ASM
        512 Dec 31 23:13:10 1979 COMSW.ASM
       3456 Jan 27 14:35:06 1983 CONFIG.TXT
      20480 Aug 18 15:14:20 1983 COPY.ASM
      18304 Aug 18 15:15:16 1983 COPYPROC.ASM
       9472 Aug 18 15:15:56 1983 CPARSE.ASM
      14764 Aug 19 11:55:50 1983 CTRLC.ASM
      34304 Aug 18 16:03:54 1983 DEBASM.ASM
      27008 Aug 18 15:58:12 1983 DEBCOM1.ASM
      37356 Oct 20 10:28:10 1983 DEBCOM2.ASM
      38912 Aug 18 16:07:06 1983 DEBCONST.ASM
       2816 Aug 18 16:07:40 1983 DEBDATA.ASM
       1280 Jan  1 00:12:36 1980 DEBEQU.ASM
       5248 Dec 31 23:49:10 1979 DEBMES.ASM
      21888 Aug 18 16:05:14 1983 DEBUASM.ASM
      22016 Aug 18 15:56:58 1983 DEBUG.ASM
      12032 Aug 18 14:27:22 1983 DEV.ASM
      37888 Jan 27 14:22:46 1983 DEVDRIV.TXT
       2688 Oct 18 12:07:22 1982 DEVSYM.ASM
      29568 Aug 18 14:28:48 1983 DIR.ASM
      14592 Aug 18 14:25:40 1983 DIRCALL.ASM
      38016 Aug 18 14:30:38 1983 DISK.ASM
       6656 Dec 31 23:51:48 1979 DISKCOPY.ASM
       7808 Dec 31 23:52:38 1979 DISKMES.ASM
        141 Aug 25 16:46:20 1983 DOSLINK
       4395 Sep 12 10:41:22 1983 DOSMAC.211
       6656 Oct 18 12:06:50 1982 DOSMAC.ASM
      14098 Sep 28 14:41:50 1983 DOSMES.ASM
        357 Aug 25 15:04:22 1983 DOSSEG.ASM
      44887 Aug 25 15:05:44 1983 DOSSYM.211
      42112 Dec 31 23:07:56 1979 DOSSYM.ASM
      56960 Jan  1 01:08:10 1980 EDLIN.ASM
       3200 Aug 18 16:21:46 1983 EDLMES.ASM
      13190 Sep 22 23:03:32 1983 EDLPROC.ASM
      13824 Dec 31 23:45:06 1979 EXE2BIN.ASM
      31011 Aug 19 11:59:32 1983 EXEC.ASM
        768 Dec 31 23:45:24 1979 EXEMES.ASM
      10112 Aug 18 14:31:30 1983 FAT.ASM
      65024 Dec 31 23:26:22 1979 FC.ASM
      13392 Aug 19 11:52:32 1983 FCB.ASM
       2048 Dec 31 23:26:42 1979 FCMES.ASM
      39168 Dec 31 23:28:36 1979 FIND.ASM
       1408 Dec 31 23:29:22 1979 FINDMES.ASM
      46720 Jan  1 13:48:16 1980 FORMAT.ASM
      16640 Feb  3 14:37:24 1983 FORMAT.TXT
       4529 Sep 22 22:00:04 1983 FORMES.ASM
       4096 Feb  3 13:45:06 1983 GENFOR.ASM
      18048 Aug 18 14:14:38 1983 GETSET.ASM
      17536 Dec 31 23:15:46 1979 HRDDRV.ASM
        303 Aug 25 15:06:00 1983 IFEQU.ASM
       2688 Jan 27 14:42:28 1983 INCOMP.TXT
      24832 Aug 18 15:01:24 1983 INIT.ASM
       4224 Jan 27 14:30:34 1983 INT24.TXT
      18304 Aug 18 14:13:16 1983 MISC.ASM
       3712 Jan  1 01:39:20 1980 MORE.ASM
        313 Sep 22 21:23:54 1983 MOREMES.ASM
      22208 Jan  3 04:25:56 1980 MSCODE.ASM
      11520 Dec 31 23:15:46 1979 MSDATA.ASM
        176 Jan  3 04:18:14 1980 MSDOS.ASM
       9216 Dec 31 23:10:14 1979 MSHEAD.ASM
      13568 Dec 31 23:24:52 1979 MSINIT.ASM
       3200 Oct 28 17:32:12 1982 PCLOCK.ASM
      48000 Jan  1 01:42:56 1980 PRINT.211
      48000 Feb  1 11:37:30 1983 PRINT.ASM
       3222 Aug 19 11:55:22 1983 PROC.ASM
      21248 Oct 28 17:31:38 1982 PROFIL.ASM
       3968 Jan 27 14:34:16 1983 PROFILE.TXT
       1536 Jan 28 17:06:32 1983 PROHST.HLP
       3456 Jan 27 14:39:32 1983 QUICK.TXT
       6784 Aug 18 15:00:18 1983 RDATA.ASM
       8832 Dec 31 23:03:22 1979 README.TXT
       5760 Dec 31 23:39:06 1979 RECMES.ASM
      23808 Jan  1 02:01:58 1980 RECOVER.ASM
      14336 Aug 18 14:32:20 1983 ROM.ASM
       6912 Aug 18 14:59:40 1983 RUCODE.ASM
      45056 Dec 31 23:05:08 1979 SKELIO.ASM
      17099 Sep 22 22:27:04 1983 SORT.ASM
       2688 Jan  1 02:07:50 1980 SORTMES.ASM
        256 Aug 18 14:32:46 1983 STDBUF.ASM
        256 Aug 18 14:33:56 1983 STDCALL.ASM
        256 Aug 18 14:39:02 1983 STDCTRLC.ASM
        193 Jan  3 06:40:50 1980 STDFCB.ASM
        210 Jan  3 06:41:02 1980 STDIO.ASM
        185 Jan  3 05:27:54 1980 STDPROC.ASM
       1280 Dec 31 23:12:18 1979 STDSW.ASM
       9726 Aug 19 11:54:24 1983 STRIN.ASM
      22784 Sep 22 21:29:40 1983 SYS.ASM
      21220 Jan  3 05:26:22 1980 SYSCALL.ASM
      59136 Jan 27 14:18:18 1983 SYSCALL.TXT
        512 Dec 31 23:44:22 1979 SYSIMES.ASM
      37644 Oct 12 21:24:26 1983 SYSINIT.ASM
       3072 Jan 27 14:40:24 1983 SYSINIT.TXT
       1206 Sep 22 21:52:50 1983 SYSMES.ASM
      33664 Sep  8 01:48:06 1983 TCODE.ASM
      13568 Aug 18 15:05:08 1983 TCODE2.ASM
      16896 Aug 18 15:10:32 1983 TCODE3.ASM
      27392 Aug 18 15:11:40 1983 TCODE4.ASM
      24576 Sep  8 01:49:00 1983 TCODE5.ASM
       9088 Dec 31 23:38:32 1979 TDATA.ASM
       7040 Aug 18 14:45:52 1983 TIME.ASM
       4480 Aug 18 15:17:42 1983 TSPC.ASM
       7808 Aug 18 15:13:22 1983 TUCODE.ASM
        896 Dec 31 23:03:04 1979 UINIT.ASM
      27776 Jan 27 14:26:10 1983 UTILITY.TXT
      25984 Jan  3 05:57:14 1980 XENIX.ASM
      17792 Aug 18 14:51:18 1983 XENIX2.ASM

Next, we organized all the source files into folders that correspond to their respective components, and created
makefiles where appropriate
(eg, [MSDOS.MAK](https://github.com/jeffpar/pcjs-disks/blob/master/pcx86/dos/microsoft/2.00/src/MSDOS/MSDOS.MAK)).
Also, in the [INC](https://github.com/jeffpar/pcjs-disks/tree/master/pcx86/dos/microsoft/2.00/src/INC) folder, we copied
`DOSMAC.211` to `DOSMAC.ASM`, and `DOSSYM.211` to `DOSSYM.ASM`, since the sources are primarily a snapshot of MS-DOS 2.11.

- [CHKDSK](https://github.com/jeffpar/pcjs-disks/tree/master/pcx86/dos/microsoft/2.00/src/CHKDSK)
- [COMMAND](https://github.com/jeffpar/pcjs-disks/tree/master/pcx86/dos/microsoft/2.00/src/COMMAND)
- [DEBUG](https://github.com/jeffpar/pcjs-disks/tree/master/pcx86/dos/microsoft/2.00/src/DEBUG)
- [DISKCOPY](https://github.com/jeffpar/pcjs-disks/tree/master/pcx86/dos/microsoft/2.00/src/DISKCOPY)
- [DOCS](https://github.com/jeffpar/pcjs-disks/tree/master/pcx86/dos/microsoft/2.00/src/DOCS)
- [DRIVERS](https://github.com/jeffpar/pcjs-disks/tree/master/pcx86/dos/microsoft/2.00/src/DRIVERS)
- [EDLIN](https://github.com/jeffpar/pcjs-disks/tree/master/pcx86/dos/microsoft/2.00/src/EDLIN)
- [EXE2BIN](https://github.com/jeffpar/pcjs-disks/tree/master/pcx86/dos/microsoft/2.00/src/EXE2BIN)
- [FC](https://github.com/jeffpar/pcjs-disks/tree/master/pcx86/dos/microsoft/2.00/src/FC)
- [FIND](https://github.com/jeffpar/pcjs-disks/tree/master/pcx86/dos/microsoft/2.00/src/FIND)
- [FORMAT](https://github.com/jeffpar/pcjs-disks/tree/master/pcx86/dos/microsoft/2.00/src/FORMAT)
- [INC](https://github.com/jeffpar/pcjs-disks/tree/master/pcx86/dos/microsoft/2.00/src/INC)
- [IO](https://github.com/jeffpar/pcjs-disks/tree/master/pcx86/dos/microsoft/2.00/src/IO)
- [MORE](https://github.com/jeffpar/pcjs-disks/tree/master/pcx86/dos/microsoft/2.00/src/MORE)
- [MSDOS](https://github.com/jeffpar/pcjs-disks/tree/master/pcx86/dos/microsoft/2.00/src/MSDOS)
- [PRINT](https://github.com/jeffpar/pcjs-disks/tree/master/pcx86/dos/microsoft/2.00/src/PRINT)
- [PROFIL](https://github.com/jeffpar/pcjs-disks/tree/master/pcx86/dos/microsoft/2.00/src/PROFIL)
- [RECOVER](https://github.com/jeffpar/pcjs-disks/tree/master/pcx86/dos/microsoft/2.00/src/RECOVER)
- [SORT](https://github.com/jeffpar/pcjs-disks/tree/master/pcx86/dos/microsoft/2.00/src/SORT)
- [SYS](https://github.com/jeffpar/pcjs-disks/tree/master/pcx86/dos/microsoft/2.00/src/SYS)

Then we supplemented the [MSDOS](https://github.com/jeffpar/pcjs-disks/tree/master/pcx86/dos/microsoft/2.00/src/MSDOS)
folder with reconstructed
[IO.ASM](https://jeffpar.github.io/pcjs-disks/pcx86/dos/microsoft/2.00/src/MSDOS/IO.ASM) and
[IO2.ASM](https://jeffpar.github.io/pcjs-disks/pcx86/dos/microsoft/2.00/src/MSDOS/IO2.ASM) files from
[John Elliott](http://www.seasip.info/DOS/).

In the machine below, all the above files, along with a
[MK.BAT](https://github.com/jeffpar/pcjs-disks/blob/master/pcx86/dos/microsoft/2.00/src/MK.BAT)
batch file, are on drive D.  Drive C contains a bootable copy of PC DOS 2.00, along with Microsoft MASM 4.00
and other assorted tools.

If `MK.BAT` is invoked with the name of one of the folders (eg, `MK COMMAND`), it will run `MAKE` in that
folder; otherwise, it will run `MAKE` in all the folders containing a makefile.

Finally, a word about speed: the typical PC in the early 1980s was still a 4.77Mhz 8088-based machine, so it took
a considerable amount of time to rebuild MS-DOS 2.x.  If you're impatient, you can load the machine on this page with a
higher speed multiplier (eg, [multiplier=8](https://www.pcjs.org/disks/pcx86/dos/microsoft/2.00/?multiplier=8)) or click
the *Speed* button below until it's running at speed that you prefer (and that your browser supports).

{% include machine.html id="ibm5160" %}

The results of running `MK.BAT` are shown below:

    D:\>mk

    D:\>ECHO OFF


    D:\>ECHO OFF
    Microsoft (R) Program Maintenance Utility  Version 4.02
    Copyright (C) Microsoft Corp 1984, 1985, 1986.  All rights reserved.

    make : target does not exist 'EXE2BIN.OBJ'
            MASM /I..\INC EXE2BIN,EXE2BIN.OBJ;
    Microsoft (R) Macro Assembler  Version 4.00
    Copyright (C) Microsoft Corp 1981, 1983, 1984, 1985.  All rights reserved.


    21946 Bytes symbol space free

        0 Warning Errors
        0 Severe  Errors
    make : target does not exist 'EXEMES.OBJ'
            MASM /I..\INC EXEMES,EXEMES.OBJ;
    Microsoft (R) Macro Assembler  Version 4.00
    Copyright (C) Microsoft Corp 1981, 1983, 1984, 1985.  All rights reserved.


    50044 Bytes symbol space free

        0 Warning Errors
        0 Severe  Errors
    make : target does not exist 'EXE2BIN.EXE'
            LINK EXE2BIN.OBJ EXEMES.OBJ,EXE2BIN.EXE,EXE2BIN.MAP/M;
    Microsoft (R) Overlay Linker  Version 3.51
    Copyright (C) Microsoft Corp 1983, 1984, 1985, 1986.  All rights reserved.




    D:\>ECHO OFF
    Microsoft (R) Program Maintenance Utility  Version 4.02
    Copyright (C) Microsoft Corp 1984, 1985, 1986.  All rights reserved.

    make : target does not exist 'CHKDSK.OBJ'
            MASM /I..\INC CHKDSK,CHKDSK.OBJ;
    Microsoft (R) Macro Assembler  Version 4.00
    Copyright (C) Microsoft Corp 1981, 1983, 1984, 1985.  All rights reserved.


    18020 Bytes symbol space free

        0 Warning Errors
        0 Severe  Errors
    make : target does not exist 'CHKMES.OBJ'
            MASM /I..\INC CHKMES,CHKMES.OBJ;
    Microsoft (R) Macro Assembler  Version 4.00
    Copyright (C) Microsoft Corp 1981, 1983, 1984, 1985.  All rights reserved.


    20368 Bytes symbol space free

        0 Warning Errors
        0 Severe  Errors
    make : target does not exist 'CHKPROC.OBJ'
            MASM /I..\INC CHKPROC,CHKPROC.OBJ;
    Microsoft (R) Macro Assembler  Version 4.00
    Copyright (C) Microsoft Corp 1981, 1983, 1984, 1985.  All rights reserved.


    15346 Bytes symbol space free

        0 Warning Errors
        0 Severe  Errors
    make : target does not exist 'CHKDSK.EXE'
            LINK CHKDSK.OBJ CHKMES.OBJ CHKPROC.OBJ,CHKDSK.EXE,CHKDSK.MAP/M;
    Microsoft (R) Overlay Linker  Version 3.51
    Copyright (C) Microsoft Corp 1983, 1984, 1985, 1986.  All rights reserved.

    Warning: no stack segment
    make : target does not exist 'CHKDSK.COM'
            EXE2BIN CHKDSK.EXE CHKDSK.COM



    D:\>ECHO OFF
    Microsoft (R) Program Maintenance Utility  Version 4.02
    Copyright (C) Microsoft Corp 1984, 1985, 1986.  All rights reserved.

    make : target does not exist 'COMMAND.OBJ'
            MASM /I..\INC COMMAND,COMMAND.OBJ;
    Microsoft (R) Macro Assembler  Version 4.00
    Copyright (C) Microsoft Corp 1981, 1983, 1984, 1985.  All rights reserved.

    IBM version 

    12880 Bytes symbol space free

        0 Warning Errors
        0 Severe  Errors
    make : target does not exist 'RUCODE.OBJ'
            MASM /I..\INC RUCODE,RUCODE.OBJ;
    Microsoft (R) Macro Assembler  Version 4.00
    Copyright (C) Microsoft Corp 1981, 1983, 1984, 1985.  All rights reserved.

    IBM version 

    19282 Bytes symbol space free

        0 Warning Errors
        0 Severe  Errors
    make : target does not exist 'RDATA.OBJ'
            MASM /I..\INC RDATA,RDATA.OBJ;
    Microsoft (R) Macro Assembler  Version 4.00
    Copyright (C) Microsoft Corp 1981, 1983, 1984, 1985.  All rights reserved.

    IBM version 

    45370 Bytes symbol space free

        0 Warning Errors
        0 Severe  Errors
    make : target does not exist 'INIT.OBJ'
            MASM /I..\INC INIT,INIT.OBJ;
    Microsoft (R) Macro Assembler  Version 4.00
    Copyright (C) Microsoft Corp 1981, 1983, 1984, 1985.  All rights reserved.

    IBM version 

    17374 Bytes symbol space free

        0 Warning Errors
        0 Severe  Errors
    make : target does not exist 'UINIT.OBJ'
            MASM /I..\INC UINIT,UINIT.OBJ;
    Microsoft (R) Macro Assembler  Version 4.00
    Copyright (C) Microsoft Corp 1981, 1983, 1984, 1985.  All rights reserved.

    IBM version 

    51054 Bytes symbol space free

        0 Warning Errors
        0 Severe  Errors
    make : target does not exist 'TCODE.OBJ'
            MASM /I..\INC TCODE,TCODE.OBJ;
    Microsoft (R) Macro Assembler  Version 4.00
    Copyright (C) Microsoft Corp 1981, 1983, 1984, 1985.  All rights reserved.

    IBM version 

    14100 Bytes symbol space free

        0 Warning Errors
        0 Severe  Errors
    make : target does not exist 'TCODE2.OBJ'
            MASM /I..\INC TCODE2,TCODE2.OBJ;
    Microsoft (R) Macro Assembler  Version 4.00
    Copyright (C) Microsoft Corp 1981, 1983, 1984, 1985.  All rights reserved.

    IBM version 

    17362 Bytes symbol space free

        0 Warning Errors
        0 Severe  Errors
    make : target does not exist 'TCODE3.OBJ'
            MASM /I..\INC TCODE3,TCODE3.OBJ;
    Microsoft (R) Macro Assembler  Version 4.00
    Copyright (C) Microsoft Corp 1981, 1983, 1984, 1985.  All rights reserved.

    IBM version 

    16260 Bytes symbol space free

        0 Warning Errors
        0 Severe  Errors
    make : target does not exist 'TCODE4.OBJ'
            MASM /I..\INC TCODE4,TCODE4.OBJ;
    Microsoft (R) Macro Assembler  Version 4.00
    Copyright (C) Microsoft Corp 1981, 1983, 1984, 1985.  All rights reserved.

    IBM version 

    13102 Bytes symbol space free

        0 Warning Errors
        0 Severe  Errors
    make : target does not exist 'TCODE5.OBJ'
            MASM /I..\INC TCODE5,TCODE5.OBJ;
    Microsoft (R) Macro Assembler  Version 4.00
    Copyright (C) Microsoft Corp 1981, 1983, 1984, 1985.  All rights reserved.

    IBM version 

    14090 Bytes symbol space free

        0 Warning Errors
        0 Severe  Errors
    make : target does not exist 'TUCODE.OBJ'
            MASM /I..\INC TUCODE,TUCODE.OBJ;
    Microsoft (R) Macro Assembler  Version 4.00
    Copyright (C) Microsoft Corp 1981, 1983, 1984, 1985.  All rights reserved.

    IBM version 

    19282 Bytes symbol space free

        0 Warning Errors
        0 Severe  Errors
    make : target does not exist 'COPY.OBJ'
            MASM /I..\INC COPY,COPY.OBJ;
    Microsoft (R) Macro Assembler  Version 4.00
    Copyright (C) Microsoft Corp 1981, 1983, 1984, 1985.  All rights reserved.

    IBM version 

    16298 Bytes symbol space free

        0 Warning Errors
        0 Severe  Errors
    make : target does not exist 'COPYPROC.OBJ'
            MASM /I..\INC COPYPROC,COPYPROC.OBJ;
    Microsoft (R) Macro Assembler  Version 4.00
    Copyright (C) Microsoft Corp 1981, 1983, 1984, 1985.  All rights reserved.

    IBM version 

    17416 Bytes symbol space free

        0 Warning Errors
        0 Severe  Errors
    make : target does not exist 'CPARSE.OBJ'
            MASM /I..\INC CPARSE,CPARSE.OBJ;
    Microsoft (R) Macro Assembler  Version 4.00
    Copyright (C) Microsoft Corp 1981, 1983, 1984, 1985.  All rights reserved.

    IBM version 

    19306 Bytes symbol space free

        0 Warning Errors
        0 Severe  Errors
    make : target does not exist 'TDATA.OBJ'
            MASM /I..\INC TDATA,TDATA.OBJ;
    Microsoft (R) Macro Assembler  Version 4.00
    Copyright (C) Microsoft Corp 1981, 1983, 1984, 1985.  All rights reserved.

    IBM version 

    45970 Bytes symbol space free

        0 Warning Errors
        0 Severe  Errors
    make : target does not exist 'TSPC.OBJ'
            MASM /I..\INC TSPC,TSPC.OBJ;
    Microsoft (R) Macro Assembler  Version 4.00
    Copyright (C) Microsoft Corp 1981, 1983, 1984, 1985.  All rights reserved.

    IBM version 

    18940 Bytes symbol space free

        0 Warning Errors
        0 Severe  Errors
    make : target does not exist 'COMMAND.EXE'
            LINK @COMMAND.LRF,COMMAND.EXE,COMMAND.MAP/M;
    Microsoft (R) Overlay Linker  Version 3.51
    Copyright (C) Microsoft Corp 1983, 1984, 1985, 1986.  All rights reserved.

    Object Modules [.OBJ]: COMMAND.OBJ RUCODE.OBJ RDATA.OBJ INIT.OBJ UINIT.OBJ +
    Object Modules [.OBJ]: TCODE.OBJ TCODE2.OBJ TCODE3.OBJ TCODE4.OBJ TCODE5.OBJ +
    Object Modules [.OBJ]: TUCODE.OBJ COPY.OBJ COPYPROC.OBJ CPARSE.OBJ TDATA.OBJ TSPC.OBJ
    Warning: no stack segment
    make : target does not exist 'COMMAND.COM'
            EXE2BIN COMMAND.EXE COMMAND.COM



    D:\>ECHO OFF
    Microsoft (R) Program Maintenance Utility  Version 4.02
    Copyright (C) Microsoft Corp 1984, 1985, 1986.  All rights reserved.

    make : target does not exist 'DEBUG.OBJ'
            MASM /I..\INC DEBUG,DEBUG.OBJ;
    Microsoft (R) Macro Assembler  Version 4.00
    Copyright (C) Microsoft Corp 1981, 1983, 1984, 1985.  All rights reserved.


    20370 Bytes symbol space free

        0 Warning Errors
        0 Severe  Errors
    make : target does not exist 'DEBASM.OBJ'
            MASM /I..\INC DEBASM,DEBASM.OBJ;
    Microsoft (R) Macro Assembler  Version 4.00
    Copyright (C) Microsoft Corp 1981, 1983, 1984, 1985.  All rights reserved.


    16420 Bytes symbol space free

        0 Warning Errors
        0 Severe  Errors
    make : target does not exist 'DEBUASM.OBJ'
            MASM /I..\INC DEBUASM,DEBUASM.OBJ;
    Microsoft (R) Macro Assembler  Version 4.00
    Copyright (C) Microsoft Corp 1981, 1983, 1984, 1985.  All rights reserved.


    17414 Bytes symbol space free

        0 Warning Errors
        0 Severe  Errors
    make : target does not exist 'DEBCOM1.OBJ'
            MASM /I..\INC DEBCOM1,DEBCOM1.OBJ;
    Microsoft (R) Macro Assembler  Version 4.00
    Copyright (C) Microsoft Corp 1981, 1983, 1984, 1985.  All rights reserved.


    20312 Bytes symbol space free

        0 Warning Errors
        0 Severe  Errors
    make : target does not exist 'DEBCOM2.OBJ'
            MASM /I..\INC DEBCOM2,DEBCOM2.OBJ;
    Microsoft (R) Macro Assembler  Version 4.00
    Copyright (C) Microsoft Corp 1981, 1983, 1984, 1985.  All rights reserved.


    16016 Bytes symbol space free

        0 Warning Errors
        0 Severe  Errors
    make : target does not exist 'DEBCONST.OBJ'
            MASM /I..\INC DEBCONST,DEBCONST.OBJ;
    Microsoft (R) Macro Assembler  Version 4.00
    Copyright (C) Microsoft Corp 1981, 1983, 1984, 1985.  All rights reserved.


    15354 Bytes symbol space free

        0 Warning Errors
        0 Severe  Errors
    make : target does not exist 'DEBDATA.OBJ'
            MASM /I..\INC DEBDATA,DEBDATA.OBJ;
    Microsoft (R) Macro Assembler  Version 4.00
    Copyright (C) Microsoft Corp 1981, 1983, 1984, 1985.  All rights reserved.


    21978 Bytes symbol space free

        0 Warning Errors
        0 Severe  Errors
    make : target does not exist 'DEBMES.OBJ'
            MASM /I..\INC DEBMES,DEBMES.OBJ;
    Microsoft (R) Macro Assembler  Version 4.00
    Copyright (C) Microsoft Corp 1981, 1983, 1984, 1985.  All rights reserved.


    23450 Bytes symbol space free

        0 Warning Errors
        0 Severe  Errors
    make : target does not exist 'DEBUG.EXE'
            LINK @DEBUG.LRF,DEBUG.EXE,DEBUG.MAP/M;
    Microsoft (R) Overlay Linker  Version 3.51
    Copyright (C) Microsoft Corp 1983, 1984, 1985, 1986.  All rights reserved.

    Object Modules [.OBJ]: DEBUG.OBJ DEBCOM1.OBJ DEBCOM2.OBJ +
    Object Modules [.OBJ]: DEBUASM.OBJ DEBASM.OBJ DEBCONST.OBJ +
    Object Modules [.OBJ]: DEBDATA.OBJ DEBMES.OBJ
    Warning: no stack segment
    make : target does not exist 'DEBUG.COM'
            EXE2BIN DEBUG.EXE DEBUG.COM



    D:\>ECHO OFF
    Microsoft (R) Program Maintenance Utility  Version 4.02
    Copyright (C) Microsoft Corp 1984, 1985, 1986.  All rights reserved.

    make : target does not exist 'DISKCOPY.OBJ'
            MASM /I..\INC DISKCOPY,DISKCOPY.OBJ;
    Microsoft (R) Macro Assembler  Version 4.00
    Copyright (C) Microsoft Corp 1981, 1983, 1984, 1985.  All rights reserved.


    22368 Bytes symbol space free

        0 Warning Errors
        0 Severe  Errors
    make : target does not exist 'DISKMES.OBJ'
            MASM /I..\INC DISKMES,DISKMES.OBJ;
    Microsoft (R) Macro Assembler  Version 4.00
    Copyright (C) Microsoft Corp 1981, 1983, 1984, 1985.  All rights reserved.


    22372 Bytes symbol space free

        0 Warning Errors
        0 Severe  Errors
    make : target does not exist 'DISKCOPY.EXE'
            LINK DISKCOPY.OBJ DISKMES.OBJ,DISKCOPY.EXE,DISKCOPY.MAP/M;
    Microsoft (R) Overlay Linker  Version 3.51
    Copyright (C) Microsoft Corp 1983, 1984, 1985, 1986.  All rights reserved.

    Warning: no stack segment
    make : target does not exist 'DISKCOPY.COM'
            EXE2BIN DISKCOPY.EXE DISKCOPY.COM



    D:\>ECHO OFF
    Invalid directory
    Microsoft (R) Program Maintenance Utility  Version 4.02
    Copyright (C) Microsoft Corp 1984, 1985, 1986.  All rights reserved.

    EDCOMMAND.MAK(1) : make : EDCOMMAND.MAK - No such file or directory

    Invalid directory



    D:\>ECHO OFF
    Invalid directory
    Microsoft (R) Program Maintenance Utility  Version 4.02
    Copyright (C) Microsoft Corp 1984, 1985, 1986.  All rights reserved.

    T.MAK(1) : make : T.MAK - No such file or directory

    Invalid directory



    D:\>ECHO OFF
    Microsoft (R) Program Maintenance Utility  Version 4.02
    Copyright (C) Microsoft Corp 1984, 1985, 1986.  All rights reserved.

    make : target does not exist 'MORE.OBJ'
            MASM /I..\INC MORE,MORE.OBJ;
    Microsoft (R) Macro Assembler  Version 4.00
    Copyright (C) Microsoft Corp 1981, 1983, 1984, 1985.  All rights reserved.


    24610 Bytes symbol space free

        0 Warning Errors
        0 Severe  Errors
    make : target does not exist 'MOREMES.OBJ'
            MASM /I..\INC MOREMES,MOREMES.OBJ;
    Microsoft (R) Macro Assembler  Version 4.00
    Copyright (C) Microsoft Corp 1981, 1983, 1984, 1985.  All rights reserved.


    51012 Bytes symbol space free

        0 Warning Errors
        0 Severe  Errors
    make : target does not exist 'MORE.EXE'
            LINK MORE.OBJ MOREMES.OBJ,MORE.EXE,MORE.MAP/M;
    Microsoft (R) Overlay Linker  Version 3.51
    Copyright (C) Microsoft Corp 1983, 1984, 1985, 1986.  All rights reserved.

    Warning: no stack segment
    make : target does not exist 'MORE.COM'
            EXE2BIN MORE.EXE MORE.COM



    D:\>ECHO OFF
    Microsoft (R) Program Maintenance Utility  Version 4.02
    Copyright (C) Microsoft Corp 1984, 1985, 1986.  All rights reserved.

    make : target does not exist 'ALLOC.OBJ'
            MASM /I..\INC ALLOC,ALLOC.OBJ;
    Microsoft (R) Macro Assembler  Version 4.00
    Copyright (C) Microsoft Corp 1981, 1983, 1984, 1985.  All rights reserved.


    20614 Bytes symbol space free

        0 Warning Errors
        0 Severe  Errors
    make : target does not exist 'DIRCALL.OBJ'
            MASM /I..\INC DIRCALL,DIRCALL.OBJ;
    Microsoft (R) Macro Assembler  Version 4.00
    Copyright (C) Microsoft Corp 1981, 1983, 1984, 1985.  All rights reserved.


    19576 Bytes symbol space free

        0 Warning Errors
        0 Severe  Errors
    make : target does not exist 'DEV.OBJ'
            MASM /I..\INC DEV,DEV.OBJ;
    Microsoft (R) Macro Assembler  Version 4.00
    Copyright (C) Microsoft Corp 1981, 1983, 1984, 1985.  All rights reserved.


    20592 Bytes symbol space free

        0 Warning Errors
        0 Severe  Errors
    make : target does not exist 'DIR.OBJ'
            MASM /I..\INC DIR,DIR.OBJ;
    Microsoft (R) Macro Assembler  Version 4.00
    Copyright (C) Microsoft Corp 1981, 1983, 1984, 1985.  All rights reserved.


    17746 Bytes symbol space free

        0 Warning Errors
        0 Severe  Errors
    make : target does not exist 'DISK.OBJ'
            MASM /I..\INC DISK,DISK.OBJ;
    Microsoft (R) Macro Assembler  Version 4.00
    Copyright (C) Microsoft Corp 1981, 1983, 1984, 1985.  All rights reserved.


    15774 Bytes symbol space free

        0 Warning Errors
        0 Severe  Errors
    make : target does not exist 'DOSMES.OBJ'
            MASM /I..\INC DOSMES,DOSMES.OBJ;
    Microsoft (R) Macro Assembler  Version 4.00
    Copyright (C) Microsoft Corp 1981, 1983, 1984, 1985.  All rights reserved.


    22918 Bytes symbol space free

        0 Warning Errors
        0 Severe  Errors
    make : target does not exist 'FAT.OBJ'
            MASM /I..\INC FAT,FAT.OBJ;
    Microsoft (R) Macro Assembler  Version 4.00
    Copyright (C) Microsoft Corp 1981, 1983, 1984, 1985.  All rights reserved.


    20494 Bytes symbol space free

        0 Warning Errors
        0 Severe  Errors
    make : target does not exist 'GETSET.OBJ'
            MASM /I..\INC GETSET,GETSET.OBJ;
    Microsoft (R) Macro Assembler  Version 4.00
    Copyright (C) Microsoft Corp 1981, 1983, 1984, 1985.  All rights reserved.


    19604 Bytes symbol space free

        0 Warning Errors
        0 Severe  Errors
    make : target does not exist 'MISC.OBJ'
            MASM /I..\INC MISC,MISC.OBJ;
    Microsoft (R) Macro Assembler  Version 4.00
    Copyright (C) Microsoft Corp 1981, 1983, 1984, 1985.  All rights reserved.


    18586 Bytes symbol space free

        0 Warning Errors
        0 Severe  Errors
    make : target does not exist 'MSCODE.OBJ'
            MASM /I..\INC MSCODE,MSCODE.OBJ;
    Microsoft (R) Macro Assembler  Version 4.00
    Copyright (C) Microsoft Corp 1981, 1983, 1984, 1985.  All rights reserved.


    16688 Bytes symbol space free

        0 Warning Errors
        0 Severe  Errors
    make : target does not exist 'MSDOS.OBJ'
            MASM /I..\INC MSDOS,MSDOS.OBJ;
    Microsoft (R) Macro Assembler  Version 4.00
    Copyright (C) Microsoft Corp 1981, 1983, 1984, 1985.  All rights reserved.


    14256 Bytes symbol space free

        0 Warning Errors
        0 Severe  Errors
    make : target does not exist 'ROM.OBJ'
            MASM /I..\INC ROM,ROM.OBJ;
    Microsoft (R) Macro Assembler  Version 4.00
    Copyright (C) Microsoft Corp 1981, 1983, 1984, 1985.  All rights reserved.


    19590 Bytes symbol space free

        0 Warning Errors
        0 Severe  Errors
    make : target does not exist 'STDBUF.OBJ'
            MASM /I..\INC STDBUF,STDBUF.OBJ;
    Microsoft (R) Macro Assembler  Version 4.00
    Copyright (C) Microsoft Corp 1981, 1983, 1984, 1985.  All rights reserved.


    20544 Bytes symbol space free

        0 Warning Errors
        0 Severe  Errors
    make : target does not exist 'STDCALL.OBJ'
            MASM /I..\INC STDCALL,STDCALL.OBJ;
    Microsoft (R) Macro Assembler  Version 4.00
    Copyright (C) Microsoft Corp 1981, 1983, 1984, 1985.  All rights reserved.


    18604 Bytes symbol space free

        0 Warning Errors
        0 Severe  Errors
    make : target does not exist 'STDCTRLC.OBJ'
            MASM /I..\INC STDCTRLC,STDCTRLC.OBJ;
    Microsoft (R) Macro Assembler  Version 4.00
    Copyright (C) Microsoft Corp 1981, 1983, 1984, 1985.  All rights reserved.


    19566 Bytes symbol space free

        0 Warning Errors
        0 Severe  Errors
    make : target does not exist 'STDFCB.OBJ'
            MASM /I..\INC STDFCB,STDFCB.OBJ;
    Microsoft (R) Macro Assembler  Version 4.00
    Copyright (C) Microsoft Corp 1981, 1983, 1984, 1985.  All rights reserved.


    19676 Bytes symbol space free

        0 Warning Errors
        0 Severe  Errors
    make : target does not exist 'STDIO.OBJ'
            MASM /I..\INC STDIO,STDIO.OBJ;
    Microsoft (R) Macro Assembler  Version 4.00
    Copyright (C) Microsoft Corp 1981, 1983, 1984, 1985.  All rights reserved.


    18688 Bytes symbol space free

        0 Warning Errors
        0 Severe  Errors
    make : target does not exist 'STDPROC.OBJ'
            MASM /I..\INC STDPROC,STDPROC.OBJ;
    Microsoft (R) Macro Assembler  Version 4.00
    Copyright (C) Microsoft Corp 1981, 1983, 1984, 1985.  All rights reserved.


    21602 Bytes symbol space free

        0 Warning Errors
        0 Severe  Errors
    make : target does not exist 'TIME.OBJ'
            MASM /I..\INC TIME,TIME.OBJ;
    Microsoft (R) Macro Assembler  Version 4.00
    Copyright (C) Microsoft Corp 1981, 1983, 1984, 1985.  All rights reserved.


    21550 Bytes symbol space free

        0 Warning Errors
        0 Severe  Errors
    make : target does not exist 'XENIX.OBJ'
            MASM /I..\INC XENIX,XENIX.OBJ;
    Microsoft (R) Macro Assembler  Version 4.00
    Copyright (C) Microsoft Corp 1981, 1983, 1984, 1985.  All rights reserved.


    16698 Bytes symbol space free

        0 Warning Errors
        0 Severe  Errors
    make : target does not exist 'XENIX2.OBJ'
            MASM /I..\INC XENIX2,XENIX2.OBJ;
    Microsoft (R) Macro Assembler  Version 4.00
    Copyright (C) Microsoft Corp 1981, 1983, 1984, 1985.  All rights reserved.


    18574 Bytes symbol space free

        0 Warning Errors
        0 Severe  Errors
    make : target does not exist 'MSDOS.EXE'
            LINK @MSDOS.LRF,MSDOS.EXE,MSDOS.MAP/M;
    Microsoft (R) Overlay Linker  Version 3.51
    Copyright (C) Microsoft Corp 1983, 1984, 1985, 1986.  All rights reserved.

    Object Modules [.OBJ]: MSDOS.OBJ MSCODE.OBJ DOSMES.OBJ MISC.OBJ GETSET.OBJ DIRCALL.OBJ +
    Object Modules [.OBJ]: ALLOC.OBJ DEV.OBJ DIR.OBJ DISK.OBJ FAT.OBJ ROM.OBJ STDBUF.OBJ STDCALL.OBJ +
    Object Modules [.OBJ]: STDCTRLC.OBJ STDFCB.OBJ STDPROC.OBJ STDIO.OBJ TIME.OBJ XENIX.OBJ XENIX2.OBJ
    Warning: no stack segment
    make : target does not exist 'MSDOS.SYS'
            EXE2BIN MSDOS.EXE MSDOS.SYS



    D:\>ECHO OFF
    Microsoft (R) Program Maintenance Utility  Version 4.02
    Copyright (C) Microsoft Corp 1984, 1985, 1986.  All rights reserved.

    make : target does not exist 'PRINT.OBJ'
            MASM /I..\INC PRINT,PRINT.OBJ;
    Microsoft (R) Macro Assembler  Version 4.00
    Copyright (C) Microsoft Corp 1981, 1983, 1984, 1985.  All rights reserved.


    14168 Bytes symbol space free

        0 Warning Errors
        0 Severe  Errors
    make : target does not exist 'PRINT.EXE'
            LINK PRINT.OBJ,PRINT.EXE,PRINT.MAP/M;
    Microsoft (R) Overlay Linker  Version 3.51
    Copyright (C) Microsoft Corp 1983, 1984, 1985, 1986.  All rights reserved.

    Warning: no stack segment
    make : target does not exist 'PRINT.COM'
            EXE2BIN PRINT.EXE PRINT.COM



    D:\>ECHO OFF
    Microsoft (R) Program Maintenance Utility  Version 4.02
    Copyright (C) Microsoft Corp 1984, 1985, 1986.  All rights reserved.

    make : target does not exist 'RECOVER.OBJ'
            MASM /I..\INC RECOVER,RECOVER.OBJ;
    Microsoft (R) Macro Assembler  Version 4.00
    Copyright (C) Microsoft Corp 1981, 1983, 1984, 1985.  All rights reserved.


    20228 Bytes symbol space free

        0 Warning Errors
        0 Severe  Errors
    make : target does not exist 'RECMES.OBJ'
            MASM /I..\INC RECMES,RECMES.OBJ;
    Microsoft (R) Macro Assembler  Version 4.00
    Copyright (C) Microsoft Corp 1981, 1983, 1984, 1985.  All rights reserved.


    23348 Bytes symbol space free

        0 Warning Errors
        0 Severe  Errors
    make : target does not exist 'RECOVER.EXE'
            LINK RECOVER.OBJ RECMES.OBJ,RECOVER.EXE,RECOVER.MAP/M;
    Microsoft (R) Overlay Linker  Version 3.51
    Copyright (C) Microsoft Corp 1983, 1984, 1985, 1986.  All rights reserved.

    Warning: no stack segment
    make : target does not exist 'RECOVER.COM'
            EXE2BIN RECOVER.EXE RECOVER.COM



    D:\>ECHO OFF
    Microsoft (R) Program Maintenance Utility  Version 4.02
    Copyright (C) Microsoft Corp 1984, 1985, 1986.  All rights reserved.

    make : target does not exist 'SORT.OBJ'
            MASM /I..\INC SORT,SORT.OBJ;
    Microsoft (R) Macro Assembler  Version 4.00
    Copyright (C) Microsoft Corp 1981, 1983, 1984, 1985.  All rights reserved.


    23196 Bytes symbol space free

        0 Warning Errors
        0 Severe  Errors
    make : target does not exist 'SORTMES.OBJ'
            MASM /I..\INC SORTMES,SORTMES.OBJ;
    Microsoft (R) Macro Assembler  Version 4.00
    Copyright (C) Microsoft Corp 1981, 1983, 1984, 1985.  All rights reserved.


    50010 Bytes symbol space free

        0 Warning Errors
        0 Severe  Errors
    make : target does not exist 'SORT.EXE'
            LINK SORT.OBJ SORTMES.OBJ,SORT.EXE,SORT.MAP/M;
    Microsoft (R) Overlay Linker  Version 3.51
    Copyright (C) Microsoft Corp 1983, 1984, 1985, 1986.  All rights reserved.

            EXEMOD SORT.EXE /MAX 1 /MIN 1
    Microsoft (R) EXE File Header Utility  Version 4.00
    Copyright (C) Microsoft Corp 1985.  All rights reserved.




    D:\>ECHO OFF
    Microsoft (R) Program Maintenance Utility  Version 4.02
    Copyright (C) Microsoft Corp 1984, 1985, 1986.  All rights reserved.

    make : target does not exist 'SYS.OBJ'
            MASM /I..\INC SYS,SYS.OBJ;
    Microsoft (R) Macro Assembler  Version 4.00
    Copyright (C) Microsoft Corp 1981, 1983, 1984, 1985.  All rights reserved.


    21892 Bytes symbol space free

        0 Warning Errors
        0 Severe  Errors
    make : target does not exist 'SYSMES.OBJ'
            MASM /I..\INC SYSMES,SYSMES.OBJ;
    Microsoft (R) Macro Assembler  Version 4.00
    Copyright (C) Microsoft Corp 1981, 1983, 1984, 1985.  All rights reserved.


    24632 Bytes symbol space free

        0 Warning Errors
        0 Severe  Errors
    make : target does not exist 'SYS.EXE'
            LINK SYS.OBJ SYSMES.OBJ,SYS.EXE,SYS.MAP/M;
    Microsoft (R) Overlay Linker  Version 3.51
    Copyright (C) Microsoft Corp 1983, 1984, 1985, 1986.  All rights reserved.

    Warning: no stack segment
    make : target does not exist 'SYS.COM'
            EXE2BIN SYS.EXE SYS.COM
