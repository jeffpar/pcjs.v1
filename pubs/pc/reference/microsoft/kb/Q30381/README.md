---
layout: page
title: "Q30381: Command Line Option /E Generates a Bad Fixup Record"
permalink: /pubs/pc/reference/microsoft/kb/Q30381/
---

## Q30381: Command Line Option /E Generates a Bad Fixup Record

	Article: Q30381
	Version(s): 5.10
	Operating System: MS-DOS
	Flags: ENDUSER | buglist5.10
	Last Modified: 23-MAY-1988
	
	The assembler will generate bad fixup records for floating point
	instructions.
	   An example of this problem is the "FMUL" instruction, which will
	generate the following fixup record:
	
	FIXUP
	 003:    fixup  seg  rel  offset     offset  0     fixup on 0xde9b
	         frame  loc  target ext "FIDRQQ"
	
	   The frame method "loc" means Intel frame method number four. This
	means the fixup frame is the same as the segment of the location.
	   For floating point symbols this is meaningless, particularly in
	OS/2 and Windows. The frame method should be changed to frame method
	number five. Frame method number five would make the frame and the
	target segment the same.
	   The LINK utility will ignore the frame method.
	
	   Microsoft is researching this problem and will post new information
	as it becomes available.
