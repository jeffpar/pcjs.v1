---
layout: page
title: "Q36738: Third-Party TSR for Printing Hercules Graphics Screens"
permalink: /pubs/pc/reference/microsoft/kb/Q36738/
---

## Q36738: Third-Party TSR for Printing Hercules Graphics Screens

	Article: Q36738
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom
	Last Modified: 12-JAN-1990
	
	The GRAPHICS.COM utility [a terminate-and-stay-resident (TSR) program]
	provided with MS-DOS Versions 2.x through 3.x supports printing of
	graphics in CGA SCREEN modes 1 and 2 to Epson-compatible printers, but
	does NOT support printing Hercules graphics SCREEN 3. [While
	GRAPHICS.COM provided with MS-DOS 4.00 supports screen dumps to Epson
	printers for EGA and VGA SCREEN modes (7 through 13), it still doesn't
	support Hercules.]
	
	A TSR can be obtained from Hercules Computer Technology that may
	enable printing Hercules graphics screens. Details on obtaining this
	TSR are given below.
	
	This article applies to QuickBASIC Versions 4.00, 4.00b, and 4.50, to
	Microsoft BASIC Compiler Version 6.00 and 6.00b for MS-DOS, and to
	Microsoft BASIC PDS Version 7.00 for MS-DOS.
	
	Once you have installed GRAPHICS.COM, the graphics screen dump ability
	is enabled for the PRINT SCREEN key (or SHIFT+PRINT SCREEN on
	nonenhanced keyboards) and for the equivalent CALL to hardware
	interrupt 5. However, GRAPHICS.COM doesn't support Hercules graphics
	SCREEN 3. Hercules memory is arranged in a fashion incompatible with
	GRAPHICS.COM.
	
	Hercules Computer Technology provides two TSR software drivers that
	allow dumping either page of Hercules graphics memory to a printer.
	HGC and HPRINT are available as a combined set by calling Hercules
	Technical Support at (415) 540-0749. These drivers work correctly with
	the IBM EGA or VGA graphics.
	
	Microsoft has not officially tested these products with QuickBASIC and
	makes no guarantees of compatibility. According to customers who have
	these drivers, they work properly with QuickBASIC Version 4.00. As
	always, you should be careful using any memory-resident program with
	QuickBASIC.
	
	As an alternative to the above products, if you would like a
	QuickBASIC program that can perform a Hercules graphics screen dump,
	search for the following words:
	
	   Hercules and Epson and screen and print and QuickBASIC
	
	Note: QuickBASIC versions earlier than Version 4.00 have no support
	for Hercules-monochrome graphics adapters.
	
	Hercules-compatible monochrome graphics is provided in QuickBASIC 4.00
	and later. Hercules graphics mode is invoked with SCREEN 3. To invoke
	SCREEN 3, the Hercules support-driver must be loaded. This driver is
	called QBHERC.COM in QuickBASIC Versions 4.00 and 4.00b and in the
	BASIC compiler Versions 6.00 and 6.00b. This driver is called
	MSHERC.COM in QuickBASIC 4.50 and in BASIC PDS 7.00.
