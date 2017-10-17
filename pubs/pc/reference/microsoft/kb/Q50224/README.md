---
layout: page
title: "Q50224: Watch Bytes (wb) Command Can Be Used to Watch a Buffer in HEX"
permalink: /pubs/pc/reference/microsoft/kb/Q50224/
---

## Q50224: Watch Bytes (wb) Command Can Be Used to Watch a Buffer in HEX

	Article: Q50224
	Version(s): 2.20 2.30 | 2.20 2.30
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER |
	Last Modified: 17-JUL-1990
	
	Question:
	
	Is there a way to keep tabs on the contents of a buffer via a watch
	command? We want to observe the contents of a 20-character buffer in
	HEX. The buffer is not necessarily null terminated.
	
	Response:
	
	The way to watch a buffer in CodeView in hexadecimal with the Watch
	command is to use Watch Bytes (wb) as follows:
	
	   >wb *buffer L 10  ; this will watch the first 10 bytes of
	                       buffer in HEX
	
	For the given example, you should follow the previous command with the
	following:
	
	   >wb *(buffer + 10) L 10  ; this will watch the next 10
	                              bytes in HEX.
	
	Please note that both the length specifier as well as the number 10
	used to offset the pointer in the second command are taken in the
	current radix. The example above assumes a radix of 10. You can
	explicitly specify the base of the number in hex as follows:
	
	   >wb *buffer L 0x0a
	   >wb *(buffer + 0x0a) L 0x0a
	
	For more information on the wb command in CodeView, see the "Microsoft
	CodeView and Utilities, Microsoft Editor, Mixed-Language Programming
	Guide" manual.
