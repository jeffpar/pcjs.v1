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
      B:
        name: None
    autoType: $date\r$time\r
---

PC-DOS 1.10
-----------

PC-DOS 1.10 was released in May 1982 on one single-sided (160Kb) diskette.
The disk's [Directory Listing](#directory-of-pc-dos-110-diskette) and [Boot Sector](#pc-dos-110-boot-sector)
are shown below.

To learn how to use PC-DOS 1.10, see the [Documentation](/pubs/pc/software/dos/PCDOS110/).

{% include machine.html id="ibm5150-pcdos110" %}

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

In case you're wondering why 1920 + 6400 does not equal the "8704 bytes in 2 hidden files" reported by CHKDSK,
that's because all CHKDSK byte totals are cluster-granular.  On a 160Kb diskette, 1 cluster equals 1 sector or 512
bytes.

CHKDSK considers the size of IBMBIO.COM to be 2048 bytes (1920 rounded up to the nearest 512 multiple), and the
size of IBMDOS.COM is 6656, so the total number of bytes consumed by those two files is 8704.

### PC-DOS 1.10 Boot Sector

The boot sector of the PC-DOS 1.11 disk image contains the following bytes:

	00000000  eb 27 90 08 00 14 00 00  00 00 00 00 00 00 00 00  |.'..............|
	00000010  00 00 00 00 00 00 00 00  00 00 00 00 00 00 00 00  |................|
	00000020  00 00 00 00 00 00 00 cd  19 fa 8c c8 8e d8 33 d2  |..............3.|
	00000030  8e d2 bc 00 7c fb b8 60  00 8e d8 8e c0 33 d2 8b  |....|..`.....3..|
	00000040  c2 cd 13 72 69 e8 85 00  72 dd 2e 83 3e 03 7c 08  |...ri...r...>.|.|
	00000050  74 06 2e c6 06 64 7d 02  bb 00 00 2e 8b 0e 03 7c  |t....d}........||
	00000060  51 b0 09 2a c1 b4 00 8b  f0 56 33 d2 33 c0 8a c5  |Q..*.....V3.3...|
	00000070  2e f6 36 64 7d 8a e8 8a  f4 8b c6 b4 02 cd 13 72  |..6d}..........r|
	00000080  2d 5e 59 2e 29 36 05 7c  74 1f 8b c6 2e f7 26 65  |-^Y.)6.|t.....&e|
	00000090  7d 03 d8 fe c5 b1 01 51  be 08 00 2e 3b 36 05 7c  |}......Q....;6.||
	000000a0  7c 05 2e 8b 36 05 7c eb  c0 ea 00 00 60 00 be 67  ||...6.|.....`..g|
	000000b0  7d e8 02 00 eb fe 32 ff  2e ac 24 7f 74 0b 56 b4  |}.....2...$.t.V.|
	000000c0  0e bb 07 00 cd 10 5e eb  ef c3 e9 33 ff bb 00 00  |......^....3....|
	000000d0  b9 04 00 b8 01 02 cd 13  1e 72 33 8c c8 8e d8 bf  |.........r3.....|
	000000e0  00 00 b9 0b 00 26 80 0d  20 26 80 4d 20 20 47 e2  |.....&.. &.M  G.|
	000000f0  f4 bf 00 00 be 8b 7d b9  0b 00 fc f3 a6 75 0f bf  |......}......u..|
	00000100  20 00 be 97 7d b9 0b 00  f3 a6 75 02 1f c3 be 1b  | ...}.....u.....|
	00000110  7d e8 a2 ff b4 00 cd 16  1f f9 c3 0d 0a 4e 6f 6e  |}............Non|
	00000120  2d 53 79 73 74 65 6d 20  64 69 73 6b 20 6f 72 20  |-System disk or |
	00000130  64 69 73 6b 20 65 72 72  6f 72 0d 0a 52 65 70 6c  |disk error..Repl|
	00000140  61 63 65 20 61 6e 64 20  73 74 72 69 6b 65 20 61  |ace and strike a|
	00000150  6e 79 20 6b 65 79 20 77  68 65 6e 20 72 65 61 64  |ny key when read|
	00000160  79 0d 0a 00 01 00 02 0d  0a 44 69 73 6b 20 42 6f  |y........Disk Bo|
	00000170  6f 74 20 66 61 69 6c 75  72 65 0d 0a 00 4d 69 63  |ot failure...Mic|
	00000180  72 6f 73 6f 66 74 2c 49  6e 63 20 69 62 6d 62 69  |rosoft,Inc ibmbi|
	00000190  6f 20 20 63 6f 6d 30 69  62 6d 64 6f 73 20 20 63  |o  com0ibmdos  c|
	000001a0  6f 6d 30 05 c6 06 77 2f  ff 83 7e fc 00 75 0b 80  |om0...w/..~..u..|
	000001b0  7e f7 3b 75 05 c6 06 76  2f ff 89 ec 5d ca 04 00  |~.;u...v/...]...|
	000001c0  00 00 00 00 00 00 00 00  00 00 00 00 00 00 00 00  |................|
	000001d0  00 00 00 00 00 00 00 00  00 00 00 00 00 00 00 00  |................|
	000001e0  00 00 00 00 00 00 00 00  00 00 00 00 00 00 00 00  |................|
	000001f0  00 00 00 00 00 00 00 00  00 00 00 00 00 00 00 00  |................|

### Additional Information From [PC DOS Retro](https://sites.google.com/site/pcdosretro/doshist)

- distributed on 1 160KB floppy disk
- double-sided 320KB floppy disk support added
- directory entries include the time last written in addition to the date
- COPY supports concatenation of multiple files
- new internal commands: DATE, DEL, REN, TIME
- new external command: EXE2BIN
- INT 21h functions 1Ch, 1Fh, 2Eh added

See [PC-DOS 1.10 Documentation](/pubs/pc/software/dos/PCDOS110/) for more information.
