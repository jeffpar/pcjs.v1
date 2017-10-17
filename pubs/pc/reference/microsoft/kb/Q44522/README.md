---
layout: page
title: "Q44522: Regular Expressions in QuickC 2.00"
permalink: /pubs/pc/reference/microsoft/kb/Q44522/
---

## Q44522: Regular Expressions in QuickC 2.00

	Article: Q44522
	Version(s): 2.00
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 25-MAY-1989
	
	Question:
	
	When using QuickC 2.00 and the regular-expression search parameters,
	there seems to be an inconsistency in the way they are handled when
	more than one regular expression is used in a search. For instance,
	suppose I have the following string in my source file:
	
	   "VUTTVVUU"
	
	The string is found when I search using the following regular
	expression:
	
	   "[TUV]*"
	
	If I search with the following regular expression, I would expect it
	to find the data between quoted strings, but it matches each
	individual character:
	
	   [TUV]*
	
	How is this inconsistency explained?
	
	Response:
	
	The regular expressions work as described in the QuickC 2.00 on-line
	help. When more than one expression is used in a search, the results
	are unpredictable. The example above is one such inconsistency that
	occurs.
	
	Only one regular expression should be used per search. Regular
	expressions, within QuickC, were not meant to write complex search
	strings. If such functionality is desired, it is better to use another
	editor capable of such operations.
