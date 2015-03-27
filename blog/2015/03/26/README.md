JavaScript Idiosyncrasies
---
Time to mention a few JavaScript idiosyncrasies, and how I deal with them.

Also, see my previous posts on [PCjs Coding Conventions](/blog/2014/09/30/) and [JavaScript Negativity](/blog/2014/10/26/).

### Strict Equality

Most sites will advise you to *never* use the "==" and "!=" JavaScript operators, because when they compare variables
containing different data types, JavaScript will coerce one of the operands to a matching type, sometimes in unexpected
ways.  We can thank the early days of JavaScript for this feature, when it was trying to be extraordinarily forgiving
of sloppy code.  I'm not going to list all the odd results that can arise from JavaScript's operand coercion, because
there are more than enough examples on the web already.

To avoid unexpected type coercion, and thus unexpected matches and/or mismatches, the usual advice is to *always* use
strict equality operators ("===" and "!==").

I disagree.  In properly written code, you should always know what type of data your variables contain.  In fact,
the more you're able to use JSDoc types to declare the data types of all your parameters, return values, and other
variables, the fewer errors you'll have.  And type coercion will never be a problem as long as you're always comparing
variables with matching types, because no coercion will be performed.

Another problem with strict equality operators is that they require more work to check for both *undefined* and *null*
values.  For example, when I write a method with optional parameters, I generally allow those parameters to either
be omitted or set to *null*.  Using "==", you can check for either value with a single comparison:

	if (parameter == null) { ... }
	
whereas strict equality requires more work:
 
	if (parameter === undefined || parameter === null) { ... }

This is one of the few times I think coercion (of *undefined* to *null*) is beneficial.

Another common pattern:

	if (!b) { ... }

is a popular way of checking for "falsy" values (ie, *undefined*, *null*, 0, false, "", NaN, etc).
Again, another situation where type coercion is beneficial and well understood.  Don't use this technique for
the *undefined* or *null* parameter however:

	if (!parameter) { ... }

because a valid numeric parameter could include 0, a valid string parameter could include "", etc.

When I recommend *not* using strict comparisons, I'm not saying coercion is good.  I agree that it generally
should be avoided, except in well-defined situations, as noted above.  Know your variable data types, compare
variables only of the same type, and you'll be fine.

Problems with type coercion are **NOT** problems caused by a poor choice of operators, so trying to make
those problems go away by artificially limiting your choice of operators is the wrong solution.  Type coercion
problems are, by definition, problems involving mismatched types.  Solutions include:

- Don't compare variables of different types; or
- Manually convert your variables to matching types; or
- Allow JavaScript to perform coercion only in well-defined situations

### Enumerating Array or Object Properties

When using *for*...*in* loops like this:

	var a = [100, 200, 300];
	for (var i in a) { ... }
	
the type of variable *i* will be **string** rather than **number**; that is, it will contain "0", "1" and "2" rather
than 0, 1 and 2.  If you then use *i* to set a matching element in another array, that element will not be stored in
the same (numeric) position as the original array.

One solution is to convert *i* to a **number**:

	parseInt(i, 10);

However, a more elegant solution is to use the unary "+" operator to coerce the **string** to a **number**:

	+i;

### Shift Counts For Bitwise Shifts

It turns out that shifting an integer value by more than 31 bits in either direction may not shift as many bits as
you'd expect.  For example:

	n = 0x10000000;
	n >>>= 32;

will not change n at all.  This is because, just like the shift instructions on Intel processors, JavaScript converts
the shift count to a *mod 32* value (in other words, it truncates the shift count to a 5-bit value).

So the above example is equivalent to:

	n >>>= 0;

If you really need larger shift counts to work in a consistent manner, you can perform multiple shifts, where each
shift count is in the range 0-31.  For example, here's how you could shift a number by 32 bits:

	n = (n >>> 31) >>> 1;

Also, it's not quite correct to say that a shift count of zero has *no* effect on a number:

	n = 0x88888888|0;       // n is displayed as -2004318072
	n >>>= 0;               // n is displayed as 2290649224

It's true that the bottom 32 bits of the number were not changed, but a side-effect of the unsigned shift operator
is that all the upper sign bits are stripped from the (64-bit) result.

I consider this an anomaly of JavaScript's bitwise operators, because it breaks the "rule" that bitwise operators
operate *only* on the low 32 bits of a number.  And as soon as you perform any other bitwise operation on the number,
even one that does not modify the low 32 bits, the upper bits will revert to the sign of the lower 32-bit value:

	n |= 0;                 // n is displayed as -2004318072 again

*[@jeffpar](http://twitter.com/jeffpar)*  
*March 26, 2015*
