---
layout: page
title: "Q24935: Effects of Min and Max Memory Allocation During C Program Load"
permalink: /pubs/pc/reference/microsoft/kb/Q24935/
---

	Article: Q24935
	Product: Microsoft C
	Version(s): 4.00 5.00 5.10 6.00 6.00a
	Operating System: MS-DOS
	Flags: ENDUSER | s_quickc s_link s_exemod s_exehdr
	Last Modified: 6-FEB-1991
	
	Changing the minimum and maximum allocation values in an .EXE file
	will affect the way in which memory is allocated for a program.
	
	Memory is dynamically allocated for a program when it is loaded. DOS
	initially attempts to allocate FFFFH paragraphs memory. This will
	always fail, returning the size of the largest free block. If this
	block is smaller than the minimum allocation and the load size, a
	no-memory error will occur. If this block is larger than the sum of
	the maximum allocation and the load size, DOS will allocate the amount
	specified by the load size and the maximum allocation. Otherwise, the
	largest block of memory available is allocated.
	
	An example of when the maximum allocation should be changed would be a
	program, such as a menu driver, that spawns other programs. Since this
	program would stay resident in memory, the maximum allocation should
	be set to the minimum allocation to keep as much memory available as
	possible for the spawned programs.
	
	In small memory model, the C start-up code will return all memory
	allocated to it back to DOS, except for a 64K block reserved for the
	default data group. If only 4K of this 64K will be used by the menu
	program, the entire 64K should not be kept. There are several ways of
	changing the maximum allocation to 4K -- you can link with the /CP:1
	option or you can modify an existing .EXE file with the EXEHDR or
	EXEMOD utilities.
