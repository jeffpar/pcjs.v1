---
layout: page
title: "Q57776: PLAY and SOUND Click Speaker in QuickBASIC; OUT Clicks Less"
permalink: /pubs/pc/reference/microsoft/kb/Q57776/
---

## Q57776: PLAY and SOUND Click Speaker in QuickBASIC; OUT Clicks Less

	Article: Q57776
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom SR# S900103-91
	Last Modified: 17-JAN-1990
	
	In QuickBASIC, the PLAY and SOUND statements produce a click on the
	speaker noticeable at the end of a sound. Also, if an inaudible
	frequency is used with the SOUND statement, a click is heard before
	and after the PLAY or SOUND statement.
	
	This article shows a method using the OUT statement to produce sounds
	where the clicking is less noticeable.
	
	This information applies to Microsoft QuickBASIC Versions 4.00, 4.00b,
	and 4.50 for MS-DOS, to Microsoft BASIC Compiler Versions 6.00 and
	6.00b for MS-DOS, and to Microsoft BASIC Professional Development
	System (PDS) Version 7.00 for MS-DOS.
	
	The following program produces the clicking noise and then shows an
	improvement involving programming the timer chip as explained in the
	following book:
	
	   "The New Peter Norton Programmer's Guide to the IBM PC & PS/2," by
	   Peter Norton and Richard Wilton (Microsoft Press, 1988). Pages
	   148-150.
	
	Code Example
	------------
	
	' The following PLAY statement demonstrates the clicking sound:
	FOR i% = 1 TO 3
	  PLAY "L4 C"
	  SLEEP 1
	NEXT
	' The following SOUND statement demonstrates the clicking sound:
	FOR i% = 1 TO 3
	  SOUND 700, 12
	  SLEEP 1
	NEXT
	' The following OUT statements alleviate the clicking sound while
	' generating tones:
	count1 = 1193280! / 700        ' 700 is the desired frequency
	count2 = 1193280! / 100000     ' 100,000 is the desired inaudible frequency
	lo.count1 = count1 MOD 256     ' calculate low-order byte values
	lo.count2 = count2 MOD 256
	hi.count1 = count1 / 256       ' calculate high-order byte values
	hi.count2 = count2 / 256
	OUT &H43, &HB6                 ' get timer ready
	old.port = INP(&H61)           ' read the value at port 61H
	new.port = (old.port OR &H3)   ' set bits 0 and 1
	OUT &H61, new.port             ' turn speaker on
	FOR i% = 1 TO 3
	  OUT &H42, lo.count1          ' load low-order byte for first frequency
	  OUT &H42, hi.count1          ' load high-order byte for first frequency
	  SLEEP 1
	  OUT &H42, lo.count2          ' load low-order byte for second frequency
	  OUT &H42, hi.count2          ' load high-order byte for second frequency
	  SLEEP 1
	NEXT
	OUT &H61, old.port             ' turn speaker off
	END
