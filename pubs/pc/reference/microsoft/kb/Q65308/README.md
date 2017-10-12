---
layout: page
title: "Q65308: Default Optimization Generates Bad Code in Switch Construct"
permalink: /pubs/pc/reference/microsoft/kb/Q65308/
---

	Article: Q65308
	Product: Microsoft C
	Version(s): 6.00
	Operating System: MS-DOS
	Flags: ENDUSER | buglist6.00
	Last Modified: 24-OCT-1990
	
	The following sample code is compiled incorrectly when the default
	optimizations are used. When compiled with /Ot, /On, /Oc, or the
	default options (/Ocnt), the program fails to recognize certain keys
	as "default" (function keys and the top row of number keys 1, 2, 3,
	etc.). When compiled without the offending optimizations, all keys are
	recognized.
	
	The workaround is to use the optimize pragma, as follows:
	
	   #pragma optimize("tn","off")
	
	Or, use the quick compile option /qc.
	
	Sample Code
	-----------
	
	#include <stdio.h>
	#include <bios.h>
	#include <stdlib.h>
	
	#define ESC   0x1b
	#define HT    0x09
	#define S_TAB 0x0f
	#define RT    0x4d
	#define BS    0x08
	#define CR    0x0d
	
	void main(void)
	{
	   unsigned c;
	
	   printf("\n");
	   while (1)
	   {
	      c = _bios_keybrd(_KEYBRD_READ);
	
	      if (! (c&0xff))
	         c >>= 8;
	      else
	         c &= 0xff;
	      switch (c)
	      {
	         case ESC:
	            printf("ESCAPE\n");
	            exit(0);
	         case HT:
	            printf("HT\n");
	            break;
	         case S_TAB:
	            printf("SHIFTED TAB\n");
	            break;
	         case RT:
	            printf("RIGHT ARROW\n");
	            break;
	         case BS:
	            printf("BACK SPACE\n");
	            break;
	         case CR:
	            printf("CARRIAGE RETURN\n");
	            break;
	         default:
	            printf("DEFAULT\n");
	            break;
	      }
	   }
	}
	Microsoft has confirmed this to be a problem in C version 6.00. We are
	researching this problem and will post new information here as it
	becomes available.
