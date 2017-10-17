---
layout: page
title: "Q65478: 7.10 Memory Lost If Reassign &#36;DYNAMIC String Array to STRING&#36;"
permalink: /pubs/pc/reference/microsoft/kb/Q65478/
---

## Q65478: 7.10 Memory Lost If Reassign &#36;DYNAMIC String Array to STRING&#36;

	Article: Q65478
	Version(s): 7.00 7.10 | 7.00 7.10
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER | SR# S900816-176 buglist7.00 buglist7.10
	Last Modified: 26-DEC-1990
	
	In a compiled .EXE file, assigning a $DYNAMIC variable-length-string
	array element directly to a BASIC intrinsic string function (such as
	STRING$) creates an internal temporary string that may fail to be
	deallocated. Repetitive reassignments can cause "Out of String Space"
	or "Out of Memory" errors. This article documents this problem with
	Microsoft BASIC Professional Development System (PDS) versions 7.00
	and 7.10 and shows two examples of the problem.
	
	Microsoft has confirmed this to be a problem with BASIC PDS versions
	7.00 and 7.10 for MS-DOS and MS OS/2. This problem does not occur in
	the QBX.EXE environment, or in earlier versions of Microsoft BASIC
	Compiler or QuickBASIC. We are researching this problem and will post
	new information here as it becomes available.
	
	The problem can occur for dynamic variable-length-string array element
	assignments of the form A$(x)=STRING$(n). But this form of assignment
	may not give the problem in some cases, such as in Code Example 1
	where A$(x)=STRING$(n) appears within a FOR...NEXT loop.
	
	Any one of the following code modifications works around the problem:
	
	1. Use a $STATIC array instead of a $DYNAMIC array,
	
	-or-
	
	2. First assign a temporary variable such as temp$ to the BASIC
	   string function (STRING$), then assign the array element to temp$:
	
	   temp$=STRING$(12000)
	   A$(1)=temp$
	   temp$=""
	
	-or-
	
	3. Use the CLEAR statement to erase the memory wasted by the
	   internal temporary string (but CLEAR also erases all other
	   variables).
	
	-or-
	
	4. In some cases, surrounding the assignment with a FOR...NEXT
	   structure may eliminate the problem, such as in Code Example 1.
	
	This problem is not affected by any compiler options that limit
	optimizations (BC /D, /X, etc.). The problem occurs with both near and
	far strings (BC /Fs, /Fn).
	
	Code Example 1
	--------------
	
	The following code example shows one case (in a FOR...NEXT block) that
	reclaims memory properly and three cases that fail to return the
	string memory. In the cases that fail, the a$()=SPACE$() statement
	fails to release an amount of string space equal to the length of the
	string assigned (due to an internal unreleased temporary string).
	Repeated assignments will decrease string memory until string memory
	eventually runs out.
	
	Compile and LINK as follows (compile and LINK options do not affect
	the problem):
	
	   BC STRING;
	   LINK STRING;
	
	REM $DYNAMIC
	CLS
	DIM a$(10)
	  PRINT "FRE(a$(1)) at start of program: ", FRE(a$(1))
	
	  PRINT "Case #1: memory recovered if string deallocated in FOR loop."
	  PRINT "For loop works fine -- memory restored"
	  FOR i% = 12000 TO 0 STEP -12000
	    a$(1) = SPACE$(i%)
	    PRINT "Free during FOR loop: ", FRE(a$(1))
	  NEXT
	
	  PRINT "Case #2: Prompt user for size of string."
	  INPUT "Input big number (try 12000):", big%
	  a$(1) = SPACE$(big%)   'Both A$(1) & internal string consume memory:
	  PRINT "FRE(a$(1)) after allocation: ", FRE(a$(1))
	  INPUT "Input a small number (0):", small%
	  a$(1) = SPACE$(small%) 'Internal temporary string still wastes memory:
	  PRINT "FRE(a$(1)) after deallocation: ", FRE(a$(1))
	
	  PRINT
	  PRINT "Case #3. String of 12000 bytes assigned."
	  big% = 12000
	  a$(1) = SPACE$(big%)
	  PRINT "FRE(a$(1)) after allocation: ", FRE(a$(1))
	  small% = 0
	  a$(1) = SPACE$(small%)
	  PRINT "FRE(a$(1)) after deallocation: ", FRE(a$(1))
	
	  PRINT "Case #4: Another string of 12000 bytes assigned."
	  a$(1) = SPACE$(12000)
	  PRINT "FRE(a$(1)) after allocation: ", FRE(a$(1))
	  a$(1) = SPACE$(0)
	  PRINT "FRE(a$(1)) after deallocation: ", FRE(a$(1))
	END
	
	Code Example 2
	--------------
	
	The program below shows that the problem also occurs in $DYNAMIC
	arrays in SUBprograms.
	
	Compile and link as follows:
	
	   BC STRING2.BAS ;
	   LINK STRING2 ;
	
	DECLARE SUB sub1 ()
	CALL sub1
	END
	SUB sub1
	  DIM s(2) AS STRING   'This array is dynamic, since SUB is non-STATIC
	  PRINT "FRE before string allocation: "; FRE(s(0))
	  s(1) = STRING$(1000, 255)
	  PRINT "FRE after string allocation: "; FRE(s(1))
	  s(1) = ""
	  PRINT "FRE after string deallocation: "; FRE(s(2))
	END SUB
