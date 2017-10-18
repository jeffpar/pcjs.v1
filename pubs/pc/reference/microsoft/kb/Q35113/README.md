---
layout: page
title: "Q35113: Nested Dups in Structure Cause Recursive Loop"
permalink: /pubs/pc/reference/microsoft/kb/Q35113/
---

## Q35113: Nested Dups in Structure Cause Recursive Loop

	Article: Q35113
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | buglist5.10
	Last Modified: 12-JAN-1989
	
	The following code uses nested dup operators in a structure
	initialization:
	
	seltable SELENTRY MINSELS/4 dup (,.,3 dup (<SEL_UNUSED>))
	
	MASM goes into a recursive loop at the calculation of the size. You
	can work around this problem by having three instances listed, as
	follows:
	
	seltable SELENTRY MINSELS/4 dup (<>,<SEL_UNUSED>,<SEL_UNUSED>,
	   <SEL_UNUSED>)
	
	Microsoft has confirmed this to be a problem in Version 5.10. We are
	researching this problem and will post new information as it becomes
	available.
