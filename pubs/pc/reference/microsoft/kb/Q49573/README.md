---
layout: page
title: "Q49573: sscanf with %i and a Leading 0 Gives Octal Conversion Results"
permalink: /pubs/pc/reference/microsoft/kb/Q49573/
---

	Article: Q49573
	Product: Microsoft C
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | S_QuickC S_QuickASM scanf sscanf fscanf
	Last Modified: 22-NOV-1989
	
	Question:
	
	Why does sscanf return incorrect results when I use the %i switch, yet
	it returns correct results when I use the %d switch?
	
	Response:
	
	The %i switch has the capability of reading in decimal, octal, and
	hexadecimal numbers. Hexadecimal numbers are specified with the 0x in
	front of the number, while octal numbers are specified with the 0
	(zero) in front of them. If you want only decimal numbers to be read
	in, use the %d switch.
	
	This is expected behavior and occurs with the entire scanf family.
