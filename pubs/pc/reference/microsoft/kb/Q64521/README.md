---
layout: page
title: "Q64521: Heap Management and Why malloc() May GP Fault in OS/2"
permalink: /pubs/pc/reference/microsoft/kb/Q64521/
---

	Article: Q64521
	Product: Microsoft C
	Version(s): 5.10 6.00
	Operating System: OS/2
	Flags: ENDUSER | GPF
	Last Modified: 9-NOV-1990
	
	On rare occasions, a protection violation may occur under OS/2 while
	a program is executing the code for the Microsoft C run-time library
	function malloc(). This type of problem can usually be traced to a
	situation where a program makes repeated calls to malloc() and at some
	point between calls something overwrites its bounds in the dynamically
	allocated memory. If this happens and the internal data structures in
	the heap are corrupted, the next call to malloc() will inadvertently
	try to allocate memory that may not really be available, resulting in
	the protection violation.
	
	The malloc() function gives you memory in the size you request, but
	malloc() gets the memory from the operating system (OS) in "blocks".
	This block size is determined by the value of _amblksize, which is 8K
	by default. Therefore, if you request 100 bytes on your first malloc()
	call, malloc() will actually get 8K from the operating system to
	satisfy your request. If the next request can be satisfied from the
	remainder of the 8K block, then it will be. If not, then malloc()
	requests the number of new 8K blocks needed from the OS to satisfy the
	new request.
	
	The result is that you always get memory from the OS in 8K multiples,
	but the internal malloc() suballocation routines divide it up for the
	program's specific requests. The heap, itself, is essentially this
	group of 8K blocks that contain memory that can be used and freed by
	your program. As you do more and more malloc() calls, the heap grows.
	When a segment boundary limits further expansion, a new segment is
	added to the heap.
	
	The heap is structured with a 12-byte header at the beginning of the
	segment and then there is a two-byte header at each new allocation.
	These headers contain a two-byte number that is the size of the
	allocated amount. If the last bit is a 0 (zero), then the memory is
	being used -- if the last bit is a 1, then the memory has been freed
	and is available.
	
	Because of this scheme, all allocations must be in even-byte amounts.
	Requests for odd amounts are satisfied with an even number of bytes of
	memory. Odd values are used only to show availability. The top end of
	the current heap segment also contains a header with a flag (FFFE),
	which indicates the end of the heap segment.
	
	As an example, assume three calls to malloc() are made for 2K, 3K, and
	2K bytes. The heap would then appear as follows:
	
	               ______________
	               |    FFFE    | 8K
	               |------------|
	               |    1002    |
	               |  remaining |
	               |    bytes   |
	               |------------|
	Rover -------> |    3EDH    | <--- Next allocation header
	               |------------|        (odd = available)
	               |     2K     |
	               | allocation |
	               |------------|
	               |    800H    | <--- Allocated memory header #3
	               |------------|        (even = in use)
	               |            |
	               |     3K     |
	               | allocation |
	               |------------|
	               |    C00H    | <--- Allocated memory header #2
	               |------------|        (even = in use)
	               |     2K     |
	               | allocation |
	               |------------|
	               |    800H    | <--- Allocated memory header #1
	               |------------|        (even = in use)
	               |   HEADER   |
	               |____________| <--- Heap segment header
	
	The rover (shown in the diagram above) is a pointer that always points
	to the header of the next new allocation area or to the header of the
	last freed heap area, if a segment was just freed. Either way, the
	rover is always pointing to an available memory area in the heap.
	
	When you request more memory, the header at the rover is checked
	first. If that current header does not show enough space, then the
	rover advances to the next header and another check is done. If the
	space is in use or not big enough, then the rover continues to the
	next. If the rover reaches the top of the segment, it wraps around to
	the bottom. The rover knows where the next header is each time by
	looking at the current header and moving that many bytes ahead (less 1
	if that amount is odd). If the current header shows FFFE, the rover
	knows to wrap around to the bottom.
	
	If the rover finally works its way back to its starting point, it
	means that no currently free section of the heap is big enough to
	satisfy the request, so an attempt is then made to grow the segment.
	If that is not possible, then a new segment is added to the heap.
	
	To continue the example, assume that you have the above scenario and
	the heap is as shown. Let's also assume that you now want 5K of
	memory. If all is well, the search (as described in the preceding
	paragraphs) will take place, but no block will be found in the current
	heap that is large enough. Therefore, the heap will be grown with
	another 8K block from the OS and the actual heap allocation will be
	made right where the rover is currently pointing. The program will
	behave as expected.
	
	On the other hand, let's assume that before asking for more memory, a
	pointer used to deal with data in the second allocated memory section
	inadvertently goes out of range and happens to cause the "allocated
	memory header #3" to be written over. Let's also assume that this
	overwrite causes the value at "allocated memory header #3" (when
	interpreted as an integer) to become an odd number larger than 5K (for
	example, 8AC1h):
	
	                     .
	                     .
	                     .
	               |     2K     |
	               | allocation |
	               |------------|
	This value --> |   8AC1H    | <--- Allocated memory header #3
	is now garbage |------------|        (now odd = available)
	               |            |
	               |     3K     |
	               | allocation |
	               |------------|
	               |    C00H    | <--- Allocated memory header #2
	                     .
	                     .
	                     .
	
	Then, assuming that we try to malloc() our desired 5K, the header at
	the rover will be checked first. Since 3EDh is not large enough, the
	rover jumps to the next header at the top of the heap. The FFFE header
	signals that the rover should wrap to the bottom of the heap segment.
	It gets to the bottom and the first header says the memory is in use.
	It goes to the second header and this, too, is unavailable.
	
	Now, the critical part happens. The rover goes up the correct number
	of bytes to read the third header, but the value there is 8AC1h. This
	is odd (= available) and greater than 5K, so malloc() thinks it has
	found its spot. Before returning, malloc() counts off the 5K bytes and
	tries to write the new header for the next allocation. Of course this
	is out of the range of memory that has already been allocated to us by
	the OS, so you get a protection violation when it tries to write.
	
	There are many other possible scenarios, but the result is essentially
	the same. If you corrupt the heap inadvertently, you're likely to
	crash with a protection violation. Under DOS, you'll end up trashing a
	lot of memory. To resolve this problem, you must look for places in
	the allocated data where you could be going out-of-range.
	
	There are a number of heap-checking functions available for
	identifying problems in the heap (for example, _heapchk, _heapwalk,
	etc.). If you are suffering from malloc() or heap problems, then a
	good debugging plan to check the heap with these functions before each
	new malloc() call, until the heap-damaging area of the code is
	isolated.
