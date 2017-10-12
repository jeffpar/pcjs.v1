---
layout: page
title: "Q34310: Manual-Setup Procedure for C"
permalink: /pubs/pc/reference/microsoft/kb/Q34310/
---

	Article: Q34310
	Product: Microsoft C
	Version(s): 5.00 5.10 | 5.10
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER |
	Last Modified: 11-JAN-1990
	
	The following is a manual-setup procedure for C.
	
	Manual Setup Procedure For Microsoft C (DOS only) System
	Configurations:
	
	Directory:
	
	C:\MSC\BIN                  Executable file (*.EXE)
	C:\MSC\LIB                  Library and Object modules (*.LIB, *.OBJ)
	C:\MSC\INCLUDE              Include (or header) files (*.H)
	C:\MSC\SRC                  Sample C programs
	C:\MSC\UTILS                Utilities, such as LINK.EXE, CV.EXE ect.
	C:\MSC\INIT                 Initialization files (*.INI)
	C:\MSC\TEMP                 Temporary files for the C compiler only
	                            No files copied into this directory
	
	Autoexec.bat:
	
	SET LIB=C:\MSC\LIB
	SET INCLUDE=C:\MSC\INCLUDE
	SET TMP=C:\MSC\TEMP
	SET INIT=C:\MSC\INIT
	SET PATH=C:\MSC\UTILS;C:\MSC\BIN;C:\MSC\SRC
	
	Config.sys:
	
	Files=20
	Buffers=20
	Shell=C:\Command.com /e: 1024 /p
	
	(Note that the above use of the Shell command is typically only
	supported for DOS Versions 3.20 and later.)
	
	Files to Copy:
	
	Copy the following files into the C:\MSC\BIN directory:
	
	C1.EXE      C1L.EXE
	C2.EXE      MOUSE.COM
	C3.EXE      QCL.HLP
	CL.EXE      C23.ERR
	QC.EXE      QC.HLP
	QCL.EXE
	
	Copy all the INCLUDE files with .H extensions into the C:\MSC\INCLUDE
	directory.
	
	Copy the following files into the C:\MSC\UTILS directory:
	
	LINK.EXE
	M.EXE
	LIB.EXE
	CV.EXE
	CV.HLP
	Any other utilities, such as EXEMOD.EXE
	
	Copy the following files into the C:\MSC\INIT directory:
	
	TOOLS.INI
	Any other .INI file
	
	Copy any C sample programs provided with the compiler into the
	C:\MSC\SRC directory.
	
	Running The Library Manager -- LIB.EXE:
	
	The following section assumes that the above configurations where
	followed and the operations completed. The following section is on
	libraries.
	
	The C linker searches the C:\MSC\LIB directory to find either C
	combined libraries or explicitly named libraries. The Microsoft naming
	convention for combined libraries is xLIByz.LIB. x is either S, M, C,
	or L for Small, Medium, Compact, or Large, respectively. y is the
	language, in this case C. z is the math libraries; A, E, 7 for
	Alternate, Emulation, or 87 coprocessor, respectively.
	
	The following is an example:
	
	MLIBCE.LIB  is the (M)edium model, (C) (E)mulation combined library
	
	Copy the following files into the C:\MSC\LIB directory:
	
	xLIBy.lib
	sDLIBC.LIB          Depending on what is desired
	mLIBC.LIB
	cLIBC.LIB
	lLIBC.LIB
	EM.LIB or 87.LIB    Depending on what is desired, none for alt. math
	xLIBFz.LIB          z is A for alternate or P for other
	sLIBFz.LIB          Depending on choice above
	mLIBFz.LIB
	cLIBFz.LIB
	lLIBFz.LIB
	LIBH.LIB
	GRAPHICS.LIB        ( Optional )
	
	The following is an example of how to run the library manager:
	
	1. At the operating system prompt, type LIB, then the name you
	   want to call the library with the .LIB extension.
	
	2. Press the ENTER key. The prompt will say OPERATIONS.
	
	3. Enter the desired operations, such as appending stand alone .LIB
	   or .OBJ files. If the number of modules is too many for one text
	   line, the at sign, "@", can be used as a continuation character.
	
	4. A list ( *.LST ) file is asked for, which is optional.
	
	The following example demonstrates this process:
	
	        C:\> LIB name.lib
	             Operations: +mod1.lib + mod2.lib + ... +modk.lib@
	             Operations: +...+ modn.lib
	             List File: name.lst
	
	Name.lst contains a listing of all the functions that occur in
	name.lib.
	
	The following is an example of how to build the C Medium model,
	Emulation library with graphics:
	
	   C:\> LIB mlibce.lib
	   Operations: +mlibc.lib +em.lib +mlibfp.lib +libh.lib +graphics.lib
	   List File: <ENTER>  ( pressing enter here will suppress the
	                                   creation of a listing file. )
	
	The above example can be repeated with appropriate modifications to
	create the other C combined libraries.
