---
layout: page
title: "Q32216: Two Ways to Pass Arrays in Compiled BASIC to Assembler Routine"
permalink: /pubs/pc/reference/microsoft/kb/Q32216/
---

## Q32216: Two Ways to Pass Arrays in Compiled BASIC to Assembler Routine

	Article: Q32216
	Version(s): 6.00 6.00b 7.00 7.10 | 6.00 6.00b 7.00 7.10
	Operating System: MS-DOS               | OS/2
	Flags: ENDUSER | B_QuickBas
	Last Modified: 8-AUG-1990
	
	An array in a compiled BASIC program can be passed to an assembly
	language program in the two ways shown below. The array can be passed
	either through the CALL statement's parameter list or, for static
	arrays only, through a COMMON block.
	
	Microsoft does not support passing dynamic arrays through COMMON to
	assembler (since this depends upon a Microsoft proprietary dynamic
	array descriptor format that changes from version to version). Dynamic
	arrays can be passed to assembler only as parameters in the CALL
	statement.
	
	This information applies to the following products:
	
	1. Microsoft QuickBASIC Compiler versions 4.00, 4.00b, and 4.50
	
	2. Microsoft BASIC Compiler versions 6.00 and 6.00b for MS-DOS and
	   MS OS/2
	
	3. Microsoft BASIC Professional Development System (PDS) versions 7.00
	   and 7.10 for MS-DOS and MS OS/2
	
	For more information about passing other types of parameters between
	BASIC and MASM, search in the Software/Data Library for the following
	word:
	
	   BAS2MASM
	
	The following information pertains to passing an array to an assembly
	routine through the CALL parameter list:
	
	If the array is passed through the parameter list, all the information
	about the array must be passed. This includes the length of each item,
	the number of items, and the segment and offset of the base element of
	the array. The first two items may be hardcoded into the assembler
	program, but the latter two must be passed because there is no way of
	knowing where the array will be located before the program starts. The
	following is an example:
	
	   DECLARE SUB PutInfo (BYVAL Segment%, BYVAL Offset%)
	   DIM a%(100)
	   CALL PutInfo(VARSEG(a%(0)),VARPTR(a%(0)))
	
	The assembly-language program pulls the information off the stack,
	then continues with its purpose. Please note that this method works
	with both static and dynamic arrays.
	
	The following information pertains to passing an array to an assembly
	language routine through a COMMON block:
	
	Passing information through a COMMON block to an assembly language
	program is fairly simple. In the assembly language program, a segment
	is set up with the same name as the COMMON block and then grouped with
	DGROUP, as follows:
	
	   BNAME segment 'BC_VARS'
	     x  dw 1 dup (?)
	     y  dw 1 dup (?)
	     z  dw 1 dup (?)
	   BNAME ends
	
	  dgroup group BNAME
	
	The above assembler code matches the following BASIC code named COMMON
	block:
	
	   DEFINT A-Z
	   COMMON /BNAME/ x,y,z
	
	Passing arrays through the COMMON block is done in a similar fashion.
	However, only static arrays may be passed to assembler through COMMON.
	
	Note: This information does not apply to passing far
	variable-length-strings in BASIC PDS version 7.00 or 7.10. For
	information on accessing far variable-length-strings in BASIC PDS
	version 7.00 or 7.10, see Chapter 13, "Mixed-Language Programming with
	Far Strings," in the "Microsoft BASIC 7.0: Programmer's Guide" for
	versions 7.00 and 7.10.
	
	When static arrays are used, the entire array is stored in the COMMON
	block. Consider the following example:
	
	BASIC Program
	-------------
	
	      DECLARE SUB PutInfo ()
	      DIM b%(100)
	      COMMON /BNAME/ a%, b%(), c%
	      CALL PutInfo
	      CLS
	      PRINT a%, c%
	      FOR i = 0 TO 100
	       PRINT b%(i);
	      NEXT i
	      END
	
	Assembly Program
	-----------------
	
	      ;Note, this program uses MASM version 5.x directives.
	
	      .model Medium
	
	       BNAME segment COMMON 'BC_VARS'
	         a  dw 1 dup (?)
	         b  db 202 dup (?)      ;Note that all the space for the
	                                ;array is set up
	         c  dw 1 dup (?)
	       BNAME ends
	
	       dgroup group BNAME
	
	       .code
	
	            public PutInfo
	       PutInfo      proc   far
	            push   bp
	            mov    bp,sp
	            push   di
	
	            inc    word ptr dgroup:a
	            inc    word ptr dgroup:c
	
	            mov    cx,101
	            mov    di,offset dgroup:b
	
	       repeat:
	            mov    [di],cx
	            add    di,2
	            loop   repeat
	
	            pop    di
	            pop    bp
	            ret
	       PutInfo      endp
	            end
	
	As noted in the assembly source, the space for the array must be set up
	in the COMMON segment.
	
	When dynamic arrays are used, the array is not placed in the COMMON
	block. Instead, a multibyte array descriptor is placed on the COMMON
	block. The dynamic array descriptor changes from version to version,
	and is not released by Microsoft -- it is considered Microsoft
	proprietary information.
