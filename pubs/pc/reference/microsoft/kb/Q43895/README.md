---
layout: page
title: "Q43895: &quot;Device Unavailable&quot;; PS/2 SETUP Doesn't Recognize COM2 Port"
permalink: /pubs/pc/reference/microsoft/kb/Q43895/
---

## Q43895: &quot;Device Unavailable&quot;; PS/2 SETUP Doesn't Recognize COM2 Port

	Article: Q43895
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S890424-38 B_BasicCom
	Last Modified: 15-DEC-1989
	
	A "Device unavailable" error may occur when a QuickBASIC program
	attempts to OPEN "COM2:" and the IBM PS/2 system SETUP utility hasn't
	been configured or can't be configured to recognize COM2.
	
	This problem has been reported with the IBM PS/2 Model 30 computer.
	The SETUP utility doesn't make provisions for a second communications
	port. Therefore, the BIOS data area RS232_BASE does not contain the
	proper information that QuickBASIC is looking for. A good example is
	an internal modem card configured as COM2 that is put in the PS/2 but
	not recognized as an actual communications port. QuickBASIC looks in
	the BIOS data area to see if there is a COM2 port to use and doesn't
	find the proper information. This problem is caused by the PS/2 Model
	30 (and possibly other models) and is not a problem with QuickBASIC.
	
	The RS232_BASE area can be set with the proper COM2 information using
	a simple QuickBASIC program. This program can be found in this
	Knowledge Base by querying on the following words:
	
	   COM2 and Bad Filename and QuickBASIC
	
	This information applies to Microsoft QuickBASIC Versions 4.00, 4.00b,
	and 4.50, Microsoft BASIC Compiler Versions 6.00 and 6.00b, and
	Microsoft BASIC PDS Version 7.00.
