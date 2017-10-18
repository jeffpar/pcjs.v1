---
layout: page
title: "Q58864: Using a Macro to Determine the Current Segment"
permalink: /pubs/pc/reference/microsoft/kb/Q58864/
---

## Q58864: Using a Macro to Determine the Current Segment

	Article: Q58864
	Version(s): 5.10 5.10a
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 29-MAR-1990
	
	The following macro can be used to determine the segment from which
	the macro is called during assembly of a source file.
	
	In the following example, the "findseg" macro is called from within
	two individual segments named code1 and code2, respectively. The macro
	then uses IF statements to determine the segment. Then, depending upon
	the segment, any desired code can be assembled.
	
	        findseg macro segname
	          ifidn <code1>, <segname> ; if in segment code1
	                  :                ; do what is desired
	          endif
	
	          ifidn <code2>, <segname> ; if in segment code2
	                  :                ; do what is desired
	          endif
	          endm                     ; end macro
	
	          findseg code1   ;macro call in segment code1
	                     .
	                     .
	                     .
	          findseg code2   ;macro call in segment code2
	
	Note that invoking the findseg macro with the @curseg equate as a
	macro argument will not yield a true condition for the ifidn
	expression. The value of "segname" is resolved to the string "@curseg"
	which, in the example, is identical to "code1".
