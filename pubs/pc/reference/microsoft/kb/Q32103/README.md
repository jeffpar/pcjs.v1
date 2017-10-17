---
layout: page
title: "Q32103: &quot;Too Many Files&quot; When Using Make EXE Option in QB.EXE Editor"
permalink: /pubs/pc/reference/microsoft/kb/Q32103/
---

## Q32103: &quot;Too Many Files&quot; When Using Make EXE Option in QB.EXE Editor

	Article: Q32103
	Version(s): 4.00 4.00b
	Operating System: MS-DOS
	Flags: ENDUSER | buglist4.00 buglist4.00b fixlist4.50 B_BasicCom
	Last Modified: 8-DEC-1989
	
	A "Too Many Files" error may occur when using the Make EXE File option
	from the Run menu to compile a multimodule program and a Quick library
	from the QB.EXE editor. The error message occurs immediately after you
	choose Make EXE File (or Make EXE And Exit) from the Run menu. The
	program can run successfully within the editor or can be compiled and
	linked successfully on the DOS level.
	
	The problem is caused by an overflow of the buffer containing the
	names and directories of the modules and the Quick library. The
	program will compile successfully if one or more of the module names
	are shortened, or if the directory names are shortened as shown in the
	formula below.
	
	Microsoft has confirmed this to be a problem in QuickBASIC Versions
	4.00 and 4.00b and in the version of QuickBASIC provided with the
	Microsoft BASIC Compiler Versions 6.00 and 6.00b for MS-DOS and MS
	OS/2 (buglist6.00, buglist6.00b). This problem was corrected in
	QuickBASIC Version 4.50 and in QBX.EXE of the Microsoft BASIC Compiler
	Version 7.00 (fixlist7.00).
	
	The formula below can be used to determine if the buffer is full. You
	can successfully use Make EXE from the editor if the following holds
	true:
	
	   A + B + C + D + E < 80
	
	In the formula above, the following is true:
	
	A = The total number of characters in all the module names loaded
	    into the QuickBASIC editor. Do not count .BAS.
	
	B = The number of modules loaded into QuickBASIC.
	
	C = The total number of characters in the path QuickBASIC is
	    invoked from. (Add up all the characters in all the directories
	    and subdirectories.) For example, "C:\QUICK\SUBDIR" has 15
	    characters in it.
	
	D = The number of directories and subdirectories in the path
	    QuickBASIC is invoked from. For "C:\QUICK\SUBDIR", there is
	    one root directory and two subdirectories, so D=3.
	
	E = The number of characters used to list the Quick library when
	    QuickBASIC was invoked, e.g. in "QB /L foo" E = 3, and in "QB
	    /L /testdir/roo/foo" E = 16. Please note that if the drive is
	    also included, do not count the colon, therefore, for "QB /L
	    a:foo" E = 4.
	
	The following steps demonstrate the "Too Many Files" problem:
	
	1. Create the following files:
	
	      BASFILE1.BAS
	      BASFILE2.BAS            (The code is not important. Each module
	      BASFILE3.BAS             can just say PRINT "Hello".)
	      BASFILE4.BAS
	      BASFILE5.BAS
	      BASFILE6.BAS
	      BASFILE7.BAS
	      B.BAS
	      BA.BAS
	      BAS.BAS
	      BASF.BAS
	      BASFI.BAS
	      BASFIL.BAS
	
	2. Make B into a Quick library.
	
	3. Make an eight-character directory as follows:
	
	      mkdir TESTDIR1
	
	4. Invoke QuickBASIC (QB.EXE) with the following command:
	
	      C:\TESTDIR1>  QB /L B
	
	5. Load the seven BASFILEx.BAS files plus either [BASFIL.BAS, BAS.BAS,
	   and BA.BAS] or [BASF.BAS and C.BAS].
	
	6. Choose Make EXE File... (or Make EXE And Exit) from the Run menu.
	
	7. A "Too Many Files" error may now appear.
