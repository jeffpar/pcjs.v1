---
layout: page
title: "Q41577: QuickC 2.00 README.DOC: Declaring and Initializing Arrays"
permalink: /pubs/pc/reference/microsoft/kb/Q41577/
---

	Article: Q41577
	Product: Microsoft C
	Version(s): 2.00
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 28-FEB-1989
	
	The information below is taken from the QuickC Version 2.00 README.DOC
	file, Part 2, "Notes on 'C for Yourself.'" The following notes refer
	to specific pages in "C for Yourself."
	
	Page 54  Declaring and Initializing Arrays
	
	You can always initialize an array with constants. If you initialize
	an automatic (local) array with variables or addresses that are
	unknown to the compiler at compile time, you must include the size of
	the array. For example:
	
	#define FIVE 5
	main()
	{
	  int i = 5;
	  int abc[] = { 5, FIVE};  /* constants always work */
	  int def[] = { i, i }     /* ERROR: variables in unsized array */
	  int ghi[2] = {i, i }     /* sized array works */
	
	Warning: The first edition of "The C Programming Language" by
	Kernighan and Richie did NOT allow you to initialize automatic arrays.
	The ANSI standard and the second edition of K&R make provision for
	initialization by constants. Initializing an automatic array with
	variables is a Microsoft extension to ANSI. If you plan to port your
	program to another computer or operating system, these constructs may
	not be portable. QuickC will issue a warning about initializing
	automatic arrays at warning level three. The requirement for sized
	arrays is unique to QuickC -- unsized arrays are accepted by the
	Microsoft C Optimizing Compiler.
