---
layout: page
title: Microsoft MS-DOS 2.00
permalink: /disks/pcx86/dos/microsoft/2.00/
machines:
  - id: ibm5160
    type: pcx86
    config: /devices/pcx86/machine/5160/cga/512kb/debugger/machine.xml
    drives: '[{name:"PC-DOS 2.00 w/Tools (10Mb)",type:3,path:"/pcjs-disks/pcx86/drives/10mb/PCDOS200-C400.json"},{name:"MS-DOS 2.X Source (10Mb)",type:3,path:"/pcjs-disks/pcx86/dos/microsoft/2.00/MSDOS2X-SRC.json"}]'
    autoMount:
      A:
        name: None
      B:
        name: None
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

    diskdump --dir=src --format=json --output=MSDOS2X-SRC.json --label=MSDOS2X --size=10000 --normalize --overwrite

I started with the source files from the CHM release, only because they had preserved the original file times:

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

Next, I organized all the source files into folders that correspond to their respective components:

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

Then I supplemented the [MSDOS](https://github.com/jeffpar/pcjs-disks/tree/master/pcx86/dos/microsoft/2.00/src/MSDOS)
files with reconstructed
[IO.ASM](https://jeffpar.github.io/pcjs-disks/pcx86/dos/microsoft/2.00/src/MSDOS/IO.ASM) and
[IO2.ASM](https://jeffpar.github.io/pcjs-disks/pcx86/dos/microsoft/2.00/src/MSDOS/IO2.ASM), thanks to
[John Elliott](http://www.seasip.info/DOS/).

In the machine below, all the above files, along with a
[MK.BAT](https://github.com/jeffpar/pcjs-disks/blob/master/pcx86/dos/microsoft/2.00/src/MK.BAT)
batch file, are on drive D.  Drive C contains a bootable copy of PC DOS 2.00, along with Microsoft MASM 4.00
and other assorted tools.

Since one of those tools is **MAKE**, I've also started adding **MAK** files
(eg, [MSDOS.MAK](https://github.com/jeffpar/pcjs-disks/blob/master/pcx86/dos/microsoft/2.00/src/MSDOS/MSDOS.MAK))
and **LRF** files (Linker Response Files) like
[MSDOS.LRF](https://github.com/jeffpar/pcjs-disks/blob/master/pcx86/dos/microsoft/2.00/src/MSDOS/MSDOS.LRF) (formerly **DOSLINK**).
Note that the machine is using **MAKE 4.02**, which doesn't appear to support things like inference rules with
paths, so the makefiles are rather verbose.

{% include machine.html id="ibm5160" %}
