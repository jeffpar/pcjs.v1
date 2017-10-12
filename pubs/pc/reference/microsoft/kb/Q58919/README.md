---
layout: page
title: "Q58919: How to Change the DOS Memory Allocation Strategy"
permalink: /pubs/pc/reference/microsoft/kb/Q58919/
---

	Article: Q58919
	Product: Microsoft C
	Version(s): 3.x 4.x 5.00 5.10
	Operating System: MS-DOS
	Flags: ENDUSER | s_c s_quickc s_quickasm h_masm o_msdos 1.00 1.01
	Last Modified: 23-FEB-1990
	
	When DOS allocates memory for your program, it uses a firstfit
	allocation strategy by default. You can change DOS's default strategy
	to a bestfit, lastfit, or back to firstfit with a call to interrupt 21h
	function 58h.
	
	A firstfit strategy forces DOS to search from low addresses in memory
	to high addresses, and allocate the first available block of memory
	large enough for the requested allocation.
	
	A bestfit strategy forces DOS to search all addresses in memory and
	allocate the smallest block still large enough to fill the requested
	allocation.
	
	A lastfit strategy forces DOS to search from high addresses in memory
	to low addresses, and allocate the first available block of memory
	large enough for the requested allocation.
	
	The bestfit algorithm is the slowest to execute since all free memory
	is searched, but results in the least memory fragmentation during
	multiple allocations and frees. Conversely, the firstfit and lastfit
	strategies are fastest to execute, but result in a higher degree of
	memory fragmentation.
	
	Note that changing the allocation strategy only noticeably changes the
	way that a call to _dos_allocmem, halloc, or interrupt 21h function
	48h allocates memory from DOS. The malloc and calloc families of
	routines allocate memory from the memory pool assigned to your program
	by DOS. They are affected by DOS's internal allocation strategy only
	when the free memory pool for your program is empty and DOS is
	required to add new memory to your program's pool.
	
	Code Samples
	------------
	
	The following two functions, written with QuickC 2.00's in-line
	assembly, respectively set and get the DOS allocation strategy:
	#define ALLOCATION_STRATEGY 0x58
	#define GET_STRATEGY        0x00
	#define SET_STRATEGY        0x01
	
	/********************************************************/
	/* Set_fittype - Set DOS allocation strategy            */
	/* Parameters : strategy_type, defined as:              */
	/*          FIRSTFIT = 0x00                             */
	/*          DEFAULT  = 0x00                             */
	/*          BESTFIT  = 0x01                             */
	/*          LASTFIT  = 0x02                             */
	/* Return Value :                                       */
	/*          -2 = Invalid Allocation strategy            */
	/*          -1 = Invalid Function to Int 21h Func 58h   */
	/*               Should never happen.                   */
	/*           Otherwise, returns newly set strategy      */
	/********************************************************/
	
	int set_fittype ( unsigned strategy_type )
	{
	    int return_value;
	
	    if (( strategy_type < 0 ) || ( strategy_type > 2))
	    {
	        return ( -2 ) ;
	    }
	    else
	    {
	        _asm {
	                mov     ah, ALLOCATION_STRATEGY
	                mov     al, SET_STRATEGY
	                mov     bx, strategy_type
	                int     21h
	
	                jnc     no_error            ; Branch if no error
	                mov     ax, -1              ; Return -1 on error
	
	           no_error:
	                mov     return_value, ax    ; -1 if error, otherwise
	                                            ; returns current strategy
	            }
	    }
	    return ( return_value ) ;
	}
	
	/********************************************************/
	/* Get_fittype - Returns current allocation strategy.   */
	/* Parameters : None                                    */
	/* Return Value :                                       */
	/*           0 = Firstfit strategy                      */
	/*           1 = Bestfit strategy                       */
	/*           2 = Lastfit strategy                       */
	/********************************************************/
	
	int get_fittype ( void )
	{
	    unsigned return_value;
	
	    _asm {
	             mov     ah, ALLOCATION_STRATEGY
	             mov     al, GET_STRATEGY
	             int     21h
	
	             jnc     no_error            ; Branch if no error
	             mov     ax, -1              ; Return -1 on error
	
	         no_error:
	             mov     return_value, ax    ; -1 on error, otherwise
	
	                 }
	
	        return ( return_value ) ;
	}
	
	If your compiler supports in-line assembly, you should use the above
	functions because of their speed since they do not require the C
	overhead.
	
	If you are using any of our compilers that do not support in-line
	assembly code, such as C 5.00, C 5.10, QuickC 1.00, and QuickC 1.01,
	the above functions can be translated as follows:
	
	#include <dos.h>  /* as well as the other #includes listed above */
	
	int set_fittype ( unsigned strategy_type )
	{
	    union REGS inregs, outregs;
	        int return_value;
	
	        if (( strategy_type < 0 ) || ( strategy_type > 2))
	        {
	                return ( -2 ) ;
	        }
	        else
	        {
	        inregs.h.ah = ALLOCATION_STRATEGY ;
	        inregs.h.al = SET_STRATEGY ;
	        inregs.x.bx = strategy_type ;
	        int86 ( 0x21, &inregs, &outregs ) ;
	
	        if ( outregs.x.cflag )
	            return ( -1 ) ;
	        else
	            return ( outregs.x.ax ) ;
	        }
	}
	
	int get_fittype ( void )
	{
	    union REGS inregs, outregs;
	    unsigned return_value;
	
	    inregs.h.ah = ALLOCATION_STRATEGY
	    inregs.h.al = GET_STRATEGY
	
	    int86 ( 0x21, &inregs, &outregs ) ;
	
	    if ( outregs.x.cflag )
	        return ( -1 ) ;
	    else
	        return ( outregs.x.ax ) ;
	
	}
