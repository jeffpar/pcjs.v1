---
layout: page
title: "Q46948: MSJ 9/88: "Using MSC for TSRs" Omission/TSRs in C Information"
permalink: /pubs/pc/reference/microsoft/kb/Q46948/
---

	Article: Q46948
	Product: Microsoft C
	Version(s): 5.10
	Operating System: MS-DOS
	Flags: ENDUSER | SR# G890710-22224
	Last Modified: 26-JUL-1989
	
	The September 1988 article in Microsoft Systems Journal (MSJ) titled
	"Using Microsoft C Version 5.1 to Write Terminate-and-Stay-Resident
	Programs" omits and misstates some important information about writing
	TSRs. In addition, the example calls BIOS from within a TSR, which is
	not guaranteed to be safe. Although this article is an excellent
	introduction to writing TSRs, especially in C, it does not contain all
	of the needed information. The article on TSRs in the "MS-DOS
	Encyclopedia" is a much more definitive reference.
	
	There are two problems in the article: first, the program calls BIOS
	functions from within the TSR. Since BIOS is not re-entrant, you can't
	always call BIOS from within a TSR. Second, it is not good advice to
	say that it's OK to compile with -AS rather than -Asnw. Unless you're
	going to switch to your own stack in the TSR, you should always use
	-Asnw.
	
	The article is correct when it says that, in general, you may NOT call
	DOS functions from within a TSR without taking special precautions.
	DOS is not re-entrant.
	
	Although the MSJ article does prepare you for the concepts you'll need
	to write TSRs, the best reference is the "MS-DOS Encyclopedia," which
	has a 40-page chapter on the topic. Among the topics are descriptions
	of how to safely call BIOS and DOS from within a TSR. The "MS-DOS
	Encyclopedia" is available in hardcover and paperback from Microsoft
	Press at (800) 888-3303 and is an exceptionally useful reference book.
	
	Programming TSRs in C is a very complicated task. Microsoft is unable
	to offer assistance beyond the "MS-DOS Encyclopedia" to help you with
	TSR programming. There are a number of small problems: many library
	functions call DOS, do stack checks, or make memory allocations (or
	all three); so they can't be called. However, you can often work
	around this problem by buying the library source from Microsoft [call
	(800) 426-9400] and modifying offending routines.
	
	A bigger problem is that there is no routine supplied to change the
	stack from the user's stack to your own. It's not wise to rely on the
	user's stack being big enough for your needs. To change to your own
	stack, you'll need an assembly-language subroutine, which may be a
	part of some function packages for writing TSRs in C.
	
	It's a bit easier to program TSRs in assembly language. With assembly
	language, you know exactly what's going on all the time. This is a big
	help in debugging. For a TSR that's going to be reliable, you'll need
	to know exactly what's going on.
	
	There are third-party packages that make programming TSRs in C
	easier and safer. You may want to contact one of the PC programmers'
	software houses about this.
