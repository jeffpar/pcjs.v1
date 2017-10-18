---
layout: page
title: "Q64438: CV2206 WARNING: Corrupt Debug OMF Detected in FOO.OBJ..."
permalink: /pubs/pc/reference/microsoft/kb/Q64438/
---

## Q64438: CV2206 WARNING: Corrupt Debug OMF Detected in FOO.OBJ...

	Article: Q64438
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 6-AUG-1990
	
	When loading a Microsoft Macro Assembler (MASM) program into CodeView
	version 3.00, the following warning is received:
	
	   CV2206 WARNING: Corrupt debug OMF detected in FOO.OBJ, discarding
	   source line information
	
	In this example, the program was assembled and linked with CodeView
	information.
	
	The warning is caused because the program was written with full
	segment declarations and the CODE segment was not declared class
	'code'.
	
	The problem does not appear when using dot-segment declarations.
	
	The following code causes this error:
	
	  stack   segment stack para 'stack'
	          db      100 dup (?)
	  stack   ends
	
	  text    segment
	          assume   cs:text
	
	  main    proc
	          ret
	  main    endp
	
	  text    ends
	          end main
	
	The following code does not cause this error:
	
	  stack   segment stack para 'stack'
	          db      100 dup (?)
	  stack   ends
	
	  text    segment  'code'
	          assume   cs:text
	
	  main    proc
	          ret
	  main    endp
	
	  text    ends
	          end main
