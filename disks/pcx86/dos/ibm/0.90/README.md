---
layout: page
title: PC-DOS 0.90
permalink: /disks/pcx86/dos/ibm/0.90/
machines:
  - type: pcx86
    id: ibm5150-pcdos090
    config: /devices/pcx86/machine/5150/cga/256kb/machine.xml
    autoMount:
      A:
        path: /disks/pcx86/dos/ibm/0.90/PCDOS090.json
---

PC-DOS 0.90
-----------

There was no PC-DOS 0.90 product *per se*.  It has been dubbed version 0.90 simply because it predates
[PC-DOS 1.00](../1.00/) by several months.  More information about this preliminary version of PC-DOS can
be found at the [OS/2 Museum](http://www.os2museum.com/wp/pc-dos-1-0-but-not-quite/).

Below is an IBM PC (Model 5150) with an original IBM ROM BIOS and Color (CGA) Display that will boot PC-DOS 0.90.
A similar configuration with [Monochrome Display and Debugger](debugger/) is also available.
The machine is configured to run at 4.77Mhz, so the ROM BIOS memory test has been disabled,
since a PC with 256Kb was rather slow to boot.

{% include machine.html id="ibm5150-pcdos090" %}

PC-DOS 0.90 files were distributed on one single-sided (160Kb) diskette.  A directory listing of the disk is
provided below.

### Directory of PC-DOS 0.90 Diskette

	 Volume in drive A has no label
	 Directory of A:\
	
	IBMBIO   COM      2560 05-29-81  12:00a
	IBMDOS   COM      5566 05-29-81  12:00a
	COMMAND  COM      2576 05-29-81  12:00a
	DEBUG    COM      5450 05-27-81  12:00a
	TIME     COM       243 05-19-81  12:00a
	DATE     COM       245 05-20-81  12:00a
	ASM      COM      6389 05-15-81  12:00a
	FORMAT   COM      2048 05-29-81  12:00a
	HEX2BIN  COM       483 05-07-81  12:00a
	BASIC    COM     11008 06-04-81  12:00a
	CHKDSK   COM      1224 05-30-81  12:00a
	EDLIN    COM      2231 05-29-81  12:00a
	MODE     COM       675
	COMMENTS          3561 06-05-81  12:00a
	MOVBAS   COM       128 04-23-81  12:00a
	BAS18    COM     11008 06-04-81  12:00a
	BASICA   COM     14976 06-04-81  12:00a
	AUTOEXEC BAK        24
	SYS      COM       896 06-03-81  12:00a
	BAS18A   COM     14976 06-04-81  12:00a
	COMMENTS BAK      3560 06-05-81  12:00a
	FCOMP    COM      1408 04-13-81  12:00a
	DISKCOPY COM      1211 06-04-81  12:00a
	CONVERT  COM      3200 04-15-81  12:00a
	COMP     COM       256 04-15-81  12:00a
	KILO     BAS       768 04-23-81  12:00a
	20HAL    COM      1792 04-24-81  12:00a
	SPCWAR   BAS      5120 05-22-81  12:00a
	TTY      ASC      2432 05-22-81  12:00a
	VCOPY    BAT        26 04-24-81  12:00a
	SHIPS    MAC      1792 06-01-81  12:00a
	CIRCLE   MAC       384 06-01-81  12:00a
	RBAS     COM     32768 04-25-81  12:00a
	THREED   BAS      3072
	CUBE     DAT       402 04-30-81  12:00a
	       35 file(s)     144458 bytes
	                        8192 bytes free
