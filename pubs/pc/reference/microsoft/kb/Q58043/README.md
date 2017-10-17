---
layout: page
title: "Q58043: PLAY &quot;Illegal Function Call&quot; for &quot;B+&quot;,&quot;C-&quot;,&quot;E+&quot;, and &quot;F-&quot;"
permalink: /pubs/pc/reference/microsoft/kb/Q58043/
---

## Q58043: PLAY &quot;Illegal Function Call&quot; for &quot;B+&quot;,&quot;C-&quot;,&quot;E+&quot;, and &quot;F-&quot;

	Article: Q58043
	Version(s): 1.00 1.01 1.02 2.00 2.01 3.00 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | buglist4.00 buglist4.00b buglist4.50 B_BasicCom B_GWBasicI
	Last Modified: 20-SEP-1990
	
	The PLAY statement causes an "Illegal Function Call" error when given
	any of these notes: "B+", "C-", "E+", or "F-". These are valid notes
	(since they are the equivalent of natural notes) and should not cause
	the error.
	
	Microsoft has confirmed this to be a problem in QuickBASIC versions
	1.00, 1.01, 1.02, 2.00, 2.01, 3.00, 4.00, 4.00b, and 4.50; in
	Microsoft BASIC Compiler versions 6.00 and 6.00b (buglist6.00,
	buglist6.00b); in Microsoft BASIC Professional Development System
	(PDS) versions 7.00 and 7.10 for MS-DOS (buglist7.00, buglist7.10);
	and in Microsoft GW-BASIC versions 3.23, 3.22, and 3.20 (buglist3.20,
	buglist3.22, buglist3.23). We are researching this problem and will
	post new information here as it becomes available.
	
	To work around this problem, check for those notes and use their
	natural equivalents (listed below).
	
	The following table lists the errant notes and their equivalents for
	the workaround:
	
	   Errant Note  Equivalent
	   -----------  ----------
	
	       B+           C
	       C-           B
	       E+           F
	       F-           E
	
	By using the workaround listed above, the following statement would
	changed as follows:
	
	   PLAY "B+C-E+F-"    'changed to PLAY "CBFE"
	
	Additional reference words: buglist1.00 buglist1.01 buglist1.02
	buglist2.00 buglist2.01 buglist3.00 SR# S900117-43
