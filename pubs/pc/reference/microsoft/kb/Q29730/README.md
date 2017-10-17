---
layout: page
title: "Q29730: Editor &quot;User's Guide&quot; C-Extension Sample Generates Warnings"
permalink: /pubs/pc/reference/microsoft/kb/Q29730/
---

## Q29730: Editor &quot;User's Guide&quot; C-Extension Sample Generates Warnings

	Article: Q29730
	Version(s): 1.00   | 1.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 12-JUL-1988
	
	Problem:
	    When I compile the sample program on Page 85 of the "Microsoft
	Editor for MS OS/2 and MS-DOS: User's Guide," I get two warning
	messages.
	   These warning messages are generated on the following two sections
	of the sample program:
	
	   1. struct swiDesc swiTable [] = {
	            { NULL, NULL, NULL }
	       };
	
	   2. struct cmdDesc cmdTable [] = {
	            { "Upper", Upper, 0, BOXSTR | TEXTARG },
	            { NULL, NULL, NULL, NULL }
	       };
	
	Response:
	  These warnings will not cause a problem. You can, however, make the
	following two changes:
	
	   1. struct swiDesc swiTable [] = {
	            { NULL, NULL, 0 }
	       };
	
	   2. struct cmdDesc cmdTable [] = {
	            { "Upper", Upper, 0, BOXSTR | TEXTARG },
	            { NULL, NULL, 0, 0 }
	       };
