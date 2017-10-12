---
layout: page
title: "Q41196: QCL 1.01 Can Bring Up QuickC 2.00 Integrated Environment"
permalink: /pubs/pc/reference/microsoft/kb/Q41196/
---

	Article: Q41196
	Product: Microsoft C
	Version(s): 2.00   | 2.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 28-FEB-1989
	
	Problem:
	
	When I exit the environment, the process runs to completion
	with no errors, but no .OBJ file is built if I do the following:
	
	1. Type "QCL <filename>" at a DOS prompt to invoke the QuickC
	   command-line driver. The copyright notice appears on the screen.
	
	2. The filename is echoed, and I load the QuickC Version 2.00
	   environment.
	
	Response:
	
	This can only happen on a machine that has previously had QuickC
	Version 1.01 loaded. It demonstrates a path problem, and a conflict
	between the QuickC Versions 1.01 and 2.00. Type the command again, and
	the QCL copyright notice appears for Version 1.01.
	
	The QCL command line driver for QuickC Version 1.01 brings up the
	QuickC Version 2.00 Integrated Environment under the following
	conditions:
	
	1. The directory containing the file QCL.EXE from Version 1.01 is on
	   the DOS path prior to the directory containing QC.EXE from Version
	   2.00.
	
	2. You invoked QCL from a directory other than the /BIN directory
	   for QuickC Version 2.00.
	
	3. The file QC.EXE for QuickC Version 1.01 is not present on the path.
	
	The QCL command line driver requires the file QC.EXE. The QCL driver
	for Version 1.01 uses QC.EXE from Version 2.00 if it does not first
	find the appropriate version along the path. However, the two are not
	compatible, and instead of compiling, the QuickC Version 2.00
	environment is brought up.
	
	This situation is the result of using QuickC Version 2.00 in an
	improper environment. The solution is to correct the path environment
	variable and/or remove all remnants of previous versions of the QuickC
	package.
