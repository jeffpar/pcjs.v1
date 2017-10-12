---
layout: page
title: "Q48859: NMAKE Version 1.00 with "!" and User and Predefined Macros"
permalink: /pubs/pc/reference/microsoft/kb/Q48859/
---

	Article: Q48859
	Product: Microsoft C
	Version(s): 1.00
	Operating System: MS-DOS
	Flags: ENDUSER | S_QuickC buglist1.00 fixlist1.01
	Last Modified: 30-NOV-1989
	
	The following NMAKE file does not produce the correct results when
	using NMAKE Version 1.00, which is supplied with the Microsoft QuickC
	compiler Version 2.00. The file replaces the user-defined macro in the
	second command line with the predefined macro in the first command
	line. The workarounds are as follows:
	
	1. Remove the "!" at the beginning of the first command line, which
	   causes the command to be executed for each dependent file if the
	   command uses one of the special macros $? or $**.
	
	2. Do not use a predefined macro for the first command.
	
	3. Do not use the predefined macro $**, a complete list of dependent
	   files, for the dependent files in the first command line.
	
	4. Do not use a user-defined macro in the second command line.
	
	5. Update to the Microsoft QuickAssembler package, which is shipped
	   with NMAKE Version 1.01, in which this problem is corrected.
	
	More information on the NMAKE utility can be found starting on Page
	155 of the "Microsoft QuickC Toolkit" manual. The following is the
	NMAKE file that fails:
	
	SOURCE=test.c
	
	test.exe: $(SOURCE)
	    !$(CC) $**
	    copy $(SOURCE) new
	
	This produces the following output:
	
	cl test.c
	copy cl new
	
	The following is the NMAKE file with the first workaround:
	
	SOURCE=test.c
	
	test.exe: $(SOURCE)
	    $(CC) $**
	    copy $(SOURCE) new
	
	This produces the following correct output:
	
	cl test.c
	copy test.c new
	
	The following is the NMAKE file with the second workaround:
	
	SOURCE=test.c
	
	test.exe: $(SOURCE)
	    !cl $**
	    copy $(SOURCE) new
	
	This also produces the correct output.
	
	The following is the NMAKE file with the third workaround:
	
	SOURCE=test.c
	
	test.exe: $(SOURCE)
	    !$(CC) $(SOURCE)
	    copy $(SOURCE) new
	
	This also produces the correct output.
	
	The following is the NMAKE file with the fourth workaround:
	
	SOURCE=test.c
	
	test.exe: $(SOURCE)
	    !$(CC) $(SOURCE)
	    copy test.c new
	    copy $(SOURCE) new
	
	This produces the following output:
	
	cl test.c
	copy test.c new
	copy test.c new
