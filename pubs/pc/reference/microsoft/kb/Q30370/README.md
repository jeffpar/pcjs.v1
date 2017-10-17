---
layout: page
title: "Q30370: Reading F11 and F12 Keys on Extended Keyboard"
permalink: /pubs/pc/reference/microsoft/kb/Q30370/
---

## Q30370: Reading F11 and F12 Keys on Extended Keyboard

	Article: Q30370
	Version(s): 5.00 5.10
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 11-AUG-1989
	
	The following program will allow you to read the F11 and F12 keys
	on an extended keyboard. The key to this process is to call
	_bios_keybrd() with the service argument 0x10. This will allow an
	extended keyboard read. This program will sit in an infinite loop
	until F11 or F12 is pressed. Note that the C run-time library
	functions getch() or getche() will not be able to read in the extended
	function keys even after the change above has been made.
	
	#include <bios.h>
	#include <stdio.h>
	#define _EXTKEYREAD 0x10
	#define MASK 0xFF00
	#define ZMASK 0x00FF
	main()
	{
	  unsigned value, nextval;
	  while(1)
	  {
	  value = _bios_keybrd(_EXTKEYREAD);
	  nextval = value;
	  if ((value & ZMASK) == 0)         /* check low order byte for zero*/
	                                    /* if zero, then we have extended key*/
	    {
	
	       if((nextval & MASK) == 0x8500)   /* buffer code = 8500h for F11 */
	       printf("F11 key pushed\n");
	
	       if((nextval & MASK) == 0x8600)   /* buffer code = 8600 for F12 */
	       printf("F12 key pushed\n");
	    }
	  else
	    printf("not an extended key\n");
	
	  }
	}
