---
layout: page
title: "Q46206: Internal Compiler Error: ctypes.c Line 474"
permalink: /pubs/pc/reference/microsoft/kb/Q46206/
---

	Article: Q46206
	Product: Microsoft C
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 18-SEP-1989
	
	The program below, when compiled with /Oi, will generate the following
	error:
	
	   program.c(27) : fatal error C1001: Internal Compiler Error
	                   (compiler file '@(#)ctypes,c:1.107', line 474
	                   Contact Microsoft Technical Support
	
	The program has only one line of executable code, which is a memcpy
	statement. If the program is recompiled at warning level 3, it becomes
	obvious that the header file <memory.h> has not been included. If the
	proper header file is included, the program will not compile, giving
	the following two errors:
	
	   Error C2172 : 'memcpy' : actual is not a pointer : parameter 1
	   Error C2172 : 'memcpy' : actual is not a pointer : parameter 2
	
	The program is in error. Instead of trying to pass structures to
	memcpy, it should pass a pointers to structure. To solve the problem,
	correct the program to pass pointers to structure.
	
	Program Sample
	--------------
	
	#include <stdio.h>
	
	struct r_buff
	{
	   union
	      {
	      unsigned char far *in_offset;
	      struct
	         {
	         unsigned char *index;
	         unsigned char *segment;
	         } in_s;
	      } in_u;
	   unsigned char *out_index;
	   unsigned char *lim;
	   unsigned char *first;
	   int loww;
	   int hiw;
	   unsigned char stat;
	   char reserved[5];
	} read_b;
	
	struct r_buff old_read_b;
	
	void main(void)
	{
	  memcpy(old_read_b, read_b, sizeof(old_read_b));
	  /* This code is incorrect.  Instead use:
	      memcpy(&old_read_b, &read_b, sizeof(old_read_b));
	  */
	}
