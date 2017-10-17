---
layout: page
title: "Q41250: How to Manually Setup QuickC Version 2.00 on a Hard Drive"
permalink: /pubs/pc/reference/microsoft/kb/Q41250/
---

## Q41250: How to Manually Setup QuickC Version 2.00 on a Hard Drive

	Article: Q41250
	Version(s): 2.00
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 28-FEB-1989
	
	The following information explains how to manually set up Microsoft
	QuickC Version 2.00 for a hard disk. It will show you how to set up in
	the same way as the SETUP.EXE program.
	
	This information demonstrates how to set up QuickC Version 2.00 under
	the directory "QC2" on Drive C. You may change the name of any
	directory or the drive.
	
	1. Create the following directories:
	
	   C:\QC2\BIN
	   C:\QC2\LIB
	   C:\QC2\TMP
	   C:\QC2\SAMPLES
	   C:\QC2\INCLUDE
	   C:\QC2\INCLUDE\SYS
	
	2. Add the following to your AUTOEXEC.BAT file:
	
	   SET LIB=C:\QC2\LIB
	   SET INCLUDE=C:\QC2\INCLUDE
	   SET TMP=C:\QC2\TMP
	   SET PATH=C:\QC2\BIN
	
	   (You may place this in a separate batch file if you prefer.)
	   Note: It is important that you do NOT add spaces in or after these
	   variables. For example, "SET LIB = C:\QC2\LIB" does not work
	   correctly; neither does "SET LIB=C:\QC2\LIB  " because it has
	   trailing spaces at the end.
	
	3. Add the following to your CONFIG.SYS file:
	
	   FILES=20
	   BUFFERS=20
	
	   (You must reboot after this step for these changes to take effect.)
	
	4. Copy the following files into C:\QC2\BIN:
	
	                              Distribution Disk Title
	   File                  5.25-Inch Disk      3.5-Inch Disk
	
	   HELPMAKE.EXE          Setup               Setup/Learning QC
	   README.DOC            Setup               Setup/Learning QC
	   MSHERC.COM            Setup               Setup/Learning QC
	   FIXSHIFT.COM          Setup               Setup/Learning QC
	   LINK.EXE              Learning QC         Setup/Learning QC
	                         & Utilities         Utilities/QC Advisor
	   QCL.EXE               Command Line Comp.  Command Line Comp/Lib 1
	   QC.EXE                Integrated Env 1    Integrated Dev. Env.
	   QCENV.HLP             Integrated Env 1    Integrated Dev. Env.
	   NMAKE.EXE             Integrated Env 2    Integrated Dev. Env.
	   QCC.OVL               Integrated Env 2    Integrated Dev. Env.
	   C1.ERR                Integrated Env 2    Integrated Dev. Env.
	   ILINK.EXE             Utilities           Utilities/QC Advisor
	   CRLF.EXE              Utilities           Utilities/QC Advisor
	   LIB.EXE               Utilities           Utilities/QC Advisor
	   ERRORS.HLP            Utilities           Utilities/QC Advisor
	   QCC.DAT               Utilities           Utilities/QC Advisor
	   MOUSE.COM             Utilities           Utilities/QC Advisor
	   QC.KEY                Utilities           Utilities/QC Advisor
	   ME.KEY                Utilities           Utilities/QC Advisor
	   EMACS.KEY             Utilities           Utilities/QC Advisor
	   EPSILON.KEY           Utilities           Utilities/QC Advisor
	   BRIEF.KEY             Utilities           Utilities/QC Advisor
	   ILINKSTB.OVL          Utilities           Utilities/QC Advisor
	   QC.HLP                MS QC Advisor       Utilities/QC Advisor
	   QCCOM.EXE             Command Line Comp.  Command Line Comp/Lib 1
	   GRAPHICS.HLP          Command Line Comp   Command Line Comp/Lib 1
	   QCL.HLP               Command Line Comp   Command Line Comp/Lib 1
	   CL.ERR                Command Line Comp   Command Line Comp/Lib 1
	
	5. Copy the following files into C:\QC2\INCLUDE:
	
	   *.H       (All files with the .H extension except the following:
	             TYPES.H, LOCKING.H, STAT.H, TIMEB.H, UTIME.H)
	
	   These are located on the 5.25-inch disk labeled Integrated
	   Development Environment 2 and the 3.5-Inch disk labeled Integrated
	   Development Environment.
	
	6. Copy the following files into C:\QC2\INCLUDE\SYS:
	
	   STAT.H
	   UTIME.H
	   TIMEB.H
	   TYPES.H
	   LOCKING.H
	
	   (You will find these five files on the same disk as the other
	   include files in a subdirectory called SYS.)
	
	7. Copy the following files into C:\QC2\SAMPLES:
	   (Note: This step is optional. Copy these files only if you want the
	   sample programs on your hard disk.)
	
	   CFLOW.DOC
	   *.FON     (All files with the .FON extension. These are on the
	             3.5-inch disk labeled Libraries 3/Fonts and the 5.25-inch
	             disk labeled Fonts.)
	
	   *.C       (All files with the .C extension. This is optional. Copy
	             these files only if you want the sample programs. These
	             are on the 5.25-inch disk labeled Setup and the 3.5-inch
	             disk labeled Setup/Learning the MS QC Environment.
	
	   Now you must build the combined libraries that you want to use.
	   QuickC Version 2.00 supports all memory models within the
	   environment.
	
	8. Copy the following files to C:\QC2\LIB from the disk labeled
	   Libraries (1, 2, 3):
	
	   xLIBC.LIB           ("x" can be S, M, C, or L)
	   xLIBFP.LIB          ("x" can be S, M, C, or L)
	   EM.LIB
	   LIBH.LIB
	   GRAPHICS.LIB
	   *.OBJ               (Any file with the .OBJ extension)
	
	   Note: For example, if you were to build the Medium Library,
	   MLIBCE.LIB, you would substitute xLIBC.LIB with MLIBC.LIB and
	   xLIBFP.LIB with MLIBFP.LIB. If you wanted to build the Small
	   Library, SLIBCE.LIB, you would substitute xLIBC.LIB with SLIBC.LIB
	   and xLIBFP.LIB with SLIBFP.LIB. QuickC defaults to small-memory
	   model, but supports Small, Medium, Compact, and Large if so
	   specified. At least one library must be built.
	
	   Assuming that you are building the Medium Library, MLIBCE.LIB, you
	   would now combine these copied files using the Library Manager,
	   LIB.EXE, as follows in the next step.
	
	9. Change the directory so that you are in C:\QC2\LIB. Type the
	   following at the DOS prompt:
	
	   LIB  MLIBCE.LIB  <press ENTER>
	   [Operations]:  +MLIBC.LIB +MLIBFP.LIB +EM.LIB&  <press ENTER>
	   [Operations]:  +LIBH.LIB +GRAPHICS.LIB +PGCHART.LIB <press ENTER>
	   [List file]:   <press ENTER>
	
	Note: The "[Operations]:" and "[List file]:" are prompts from the
	Library Manager so they are not something you type in. The "&" is a
	continuation mark that can be used if your line grows too long.
	
	Including the Graphics Library, PGCHART.LIB and GRAPHICS.LIB
	in the combined library is optional. If you choose not to include
	these libraries here, you will need to create Program Lists when
	you are in the QuickC environment.
	
	If you run into any errors using LIB.EXE, make sure you are using the
	correct version. The version of the Library Manager that was shipped
	with QuickC Version 2.00 is Version 3.14.
	
	If you are having problems, try step 9 again with one change: instead
	of "LIB MLIBCE.LIB", type "C:\QC2\BIN\LIB MLIBCE.LIB" and then press
	ENTER.
	
	The Library Manager, LIB.EXE, now builds the Medium library,
	MLIBCE.LIB. You can delete MLIBC.LIB, MLIBFP.LIB, EM.LIB, and LIBH.LIB
	from C:\QC2\LIB because they are no longer necessary. Do NOT delete
	them from your distribution disks.
	
	You now are finished setting up QuickC Version 2.00 on your hard disk.
	If you would like to build other combined libraries in the future,
	then you can either use the SETUP.EXE program with the /L options
	
	   setup /L
	
	or follow the recipe listed above for manually building them with
	the Library Manager.
