---
layout: page
title: "Q52122: Calling a User-Written Function from an ISR"
permalink: /pubs/pc/reference/microsoft/kb/Q52122/
---

	Article: Q52122
	Product: Microsoft C
	Version(s): 5.10
	Operating System: MS-DOS
	Flags: ENDUSER | s_quickc
	Last Modified: 15-JAN-1990
	
	It is possible to call a user-written function from an Interrupt
	Service Routine (ISR). However, there a few caveats, as shown below:
	
	1. Do not make any calls to stack checking routines.
	
	2. Do not assume DS=SS.
	
	There are other considerations that must be taken into account, such
	as which stack a program is running on, availability of space on the
	stack, etc. Because of these restrictions, there is a limit as to
	which C run-time functions can be used.
	
	Recommended reading for ISR programming is the "Microsoft Systems
	Journal," September 1988, Volume 3, Number 5. This issue of the MS
	Systems Journal contains an article for writing TSR (terminate and
	stay resident) programs with Microsoft C and covers such issues as
	stack considerations and program size. Also, see the Microsoft "MS-DOS
	Encyclopedia," Article 11, for more information.
	
	The following code provides a demonstration of an ISR calling a
	user-written function. The code revectors the keyboard interrupt (INT
	9H) and then waits for a hotkey to be pressed. If the hotkey is
	pressed, a message is displayed. Because of the above restrictions,
	the printf() family cannot be used. Therefore, a user-written
	function must be called to write the string.
	
	Note: The sample program does not go TSR because this would complicate
	the code. If the you want to modify it for TSR usage, please read the
	above articles.
	
	Sample Code
	-----------
	
	/* Compile with /Gs /Au */
	
	#include <dos.h>
	#include <bios.h>
	
	union REGS inregs, outregs;
	
	void (interrupt far *oldint9)();
	
	/* HOTKEY is CTRL+W */
	
	#define HOTKEY_CODE 0x11
	#define HOTKEY_STAT 0x4
	#define KEYPORT 0x60
	
	#define DOS_INT 0x21
	#define KEYSVC_INT 0x9
	#define DOS_PRINTSTRING 0x9
	
	void dos_puts( char *msg);
	void interrupt far newint9(void);
	
	void dos_puts( char *msg )
	{
	
	   (void) _bios_keybrd( _KEYBRD_READ );
	
	   inregs.h.ah = DOS_PRINTSTRING; /* DOS INT 21 Function 9h is    */
	                                  /*    Display String            */
	
	   inregs.x.dx = (int)msg; /* inregs.x.dx gets the segment        */
	                           /* value of string to be output to crt */
	
	   intdos( &inregs, &outregs );   /* INT 21 call to output string */
	}
	
	void interrupt far newint9(void)
	{
	   static unsigned char keycode;
	   static char active = 0;
	
	   if (active)
	      _chain_intr(oldint9);
	
	   keycode = inp(KEYPORT);        /* Check for key at keyboard    */
	
	   if (keycode != HOTKEY_CODE )   /* If key isn't HOTKEY,         */
	      _chain_intr(oldint9);       /* pass to old handler          */
	
	   if ( _bios_keybrd(_KEYBRD_SHIFTSTATUS) & HOTKEY_STAT )
	   {
	      active = 1;
	      (*oldint9)();
	      dos_puts("HOTKEY was pressed\r\n$");
	      active = 0;
	   }
	   else
	      _chain_intr(oldint9);
	}
	
	void main(void)
	{
	   long x;
	                                  /* Save old keyboard ISR */
	   oldint9 = _dos_getvect( KEYSVC_INT );
	                                  /* Set new keyboard ISR */
	   _dos_setvect( KEYSVC_INT, newint9 );
	                                  /* Loop awhile to let program run */
	   for(x=0L; x <= 200000L; x++)
	                                  /* Restore old ISR and exit */
	      _dos_setvect( KEYSVC_INT, oldint9 );
	}
