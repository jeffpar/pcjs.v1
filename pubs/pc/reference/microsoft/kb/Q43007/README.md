---
layout: page
title: "Q43007: Reading Extended Keyboard Characters with C"
permalink: /pubs/pc/reference/microsoft/kb/Q43007/
---

	Article: Q43007
	Product: Microsoft C
	Version(s): 5.00 5.10
	Operating System: MS-DOS
	Flags: ENDUSER | S_QUICKC
	Last Modified: 17-MAY-1989
	
	Question:
	
	How do I read from the extended keyboard with the C _bios_keybrd
	routine? It does not seem to recognize the scan codes for the
	additional keys of the extended keyboard.
	
	Response:
	
	The _bios_keybrd function uses INT function 16H to access the keyboard
	services. The _bios_keybrd function is based on the original PC BIOS
	INT 16H, which does not support the extended keyboard. The BIOS for
	AT's and PS/2's has been updated to support the extended keyboard. The
	updated BIOS has three addition services: 10H reads a character from
	the extended keyboard, 11H gets the extended-keyboard status, 12H gets
	the extended-keyboard flags.
	
	To allow the C function _bios_keybrd to use these updated keyboard
	services, add the following manifest constants to the bios.h include
	file:
	
	/* manifest constants for BIOS enhanced keyboard services */
	
	#define _EXT_KEYBRD_READ         0x10  /* read character */
	#define _EXT_KEYBRD_READY        0x11  /* check if key waiting */
	/* check status of shift keys*/
	#define _EXT_KEYBRD_SHIFT_STATUS 0x12
	
	To read keys from the extended keyboard, use these new constants in
	place of the manifest constants described on Page 138 of the
	"Microsoft C for the MS-DOS Operating System: Run-Time Library
	Reference" for Version 5.10.
	
	The following program uses the enhanced services of INT function 16H
	to determine if the UP ARROW or DOWN ARROW keys on the extended
	keyboard were pressed:
	
	#include <bios.h>
	#include <stdio.h>
	
	main()
	{
	        unsigned key;
	
	        key = _bios_keybrd(EXT_KEYBRD_READ);
	        if ( key == 0x48e0)
	                printf("up arrow key was pressed\n");
	        if ( key == 0x50e0)
	                printf("down arrow key was pressed\n");
	}
