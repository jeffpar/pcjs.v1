---
layout: page
title: "Q59526: Multiple Dependency Blocks Are Not Cumulative"
permalink: /pubs/pc/reference/microsoft/kb/Q59526/
---

## Q59526: Multiple Dependency Blocks Are Not Cumulative

	Article: Q59526
	Version(s): 1.00 1.01 1.10 1.11 | 1.01 1.10 1.11
	Operating System: MS-DOS              | OS/2
	Flags: ENDUSER |
	Last Modified: 16-OCT-1990
	
	Question:
	
	Specifying a target in multiple dependency blocks seems to confuse
	NMAKE. If my make file says something similar to the following
	
	FOO.EXE:: FOO1.obj
	FOO.EXE:: FOO2.obj
	FOO.EXE:: FOO3.obj
	  link foo.exe
	
	FOO.EXE:: FOO.RES
	  RC FOO.RES FOO.EXE
	
	and FOO1.OBJ and FOO2.OBJ are newer than FOO.EXE but FOO3.OBJ is not,
	FOO.EXE will not be built. To further confuse the issue, the following
	is the output from running NMAKE with the /d (display file dates)
	option:
	
	C:\>NMAKE /d foo.mak
	
	  foo.exe                    Wed Mar 07 08:42:38 1990
	    foo1.obj                 Thu Mar 08 15:25:44 1990
	** foo1.obj newer than foo.exe
	    foo2.obj                 Wed Mar 08 08:38:56 1990
	** foo2.obj newer than foo.exe
	    foo3.obj                 Thu Mar 01 09:49:52 1990
	    foo.res                  Thu Mar 01 09:49:52 1990
	'foo.exe' is up-to-date.
	
	Obviously, NMAKE realizes the foo1 and foo2 .OBJs are newer, but
	FOO.EXE is never linked. Why not?
	
	Response:
	
	The multiple dependency construct, indicated by a double colon (::)
	following the target, is very useful in NMAKE because it allows the
	programmer to specify what operations are to take place on a target
	based on various dependents. For instance, in PM (Presentation
	Manager) programming the MAKE file can indicate that if the .OBJs
	change, execute the linker to rebuild the application. On the other
	hand, if all that changes is the resource file, only the resource
	compiler needs to be executed.
	
	However, there is a limitation to this feature. The command block for
	a target-dependency group MUST immediately follow it. They are not
	cumulative like normal dependency blocks. Therefore, one workaround to
	the above example is the following:
	
	FOO.EXE:: FOO1.obj
	  link foo.exe
	
	FOO.EXE:: FOO2.obj
	  link foo.exe
	
	FOO.EXE:: FOO3.obj
	  link foo.exe
	
	FOO.EXE:: FOO.RES
	  RC FOO.RES FOO.EXE
	
	The second alternative is to put all the dependencies on the same
	line as the target, for example:
	
	FOO.EXE:: FOO1.obj FOO2.obj FOO3.obj
	  link foo.exe
	
	FOO.EXE:: FOO.RES
	  RC FOO.RES FOO.EXE
