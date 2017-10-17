---
layout: page
title: "Q40599: Modifying Existing Help Files with HELPMAKE (QuickC Example)"
permalink: /pubs/pc/reference/microsoft/kb/Q40599/
---

## Q40599: Modifying Existing Help Files with HELPMAKE (QuickC Example)

	Article: Q40599
	Version(s): 1.00 1.04 1.05 1.06 | 1.04 1.05 1.06
	Operating System: MS-DOS              | OS/2
	Flags: ENDUSER | s_helpmake s_qh
	Last Modified: 24-JAN-1991
	
	You can add to or change the information in the online help files that
	are accessible from QuickHelp, PWB, and QuickC. To accomplish this, do
	the following:
	
	1. Decompress the existing help file using HELPMAKE.EXE.
	
	2. Edit the resulting source listing of the help file.
	
	3. Recompress this modified file using HELPMAKE.EXE.
	
	The example below illustrates this process.
	
	There is a known coding error in the Font function examples in the
	QuickC 2.00 online help. This error occurs in the following code line:
	
	   strcat (fondir, "\*.fon") ;
	
	This statement should be corrected to read as follows:
	
	   strcat (fondir, "\\*.fon") ;
	
	To correct this online example in the GRAPHICS.HLP file, do the
	following:
	
	1. Decompress GRAPHICS.HLP, as follows:
	
	      HELPMAKE /D /Ographics.src /V Graphics.hlp  > decode.log
	
	   /D  Tells HELPMAKE to decode GRAPHICS.HLP
	   /O  Tells HELPMAKE to name the output file GRAPHICS.SRC
	   /V  Tells HELPMAKE to be verbose in decoding information
	
	   "> decode.log"  redirects decoding information to DECODE.LOG.
	   This DOS redirection is not necessary, but is helpful.
	
	2. Edit GRAPHICS.SRC
	
	   Using an editor of your choice, search GRAPHICS.SRC for the
	   code line that contains "\*.fon". When you locate the strcat()
	   instruction mentioned above, you will notice that the line already
	   correctly reads as follows:
	
	      strcat (fondir, "\\*.fon") ;
	
	   This is the correct coding for the C language. However,
	   HELPMAKE.EXE views the backslash, "\", as a flag for instructions.
	   Therefore, the first "\" is interpreted and is subsequently not
	   viewable in the online help.
	
	   If you intend a "\" to be viewed from within the online help, you
	   must type two backslashes. That is why the strcat() instruction is
	   displayed in the online help with only one "\".
	
	   To display two successive backslashes from within online help, you
	   must type four backslashes in the source file, which HELPMAKE will
	   interpret and compress into a helpfile.
	
	   In this example, you would modify the following statement
	
	      strcat (fondir, "\\*.fon") ;
	
	   to read as follows:
	
	      strcat (fondir, "\\\\*.fon") ;
	
	3. Recompress GRAPHICS.SRC into a help file, as follows:
	   (This process may take up to 10 minutes with this file.)
	
	   HELPMAKE /E15 /A: /W128 /Ographics.hlp graphics.src /V > encode.log
	
	   /E15   Tells HELPMAKE to fully compress GRAPHICS.SRC
	   /A:    Tells HELPMAKE to view a ':' as an operator
	   /W128  Tells HELPMAKE to truncate lines longer than 128 characters
	   /O     Tells HELPMAKE to name the output file GRAPHICS.HLP
	   /V     Tells HELPMAKE to output verbose encoding information
	
	   "> encode.log" redirects encoding information to ENCODE.LOG
	   This is helpful, but it is not necessary.
	
	4. Copy the new GRAPHICS.HLP to the directory with your other
	   help files.
	
	For further information, refer to the printed or online documentation
	supplied with your version of HELPMAKE.
