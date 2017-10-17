---
layout: page
title: "Q52091: Library Naming Conventions for BASIC PDS 7.00"
permalink: /pubs/pc/reference/microsoft/kb/Q52091/
---

## Q52091: Library Naming Conventions for BASIC PDS 7.00

	Article: Q52091
	Version(s): 7.00   | 7.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | SR# S891206-120
	Last Modified: 14-JAN-1990
	
	The following article explains the library naming conventions used by
	Microsoft BASIC Professional Development System (PDS) Version 7.00 for
	MS-DOS and MS OS/2.
	
	In Microsoft BASIC PDS Version 7.00, library names are acronyms that
	follow a standard format:
	
	   NAMEmso.LIB
	       m = Alternate (A) or Emulation (E) math package.
	       s = Far (F) or Near (N) variable-length string storage.
	       o = Protected (P) or Real (R) mode operating system.
	
	The format starts with a base NAME of several characters used to
	identify the function of the library (such as BRT70, BCL70, FINANC,
	FONTB, MATB, etc.). Next is a two- or three-character extension
	specifying support for which math package (emulation or alternate
	math), variable-length string storage (near or far), or operating
	system (real or protected mode).
	
	Real mode refers to the DOS Version 3.x box in MS OS/2, or to straight
	MS-DOS. Protected mode refers to MS OS/2 only.
	
	BASIC Run-Time Libraries
	------------------------
	
	   BRT70EFR.LIB, BRT70ENR.LIB, BRT70EFP.LIB, BRT70ENP.LIB
	   BRT70ANR.LIB, BRT70AFR.LIB, BRT70ANP.LIB, BRT70AFP.LIB
	
	   Format: BRT70mso.LIB
	                m = Alternate (A) or Emulation (E) math package.
	                s = Far (F) or Near (N) strings.
	                o = Protected (P) or Real (R) mode operating system.
	
	BASIC Stand-Alone Libraries
	---------------------------
	
	   BCL70EFR.LIB, BCL70ENR.LIB, BCL70EFP.LIB, BCL70ENP.LIB
	   BCL70ANR.LIB, BCL70AFR.LIB, BCL70ANP.LIB, BCL70AFP.LIB
	
	   Format: BCL70mso.LIB    (where the mso letters are defined above)
	
	Financial Libraries
	-------------------
	
	   FINANCER.LIB, FINANCAR.LIB, FINANCEP.LIB, FINANCAP.LIB
	
	   Format: FINANCmo.LIB    (where the mo letters are defined above)
	   (Name is not dependent upon Far or Near string storage.)
	
	   FINANCER.QLB is the Quick library for use in the QBX.EXE
	   environment.
	
	Date/Time Format Libraries
	--------------------------
	
	   DTFMTER.LIB, DTFMTAR.LIB, DTFMTEP.LIB, DTFMTAP.LIB
	
	   Format: DTFMTmo.LIB    (where the mo letters are defined above)
	   (Name is not dependent upon Far or Near string storage.)
	
	   DTFMTER.QLB is the Quick library for use in the QBX.EXE
	   environment.
	
	Font Libraries
	--------------
	
	   FONTBEFR.LIB, FONTBENR.LIB, FONTBANR.LIB, FONTBAFR.LIB
	
	   Format: FONTBmsR.LIB    (where the ms letters are defined above)
	   (There is no protected mode version.)
	
	   FONTBEFR.QLB is the Quick library for use in the QBX.EXE
	   environment.
	
	Matrix Operations Toolbox Libraries
	-----------------------------------
	
	   MATBEFR.LIB, MATBENR.LIB, MATBEFP.LIB, MATBENP.LIB
	   MATBANR.LIB, MATBAFR.LIB, MATBANP.LIB, MATBAFP.LIB
	
	   Format: MATBmso.LIB    (where the mso letters are defined above)
	
	   MATBEFR.QLB is the Quick library for use in the QBX.EXE
	   environment.
	
	User Interface Toolbox Libraries
	--------------------------------
	
	   UITBEFR.LIB, UITBENR.LIB, UITBEFP.LIB, UITBENP.LIB
	   UITBANR.LIB, UITBAFR.LIB, UITBANP.LIB, UITBAFP.LIB
	
	   Format: UITBmso.LIB    (where the mso letters are defined above)
	
	   UITBEFR.QLB is the Quick library for use in the QBX.EXE
	   environment.
	
	Presentation Graphics Toolbox Libraries
	---------------------------------------
	
	   CHRTBEFR.LIB, CHRTBENR.LIB, CHRTBEFP.LIB, CHRTBENP.LIB
	   CHRTBANR.LIB, CHRTBAFR.LIB, CHRTBANP.LIB, CHRTBAFP.LIB
	
	   Format: CHRTBmso.LIB    (where the mso letters are defined above)
	
	   CHRTBEFR.QLB is the Quick library for use in the QBX.EXE
	   environment.
	
	Stub Library
	------------
	
	   NOTRNEMR.LIB, NOTRNEMP.LIB
	
	   Format: NOTRNEMo.LIB
	                  o = Protected (P) or Real (R) mode operating system.
	
	   Description: A stub library file that removes all intrinsic math
	                functions including LOG, SQR, SIN, COS, TAN, ATN, EXP,
	                ^, CIRCLE statements with a start and/or stop angle,
	                and DRAW statements with A or T commands.
	
	   (NOTRNEMR.LIB and NOTRNEMP.LIB are the only .LIB stub files in
	   BASIC 7.00. For a list of .OBJ stub files, refer to Pages 540 and
	   541 of "Microsoft BASIC Version 7.0: Programmer's Guide.")
	
	OTHER LIBRARY NAMING CONVENTIONS
	--------------------------------
	
	ISAM Libraries
	--------------
	
	   PROISAMD.LIB, PROISAM.LIB
	
	   PROISAMD.LIB gives you full ISAM support, including the data
	   dictionary routines for creating and deleting indexes, tables, and
	   databases. PROISAM.LIB (with no D) supports ISAM programs without
	   the ability to create or delete indexes, tables, or databases.
	
	   PROISAM.EXE and PROISAMD.EXE are the TSR (Terminate-and-Stay-
	   Resident) programs that provide ISAM support in the QBX.EXE
	   environment, or in .EXE programs where you don't wish to link the
	   ISAM support directly to your .EXE file.
	
	OS/2 Function Library
	---------------------
	
	   Name: OS2.LIB
	   Description: Used for operating system calls into MS OS/2.
