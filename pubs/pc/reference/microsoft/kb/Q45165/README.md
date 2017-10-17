---
layout: page
title: "Q45165: &quot;Too Many Segments&quot; LINKing More Than 128 Modules"
permalink: /pubs/pc/reference/microsoft/kb/Q45165/
---

## Q45165: &quot;Too Many Segments&quot; LINKing More Than 128 Modules

	Article: Q45165
	Version(s): 2.00 2.01 3.00 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S890512-130 B_BasicCom
	Last Modified: 13-DEC-1989
	
	The linker error message L1049 "Too many segments" occurs when you are
	trying to LINK more than 128 modules into an .EXE program or a Quick
	library. The default number of segments for LINK.EXE is 128. To
	correct this problem, combine two or more of the modules (the .BAS
	source files).
	
	If the modules are too large to combine, you must set the number of
	segments to more than 128 with the /SEGMENTS linker option. The
	maximum number of segments is 1024, or 1K. If you compile and link
	within the QuickBASIC environment instead of from the DOS command
	line, you can set the /SEGMENTS option by including the following line
	in your AUTOEXEC.BAT file:
	
	   SET LINK= /SEGMENTS:<number of segments>
	
	Note that there is no space before the "=", and one space after the
	"=".
	
	This information applies to Microsoft QuickBASIC Versions 2.00, 2.01,
	3.00, 4.00, 4.00b, and 4.50 and to Microsoft BASIC Compiler Versions
	6.00, and 6.00b and to Microsoft BASIC PDS 7.00.
	
	To determine the number of segments you are generating, use the
	following guidelines. A module in QuickBASIC is exactly the same as a
	.BAS file. Each module compiles to one code segment. All of the data
	in the program is combined at LINK time into one single data segment.
	There is only one data segment, no matter how many modules you
	compile. Therefore, the number of segments is as follows:
	
	   NumberOfSegments = [number of .BAS files you start with] + 1
	
	If you are using a library, each .BAS file that was compiled and put
	into the library must be included in the above formula.
	
	The "Too many segments" error message can also occur when using the
	BUILDRTM utility of Microsoft BASIC Compiler 6.00, 6.00b and to
	Microsoft BASIC PDS 7.00 to combine more than 128 modules into a
	run-time module. This happens because BUILDRTM.EXE uses LINK.EXE to
	create a run-time module. The workarounds are the same as above: combine
	one or more modules or SET the LINK environment variable.
