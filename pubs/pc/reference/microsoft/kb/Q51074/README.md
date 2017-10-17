---
layout: page
title: "Q51074: May Be LINK Error If Separate Source Files Have Same Root Name"
permalink: /pubs/pc/reference/microsoft/kb/Q51074/
---

## Q51074: May Be LINK Error If Separate Source Files Have Same Root Name

	Article: Q51074
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom
	Last Modified: 15-MAR-1990
	
	LINK.EXE puts the code of separate BASIC OBJect files into the same
	code segment when the base filenames of the source code are the same
	but the filename extensions are different. This procedure will lead to
	the normal code-size-limitation linker error messages, such as the
	following, if the resulting code segment becomes too large:
	
	   L1070      "SEGMENT SIZE EXCEEDS 64K"
	   L2002      "FIXUP OVERFLOW NEAR ..."
	
	If the combined code segment is smaller than the 64K limit, then no
	LINK error occurs and the program should run correctly.
	
	This information applies to Microsoft QuickBASIC Versions 4.00, 4.00b,
	and 4.50 for MS-DOS, to Microsoft BASIC Compiler Versions 6.00 and
	6.00b for MS-DOS and MS OS/2, and to Microsoft BASIC PDS 7.00 for
	MS-DOS and MS OS/2.
	
	A related issue in QBX.EXE which is supplied with BASIC PDS 7.00 is if
	a module and an $INCLUDE file are loaded into QBX.EXE at the same time
	and have the same base name, QBX.EXE will not let you run the program
	and gives the message "Duplicate module base name loaded. Can't
	compile." To work around this problem, unload the include file or use
	a different base name for your include file.
	
	Code Example
	------------
	
	The two modules (MAIN.BAS and MAIN.1) in the following example
	generate object files (MAIN.OBJ and MAIN1.OBJ), which are small enough
	to link successfully, but they show that the LINKer combines them into
	one code segment, MAIN_CODE.
	
	Compile two programs, MAIN.BAS and MAIN.1, where MAIN.BAS is the main
	module and MAIN.1 is a module of subroutines.
	
	The following is MAIN.BAS:
	
	   DECLARE SUS SUB1()
	   CALL SUB1
	   PRINT "I'M BACK"
	
	The following is MAIN.1:
	
	   SUB SUB1()
	      PRINT "IN SUB"
	   END SUB
	
	Compile as follows, renaming the object file for MAIN.1 to MAIN1.OBJ
	to distinguish it from the other module, MAIN.OBJ:
	
	   BC MAIN.BAS;
	   BC MAIN.1,MAIN1.OBJ;
	
	Then LINK and create a LINKer .MAP file:
	
	   LINK MAIN MAIN1,,MAIN.MAP;
	
	If the subroutine module MAIN.1 is named MAIN1.BAS, the resulting
	.EXE file will have two code segments (two BC_CODE entries listed
	under "Class" in the LINKer .MAP file). But the .EXE program resulting
	from the above instructions will have only one code segment, as shown
	in the following link map (from MAIN.1 and MAIN.BAS compiled in
	QuickBASIC 4.50):
	
	 Start  Stop   Length Name                   Class
	 00000H 000A0H 000A1H MAIN_CODE              BC_CODE
	 000B0H 002F5H 00246H _TEXT                  CODE
	 002F6H 00977H 00682H LOADRTM                CODE
	 00980H 0173FH 00DC0H BR_DATA                BLANK
	 01740H 01740H 00000H BR_SKYS                BLANK
	 01740H 01740H 00000H COMMON                 BLANK
	 01740H 0174BH 0000CH BC_DATA                BC_VARS
	 0174CH 01751H 00006H NMALLOC                BC_VARS
	 01752H 01752H 00000H ENMALLOC               BC_VARS
	 01752H 01752H 00000H BC_FT                  BC_SEGS
	 01760H 01779H 0001AH BC_CN                  BC_SEGS
	 01780H 01792H 00013H BC_DS                  BC_SEGS
	 01794H 01794H 00000H BC_SAB                 BC_SEGS
	 01794H 0179FH 0000CH BC_SA                  BC_SEGS
	 017A0H 017A0H 00000H _DATA                  DATA
	 017A0H 017BBH 0001CH CDATA                  DATA
	 017BCH 017BCH 00000H XCB                    DATA
	 017BCH 017BFH 00004H XC                     DATA
	 017C0H 017C0H 00000H XCE                    DATA
	 017C0H 017C0H 00000H XIFB                   DATA
	 017C0H 017C0H 00000H XIF                    DATA
	 017C0H 017C0H 00000H XIFE                   DATA
	 017C0H 017C0H 00000H XIB                    DATA
	 017C0H 017C0H 00000H XI                     DATA
	 017C0H 017C0H 00000H XIE                    DATA
	 017C0H 017C0H 00000H XPB                    DATA
	 017C0H 017C0H 00000H XP                     DATA
	 017C0H 017C0H 00000H XPE                    DATA
	 017C0H 017C0H 00000H XCFB                   DATA
	 017C0H 017C0H 00000H XCF                    DATA
	 017C0H 017C0H 00000H XCFE                   DATA
	 017C0H 017CBH 0000CH DBDATA                 DATA
	 017CCH 017CCH 00000H XOB                    BSS
	 017CCH 017CCH 00000H XO                     BSS
	 017CCH 017CCH 00000H XOE                    BSS
	 017D0H 01FCFH 00800H STACK                  STACK
	
	 Origin   Group
	 0098:0   DGROUP
	
	Program entry point at 002F:00CE
