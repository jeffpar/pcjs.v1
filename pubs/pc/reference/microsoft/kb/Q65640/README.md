---
layout: page
title: "Q65640: ERROR ERR May Cause &quot;Illegal Function Call&quot; in QBX.EXE 7.00"
permalink: /pubs/pc/reference/microsoft/kb/Q65640/
---

## Q65640: ERROR ERR May Cause &quot;Illegal Function Call&quot; in QBX.EXE 7.00

	Article: Q65640
	Version(s): 7.00   | 7.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | SR# S900827-59 buglist7.00 fixlist7.10
	Last Modified: 20-SEP-1990
	
	In a multiple-module program in which each of the modules contains an
	active error handler, executing the statement ERROR ERR within an
	error handler of any support module will normally pass control back to
	the next active error handler in the CALL tree. If an active error
	handler is not found, the program will terminate.
	
	Within the QBX.EXE environment of Microsoft BASIC Professional
	Development System (PDS) version 7.00, using ERROR ERR in a
	module-level error handler will incorrectly generate either "Illegal
	function call" or "Device I/O error". This problem does not occur when
	the same program is compiled using BC.EXE.
	
	Microsoft has confirmed this to be a problem in only the QBX.EXE
	environment of BASIC PDS 7.00 for MS-DOS. This problem was corrected
	in BASIC PDS version 7.10.
	
	When the following program is run in QBX.EXE version 7.00, an "Illegal
	Function Call" or "Device I/O error" results. When the program is
	compiled using BC.EXE, it will compile and run without error.
	
	MOD1.BAS
	--------
	
	   '=================This is Module 1==========================
	   DECLARE SUB mod2sub1 ()        'this sub is in Mod2
	   ON ERROR GOTO MainErr          'Main error Handler
	   CLS
	   CALL mod2sub1                  'Calls the sub in Mod2
	   END
	   MainErr:
	      PRINT "main error "; ERR    'prints the Error number
	      END
	
	MOD2.BAS
	--------
	
	   '===================This is Module 2========================
	   Mod2ErrorHandler:            'This error handler is at the
	      PRINT "Mod2 Error "       'Module level in Mod2.
	      ERROR ERR                 'This causes the error again.
	      RESUME NEXT
	   SUB mod2sub1
	      ON ERROR GOTO Mod2ErrorHandler  'Goto err handler in Mod2
	      ERROR 5                         'Cause an Error 5
	   END SUB
	
	Workaround for MOD2.BAS
	-----------------------
	
	To work around the problem, convert the module-level error handler (in
	the MOD2.BAS support module) into a local error handler, as follows:
	
	   SUB Mod2Sub1
	        ON LOCAL ERROR GOTO Mod2ErrorHandler
	        ERROR 5
	        EXIT SUB
	        Mod2ErrorHandler:
	            PRINT "Mod2 Error "
	            ERROR ERR           'Forces the error again.
	            RESUME NEXT
	   END SUB
