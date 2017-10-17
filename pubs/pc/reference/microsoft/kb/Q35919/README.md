---
layout: page
title: "Q35919: How to Force CAPS LOCK On or Off with PEEK and POKE"
permalink: /pubs/pc/reference/microsoft/kb/Q35919/
---

## Q35919: How to Force CAPS LOCK On or Off with PEEK and POKE

	Article: Q35919
	Version(s): 1.00 1.01 1.02 2.00 2.01 3.00 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom B_GWBasicI
	Last Modified: 12-DEC-1989
	
	This article describes how to programmatically force the CAPS LOCK key
	on or off without actually pressing the CAPS LOCK key.
	
	This information applies to Microsoft QuickBASIC Versions 1.00, 1.02,
	2.00, 2.01, 3.00, 4.00, 4.00b, and 4.50 for MS-DOS, to Microsoft
	GW-BASIC Versions 3.20, 3.22, and 3.23 for MS-DOS, to Microsoft BASIC
	Compiler Versions 6.00 and 6.00 for MS-DOS, and to Microsoft BASIC PDS
	Version 7.00 for MS-DOS.
	
	You can determine the state of the CAPS LOCK key with the following
	PEEK command:
	
	   DEF SEG = 0
	   X = PEEK(1047) AND 64
	
	If CAPS LOCK is off, the value of "X" will be "0". If CAPS LOCK is on,
	the value will be 64.
	
	To force the CAPS LOCK off, use the following command:
	
	   DEF SEG = 0
	   POKE 1047, PEEK(1047) AND 191
	
	To force the CAPS LOCK on, use the following:
	
	   DEF SEG = 0
	   POKE 1047, PEEK(1047) OR 64
	
	Each bit of location 1047 reflects the status of a keyboard flag. This
	includes NUM LOCK, SCROLL LOCK, CAPS LOCK, INSert mode, and whether or
	not the LEFT SHIFT and RIGHT SHIFT keys, the ALT key, or the CTRL
	(Control) key is currently pressed or not. See the following table:
	
	Bit No.         Decimal value           Keyboard flag
	
	0               1                       RIGHT SHIFT
	1               2                       LEFT SHIFT
	2               4                       CTRL (Control)
	3               8                       ALT
	4               16                      SCROLL LOCK
	5               32                      NUM LOCK
	6               64                      CAPS LOCK
	7               128                     INSert mode
	
	To determine the state of any flag, the following statement will
	return "0" if the flag is clear (off or not pressed), and will return
	<bval> if the flag is set (on or pressed):
	
	   PEEK(1047) AND <bval>
	   (where <bval> is the decimal value of the bit that represents
	   the flag you want)
	
	To force the flag on (which applies only to the LOCK keys and the
	INSert mode), you need to set the appropriate bit. You can do this
	with the following POKE statement:
	
	   POKE 1047, PEEK(1047) OR <bval>
	   (where <bval> is the decimal value of the flag you want to set)
	
	To force the flag off, you can use the following similar statement:
	
	   POKE 1047, PEEK(1047) AND (255 - <bval>)
	
	Note that simply poking the bit value into 1047 would effectively set
	the flag, but would also clear all other flags. Thus, be sure to
	retain the previous values of the other flags by using the above
	strategies.
	
	This information is outlined in the book "Advanced MS-DOS" by Ray
	Duncan (Copyright 1986 by Microsoft Press).
	
	Note that instead of using PEEK, you may also get the status of
	keyboard flags with IBM ROM BIOS interrupt 16 hex, using function
	number 2. This interrupt returns the ROM BIOS flags byte that
	describes the state of the following keyboard toggles and SHIFT keys:
	RIGHT SHIFT or LEFT SHIFT key down, CTRL key down, ALT key down,
	SCROLL LOCK on, NUM LOCK on, CAPS LOCK on, INSert on. QuickBASIC and
	the BASIC Compiler have a CALL INTERRUPT statement (not found in
	GW-BASIC) which can call this interrupt.
