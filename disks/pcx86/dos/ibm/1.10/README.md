---
layout: page
title: PC-DOS 1.10
permalink: /disks/pcx86/dos/ibm/1.10/
machines:
  - id: ibm5150-pcdos110
    type: pcx86
    config: /devices/pcx86/machine/5150/mda/64kb/machine.xml
    resume: 1
    autoMount:
      A:
        path: /disks/pcx86/dos/ibm/1.10/PCDOS110.json
---

PC-DOS 1.10
-----------

The PCjs machine below is running PC-DOS 1.10.

{% include machine.html id="ibm5150-pcdos110" %}

PC-DOS 1.10 was released in May 1982 on one single-sided (160Kb) diskette.  A complete listing of all the files
is provided below.

Also, in case you're wondering why 1920 + 6400 does not equal the "8704 bytes in 2 hidden files" reported by CHKDSK,
that's because all CHKDSK byte totals are cluster-granular.  On a 160Kb diskette, 1 cluster equals 1 sector or 512
bytes.

CHKDSK considers the size of IBMBIO.COM to be 2048 bytes (1920 rounded up to the nearest 512 multiple), and the
size of IBMDOS.COM is 6656, so the total number of bytes consumed by those two files is 8704.

### Directory of PC-DOS 1.10 Diskette

	IBMBIO    COM        1920  05-07-82
	IBMDOS    COM        6400  05-07-82
	COMMAND   COM        4959  05-07-82
	FORMAT    COM        3816  05-07-82
	CHKDSK    COM        1720  05-07-82
	SYS       COM         605  05-07-82
	DISKCOPY  COM        2008  05-07-82
	DISKCOMP  COM        1640  05-07-82
	COMP      COM        1649  05-07-82
	EXE2BIN   EXE        1280  05-07-82
	MODE      COM        2509  05-07-82
	EDLIN     COM        2392  05-07-82
	DEBUG     COM        5999  05-07-82
	LINK      EXE       41856  05-07-82
	BASIC     COM       11392  05-07-82
	BASICA    COM       16768  05-07-82
	ART       BAS        1920  05-07-82
	SAMPLES   BAS        2432  05-07-82
	MORTGAGE  BAS        6272  05-07-82
	COLORBAR  BAS        1536  05-07-82
	CALENDAR  BAS        3840  05-07-82
	MUSIC     BAS        8704  05-07-82
	DONKEY    BAS        3584  05-07-82
	CIRCLE    BAS        1664  05-07-82
	PIECHART  BAS        2304  05-07-82
	SPACE     BAS        1920  05-07-82
	BALL      BAS        2048  05-07-82
	COMM      BAS        4352  05-07-82
	        28 File(s)

CHKDSK reports:

	      160256 bytes total disk space
	        8704 bytes in 2 hidden files
	      144384 bytes in 26 user files 
	        7168 bytes available on disk

Additional Information From [PC DOS Retro](https://sites.google.com/site/pcdosretro/doshist)
---

- distributed on 1 160KB floppy disk
- double-sided 320KB floppy disk support added
- directory entries include the time last written in addition to the date
- COPY supports concatenation of multiple files
- new internal commands: DATE, DEL, REN, TIME
- new external command: EXE2BIN
- INT 21h functions 1Ch, 1Fh, 2Eh added

See [PC-DOS 1.10 Documentation](/pubs/pc/software/dos/PCDOS110/) for more information.
