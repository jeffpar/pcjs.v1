---
layout: page
title: "Q66295: What Happens to Stack Memory When Thread Terminates?"
permalink: /pubs/pc/reference/microsoft/kb/Q66295/
---

	Article: Q66295
	Product: Microsoft C
	Version(s): 6.00
	Operating System: OS/2
	Flags: ENDUSER |
	Last Modified: 24-OCT-1990
	
	Question:
	
	If I call _beginthread() with NULL as the second parameter, the
	run-time is supposed to create a thread stack for me. How is this
	done? Also, when the thread terminates with _endthread(), is the
	memory automatically released back to the operating system?
	
	Response:
	
	If _beginthread() is called with NULL for the thread stack, a stack of
	size stack_size (passed as the third parameter) is malloc()'ed from
	the heap. At the time the thread is terminated, the stack is still in
	use; therefore, _endthread() does not automatically free it. In fact,
	the last thing _endthread() does is push the appropriate arguments
	onto the stack and call DosExit().
	
	However, the memory is recovered. The next time that thread ID is
	used, _beginthread() will check to see if the thread stack had been
	previously malloc()'ed internally by the function. If so, it will call
	free() at that time. Note that the thread memory doesn't go to the
	operating system; instead, it is returned to the heap. Due to the fact
	that OS/2 will use a thread ID from terminated threads first, there
	will usually be only one thread stack not free()'ed.
	
	As a side note, in 32-bit OS/2, this is all a moot point. The 32-bit
	DosCreateThread() API call will automatically allocate/deallocate the
	thread stack.
