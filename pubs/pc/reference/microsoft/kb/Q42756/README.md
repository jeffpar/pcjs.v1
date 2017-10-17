---
layout: page
title: "Q42756: Not Including MALLOC.H in Compact, Large Model Causes Problems"
permalink: /pubs/pc/reference/microsoft/kb/Q42756/
---

## Q42756: Not Including MALLOC.H in Compact, Large Model Causes Problems

	Article: Q42756
	Version(s): 5.00 5.10 | 5.10
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER | S_QuickC
	Last Modified: 30-MAY-1989
	
	It is vital in the compact- and large-memory models that the malloc()
	function be prototyped as returning a four-byte type (preferably a far
	pointer, of course). The proper method in Microsoft C is to include
	the header file MALLOC.H. This prototypes malloc() as returning a void
	pointer.
	
	The default data-pointer size in the compact and large models is 32
	bits. The default return type of any function, including malloc, when
	it is not prototyped is a 16-bit short integer. Thus, the segment
	portion of a far address will be destroyed unless the compiler knows
	it is dealing with a 32-bit type.
	
	If you attempt to use the Unix style of including MEMORY.H rather than
	MALLOC.H, you will encounter problems at run time. MEMORY.H does not
	prototype any of the memory allocation functions; it only prototypes
	memory copy and move functions. In a segmented architecture that can
	have data and code pointers of different sizes, this may have serious
	ramifications. In the case of a large- or compact-model program such
	as the following, the call to malloc() will produce the following code
	fragment:
	
	    #include <memory.h>
	    main()
	    {
	        char    *addr;
	        size_t  nbytes = 100;
	
	        addr = (char *) malloc( nbytes );
	    }
	
	The call to malloc() produces the following code fragment:
	
	            push    Word Ptr [nbytes]
	            call    _malloc
	            add     sp, +02
	            cwd
	            mov     Word Ptr [addr], AX
	            mov     Word Ptr [bp-06], DX
	
	If MALLOC.H had been included, then the CWD (Convert Word to Double)
	instruction would not be present. CWD sign extends the AX register
	into the DX register in an attempt to convert the 16-bit integer in AX
	to a 32-bit data pointer. This trashes the segment returned by
	malloc() in DX. The resultant pointer will typically point to segment
	0x0000, meaning that in DOS the interrupt table will be trashed and in
	OS/2 the program will GP fault when an assignment is made to the
	allocated memory.
	
	Note: The compiler will also produce data conversion warnings at
	warning level 1 or higher when such a program is compiled. Paying
	attention to these warnings generally eliminates problems in
	converting C programs from other systems.
