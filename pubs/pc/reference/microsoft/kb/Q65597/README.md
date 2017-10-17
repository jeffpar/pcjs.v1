---
layout: page
title: "Q65597: Correction to DIR&#36; Example In &quot;BASIC 7.0: Language Reference&quot;"
permalink: /pubs/pc/reference/microsoft/kb/Q65597/
---

## Q65597: Correction to DIR&#36; Example In &quot;BASIC 7.0: Language Reference&quot;

	Article: Q65597
	Version(s): 7.00 7.10 | 7.00 7.10
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER | SR# S900909-1 docerr
	Last Modified: 21-SEP-1990
	
	The DIR$ function example on Page 107 of the "Microsoft BASIC 7.0:
	Language Reference" manual contains an error. To correct the problem,
	the variable "FileCount" in the last line in the following code
	fragment should be changed to "FileCount&" to match the other
	references to it in the example:
	
	   IF LEN(DIR$(filespec$)) = 0 THEN
	      FileCount& = 0
	   ELSE
	      FileCount = 1
	
	The corrected code is as follows:
	
	   IF LEN(DIR$(filespec$)) = 0 THEN
	      FileCount& = 0
	   ELSE
	      FileCount& = 1
	
	This information applies to Microsoft BASIC Professional Development
	System (PDS) versions 7.00 and 7.10 for MS-DOS and MS OS/2.
