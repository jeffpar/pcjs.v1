---
layout: page
title: "Q41435: ESC Key Aborts Only the Compile Process in QC Environment"
permalink: /pubs/pc/reference/microsoft/kb/Q41435/
---

	Article: Q41435
	Product: Microsoft C
	Version(s): 2.00
	Operating System: MS-DOS
	Flags: ENDUSER | buglist2.00 docerr
	Last Modified: 28-FEB-1989
	
	The inside cover of the "Microsoft QuickC Up and Running" manual
	states that the ESC key stops the compiler and linker from continuing.
	This is only partially correct. The ESC key only aborts the compile
	stage of the QuickC compiler. During the link stage, the ESC key is
	ignored.
	
	Also pressing CTRL+BREAK aborts the compile process, but it will
	not abort link step as stated in the README.DOC. Pressing CTRL+BREAK
	during the linking process may hang your machine if you try executing
	your application program immediately after the linking is completed.
	
	Microsoft has confirmed this to be a problem in Version 2.00. We are
	researching this problem and will post new information as it becomes
	available.
