---
layout: page
title: "Q67760: Bad Object File Generated with MASM 5.10"
permalink: /pubs/pc/reference/microsoft/kb/Q67760/
---

## Q67760: Bad Object File Generated with MASM 5.10

	Article: Q67760
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | buglist5.10
	Last Modified: 6-FEB-1991
	
	The following mixed-language program does not assemble properly under
	MASM version 5.10. The assembler doesn't generate the correct .OBJ
	record for the linker to resolve the reference properly. When the
	.EXE is built, the _foo variable is located in the NULL segment
	instead of the _DATA segment. Therefore, instead of the residing 1
	byte apart, they are actually 42h bytes apart.
	
	Removing the ASSUME statements from the assembly code eliminates the
	problem. These ASSUME statements are not necessary.
	
	Microsoft has confirmed this to be a problem in MASM version 5.10. We
	are researching this problem and will post new information here as it
	becomes available.
	
	Sample Code
	-----------
	
	  dosseg
	  .model small
	
	  .data
	  assume ds: nothing
	  public _foo
	_foo db 1
	  assume ds: @data
	  public _bar
	_bar db 2
	
	  .code
	  public _func
	_func proc
	  mov ax, offset _bar
	  sub ax, offset _foo
	  ret
	_func endp
	
	  end
	
	#include <stdio.h>
	extern char foo;
	extern char bar;
	
	main ()
	{
	  printf ("C distance of bar - foo = %X\n", &bar - &foo);
	  printf ("MASM distance of bar - foo = %X\n", func ());
	}
