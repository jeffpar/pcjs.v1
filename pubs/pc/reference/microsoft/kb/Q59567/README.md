---
layout: page
title: "Q59567: &quot;A4100: Impure Memory Reference&quot; Incorrectly Generated"
permalink: /pubs/pc/reference/microsoft/kb/Q59567/
---

## Q59567: &quot;A4100: Impure Memory Reference&quot; Incorrectly Generated

	Article: Q59567
	Version(s): 5.00 5.10 5.10a | 5.00 5.10 5.10a
	Operating System: MS-DOS          | OS/2
	Flags: ENDUSER | buglist5.10
	Last Modified: 29-MAR-1990
	
	The /P option tells MASM to generate warning messages if data is
	stored in the code segment when privileged instructions are in use.
	
	Writing data to the code segment is acceptable in real mode; however,
	it may cause problems in protected mode. If MASM is invoked with the
	/P option and finds an impure memory reference, such as in the
	following code
	
	               .code
	       c_word  DW        ?
	               .
	               .
	               mov       cs:c_word,data
	
	it will generate a warning similar to the following:
	
	   filename.asm(???): warning A4100: Impure memory reference
	
	MASM may incorrectly generate the warning message. The following
	example demonstrates this problem:
	
	        .model small
	        .286p
	        .code
	
	        mov     al,cs:[bp]
	        mul     word ptr cs:[bp+2]
	        end
	
	MASM incorrectly flags the line that does the multiplication. MASM
	also incorrectly generates the A4100 warning message if the .286,
	.386, and .386p directives are in effect.
	
	Microsoft has confirmed this to be a problem in Version 5.10. We are
	researching this problem and will post new information here as it
	becomes available.
