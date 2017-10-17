---
layout: page
title: "Q36782: C2086 Error When Compiling with /Oi and #include &lt;mt&#92;math.h&gt;"
permalink: /pubs/pc/reference/microsoft/kb/Q36782/
---

## Q36782: C2086 Error When Compiling with /Oi and #include &lt;mt&#92;math.h&gt;

	Article: Q36782
	Version(s): 5.10
	Operating System: OS/2
	Flags: ENDUSER |
	Last Modified: 16-JAN-1990
	
	When using the multithreaded version of <math.h>, error C2086
	"identifier redefinition" occurs if -Oi (or -Ox) intrinsic
	optimization is enabled. The cause of the error is the fact that the
	compiler has built-in prototypes for intrinsic functions. Because
	<mt\math.h> declares these functions differently, the C2086 error is
	generated.
	
	This conflict arises for the following floating-point routines:
	
	   acos  asin  atan  atan2  cos  exp  fabs  fmod  log  log10  pow
	   sin   sinh  sqrt  tan    tanh
	
	The conflict occurs because the compiler has built-in function
	prototypes for routines for which it is generating intrinsics. When
	you compile with the normal include files, the compiler's internal
	prototype is the same as the one in <math.h>, so there is no conflict.
	However, when you use <mt\math.h>, the prototypes are changed from
	"_CDECL" to "far pascal", which causes the redefinition error.
	
	One workaround is to use the following
	
	   #pragma function ({func1} {func2} {etc})
	
	at the start of the module to force functions to be used instead of
	intrinsics. This will also work if you are using the alternate math
	library with multithreaded and/or DLL modules and the link fails with
	unresolved externals.
	
	A second workaround to this conflict is to use the C preprocessor's
	conditional-compilation facility, as in the following fragment of
	<mt\math.h>:
	
	----------------------------------------------------------------------
	    last part of <mt\math.h>
	----------------------------------------------------------------------
	
	/* function prototypes */
	
	#ifndef INTRINSICS    /* this is the modification */
	
	double far pascal acos(double);
	double far pascal asin(double);
	double far pascal atan(double);
	double far pascal atan2(double, double);
	double far pascal cos(double);
	double far pascal cosh(double);
	double far pascal exp(double);
	double far pascal fabs(double);
	double far pascal fmod(double, double);
	double far pascal log(double);
	double far pascal log10(double);
	double far pascal pow(double, double);
	double far pascal sin(double);
	double far pascal sinh(double);
	double far pascal sqrt(double);
	double far pascal tan(double);
	double far pascal tanh(double);
	
	#endif  /* INTRINSICS; end of modification */
	
	int    far _CDECL abs(int);
	double far pascal atof(const char far *);
	double far pascal cabs(struct complex);
	double far pascal ceil(double);
	int    far _CDECL dieeetomsbin(double far *, double far *);
	int    far _CDECL dmsbintoieee(double far *, double far *);
	int    far _CDECL fieeetomsbin(float far *, float far *);
	double far pascal floor(double);
	int    far _CDECL fmsbintoieee(float far *, float far *);
	double far pascal frexp(double, int far *);
	double far pascal hypot(double, double);
	double far pascal j0(double);
	double far pascal j1(double);
	double far pascal jn(int, double);
	long   far _CDECL labs(long);
	double far pascal ldexp(double, int);
	int    far _CDECL matherr(struct exception far *);
	double far pascal modf(double, double far *);
	double far pascal y0(double);
	double far pascal y1(double);
	double far pascal yn(int, double);
	
	In this version of <mt\math.h>, the intrinsic math routines have been
	pulled out of the main block of function prototypes and conditionally
	compiled; the preprocessor will include them only if the symbol
	"INTRINSICS" is not defined. This way, under normal circumstances,
	nothing is different; when you #include <mt\math.h>, all the
	prototypes are included. But when you want to optimize with /Ox or
	/Oi, you can use the following command-line option so that the
	preprocessor will remove those prototypes from the compilation:
	
	cl  ... /D INTRINSICS ...
