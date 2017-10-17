---
layout: page
title: "Q35906: BC 6.00 Example Calling OS/2 API Function DosSetMaxFH"
permalink: /pubs/pc/reference/microsoft/kb/Q35906/
---

## Q35906: BC 6.00 Example Calling OS/2 API Function DosSetMaxFH

	Article: Q35906
	Version(s): 6.00 6.00b 7.00
	Operating System: OS/2
	Flags: ENDUSER |
	Last Modified: 1-FEB-1990
	
	Below is a sample program that makes a call to the MS OS/2 function
	DosSetMaxFH. This program can be compiled in Microsoft BASIC Compiler
	Versions 6.00 and 6.00b for MS OS/2 and Microsoft BASIC Professional
	Development System (PDS) Version 7.00 for MS OS/2.
	
	By default, 20 file handles are allocated to a file. To increase the
	number of file handles available, the DosSetMaxFH function must be
	called. The maximum number of file handles is 255. When determining
	the required number of handles, add several for dynamic-link modules
	(these modules use several handles), and three more for the default
	system I/O handles.
	
	The following is a code example:
	
	'This information is found in BSEDOSFL.BI
	DECLARE FUNCTION DOSSETMAXFH%(BYVAL P1 AS INTEGER)
	
	INPUT "Enter the maximum number of file handles : ",fh%
	x=DosSetMaxFH%(fh%)
	
	IF (x) THEN
	   Print "An error occurred.  The error number is ";x
	ELSE
	   Print "Maximum number of file handles has been changed."
	END IF
	
	ON ERROR GOTO DONE
	
	for i = 1 to 255
	  fl$="xxxxx"+mid$(str$(i),2,len(str$(i)))
	  open fl$ for output as i
	next i
	stop
	
	done:
	  Print i
	
	end
