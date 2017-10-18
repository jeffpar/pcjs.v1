---
layout: page
title: "Q52200: Manual Set Up for QuickAssembler on 3.5-Inch, 720K Floppies"
permalink: /pubs/pc/reference/microsoft/kb/Q52200/
---

## Q52200: Manual Set Up for QuickAssembler on 3.5-Inch, 720K Floppies

	Article: Q52200
	Version(s): 2.01
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 17-JAN-1990
	
	The following information describes how to set up Microsoft QuickC
	with QuickAssembler Version 2.01 on a 3.5-inch 720K disk.
	
	Since the QuickC with QuickAssembler Setup program requires a hard
	drive to work properly, this information describes how to manually set
	up QuickC with QuickAssembler on 3.5-inch 720K floppy disks.
	
	Disk 1: Integrated Environment
	------------------------------
	
	   File                     Source Disk
	   ----                     -----------
	
	   QC.EXE                   Integrated Development Environment
	   QCC.OVL                  QuickAssembler 2
	   QAS.OVL                  Integrated Development Environment
	   QCC.DAT                  Utilities/Microsoft Quick Advisor
	   C1.ERR                   Integrated Development Environment
	   LINK.EXE                 Utilities/Microsoft Quick Advisor
	   ILINK.EXE                Utilities/Microsoft Quick Advisor
	   ILINKSTB.OVL             Utilities/Microsoft Quick Advisor
	
	Disk 2: Command Line Compiler
	-----------------------------
	
	   File                     Source Disk
	   ----                     -----------
	
	   QCL.EXE                  Command-Line Compiler/Libraries 1
	   QCL.HLP                  Command-Line Compiler/Libraries 1
	   QCENV.HLP                QuickAssembler 2
	   QCCOM.EXE                Command-Line Compiler/Libraries 1
	   C1.ERR                   Integrated Development Environment
	   LINK.EXE                 Utilities/Microsoft Quick Advisor
	   ILINK.EXE                Utilities/Microsoft Quick Advisor
	   ILINKSTB.OVL             Utilities/Microsoft Quick Advisor
	
	Disk 3: QuickC Help Files
	-------------------------
	
	   File                     Source Disk
	   ----                     -----------
	
	   CL.HLP                   Command-Line Compiler/Libraries 1
	   ERRORS.HLP               Utilities/Microsoft Quick Advisor
	   GRAPHICS.HLP             Command-Line Compiler/Libraries 1
	   NOTES.HLP                Libraries 2/Fonts
	   QC.HLP                   Utilities/Microsoft Quick Advisor
	   README.DOC               Setup and Learning the Integrated Environment
	
	Disk 4: QuickAssembler Help Files
	---------------------------------
	
	   File                     Source Disk
	   ----                     -----------
	
	   CL.HLP                   Command-Line Compiler/Libraries 1
	   ERRORS.HLP               Utilities/Microsoft Quick Advisor
	   GRAPHICS.HLP             Command-Line Compiler/Libraries 1
	   NOTES.HLP                Libraries 2/Fonts
	   QA.HLP                   QuickAssembler 2
	   README.DOC               Setup and Learning the Integrated Environment
	
	Disk 5: Libraries and Include Files
	-----------------------------------
	
	Copy the following files onto this disk:
	
	   *   xLIBC.LIB           ("x" can be S, M, C, or L)
	   *   xLIBFP.LIB          ("x" can be S, M, C, or L)
	   *   EM.LIB or           (For emulator library)
	   *   87.LIB              (For 80x87 Library)
	   *   LIBH.LIB
	       GRAPHICS.LIB        (Optional)
	       PGCHART.LIB         (Optional)
	       LIB.EXE
	
	Note: The libraries with an "*" next to them are the component
	libraries that must be in the build library. GRAPHICS.LIB and
	PGCHART.LIB are optional libraries and do not need to be in the
	combined library.
	
	The following is an example of how to build a small memory model
	emulator library with graphics and pgchart libraries included:
	
	   >LIB SLIBCE.LIB
	
	   Microsoft (R) Library Manager  Version 3.14
	   Copyright (C) Microsoft Corp 1983-1989.  All rights reserved
	
	   Library does not exist.  Create? (y/n) y
	   Operations:+SLIBC.LIB +SLIBFP.LIB +EM.LIB +LIBH.LIB&
	   Operations:+GRAPHICS.LIB +PGCHART.LIB
	   List file:<PRESS RETURN>
	
	The environment variable settings corresponding to this set up are as
	follows:
	
	   SET PATH=A:\;B:\
	   SET LIB=B:\
	   SET INCLUDE=B:\INCLUDE
	   SET TMP=B:\
	
	Start QuickC with Integrated Environment in Drive A and the Help disk
	for either QuickC or QuickAssembler in Drive B. It is necessary to swap
	the Help disk with the Libraries and Include Files disk during compile
	and link time.
	
	To compile from the command line, insert the Command Line Compiler
	Disk into Drive A and the Libraries and Include Files in Drive B.
	
	Note: A similar procedure may be followed for manually setting up
	QuickC with QuickAssembler Fulfillment Kit on 3.5-inch disks, except that
	the libraries do not need to be built. The existing libraries from
	QuickC 2.00 can be used for QuickC with QuickAssembler Version 2.01.
