---
layout: page
title: "Q36736: RANDOMIZE Statements Reseed but Don't Restart RND Sequence"
permalink: /pubs/pc/reference/microsoft/kb/Q36736/
---

## Q36736: RANDOMIZE Statements Reseed but Don't Restart RND Sequence

	Article: Q36736
	Version(s): 1.00 1.01 1.02 2.00 2.01 3.00 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom B_BasicInt B_GWBasicI B_MQuickB
	Last Modified: 11-JAN-1990
	
	The first invocation of the RANDOMIZE statement determines a given set
	of random numbers returned from successive calls to the RND function.
	Not invoking the RANDOMIZE statement in a program is equivalent to
	invoking RANDOMIZE 0 before invoking RND. Note that a second (or
	subsequent) RANDOMIZE x statement does not restart the number sequence
	from the beginning of the set for a given x, but it randomly changes
	(reseeds) the sequence from what it would have been from that point
	on. This behavior is by design. Example 2 below illustrates this in
	detail.
	
	If you want to return the same sequence of random numbers several
	times within a given program run, you can invoke the RND function with
	the exact same negative number argument followed by a sequence of RND
	invocations with a positive argument or no argument. Invoking RND with
	a negative argument eliminates the effect of a previous RANDOMIZE
	statement. Please see Example 1 below for further illustration.
	
	This behavior of the RANDOMIZE statement and the RND function occurs
	in most versions of Microsoft BASIC, including the following:
	
	1. Microsoft QuickBASIC Versions 1.00, 1.01, 1.02, 2.00, 2.01, 3.00,
	   4.00, 4.00b, and 4.50 for the IBM PC
	
	2. Microsoft BASIC Compiler Versions 5.35 and 5.36 for MS-DOS
	
	3. Microsoft BASIC Compiler Versions 6.00 and 6.00b for MS-DOS and MS
	   OS/2
	
	4. Microsoft BASIC PDS Version 7.00 for MS-DOS and MS OS/2
	
	5. Microsoft GW-BASIC Interpreter Versions 3.20, 3.22, and 3.23 for
	   MS-DOS
	
	6. Microsoft QuickBASIC Version 1.00 for the Apple Macintosh
	
	7. Microsoft BASIC Compiler Version 1.00 for the Apple Macintosh
	
	8. Microsoft BASIC Interpreter Versions 1.00, 1.01, 2.00, 2.10, and
	   3.00 for the Apple Macintosh
	
	Other BASICs may behave differently.
	
	If you would like an alternative to this behavior of RND and
	RANDOMIZE, you may use your own formula to generate random numbers as
	shown in a separate article. (Query in this database for the keywords
	RANDOM and EQUATION.)
	
	The following is Example 1:
	
	(This example of invoking RND once with a negative argument always
	returns the same sequence of random numbers for subsequent invocations
	of RND.)
	
	CLS
	RANDOMIZE TIMER   ' Ignored unless you remove RND(-1) below.
	FOR j = 1 TO 2
	 ' Passing a negative value to the RND function supersedes the effect
	 ' of the previous RANDOMIZE TIMER statement:
	 PRINT RND(-1)   ' Remove this line for a different sequence on every
	                 ' loop iteration. Otherwise, each j loop iteration
	                 ' (and separate program run) returns the same
	                 ' three-number sequence for the inner i loop.
	 FOR i = 1 TO 3
	    PRINT RND
	 NEXT I
	 PRINT
	NEXT J
	
	The following is Example 2:
	
	FOR k = 1 TO 5
	  PRINT RND
	NEXT k
	
	Below is the default random number set output from the above program,
	when run with QB.EXE Version 4.00 on an IBM PC. The following sequence
	of random numbers varies with different versions of Microsoft
	QuickBASIC and BASIC Compilers:
	
	   .7107346
	   .99058
	   .8523988
	   .3503776
	   4.363585E-02
	
	The following code shows the effect of RANDOMIZE 0 at start-up:
	
	PRINT  "Set the seed to zero at startup"
	RANDOMIZE 0
	FOR k = 1 TO 5
	  PRINT RND
	NEXT k
	PRINT "Again, reset the seed to zero"
	RANDOMIZE 0
	FOR k = 1 TO 5
	  PRINT RND
	NEXT k
	
	The above program has the following output:
	
	   Set the seed to zero at startup
	    .7107346
	    .99058
	    .8523988
	    .3503776
	    4.363585E-02
	   Again, reset the seed to zero
	    .7987763
	    .6497337
	    .5426014
	    .9642789
	    8.590406E-02
	
	Note: The second invocation of RANDOMIZE 0 does not restart the
	sequence from the beginning. This is by design. If you remove the
	second RANDOMIZE 0 statement and run the program again, the 6th
	through 10th numbers are different than above. This shows that
	multiple RANDOMIZE statements reseed the sequence (and change the
	random number set displayed), but they do not restart the sequence
	from the beginning.
