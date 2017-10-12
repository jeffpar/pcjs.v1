---
layout: page
title: "Q66922: R6012 Caused by Error in strtok() and strpbrk() Example"
permalink: /pubs/pc/reference/microsoft/kb/Q66922/
---

	Article: Q66922
	Product: Microsoft C
	Version(s): 6.00a 6.00 | 6.00a 6.00
	Operating System: MS-DOS     | OS/2
	Flags: ENDUSER | docerr
	Last Modified: 23-JAN-1991
	
	The online help example for strtok(), strpbrk(), strcspn(), and
	strspn() contains an error in the code. When compiled with pointer
	checking turned on in small or medium model and run, the following
	error occurs:
	
	   run-time error R6012
	   - illegal near-pointer use
	
	The error can be eliminated by changing the pointer incrementing in
	the vowel count loop from post-increment to pre-increment. For
	example, change.
	
	   /* Count vowels. */
	   p = string;
	   count = 0;
	   do
	   {
	      p = strpbrk( p, vowels );
	      count++;
	   } while( *(p++) );
	
	to the following:
	
	   /* Count vowels. */
	   p = string;
	   count = 0;
	   do
	   {
	      p = strpbrk( p, vowels );
	      count++;
	   } while( *(++p) );          // <-- Change here...
	
	In this case, the error caught by the pointer checking routine would
	not have caused any harm because it would have failed on the last
	iteration of the loop.
