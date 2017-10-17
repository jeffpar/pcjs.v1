---
layout: page
title: "Q28033: QB.EXE Can Hang Using &#36;INCLUDE on Single-Drive System"
permalink: /pubs/pc/reference/microsoft/kb/Q28033/
---

## Q28033: QB.EXE Can Hang Using &#36;INCLUDE on Single-Drive System

	Article: Q28033
	Version(s): 4.00 4.00b
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom buglist4.00 bc6PTM237 buglist4.00b fixlist4.50
	Last Modified: 4-DEC-1988
	
	The QB.EXE editor can hang on a single-drive system when using
	$INCLUDE file loading, name parsing, and/or file opening, as shown in
	the example below.
	
	Microsoft has confirmed this to be a problem in QuickBASIC Versions
	4.00 and 4.00b, and in the Microsoft BASIC Compiler Versions 6.00 and
	6.00b (buglist6.00, buglist6.00b) for MS-DOS and OS/2. This problem
	was corrected in QuickBASIC Version 4.50.
	
	QuickBASIC will hang in the following single-drive configuration:
	
	 1. Make the following two floppies (5.25 inch or 3.5 inch):
	
	       Disk 1: QB.EXE
	       Disk 2: HIDE.BAS, QB.BI, QB.QLB
	
	    (Note that HIDE.BAS, QB.BI, and QB.QLB are provided on the
	    QuickBASIC Version 4.00 release disks.)
	
	 2. Set PATH, LIB, and INCLUDE to nothing (i.e., SET PATH=).
	
	 3. Put Disk 1 in Drive A (single-floppy systems only, hard disk
	    allowed).
	
	 4. Set Drive A as the default drive.
	
	 5. Type the following command:
	
	       QB B:HIDE /L.
	
	 6. Answer location for QB.QLB with Drive B.
	
	 7. Swap disks as prompted.
	
	 8. Modify the include line to be b:QB.BI instead of QB.BI (this can
	    be done before starting QuickBASIC).
	
	 9. Press SHIFT+F5.
	
	10. Insert Disk 1 in Drive A, press ENTER; at this point, QuickBASIC
	    hangs.
	
	Please note that Disk 2 is the one to use when you are asked to insert
	a disk in Drive B. If you modify HIDE.BAS before running QuickBASIC,
	then QuickBASIC will hang when trying to load QB.BI.
