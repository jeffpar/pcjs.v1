---
layout: page
title: "Q41532: FRE(-1), FRE(&quot;) Both Reduced by Run-Time String Allocation"
permalink: /pubs/pc/reference/microsoft/kb/Q41532/
---

## Q41532: FRE(-1), FRE(&quot;) Both Reduced by Run-Time String Allocation

	Article: Q41532
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom SR# S890210-64
	Last Modified: 29-JAN-1991
	
	Any allocation of variable-length strings (or data in the default data
	segment, DGROUP) that is done at run time reduces the values returned
	by both the FRE("") and FRE(-1) functions by an equal amount.
	
	This behavior occurs because the area that is unused by the default
	data segment (64K maximum) can potentially be consumed by the far heap
	and vice versa. In other words, the following is true:
	
	1. Run-time allocation of data in the default data segment (64K
	   maximum) always reduces the space free for the far heap by an
	   equal amount.
	
	2. Allocation of far heap (which is always done at run time with
	   non-variable-length-string arrays only) reduces the memory
	   available for the default data segment if all other memory has
	   already been consumed.
	
	This information applies to Microsoft QuickBASIC versions 4.00, 4.00b,
	and 4.50, and to Microsoft BASIC Compiler versions 6.00 and 6.00b for
	MS-DOS and MS OS/2.
	
	This information also applies to Microsoft BASIC Professional
	Development System (PDS) versions 7.00 and 7.10 for MS-DOS and MS OS/2
	when using near strings. The meaning of the information returned by
	the FRE function when using far strings in BASIC PDS 7.00/7.10 is
	slightly different, and is documented in the "Microsoft BASIC 7.0:
	Language Reference" manual on pages 140-141. Note that the QBX.EXE
	environment of BASIC PDS 7.00/7.10 always uses and requires far
	strings. You can print the value of the STACK function to find
	available DGROUP space when using far strings.
	
	Unused memory can be consumed at run time by either the default data
	segment (DGROUP) (64K maximum), or by the far heap (640K maximum minus
	DOS, minus code, minus previously allocated data), as shown in the
	three examples below. The boundary between the default data segment
	and the far heap is dynamically variable at run time.
	
	Example 1
	---------
	
	In the following program, an array in the far heap consumes all except
	2K or less of available memory, leaving less than 2K free for the
	default data segment:
	
	   ' Compile this with QB or BC with the /AH option
	   ' for supporting huge (larger than 64K) arrays:
	   OPTION BASE 1
	   x = FRE(-1)
	   PRINT FRE("")  ' Default data space free starts around 48K.
	   DIM y(1023, x / (4 * 1024))  ' Dynamically allocate all but < 2K.
	   PRINT FRE("")  ' Default data space free ends at less than 2K.
	
	FRE("") reports the size, in bytes, of the memory available for the
	storage of variable-length (dynamic) strings at run time. FRE(-1)
	reports the size, in bytes, of the memory available for the largest
	dynamic non-variable-length-string array that can be dimensioned.
	
	Example 2
	---------
	
	The following is another example showing that any variable-length
	string allocated at run time reduces both FRE("") and FRE(-1) by an
	equal amount:
	
	CLS
	far = FRE(-1)
	near = FRE("")
	a$ = STRING$(1000, 34)   ' Initializes a 1000-byte string.
	PRINT "far heap difference=",far - FRE(-1)
	PRINT "default data difference=",near - FRE("")
	PRINT : PRINT "Now allocate some more default data space..."
	far = FRE(-1)
	near = FRE("")
	REM $DYNAMIC
	DIM b$(250)   ' Dynamically allocates variable-length string array.
	PRINT "far heap difference=",far - FRE(-1)
	PRINT "default data difference=",near - FRE("")
	
	Example 3
	---------
	
	The following code produces a $STATIC array of variable-length
	strings, which allocates memory for the string descriptors in the
	default data segment at compile time (NOT at run time):
	
	   PRINT FRE(-1)
	   PRINT FRE("")
	   DIM a$(200)
	   PRINT FRE(-1)  ' Unchanged free far heap.
	   PRINT FRE("")  ' Unchanged free default data space.
	
	Each array element has a string descriptor that takes 4 bytes (2 bytes
	for length plus 2 bytes for string pointer). In a $STATIC array, these
	descriptors are allocated at compile time.
	
	(Note: Assigning variable-length string array elements to string
	values is done only at run time for both $STATIC and $DYNAMIC arrays,
	which consumes default data space at run time. The FRE function
	displays the changing free memory values at run time.)
	
	If a $DYNAMIC metacommand is placed before this block of code, the
	array of string descriptors is allocated at run time, which reduces
	the space available in the data segment and the far heap at run time.
	The values returned by FRE(-1) and FRE("") are reduced by an equal
	amount. Results from running the above code with and without a
	$DYNAMIC declaration are listed below for both the QuickBASIC
	environment and compiled EXEs:
	
	   In QB.EXE with $DYNAMIC        In QB.EXE Without $DYNAMIC
	   -----------------------        --------------------------
	
	   Prior:         Heap = 245070   Prior:         Heap = 244246
	   Prior: String space = 47694    Prior: String space = 46870
	   After:         Heap = 244258   After:         Heap = 244246
	   After: String space = 46882    After: String space = 46870
	
	   Compiled EXE with $DYNAMIC     Compiled EXE Without $DYNAMIC
	   --------------------------     -----------------------------
	
	   Prior:         Heap = 444120   Prior:         Heap = 443368
	   Prior: String space = 59144    Prior: String space = 58360
	   After:         Heap = 443308   After:         Heap = 443368
	   After: String space = 58332    After: String space = 58360
