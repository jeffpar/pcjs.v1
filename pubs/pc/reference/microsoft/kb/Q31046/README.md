---
layout: page
title: "Q31046: &quot;Save As&quot; Fails after &quot;Disk Not Ready&quot; Error in QB.EXE"
permalink: /pubs/pc/reference/microsoft/kb/Q31046/
---

## Q31046: &quot;Save As&quot; Fails after &quot;Disk Not Ready&quot; Error in QB.EXE

	Article: Q31046
	Version(s): 4.00 4.00b
	Operating System: MS-DOS
	Flags: ENDUSER | buglist4.00 buglist4.00b fixlist4.50 B_BasicCom
	Last Modified: 5-DEC-1989
	
	If the disk-drive door is open during an attempt to Save As... without
	specifying the drive name in the dialog box, the QB.EXE editor will
	respond with a "Drive not ready" message. When the door is closed and
	Retry is selected, the save appears to complete normally. However, the
	file is written to the root directory of the hard drive rather than to
	the floppy.
	
	Microsoft has confirmed this to be a problem in QuickBASIC Versions
	4.00 and 4.00b, and in the QuickBASIC version distributed with the
	Microsoft BASIC Compiler Versions 6.00 and 6.00b for MS-DOS and OS/2
	(buglist6.00,buglist6.00b). This problem was corrected in QuickBASIC
	Version 4.50.
	
	This problem occurs after one save has been made to the floppy disk.
	
	If you believe you have completely lost a source file, check the root
	directory of the hard drive; it may have been saved there.
	
	This problem has been tested and does not occur in the following
	QuickBASIC Versions:
	
	   QuickBASIC Versions 3.00, 2.01, and 2.00
	
	This problem does not apply to QuickBASIC Version 1.x.
	
	You can work around this problem by canceling the "Drive not ready"
	error box, rather than Retrying. This process will produce a "Bad file
	name" error. To eliminate this, do the following:
	
	1. Cancel the "Bad file name" box.
	
	2. Close the drive door.
	
	3. Attempt the save again.
