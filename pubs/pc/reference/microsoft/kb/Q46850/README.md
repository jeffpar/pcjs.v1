---
layout: page
title: "Q46850: Increasing the Efficiency of QuickBASIC 4.50's QuickSort Demo"
permalink: /pubs/pc/reference/microsoft/kb/Q46850/
---

## Q46850: Increasing the Efficiency of QuickBASIC 4.50's QuickSort Demo

	Article: Q46850
	Version(s): 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S890628-48
	Last Modified: 12-JAN-1990
	
	The SORTDEMO.BAS QuickSort program's speed can be increased by moving
	in toward the pivot point after each iteration. The speed increase is
	more noticeable as the array gets larger. This information applies to
	the SORTDEMO.BAS sample program provided with Microsoft QuickBASIC
	Version 4.50 for MS-DOS.
	
	In the QuickSort SUBprogram, you must move the "end elements", "I" and
	"J", inward after each iteration of the pivot loop. Currently, "I" and
	"J" are reset after after each loop iteration back to their initial
	values.
	
	The following is a portion of the QuickSort SUBprogram outlining the
	change that can be made.
	
	The code currently reads as follows:
	
	   .
	   .
	   .
	'Pick a pivot element at random. Then move it to the end.
	RandIndex = RandInt%(Low,High)
	SWAP SortArray(High),SortArray(RandIndex)
	Swapvars High, RandIndex
	Partition = SortArray(High),Length
	
	DO
	
	   '***** THE NEXT TWO LINES ARE THE ONES *****
	   '***** THAT YOU WILL BE MOVING UPWARDS *****
	
	   'Move in from both sides toward the pivot element
	   I = Low: J = High
	
	   DO WHILE (I<J) AND SortArray(I).Length <= Partition
	
	The code should read as follows:
	
	   .
	   .
	   .
	'Pick a pivot element at random. Then move it to the end.
	RandIndex = RandInt%(Low,High)
	SWAP SortArray(High),SortArray(RandIndex)
	Swapvars High, RandIndex
	Partition = SortArray(High),Length
	
	'***** THE FOLLOWING TWO LINES HAVE BEEN MOVED UPWARDS *****
	
	'Move in from both sides toward the pivot element
	I= Low: J = High
	
	DO
	
	   DO WHILE (I < J) AND SortArray(I).Length <= Partition
