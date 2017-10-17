---
layout: page
title: "Q38015: MASM m.exe Is Different than FORTRAN m.exe when Using DOS Comp"
permalink: /pubs/pc/reference/microsoft/kb/Q38015/
---

## Q38015: MASM m.exe Is Different than FORTRAN m.exe when Using DOS Comp

	Article: Q38015
	Version(s): 1.00   | 1.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | h_fortran
	Last Modified: 6-JAN-1989
	
	Question:
	
	When I do a Comp command at the DOS prompt, why do the FORTRAN Version
	4.10 and MASM Version 5.10 packages contain m.exe files that differ at
	offset 15F9F, where the MASM m gives 37 and the FORTRAN m gives 38?
	Which one should I use for mixed-language programming?
	
	Response:
	
	This behavior is an error that was discovered after MASM Version 5.10
	was released, but before FORTRAN Version 4.10 was shipped. You can see
	this by invoking the editor and entering SHIFT+F1, which gives you
	file information. The date given in the MASM file is Jan. 29, 1987
	(hex37) when it should be Jan. 29, 1988 (hex 38). Other than this
	character in the date, they are identical, so you can use either one
	for mixed-language programming.
