---
layout: page
title: "Q58098: Calling Overlaid Functions Through Pointers Not Supported"
permalink: /pubs/pc/reference/microsoft/kb/Q58098/
---

## Q58098: Calling Overlaid Functions Through Pointers Not Supported

	Article: Q58098
	Version(s): 1.x 2.x 3.x 4.06 4.07 5.01.21 5.02 5.03
	Operating System: MS-DOS
	Flags: ENDUSER | S_C S_QuickC
	Last Modified: 30-JAN-1990
	
	LINK does not support using function pointers for calling functions in
	overlays unless the function is being called from within the same
	overlay. If an overlaid function is being called from the root or from
	a different overlay, then the call must not be made through a pointer.
	
	LINK cannot support calling overlaid functions indirectly through
	pointers because the address of the indirect function is determined at
	load time.
	
	In a program with overlays, a normal function call (that is, not a
	call through a pointer) is recognized by the linker and an interrupt
	call is placed into the .EXE in place of the function call. When the
	function is called at run time, the interrupt directs control to the
	overlay manager. The overlay manager checks whether the right overlay
	is loaded into memory, loads it if necessary, and calls the function.
	Because there is a fixup record in the .OBJ for the function call, the
	linker can set everything up correctly.
	
	On the other hand, with a function pointer, the compiler creates a
	fixup record for the address that the pointer references. However,
	there is no indication in the fixup record that this address is for a
	function. Therefore, if you link the function in as an overlay, the
	linker does not insert a call to the overlay manager and instead does
	a standard fixup.
	
	As a result, if you indirectly call a function located in a not-as-yet
	loaded overlay, the overlay does not get loaded. Nevertheless, control
	is still transferred to the address at which the function is thought
	to reside, which can only mean disaster for the executing program.
