---
layout: page
title: "Q40594: Accessing the COM3: or COM4: Port"
permalink: /pubs/pc/reference/microsoft/kb/Q40594/
---

	Article: Q40594
	Product: Microsoft C
	Version(s): 5.00 5.10
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 16-MAY-1989
	
	If the DOS, the ROM BIOS, and the hardware all support COM3: and COM4:
	as valid devices, then the DOS mode command may possibly be used to
	redirect communication to access the ports from within Microsoft C.
	For example, to redirect COM3: to COM1:, give the following command:
	
	   mode COM3:=COM1:
	
	Note: This process has not been tested by Microsoft and is offered
	only as a suggestion.
	
	Versions of DOS earlier than MS-DOS Version 3.30 do not recognize the
	COM3: and COM4: ports. Versions beginning with MS-DOS Version 3.30
	allow some systems to access the ports, but the ROM BIOS also must
	support the extra communications port hardware.
