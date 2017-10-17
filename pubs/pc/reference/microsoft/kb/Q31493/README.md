---
layout: page
title: "Q31493: Macro to Toggle HOME Key"
permalink: /pubs/pc/reference/microsoft/kb/Q31493/
---

## Q31493: Macro to Toggle HOME Key

	Article: Q31493
	Version(s): 1.00
	Operating System: OS/2
	Flags: ENDUSER | tar66615
	Last Modified: 12-JAN-1989
	
	You can create a macro to do the following:
	
	1. Press HOME key (cursor goes to beginning of line).
	
	2. Press HOME key again (cursor goes to top of window).
	
	3. Press HOME key again (cursor goes to top of buffer).
	
	This technique usually is used to create a toggle key, but it is
	equally applicable to the desired three-step toggle. The technique is
	as follows:
	
	home1:= begline arg "home2:f10" assign
	home2:= home arg "home3:f10" assign
	home3:= mark arg "home1:f10" assign
	home1:f10
	
	After following this procedure, the F10 key will toggle among begline,
	home, and mark.
