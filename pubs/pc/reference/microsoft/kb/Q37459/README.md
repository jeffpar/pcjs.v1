---
layout: page
title: "Q37459: &quot;pascal&quot; Attribute for Multi-Thread Functions Returning Double"
permalink: /pubs/pc/reference/microsoft/kb/Q37459/
---

## Q37459: &quot;pascal&quot; Attribute for Multi-Thread Functions Returning Double

	Article: Q37459
	Version(s): 5.10
	Operating System: OS/2
	Flags: ENDUSER |
	Last Modified: 22-NOV-1988
	
	Although it is not documented, an important requirement for returning
	floating-point values from functions in a multi-thread environment is
	defining and prototyping functions with the "pascal" function
	attribute as we have done for all functions prototyped to return a
	double in \include\mt\math.h.
	
	When you use the pascal attribute on floating-point functions, the
	floating-point return value is placed on the calling thread's stack,
	providing each thread with its own return value as desired.
	
	When using the default of the C function call/return convention
	instead of pascal, we use a global variable __fac (floating-point
	accumulator) for returning floating-point values. For multi-thread
	applications or DLL's using CRTLIB.DLL, the global variable __fac
	could be unintentionally modified by another thread, so it is not
	contained in CRTEXE.OBJ, CRTDLL.OBJ, or CRTDLL.LIB. Consequently,
	references to __fac will be unresolved at link time.
