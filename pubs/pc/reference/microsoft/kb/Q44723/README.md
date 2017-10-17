---
layout: page
title: "Q44723: Side Effects in ISRs and Signal Handlers Confuse Optimizer"
permalink: /pubs/pc/reference/microsoft/kb/Q44723/
---

## Q44723: Side Effects in ISRs and Signal Handlers Confuse Optimizer

	Article: Q44723
	Version(s): 5.00 5.10 | 5.10
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER | S_QuicKc
	Last Modified: 1-JUN-1989
	
	It can be dangerous to allow the Microsoft C or QuickC compiler to
	perform loop optimization on code that contains global variables that
	may be modified in interrupt service routines or signal handlers.
	For example, consider the following code
	
	    int TimerCount = 1000;
	
	    while( TimerCount );
	    printf( "Timer expired." );
	
	where an ISR is concurrently executing the following:
	
	    void interrupt far ISR()
	    {
	        TimerCount--;
	    }
	
	This is acceptable code and performs a simple task -- it waits for a
	global timer variable to reach 0, indicating that the ISR has been
	executed a specified number of times. However, the loop optimization
	optionally performed by the compiler results in the while() loop being
	completely removed from the executable code. Because the compiler does
	not know that the ISR is simultaneously accessing TimerCount, it sees
	no reason to keep an expression that obviously evaluates to true and
	does nothing but waste time. This is NOT a problem with the compiler.
	Section 2.1.2.3 of the 7 December 1988 ANSI C draft standard states
	the following:
	
	   An actual implementation need not evaluate part of an expression
	   if it can deduce that its value is not used and that no needed
	   side effects are produced (including any caused by calling a
	   function or accessing a volatile object).
	
	Because C 5.10 does not semantically implement the "volatile" keyword,
	there is no way to indicate that TimerCount is volatile and that the
	expression involving TimerCount should not be removed from the program
	by the optimizer. Thus, it is reasonable for the compiler to assume
	that this expression is not necessary and may be safely removed.
	
	When writing code for Interrupt Service Routines or signal handlers
	that expect conditions that the compiler cannot predict, care should
	be used in the choice of optimizations; and, if needed, an assembly
	code listing should be generated with the /Fc or /Fs /Fa switches and
	examined for the optimization's effect. Disabling optimization with
	/Od may result in slower executable programs but will prevent
	optimizer side effects.
