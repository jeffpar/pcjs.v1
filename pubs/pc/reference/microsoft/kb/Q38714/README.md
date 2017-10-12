---
layout: page
title: "Q38714: Shared and Instance Segments in a DLL"
permalink: /pubs/pc/reference/microsoft/kb/Q38714/
---

	Article: Q38714
	Product: Microsoft C
	Version(s): 5.10
	Operating System: OS/2
	Flags: ENDUSER | SR# G881019-4906 -ND SINGLE S_LINK
	Last Modified: 24-JAN-1990
	
	Question:
	
	How can I get both shared and instance data in a DLL? I'd like to have
	the default data segment (DGROUP) and most of the far segments to be
	instance data and a single far data segment to be shared data. I've
	tried to do this by doing the following:
	
	1. Isolating the data for the far segment in fardata.c and compiling
	   it with -NDSEG1
	
	2. Linking with a .DEF file that contains the following:
	
	    DATA    MULTIPLE NONSHARED
	        SEGMENTS
	                SEG1 CLASS 'FAR_DATA' SHARED
	
	When I do this, ALL data segments (including SEG1) are instance; I
	determined this from both my test program and the output of the exehdr
	utility.
	
	How can I make the SEG1 segment shared?
	
	Response:
	
	Every time you use /NDSEG1 option compiler will generate the
	following segment definitions:
	
	        SEG1        class   'FAR_DATA'
	        SEG1_CONST  class   'FAR_DATA'
	        SEG1_BSS    class   'FAR_DATA'
	        GROUP SEG1_GROUP SEG1, SEG1_CONST, SEG1_BSS
	
	SEG1, SEG1_CONST, and SEG1_BSS are all members of the same group
	(physical segment). (SEG1_CONST AND SEG1_BSS are created automatically
	by the compiler, as is the group SEG1_GROUP.) The linker overrides the
	SEGMENTS specification if ANY of the segments in the group are left at
	the default. The solution is to ask the linker to share ALL of the
	segments in the group. In your case, insert the following into the
	.DEF file:
	
	DATA MULTIPLE NONSHARED
	SEGMENTS
	        SEG1         CLASS 'FAR_DATA' SHARED
	        SEG1_CONST   CLASS 'FAR_DATA' SHARED
	        SEG1_BSS     CLASS 'FAR_DATA' SHARED
	
	Note: if the segment(s) you want to share are part of a group, you
	must set ALL of the segments in the group to be shared or NONE will
	be.
