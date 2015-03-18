Early 80386 CPUs
---
Assembling a detailed and accurate history of the 80386, including a complete listing of all the "steppings"
(revisions), when they were released, what "errata" (problems) each stepping suffered from, and which of those
problems were fixed by a later stepping, seems virtually impossible at this late date.

I won't make the attempt here, either.  Using information from various sources, I'll start with an overview
of the steppings (revision levels), including how each stepping was externally marked and internally identified,
along with lists of associated errata, then move on to more detailed errata information (from Intel's own documents),
and end with a summary of undocumented 80386 instructions.

Until further notice, this document is a work-in-progress.

### Steppings

As the "INTEL 80386 PROGRAMMER'S REFERENCE MANUAL 1986", section 10.1, explains:

> The contents of EAX depend upon the results of the power-up self test. The self-test may be requested
externally by assertion of BUSY# at the end of RESET. The EAX register holds zero if the 80386 passed
the test. A nonzero value in EAX after self-test indicates that the particular 80386 unit is faulty.
If the self-test is not requested, the contents of EAX after RESET is undefined.

> DX holds a component identifier and revision number after RESET as Figure 10-1 illustrates. DH contains 3,
which indicates an 80386 component. DL contains a unique identifier of the revision level.

But what steppings did Intel produce, and what "revision level" was associated with each stepping?

I've read reports that the first stepping (A0) had serious problems, like an inability to return to real mode
(reminiscent of the 80286).  Since it was never released commercially, and we know so little about it, let's move
on to the A1 stepping.

From "Advanced 80386 Programming Techniques" by James L. Turley (C) 1988:

> ### Evolution of the 80386

> #### A1 Stepping

> This is the first revision after the initial (A0) introduction of the 80386 [in late 1985]. The A1
stepping became available around the first of the year in 1986.

> + *Hardware Peculiarity*: Unless pin F13 of the 80386 is connected to the +5V power supply, the 80386
never terminates a memory cycle, hanging the processor.
+ *Loading LDTR with a Null Selector*: If you load the local descriptor table register with a null
selector (0000 through 0003) without performing a memory read immediately afterward, the 80386 behaves
erratically. LDTR can be loaded either as the result of an LLDT instruction or as part of a task-switch
operation if the incoming TSS has a null selector in its LDT field.
+ *Loading Bad Stack Selectors*: The 80386 does not check the privilege level of the desired stack
segment selector during an LSS instruction. Normally, the RPL of the selector and the DPL of the segment
must exactly equal the DPL of the currently executing code segment.
+ *Misaligned Selectors*: If a 16-bit memory operand is loaded into a segment register, the 80386 hangs
if the selector is not word-aligned. This can happen with a MOV instruction and with the LDS, LES, LFS,
LGS, and LSS instructions.
+ *Testing Null Selectors*: The 80386 hangs if an LAR, LSL, VERR, or VERW instruction is used to test
a null selector.
+ *Popping Selectors*: When popping a segment selector from the stack, the 80386 performs all of the
privilege-related checks backward. That is, you are allowed to pop a selector to a segment with more
privilege, but not to one with less privilege.
+ *Indirect FAR JMP to Same Privilege Level*: An indirect JMP instruction is one in which the new segment
selector and offset are stored in memory. If the new code segment is at the same privilege level as the
current code segment, the 80386 does not read the selector portion of the JMP operand. The result is a
NEAR JMP to a new offset within the current code segment.
+ *Spurious Breakpoint Exceptions*: A MOV instruction into or out of the debug registers while hardware
breakpoints are enabled may cause a breakpoint fault to be reported. You should temporarily disable the
hardware breakpoints while reading or writing the debug registers and then execute a JMP instruction
to flush the prefetch queue before reenabling them.
+ *Successive Floating-Point Instructions*: If two floating-point instructions are executed close together,
the 80386 may force the coprocessor to start the second one too soon if the first one did not require any
memory operands.
+ *Bad Floating-Point Instructions*: The execution of certain undefined floating-point instructions causes
the 80386 to hang rather than reporting an invalid instruction fault.
+ *Misaligned Floating-Point Instructions*: If 80287 and/or 80387 instructions are not word-aligned, the
80386 passes the wrong instruction to the coprocessor, causing unpredictable behavior.
+ *Misaligned Descriptor Tables*: All segment descriptors should be dword-aligned, or the 80386 may not
read them correctly.
+ *Incorrect Interrupt Vector*: If a maskable interrupt occurs immediately after the 80386 has executed an
instruction with an 8-bit operand, the interrupt is always assigned a vector number of 0.
+ *Handling Exceptions with 80286 Tasks*: If an exception that pushes an error code is handled through a
task gate to an 80286 task, the 80386 generates a double fault (exception 8) as soon as the 80286 task
switch is completed.
+ *Page Fault During Task Switch*: If the new task uses different page tables than the old task and a page
fault occurs during the task-switch operation, the 80386 hangs instead of reporting the page fault.
+ *Returning from a Nested Task*: If you execute an IRET instruction when the NT (Nested Task) flag in
EFLAGS is set, the 80386 returns to your "parent" task. However, it will neglect to clear NT in the outgoing
task's TSS.
+ *Task-Switch Trap Bit*: When a task switch occurs and the incoming TSS has its task-switch bit set, the
80386 generates a debug fault (exception 1). However, it will neglect to set the BT flag in register DR6
before invoking the exception 1 handler.
+ *Invalid TSS Faults*: When an invalid TSS fault (exception 10) occurs as the result of a task-switch
operation, the 80386 pushes the wrong values for EIP and ESP on the error handler's stack.
+ *Wrong Paging Information During Task Switch*: When a task switch occurs and the new task uses a different
set of page tables than the old task (that is, CR3 in the TSS is different), the 80386 reads the new TSS
descriptor and updates the old TSS using the page tables of the new task.
+ *Masking NMI*: If an NMI is serviced through a task gate, the 80386 neglects to reenable NMI inputs after
the NMI-handling task terminates. The 80386 does not recognize NMI inputs while it is servicing an NMI.
+ *Incorrect Error Code*: If an exception that pushes an error code is handled through a task gate, the
80386 may push an error code of 0 instead of the correct error code.
+ *Not-Present LDT*: If a task switch occurs and the new task's TSS selector selects an LDT descriptor
that is marked no present, the 80386 reports a not-present fault (exception 11), instead of an invalid TSS
(exception 10).
+ *Self-test*: The self-test feature does not work on the A1 stepping of the 80386.
+ *Interlevel Transfers*: If you perform a control transfer to a higher privilege level and the procedure
at that level uses an expand-down stack segment for its stack, as opposed to an expand-up data segment,
the 80386 generates a spurious stack fault (exception 12).
+ *Debug Access Fault*: If an attempt is made to read or write the debug registers while GD is set in DR7,
the 80386 generates a debug fault (exception 1). However, the wrong value for EIP will be pushed onto the
exception handler's stack.
+ *Multiply and Divide Errors*: If the 80386 executes a MUL, IMUL, DIV, or IDIV instruction with a memory
operand and general protection fault (exception 13) occurs, the processor hangs rather than reporting the fault.
+ *Intersegment Transfers*: If the last 2 bytes of a direct FAR JMP or FAR CALL instruction are beyond the
end of the code segment, the 80386 hangs rather than reporting a general protection fault.
+ *Intersegment Transfers II*: If the last 2 bytes of a direct FAR JMP or FAR CALL instruction lie on the
other side of a page boundary, the 80386 hangs, regardless of whether the other page is present or not.
Remember, a page boundary occurs every 4kb.
+ *Bit-Test Instructions*: The bit-test instructions that perform read-modify-write cycles to memory (BTC,
BTR, and BTS) do not work properly unless your memory runs without wait states.
+ *Bit Scan Forward Instruction*: If a BSF instruction is executed with a memory operand, and a general
protection fault (exception 13) or a page fault (exception 14) occurs, the 80386 hangs rather than reporting
the fault.
+ *Accessing CR3, TR6, and TR7*: Reading or writing registers CR3, TR6, or TR7 produces incorrect results
if your memory requires wait states. This is particularly obscure, since these instructions do not reference
memory.

> #### B0 Stepping

> The B0 stepping became available around the middle of 1986. As is the case with earlier steppings, the
"B0" marking can sometimes be found on the outside of the device. If not, the code "S40336" or "S40337" may
appear. Starting with the B0 stepping, the 80386 would leave the component identifier, 3, in DH and the
revision identifier, also 3, in DL [These B0 values need to be independently confirmed, because they are
the same values reported for the B1 stepping. -JP]

> + *Interrupts and Privilege Violations*: If a hardware interrupt occurs immediately before an IOPL-sensitive
instruction when CPL is greater than IOPL, the 80386 behaves erratically. Generally, it will produce spurious
stack faults (exception 12). Note that this occurs only if the IOPL-sensitive instruction was going to fail.
+ *Infinite Page Faults*: If a page fault (exception 14) occurs while the 80386 is attempting to invoke a
page fault handler, it generates another page fault rather than reporting a double fault (exception 8).
+ *Invalid TSS Fault*: If an invalid TSS fault (exception 10) is caused by an attempt to switch to a TSS that
is too small, and the exception is handled through a task gate, the 80386 shuts down.
+ *Invalid TSS Fault II*: If you execute an IRET instruction while the NT (Nested Task) flag is set in EFLAGS,
and the "parent" TSS is too small, the 80386 generates a double fault (exception 8).
+ *Invalid TSS Fault III*: If the previous error occurs and the double fault is handled through a trap gate,
the 80386 shuts down.
+ *Invalid TSS Fault IV*: If the gate descriptor for an invalid TSS fault (exception 10) is bad and an
invalid TSS fault occurs for any reason, the 80386 shuts down.
+ *Tracing a REP MOVS Instruction*: The 80386 does not correctly single-step (trace) repeated string move
instructions. Instead, it generates a debug trap after every *other* iteration of the repeated MOVS instruction.
+ *Breakpointing a REP MOVS Instruction*: If a data breakpoint is enabled and it is hit during a repeated
string move instruction, the 80386 reports it only after an even number of iterations. This gives you a
fifty-fifty chance of learning about your breakpoint one instruction late.
+ *16-Bit and 32-Bit Control Transfers*: Whenever control is transferred from 16-bit code to 32-bit code
through a task gate or through a gate that causes a change in privilege level, the 80386 discards the upper
half of the offset address in EIP. If the destination address was greater than 64Kb, this will cause a
program error.
+ *16-Bit and 32-Bit Control Transfers II*: When an IRET instruction that transfers control to a Virtual
8086 mode task is executed, the 80386 neglects to truncate the offset address on the stack to 16 bits.
+ *16-Bit and 32-Bit Control Transfers III*: If a 32-bit call, trap, or interrupt gate is used to transfer
control from a 16-bit code segment to a 32-bit code segment without changing privilege levels, the 80386
treats the gate as a 16-bit gate.
+ *Mixing Address Sizes*: If a LOOP, MOVS, LODS, STOS, CMPS, INS, or OUTS instruction is followed by an
instruction that uses a different address size, the 80386 may use the incorrect address size when updating
either the loop counter or the string index.

> #### B1 Stepping

> The B1 stepping became available in late 1986. It corrected many of the bugs in earlier versions, but
new ones were either introduced or discovered. The best known of these was the widely publicized multiply
failure discovered in mid-1987. The B1 stepping is identifiable either by the "B1" mark or by the code
"S40343," "S40344," or "S40362." As is the case with the B0 stepping, the B1 revision leaves a binary three
in DL after reset. [Again, I would like to see the B0 values independently confirmed. -JP]

> + *IBTS and XBTS Instructions Removed*: The Insert Bit String (IBTS) and Extract Bit String (XBTS)
instructions were removed from the 80386's instruction set. It was determined that they took up too much
space on the microprocessor and that their functionality could be duplicated with the SHLD and SHRD
instructions. The opcodes 0F A6 and 0F A7 now produce invalid opcode faults.
+ *Multiplication Errors*: Certain 80386 microprocessors produce erroneous results when performing
multiplication. Not all B1 stepping 80386s suffer from this bug. It is aggravated by increases in the
processor's operating frequency, elevations in the ambient temperature, or decreases in the power supply
voltage. This failure is extremely pattern sensitive; certain patterns will produce errors readily, while
others never will. [See sample program below]
+ *Double Page Faults*: The bug that appeared in the B0 stepping regarding page faults that occurred
during page faults has been made a permanent feature of the 80386, with one minor change. If a third page
fault occurs while the processor is servicing the first two, the 80386 shuts down. [See Intel Errata #18 below]
+ *Disabling Page Translation*: The 80386 does not stop translating linear addresses to physical addresses
when paging is disabled. Any page-translation entries that are still in the cache will be used, regardless
of the setting of PG in CR0. To completely disable paging, flush the TLB by clearing CR3.
+ *Page Translation Affects I/O Addresses*: When paging is enabled, the MMU sometimes erroneously translates
I/O addresses above 0FFF as well as memory addresses. Coprocessor references (which appear in the I/O space)
are also affected. The I/O addresses are translated as though they were linear memory addresses, using the
memory translation tables cached in the TLB. If the "linear" I/O address is not in the cache, no translation
will take place; only cached entries produce this effect. [See Intel Errata #10 below]
+ *Page Fault Error Codes*: Under certain circumstances, the 80386 pushes an incorrect error code onto the
page fault handler's stack. [See Intel Errata #9 below]
+ *Four-Gigabyte Code Segments*: If you define a 4Gb code segment (limit = FFFFF, G = 1), the base address
of that segment must be dword-aligned, or the 80386 generates a general protection fault (exception 13)
when it fetches an instruction from the beginning of the segment. This feature is expected to become permanent.
+ *Wrong Loop Counter*: After a REP INS instruction finishes its last iteration, register ECX holds the value
FFFFFFFF instead of 0, if the next instruction after the REP INS references memory. [See Intel Errata #11 below]
+ *LSL Instruction and Stack Pointer*: If the LSL instruction is followed by an instruction that references
the stack, register ESP may become corrupted. [See Intel Errata #14 below]
+ *Not-Present LDT*: If a task switch occurs to a Virtual 8086 mode task and the incoming task's TSS holds
a selector to an LDT descriptor that is marked not present, the 80386 generates a not-present fault
(exception 11) rather than reporting an invalid TSS fault (exception 10). [See Intel Errata #16 below]
+ *Reading from CR3, TR6, or TR7*: If hardware breakpoints are enabled, reading from CR3, TR6, or TR7 may
cause spurious debug faults to be reported. It is recommended that you disable breakpoints and then execute
the MOV instruction followed by a JMP instruction before reenabling breakpoints.
+ *Privilege Checking a Null Selector*: If you perform an LAR, LSL, VERR, or VERw instruction using a null
selector (0000 through 0003), the 80386 actually checks the descriptor in slot 0 of the GDT instead of
always failing. [See Intel Errata #15 below]
+ *Privilege Checking Bad Selectors*: An LAR, LSL, VERR, or VERW instruction that checks an unreachable
selector causes the 80386 to hang unless there is a JMP, CALL, or memory-related instruction already in the
prefetch queue. An unreachable selector is one that either is beyond the limit of its descriptor table
or references a non-existent LDT. The processor will remain hung until it receives an interrupt.
+ *Faulting Floating-Point Instructions*: If the second byte of a floating-point instruction is located
in the first byte of a page that will cause a page fault (either because it is not present or because of an
impending privilege violation), the 80386 hangs. The processor will remain hung until it receives an interrupt.
 [See Intel Errata #17 below]

> The following sample program has been calculated to produce the [aforementioned multiplication] error.
An 80386 that fails one or more of these multiply instructions is obviously faulty. However, passing does not
guarantee a perfect part. To their credit, Intel agreed to test all 80386s for a limited time and report on their
success or failure. Since then, all 80386s have been tested before shipping. Those that fail have been marked
"For Sixteen-Bit Software Only." [To be exact: "16 BIT S/W ONLY" -JP] Those that passed have been marked with
a double sigma sign. All 80386s produced after the B1 stepping should be free of this defect.

	; Perform various 16-bit and 32-bit multiply operations...
	
	K1      DD      41h                 ;memory-based constant 1
	K2      DD      81h                 ;memory-based constant 2
	
			MOV     EAX,0042E8h         ;load EAX with operand
			MUL     K1                  ;EAX = EAX * 41H
			CMP     EAX,10FCE8h         ;check answer
			JNE     fail                ;failure if not equal
	
			MOV     EAX,085D00h
			MUL     K1
			CMP     EAX,021F9D00h
			JNE     fail
	
			MOV     EAX,042E80000h
			MUL     K1
			CMP     EAX,0FCE80000h
			JNE     fail
			CMP     EDX,010h
			JNE     fail
	
			MOV     EAX,0417A000h
			MUL     K2
			CMP     EAX,0FE7A000h
			JNE     fail
			CMP     EDX,0002h
			JNE     fail
	
			MOV     DX,0AB66h
			MOV     AX,09AE8h
			MUL     DX
			CMP     AX,0B070h
			JNE     fail
	
			MOV     DX,0FDF3h
			MOV     AX,09AE8h
			MUL     DX
			CMP     AX,05238h
			JNE     fail
	
			MOV     DX,0B554h
			MOV     AX,0E8EAh
			MUL     DX
			CMP     DX,0A4F9h
			JNE     fail
	
			MOV     DX,0B4C6h
			MOV     AX,0E8EAh
			MUL     DX
			CMP     AX,0ACFCh
			JNE     fail
			CMP     DX,0A478h
			JNE     fail
	
			MOV     DX,0B318h
			MOV     AX,0E8EAh
			MUL     DX
			CMP     DX,0A2F1h
			JNE     fail
	
			MOV     DX,0B43Bh
			MOV     AX,0E8EAh
			MUL     DX
			CMP     DX,0A3FAh
			JNE     fail

---

As for the B0 stepping, the October 15, 1991 issue of PC Magazine confirms what Turley noted above:

    You can tell if you have a B0 or B1 Step level 386 by looking at the markings on the chip.
    If it has the ID number S40336 or S40337 stamped on it, then it's a Step B0; if it's marked
    with S40343, S40344, or S40362, it's a Step B1. Some B0 and B1 chips were marked B0 or B1
    rather than with an ID number.

Most of the information I have obtained about the 80386 begins with the B1 stepping.  From a December
17, 1986 Intel document titled "**80386-B1 STEPPING INFORMATION**":

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

So, the B1 stepping set DL to 0x03 on reset.  This would lead one to believe that the revision number
for a B0 stepping was 0x02, but according to Turley (see above), the B0 and B1 steppings report the *same*
revision; as I noted above, it would be nice to see some independent confirmation.

The 80386 CPU on my Compaq DeskPro 386 "Version 2" System Board is labeled as:

                A80386-16
                S40344
                L8260347
                (m)(c)i '85 '86

The "S40344" indicates that it's a B1 stepping, although I'm not currently able to power it and run any tests.

According to [OS/2 Museum](http://os2museum.com) proprietor Michal Necasek, the "L8260347" means:

    [I]t was actually manufactured in mid-1988. It took me many years to realize how Intel marked the chips.
    The initial 'L' (or whatever number/letter it is) can be ignored and the following 3 digits (826) are the
    date code. The first is the last digit of the year.... The last two digits are the week of manufacture,
    so week 26 of 1988. Many Intel CPUs actually have 2 or 3 date codes on them, probably related to when the
    die was made, when the package was assembled, and when it was tested/binned and stamped. On your 386,
    there might be another date code on the bottom side, but if there is, it's not going to be too far apart
    from the one on the top and it's going to be slightly older.

Fortunately, my 80386-B1 CPU is also marked with a "&Sigma;&Sigma;" (double sigma), which is how Intel marked
parts that tested safe for 32-bit multiplication.  Some 80386 CPUs suffered from a manufacturing defect that
could occasionally result in multiplication errors; defective parts that Intel caught were marked with
"16 BIT S/W ONLY" instead of the double sigma.

The only other information I have about revision levels comes from a March 30, 1987 document titled
"**80386-C0 STEPPING INFORMATION**":

    80386-C0 component identifier readable in DH after reset: 03H
    80386-C0 revision  identifier readable in DL after reset: 04H

However, that document does not indicate how a 80386-C0 part was marked, and I've found very little other
information on the C0 stepping; it may have been quickly superseded by the D0 stepping, which used revision
identifier 0x05.

### Errata

It's fair to say that early 80386 steppings had a lot of problems.  But that's not terribly surprising,
considering the 80386's leap in functionality: a new 32-bit architecture that included paging and virtual
8086 mode, while also maintaining 16-bit protected-mode compatibility with the 80286, not to mention
real-mode compatibility with the 8086.

Here's what the world knew about 80386 problems in the B1 stepping, as of December 17, 1986:

1. Opcode Field Incorrect for FSAVE and FSTENV  
	**Problem**: If an FSAVE or an FSTENV is executed in REAL mode or in VIRTUAL 8086 mode, the opcode field
	stored in memory is incorrect if it should have referred to a coprocessor instruction which transfers
	either two bytes or ten bytes from memory to the coprocessor. The instruction and operand linear address
	fields are correctly stored. Note that coprocessor error-handling routines are the only routines possibly
	affected. Also note that the problem does not occur in PROTECTED mode programs (since no opcode is saved
	by FSAVE or FSTENV in that case).  
	&nbsp;  
	**Workaround**: In REAL mode or in VIRTUAL 8086 mode, the instruction linear address field can be used to
	read the opcode from memory. Note that the two bytes fetched need to be swapped to yield the image that
	FSAVE and FSTENV normally stores.
2. FSAVE, FRESTOR, FSTENV and FLDENV Anomolies [sic] with Paging  
	**Problem**: If either of the last two bytes of an FSAVE or an FSTENV operand are for any reason not writeable,
	or either of the last two bytes of an FRESTOR or FLDENV are for any reason not readable, the instruction
	is not restartable.  
	&nbsp;  
	**Workaround**: This does not not affect typical systems with reasonably-assigned page access rights.
	In an obscure situation where this problem arises, a workaround is to avoid having the operand of these
	instructions span a page boundary. This can be accomplished by aligning these operands on any 128-byte boundary.
3. Wraparound Coprocessor Operands  
	**Problem**: This can affect only situations where a coprocessor operand straddles the limit of a segment
	of maximum size (i.e. 0FFFFh for a 16-bit segment or 0FFFFFFFFh for a 32-bit segment) or within 108 bytes of
	maximum size, thus wrapping around to offset 0 of the segment. Since a wraparound situation is very abnormal
	for a compiler or programmer to create, this does not affect a typical system.  
	&nbsp;  
	Formally, the 80386 architecture does not permit an operand (coprocessor operands included) to wrap around
	the end of a segment. If the user issues such an instruction nonetheless in a Protected Mode system, and
	the operand starts and ends in valid, present pages of a segment, BUT spans through an invalid or inaccessible
	page, the coprocessor may be put in an indeterminate state. In such cases, an FCLEX or FINIT instruction needs
	to be executed before any other coprocessor instruction is issued.  
	&nbsp;  
	**Workaround**: In Real Mode, this is not a problem since protection is not enabled. In Protected Mode,
	this problem is avoided simply by not creating coprocessor operands which wrap around the end of the segment,
	or by aligning the base of all segments on page boundaries.
4. IRET to TSS with Limit too Small  
	**Problem**: If an IRET performs a task switch to a TSS of proper descriptor type but invalid (too small) limit,
	a Double Fault (exception 8) will result instead of a Invalid TSS Fault (exception 10) as should result.
	Furthermore, if the Double Fault entry in the IDT is a trap gate, a shutdown results. In a related topic,
	if the TSS Fault entry in the IDT is invalid for any reason (e.g. bad AR byte), then instead of a Double Fault
	(exception 8), a shutdown results.  
	&nbsp;  
	**Workaround**: A working system, one that creates TSS segments of adequate size to hold the processor state
	(44 bytes for the TSS of a 16-bit task, 104 bytes for the TSS of a 32-bit task), will not encounter any problems
	here. A working system should also provide a valid gate (interrupt, trap, or task gate) in the IDT for exception 8.
5. Single-Stepping First Iteration of REP MOVS  
	**Problem**: If a REPeated MOVS instruction is executed when single-stepping is enabled (TF = 1 in EFLAGS register),
	a single-step trap (exception 1) is taken every two move steps, but should occur each move step. Also, if a data
	breakpoint is hit during a odd iteration number of REP MOVS, the data breakpoint trap is not taken until after the
	next even-numbered iteration. If the REP MOVS ends with an odd number of iterations, and single-stepping or data
	breakpoints are enabled, then a single-step trap or data breakpoint trap on the final iteration will properly occur
	after the final, odd-numbered iteration.  
	&nbsp;  
	**Workaround**: When using the Trap Flag or data breakpoints with a debugger utility, this minor variation of
	REP MOVS must be accepted, unless an effort is made to have the debugger emulate the REP MOVS rather than actually
	execute it.
6. Task Switch to Virtual 8086 Mode Doesn't Update Prefetch Limit  
	**Problem**: When a task switch to Virtual 8086 Mode is performed, the prefetch limit is not updated to become 0FFFFh,
	but instead remains at its previous value.  
	&nbsp;  
	**Workaround**: Use the IRET instruction to transfer to Virtual 8086 Mode. Using IRET is the preferred method for
	most instances, especially when the master OS dispatches a Virtual 8086 Mode program, because IRET can cause the
	transition without a task switch.
7. Wrong Register Size for String Instructions in Mixed 16/32-bit Addressing Systems  
	**Problem**: If certain string and loop instructions are followed by instructions that either:  
	&nbsp;  
	1) use a different address size (that is, if either the string instruction or the following instruction
	uses an address size prefix), or  
	&nbsp;  
	2) reference the stack (e.g. PUSH/POP/CALL/RET) and the "B" bit in the SS descriptor is different from the address size used by the string
	instructions,  
	&nbsp;  
	then one or more of [E]CX, [E]SI, or [E]DI is not updated properly. The size of the register (16 vs. 32) is
	taken from the following instruction rather than from the string or loop instruction. This could result in
	updating only the lower 16 bits of a 32-bit register, or in updating all 32 bits of a register being used as
	16 bits. The instructions (and registers) affected by this are:  
	&nbsp;  
	MOVS ([E]DI), REP MOVS ([E]SI), STOS ([E]DI), INS ([E]DI), and REP INS ([E]CX).  
	&nbsp;  
	**Workaround**: No workaround is necessary if all code is 16-bit or if all code is 32-bit. The problem only
	occurs if instructions with different address sizes are mixed together, or if a code segment of one size is used
	with a stack segment of the other size.  
	&nbsp;  
	In a system which mixes address sizes, add a NOP after each of the above instructions and ensure that the NOP
	has the same address size as the string/loop (i.e., if the string/loop instruction includes an address prefix,
	place the same address prefix before the NOP; conversely, if the string/loop instruction does not have an address
	prefix, do not place a prefix before the NOP).
8. FAR Jump Located Near Page Boundary in Virtual 8086 Mode Paged Systems  
	**Problem**: In Virtual 8086 Mode, if a direct FAR jump (opcode EAh) instruction is located at the end of a
	page (or within 16 bytes of the end), and the next page is not cached in the TLB, the prefetcher limit is not
	set by the FAR jump instruction to the "end" on the new code segment, but rather is left at the "end" of the
	old code segment. This can allow execution beyond the end of the new segment without triggering a segment limit
	violation. Or it can result in a spurious GP fault if the old and new segments overlap, and a prefetch occurs
	beyond the limit of the old segment.  
	&nbsp;  
	Note that the prefetch limit is checked on the linear address, not by comparing IP to 0FFFFh.  
	&nbsp;  
	**Workaround**: All existing 8086 programs use only 16-bit addressing, and thus will not execute code at offsets
	greater than 0FFFFh from the code segment base. Thus the lack of detection of walking off the end of a code segment
	should not impact working 8086 programs.  
	&nbsp;  
	A workaround to the spurious GP fault, if it occurs, is to simply IRET back to the faulting instruction, since the
	IRET will correctly set the prefetch limit. If the fault handler has control of the single-step function, a very
	simple workaround is to attempt to single-step the faulting instruction. If the single-step succeeded, the handler
	could clear the fault, turn off single-stepping, and IRET. If a GP fault occurred attempting to single-step the
	instruction, a "real" GP fault is the cause.  
	&nbsp;  
	If the fault handler cannot access the single-stepping function, it still can check for "real" GP faults which must
	be emulated by the master OS, for example, I/O instructions that need to be emulated, CLI/STI instructions that must
	be emulated, etc. If none of these faults are recognized, the fault handler can assume this errata caused the GP fault
	and simply IRET back to the instruction.
9. Page Fault Error Code on Stack Not Reliable  
	**Problem**: When a Page Fault (exception 14) occurs, the 3 defined bits in the error code may be unreliable
	if a certain sequence of prefetch is happening at the same time.  
	&nbsp;  
	**Workaround**: Although the page fault error code pushed onto the page fault handler's stack can be unreliable,
	as described, the page fault linear address stored in register CR2 is always correct. The page fault handler should
	refer to the page fault linear address in CR2 to access the corresponding page table entry and thereby determine
	whether the page fault was due to a page "not present" condition, or to a usage violation.
10. Certain I/O Addresses Incorrect when Paging is Enabled  
	**Problem**: When Paging is enabled, accessing I/O addresses in the range 00001000h-0000FFFFh (4K through 64K-1)
	or accessing coprocessor ports (I/O addresses 800000F8h-800000FFh) as a result of executing coprocessor opcodes,
	can generate incorrect I/O addresses if paging is enabled and the corresponding linear memory address is marked
	"present" and "dirty."  
	&nbsp;  
    Furthermore, when paging has been enabled and is then turned off, paging translation continues to occur for memory
    or I/O cycles (I/O as described above) to linear addresses still stored in the TLB, but paging does not occur for
    linear addresses that result in a TLB miss.  
    &nbsp;  
    **Workaround**: Unless paging is used, this item is not a problem. If paging is used but all I/O ports are below
    00001000h (as in a PC-DOS system), then I/O is no problem.  
    &nbsp;  
    If paging is used and I/O ports exist in the range 0000l000h-0000FFFFh, then either have the memory pages at those
    linear addresses marked "not present" (to avoid having those pages table entries cached in the TLB), or if "present,"
    have those pages mapped such that bits 12-15 of the physical address equal bits 12-15 of the linear address.
    Alternatively, re-assign any I/O ports in the range 00001000h-0000FFFFh to below 00001000h.  
    &nbsp;  
    If paging is used and the coprocessor is also used, then have the memory page at linear address 80000xxxh either
    marked "not present" (to avoid having that page table entry cached in the TLB), or if "present," have the page
    mapped such that bit 31 (the most significant bit) of that page's physical address is a 1.  
    &nbsp;  
    To completely disable 80386 paging when paging was previously enabled, the 80386 TLB should be flushed immediately
    after resetting the~PG bit in CRO. The TLB can be flushed, you recall, by writing a Page Table Directory base address
    to register CR3.
11. Wrong ECX Update by REP INS  
	**Problem**: The ECX register (or CX in case of 16-bit operations) is not updated properly in the case of a
	REP INS instruction (INPut string instruction with any REPeat prefix) that is followed by an early-start instruction
	(e.g. PUSH, POP or memory reference instructions). After any REP-prefixed instruction, ECX is supposed to be 0 (null).
	But in the case of a REP INS instruction, ECX is not updated correctly and is 0FFFFFFFFh (or CX is 0FFFFh in case of
	16-bit operations). It should be noted that the REP INS executes the correct number of iterations and EDI (or DI)
	is updated properly.  
	&nbsp;  
	**Workaround**: After a REP INS instruction, do not rely on ECX (or CX) being zero. Hence, a new count (if any)
	should be MOVed into ECX, rather than being ADDed into ECX.
12. NMI Doesn't Always Bring Chip Out of Shutdown in Obscure Condition with Paging Enabled  
	**Problem**: If paging is enabled, and if the IDT gate for the Double Fault handler (the gate for exception 8)
	points to the null descriptor slot, descriptor 0, in the GDT (this would be very a strange way to set up a system),
	and a TLB miss occurs when accessing the null descriptor slot, the chip enters shutdown as it should in this case.
	In this specific case however, an incoming NMI will not be able to bring the 386 out of shutdown. In this specific
	case, only reset will bring the 386 out of shutdown.  
	&nbsp;  
	**Workaround**: Ensure that the IDT gate for the Double Fault Handler has a non-null selectors for CS, and that
	SS of the destination level is also non-null.
13. HOLD Input During Protected Mode Interlevel IRET when Paging is Enabled  
	**Problem**: Under specific situations involving paging and the page privilege bits, the HOLD input, and a RET
	or IRET instruction performing an inter-level return to level 3, a problem can develop. These situations can be
	avoided by the workarounds given.  
	&nbsp;  
	The first situation, when the inner level stack (levels 0, 1, and 2) is not dword aligned (or not word aligned
	in the case of a 16-bit [I]RET), requires that several conditions occur simultaneously:  
	&nbsp;  
	1) Paging must be enabled, and the page table and directory entries for the inner level stacks must be marked
	as supervisor access only.  
	&nbsp;  
	2) The software must execute an inter-level RET or IRET to a Protected Mode program at privilege level 3.
	An inter-level IRET to Virtual 8086 Mode does not exhibit this problem. An inter-level RET or IRET to level 1
	or 2 does not exhibit this problem.  
	&nbsp;  
	3) The inner level stack must be unaligned to a dword boundary (word boundary for a 16-bit [I]RET).  
	&nbsp;  
	When the first situation occurs, a page fault (exception 14) occurs spuriously, indicating a page level
	protection violation during a "user" level read of the inner level stack.  
	&nbsp;  
	The second situation, whether or not the inner level stack is dword aligned (or word aligned in the case of a
	16-bit [I]RET), also requires that several conditions occur simultaneously:  
	&nbsp;  
	1) Paging must be enabled, and the page table and directory entries for the inner level stacks must be marked
	as supervisor access only.  
	&nbsp;  
	2) The software must execute an inter-level RET or IRET to a Protected Mode program at privilege level 3.
	An inter-level IRET to Virtual 8086 Mode does not exhibit this problem. An inter-level RET or IRET to level 1
	or 2 does not exhibit this problem.  
	&nbsp;  
	3) The bus HOLD input must be asserted during the read, cycle which pops ESP (or SP) off the inner stack as a
	result of a RET or IRET instruction.  
	&nbsp;  
	When the second situation occurs, no exception is generated, but the processor will drive an incorrect physical
	address during the read cycle in which SS is popped from the inner level stack.  
	&nbsp;  
	**Workarounds**: A software workaround to both situations is to mark all pages which contain the inner level
	stacks as user readable. This prevents either the first or second situation from occurring. The segmentation
	system can be used to prevent user access to the linear addresses containing the inner-level stacks.  
	&nbsp;  
	A workaround if not using the HOLD input is merely to keep the inner-level stacks aligned.  
	&nbsp;  
	A Hardware workaround if using the HOLD input but not using the software workaround above is the following:
	Since the problem occurs during the first cycle after a locked cycle to read the CS descriptor, a hardware
	workaround is to prevent a HOLD request from hitting the processor during bus cycle following a LOCKed cycle.
	This can be accomplished with a latch that delays the LOCK# signal through a flip-flop clocked by READY# to
	gate a HOLD request going into the chip. This will prevent a hold request from getting to the 80386 until after
	the completion of the first cycle after a LOCKed cycle. For the hardware workaround to be sufficient, all stacks
	must be properly aligned, and BS16# must be tied inactive.
14. Protected Mode LSL Instruction Should not be Followed by PUSH/POP  
	**Problem**: This item pertains only to Protected Mode. If the Protected Mode LSL instruction (Load Segment
	Limit instruction, executable only in Protected Mode) is immediately followed by certain instructions that
	perform a stack operation, such as PUSH or POP (see exact list below), the value of the [E]SP register may be
	incorrect after the stack operation. Note that stack operations resulting from interrupts or exceptions following
	LSL do update [E]SP correctly.  
	&nbsp;  
	**Workaround**: Do not immediately follow the Protected Mode LSL instruction with any of the following stack
	operation instructions: IRET (intra-task), POPA, POPF, POP (mem, reg, seg-reg), RET (intrasegment or intersegment),
	CALL (direct intrasegment, direct intersegment, indirect intrasegment via reg), ENTER, PUSHA, PUSHF, PUSH (mem,
	reg, seg-reg, immed). Other instructions that operate on the stack (e.g. CALL indirect via memory, and LEAVE) can
	be used safely after the Protected Mode LSL. Note that even if a forbidden instruction immediately follows LSL,
	[E]SP may still be updated correctly, since this problem is data-dependent and only occurs if the LSL operation
	succeeded (i.e. if LSL set the ZF flag).
15. LSL/LAR/VERR/VERW Instructions Malfunction with Null Selector  
	**Problem**: The Protected Mode instructions LSL, LAR, VERR or VERW executed with a null selector (i.e. bits
	15 through 2 of the selector set to zero) as the operand will operate on the descriptor at entry 0 of the GDT
	instead of unconditionally clearing the ZF flag.  
	&nbsp;  
	**Workaround**: The "null descriptor" (i.e. the descriptor at entry 0 of the GDT) should be initialized to all
	zeroes. If the "null descriptor" is initialized to all zeroes (i.e. an invalid value), the access made by these
	instructions to the "null descriptor" will fail (since these instructions only operate on valid descriptors).
	The failure will be reported with ZF cleared, which is the desired behavior when the operand is a null selector.
	Note that many systems already have the "null descriptor" in the GDT initialized to zeroes, as is desired for
	this workaround.
16. "Not Present" LDT in VM86 Task Raises Wrong Exception  
	**Problem**: A task switch to a VM86 task that has a "not present" LDT descriptor will cause a Segment Not Present
	fault (exception 11) rather than an Invalid TSS fault (exception 10).  
	&nbsp;  
	**Workaround**: The simplest workaround is to use a NULL selector for the LDT in a VM86 task, since the LDT is
	not used when executing in Virtual 86 mode. However, if an interrupt or exception occurs, the processor will switch
	out of Virtual 86 mode, into protected mode to handle the interrupt, without switching tasks. Thus, the operating
	system should be structured so that all Interrupt and Trap gates active when executing a VM86 task reference segments
	in the GDT.  
	&nbsp;  
	If an LDT must be supplied for a task that executes in Virtual 86 mode, there are several easy workarounds. One
	is to ensure that LDT segments are never marked "not present" in their segment descriptors. Paging is not affected
	by this errata. LDT segments can be paged out and marked "not present" in their page descriptors in systems which
	use paging.  
	&nbsp;  
	If the operating system must mark the LDT segment descriptor "not present", the "not present" (exception 11)
	handler must be able to handle the case of a "not present" LDT during a task switch. The "not present" exception
	is reported with the LDT selector as the error code and with the VM bit set to 1 in the EFLAGS image of the caller.
	Since a VM86 task cannot normally raise a "not present" fault, the "not present" exception handler can detect this
	case by checking if the stored VM bit is set. If so, the fault can be redirected to the TSS Fault handler.
17. Coprocessor Instructions Crossing Page/Segment Boundaries  
	**Problem**: If the first byte of a coprocessor (ESC) instruction is located on the last byte of a page or segment,
	and the second byte is located on a page or segment which would create a fault, then the processor will hang when
	it tries to signal the fault. The processor remains stopped until an interrupt, NMI, or RESET occurs. This errata
	applies only to coprocessor instructions in systems which use virtual memory.  
	&nbsp;  
	**Workaround**: In virtual memory systems, the time-slice or watchdog timer provides an easy workaround, since a
	timer interrupt will always cause the processor to begin interrupt processing. The timer routine should test the
	following conditions to determine if this errata was encountered.  
	&nbsp;  
	1) The saved CS:EIP must point within 8 bytes of the end of a page.  
	&nbsp;  
	2) The last byte within the page must contain an ESC opcode.  
	&nbsp;  
	3) All bytes between the saved CS:EIP and the ESC opcode must contain valid prefix opcodes (segment override 26h,
	2Eh, 36h, 3Eh, 64h, 65h, address size override 67h, operand size override 66h).  
	&nbsp;  
	4) The next page is not present, or not accessable.  
	&nbsp;  
	If all four conditions are true, then the timer routine can assume this errata was encountered, and signal a page
	fault, which will clear the condition. This workaround should be placed in the Operating System, so that applications
	programs are unaffected.
18. Double Page Faults Do Not Raise Double Fault Exception  
	**Problem**: If a second page fault occurs, while the processor is attempting to enter the service routine for the
	first, then the processor will invoke the page fault (exception 14) handler a second time, rather than the double
	fault (exception 8) handler. A subsequent fault, though, will lead to shutdown.  
	&nbsp;  
	**Workaround**: No workaround is necessary in a working system.

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

On September 1, 1987, the final 80386-B1 errata update that I'm aware of continued to list previous errata (#1-#17),
plus the two errata from April 30 (#18 and #19), along with the following new errata:

+ VERR/VERW/LAR/LSL Instructions Malfunction with Bad Selector
+ Coprocessor Malfunctions with Paging Enabled

This brought the total number of 80386-B1 errata to 21.

There was also a manufacturing problem that caused 32-bit multiplications to fail on some parts, which Intel
publicly acknowledged in April 1987.

From the San Jose Mercury News, April 11, 1987:

    INTEL DISCOVERS A BUG IN ITS NEW 80386 CHIP
    Author(s): CHRISTOPHER H. SCHMITT AND JIM BARTIMO, Mercury News
    Business Writers Date: April 11, 1987 Section: Business

    Intel acknowledged Friday that a bug has cropped up in its new flagship microprocessor chip.

    Microprocessors serve as the electronic brains of devices ranging from personal computers to
    home appliances.

    Intel said the bug in its 80386 microprocessor produces incorrect answers when the chip
    performs certain mathematical operations. "When you multiply one 32-bit number by another
    32-bit number, you get the error," said Intel spokesman Jim Jarrett. A 32-bit number is one
    that utilizes the full data path of the chip.

    However, operating system software that would let the chip fully use its 32-bit characteristics
    is still being developed, so the problem shouldn't immediately affect personal computer users.
    Microsoft Corp. of Redmond, Wash., has announced its intention to deliver in early 1988 a 32-bit
    operating system known as OS/2.

    Even when using the 32-bit capabilities of the chip, the possibility of an error is "rare,"
    Jarrett said.

    Spokesman Bruce LeBoss said not all of the 100,000 80386 chips Intel has produced so far are
    affected, but he declined to elaborate. Intel is sticking with a previously announced estimate
    that it will sell from 500,000 to 1 million 80386s this year.

    To address the problem, Intel said it is notifying computer companies and other customers and
    extending the chip's warranty from one to two years. Anticipating that it will replace some
    80386s already in the field, the company charged off an undisclosed amount to cover the
    expense. One analyst estimated the charge at about $7 million.

    Intel will test the chips it has already sold to determine which ones have the bug. But it will
    not replace the chips for free. Instead, Intel will work with customers on an upgrade program.

    Intel said it will be up to individual computer makers to work with consumers who have
    purchased machines using the 80386 chip.

    The problem may be most acutely felt by Houston-based Compaq Computer, which so far has
    been the biggest producer of 80386-based computers. Compaq said it will disclose by early
    next week plans for coping with the possibility that versions of its Deskpro 386 computer model
    contain flawed chips.

    The bug may cause some shortages of the 80386. The problem won't be fixed until July, so the
    only guaranteed chips are those that have already been produced and have passed Intel's test.
    "Everybody wants perfect chips and we'll have fewer of those to go around for a while," Jarrett
    said. Analysts indicated that in the long run, the bug is more likely to be embarrassing than
    anything else. "You have a complex chip here," said Daniel Klesken, an analyst for Montgomery
    Securities in San Francisco. "One should not be surprised that (problems) happen occasionally."

The problem affected the B1 stepping; it's unknown whether other (earlier) steppings were affected
as well.

What follows is some additional information about early 80386 processors from various online sources.

---

Excerpt from "[CPU Identification by the Windows Kernel](http://www.geoffchappell.com/studies/windows/km/cpu/index.htm)", by Geoff Chappell:

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

---

More examples of problems with early 80386 CPUs are posted in "[The Old New Thing](http://blogs.msdn.com/b/oldnewthing/)"
blog.  Here are some highlights from "[My, what strange NOPs you have!](http://blogs.msdn.com/b/oldnewthing/archive/2011/01/12/10114521.aspx)",
by Raymond Chen:

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

---

### Instructions

Here's more information on the opcodes (IBTS and XBTS) that were removed from the B1 stepping.

[IBTS (0x0F 0xA7)](http://asm.inightmare.org/opcodelst/index.php?op=IBTS)

	Opcode IBTS
	
	CPU: 80386 step A0-B0 only 
	Type of Instruction: User 
	
	Instruction: IBTS base,bitoffset,len,sorc 
	
	Description: 
	Write bit string length bits from 
	[bits .. 0 ]	(lowest bits) to bitfield, 
	defined by and bitsoffset from this base 
	to start of the field to write. String write from this start 
	field bit to higher memory addresses or register bits. 
	
	Flags Affected: None 
	
	CPU mode: RM,PM,VM 
	
	+++++++++++++++++++++++ 
	Physical Form:	IBTS	r/m16,AX,CL,r16 
	IBTS	r/m32,EAX,CL,r32 
	COP (Code of Operation)	: 0FH A7H 
	
	Clocks:	IBTS 
	80386:	12/19

[XBTS (0x0F 0xA6)](http://asm.inightmare.org/opcodelst/index.php?op=XBTS):

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

    Note:   Use SHLD/SHRD instructions for extract bits strings.
    On 80386 steps B1+ this opcode generation INT 6,
    and on some of 486 other instruction replace this
    instruction opcode.

    Flags Affected: None

    CPU mode: RM,PM,VM

    +++++++++++++++++++++++
    Physical Form:  XBTS    r16,r/m16,AX,CL
    XBTS    r32,r/m32,EAX,CL
    COP (Code of Operation) : 0FH A6H

    Clocks: XBTS
    80386:  6/13

*[@jeffpar](http://twitter.com/jeffpar)*
*February 23, 2015*
*(Updated March 9, 2015 with information from "Advanced 80386 Programming Techniques")* 
