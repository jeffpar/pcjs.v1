---
layout: page
title: "Q37020: QuickC Generates Warning Message &quot;C4071&quot; erroneously"
permalink: /pubs/pc/reference/microsoft/kb/Q37020/
---

## Q37020: QuickC Generates Warning Message &quot;C4071&quot; erroneously

	Article: Q37020
	Version(s): 1.01
	Operating System: MS-DOS
	Flags: ENDUSER | BUGLISTQC
	Last Modified: 20-OCT-1988
	
	The code below fragment demonstrates a problem with the way the
	QuickC environment handles certain prototypes. When compiled inside
	the environment at warning level three, the compiler generates the
	warning message C4071 "<function name> no prototype given," even
	though the function does have a prototype.
	
	Microsoft has confirmed this to be a problem in Version 1.01. We are
	researching this problem and will post new information as it becomes
	available.
	
	This message appears only with functions of type void with no
	parameters. Because you cannot avoid such constructions if you use
	indirect recursion, you cannot work around this problem. However, you
	can lower the warning level to two and this problem will not occur.
	
	The following sample code demonstrates this problem:
	
	        void a(void);
	        void b(void);
	
	        void a(void)
	        {
	        }
	
	        void b(void)
	        {
	          a();
	        }
	
	        void main(void)
	        {
	        }
