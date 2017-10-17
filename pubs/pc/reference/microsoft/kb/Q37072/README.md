---
layout: page
title: "Q37072: meta Anomalous Behavior"
permalink: /pubs/pc/reference/microsoft/kb/Q37072/
---

## Q37072: meta Anomalous Behavior

	Article: Q37072
	Version(s): 1.00   | 1.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | buglist1.00
	Last Modified: 31-OCT-1988
	
	The following macros written for the M editor exhibit anomalous
	behavior for the function modifier meta. It appears that meta cannot
	modify itself, as demonstrated by the following macros.
	
	Microsoft has confirmed this to be a problem in Version 1.00. We are
	researching this problem and will post new information as it becomes
	available.
	
	Consider the following macros:
	
	   MetaTest:= meta meta +> "meta off"=>0 :>1 "meta on":>0
	   MetaTest:alt+0
	   ; the above macro is supposed to check to see if the function
	   ; modifier meta, invoked by the F9 key, is on or off. Compare
	   ; the results of this macro with the macro immediately following.
	   MetaTest1:= meta +> "meta off"=>0 :>1 "meta on":>0
	   MetaTest1:alt+1
	   ; the MetaTest1 macro fails to differ from the MetaTest macro in
	   ; a significant manner. in contrast, consider the following
	   ; macro, employing the insetmode function modifier.
	   InsertTest:=insertmode insertmode +> "ins off"=>0 :>1 "ins on":>0
	   InsertTest:alt+2.
