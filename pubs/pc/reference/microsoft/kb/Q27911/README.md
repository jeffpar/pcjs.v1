---
layout: page
title: "Q27911: MS-DOS 3.20 Patch for Coprocessor Math Exceptions in BC and QB"
permalink: /pubs/pc/reference/microsoft/kb/Q27911/
---

## Q27911: MS-DOS 3.20 Patch for Coprocessor Math Exceptions in BC and QB

	Article: Q27911
	Version(s): 6.00 6.00b 7.00
	Operating System: MS-DOS
	Flags: ENDUSER | B_QuickBas
	Last Modified: 22-JAN-1990
	
	The information below is taken from the following files, and only
	applies to the product versions shown:
	
	1. The README.DOC file from the Program Disk of Microsoft BASIC
	   Compiler Versions 6.00 and 6.00b for MS-DOS
	
	2. The UPDATE.DOC file from the Program Disk for QuickBASIC Version
	   4.00b
	
	Note: This information was not included with Microsoft BASIC
	Professional Development System (PDS) Version 7.00 for MS-DOS (except
	for a brief mention in the PACKING.LST file) but it still applies
	since PATCH87.EXE is shipped with BASIC PDS 7.00.
	
	This article is relevant only if your system has all of the following
	characteristics:
	
	1. Uses MS-DOS Version 3.20
	
	2. Boots from a hard-disk drive
	
	3. Has a math coprocessor (for instance, an 8087 or 80287 chip)
	
	4. Runs programs that use floating-point math
	
	The following DOS patch is not necessary if you have PC-DOS; the patch
	only applies to MS-DOS. (Attempting to patch PC-DOS may give you an
	error such as the following: "File Not Found: IO.SYS".)
	
	For systems that satisfy all of the preceding conditions, you may be
	able to eliminate floating-point math problems by installing a small
	patch in DOS. The problem that usually arises is hanging when a math
	exception occurs. Math exceptions are items such as "divide by zero"
	or "overflow" errors. If you are not sure whether you need the patch,
	perform the following steps:
	
	1. Copy the program PATCH87.EXE (included in this release) to the
	   root directory of your hard-disk drive.
	
	2. Reboot your system from the hard disk, and do not perform any
	   floppy-disk operations after rebooting. It is very important
	   that you avoid floppy-disk I/O after rebooting because that will
	   affect the reliability of the diagnostic test that you are about
	   to perform.
	
	3. If necessary, use the CD command to move to the root directory
	   of your hard-disk drive.
	
	4. Run the PATCH87.EXE program by entering the following command at
	   the DOS prompt:
	
	      PATCH87
	
	5. The program performs a diagnostic test on your system to determine
	   whether it needs the DOS patch, and if the patch is needed, whether
	   the patch can be installed successfully. If the program tells you
	   that you need to install the DOS patch, and that it can be done,
	   follow the procedure described in the next section.
	
	Please note that the floating-point problem has been eliminated in
	versions of MS-DOS later than Version 3.20. This includes MS-DOS
	Versions 3.21 and 3.30. If you performed the preceding test and
	determined that you should install the DOS patch on your system,
	perform the following steps:
	
	1. Format a blank floppy disk. (Do not use the /s formatting option to
	   transfer system files to the disk.)
	
	2. Use the SYS command to copy IO.SYS and MS-DOS.SYS from the root
	   directory of your hard disk to the new floppy disk. For instance,
	   if you boot from Drive C, enter the following commands:
	
	      C: SYS A:
	
	3. Use the COPY command to copy COMMAND.COM and SYS.COM to the same
	   floppy disk.
	
	4. Use the COPY command to copy the program PATCH87.EXE (included in
	   this release) to the same floppy disk.
	
	5. Change the current drive and directory to the floppy disk by
	   entering the following command:
	
	      A:
	
	6. Install the DOS patch by entering the following command:
	
	      PATCH87 /F
	
	Please note that if you experience any disk errors during Steps 2
	through 6, do not proceed with Step 7. Reboot from your hard disk and
	repeat the entire process.
	
	7. If you have not experienced any errors, use the SYS command to
	   transfer the files IO.SYS and MS-DOS.SYS from the floppy disk back
	   to your hard disk. For instance, if the boot directory of your
	   system is the root directory of Drive C, enter the following
	   command at the DOS prompt:
	
	      A: SYS C:
	
	8. The DOS patch has been installed. Reboot the system.
