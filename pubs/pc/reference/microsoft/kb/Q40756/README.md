---
layout: page
title: "Q40756: Bad Code for Expression Parameter of outp() with -Oi"
permalink: /pubs/pc/reference/microsoft/kb/Q40756/
---

## Q40756: Bad Code for Expression Parameter of outp() with -Oi

	Article: Q40756
	Version(s): 5.10
	Operating System: MS-DOS
	Flags: ENDUSER | SR# G881205-7390
	Last Modified: 15-JAN-1990
	
	When compiling the source line below, the Microsoft C Compiler Version
	5.10 generates incorrect code in some cases for the intrinsic outp and
	outpw functions when the -Oi option is used and the second parameter
	is an expression. Workarounds are listed below.
	
	The following is the C source line and the generated code:
	
	        outp(port + INT_ENABLE_OFF, (i == SIO_CNT) ? 3 : 1);
	
	            cmp    WORD PTR [bp-6], 8                     ;i
	            je    $L20003                                 ;error !
	            mov   ax, 3
	            jmp   SHORT $L20004
	$L20003:
	            mov   ax, 1
	$L20004:
	            push  ax
	            mov   ax,   WORD PTR [bp-4]                   ;port
	            inc   ax
	            push  ax
	            call  FAR PTR _outp
	
	This assembly code would be equal to a source line such as the
	following:
	
	   outp(port + IN_ENABLE_OFF, (i == SIO_CNT) ? 1 : 3);
	
	This is the exact reverse of the original source line. Therefore, the
	generated assembler code should read as follows:
	
	            cmp    WORD PTR [bp-6], 8                     ;i
	            jne    $L20003                                ;
	            mov   ax, 3
	            jmp   SHORT $L20004
	$L20003:
	            mov   ax, 1
	$L20004:
	            push  ax
	            mov   ax,   WORD PTR [bp-4]                   ;port
	            inc   ax
	            push  ax
	            call  FAR PTR _outp
	
	There are two workarounds:
	
	1. Use a temporary variable -- for example:
	
	       x = (i == SIO_CNT) ? 1 : 3;
	       outp(port + stuff, x);
	
	2. Don't use -Oi.
	
	3. Use -Oi, but use the "#pragma function(outp outpw)" statement to
	   have the non-intrinsic version of the function used.
