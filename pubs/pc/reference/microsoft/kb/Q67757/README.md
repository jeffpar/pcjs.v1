---
layout: page
title: "Q67757: Conditional Jump Instruction Is Incorrectly Documented"
permalink: /pubs/pc/reference/microsoft/kb/Q67757/
---

## Q67757: Conditional Jump Instruction Is Incorrectly Documented

	Article: Q67757
	Version(s): 5.00 5.10 | 5.10
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER | docerr
	Last Modified: 6-FEB-1991
	
	Page 336 of the "Microsoft Macro Assembler 5.1 Programmer's Guide"
	shipped with MASM version 5.00 and 5.10 has a table that lists the
	various conditional jump instructions, what each means, and whether
	each acts on a signed or unsigned value. The table has the
	signed/unsigned values mixed up.
	
	The table currently states:
	
	   Letter  Meaning
	   ------  -------
	
	    J      Jump
	    G      Greater than (for unsigned comparisons)
	    L      Less than (for unsigned comparisons)
	    A      Above (for signed comparisons)
	    B      Below (for signed comparisons)
	    E      Equal
	    N      Not
	
	It should read:
	
	   Letter  Meaning
	   ------  -------
	
	    J      Jump
	    G      Greater than (for signed comparisons)
	    L      Less than (for signed comparisons)
	    A      Above (for unsigned comparisons)
	    B      Below (for unsigned comparisons)
	    E      Equal
	    N      Not
