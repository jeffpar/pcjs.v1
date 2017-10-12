---
layout: page
title: "Q59884: Determining If Your TSR Has Already Been Installed"
permalink: /pubs/pc/reference/microsoft/kb/Q59884/
---

	Article: Q59884
	Product: Microsoft C
	Version(s): 4.00 5.00 5.10
	Operating System: MS-DOS
	Flags: ENDUSER | s_quickc s_quickasm appnote
	Last Modified: 23-MAR-1990
	
	When writing a TSR (terminate-and-stay-resident), it is possible to
	utilize the multiplex interrupt (2fh) to determine whether your TSR
	has already been loaded into memory. Set up an Interrupt Service
	Routine (ISR) for this interrupt, which will compare the AH register
	with a predefined TSR number (ID#) and change the AL register to a
	nonzero value if the two are equal.
	
	When using the interrupt keyword in Microsoft C, registers are pushed
	onto the stack before each function call. To access these register
	values from within an ISR, just define the ISR function as accepting
	these registers as parameters.
	
	Once this is set up, the installation part of the TSR can make a call
	to the multiplex interrupt with the AH register set to the ID# of the
	TSR, and the AL register set to 00h. If the handler is currently
	installed, it will pick up these values in the AX register and then
	change the AL register to 01h and return this "installed" signal to
	the calling program. If the ID# in the AL register is not that of the
	TSR, the TSR can simply chain the interrupt back to its original
	vector.
	
	In summary, to have your TSR check to see if it is already installed,
	do the following:
	
	1. Make an int86 call with the following:
	
	      inregs.h.ah=id#(0xc0-0xff)
	      inregs.h.al=0x00
	
	2. If outregs.h.al != 0x00, program is in memory, don't re-install.
	
	3. Else, revector INT2fh to your own ISR. This ISR should do the
	   following:
	
	   a. Take as parameters the registers pushed on the stack by the
	      interrupt keyword (see REGPAK below).
	
	   b. Check the AH register, hibyte of the AX register, with a TSR
	      ID#(0xc0-0xff).
	
	   c. If AH=TSR ID#, change al to 0x01.
	
	   d. Else, chain to the old INT2fh vector.
	
	4. Terminate and stay resident.
	
	The following is a simple example of an ISR that would accomplish Step
	3 (above) nicely with a TSR ID# of 0xc9. For more information about
	the multiplex interrupt and its function, please refer to "The New
	Peter Norton Programmer's Guide to The IBM PC & PS/2," Page 303-306.
	For an example of a TSR, see the application note "TSR Example
	Dirzap.C," which is available from Microsoft Product Support Services
	by calling (206) 454-2030.
	
	Sample Program
	--------------
	
	void (interrupt far *original_int2fh)(); /*set to original*/
	                                         /* int2fh handler*/
	
	#define HIBYTE(x) (((unsigned) (x) >> 8) & 0xff)
	
	#define REGPAK unsigned es, unsigned ds, unsigned di, \
	               unsigned si, unsigned bp, unsigned sp, \
	               unsigned bx, unsigned dx, unsigned cx, \
	               unsigned ax, unsigned ip, unsigned cs, \
	               unsigned flags
	
	void interrupt far new_int2fh(REGPAK)
	{
	     if (HIBYTE(ax)==0xc9) /* check TSR ID# */
	          ax=0xc901;       /* set AL to 01  */
	     else
	          _chain_intr(original_int2fh);
	}
