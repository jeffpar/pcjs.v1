---
layout: page
title: "Q67313: &quot;Bad Record Number&quot; Using Network Printer in OS/2, LANMAN 2.00"
permalink: /pubs/pc/reference/microsoft/kb/Q67313/
---

## Q67313: &quot;Bad Record Number&quot; Using Network Printer in OS/2, LANMAN 2.00

	Article: Q67313
	Version(s): 6.00 6.00b 7.00 7.10
	Operating System: OS/2
	Flags: ENDUSER | buglist6.00 buglist6.00b buglist7.00 buglist7.10
	Last Modified: 5-DEC-1990
	
	When the DOS device "LPT1" or "LPT2" is OPENed to print over a
	Microsoft LANMAN version 2.00 network printer under OS/2, the error
	"Bad record number in line <nn> in module <module name> at address
	xxxx:xxxx" will occur when the device is closed. This error does not
	occur when printing to a local printer or to a LANMAN 2.00 network
	printer under DOS.
	
	Microsoft has confirmed this problem in programs compiled in Microsoft
	BASIC Compiler versions 6.00 and 6.00b for MS OS/2 and in Microsoft
	BASIC PDS (Professional Development System) versions 7.00 and 7.10 for
	MS OS/2. Microsoft is researching this problem and will post new
	information here as it becomes available.
	
	The following code segment demonstrates the "Bad record number" error
	when compiled and run under OS/2 with logical device "LPT1:" connected
	to a Microsoft LANMAN 2.00 network.
	
	Note: The code example will compile and run without error when run
	under DOS or if the logical device LPT1: refers to a local printer.
	
	   OPEN "LPT1" FOR OUTPUT AS #1
	   PRINT "Hello world"
	   CLOSE #1
	
	To work around the problem, open the BASIC logical device "LPTn:"
	instead of the DOS "LPTn" device. The following code example will
	compile and run without error when run under DOS or OS/2, and printing
	to a local or network printer device:
	
	   OPEN "LPT1:" FOR OUTPUT AS #1
	   PRINT "Hello world"
	   CLOSE #1
	
	Note: There is a problem when the BASIC device "LPTn:" is opened
	across two CHAINed programs. For more information, please query on the
	following words:
	
	   CHAIN and device and I/O and LPT1 and LPRINT
