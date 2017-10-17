---
layout: page
title: "Q32214: &quot;Device I/O&quot; Error Using LPRINT or &quot;LPT1:&quot; After a CHAIN"
permalink: /pubs/pc/reference/microsoft/kb/Q32214/
---

## Q32214: &quot;Device I/O&quot; Error Using LPRINT or &quot;LPT1:&quot; After a CHAIN

	Article: Q32214
	Version(s): 6.00 6.00b 7.00
	Operating System: OS/2
	Flags: ENDUSER | buglist6.00 buglist6.00b buglist7.00
	Last Modified: 17-JAN-1990
	
	The following problem occurs in OS/2 protected mode programs compiled
	with Microsoft BASIC Compiler Versions 6.00 and 6.00b or Microsoft
	BASIC Professional Development System (PDS) Version 7.00 for MS OS/2.
	Using LPRINT, or sending output to the "LPT1:" device name, then
	chaining to a second routine that uses the printer produces the
	following error:
	
	   Device I/O error in line 0 of module PROG2
	
	This problem can be worked around in OS/2 protected mode by sending
	output to the DOS "LPT1" (without a colon) device name instead of
	using LPRINT or "LPT1:". This problem does not occur in OS/2 real
	mode.
	
	Microsoft has confirmed this to be a problem in Microsoft BASIC
	Compiler Versions 6.00 and 6.00b and in Microsoft BASIC PDS Version
	7.00. We are researching this problem and will post new information
	here as it becomes available.
	
	The following chained programs demonstrate the "Device I/O" error.
	These programs must be compiled with the BRUN library option for
	protected mode.
	
	   ' prog1
	   OPEN "O",15,"LPT1:"
	   PRINT #15,"program 1"
	   CHAIN "prog2"
	
	   ' prog2
	   PRINT #15,"program 2"
	   CLOSE #15
	
	The problem occurs only when sending output to the BASIC "LPT1:"
	printer device. If the DOS device, "LPT1" (without a colon) is used,
	the problem does not occur. For example, the following programs CHAIN
	correctly:
	
	   ' prog1
	   OPEN "O",15,"LPT1"
	   PRINT #15,"program 1"
	   CHAIN "prog2"
	
	   ' prog2
	   PRINT #15,"program 2"
	   CLOSE #15
	   SYSTEM
