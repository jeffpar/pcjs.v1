---
layout: page
title: COMPAQ MS-DOS 3.31
permalink: /disks/pcx86/dos/compaq/3.31/
machines:
  - id: deskpro386
    type: pcx86
    debugger: true
    config: /devices/pcx86/machine/compaq/deskpro386/ega/2048kb/debugger/machine.xml
    autoMount:
      A:
        name: COMPAQ MS-DOS 3.31 (Disk 1)
      B:
        name: None
    autoStart: true
---

COMPAQ MS-DOS 3.31
------------------

Released in late 1987 by COMPAQ Computer Corp, this version of MS-DOS displays the following messages on boot:

	The COMPAQ Personal Computer MS-DOS
	Version 3.31
	
	(C) Copyright Compaq Computer Corp. 1982, 1988
	(C) Copyright Microsoft Corp. 1981, 1987

This was the first version of DOS to support 32-bit logical sector numbers and partitions larger than 32MB,
a feature that was soon added to DOS 4.0 and OS/2 1.1.

[Directory Listings](#directory-of-compaq-ms-dos-331-disk-1) of the distribution diskettes are provided below.
The first five disks come from [WinWorld](https://winworldpc.com/product/ms-dos/331)
(see "Microsoft MS-DOS 3.31 [Compaq OEM] (3.5-720k)"), and of those five, the first three appear to be original,
with all files dated October 1988.

Disk 4, the COMPAQ "USER PROGRAMS" diskette, was part of a COMPAQ MS-DOS 4.01 release, with hidden MS-DOS files dated
April 1989 and other distribution files dated July 1989, along with a few random user-generated files with later dates.
As the README.CPQ file on that diskette explains:

    The software provided on this diskette supercedes earlier versions  
    of the software located on MS-DOS(R) as published by Compaq Computer
    Corporation or other USER PROGRAMS diskettes.  Software for use with
    Microsoft(R) Operating System/2 can be found in the OS2 directory.  
    Software for use only with MS-DOS(R) versions 3.31 and earlier can  
    be found in the DOS331 directory.                                   
                                                                        
    This software enables you to take advantage of specific capabilities
    of your computer.  Refer to the individual software files located on
    this diskette for specific version or date information.             
                                                                        
    Additional information concerning the files on this diskette can    
    be obtained by referring to the User Programs Reference, or the     
    Supplemental Software Guide, or by booting this diskette, typing    
    HELP at the A> prompt, and then pressing the ENTER key.             

So despite the evidence that this particular disk was part of a later COMPAQ MS-DOS release, it will remain part of
this distribution for now, since COMPAQ states that this disk "supersedes earlier versions", and since the `FASTART`
program on Disk 1 expects a "USER PROGRAMS" disk.  If/when an earlier revision is located, it will be added here.

Disk 5, the COMPAQ "USER DIAGNOSTICS, SETUP AND INSPECT" diskette, which contains SETUP v6.08, TEST v6.12, and
INSPECT v1.02, has files dated June 1989.

A separate 360Kb disk image, [SETUP 5.05](#directory-of-compaq-ms-dos-331-setup-505), from the PCjs Archives
has been included here as well, because it contains hidden MS-DOS 3.31 files dated September 1987 that display
a slightly different (older) boot message:

    The COMPAQ Personal Computer MS-DOS 
    Version 3.31
                              
    (C) Copyright Compaq Computer Corp. 1982, 1987                             
    (C) Copyright Microsoft Corp. 1981, 1987   

making it clear that earlier COMPAQ MS-DOS 3.31 revisions existed.

Later revisions of COMPAQ MS-DOS 3.31 were released as well.  We have archived 
three "[Rev. G](#directory-of-compaq-ms-dos-331g-disk-1)" disks obtained from
[WinWorld](https://winworldpc.com/product/ms-dos/331) (see "Microsoft MS-DOS 3.31 [Compaq OEM Rev G] (3.5-720k)").
All the files on those disks are dated May 1990.

{% include machine.html id="deskpro386" %}

### Directory of COMPAQ MS-DOS 3.31 (Disk 1)

	 Volume in drive A is FASTART    

	Directory of A:\

	IBMBIO   COM     23591 10-03-88  12:00p
	IBMDOS   COM     30648 10-03-88  12:00p
	COMMAND  COM     25332 10-03-88  12:00p
	AUTOEXEC BAT        11 10-14-88  12:00p
	CONFIG   SYS        46 10-14-88  12:00p
	EXTDISK  SYS     11721 10-14-88  12:00p
	FORMAT   COM     13675 10-14-88  12:00p
	FASTART  EXE    232841 10-14-88  12:00p
	        8 file(s)     337865 bytes

	Total files listed:
	        8 file(s)     337865 bytes
	                      387072 bytes free

### Directory of COMPAQ MS-DOS 3.31 (Disk 2)

	 Volume in drive A is STARTUP    

	Directory of A:\

	IBMBIO   COM     23591 10-03-88  12:00p
	IBMDOS   COM     30648 10-03-88  12:00p
	COMMAND  COM     25332 10-03-88  12:00p
	ANSI     SYS      1709 10-03-88  12:00p
	CLOCK    SYS      1787 10-03-88  12:00p
	COUNTRY  SYS     11254 10-03-88  12:00p
	DISKCOPY COM      6264 10-03-88  12:00p
	DISKINIT EXE     55795 10-03-88  12:00p
	DISPLAY  SYS     11651 10-03-88  12:00p
	DRIVER   SYS      1385 10-03-88  12:00p
	ENHDISK  SYS      3441 10-03-88  12:00p
	FASTOPEN EXE      3888 10-03-88  12:00p
	FDISK    COM     45052 10-03-88  12:00p
	FORMAT   COM     13675 10-03-88  12:00p
	KEYB     COM     10974 10-03-88  12:00p
	KEYBOARD SYS     41144 10-03-88  12:00p
	MODE     COM     15188 10-03-88  12:00p
	PRINTER  SYS     13559 10-03-88  12:00p
	SYS      COM      6193 10-03-88  12:00p
	VDISK    SYS      3759 10-03-88  12:00p
	XCOPY    EXE     11216 10-03-88  12:00p
	       21 file(s)     337505 bytes

	Total files listed:
	       21 file(s)     337505 bytes
	                      382976 bytes free

### Directory of COMPAQ MS-DOS 3.31 (Disk 3)

	 Volume in drive A is OPERATING  

	Directory of A:\

	APPEND   EXE      5794 10-03-88  12:00p
	ASSIGN   COM      1530 10-03-88  12:00p
	ATTRIB   EXE     10656 10-03-88  12:00p
	BACKUP   COM     30048 10-03-88  12:00p
	BASIC    COM      3532 10-03-88  12:00p
	BASICA   COM      3532 10-03-88  12:00p
	BASICA   EXE     79304 10-03-88  12:00p
	CHKDSK   COM     11939 10-03-88  12:00p
	COMMAND  COM     25332 10-03-88  12:00p
	COMP     COM      4183 10-03-88  12:00p
	DEBUG    COM     16000 10-03-88  12:00p
	DISKCOMP COM      5848 10-03-88  12:00p
	DISKCOPY COM      6264 10-03-88  12:00p
	EDLIN    COM      7495 10-03-88  12:00p
	EXE2BIN  EXE      3050 10-03-88  12:00p
	FIND     EXE      6403 10-03-88  12:00p
	FORMAT   COM     13675 10-03-88  12:00p
	GRAFTABL COM      6272 10-03-88  12:00p
	GRAPHICS COM      7576 10-03-88  12:00p
	JOIN     EXE      9612 10-03-88  12:00p
	LABEL    COM      2346 10-03-88  12:00p
	LINK     EXE     39076 10-03-88  12:00p
	MORE     COM       282 10-03-88  12:00p
	NLSFUNC  EXE      3029 10-03-88  12:00p
	PRINT    COM      8995 10-03-88  12:00p
	RECOVER  COM      5385 10-03-88  12:00p
	REPLACE  EXE     13886 10-03-88  12:00p
	RESTORE  COM     35720 10-03-88  12:00p
	SELECT   COM      4188 10-03-88  12:00p
	SETCLOCK COM      3715 10-03-88  12:00p
	SHARE    EXE      8664 10-03-88  12:00p
	SORT     EXE      1946 10-03-88  12:00p
	SUBST    EXE     10552 10-03-88  12:00p
	TREE     COM      3540 10-03-88  12:00p
	XCOPY    EXE     11216 10-03-88  12:00p
	4201     CPI     17089 10-03-88  12:00p
	5202     CPI       459 10-03-88  12:00p
	EGA      CPI     49065 10-03-88  12:00p
	INTEREST BAS       384 10-03-88  12:00p
	WORDS              660 10-03-88  12:00p
	       40 file(s)     478242 bytes

	Total files listed:
	       40 file(s)     478242 bytes
	                      231424 bytes free

### Directory of COMPAQ MS-DOS 3.31 (Disk 4)

	 Volume in drive A is USER 072789
	 Volume Serial Number is 10D5-0C56

	Directory of A:\

	IBMBIO   COM     33688 04-05-89  12:00p
	IBMDOS   COM     37528 04-05-89  12:00p
	COMMAND  COM     37667 04-05-89  12:00p
	OS2          <DIR>     07-27-89  12:00p
	DOS331       <DIR>     07-27-89  12:00p
	AUTOEXEC BAT        33 07-27-89  12:00p
	README   CPQ      1694 07-27-89  12:00p
	ADAPT    COM     18514 07-27-89  12:00p
	CACHE    EXE     26210 07-27-89  12:00p
	CEMM     EXE     33157 07-27-89  12:00p
	CEMMP    EXE     16261 07-27-89  12:00p
	CHARSET  COM      2761 07-27-89  12:00p
	CLOCK    SYS      1773 07-27-89  12:00p
	HELP     COM     39448 07-27-89  12:00p
	INSTALL  EXE     75673 07-27-89  12:00p
	KEYB     COM     11030 07-27-89  12:00p
	KEYBDP   COM     13340 07-27-89  12:00p
	KP       COM     18840 07-27-89  12:00p
	MODE     COM     28136 07-27-89  12:00p
	PWRCON   COM     37084 07-27-89  12:00p
	THINNO   F8       2048 07-27-89  12:00p
	THINNO   F14      3584 07-27-89  12:00p
	THINNO   F16      4096 07-27-89  12:00p
	THINUS   F8       2048 07-27-89  12:00p
	THINUS   F14      3584 07-27-89  12:00p
	THINUS   F16      4096 07-27-89  12:00p
	KEYBOARD SYS     41144 07-27-89  12:00p
	VDISK    SYS      7946 07-27-89  12:00p
	ADAPT    CFG         4 01-01-80  12:15a
	DOS                890 09-11-89   8:09a
	CONFIG   SYS         0 09-17-89   1:43p
	CF000292             0 09-17-89   1:43p
	       32 file(s)     502277 bytes

	Directory of A:\DOS331

	.            <DIR>     07-27-89  12:00p
	..           <DIR>     07-27-89  12:00p
	MODE     COM     15194 07-27-89  12:00p
	        3 file(s)      15194 bytes

	Directory of A:\OS2

	.            <DIR>     07-27-89  12:00p
	..           <DIR>     07-27-89  12:00p
	KP       COM     18840 07-27-89  12:00p
	PWRCON   COM     37084 07-27-89  12:00p
	MOUSEA05 SYS     17462 07-27-89  12:00p
	PWRCON   SYS      3114 07-27-89  12:00p
	        6 file(s)      76500 bytes

	Total files listed:
	       41 file(s)     593971 bytes
	                      118784 bytes free

### Directory of COMPAQ MS-DOS 3.31 (SETUP 6.08)

	 Volume in drive A has no label

	Directory of A:\

	DIAG     CPQ      8320 06-21-89  12:00p
	USER     EXE    243296 06-21-89  12:00p
	TEST     COM      2576 06-21-89  12:00p
	SETUP    EXE     84992 06-21-89  12:00p
	INSPECT  EXE     59392 06-21-89  12:00p
	README   CPQ      1849 06-21-89  12:00p
	        6 file(s)     400425 bytes

	Total files listed:
	        6 file(s)     400425 bytes
	                      327680 bytes free

### Directory of COMPAQ MS-DOS 3.31 (SETUP 5.05)

	 Volume in drive A has no label

	Directory of A:\

	IBMBIO   COM     23591 09-16-87  12:00p
	IBMDOS   COM     30632 09-16-87  12:00p
	COMMAND  COM     25332 09-16-87  12:00p
	AUTOEXEC BAT        33 01-29-88  12:00p
	CONFIG   SYS        12 01-29-88  12:00p
	DISKCOPY COM      6264 09-16-87  12:00p
	ROMREV   COM      1248 01-29-88  12:00p
	USER     EXE    193264 01-29-88  12:00p
	TEST     COM      1984 01-29-88  12:00p
	SETUP    EXE     39968 01-29-88  12:00p
	README   CPQ      1464 01-29-88  12:00p
	1        BAT        70 01-29-88  12:00p
	2        BAT        71 01-29-88  12:00p
	3        BAT        72 01-29-88  12:00p
	TEST     SCR       549 01-29-88  12:00p
	SETUP    SCR       652 01-29-88  12:00p
	ROMREV   SCR       518 01-29-88  12:00p
	       17 file(s)     325724 bytes

	Total files listed:
	       17 file(s)     325724 bytes
	                       16384 bytes free

### Directory of COMPAQ MS-DOS 3.31G (Disk 1)

     Volume in drive A is FASTART    
     Directory of A:\
    
    IBMBIO   COM     23740 05-08-90  12:00p
    IBMDOS   COM     30650 05-08-90  12:00p
    COMMAND  COM     25398 05-08-90  12:00p
    AUTOEXEC BAT        11 05-08-90  12:00p
    CONFIG   SYS        45 05-08-90  12:00p
    FASTART  EXE    227233 05-08-90  12:00p
    EXTDISK  SYS     10406 05-08-90  12:00p
            7 file(s)     317483 bytes
                          408576 bytes free

### Directory of COMPAQ MS-DOS 3.31G (Disk 2)

     Volume in drive A is STARTUP    
     Directory of A:\
    
    IBMBIO   COM     23740 05-08-90  12:00p
    IBMDOS   COM     30650 05-08-90  12:00p
    COMMAND  COM     25398 05-08-90  12:00p
    DISKCOPY COM      6850 05-08-90  12:00p
    FDISK    COM     51136 05-08-90  12:00p
    FORMAT   COM     14733 05-08-90  12:00p
    KEYB     COM     11076 05-08-90  12:00p
    MODE     COM     16618 05-08-90  12:00p
    SYS      COM      6227 05-08-90  12:00p
    FASTOPEN EXE      3888 05-08-90  12:00p
    XCOPY    EXE     11776 05-08-90  12:00p
    ANSI     SYS      2023 05-08-90  12:00p
    CLOCK    SYS      1789 05-08-90  12:00p
    COUNTRY  SYS     11254 05-08-90  12:00p
    DISPLAY  SYS     11971 05-08-90  12:00p
    DRIVER   SYS      1520 05-08-90  12:00p
    ENHDISK  SYS     10406 05-08-90  12:00p
    KEYBOARD SYS     41164 05-08-90  12:00p
    PRINTER  SYS     13751 05-08-90  12:00p
    VDISK    SYS      3768 05-08-90  12:00p
           20 file(s)     299738 bytes
                          421888 bytes free

### Directory of COMPAQ MS-DOS 3.31G (Disk 3)

     Volume in drive A is OPERATING  
     Directory of A:\
    
    APPEND   EXE      5810 05-08-90  12:00p
    ASSIGN   COM      1530 05-08-90  12:00p
    ATTRIB   EXE     10656 05-08-90  12:00p
    BACKUP   COM     30738 05-08-90  12:00p
    BASIC    COM      3534 05-08-90  12:00p
    BASICA   COM      3534 05-08-90  12:00p
    BASICA   EXE     79434 05-08-90  12:00p
    CHKDSK   COM     11941 05-08-90  12:00p
    COMMAND  COM     25398 05-08-90  12:00p
    COMP     COM      4183 05-08-90  12:00p
    DEBUG    COM     16002 05-08-90  12:00p
    DISKCOMP COM      5848 05-08-90  12:00p
    DISKCOPY COM      6850 05-08-90  12:00p
    EDLIN    COM      7495 05-08-90  12:00p
    EXE2BIN  EXE      3050 05-08-90  12:00p
    FIND     EXE      6403 05-08-90  12:00p
    FORMAT   COM     14733 05-08-90  12:00p
    GRAFTABL COM      6274 05-08-90  12:00p
    GRAPHICS COM      7578 05-08-90  12:00p
    JOIN     EXE      9612 05-08-90  12:00p
    LABEL    COM      2363 05-08-90  12:00p
    LINK     EXE     43988 05-08-90  12:00p
    MORE     COM       314 05-08-90  12:00p
    NLSFUNC  EXE      3029 05-08-90  12:00p
    PRINT    COM      9309 05-08-90  12:00p
    RECOVER  COM      5387 05-08-90  12:00p
    REPLACE  EXE     14304 05-08-90  12:00p
    RESTORE  COM     35868 05-08-90  12:00p
    SELECT   COM      4190 05-08-90  12:00p
    SETCLOCK COM      3717 05-08-90  12:00p
    SHARE    EXE      8666 05-08-90  12:00p
    SORT     EXE      1946 05-08-90  12:00p
    SUBST    EXE     10552 05-08-90  12:00p
    TREE     COM      3540 05-08-90  12:00p
    XCOPY    EXE     11776 05-08-90  12:00p
    4201     CPI     17089 05-08-90  12:00p
    5202     CPI       459 05-08-90  12:00p
    EGA      CPI     49065 05-08-90  12:00p
    INTEREST BAS       384 05-08-90  12:00p
    WORDS              660 05-08-90  12:00p
    EGA_THIN CPI     49030 05-08-90  12:00p
    LCD_THIN CPI     10618 05-08-90  12:00p
    LCD      CPI     10752 05-08-90  12:00p
           43 file(s)     557609 bytes
                          150528 bytes free

[Return to [COMPAQ MS-DOS Disks](/disks/pcx86/dos/compaq/)]
