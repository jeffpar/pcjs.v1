---
layout: page
title: "Q39371: Proc with ARG Directive Requires Language in .MODEL"
permalink: /pubs/pc/reference/microsoft/kb/Q39371/
---

## Q39371: Proc with ARG Directive Requires Language in .MODEL

	Article: Q39371
	Version(s): 5.00   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 12-JAN-1989
	
	The program below, which uses the PROC directive, will not assemble
	correctly unless you use a language parameter with the .MODEL
	directive. The "Microsoft Macro Assembler Programmer's Guide" does not
	say that the language parameter is required when using the PROC
	directive.
	
	The language parameter on the .MODEL directive enables the PROC
	extensions, changes the scope of code labels within procedures, and
	may affect naming. When the language parameter is left off, the PROC
	directive will only accept a NEAR or FAR specifier.
	
	The following is a sample program:
	
	        .model large
	;       .model large, c  ; This line will permit correct assembly.
	        .code
	myadd   proc arg1:ptr, arg2:ptr
	        les bx, arg1
	        les dx, arg2
	        ret
	myadd   endp
	        end
	
	The following errors are generated during assembly:
	
	A2022: Operand must be type specifier
	A2009: Symbol not defined: ARG1
	A2009: Symbol not defined: ARG2
