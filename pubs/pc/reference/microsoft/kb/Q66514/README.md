---
layout: page
title: "Q66514: Unable to Create a File Larger Than 32MB with DOS 4.x"
permalink: /pubs/pc/reference/microsoft/kb/Q66514/
---

	Article: Q66514
	Product: Microsoft C
	Version(s): 6.00 6.00a
	Operating System: MS-DOS
	Flags: ENDUSER | S_QuickC S_MASM appnote PATCH32M.ARC
	Last Modified: 11-NOV-1990
	
	Question:
	
	I am creating a database program and I cannot create files larger than
	32 megabytes (MB). Doesn't Microsoft's C compiler allow me to do this?
	
	Response:
	
	The problem isn't with the C compiler but with the operating system.
	Microsoft has confirmed that MS-DOS versions 4.00 and 4.01 do not work
	correctly when accessing files that are close to or larger than 32MB
	in size. The file size does not get updated past 32MB.
	
	Microsoft has produced a patch program, PATCH32M.EXE, for DOS versions
	4.x, which corrects this problem by modifying the MSDOS.SYS (or
	IBMDOS.COM) file on your system disk. This patch is found in the
	Software/Data Library or it can be obtained by calling Microsoft
	Product Support.
	PATCH32M can be found in the Software/Data Library by searching for
	the keyword PATCH32M, the Q number of this article, or S12506.
	PATCH32M was archived using the PKware file-compression utility.
