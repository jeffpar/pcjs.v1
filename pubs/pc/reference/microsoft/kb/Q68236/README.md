---
layout: page
title: "Q68236: Can't Use LINK Overlays in a BASIC OS/2 Dual-Mode Application"
permalink: /pubs/pc/reference/microsoft/kb/Q68236/
---

## Q68236: Can't Use LINK Overlays in a BASIC OS/2 Dual-Mode Application

	Article: Q68236
	Version(s): 7.00 7.10 | 7.00 7.10
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER | SR# S900920-70
	Last Modified: 29-JAN-1991
	
	Dual-mode applications are programs that can run under both OS/2 and
	DOS. You can use the Microsoft BASIC PDS 7.00 or 7.10 to create a
	dual-mode application; however, you cannot use BASIC to create a
	dual-mode application that also uses LINKed overlays for the DOS part
	of the program.
	
	This information applies to Microsoft BASIC Professional Development
	System 7.00 and 7.10 for MS-DOS and MS OS/2.
	
	A dual-mode application is not the same as a bound application under
	OS/2. A dual-mode application is actually two programs, one DOS and
	one OS/2, that are "glued" together to form one executable file.
	
	Every OS/2 program, when linked, has the option to link-in a "stub"
	DOS program. Originally, the stub DOS program was meant to print an
	appropriate message when you attempt to run an OS/2 program under DOS.
	Usually the message is "This program cannot be run in DOS mode," or a
	similar message. You include this stub DOS program by putting the
	following line in the linker .DEF file when you link the OS/2 program
	(where DOSPROG.EXE is the name of your own DOS program):
	
	   STUB 'DOSPROG.EXE'
	
	Originally, the only purpose of this stub file was to print this
	user-friendly message, and then exit back to DOS. Eventually,
	programmers began to let this "stub" program get larger and larger
	until it became a full-blown application that ran under DOS when you
	attempted to run the OS/2 program in DOS. (The user can't tell the
	difference.) Commercial applications, such as Microsoft Word version
	5.00, were created this way. Because dual-mode applications are
	literally two full applications glued together, they tend to be huge.
	
	This technique can be used with programs created with the Microsoft
	BASIC PDS product. However, one limitation of dual-mode applications
	is that the DOS portion cannot contain overlays. Attempting to run a
	dual-mode application, where the DOS portion was linked with overlays,
	will hang the machine.
	
	Illustration
	------------
	
	The following compile and link lines create two dual-mode program
	examples, OS2OVL.EXE and OS2NOOVL.EXE. (Source code is not provided
	but you can write it easily). OS2OVL.EXE is an OS/2 program and
	includes a DOS stub program that uses overlays.
	
	WARNING: Running OS2OVL.EXE will hang your machine, requiring you to
	reboot.
	
	OS2NOOVL.EXE is an OS/2 program, with an identical DOS version of the
	program enclosed as its stub file. OS2NOOVL.EXE does not use overlays,
	and will run without problem under DOS or OS/2.
	
	To compile and link the hypothetical programs, use the following
	commands:
	
	bc dosprog.bas /Lr /o ;
	bc mod1.bas    /Lr /o ;
	bc mod2.bas    /Lr /o ;
	link dosprog mod1 mod2, dosnoovl.exe ;
	link dosprog (mod1) (mod2), dosovl.exe ;
	bc dosprog.bas /Lp /o ;
	bc mod1.bas    /Lp /o ;
	bc mod2.bas    /Lp /o ;
	link os2prog mod1 mod2, os2noovl.exe,,, os2noovl.def ;
	link os2prog mod1 mod2, os2ovl.exe ,,, os2ovl.def ;
	
	DOSPROG.BAS is a main program that calls subprograms contained in
	separate support modules, MOD1.BAS and MOD2.BAS.
	
	OS2NOOVL.DEF contains the following line:
	
	   STUB 'DOSNOOVL.EXE'
	
	OS2OVL.DEF contains the following line:
	
	   STUB 'DOSOVL.EXE'
	
	(A LINK.EXE .DEF file is a module definition file that BASIC can use
	when linking OS/2 protected-mode programs.)
