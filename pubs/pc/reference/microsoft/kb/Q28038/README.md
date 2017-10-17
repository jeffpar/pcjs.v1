---
layout: page
title: "Q28038: No &quot;Incompatible Runtime&quot; CHAIN Error with Mismatched COMMON"
permalink: /pubs/pc/reference/microsoft/kb/Q28038/
---

## Q28038: No &quot;Incompatible Runtime&quot; CHAIN Error with Mismatched COMMON

	Article: Q28038
	Version(s): 6.00   | 6.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | buglist6.00 buglist6.00b buglist7.00 runtime
	Last Modified: 30-MAY-1990
	
	The problem under Microsoft BASIC Compiler version 6.00 and 6.00b is
	as follows:
	
	1. A routine that has a blank COMMON block is built into a custom
	   run-time module with BUILDRTM.EXE.
	
	2. Main1 contains the same blank COMMON (matched exactly in length).
	
	3. Main2 contains the same blank COMMON plus some more blank COMMON.
	
	4. Main3 contains the same blank COMMON as Main2.
	
	5. Main1 chains to Main2, which puts something in the EXTENDED portion
	   of COMMON, then chains to Main3. Main3 expects something to be
	   there, but it is gone.
	
	There should be an error on the chain to Main2 since we cannot enlarge
	blank COMMON when there is a set size of blank COMMON in the custom
	run-time module. An error should have been generated during the chain.
	When Main2 is run as a stand alone, the "incompatible runtime module"
	error message appears.
	
	Microsoft has confirmed this to be a problem in Microsoft BASIC
	Compiler versions 6.00 and 6.00b, and in Microsoft BASIC Professional
	Development System (PDS) version 7.00. We are researching this problem
	and will post new information here as it becomes available.
	
	When using Microsoft BASIC PDS version 7.00 for MS-DOS and MS OS/2,
	any inclusion of a COMMON block into a custom run-time module will
	result in an "incompatible runtime module" error, even if the COMMON
	statement(s) in the run-time match the COMMON in the program(s).
	If you link IMPORT.OBJ as the first .OBJ file on the link line,
	this is not a problem.
	
	The following is code example for Microsoft BASIC Compiler versions
	6.00 and 6.00b:
	
	MAIN1:
	
	  common a,b,c     'This COMMON matches the COMMON in the custom run time
	  a=1
	  b=2
	  c=3
	  chain "main2"
	  end
	
	MAIN2:
	
	  common a,b,c,d,e  'It is not legal to add more elements to the blank
	                    'COMMON if you are using a custom run time.
	  d=4
	  e=5
	  chain "main3"
	  end
	
	MAIN3:
	
	  common a,b,c,d,e
	  print a,b,c,d,e
	  end
