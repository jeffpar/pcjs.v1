---
layout: page
title: "Q48251: Mixed-Language Examples for Calling Pascal Are Incorrect"
permalink: /pubs/pc/reference/microsoft/kb/Q48251/
---

## Q48251: Mixed-Language Examples for Calling Pascal Are Incorrect

	Article: Q48251
	Version(s): 5.00 5.10 | 5.10
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER | docerr H_MASM S_PasCal
	Last Modified: 16-JAN-1990
	
	In the "Microsoft Mixed-Language Programming Guide" provided with C
	Versions 5.00 and 5.10, MASM Versions 5.00 and 5.10, and Pascal
	Version 4.00, there is a sample Pascal module that is incorrect. This
	module is called Pfun and it appears in three different sections of
	the manual. Pfun can be found in the following locations:
	
	1. Page 30, Section 2.5.2 "Calling Pascal from Basic -- Function Call"
	
	2. Page 44, Section 3.5.2 "Calling Pascal from C -- Function Call"
	
	3. Page 57, Section 4.5.2 "Calling Pascal from FORTRAN -- Function Call"
	
	If the Pascal source code shown on these pages is compiled, the
	following errors occur:
	
	  21  7   begin
	= 22  8     Fact := Fact * n;
	      8  --------------^Warning 171 Insert (
	      8  ----------------^268 Cannot Begin Expression  Skipped
	      8  -------------------^Warning 155 ; Assumed ,
	      8  -------------------^257 Parameter List Size Wrong Begin Ski
	
	To get the code to compile correctly, all of the incorrect references
	to Fact must be removed and replaced by a temporary variable. The
	following source code contains the necessary changes to the Pfun
	module so that it will compile and run without any errors:
	
	module Pfun;
	  function Fact (n : integer) : integer;
	
	{Integer parameters received by value, the Pascal default. }
	
	  var   temp : integer;
	
	  begin
	     temp := 1;
	     while n > 0 do
	        begin
	            temp := temp * n;
	            n := n - 1;
	        end;
	     Fact := temp;
	  end;
	end.
	
	Note: There is an incorrect reference to the errors in the Fact
	function in the Pascal Version 4.00 README.DOC file. This correction
	does not work.
