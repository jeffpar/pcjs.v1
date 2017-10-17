---
layout: page
title: "Q45897: How to Make QuickBASIC 4.50 Recognize Custom Help Files"
permalink: /pubs/pc/reference/microsoft/kb/Q45897/
---

## Q45897: How to Make QuickBASIC 4.50 Recognize Custom Help Files

	Article: Q45897
	Version(s): 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | S_QuickC S_QuickPas S_UTILity
	Last Modified: 29-DEC-1989
	
	You can use the HELPMAKE.EXE utility that is included with QuickC
	Version 2.00 and Quick Pascal Version 1.00 to make customized Help
	files for QuickBASIC Version 4.50. However, QuickBASIC 4.50 does not
	acknowledge the "HELPFILES" environment setting. The only Help file
	that it acknowledges is QB45QCK.HLP. How you implement support for
	your customized Help files depends upon whether you want to replace
	QuickBASIC's original Help file or merely to supplement it.
	
	This information applies to QuickBASIC Version 4.50.
	
	Microsoft BASIC PDS Version 7.00 includes the HELPMAKE.EXE utility. To
	use HELPMAKE.EXE with QBX.EXE 7.00, see Chapter 22 of the "Microsoft
	BASIC 7.0: Programmer's Guide" for Microsoft BASIC PDS Version 7.00.
	
	If you want to replace QuickBASIC's Help file, rename your customized
	Help file as QB45QCK.HLP and place it in the directory with QB.EXE.
	You can now access your own customized contexts but have no access to
	the original Help screens for QuickBASIC.
	
	If you want to supplement QuickBASIC's Help file, do the following:
	
	1. Use HELPMAKE to decode QuickBASIC's QB45QCK.HLP as follows:
	
	      HELPMAKE /D /OQB45QCK.TXT QB45QCK.HLP
	
	   (Note: There is no space when using HELPMAKE's /Odestfile switch,
	   which specifies the output destination filename.)
	
	2. Load QB45QCK.TXT into a text editor or word processor.
	
	3. Append the source for your customized contexts to the end of
	   QB45QCK.HLP.
	
	4. Save the file under the name QB45QCK.TXT.
	
	5. Rename QB45QCK.HLP to QB45QCK.OLD.
	
	6. Use HELPMAKE to encode the new Help file, as follows:
	
	      HELPMAKE /A: /E /OQB45QCK.HLP QB45QCK.TXT
	
	   (Note: The /A: switch specifies a colon (:) to be the control
	   character to mark lines containing special control information
	   for use by the QB.EXE application's Help system.)
	
	You can now access your customized Help contexts, in addition to the
	original contents of the Help screens, with QuickBASIC's Help system.
	
	For more information about running HELPMAKE, please refer to Chapter 8
	of the "Microsoft QuickC Tool Kit" manual for Version 2.0.
