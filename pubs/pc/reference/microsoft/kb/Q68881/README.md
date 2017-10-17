---
layout: page
title: "Q68881: Pascal Example in Programmer's Guide Won't Compile"
permalink: /pubs/pc/reference/microsoft/kb/Q68881/
---

## Q68881: Pascal Example in Programmer's Guide Won't Compile

	Article: Q68881
	Version(s): 1.00
	Operating System: MS-DOS
	Flags: ENDUSER | Pascal Mouse Programming Borland Turbo
	Last Modified: 11-FEB-1991
	
	The "Making Calls from Borland Turbo Pascal Programs" sample in
	Appendix E of the "Microsoft Mouse Programmer's Reference" does not
	compile with Turbo Pascal versions 5.0 and 6.0.
	
	The CpuReg data structure needs to be defined as "Registers"
	variables. The semicolons need to be removed from the END lines that
	immediately precede ELSE. Finally, finding the segment and offset of
	the pointer of the address of the user array or subroutine (functions
	9,12,20,22,23,and 24) needs to be done outside of this procedure.
	Passing the first element of the array or the start point of the
	subroutine into the procedure, then calling the "ofs" and "seg"
	functions in the procedure doesn't seem to work. This is due to how
	the variables get dereferenced when passed into a procedure.
	
	The following example compiles in both Turbo Pascal version
	6.0 and Quick Pascal version 1.00:
	
	Procedure Mouse (Var m1, m2, m3, m4, m5 : integer );
	
	Var
	   CpuReg: Registers;
	
	begin {mouse}
	
	   if m1 >= 0 then
	      begin
	     CpuReg.AX := m1;        { Load Parameters       }
	     CpuReg.BX := m2;        { into appropriate      }
	     CpuReg.CX := m3;        { registers             }
	
	     if (m1 = 9) or (m1 = 12) or (m1 = 20)
	        or (m1 = 22) or (m1 = 23) or (m1 = 24) then
	        begin
	          CpuReg.DX  :=  m4;    {m4 = offset,         }
	          CpuReg.ES  :=  m5;    { and m5 = segment    }
	        end                       { of the user array }
	                         { or subroutine     }
	
	      else
	      if  m1 = 16  then
	       begin
	         CpuReg.CX  := m2;           {Left  x coordinate }
	         CpuReg.DX  := m3;           {Upper y coordinate }
	         CpuReg.SI  := m4;           {Right x coordinate }
	         CpuReg.DI  := m5;           {Lower y coordinate }
	       end
	     else
	         CpuReg.DX  := m4;
	
	     Intr($33, CpuReg);              {Call mouse driver  }
	                            { at Interrupt 33H  }
	
	     m1 := CpuReg.AX;                {Return values back }
	     m2 := CpuReg.BX;                { to parameters     }
	     m3 := CpuReg.CX;
	     m4 := CpuReg.DX;
	
	     if (m1 = 20) then               {special returns    }
	        m2 := CpuReg.ES              { from subroutines  }
	   end;
	end; {mouse}
