---
layout: page
title: "Q49631: /Zr Switch Causes Incorrect Code Generation"
permalink: /pubs/pc/reference/microsoft/kb/Q49631/
---

## Q49631: /Zr Switch Causes Incorrect Code Generation

	Article: Q49631
	Version(s): 2.00 2.01
	Operating System: MS-DOS
	Flags: ENDUSER | S_C buglist2.00 buglist2.01 S_QuickASM
	Last Modified: 6-NOV-1989
	
	When the /Zr switch is used to generate pointer checking instructions
	for Quick C, the generated code can cause problems with long
	arithmetic.
	
	The following example shows that the code generated with the /Zr
	switch can cause incorrect results:
	
	#include <stdio.h>
	#include <malloc.h>
	
	void main (void)
	{
	  long *lp;
	  lp = (long *)malloc(sizeof(long));
	  *lp = 65530L;
	  *lp += 65530L;
	  if( *lp != (65530L + 65530L) )
	  {
	        printf("*lp not added correctly\n");
	        exit(1);
	  }
	  else
	  {
	        printf("*lp added correctly\n");
	        exit(0);
	  }
	}
	
	When compiled without the /Zr switch, the code generated for the line
	"*lp += 65530;" is as follows:
	
	    MOV     BX, WORD PTR [lp]
	    ADD     WORD PTR [BX], -06  ; 65530
	    ADC     WORD PTR [BX+02],+00
	
	When compiled with the /Zr switch, the code generated is as follows:
	
	    MOV     BX, WORD PTR [lp]
	
	    AND     BX, BX              ; Code inserted by /Zr
	    JNZ     _main+3c (005C)     ;   "      "     "   "
	    CALL    0010                ;   "      "     "   "
	
	    ADD     WORD PTR [BX], -06  ; 65530
	
	    AND     BX, BX              ; Code inserted by /Zr
	    JNZ     _main+46 (0066)     ;   "      "     "   "
	    CALL    0010                ;   "      "     "   "
	
	    ADC     WORD PTR [BX+02],+00
	
	The problem with the inserted code is that the AND instruction sets
	the carry flag to 0 (zero). Therefore, prior to the ADC instruction,
	which adds in the initial state of the carry flag, the carry flag is
	set back to zero producing the incorrect results.
	
	Microsoft has confirmed this to be a problem with with QuickC Version
	2.00 and 2.10. We are researching this problem and will post new
	information as it becomes available.
