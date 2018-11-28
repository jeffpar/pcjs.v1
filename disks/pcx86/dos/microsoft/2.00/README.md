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
    autoType: $date\r$time\rD:\rMODE COM1:9600,N,8,1\r
---

Microsoft MS-DOS 2.00
---------------------

There was no MS-DOS 2.00 product *per se*.  Instead, there were OEM releases of MS-DOS based on version 2.00,
including:

* [COMPAQ MS-DOS 2.11](/disks/pcx86/dos/compaq/2.11/)
* [COMPAQ MS-DOS 2.12](/disks/pcx86/dos/compaq/2.12/)

### MS-DOS 2.00 Source Code

On March 25, 2014, the source code upon which OEMs based their MS-DOS 1.x and 2.x releases was made available to the
public by the [Computer History Museum](http://www.computerhistory.org/atchm/microsoft-ms-dos-early-source-code/),
with the permission of Microsoft.

![MS-DOS 2.00]({{ site.demo-disks.baseurl }}/pcx86/dos/microsoft/2.00/MSDOS200-DISKS.jpg)

Unfortunately, the Computer History Museum decided not to share the precise contents of the diskettes in its possession.
Instead, they released a ZIP archive that aggregated the contents of the MS-DOS 2.x diskettes into two folders, `v20object`
and `v20source`, with no clear indication which files came from which disk, why some files were renamed (and what the
original names were), and what (if anything) was omitted.

To add to the confusion, some [WordStar 3.20](/disks/pcx86/apps/other/wordstar/3.20/) binary files were included in the
`v20source` folder, completely unrelated to MS-DOS--and also completely useless, since the main executable, `WS.COM`, was not
included.

Finally, it isn't entirely correct to describe these files as the source code for "MS-DOS 2.0".  It's actually a much later
snapshot of source code, used to build MS-DOS 2.11, so at best, the collection should be referred to as "MS-DOS 2.x".

**UPDATE**: On September 28, 2018, Microsoft
[re-released](https://blogs.msdn.microsoft.com/commandline/2018/09/28/re-open-sourcing-ms-dos-1-25-and-2-0/)
the MS-DOS 1.x and 2.x source files on [GitHub](https://github.com/microsoft/ms-dos).  The files are identical to the
original CHM release, so no effort was made to improve the previous release, remove irrelevant files, organize them by
original diskette, etc.  And while GitHub is a great way to save and share files, Git repositories don't preserve original
file modification dates and times, unfortunately.

Microsoft's sole improvement of the 2018 re-release was to quietly relax restrictions on the reuse of the source code,
by releasing it under an [MIT License](https://en.wikipedia.org/wiki/MIT_License), instead of the older and much more restrictive
[Microsoft Research License Agreement](http://www.computerhistory.org/atchm/microsoft-research-license-agreement-msdos-v1-1-v2-0/).

### Building MS-DOS 2.x Source Code

For the machine below, a 10Mb hard disk image was created with all the MS-DOS 2.x sources:

    diskdump --dir=src --format=json --output=MSDOS2X-SRC.json --label=MSDOS2X --size=10000 --normalize --overwrite

The source files were copied from the CHM release, only because they had preserved the original file timestamps:

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

Next, all the source files were organized into folders corresponding to their respective binaries, along with
makefiles where appropriate
(eg, [MSDOS.MAK](https://github.com/jeffpar/pcjs-disks/blob/master/pcx86/dos/microsoft/2.00/src/MSDOS/MSDOS.MAK)).
Also, in the [INC](https://github.com/jeffpar/pcjs-disks/tree/master/pcx86/dos/microsoft/2.00/src/INC) folder,
`DOSMAC.211` was copied to `DOSMAC.ASM`, and `DOSSYM.211` was copied to `DOSSYM.ASM`, since the rest of the sources
are for MS-DOS 2.11 as well.

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

Then the [MSDOS](https://github.com/jeffpar/pcjs-disks/tree/master/pcx86/dos/microsoft/2.00/src/MSDOS)
folder was supplemented with reconstructed
[IO.ASM](https://jeffpar.github.io/pcjs-disks/pcx86/dos/microsoft/2.00/src/MSDOS/IO.ASM) and
[IO2.ASM](https://jeffpar.github.io/pcjs-disks/pcx86/dos/microsoft/2.00/src/MSDOS/IO2.ASM) files from
[John Elliott](http://www.seasip.info/DOS/).

The resulting files, along with a [MK.BAT](https://github.com/jeffpar/pcjs-disks/blob/master/pcx86/dos/microsoft/2.00/src/MK.BAT)
batch file, were installed in the machine below on drive D.  Drive C contains a bootable copy of PC DOS 2.00, along with
Microsoft MASM 4.00 and other assorted tools.

If `MK.BAT` is invoked with the name of one of the folders (eg, `MK COMMAND`), it will run `MAKE` in that
folder; to build all the folders, use `MK ALL`.

`MK.BAT` also accepts optional "OEM" and "VER" parameters.  For example, `MK MSDOS IBM 200` will build the **MSDOS**
folder with symbols **OEMIBM** and **VER200** defined.  Over time, the PCjs Project will use those symbols to
tweak the source files, in order to produce binaries that match the corresponding original release.

[DOSSYM.ASM](https://github.com/jeffpar/pcjs-disks/tree/master/pcx86/dos/microsoft/2.00/src/INC/DOSSYM.ASM) has been
modified to check for "OEM" and "VER" symbols, and to display messages indicating the current build selection, alerting
you that the resulting binaries may differ from those produced by the original source code snapshot.

For example, files built using `MK ALL IBM 200` should display these messages:

    IBM release selected 
    VERSION 2.00 selected 

However, you will sometimes see these messages:

    IBM release pre-selected 
    VERSION 2.00 selected 

which means that another file, such as
[COMSW.ASM](https://github.com/jeffpar/pcjs-disks/tree/master/pcx86/dos/microsoft/2.00/src/COMMAND/COMSW.ASM) or
[STDSW.ASM](https://github.com/jeffpar/pcjs-disks/tree/master/pcx86/dos/microsoft/2.00/src/MSDOS/STDSW.ASM),
defined **IBM** before including
[DOSSYM.ASM](https://github.com/jeffpar/pcjs-disks/tree/master/pcx86/dos/microsoft/2.00/src/INC/DOSSYM.ASM).
And sometimes a file will set **IBM** itself, such as
[GETSET.ASM](https://github.com/jeffpar/pcjs-disks/tree/master/pcx86/dos/microsoft/2.00/src/MSDOS/GETSET.ASM).
The "pre-selected" messages help you catch any build discrepancies due to these oddities.

Other files have been modified here as well, primarily to eliminate extraneous characters that caused warnings or
errors during the build process.  Which raises the question: which version of MASM was originally used to build
these sources?  The MASM.EXE that was bundled with this snapshot is dated Feb 1, 1983 and reports:

    The Microsoft MACRO Assembler
    Version 1.10, Copyright (C) Microsoft Inc. 1981,82

However, it's rather buggy, so it almost certainly was *not* used.  For that matter, it's unclear if this snapshot
of MS-DOS 2.11 represents a finished product or a work-in-progress.  Sadly, no one at Microsoft seems interested in
finding or sharing the answers.

### MS-DOS 2.x Build Machine

A quick note about speed: the typical PC in the early 1980s was still a 4.77Mhz 8088-based machine, so it took
a considerable amount of time to assemble all the MS-DOS 2.x sources.  If you're impatient, you can load the machine
on this page with a higher speed multiplier (eg, [multiplier=8](https://www.pcjs.org/disks/pcx86/dos/microsoft/2.00/?multiplier=8))
or click the *Speed* button below until it's running at speed that you prefer (and that your browser supports).

In addition, all the build products (**OBJ**, **EXE**, **COM**, **LST**, and **MAP** files) from a successful
`MK ALL` command have already been saved in the [pcjs-disks](https://github.com/jeffpar/pcjs-disks) repository, in the
[/pcx86/dos/microsoft/2.00/built](https://github.com/jeffpar/pcjs-disks/tree/master/pcx86/dos/microsoft/2.00/built)
folder.

{% include machine.html id="ibm5160" %}

The results of running `MK ALL` are shown below:

    D:\>MK ALL

    D:\>ECHO OFF


    D:\>ECHO OFF
    Microsoft (R) Program Maintenance Utility  Version 4.02
    Copyright (C) Microsoft Corp 1984, 1985, 1986.  All rights reserved.

    make : target does not exist 'EXE2BIN.OBJ'
            MASM /DOEM /DVER /I..\INC EXE2BIN.ASM,EXE2BIN.OBJ,EXE2BIN.LST;
    Microsoft (R) Macro Assembler  Version 4.00
    Copyright (C) Microsoft Corp 1981, 1983, 1984, 1985.  All rights reserved.

    VERSION 2.11 pre-selected 

    21402 Bytes symbol space free

        0 Warning Errors
        0 Severe  Errors
    make : target does not exist 'EXEMES.OBJ'
            MASM /DOEM /DVER /I..\INC EXEMES.ASM,EXEMES.OBJ,EXEMES.LST;
    Microsoft (R) Macro Assembler  Version 4.00
    Copyright (C) Microsoft Corp 1981, 1983, 1984, 1985.  All rights reserved.


    49490 Bytes symbol space free

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
            MASM /DOEM /DVER /I..\INC CHKDSK.ASM,CHKDSK.OBJ,CHKDSK.LST;
    Microsoft (R) Macro Assembler  Version 4.00
    Copyright (C) Microsoft Corp 1981, 1983, 1984, 1985.  All rights reserved.

    VERSION 2.11 pre-selected 

    17514 Bytes symbol space free

        0 Warning Errors
        0 Severe  Errors
    make : target does not exist 'CHKMES.OBJ'
            MASM /DOEM /DVER /I..\INC CHKMES.ASM,CHKMES.OBJ,CHKMES.LST;
    Microsoft (R) Macro Assembler  Version 4.00
    Copyright (C) Microsoft Corp 1981, 1983, 1984, 1985.  All rights reserved.

    VERSION 2.11 pre-selected 

    19856 Bytes symbol space free

        0 Warning Errors
        0 Severe  Errors
    make : target does not exist 'CHKPROC.OBJ'
            MASM /DOEM /DVER /I..\INC CHKPROC.ASM,CHKPROC.OBJ,CHKPROC.LST;
    Microsoft (R) Macro Assembler  Version 4.00
    Copyright (C) Microsoft Corp 1981, 1983, 1984, 1985.  All rights reserved.

    VERSION 2.11 pre-selected 

    14796 Bytes symbol space free

        0 Warning Errors
        0 Severe  Errors
    make : target does not exist 'CHKDSK.EXE'
            LINK CHKDSK.OBJ CHKPROC.OBJ CHKMES.OBJ,CHKDSK.EXE,CHKDSK.MAP/M;
    Microsoft (R) Overlay Linker  Version 3.51
    Copyright (C) Microsoft Corp 1983, 1984, 1985, 1986.  All rights reserved.

    Warning: no stack segment
    make : target does not exist 'CHKDSK.COM'
            EXE2BIN CHKDSK.EXE CHKDSK.COM



    D:\>ECHO OFF
    Microsoft (R) Program Maintenance Utility  Version 4.02
    Copyright (C) Microsoft Corp 1984, 1985, 1986.  All rights reserved.

    make : target does not exist 'COMMAND.OBJ'
            MASM /DOEM /DVER /I..\INC COMMAND.ASM,COMMAND.OBJ,COMMAND.LST;
    Microsoft (R) Macro Assembler  Version 4.00
    Copyright (C) Microsoft Corp 1981, 1983, 1984, 1985.  All rights reserved.

    VERSION 2.11 pre-selected 

    16470 Bytes symbol space free

        0 Warning Errors
        0 Severe  Errors
    make : target does not exist 'RUCODE.OBJ'
            MASM /DOEM /DVER /I..\INC RUCODE.ASM,RUCODE.OBJ,RUCODE.LST;
    Microsoft (R) Macro Assembler  Version 4.00
    Copyright (C) Microsoft Corp 1981, 1983, 1984, 1985.  All rights reserved.

    VERSION 2.11 pre-selected 

    18744 Bytes symbol space free

        0 Warning Errors
        0 Severe  Errors
    make : target does not exist 'RDATA.OBJ'
            MASM /DOEM /DVER /I..\INC RDATA.ASM,RDATA.OBJ,RDATA.LST;
    Microsoft (R) Macro Assembler  Version 4.00
    Copyright (C) Microsoft Corp 1981, 1983, 1984, 1985.  All rights reserved.


    44822 Bytes symbol space free

        0 Warning Errors
        0 Severe  Errors
    make : target does not exist 'INIT.OBJ'
            MASM /DOEM /DVER /I..\INC INIT.ASM,INIT.OBJ,INIT.LST;
    Microsoft (R) Macro Assembler  Version 4.00
    Copyright (C) Microsoft Corp 1981, 1983, 1984, 1985.  All rights reserved.

    Non-IBM release pre-selected 
    VERSION 2.11 pre-selected 

    16858 Bytes symbol space free

        0 Warning Errors
        0 Severe  Errors
    make : target does not exist 'UINIT.OBJ'
            MASM /DOEM /DVER /I..\INC UINIT.ASM,UINIT.OBJ,UINIT.LST;
    Microsoft (R) Macro Assembler  Version 4.00
    Copyright (C) Microsoft Corp 1981, 1983, 1984, 1985.  All rights reserved.


    49500 Bytes symbol space free

        0 Warning Errors
        0 Severe  Errors
    make : target does not exist 'TCODE.OBJ'
            MASM /DOEM /DVER /I..\INC TCODE.ASM,TCODE.OBJ,TCODE.LST;
    Microsoft (R) Macro Assembler  Version 4.00
    Copyright (C) Microsoft Corp 1981, 1983, 1984, 1985.  All rights reserved.

    Non-IBM release pre-selected 
    VERSION 2.11 pre-selected 

    13556 Bytes symbol space free

        0 Warning Errors
        0 Severe  Errors
    make : target does not exist 'TCODE2.OBJ'
            MASM /DOEM /DVER /I..\INC TCODE2.ASM,TCODE2.OBJ,TCODE2.LST;
    Microsoft (R) Macro Assembler  Version 4.00
    Copyright (C) Microsoft Corp 1981, 1983, 1984, 1985.  All rights reserved.

    Non-IBM release pre-selected 
    VERSION 2.11 pre-selected 

    16854 Bytes symbol space free

        0 Warning Errors
        0 Severe  Errors
    make : target does not exist 'TCODE3.OBJ'
            MASM /DOEM /DVER /I..\INC TCODE3.ASM,TCODE3.OBJ,TCODE3.LST;
    Microsoft (R) Macro Assembler  Version 4.00
    Copyright (C) Microsoft Corp 1981, 1983, 1984, 1985.  All rights reserved.

    Non-IBM release pre-selected 
    VERSION 2.11 pre-selected 

    15546 Bytes symbol space free

        0 Warning Errors
        0 Severe  Errors
    make : target does not exist 'TCODE4.OBJ'
            MASM /DOEM /DVER /I..\INC TCODE4.ASM,TCODE4.OBJ,TCODE4.LST;
    Microsoft (R) Macro Assembler  Version 4.00
    Copyright (C) Microsoft Corp 1981, 1983, 1984, 1985.  All rights reserved.

    Non-IBM release pre-selected 
    VERSION 2.11 pre-selected 

    12576 Bytes symbol space free

        0 Warning Errors
        0 Severe  Errors
    make : target does not exist 'TCODE5.OBJ'
            MASM /DOEM /DVER /I..\INC TCODE5.ASM,TCODE5.OBJ,TCODE5.LST;
    Microsoft (R) Macro Assembler  Version 4.00
    Copyright (C) Microsoft Corp 1981, 1983, 1984, 1985.  All rights reserved.

    Non-IBM release pre-selected 
    VERSION 2.11 pre-selected 

    13546 Bytes symbol space free

        0 Warning Errors
        0 Severe  Errors
    make : target does not exist 'TUCODE.OBJ'
            MASM /DOEM /DVER /I..\INC TUCODE.ASM,TUCODE.OBJ,TUCODE.LST;
    Microsoft (R) Macro Assembler  Version 4.00
    Copyright (C) Microsoft Corp 1981, 1983, 1984, 1985.  All rights reserved.

    VERSION 2.11 pre-selected 

    18744 Bytes symbol space free

        0 Warning Errors
        0 Severe  Errors
    make : target does not exist 'COPY.OBJ'
            MASM /DOEM /DVER /I..\INC COPY.ASM,COPY.OBJ,COPY.LST;
    Microsoft (R) Macro Assembler  Version 4.00
    Copyright (C) Microsoft Corp 1981, 1983, 1984, 1985.  All rights reserved.

    Non-IBM release pre-selected 
    VERSION 2.11 pre-selected 

    15590 Bytes symbol space free

        0 Warning Errors
        0 Severe  Errors
    make : target does not exist 'COPYPROC.OBJ'
            MASM /DOEM /DVER /I..\INC COPYPROC.ASM,COPYPROC.OBJ,COPYPROC.LST;
    Microsoft (R) Macro Assembler  Version 4.00
    Copyright (C) Microsoft Corp 1981, 1983, 1984, 1985.  All rights reserved.

    Non-IBM release pre-selected 
    VERSION 2.11 pre-selected 

    16726 Bytes symbol space free

        0 Warning Errors
        0 Severe  Errors
    make : target does not exist 'CPARSE.OBJ'
            MASM /DOEM /DVER /I..\INC CPARSE.ASM,CPARSE.OBJ,CPARSE.LST;
    Microsoft (R) Macro Assembler  Version 4.00
    Copyright (C) Microsoft Corp 1981, 1983, 1984, 1985.  All rights reserved.

    Non-IBM release pre-selected 
    VERSION 2.11 pre-selected 

    18780 Bytes symbol space free

        0 Warning Errors
        0 Severe  Errors
    make : target does not exist 'TDATA.OBJ'
            MASM /DOEM /DVER /I..\INC TDATA.ASM,TDATA.OBJ,TDATA.LST;
    Microsoft (R) Macro Assembler  Version 4.00
    Copyright (C) Microsoft Corp 1981, 1983, 1984, 1985.  All rights reserved.


    45422 Bytes symbol space free

        0 Warning Errors
        0 Severe  Errors
    make : target does not exist 'TSPC.OBJ'
            MASM /DOEM /DVER /I..\INC TSPC.ASM,TSPC.OBJ,TSPC.LST;
    Microsoft (R) Macro Assembler  Version 4.00
    Copyright (C) Microsoft Corp 1981, 1983, 1984, 1985.  All rights reserved.

    Non-IBM release pre-selected 
    VERSION 2.11 pre-selected 

    18440 Bytes symbol space free

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
            MASM /DOEM /DVER /I..\INC DEBUG.ASM,DEBUG.OBJ,DEBUG.LST;
    Microsoft (R) Macro Assembler  Version 4.00
    Copyright (C) Microsoft Corp 1981, 1983, 1984, 1985.  All rights reserved.

    VERSION 2.11 pre-selected 

    19858 Bytes symbol space free

        0 Warning Errors
        0 Severe  Errors
    make : target does not exist 'DEBASM.OBJ'
            MASM /DOEM /DVER /I..\INC DEBASM.ASM,DEBASM.OBJ,DEBASM.LST;
    Microsoft (R) Macro Assembler  Version 4.00
    Copyright (C) Microsoft Corp 1981, 1983, 1984, 1985.  All rights reserved.

    VERSION 2.11 pre-selected 

    15906 Bytes symbol space free

        0 Warning Errors
        0 Severe  Errors
    make : target does not exist 'DEBUASM.OBJ'
            MASM /DOEM /DVER /I..\INC DEBUASM.ASM,DEBUASM.OBJ,DEBUASM.LST;
    Microsoft (R) Macro Assembler  Version 4.00
    Copyright (C) Microsoft Corp 1981, 1983, 1984, 1985.  All rights reserved.

    VERSION 2.11 pre-selected 

    16890 Bytes symbol space free

        0 Warning Errors
        0 Severe  Errors
    make : target does not exist 'DEBCOM1.OBJ'
            MASM /DOEM /DVER /I..\INC DEBCOM1.ASM,DEBCOM1.OBJ,DEBCOM1.LST;
    Microsoft (R) Macro Assembler  Version 4.00
    Copyright (C) Microsoft Corp 1981, 1983, 1984, 1985.  All rights reserved.

    VERSION 2.11 pre-selected 

    19788 Bytes symbol space free

        0 Warning Errors
        0 Severe  Errors
    make : target does not exist 'DEBCOM2.OBJ'
            MASM /DOEM /DVER /I..\INC DEBCOM2.ASM,DEBCOM2.OBJ,DEBCOM2.LST;
    Microsoft (R) Macro Assembler  Version 4.00
    Copyright (C) Microsoft Corp 1981, 1983, 1984, 1985.  All rights reserved.

    VERSION 2.11 pre-selected 

    15286 Bytes symbol space free

        0 Warning Errors
        0 Severe  Errors
    make : target does not exist 'DEBCONST.OBJ'
            MASM /DOEM /DVER /I..\INC DEBCONST.ASM,DEBCONST.OBJ,DEBCONST.LST;
    Microsoft (R) Macro Assembler  Version 4.00
    Copyright (C) Microsoft Corp 1981, 1983, 1984, 1985.  All rights reserved.

    VERSION 2.11 pre-selected 

    14794 Bytes symbol space free

        0 Warning Errors
        0 Severe  Errors
    make : target does not exist 'DEBDATA.OBJ'
            MASM /DOEM /DVER /I..\INC DEBDATA.ASM,DEBDATA.OBJ,DEBDATA.LST;
    Microsoft (R) Macro Assembler  Version 4.00
    Copyright (C) Microsoft Corp 1981, 1983, 1984, 1985.  All rights reserved.

    VERSION 2.11 pre-selected 

    21416 Bytes symbol space free

        0 Warning Errors
        0 Severe  Errors
    make : target does not exist 'DEBMES.OBJ'
            MASM /DOEM /DVER /I..\INC DEBMES.ASM,DEBMES.OBJ,DEBMES.LST;
    Microsoft (R) Macro Assembler  Version 4.00
    Copyright (C) Microsoft Corp 1981, 1983, 1984, 1985.  All rights reserved.

    VERSION 2.11 pre-selected 

    22896 Bytes symbol space free

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
            MASM /DOEM /DVER /I..\INC DISKCOPY.ASM,DISKCOPY.OBJ,DISKCOPY.LST;
    Microsoft (R) Macro Assembler  Version 4.00
    Copyright (C) Microsoft Corp 1981, 1983, 1984, 1985.  All rights reserved.

    VERSION 2.11 pre-selected 

    21816 Bytes symbol space free

        0 Warning Errors
        0 Severe  Errors
    make : target does not exist 'DISKMES.OBJ'
            MASM /DOEM /DVER /I..\INC DISKMES.ASM,DISKMES.OBJ,DISKMES.LST;
    Microsoft (R) Macro Assembler  Version 4.00
    Copyright (C) Microsoft Corp 1981, 1983, 1984, 1985.  All rights reserved.

    VERSION 2.11 pre-selected 

    21846 Bytes symbol space free

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
    Microsoft (R) Program Maintenance Utility  Version 4.02
    Copyright (C) Microsoft Corp 1984, 1985, 1986.  All rights reserved.

    make : target does not exist 'EDLIN.OBJ'
            MASM /DOEM /DVER /I..\INC EDLIN.ASM,EDLIN.OBJ,EDLIN.LST;
    Microsoft (R) Macro Assembler  Version 4.00
    Copyright (C) Microsoft Corp 1981, 1983, 1984, 1985.  All rights reserved.

    VERSION 2.11 pre-selected 

    11962 Bytes symbol space free

        0 Warning Errors
        0 Severe  Errors
    make : target does not exist 'EDLMES.OBJ'
            MASM /DOEM /DVER /I..\INC EDLMES.ASM,EDLMES.OBJ,EDLMES.LST;
    Microsoft (R) Macro Assembler  Version 4.00
    Copyright (C) Microsoft Corp 1981, 1983, 1984, 1985.  All rights reserved.

    VERSION 2.11 pre-selected 

    22868 Bytes symbol space free

        0 Warning Errors
        0 Severe  Errors
    make : target does not exist 'EDLPROC.OBJ'
            MASM /DOEM /DVER /I..\INC EDLPROC.ASM,EDLPROC.OBJ,EDLPROC.LST;
    Microsoft (R) Macro Assembler  Version 4.00
    Copyright (C) Microsoft Corp 1981, 1983, 1984, 1985.  All rights reserved.

    VERSION 2.11 pre-selected 

    21768 Bytes symbol space free

        0 Warning Errors
        0 Severe  Errors
    make : target does not exist 'EDLIN.EXE'
            LINK EDLIN.OBJ EDLMES.OBJ EDLPROC.OBJ,EDLIN.EXE,EDLIN.MAP/M;
    Microsoft (R) Overlay Linker  Version 3.51
    Copyright (C) Microsoft Corp 1983, 1984, 1985, 1986.  All rights reserved.

    Warning: no stack segment
    make : target does not exist 'EDLIN.COM'
            EXE2BIN EDLIN.EXE EDLIN.COM



    D:\>ECHO OFF
    Microsoft (R) Program Maintenance Utility  Version 4.02
    Copyright (C) Microsoft Corp 1984, 1985, 1986.  All rights reserved.

    make : target does not exist 'FC.OBJ'
            MASM /DOEM /DVER /I..\INC FC.ASM,FC.OBJ,FC.LST;
    Microsoft (R) Macro Assembler  Version 4.00
    Copyright (C) Microsoft Corp 1981, 1983, 1984, 1985.  All rights reserved.

    VERSION 2.11 pre-selected 

    16070 Bytes symbol space free

        0 Warning Errors
        0 Severe  Errors
    make : target does not exist 'FCMES.OBJ'
            MASM /DOEM /DVER /I..\INC FCMES.ASM,FCMES.OBJ,FCMES.LST;
    Microsoft (R) Macro Assembler  Version 4.00
    Copyright (C) Microsoft Corp 1981, 1983, 1984, 1985.  All rights reserved.


    49468 Bytes symbol space free

        0 Warning Errors
        0 Severe  Errors
    make : target does not exist 'FC.EXE'
            LINK FC.OBJ FCMES.OBJ,FC.EXE,FC.MAP/M;
    Microsoft (R) Overlay Linker  Version 3.51
    Copyright (C) Microsoft Corp 1983, 1984, 1985, 1986.  All rights reserved.




    D:\>ECHO OFF
    Microsoft (R) Program Maintenance Utility  Version 4.02
    Copyright (C) Microsoft Corp 1984, 1985, 1986.  All rights reserved.

    make : target does not exist 'FIND.OBJ'
            MASM /DOEM /DVER /I..\INC FIND.ASM,FIND.OBJ,FIND.LST;
    Microsoft (R) Macro Assembler  Version 4.00
    Copyright (C) Microsoft Corp 1981, 1983, 1984, 1985.  All rights reserved.


    46076 Bytes symbol space free

        0 Warning Errors
        0 Severe  Errors
    make : target does not exist 'FINDMES.OBJ'
            MASM /DOEM /DVER /I..\INC FINDMES.ASM,FINDMES.OBJ,FINDMES.LST;
    Microsoft (R) Macro Assembler  Version 4.00
    Copyright (C) Microsoft Corp 1981, 1983, 1984, 1985.  All rights reserved.


    49456 Bytes symbol space free

        0 Warning Errors
        0 Severe  Errors
    make : target does not exist 'FIND.EXE'
            LINK FIND.OBJ FINDMES.OBJ,FIND.EXE,FIND.MAP/M;
    Microsoft (R) Overlay Linker  Version 3.51
    Copyright (C) Microsoft Corp 1983, 1984, 1985, 1986.  All rights reserved.




    D:\>ECHO OFF
    Microsoft (R) Program Maintenance Utility  Version 4.02
    Copyright (C) Microsoft Corp 1984, 1985, 1986.  All rights reserved.

    make : target does not exist 'FORMAT.OBJ'
            MASM /DOEM /DVER /I..\INC FORMAT.ASM,FORMAT.OBJ,FORMAT.LST;
    Microsoft (R) Macro Assembler  Version 4.00
    Copyright (C) Microsoft Corp 1981, 1983, 1984, 1985.  All rights reserved.

    VERSION 2.11 pre-selected 

    15052 Bytes symbol space free

        0 Warning Errors
        0 Severe  Errors
    make : target does not exist 'FORMES.OBJ'
            MASM /DOEM /DVER /I..\INC FORMES.ASM,FORMES.OBJ,FORMES.LST;
    Microsoft (R) Macro Assembler  Version 4.00
    Copyright (C) Microsoft Corp 1981, 1983, 1984, 1985.  All rights reserved.

    VERSION 2.11 pre-selected 

    22866 Bytes symbol space free

        0 Warning Errors
        0 Severe  Errors
    make : target does not exist 'GENFOR.OBJ'
            MASM /DOEM /DVER /I..\INC GENFOR.ASM,GENFOR.OBJ,GENFOR.LST;
    Microsoft (R) Macro Assembler  Version 4.00
    Copyright (C) Microsoft Corp 1981, 1983, 1984, 1985.  All rights reserved.

    VERSION 2.11 pre-selected 

    22862 Bytes symbol space free

        0 Warning Errors
        0 Severe  Errors
    make : target does not exist 'FORMAT.EXE'
            LINK FORMAT.OBJ FORMES.OBJ GENFOR.OBJ,FORMAT.EXE,FORMAT.MAP/M;
    Microsoft (R) Overlay Linker  Version 3.51
    Copyright (C) Microsoft Corp 1983, 1984, 1985, 1986.  All rights reserved.

    Warning: no stack segment
    make : target does not exist 'FORMAT.COM'
            EXE2BIN FORMAT.EXE FORMAT.COM



    D:\>ECHO OFF
    Microsoft (R) Program Maintenance Utility  Version 4.02
    Copyright (C) Microsoft Corp 1984, 1985, 1986.  All rights reserved.

    make : target does not exist 'MORE.OBJ'
            MASM /DOEM /DVER /I..\INC MORE.ASM,MORE.OBJ,MORE.LST;
    Microsoft (R) Macro Assembler  Version 4.00
    Copyright (C) Microsoft Corp 1981, 1983, 1984, 1985.  All rights reserved.

    VERSION 2.11 pre-selected 

    23942 Bytes symbol space free

        0 Warning Errors
        0 Severe  Errors
    make : target does not exist 'MOREMES.OBJ'
            MASM /DOEM /DVER /I..\INC MOREMES.ASM,MOREMES.OBJ,MOREMES.LST;
    Microsoft (R) Macro Assembler  Version 4.00
    Copyright (C) Microsoft Corp 1981, 1983, 1984, 1985.  All rights reserved.


    50456 Bytes symbol space free

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
            MASM /DOEM /DVER /I..\INC ALLOC.ASM,ALLOC.OBJ,ALLOC.LST;
    Microsoft (R) Macro Assembler  Version 4.00
    Copyright (C) Microsoft Corp 1981, 1983, 1984, 1985.  All rights reserved.

    VERSION 2.11 pre-selected 

    20102 Bytes symbol space free

        0 Warning Errors
        0 Severe  Errors
    make : target does not exist 'DIRCALL.OBJ'
            MASM /DOEM /DVER /I..\INC DIRCALL.ASM,DIRCALL.OBJ,DIRCALL.LST;
    Microsoft (R) Macro Assembler  Version 4.00
    Copyright (C) Microsoft Corp 1981, 1983, 1984, 1985.  All rights reserved.

    VERSION 2.11 pre-selected 

    19132 Bytes symbol space free

        0 Warning Errors
        0 Severe  Errors
    make : target does not exist 'DEV.OBJ'
            MASM /DOEM /DVER /I..\INC DEV.ASM,DEV.OBJ,DEV.LST;
    Microsoft (R) Macro Assembler  Version 4.00
    Copyright (C) Microsoft Corp 1981, 1983, 1984, 1985.  All rights reserved.

    VERSION 2.11 pre-selected 

    20088 Bytes symbol space free

        0 Warning Errors
        0 Severe  Errors
    make : target does not exist 'DIR.OBJ'
            MASM /DOEM /DVER /I..\INC DIR.ASM,DIR.OBJ,DIR.LST;
    Microsoft (R) Macro Assembler  Version 4.00
    Copyright (C) Microsoft Corp 1981, 1983, 1984, 1985.  All rights reserved.

    VERSION 2.11 pre-selected 

    17244 Bytes symbol space free

        0 Warning Errors
        0 Severe  Errors
    make : target does not exist 'DISK.OBJ'
            MASM /DOEM /DVER /I..\INC DISK.ASM,DISK.OBJ,DISK.LST;
    Microsoft (R) Macro Assembler  Version 4.00
    Copyright (C) Microsoft Corp 1981, 1983, 1984, 1985.  All rights reserved.

    VERSION 2.11 pre-selected 

    15100 Bytes symbol space free

        0 Warning Errors
        0 Severe  Errors
    make : target does not exist 'DOSMES.OBJ'
            MASM /DOEM /DVER /I..\INC DOSMES.ASM,DOSMES.OBJ,DOSMES.LST;
    Microsoft (R) Macro Assembler  Version 4.00
    Copyright (C) Microsoft Corp 1981, 1983, 1984, 1985.  All rights reserved.

    Non-IBM release pre-selected 
    VERSION 2.11 pre-selected 

    22332 Bytes symbol space free

        0 Warning Errors
        0 Severe  Errors
    make : target does not exist 'FAT.OBJ'
            MASM /DOEM /DVER /I..\INC FAT.ASM,FAT.OBJ,FAT.LST;
    Microsoft (R) Macro Assembler  Version 4.00
    Copyright (C) Microsoft Corp 1981, 1983, 1984, 1985.  All rights reserved.

    VERSION 2.11 pre-selected 

    20026 Bytes symbol space free

        0 Warning Errors
        0 Severe  Errors
    make : target does not exist 'GETSET.OBJ'
            MASM /DOEM /DVER /I..\INC GETSET.ASM,GETSET.OBJ,GETSET.LST;
    Microsoft (R) Macro Assembler  Version 4.00
    Copyright (C) Microsoft Corp 1981, 1983, 1984, 1985.  All rights reserved.

    Non-IBM release pre-selected 
    VERSION 2.11 pre-selected 

    19094 Bytes symbol space free

        0 Warning Errors
        0 Severe  Errors
    make : target does not exist 'MISC.OBJ'
            MASM /DOEM /DVER /I..\INC MISC.ASM,MISC.OBJ,MISC.LST;
    Microsoft (R) Macro Assembler  Version 4.00
    Copyright (C) Microsoft Corp 1981, 1983, 1984, 1985.  All rights reserved.

    VERSION 2.11 pre-selected 

    18074 Bytes symbol space free

        0 Warning Errors
        0 Severe  Errors
    make : target does not exist 'MSCODE.OBJ'
            MASM /DOEM /DVER /I..\INC MSCODE.ASM,MSCODE.OBJ,MSCODE.LST;
    Microsoft (R) Macro Assembler  Version 4.00
    Copyright (C) Microsoft Corp 1981, 1983, 1984, 1985.  All rights reserved.

    Non-IBM release pre-selected 
    VERSION 2.11 pre-selected 

    16066 Bytes symbol space free

        0 Warning Errors
        0 Severe  Errors
    make : target does not exist 'MSDOS.OBJ'
            MASM /DOEM /DVER /I..\INC MSDOS.ASM,MSDOS.OBJ,MSDOS.LST;
    Microsoft (R) Macro Assembler  Version 4.00
    Copyright (C) Microsoft Corp 1981, 1983, 1984, 1985.  All rights reserved.

    Non-IBM release pre-selected 
    VERSION 2.11 pre-selected 

    13794 Bytes symbol space free

        0 Warning Errors
        0 Severe  Errors
    make : target does not exist 'ROM.OBJ'
            MASM /DOEM /DVER /I..\INC ROM.ASM,ROM.OBJ,ROM.LST;
    Microsoft (R) Macro Assembler  Version 4.00
    Copyright (C) Microsoft Corp 1981, 1983, 1984, 1985.  All rights reserved.

    VERSION 2.11 pre-selected 

    19150 Bytes symbol space free

        0 Warning Errors
        0 Severe  Errors
    make : target does not exist 'STDBUF.OBJ'
            MASM /DOEM /DVER /I..\INC STDBUF.ASM,STDBUF.OBJ,STDBUF.LST;
    Microsoft (R) Macro Assembler  Version 4.00
    Copyright (C) Microsoft Corp 1981, 1983, 1984, 1985.  All rights reserved.

    Non-IBM release pre-selected 
    VERSION 2.11 pre-selected 

    19026 Bytes symbol space free

        0 Warning Errors
        0 Severe  Errors
    make : target does not exist 'STDCALL.OBJ'
            MASM /DOEM /DVER /I..\INC STDCALL.ASM,STDCALL.OBJ,STDCALL.LST;
    Microsoft (R) Macro Assembler  Version 4.00
    Copyright (C) Microsoft Corp 1981, 1983, 1984, 1985.  All rights reserved.

    Non-IBM release pre-selected 
    VERSION 2.11 pre-selected 

    18092 Bytes symbol space free

        0 Warning Errors
        0 Severe  Errors
    make : target does not exist 'STDCTRLC.OBJ'
            MASM /DOEM /DVER /I..\INC STDCTRLC.ASM,STDCTRLC.OBJ,STDCTRLC.LST;
    Microsoft (R) Macro Assembler  Version 4.00
    Copyright (C) Microsoft Corp 1981, 1983, 1984, 1985.  All rights reserved.

    Non-IBM release pre-selected 
    VERSION 2.11 pre-selected 

    19052 Bytes symbol space free

        0 Warning Errors
        0 Severe  Errors
    make : target does not exist 'STDFCB.OBJ'
            MASM /DOEM /DVER /I..\INC STDFCB.ASM,STDFCB.OBJ,STDFCB.LST;
    Microsoft (R) Macro Assembler  Version 4.00
    Copyright (C) Microsoft Corp 1981, 1983, 1984, 1985.  All rights reserved.

    Non-IBM release pre-selected 
    VERSION 2.11 pre-selected 

    19162 Bytes symbol space free

        0 Warning Errors
        0 Severe  Errors
    make : target does not exist 'STDIO.OBJ'
            MASM /DOEM /DVER /I..\INC STDIO.ASM,STDIO.OBJ,STDIO.LST;
    Microsoft (R) Macro Assembler  Version 4.00
    Copyright (C) Microsoft Corp 1981, 1983, 1984, 1985.  All rights reserved.

    Non-IBM release pre-selected 
    VERSION 2.11 pre-selected 

    18146 Bytes symbol space free

        0 Warning Errors
        0 Severe  Errors
    make : target does not exist 'STDPROC.OBJ'
            MASM /DOEM /DVER /I..\INC STDPROC.ASM,STDPROC.OBJ,STDPROC.LST;
    Microsoft (R) Macro Assembler  Version 4.00
    Copyright (C) Microsoft Corp 1981, 1983, 1984, 1985.  All rights reserved.

    Non-IBM release pre-selected 
    VERSION 2.11 pre-selected 

    17136 Bytes symbol space free

        0 Warning Errors
        0 Severe  Errors
    make : target does not exist 'TIME.OBJ'
            MASM /DOEM /DVER /I..\INC TIME.ASM,TIME.OBJ,TIME.LST;
    Microsoft (R) Macro Assembler  Version 4.00
    Copyright (C) Microsoft Corp 1981, 1983, 1984, 1985.  All rights reserved.

    VERSION 2.11 pre-selected 

    21026 Bytes symbol space free

        0 Warning Errors
        0 Severe  Errors
    make : target does not exist 'XENIX.OBJ'
            MASM /DOEM /DVER /I..\INC XENIX.ASM,XENIX.OBJ,XENIX.LST;
    Microsoft (R) Macro Assembler  Version 4.00
    Copyright (C) Microsoft Corp 1981, 1983, 1984, 1985.  All rights reserved.

    VERSION 2.11 pre-selected 

    16200 Bytes symbol space free

        0 Warning Errors
        0 Severe  Errors
    make : target does not exist 'XENIX2.OBJ'
            MASM /DOEM /DVER /I..\INC XENIX2.ASM,XENIX2.OBJ,XENIX2.LST;
    Microsoft (R) Macro Assembler  Version 4.00
    Copyright (C) Microsoft Corp 1981, 1983, 1984, 1985.  All rights reserved.

    VERSION 2.11 pre-selected 

    18066 Bytes symbol space free

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
            MASM /DOEM /DVER /I..\INC PRINT.ASM,PRINT.OBJ,PRINT.LST;
    Microsoft (R) Macro Assembler  Version 4.00
    Copyright (C) Microsoft Corp 1981, 1983, 1984, 1985.  All rights reserved.

    IBM release pre-selected 
    VERSION 2.11 pre-selected 

    13654 Bytes symbol space free

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
            MASM /DOEM /DVER /I..\INC RECOVER.ASM,RECOVER.OBJ,RECOVER.LST;
    Microsoft (R) Macro Assembler  Version 4.00
    Copyright (C) Microsoft Corp 1981, 1983, 1984, 1985.  All rights reserved.

    VERSION 2.11 pre-selected 

    19706 Bytes symbol space free

        0 Warning Errors
        0 Severe  Errors
    make : target does not exist 'RECMES.OBJ'
            MASM /DOEM /DVER /I..\INC RECMES.ASM,RECMES.OBJ,RECMES.LST;
    Microsoft (R) Macro Assembler  Version 4.00
    Copyright (C) Microsoft Corp 1981, 1983, 1984, 1985.  All rights reserved.

    VERSION 2.11 pre-selected 

    21816 Bytes symbol space free

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
            MASM /DOEM /DVER /I..\INC SORT.ASM,SORT.OBJ,SORT.LST;
    Microsoft (R) Macro Assembler  Version 4.00
    Copyright (C) Microsoft Corp 1981, 1983, 1984, 1985.  All rights reserved.

    VERSION 2.11 pre-selected 

    22648 Bytes symbol space free

        0 Warning Errors
        0 Severe  Errors
    make : target does not exist 'SORTMES.OBJ'
            MASM /DOEM /DVER /I..\INC SORTMES.ASM,SORTMES.OBJ,SORTMES.LST;
    Microsoft (R) Macro Assembler  Version 4.00
    Copyright (C) Microsoft Corp 1981, 1983, 1984, 1985.  All rights reserved.


    49456 Bytes symbol space free

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
            MASM /DOEM /DVER /I..\INC SYS.ASM,SYS.OBJ,SYS.LST;
    Microsoft (R) Macro Assembler  Version 4.00
    Copyright (C) Microsoft Corp 1981, 1983, 1984, 1985.  All rights reserved.

    VERSION 2.11 pre-selected 

    21360 Bytes symbol space free

        0 Warning Errors
        0 Severe  Errors
    make : target does not exist 'SYSMES.OBJ'
            MASM /DOEM /DVER /I..\INC SYSMES.ASM,SYSMES.OBJ,SYSMES.LST;
    Microsoft (R) Macro Assembler  Version 4.00
    Copyright (C) Microsoft Corp 1981, 1983, 1984, 1985.  All rights reserved.

    VERSION 2.11 pre-selected 

    23964 Bytes symbol space free

        0 Warning Errors
        0 Severe  Errors
    make : target does not exist 'SYS.EXE'
            LINK SYS.OBJ SYSMES.OBJ,SYS.EXE,SYS.MAP/M;
    Microsoft (R) Overlay Linker  Version 3.51
    Copyright (C) Microsoft Corp 1983, 1984, 1985, 1986.  All rights reserved.

    Warning: no stack segment
    make : target does not exist 'SYS.COM'
            EXE2BIN SYS.EXE SYS.COM
