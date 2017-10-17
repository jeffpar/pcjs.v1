---
layout: page
title: "Q44331: QuickC tolower Macro Descriptions Contradictory"
permalink: /pubs/pc/reference/microsoft/kb/Q44331/
---

## Q44331: QuickC tolower Macro Descriptions Contradictory

	Article: Q44331
	Version(s): 2.00
	Operating System: MS-DOS
	Flags: ENDUSER | docerr
	Last Modified: 25-MAY-1989
	
	The summary and description given for the tolower macro in the QuickC
	2.00 on-line help are contradictory.
	
	The summary text given is as follows:
	
	    (tolower) lowercase equivalent of c only
	              if c is an uppercase letter.
	    (_tolower) lowercase equivalent of c
	
	The description text is as follows:
	
	    The tolower macro converts c to lowercase if c represents an
	    uppercase letter. Otherwise, c is unchanged. The _tolower macro
	    is a version of tolower to be used only when c is known to be
	    uppercase. The result of _tolower is undefined if c is not an
	    uppercase letter.
	
	These descriptions imply different cases for the two macros tolower
	and _tolower. The summary indicates that tolower will only function on
	characters known to be uppercase; however, the description indicates
	the opposite. A more accurate summary is given in the "Microsoft C
	Run-Time Library Reference," which states the following:
	
	    int tolower(c);     Converts c to lowercase if appropriate
	    int _tolower(c);    Converts c to lowercase
	
	In other words, the description section in on-line help is correct;
	_tolower should only be used when c is KNOWN to be uppercase.
