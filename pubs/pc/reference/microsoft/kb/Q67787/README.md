---
layout: page
title: "Q67787: STRUC Defined Structures Cannot Be Tested"
permalink: /pubs/pc/reference/microsoft/kb/Q67787/
---

## Q67787: STRUC Defined Structures Cannot Be Tested

	Article: Q67787
	Version(s): 5.10 5.10a | 5.10 5.10a
	Operating System: MS-DOS     | OS/2
	Flags: ENDUSER | buglist5.10a
	Last Modified: 6-FEB-1991
	
	The STRUC command in MASM does not allow for the definition of nested
	structures. The example code below shows a nested structure definition
	which gives the following error:
	
	   test.ASM(10): error A2078: Directive illegal in structure
	
	Sample Code
	-----------
	
	.MODEL SMALL
	.DATA
	foo STRUC
	        f1 db ?
	        f2 db ?
	foo ENDS
	
	goo STRUC
	        f3 db ?
	        s1 foo <>          ;; this is the nested structure
	                           ;; declaration that is illegal
	goo ENDS
	
	end
	
	Microsoft has confirmed this to be a problem in MASM versions 5.10 and
	5.10a. We are researching this problem and will post new information
	here as it becomes available.
