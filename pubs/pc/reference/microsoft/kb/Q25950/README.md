---
layout: page
title: "Q25950: CodeView Versions 2.10 to 2.30 Use Four Extra File Handles"
permalink: /pubs/pc/reference/microsoft/kb/Q25950/
---

	Article: Q25950
	Product: Microsoft C
	Version(s): 2.30 2.20 2.10 2.00
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 19-JAN-1990
	
	Problem:
	
	CodeView Versions 2.00 to 2.30 seem to be using four additional file
	handles. The following program attempts to open 20 files, reporting
	its success or failure after each attempt:
	
	    #include <stdio.h>
	    #include <string.h>
	    #include <stdlib.h>
	
	    main()
	    {
	            FILE *streams[20];
	            int i;
	            char buffer[12];
	            char *p;
	
	            for (i = 0; i < 20; i++) {
	                    p = itoa(i, buffer, 10);
	                    p = strcat(buffer, ".dat");
	                    streams[i] = fopen(buffer, "w+");
	                    printf("streams[%d] = %d\n", i, streams[i]);
	            }
	    }
	
	Running outside of CodeView, the call to fopen() fails after 15
	streams have been opened. Running in CodeView Versions 1.x, the call
	fails after 15 files have been opened. However, in CodeView Versions
	2.00 to 2.30, it fails after 11 file handles have been opened.
	
	Response:
	
	CodeView Versions 2.00 to 2.30 require four file handles for their own
	use. Remember that MS-DOS itself has five preopened file handles. If
	you want to open more than 15 files, follow the steps specified in the
	C Version 5.10 README.DOC to modify the C start-up code to allow
	opening more than 20 files.
