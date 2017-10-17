---
layout: page
title: "Q57644: BC 6.00/6.00b ERROUT.EXE Utility, &quot;Command Failed&quot; Error"
permalink: /pubs/pc/reference/microsoft/kb/Q57644/
---

## Q57644: BC 6.00/6.00b ERROUT.EXE Utility, &quot;Command Failed&quot; Error

	Article: Q57644
	Version(s): 6.00 6.00b
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S891019-106 docerr
	Last Modified: 14-JAN-1990
	
	Contrary to Pages 328 and 329 of the "Microsoft CodeView and
	Utilities: Software Development Tools for MS-DOS" manual, the
	ERROUT.EXE utility supplied with Microsoft BASIC Compiler Versions
	6.00 and 6.00b works only with .EXE or .COM files.
	
	When running any DOS command line other than an .EXE or .COM file,
	ERROUT fails to execute the supplied command and either hangs the
	machine or returns the following error:
	
	   execution error U2253 : command failed
	
	When executing batch files or DOS commands such as TYPE and DIR, the
	above error message displays. In the case of batch files, if the .BAT
	extension is included at the end of the batch-file name, ERROUT.EXE
	may hang the machine. If the .BAT extension is not included, the above
	error message displays. (When an error output filename is supplied
	with the /f option, this same error is written to the file.)
	
	The first example on Page 329 of the "Microsoft CodeView and
	Utilities: Software Development Tools for MS-DOS" manual (for
	Microsoft BASIC Compiler 6.00 and 6.00b) fails since it uses the DOS
	TYPE statement. This first example should be removed. The examples
	using CL and MASM work properly since CL.EXE and MASM.EXE are .EXE
	programs.
	
	(The ERROUT.EXE utility is not shipped in Microsoft BASIC Professional
	Development System (PDS) Version 7.00 for MS-DOS and MS OS/2.)
	
	Syntax for ERROUT
	-----------------
	
	The ERROUT.EXE utility redirects standard error output generated from
	an .EXE or .COM program, using the following syntax:
	
	   ERROUT [/f standarderrorfile] doscommandline
	
	Here, "standarderrorfile" is a filename to which all errors generated
	by "doscommandline" will be written when you use the /f option
	(lowercase "f"). Without the /f option, all error messages are sent to
	the console.
	
	No form of ERROUT works except when doscommandline is the name of an
	.EXE or .COM file.
