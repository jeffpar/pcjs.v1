My (JavaScript) Coding Conventions
---

Some ramblings about my JavaScript coding conventions.  This is not an attempt to convince anyone of
anything, just an explanation of why things are they way they are (and which will be more useful once PCjs
moves from a private to a public GitHub repository in the near future).

### Tabs vs. Spaces

I've configured my IDE ([PhpStorm](http://www.jetbrains.com/phpstorm/)) to NEVER use tab characters in .js files
(spaces only) and to ALWAYS use tab characters in almost every other type of text file.  This is largely because
when a web browser displays a JavaScript file (either in the main window or in the Developer Tools window), tabs
usually screw up the formatting, which I find annoying when I'm debugging.  XML files, on the other hand,
are usually reformatted by the browser anyway, so in those cases, I opt for smaller files and use real tabs.

Note that most of the JavaScript delivered by a PCjs production server will have been compiled by Google's
Closure Compiler, which completely eliminates all non-essential whitespace, so this is really a development
preference, with little to no impact on production files.

Regardless of the choice of tab character however, I almost always use 4-column tab stops, except in legacy .asm
files, where 8-column tab stops were the norm.

I've noticed that 2-column tab stops have recently become popular, especially in Node projects;
NPM, for example, will rewrite package.json files, replacing my 4-column spacing with 2-column spacing.
I don't fight that trend -- I just ignore it.

### Braces and Parentheses

Most of my opening braces appear at the end of the line containing the associated "if", "while", "for", "switch",
"function" etc, preceded by a single space.  And most of my opening parentheses are also preceded by a single space,
except when following "function" or a function name, in which case there is NO space.  This is just an historical
preference, dating back to my BASIC and C programming days; it's not that those preferences matter anymore, it's just
that I see no reason to change them.

Sometimes I break these conventions though.  For example, for all the top-level (documented) functions in a
module, I'll often move the opening brace of the function body to its own line, because I feel that the extra
whitespace makes the code a bit more readable.  It may sometimes depend on my mood, but I do try to be consistent
within a given file at least.

### Variable Names

I still tend to follow Charles Simonyi's "[Hungarian](http://en.wikipedia.org/wiki/Hungarian_notation)" naming
conventions -- or rather, a naming convention loosely inspired by Hungarian.  I know lots of people sneer at
those conventions or simply think they're useless, and all I can say is, they're wrong: they are not useless to *me*.

I admit they may be useless to anyone who has a phenomenal memory and can remember that an obscure variable named
"foo" was initialized with a string or a number, or whose IDE can answer the question with the press of a key (or two),
but for me, with my non-phenomenal memory and lazy fingers, I prefer being able to simply look at a variable to
immediately know what *type* of data it contains, if nothing else.

I rarely name a string or numeric variable something vague like "foo."  At worst, I would name it "sFoo" if it
was a string or "iFoo" if it was a number (or possibly "nFoo" or "cFoo" if it represented a total of Foos or a
counter of Foos).  And if a string or numeric variable has a very short-term use, I'll probably just name it "s"
or "i" (or "n").

As I mention [below](./#quotation-marks), I still tend to distinguish single characters from strings too,
which means I may sometimes prefix character variables with "ch" and character counters with "cch".

Of course, these letter prefixes like "s" and "n" are irrelevant if you already give your variables meaningful
names like "nameOfPerson" or "numberOfPeople".  And that's fine -- I do that sometimes, too.  But in general,
I still prefer variable names like "sPerson" and "nPeople".

I don't try to come up with special prefixes for Objects.  If there's a Person object, for example, I'll probably
use colloquial names like "personHere" or "personThere".  I am stricter with Arrays though: I prefix array variables
with "a", arrays of strings and numbers with "as" and "ai" (or "an"), arrays of arrays with "aa", etc.  As for Arrays
of anything else, I usually don't bother with anything more than an "a" prefix.

### Quotation Marks

Coming from a long C background, I prefer to use double-quotes around multi-character strings and single quotes
around single-character strings.  While the reasons for doing so are largely historical and currently irrelevant,
characters are STILL the building blocks of strings, and even the JavaScript String class contains methods that
deal with individual characters (eg, charCodeAt() and fromCharCode()).  So for any code that deals explicitly with
individual characters, I like to reinforce that with single quotes.

Also, to emphasize that object property names aren't really strings (even though strings can be used as property
names), I tend to use single quotes when quoting property names.  That does make me somewhat inconsistent with
the JSON standard, which insists that property names be double-quoted, but JSON.stringify() takes care of that, so
it's not really a problem.  Besides, I have a lot of quibbles with the JSON standard, like its "disapproval" of
comments and hexadecimal constants, and its failure to faithfully serialize and deserialize uninitialized Array
objects, but I'll leave my gripes about JSON for another post.

Generally speaking, the only time I quote property names is when I have to.  I'll use the "dot" syntax; eg:

	obj.prop = true;
	
instead of:

	obj['prop'] = true;
	
unless the property name doesn't conform to variable name syntax (eg, if it starts with a digit) or if it's a
"public" property and therefore I can't risk Google's Closure Compiler "minifying" the property name to something
else.

I break my own quoting rules slightly when dealing with strings that *contain* double-quotes, since it's more readable
to put double-quotes inside single-quoted strings than to "escape" every double-quote with a backslash.

For code that I originally wrote in PHP and later ported to JavaScript, there was a tendency in the original
code to always use double-quotes around strings and "escape" double-quotes regardless, and that tendency may linger
in code I didn't feel like rewriting much, but the tendency was due more to idiosyncrasies of PHP than any convention
of mine; for example:

- single-quoted PHP strings may not include any escaped characters (except for single-quote and backslash)
- single-quoted PHP strings cannot resolve references to string variables (eg, "the value of foo is {$foo}")

Because of PHP's restrictions on single-quoted strings, I tended to avoid them.  However, in JavaScript, those
restrictions/features don't exist.

### JSDoc

I've taken a great deal of care to "[JSDoc](http://usejsdoc.org/)-ify" nearly all my JavaScript code, not
because I want to be able to generate documentation (although that's something to think about), but because
it's the only way to tell both Google's Closure Compiler and my IDE exactly what data types are passed around.
The goals are to minimize the number of "code inspection" warnings in the IDE and produce warning-free
compilations.

In order to use the Closure Compiler's ADVANCED_OPTIMIZATIONS option and get maximum performance
(and maximum "minification", a form of "uglification"), every function and its parameters needs to
be fully typed; otherwise, the Compiler generates way too many warnings/errors -- at least, that was the
case when I first started using it a couple of years ago.

So, I've adopted a zero-tolerance policy for warnings: nothing gets checked in if the Closure Compiler
generates even a single warning.

Unfortunately, I'm not sure the [JSDoc](http://usejsdoc.org/) folks and the
[Closure Compiler](https://developers.google.com/closure/compiler/docs/js-for-compiler) are totally in sync on
everything.  And then there's [PhpStorm](http://www.jetbrains.com/phpstorm/webhelp/creating-jsdoc-comments.html),
whose code inspections occasionally fail; sometimes a bogus code inspection warning can be fixed with some
additional JSDoc @name or @class annotations, but not always.
 
In any case, the subset of variable and function type declarations I use works pretty well across the board;
I ignore code inspection warnings in the IDE, as long as they are clearly erroneous (or clearly innocuous).

And finally, speaking of warnings, I've had to tell PhpStorm to "shut up" about a few:

- Unfiltered for…in loop
- Bitwise operator usage
- Comma expressions
- “throw” of exception caught locally

I acknowledge those those features can introduce bugs if you're not careful, so I make sure I'm careful.  I don't
subscribe to the dogmatic approach that others (eg, the author of JSLint) take about so-called "risky" features.
I agree that it's always a good idea to walk to the crosswalk before crossing a street, but I don't agree that it's
*never* a good idea to cross in the middle sometimes, too.

I've also made the following "weak warnings" instead of "warnings":

- Unused JavaScript / ActionScript local symbol

because it's a useful warning, but I don't like being penalized for functions that have been "prototyped" a specific
way but can't always be implemented exactly as prototyped.

*[@jeffpar](http://twitter.com/jeffpar)*  
*September 30, 2014*