---
layout: page
title: "Q58001: Can't Supress References to ILINK in NMAKE File"
permalink: /pubs/pc/reference/microsoft/kb/Q58001/
---

## Q58001: Can't Supress References to ILINK in NMAKE File

	Article: Q58001
	Version(s): 2.00 2.01
	Operating System: MS-DOS
	Flags: ENDUSER | S_QUICKASM S_NMAKE buglist2.00
	Last Modified: 12-FEB-1990
	
	Question:
	
	I have seen that ILINK shows up in my NMAKE file that is created by
	QuickC Version 2.00, even after turning off the incremental linker. Is
	there any way to tell QuickC not to include ILINK in the NMAKE file?
	
	Response:
	
	The following steps will prevent the NMAKE file from referencing the
	Incremental Linker:
	
	1. Select Release in the "Select Build Flags" dialog box of the
	   Options.Make menu. The program can no longer be debugged from within
	   the QuickC environment.
	
	2. Build the program from within the QuickC environment.
	
	3. Manually edit the NMAKE file by changing the following line
	
	      ilink -a -e "link $(LFLAGS) @$(PROJ).crf" $(PROJ)
	
	   to read as follows:
	
	      link $(LFLAGS) @$(PROJ).crf $(PROJ)
	
	Microsoft has confirmed this to be a problem with Microsoft QuickC
	Version 2.00. We are researching this problem and will post new
	information here as it becomes available.
