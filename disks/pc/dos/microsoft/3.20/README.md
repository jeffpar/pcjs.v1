MS-DOS 3.20
---

The MS-DOS 3.20 disks in the PCjs collection are the only known non-OEM copies of that release
available online.  All other known MS-DOS 3.20 disk images are OEM releases (eg, HP, Zenith, Data General,
Seiko Epson, etc.) and can be found on sites like [WinWorld](https://winworldpc.com/product/ms-dos/320).

Disks 3 and 4 contained a printed date of `March 21, 1986` (see the photo below), which is consistent with
the file timestamps (`2-14-86` and `3-14-86`) on those disks.  However, all the files on Disks 1 and 2 are
timestamped `7-07-86`.  Apparently, the Programmer's Reference files were finalized several months in advance
of the final MS-DOS 3.20 binaries.

Based on the dates of the binaries, **July 7, 1986** is considered the release date of MS-DOS 3.20.

NOTE: Disks 1 and 2 are restored versions of the original disks, since the original disks had been slightly
modified for personal use.  The disks should be complete, and all files should be genuine and in the original
order.  As proof, the following data from Disk 1:

	00013db0  0d 0a 0d 0a 4d 69 63 72  6f 73 6f 66 74 28 52 29  |....Microsoft(R)|
	00013dc0  20 4d 53 2d 44 4f 53 28  52 29 20 20 56 65 72 73  | MS-DOS(R)  Vers|
	00013dd0  69 6f 6e 20 33 2e 32 30  0d 0a 20 20 20 20 20 20  |ion 3.20..      |
	00013de0  20 20 20 20 20 20 20 28  43 29 43 6f 70 79 72 69  |       (C)Copyri|
	00013df0  67 68 74 20 4d 69 63 72  6f 73 6f 66 74 20 43 6f  |ght Microsoft Co|
	00013e00  72 70 20 31 39 38 31 2d  31 39 38 36 0d 0a 0d 0a  |rp 1981-1986....|

matches the data listed at [16bitos.com](http://16bitos.com/320ms.htm), as do the MD5 checksums of IO.SYS,
MSDODS.SYS and COMMAND.COM.

Surprisingly Bad Bug in MS-DOS 3.20
---
If you attempt to boot MS-DOS 3.20 on an [IBM PC Model 5150](/devices/pc/machine/5150/cga/384kb/softkbd/) (with either
an MDA or CGA video card), the machine will appear to crash after printing the first character.

When MS-DOS 3.20 prints characters to the screen, it uses this code:

	0287:1FA8 CD29            INT      29                   ;history=7
	0070:017A 50              PUSH     AX                   ;history=6
	0070:017B 56              PUSH     SI                   ;history=5
	0070:017C 57              PUSH     DI                   ;history=4
	0070:017D 55              PUSH     BP                   ;history=3
	0070:017E B40E            MOV      AH,0E                ;history=2
	0070:0180 B307            MOV      BL,07                ;history=1
	0070:0182 CD10            INT      10
	AX=0E43 BX=0B07 CX=0010 DX=0000 SP=0862 BP=36FE SI=00D3 DI=000B 
	SS=0287 DS=0287 ES=0287 PS=F012 V0 D0 I0 T0 S0 Z0 A1 P0 C0 

whereas MS-DOS 3.30 uses this code:

	022F:222E CD29            INT      29                   ;history=10
	0070:069E 50              PUSH     AX                   ;history=9
	0070:069F 56              PUSH     SI                   ;history=8
	0070:06A0 57              PUSH     DI                   ;history=7
	0070:06A1 55              PUSH     BP                   ;history=6
	0070:06A2 53              PUSH     BX                   ;history=5
	0070:06A3 B40E            MOV      AH,0E                ;history=4
	0070:06A5 B700            MOV      BH,00                ;history=3
	0070:06A7 B307            MOV      BL,07                ;history=2
	0070:06A9 CD10            INT      10                   ;history=1

MS-DOS 3.20 doesn't clear the BH register before calling INT 0x10 Video BIOS function 0x0E, and the Model 5150 Video
BIOS uses the BH register to select the video page, so when BH contains garbage (0x0B in the above example), it prints
characters off-screen, where they can’t be seen.

As a result, the machine hasn't technically "crashed", but it's printing characters where they can't be seen, making
the machine more or less unusable.

Starting with the IBM PC Model 5160, Video BIOS function 0x0E ignores BH and always use the current page.

Microsoft must not have tested MS-DOS 3.20 on any 5150 machines, or if they did, those machines must have contained
upgraded video cards, such as an EGA, which provided their own Video BIOS.  This bug was fixed in MS-DOS 3.21,
but that release apparently wasn't made available until almost a year later (MS-DOS 3.21 files are timestamped
`5-01-87`).

MS-DOS 3.20 Photos
---

Here's what one of the MS-DOS 3.20 diskettes looked like.

> ![MS-DOS 3.20 Programmer's Reference](MSDOS320-DISK3-PROGREF1-thumb.jpg "link:MSDOS320-DISK3-PROGREF1.jpg:nogallery")

And the box, courtesy of [www.oldcomputermuseum.com](http://www.oldcomputermuseum.com/os/msdos_3.2.html).

> ![MS-DOS 3.20 Box](http://www.oldcomputermuseum.com/os/os_files/msdos_3.2.jpg)
