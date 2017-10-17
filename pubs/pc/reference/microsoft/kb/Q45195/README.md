---
layout: page
title: "Q45195: Run-Time Library FP Signal Handler Assumes SS=DS"
permalink: /pubs/pc/reference/microsoft/kb/Q45195/
---

## Q45195: Run-Time Library FP Signal Handler Assumes SS=DS

	Article: Q45195
	Version(s): 5.10
	Operating System: MS-DOS
	Flags: ENDUSER | softlib CFPLIBS.ARC S12318.EXE
	Last Modified: 25-JUL-1989
	
	Note that the Microsoft Run-Time Library Exception handler will call
	another routine that calls the task's SIGFPE signal handler, if one
	exists.
	
	However, this intervening routine assumes that the stack segment is
	that of the program that caused the 8087 exception. It is known that
	certain 8087 instructions can take a (relatively) long time to
	execute. It is also known that other interrupt routines, such as the
	timer or the disk interrupt or one belonging to a TSR, may in fact be
	running when the 8087 interrupt occurs.
	
	As the NMI, it will nest, and the run-time library routine's
	assumption about the stack segment may not be valid.
	
	This problem is very rare; however, it is a valid concern. Instead of
	sacrificing speed, the decision was made to take the small chance that
	SS=DS. Checking for SS=DS would slow the floating-point libraries
	considerably.
	
	There is a file in the OnLine Software/Data Library that contains two
	floating-point libraries. These libraries should protect you from the
	unlikely event of SS!=DS. These libraries are approximately 10%
	slower than the retail floating-point libraries.
	
	This file can be found in the Software/Data Library by searching on
	the keyword CFPLIBS, the Q number of this article, or S12318. CFPLIBS
	was archived using the PKware file-compression utility.
	
	These libraries eliminate the possibility of SS!=DS within a
	floating-point signal handler. However, these libraries are about 10%
	slower than the original floating-point libraries. To include these
	files in your combined libraries, first make backup copies of the
	original floating-point libraries, rename these new libraries to
	EM.LIB and 87.LIB, and then run SETUP with the /L option to rebuild
	libraries. This will rebuild the combined libraries with these new
	floating-point components.
	
	The libraries provided with this archived file are fully tested.
	However, they are not regularly released with Microsoft C 5.10.
	Consequently, they will not be maintained, and any problem reported
	with them will not result in a patch or any other immediate fix.
	Please report all problems experienced with these libraries.
	
	The archived file contains the following files:
	
	   README.DOC
	   PIEM.LIB
	   PI87.LIB
