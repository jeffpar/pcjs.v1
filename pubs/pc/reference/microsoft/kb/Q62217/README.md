---
layout: page
title: "Q62217: EXEHDR.EXE Switch Omissions in 7.00/7.10 Manual"
permalink: /pubs/pc/reference/microsoft/kb/Q62217/
---

## Q62217: EXEHDR.EXE Switch Omissions in 7.00/7.10 Manual

	Article: Q62217
	Version(s): 7.00 7.10 | 7.00 7.10
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER | SR# S900517-206 docerr
	Last Modified: 15-JAN-1991
	
	The EXEHDR documentation on page 347 of the "Microsoft CodeView and
	Utilities User's Guide" for Microsoft BASIC Professional Development
	System (PDS) versions 7.00 and 7.10 mentions only the /v (verbose)
	option and omits many additional EXEHDR options. This manual also
	unnecessarily documents the EXEMOD utility (on pages 307-311), which
	is an older version of EXEHDR. EXEMOD is not shipped with BASIC PDS
	7.00 or 7.10 because EXEHDR contains all of EXEMOD's functionality.
	
	This information applies to Microsoft BASIC PDS versions 7.00 and 7.10
	for MS-DOS and MS OS/2.
	
	The full list of EXEHDR options can be displayed by typing EXEHDR /?
	at the DOS prompt. The options are as follows:
	
	   Usage: EXEHDR [options] <file-list>
	   Valid options are:
	
	      /?
	      /HEAP:(0H - ffffH)
	      /HELP
	      /MAX:(0H - ffffH)
	      /MIN:(0H - ffffH)
	      /NEWFILES
	      /NOLOGO
	      /PMTYPE:(PM | VIO | NOVIO | WINDOWAPI |
	                  WINDOWCOMPAT | NOTWINDOWCOMPAT)
	      /RESETERROR
	      /STACK:(0H - ffffH)
	      /VERBOSE
	
	Note: The hex values are listed in assembly notation (for example,
	ffffH). Hex values should actually be input with C notation using the
	"0x" prefix instead of the "H" suffix (for example, ffffH -> 0xffff).
	The values can also be entered in decimal notation without prefixes or
	suffixes.
	
	If the assembler notation for hex values is used with EXEHDR, the
	following errors will occur:
	
	   EXEHDR: error U1110: malformed number FFFFH
	   EXEHDR: error U1115: option /MAX:FFFFH ignored
