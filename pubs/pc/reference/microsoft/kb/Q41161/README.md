---
layout: page
title: "Q41161: Mixing Memory Models with QuickC 2.00 and QCL 2.00"
permalink: /pubs/pc/reference/microsoft/kb/Q41161/
---

## Q41161: Mixing Memory Models with QuickC 2.00 and QCL 2.00

	Article: Q41161
	Version(s): 2.00
	Operating System: MS-DOS
	Flags: ENDUSER | buglist2.00
	Last Modified: 28-FEB-1989
	
	If the memory models are incorrectly mixed within the QuickC Version
	2.00 environment (i.e., the compilation is done in small model, and
	the resulting .OBJ is linked to MLIBCE.LIB), the program appears to
	compile and link correctly. However, when QuickC tries to run the
	file, the program name echoes, the screen flickers, and you are
	returned to the QuickC Version 2.00 environment where an error-message
	dialog box says "Cannot find current location in source file."
	
	If the same make file is run outside of the QuickC environment, the
	program compiles, links, and runs successfully, as the linker uses the
	default library for the memory model that was used to compile.
	However, if a library for another memory model is explicitly added to
	the link line, for example, if the following line is executed,
	
	   qcl /AS test.c /link mlibce.lib
	
	it will compile and link with no errors, and the resulting .EXE file,
	free from the error-recovery abilities of the QuickC environment,
	hangs the computer.
	
	This frequently happens with programs that are being ported from
	QuickC Version 1.01 to QuickC Version 2.00 because they are built with
	existing make files that specify the external library MLIBCE.LIB or
	MLIBC7.LIB explicitly. However, the default for the QuickC Version
	2.00 integrated environment is small model, and not medium, as was the
	case with QuickC Version 1.00 and Version 1.01.
	
	Microsoft has confirmed this to be a problem in Version 2.00. We are
	researching this problem and will post new information as it becomes
	available.
