---
layout: page
title: "Q43702: QuickC: Dual Floppy Compile/Link Procedure"
permalink: /pubs/pc/reference/microsoft/kb/Q43702/
---

	Article: Q43702
	Product: Microsoft C
	Version(s): 2.00
	Operating System: MS-DOS
	Flags: ENDUSER | docerr
	Last Modified: 2-MAY-1989
	
	The following list details the steps used to compile and link with a
	Microsoft QuickC Version 2.00 dual-360K floppy setup. This procedure
	assumes that source files are stored on disk 5, which also contains
	the include and library files. This also assumes that no errors are
	encountered during the process. Remember to use backup disks, not
	your original disks.
	
	Instructions for the compile/link process with no errors during the
	compile phase are described below.
	
	Note: Drive A will be used to hold disks 1 and 2. Drive B will hold
	your work disk and disk 5. During the process, you will start with
	disk 1 in Drive A and your work disk in Drive B. You will swap between
	disks 1 and 2 in Drive A, and disks 5 and your work disk in Drive B.
	
	Assuming you have set up your disks as suggested by the README.DOC
	file, follow these steps to compile and link:
	
	 1. Insert your DOS-bootable disk in Drive A.
	
	 2. Turn on the machine.
	
	 3. When the DOS prompt appears and the disk drive has stopped
	    running, remove the boot disk and insert disk 1 in Drive A.
	
	 4. Insert disk 5 in Drive B.
	
	 5. Type "B:" at the DOS command prompt.
	
	 6. Type "QC <filename>" (where <filename> is the name of the source
	    file you will be working on).
	
	 7. QuickC will now start. If the file does not currently exist,
	    QuickC will ask if you want to create the file. Answer this query
	    appropriately.
	
	 8. You may now enter or edit your program.
	
	 9. When the program is ready to be compiled, press F5.
	
	10. If you have made changes in the program QuickC will ask if you
	    want to save these changes. Answer this query with a Yes or No.
	
	11. After a short while, QuickC will say it cannot find QCCOM.OVL.
	    Insert disk 2 in Drive A, and press ENTER.
	
	12. QuickC will soon say it cannot access QC.EXE. At this point,
	    again insert disk 1 in Drive A, and press ENTER.
	
	13. QuickC will ask for either ILINK.EXE or LINK.EXE soon. Remove disk
	    1 from drive A, insert disk 2 into that drive, and press ENTER.
	
	14. After linking is complete, QuickC will ask for QC.EXE again.
	    Remove disk 2 from Drive A and insert disk 1 in drive A. Press
	    Enter.
	
	15. At this point you will have an executable file. Because you
	    pressed F5 for run, QuickC will now run the program if no errors
	    were encountered during the compile/link process.
	
	If there are errors in your code, QuickC will stop after step 12 and
	report any errors it finds. Correct these errors and start from Step
	9.
