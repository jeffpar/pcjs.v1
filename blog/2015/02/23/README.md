Early 80386 CPUs
---
Assembling a detailed and accurate history of the 80386, including a complete listing of all the "steppings"
(revisions), when they were released, what "errata" (problems) each stepping suffered from, and which of those
problems were fixed by a later stepping, seems virtually impossible.

I won't make the attempt here, either.  I'm just going to throw together everything I know into one pile,
as I begin adding 80386 support to PCjs.

Let's start with steppings (revision levels), then move on to errata, and finally undocumented and deprecated
instructions.

### Steppings

As the "INTEL 80386 PROGRAMMER'S REFERENCE MANUAL 1986", section 10.1, explains:

> The contents of EAX depend upon the results of the power-up self test. The self-test may be requested
externally by assertion of BUSY# at the end of RESET. The EAX register holds zero if the 80386 passed
the test. A nonzero value in EAX after self-test indicates that the particular 80386 unit is faulty.
If the self-test is not requested, the contents of EAX after RESET is undefined.

> DX holds a component identifier and revision number after RESET as Figure 10-1 illustrates. DH contains 3,
which indicates an 80386 component. DL contains a unique identifier of the revision level.

But what "revision levels" did Intel actually use?

Based on information below (see the ill-fated XBTS instruction), it seems there were A0-B0 steppings.
However, all we can really infer from that is the existence of A0 and B0 steppings.  It doesn't tell us
whether there were any intervening (eg, A1, A2) steppings, or what "revision levels" were used on reset.

I've read reports that A steppings had serious problems, like the inability to return to real mode
(reminiscent of the 80286).  By all accounts, no A-stepping 80386 CPUs were sold commercially, so we can
more or less ignore them.

As for the B0 stepping, the October 15, 1991 issue of PC Magazine reported:

	You can tell if you have a B0 or B1 Step level 386 by looking at the markings on the chip.
	If it has the ID number S40336 or S40337 stamped on it, then it's a Step B0; if it's marked
	with S40343, S40344, or S40362, it's a Step B1. Some B0 and B1 chips were marked B0 or B1
	rather than with an ID number. 

Most of the information I have about the 80386 begins with the B1 stepping.  From a December 17, 1986
document titled "**80386-B1 STEPPING INFORMATION**":

	80386-B1 component identifier readable in DH after reset: 03H
	80386-B1 revision  identifier readable in DL after reset: 03H
	
	At this time, B1 stepping parts are identified with one of the marks shown
	below:
	
	                                       |
	            ii                         |    ii
	                                       |
	            ii  A80386-16              |    ii  A80386-20
	            ii  S40344                 |    ii  S40362
	            ii  (FPO number)           |    ii  (FPO number)
	            ii   m  c  i '85 '86       |    ii   m  c  i  '85 '86
	                                       |	           
	    ----------------------------------- ----------------------------------
	                                       |
	            ii                         |
	                                       |
	            ii  A80386 ES B1           |
	            ii                         |
	            ii                         |
	            ii   m  c  i  '85 '86      |
	                                       |

So, the B1 stepping set DL to 0x03 on reset.  It also seems a safe bet that revision number
for a B0 stepping was 0x02.  Does that mean the revision number for the A0 was 0x01?  Who knows.

The 80386 CPU on my Compaq DeskPro 386 "Version 2" System Board is labeled as:

	            A80386-16
	            S40344
	            L8260347
	            (m)(c)i '85 '86

so presumably it's a B1 stepping, although I'm not currently able to power it and run any tests.
Since I'm not original owner of the motherboard, I can't be certain that the CPU was factory-installed,
but I'm a little surprised that a motherboard with other components dating from 1988 was still using
a CPU from 1986.

One good thing about my B1 stepping CPU is that it's also marked with a "double sigma", which is how
Intel marked 80386 CPUs that were safe for 32-bit multiplication (some CPUs suffered from a manufacturing
defect that could occasionally result in multiplication errors).

The only other information I have about revision levels comes from a March 30, 1987 document titled
"**80386-C0 STEPPING INFORMATION**":

	80386-C0 component identifier readable in DH after reset: 03H
	80386-C0 revision  identifier readable in DL after reset: 04H

However, the document does not indicate how a 80386-C0 part is marked.

### Errata

It's fair to say that the 80386 B1 stepping had a lot of problems.  Although, for a CPU of significantly
greater complexity than its predecessors, that doesn't seem terribly surprising.

From the aforementioned December 17, 1986 document, here's what the world knew about 80386-B1 problems at
that time:

1. Opcode Field Incorrect for FSAVE and FSTENV
2. FSAVE, FRESTOR, FSTENV and FLDENV Anomolies [sic] with Paging
3. Wraparound Coprocessor Operands
4. IRET to TSS with Limit too Small
5. Single-Stepping First Iteration of REP MOVS
6. Task Switch to Virtual 8086 Mode Doesn't Update Prefetch Limit
7. Wrong Register Size for String Instructions in Mixed 16/32-bit Addressing Systems
8. FAR Jump Located Near Page Boundary in Virtual 8086 Mode Paged Systems
9. Page Fault Error Code on Stack Not Reliable
10. Certain I/O Addresses Incorrect when Paging is Enabled
11. Wrong ECX Update by REP INS
12. NMI Doesn't Always Bring Chip Out of Shutdown in Obscure Condition with Paging Enabled
13. HOLD Input During Protected Mode Interlevel IRET when Paging is Enabled
14. Protected Mode LSL Instruction Should not be Followed by PUSH/POP
15. LSL/LAR/VERR/VERW. Instructions Malfunction with Null Selector
16. "Not Present" LDT in VM86 Task Raises Wrong Exception
17. Coprocessor Instructions Crossing Page/Segment Boundaries
18. Double Page Faults Do Not Raise Double Fault Exception

An errata update dated March 26, 1987, produced internally by IBM rather than Intel, noted two additional
issues:

+ Maximum Sized Segments Need Alignment
+ CR3/TRx Move Corrupts LIP (Linear Instruction Pointer)

As an aside, an 80386-C0 document dated March 30, 1987 lists none of the above errata, suggesting that
the C0 stepping fixed all the above problems -- with the exception of #18, which was apparently reclassified
from errata to "feature":

> Double Page Faults Do Not Raise Double Fault Exception

> Problem: If a second page fault occurs, while the processor is attempting to enter the service routine
for the first, then the processor will invoke the page fault (exception 14) handler a second time, rather
than the double fault (exception 8) handler. A subsequent fault, though, will lead to shutdown.

> Workaround: No workaround is necessary in a working system.

On April 30, 1987, another errata update omitted #18, as well as the two new issues documented by IBM
(which, like #18, Intel must have decided were not significant problems "in a working system"), and added
the following:

+ Breakpoints Malfunction after Reading CR3, TR6, or TR7
+ Return Address Incorrect for Segment Limit Fault during FNINIT

Finally, the last 80386-B1 errata update I've seen, dated September 1, 1987, continued to list previous
errata (#1-#17), plus the two errata from April 30 (#18 and #19), and the following new errata:

+ VERR/VERW/LAR/LSL Instructions Malfunction with Bad Selector
+ Coprocessor Malfunctions with Paging Enabled

This brought the total number of 80386-B1 errata to 21.

There was also a manufacturing problem that caused 32-bit multiplications to fail on some parts, which Intel
publicly acknowledged in September 1987.  The problem affected the B1 stepping; it's unknown whether other
steppings were affected as well.

What follows is some additional information about early 80386 processors from various online sources.

From "[CPU Identification by the Windows Kernel](http://www.geoffchappell.com/studies/windows/km/cpu/index.htm)":

> ### 80386

> Finer identification of 80386 processors is largely academic. Whatever the model or stepping, the 80386 processor
is unsupported since [Windows NT] version 4.0, and soon causes the bug check UNSUPPORTED_PROCESSOR (0x5D), though not
without the kernel having worked its way through more tests for defects to identify models and steppings. For any 80386
processor that passes all tests, the model and stepping leap ahead to 3 and 1. Version 3.51, which was the last to
support the 80386 (and only then in a single-processor configuration), rejects any 80386 that does not pass all these
tests.

	Family  Model   Stepping    Test
	------  -----   --------    ----
	  3       0       0         32-bit MUL not reliably correct
	  3       1       0         supports XBTS instruction
	  3       1       1         set TF bit (0x0100) in EFLAGS causes Debug exception (interrupt 0x01) only at completion of REP MOVSB
	  3       3       1

> The particular multiplication that distinguishes model 0 is of 0x81 by 0x0417A000. This same test was used by Microsoft
at least as far back as Windows 3.10 Enhanced Mode, to advise:

	The Intel 80386 processor in this computer does not reliably execute 32-bit
	multiply operations. Windows usually works correctly on computers with this
	problem but may occasionally fail. You may want to replace your 80386 processor.
	Press any key to continue...

> The instruction whose support is tested for model 1 stepping 0 has opcode bytes 0x0F 0xA6 followed by a Mod R/M byte
and by whatever more this byte indicates is needed for the operand. This opcode is disassembled as XBTS by Microsoft’s
DUMPBIN utility from Visual C++, and has been since at least the mid-90s. However, the same opcode was apparently reused
for the CMPXCHG instruction on some 80486 processors. The confusion seems to have left a lasting mark: Intel’s opcode
charts leave 0x0F 0xA6 unassigned even now. The specific test performed by the Windows kernel is to load EAX and EDX
with zero and ECX with 0xFF00. If executing XBTS ECX,EDX does not cause an Invalid Opcode exception and clears ecx to
zero (which CMPXCHG ECX,EDX would not), then XBTS is deemed to be supported and the processor is model 1 stepping 0.
This case of 80386 processor also was known to Windows 3.10 Enhanced Mode, and was rejected as fatal:

	Windows may not run correctly with the 80386 processor in this computer.
 
	Upgrade your 80386 processor or start Windows in standard mode by typing
	WIN /s at the MS-DOS prompt.

> When string instructions such as MOVSB are repeated because of a REP prefix, each operation is ordinarily interruptible.
As Intel says (for REP in the [Intel 64 and IA-32 Architectures Software Developer’s Manual Volume 2B: Instruction Set Reference N-Z](http://www.intel.com/design/processor/manuals/253667.pdf)),
this “allows long string operations to proceed without affecting the interrupt response time of the system.” It ordinarily
applies also to the Debug exception, such as raised by the processor at the end of executing an instruction for which the TF
bit is set in the EFLAGS when the instruction started. Programmers may have noticed this in the real world of assembly-language
debugging. If the debugger actually does implement its trace command as a trace, as opposed to setting an INT 3 breakpoint
where the instruction is calculated to end, then a two-byte REP MOVSB may take many keystrokes to trace through! That
model 1 stepping 1 traces through a REP MOVSB without interruption may be helpful when debugging, but it is surely a defect.

More examples of problems with early (B1 stepping) 80386 CPUs are available in an "[The Old New Thing](http://blogs.msdn.com/b/oldnewthing/)"
blog post titled "[My, what strange NOPs you have!](http://blogs.msdn.com/b/oldnewthing/archive/2011/01/12/10114521.aspx)",
which also explains why Windows 95 ultimately decided not to support the B1 stepping.

Here are some highlights:

> [I]f the instruction following a string operation (such as movs) uses opposite-sized addresses from that in the string
instruction (for example, if you performed a movs es:[edi], ds:[esi] followed by a mov ax, [bx]) or if the following
instruction accessed an opposite-sized stack (for example, if you performed a movs es:[edi], ds:[esi] on a 16-bit stack,
and the next instruction was a push), then the movs instruction would not operate correctly.

> ...

> [T]here was one bug that manifested itself in incorrect instruction decoding if a conditional branch instruction
had just the right sequence of taken/not-taken history, and the branch instruction was followed immediately by a selector load,
and one of the first two instructions at the destination of the branch was itself a jump, call, or return. The easy workaround:
Insert a NOP between the branch and the selector load.

> ...

> [T]he B1 stepping did not support virtual memory in the first 64KB of memory. Fine, don't use virtual memory there.

> ...

> If virtual memory was enabled, if a certain race condition was encountered inside the hardware prefetch, and if you executed
a floating point coprocessor instruction that accessed memory at an address in the range 0x800000F8 through 0x800000FF,
then the CPU would end up reading from addresses 0x000000F8 through 0x0000000FF instead. This one was easy to work around:
Never allocate valid memory at 0x80000xxx.

### Instructions

Regarding [Opcode XBTS](http://asm.inightmare.org/opcodelst/index.php?op=XBTS):

	Opcode XBTS
	
	CPU: 80386 step A0-B0 only 
	Type of Instruction: User 
	
	Instruction: XBTS dest,base,bitoffset,len 
	
	Description: 
	Write bit string length bits from bitfield, defined by 
	and bitsoffset from this base to start of 
	the field to read. String read from this start field bit to 
	higher memory addresses or register bits. 
	And after it string placed to operand, lowest bit of 
	register or memory to bit 0 of . 
	
	Note:	Use SHLD/SHRD instructions for extract bits strings. 
	On 80386 steps B1+ this opcode generation INT 6, 
	and on some of 486 other instruction replace this 
	instruction opcode. 
	
	Flags Affected: None 
	
	CPU mode: RM,PM,VM 
	
	+++++++++++++++++++++++ 
	Physical Form:	XBTS	r16,r/m16,AX,CL 
	XBTS	r32,r/m32,EAX,CL 
	COP (Code of Operation)	: 0FH A6H Postbyte 
	
	Clocks:	XBTS 
	80386:	6/13 

*[@jeffpar](http://twitter.com/jeffpar)*  
*February 23, 2015*
