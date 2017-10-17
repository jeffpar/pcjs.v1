---
layout: page
title: "Q60140: Location of Keyboard Buffer Area in MS-DOS; BASIC PEEK, POKE"
permalink: /pubs/pc/reference/microsoft/kb/Q60140/
---

## Q60140: Location of Keyboard Buffer Area in MS-DOS; BASIC PEEK, POKE

	Article: Q60140
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S900326-109 b_basiccom pss
	Last Modified: 12-NOV-1990
	
	The actual location of the keyboard buffer on the IBM PC or PS/2 is
	variable, but by default, the buffer is a 32-byte area located at
	segment 0, offset 1054 (41E hex). Because many applications assume
	that this is the default location, please be careful if you change its
	address or size.
	
	The buffer is composed of 16 2-byte entries. It holds up to 16
	keystrokes until they are read via the BIOS services through interrupt
	22 (16 hex). Because this is a circular queue buffer, two pointers
	indicate the head and tail of the queue. It is usually best to
	manipulate the pointers rather than the actual data.
	
	This information is taken from "The New Peter Norton Programmer's
	Guide To The IBM PC and PS/2" on pages 56-60, published by Microsoft
	Press (1988).
	
	There are other adjacent memory locations that are used in conjunction
	with the keyboard buffer. The most important of these are listed
	below. All of these addresses are in segment 0.
	
	Offset 1050 (41A hex)
	---------------------
	
	A 2-byte address that points to the current head of the BIOS keyboard
	buffer at offset 1054.
	
	Offset 1052 (41C hex)
	---------------------
	
	A 2-byte address that points to the current tail of the BIOS keyboard
	buffer at offset 1054.
	
	Note: One interesting way to clear the keyboard buffer is to set the
	head of the queue equal to the tail. To do this in BASIC, simply PEEK
	the two bytes at 1052 and POKE them into location 1050.
	
	Offset 1152 (480 hex)
	---------------------
	
	A 2-byte word pointing to the start of the keyboard buffer area.
	
	Offset 1154 (482 hex)
	---------------------
	
	A 2-byte word pointing to the end of the keyboard buffer area.
	
	Note: Be careful if you choose to change the addresses at 1152 or 1154
	because many applications may not check these memory locations to
	determine the keyboard buffer area. These applications will assume the
	default configuration.
	
	References:
	
	For more articles about reading from and writing to the keyboard
	buffer, search in this Knowledge Base for the following words:
	
	   interrupt AND keyboard AND buffer
	
	Keyboard scan codes are documented in Appendix D of "Microsoft
	QuickBASIC 4.5: Programming in BASIC"; in Appendix A of "Microsoft
	QuickBASIC 4.0: Language Reference" for 4.00 and 4.00b; in Appendix A
	of "Microsoft BASIC Compiler 6.0: Language Reference" for 6.00 and
	6.00b; and in Appendix A of "Microsoft BASIC 7.0: Language Reference"
	manual for BASIC PDS versions 7.00 and 7.10.
