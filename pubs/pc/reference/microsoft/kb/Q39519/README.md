---
layout: page
title: "Q39519: Using Conditional-Assembly to Assemble for COM or EXE File"
permalink: /pubs/pc/reference/microsoft/kb/Q39519/
---

## Q39519: Using Conditional-Assembly to Assemble for COM or EXE File

	Article: Q39519
	Version(s): 4.00 5.00 5.10
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 12-JAN-1989
	
	By using assembler symbols, macros, and conditional-assembly,
	assembling a file to a COM or EXE file is easy. The following is the
	solution:
	
	ifdef   COM
	ending  macro   text
	        end     start
	endm
	else
	ending  macro   text
	        end
	endm
	endif
	
	_text   segment 'code'
	        assume cs:_text
	start:  mov     ax, 08000h
	        mov     ds, ax
	        ...
	_text   ends
	
	        ending
	
	Use MASM /DCOM /MX foo.asm for assembling into a COM file. Or use
	MASM /MX foo.asm for EXE files.
	
	This example assembles code depending on whether the assembler symbol
	COM is defined or not. COM files must have an entry point so the END
	directive requires a start address; whereas, EXE files do not require
	an entry point.
	
	Under MASM Version 4.00, you can accomplish this with a simple
	conditional-assembly block at the end as follows:
	
	ifdef   com
	        end     start
	endif
	        end
	
	MASM Version 5.10 flags this as an error, which it should according to
	Page 79 of the "Microsoft Macro Assembler 5.1 Programmer's Guide."
	"Any statements following the END directive are ignored by the
	assembler." The error occurs because the endif is not being recognized
	and "Number of open conditionals: 1" error is displayed.
