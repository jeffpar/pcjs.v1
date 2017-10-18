---
layout: page
title: "Q30785: MASM 5.10 MIXED.DOC: Macros Supported in MIXED.INC"
permalink: /pubs/pc/reference/microsoft/kb/Q30785/
---

## Q30785: MASM 5.10 MIXED.DOC: Macros Supported in MIXED.INC

	Article: Q30785
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 17-JUN-1988
	
	The following information is from the Microsoft Macro Assembler
	Version 5.10 MIXED.DOC file.
	
	Converting Mixed-Language Source Files
	   The version of MIXED.INC provided with MASM 5.10 is smaller than the
	MASM 5.00 version because most of the functionality has now been built
	into MASM and the macros are no longer needed. The following macros
	are still supported in MIXED.INC:
	
	   Macro   Purpose
	
	   ifFP    Assembles statement if the memory model uses far data
	
	   FP      Provides ES override if the memory model uses far data
	
	   pLes    Loads data (through ES for far data)
	
	   pLds    Loads data (through DS for far data)
	
	   To use these macros with MASM 5.10, you should include MIXED.INC
	after using .MODEL. The macro syntax is shown below:
	
	ifFP  statement
	   Assembles the statement if the memory model uses far data. This
	macro can be used to push segment registers or take other action that
	is only required for far data. For example,
	
	   ifFP     push  ds
	
	pushes the DS register in compact, large, and huge memory models, but
	has no effect in small and medium models.
	
	FPoperand
	   Gives an ES override if the memory model uses far data. In models
	that use near data, FP is null. For example,
	
	   mov      ax,FP[bx]
	
	assembles as
	
	   mov      ax,es:[bx]
	
	in compact, large, and huge memory models, but as
	
	   mov      ax,[bx]
	
	in small and medium models.
	
	pLes  register,address
	pLds  register,address
	   Loads a pointer from the specified address to the specified
	register. If the memory model uses far data, the segment portion of
	the address will be moved into ES or DS, depending on the macro used.
	For example,
	
	   pLes    bx,arg1
	
	is assembled as
	
	   les     bx,arg1
	
	in compact, large, and huge memory models, but as
	
	   mov     bx,arg1
	
	in small and medium models.
