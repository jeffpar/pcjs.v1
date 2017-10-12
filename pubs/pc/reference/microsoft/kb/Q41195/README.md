---
layout: page
title: "Q41195: QuickC Version 2.00 Supports Coprocessor Libraries"
permalink: /pubs/pc/reference/microsoft/kb/Q41195/
---

	Article: Q41195
	Product: Microsoft C
	Version(s): 1.x 2.00
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 28-FEB-1989
	
	In QuickC Version 2.00 it is now possible to use the coprocessor
	libraries from within the QuickC environment.
	
	As documented in the QuickC Version 2.00 README.DOC file, you need to
	set the CL environment variable to use the co-processor libraries, as
	follows:
	
	   CL=/FPi87
	
	When you compile within the environment, QuickC invokes the QCL
	command-line compiler that looks at the CL environment variable for
	any options that are set. When it sees the /FPi87 switch, it knows to
	invoke the co-processor libraries.
	
	This was not possible in QuickC Version 1.x because of the core
	library needing the emulator math package. In QuickC Version 2.00,
	the core library is gone so there is no restriction to the emulator
	math package.
