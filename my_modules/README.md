Private Node Modules
===

**my_modules** contains all the *private* **JSMachines** Node modules.  It is the counterpart to
**node_modules**, where all the *public* Node modules are installed.  Only private Node modules are checked
into GitHub; if we later decide to publish any or all of these on [npmjs.org](http://npmjs.org), then they will
be moved to **node_modules** and removed from this folder.
 
The rest of this file documents some of the early steps involved in porting the **JSMachines** project,
which required a web server running PHP, to the new **PCjs** web server running Node.  That includes setting up
my first Node web server and then extending its functionality with these private Node modules.

For more details on the private Node modules stored here, refer to the README.md for each module (which, alas,
may be nothing more than placeholders at this point, but I have good intentions).

Creating My First Node Project
===

Plan A: Fork jsmachines.net -> pcjs.org
---
The original **JSMachines** project assumed a web server running PHP
(eg, [http://jsmachines.net](http://jsmachines.net)).  However, to improve client-server integration, reduce
the number of languages/frameworks used, and implement some new features, such as socket-based disk I/O interfaces,
I decided to create a fork, **PCjs**, and port all the server-side PHP to JavaScript, running on a Node web server.

Unfortunately, when I tried to fork my private **JSMachines** project on GitHub, I discovered that you're
not allowed to [fork](https://help.github.com/articles/fork-a-repo) your own projects. Adding to the confusion: GitHub
displays the "Fork" button on my project's home page, and even lets me click it, but then quietly does nothing.

The recommended work-around (as per [this post](http://bitdrift.com/post/4534738938/fork-your-own-project-on-github))
seemed to be:

- Create new project on GitHub
- Clone old project with new name
- Replace new project's "origin URL" with URL for new GitHub project
- Add original project as an "upstream source"
- Push new project to GitHub

Plan B: Branch jsmachines -> node_dev
---
The above seemed a bit clunky, so I decided to branch instead of fork. This new development branch was called
**node_pcjs**, but I've since branched to **node_dev**.  I should probably remove the original **node_pcjs** branch,
but for now, it's still there.

Then I pushed the **node_dev** branch to the remote, as per [GitHub](https://help.github.com/articles/pushing-to-a-remote):

	[~/Sites/jsmachines] git push origin node_dev
	Total 0 (delta 0), reused 0 (delta 0)
	To git@github.com:jeffpar/jsmachines.git
	 * [new branch]      node_dev -> node_dev
	[~/Sites/jsmachines]

That seemed to work fine, so I then created a new folder and cloned the project, as per
[GitHub](https://help.github.com/articles/fetching-a-remote):

	[~/Sites] git clone git@github.com:jeffpar/jsmachines.git pcjs
	Cloning into 'pcjs'...
	remote: Reusing existing pack: 2725, done.
	remote: Total 2725 (delta 0), reused 0 (delta 0)
	Receiving objects: 100% (2725/2725), 59.48 MiB | 2.67 MiB/s, done.
	Resolving deltas: 100% (1543/1543), done.
	Checking connectivity... done

Then I checked-out the new branch:

	[~/Sites] cd pcjs
	[~/Sites/pcjs] git checkout node_dev
	Branch node_dev set up to track remote branch node_dev from origin.
	Switched to a new branch 'node_dev'
	
If I have to make any changes to the "master" branch (ie, the original jsmachines project) in the interim,
then after I've pushed those changes to GitHub, I can pull them into the **node_dev** branch like so:

	[~/Sites/pcjs] git pull origin master

Installing Node (and NPM)
---
I downloaded the latest Node installation package for my MacBook from [nodejs.org](http://nodejs.org/),
which provided the usual `node` and `npm` commands.  Here are the versions they reported:

	[~/Sites/pcjs] node -v
	v0.10.26
	[~/Sites/pcjs] npm -v
	1.4.3
	
I also installed a Node helper on my MacBook called `n` that makes it easy to keep Node up-to-date, per this tip on
[stackoverflow](http://stackoverflow.com/questions/8191459/how-to-update-node-js-npm-and-all-other-dependencies):

1) Clear NPM's cache:

	[~/Sites/pcjs] sudo npm cache clean -f

2) Install a little helper called 'n':

	[~/Sites/pcjs] sudo npm install -g n

3) Install latest stable NodeJS version:

	[~/Sites/pcjs] sudo n stable

Alternatively pick a specific version and install like so:

	[~/Sites/pcjs] sudo n 0.8.20

I'm not sure I like the generic name for this command ("n"); what would have been wrong with "node-update"
or "update-node"?  Oh well.

Next, I wanted to make sure `npm` was up-to-date. According to
[FAQ on npmjs.org](https://npmjs.org/doc/faq.html#How-do-I-update-npm), that's as easy as:

	[~/Sites/pcjs] sudo npm update npm -g

although occasionally `npm` won't be able to update itself, in which case the fallback is:

	[~/Sites/pcjs] curl https://npmjs.org/install.sh | sh

So, I made sure `npm` itself, along with `n` and all my other globally installed packages, were up-to-date,
and then I used `n` to make sure I was running the latest stable version of Node:

	[~/Sites/pcjs] sudo npm update -g
	[~/Sites/pcjs] sudo n stable
	[~/Sites/pcjs] node -v
	v0.10.26
    
I've also seen suggestions to run this command before the preceding commands, but I don't know how often this is
recommended:

	[~/Sites/pcjs] sudo npm cache clean -f

Next, I ran `npm init`:

	[~/Sites/pcjs] npm adduser
	Username: jeffpar
	Password: 
	Email: (this IS public) jeff@pcjs.org
	npm http PUT http://registry.npmjs.org/-/user/org.couchdb.user:jeffpar
	npm http 201 http://registry.npmjs.org/-/user/org.couchdb.user:jeffpar

	[~/Sites/pcjs] npm init
	This utility will walk you through creating a package.json file.
	It only covers the most common items, and tries to guess sane defaults.

	See `npm help json` for definitive documentation on these fields
	and exactly what they do.

	Use `npm install <pkg> --save` afterwards to install a package and
	save it as a dependency in the package.json file.

	Press ^C at any time to quit.
	name: (pcjs)
	version: (0.0.0) 0.1.0
	description: Node-enabled version of PCjs
	entry point: (server.js)
	test command:
	git repository: (git://github.com/jeffpar/jsmachines.git)
	keywords: pcjs,ibm pc,emulator
	author: Jeff Parsons <Jeff@pcjs.org>
	license: (ISC)
	About to write to /Users/Jeff/Sites/pcjs/package.json:

	{
	  "name": "pcjs",
	  "version": "0.1.0",
	  "description": "Node-enabled version of PCjs",
	  "main": "server.js",
	  "directories": {
		"doc": "docs",
		"test": "tests"
	  },
	  "scripts": {
		"test": "echo \"Error: no test specified\" && exit 1"
	  },
	  "repository": {
		"type": "git",
		"url": "git://github.com/jeffpar/jsmachines.git"
	  },
	  "keywords": [
		"pcjs",
		"ibm",
		"pc",
		"emulator"
	  ],
	  "author": "Jeff Parsons <Jeff@pcjs.org>",
	  "license": "ISC",
	  "bugs": {
		"url": "https://github.com/jeffpar/jsmachines/issues"
	  },
	  "homepage": "https://github.com/jeffpar/jsmachines"
	}

	Is this ok? (yes)

Next, I installed `express` using `npm install --save express`:

	[~/Sites/pcjs] npm install --save express
	npm http GET http://registry.npmjs.org/express
	...
	express@3.4.8 node_modules/express
	├── methods@0.1.0
	├── merge-descriptors@0.0.1
	├── range-parser@0.0.4
	├── cookie-signature@1.0.1
	├── fresh@0.2.0
	├── debug@0.7.4
	├── buffer-crc32@0.2.1
	├── cookie@0.1.0
	├── mkdirp@0.3.5
	├── commander@1.3.2 (keypress@0.1.0)
	├── send@0.1.4 (mime@1.2.11)
	└── connect@2.12.0 (uid2@0.0.3, pause@0.0.1, qs@0.6.6, bytes@0.2.1, raw-body@1.1.2, batch@0.5.0, negotiator@0.3.0, multiparty@2.2.0)

This added the following lines to my "package.json" file:

	  "dependencies": {
		"express": "~3.4.8"
	  }

Then I created a test "server.js" in the root of the project:

	var http = require("http");
	var express = require("express");
	var app = express();
	app.get("/", function(req, res) {
		res.end("Testing");
	});
	http.createServer(app).listen(3000);

and ran `node server.js` and verified that all was working as expected.

Creating My First Node Module
---
The first module I decided to write was a port of the diskconv.php script I'd written to convert disk images to/from
JSON.  I decided to call this new module **DiskDump**, since it will output disk images in a variety of formats, although
initially only as JSON.

	[~/Sites/pcjs/my_modules] mkdir diskdump
	[~/Sites/pcjs/my_modules] cd diskdump
	[~/Sites/pcjs/my_modules/diskdump] npm init
	This utility will walk you through creating a package.json file.
	It only covers the most common items, and tries to guess sane defaults.
	
	See `npm help json` for definitive documentation on these fields
	and exactly what they do.
	
	Use `npm install <pkg> --save` afterwards to install a package and
	save it as a dependency in the package.json file.
	
	Press ^C at any time to quit.
	name: (diskdump) 
	version: (0.0.0) 0.1.0
	description: Convert disk images to/from JSON
	entry point: (index.js) 
	test command: 
	git repository: 
	keywords: 
	author: Jeff Parsons <Jeff@pcjs.org>
	license: (ISC) 
	About to write to /Users/Jeff/Sites/pcjs/my_modules/diskdump/package.json:
	
	{
	  "name": "diskdump",
	  "version": "0.1.0",
	  "description": "Convert disk images to/from JSON",
	  "main": "index.js",
	  "scripts": {
		"test": "echo \"Error: no test specified\" && exit 1"
	  },
	  "author": "Jeff Parsons <Jeff@pcjs.org>",
	  "license": "ISC"
	}
	
	Is this ok? (yes) 

Next, I followed the steps outlined [here](http://www.anupshinde.com/posts/how-to-create-nodejs-npm-package/) to
create a package skeleton with a CLI (command-line interface).

Filtering Web Server Requests
---
The next module I created was [HTMLOut](/my_modules/htmlout/), which provides a filter() function for the Express module,
taking an early crack at the server's HTTP requests.

If the request is for a directory, **HTMLOut** builds an "index.html" from a common HTML template file, and then saves
the file in that directory, so that future requests can be served by the Express static() function.  The HTML template
file can specify a variety of replacement tokens, including a reference to a "README.md" file in the same directory,
which **HTMLOut** will load and pass to the private **MarkOut** Node module for conversion from Markdown to HTML.
  
Similarly, if the URL is an API request, **HTMLOut** will direct the request to the appropriate private Node module
(eg, **DiskDump** or **FileDump**).

What's The Right Way To Incorporate Node Module Fixes?
---
My current version of Express was 3.4.8, and looking at its dependencies in package.json, it wanted "fresh" v0.2.0.

Unfortunately, there seemed to be a problem with Safari and that version of "fresh", occasionally resulting in
blank pages, as discussed [here](http://stackoverflow.com/questions/18811286/nodejs-express-cache-and-304-status-code):

	Safari sends Cache-Control: max-age=0 on reload. Express (or more specifically, Express's dependency, node-fresh)
	considers the cache stale when Cache-Control: no-cache headers are received, but it doesn't do the same for
	Cache-Control: max-age=0.
	
Further investigation revealed that [node-fresh](https://github.com/visionmedia/node-fresh) v0.2.1 added a fix for
that problem. But what was the right (or best) way to incorporate that fix into my local Express installation?

I decided to hand-edit the "fresh" dependency in Express' package.json and then run "npm update" in the Express folder.
That pulled in the newer "fresh" module.  But I noticed that other modules that Express depends on include their OWN
version of "fresh", which were also locked at v0.2.0.  Even after creating an "npm-shrinkwrap.json" and hand-editing
it, "npm update" refused to upgrade them from v0.2.0.  I could edit the package.json files in each of the Express
"connect" and "send" folders, run "npm update" in those folders, and force v0.2.1 that way, but as soon as I ran another
"npm update" in the root, those folders reverted to v0.2.0 again. 

However, this all turned out to be moot.  The "Cache-Control: max-age=0" work-around added to "fresh" v0.2.1 was later
backed-out in v0.2.2.  And I discovered that the "blank page" problem went away at the same time I added trailing-slash
redirects (see below), so there was likely a connection.  The underlying issue with Safari is discussed in more detail
[here](https://github.com/visionmedia/node-fresh/issues/8); it seems likely the problem wasn't related to "fresh" after all.

Problems With Directory URLs and Slashes
---
I discovered that I needed to install "express-slash", enable Express "strict routing", and make HTMLOut.filter()
pass on directory requests that didn't include a trailing slash, so that the Node web server could call slash() and
trigger a trailing-slash redirect.  This is apparently what apache's "mod_dir" module does automatically, and why
I never had a problem with apache.  Without trailing slashes on directories, client-side requests for files relative to
those "slash-less" directories can fail.  More details on this issue can be found in [htmlout.js](htmlout/lib/htmlout.js).

	npm install express-slash --save

Moving from Make to Grunt
---
Step 1:

	sudo npm install grunt-cli -g
	
Step 2:

	npm install grunt --save-dev
	
which automatically adds the following to my package.json:

	"devDependencies": {
        "grunt": "^0.4.3"
    }

Step 3: Create a basic Gruntfile.js:

	module.exports = function(grunt) {
		grunt.initConfig({
		});
		grunt.registerTask("default", []);
	};
	
Step 4: Install some grunt modules; eg:

	npm install grunt-contrib-uglify --save-dev

Step 5: Add a task (eg, uglify):

	module.exports = function(grunt) {
		grunt.initConfig({
			uglify: {
				dist: {
					src: "dist/myfile.js",
					dest: "dist/myfile.min.js"
				}
			}
		});
		grunt.loadNpmTasks("grunt-contrib-uglify");
		grunt.registerTask("default", ["uglify"]);
	};

However, while all of the above is a very nice example, I'm not really interested in uglify.

I use Google's Closure Compiler, so I needed to do this instead:

	npm install grunt-closure-tools --save-dev
	
There was also an NPM module called "grunt-closure-compiler", but it hadn't been updated as recently, and from
the examples it provided, it wasn't clear that it included support for all the Closure Compiler options, like
"output_wrapper", so I went with "grunt-closure-tools", even though it also contains support for other tools that
I'm not currently using.

So now my package.json includes:

	"devDependencies": {
		"grunt": "^0.4.3",
		"grunt-closure-tools": "^0.9.4"
	}

Optional Node Modules
===

replace
---
I use the Node "replace" module to perform project-wide search-and-replace operations on files; eg:

	node node_modules/replace/bin/replace.js '(<machine.*class)="c1pjs"' '$1="c1p"' . -r --include=*.xml --preview
	node node_modules/replace/bin/replace.js '(<machine.*class)="pcjs"' '$1="pc"' . -r --include=*.xml --preview
	node node_modules/replace/bin/replace.js '(href="/versions/c1pjs)/[^/]*/(.*)' '$1/1.12.1/$2' . -r --include=*.xml --preview
	node node_modules/replace/bin/replace.js '(href="/versions/pcjs)/[^/]*/(.*)' '$1/1.12.1/$2' . -r --include=*.xml --preview
	
Most people probably install modules like this globally, but I'd rather just define a command-line alias
("replace" => "node node_modules/replace/bin/replace.js") instead of cluttering my system-level directories.

Testing with Azure
===
> NOTE: I've since abandoned Azure in favor of AWS Elastic Beanstalk, because Amazon's service has a simpler UI,
provides more control over the virtual machine environment (you can even log into the machine via SSH), and
the logging services for Node on AWS are more reliable.  I also wrote a short [blog post](/blog/2014/03/30/)
on some of my frustrations with Azure.

I subscribed to Azure (formerly Windows Azure, now [Microsoft Azure](http://azure.microsoft.com/)), and started
watching this YouTube video "[Lightning nodejs dev in Windows Azure](http://www.youtube.com/watch?v=WbtV1bX_m2I)"
by Glenn Block ([@gblock](http://twitter.com/gblock)).  I was glad to see that he used a Mac, because a number of
other Azure videos on Youtube were made using Windows.

The first recommendation was to install the "azure-cli" command-line tools:

	sudo npm install azure-cli -g

To display available commands:

	azure
	
To connect the command-line tools to my Azure account (after setting my default browser to Chrome, since I used
Chrome to set up my Azure account and browse the Azure portal):

	azure account download
	
To import my acount info:

	azure account import ~/Downloads/Pay-As-You-Go-3-30-2014-credentials.publishsettings

To create a site, the video recommends:

	azure site create pcjs --git
	
However, I'm holding off until I understand how to link a new Azure site deployment with an existing GitHub repository,
as discussed [here](http://www.windowsazure.com/en-us/documentation/articles/web-sites-publish-source-control/),
because the above command appears intended for new project folders, which are then associated with a remote Azure-hosted
Git repository -- not what I need or want.

The following command would show the remote Azure repository:

	git remote -v
	
In my case, that command shows:

	origin	git@github.com:jeffpar/jsmachines.git (fetch)
	origin	git@github.com:jeffpar/jsmachines.git (push)

The following command would then be used to push updates to Azure:

	git push azure master
	
Although in my case, I'm guessing it would be:

	git push origin master
	
Or, rather:

	git push origin node_dev
	
Since my local "pcjs" project is based on the **node_dev** branch.

If I was using an Azure-hosted Git repository, I could then run:

	azure site browse
	
because the `git push azure master` command would have triggered a website update.

The video goes on to show how I can specify the version Node I want Azure to use, by adding the
following to my "package.json":

	"engines": {
		"node": "0.8.x" 
	}

This command:

	azure site deployment list
	
will list all the deployments so far, any one of which can be redeployed like so:

	azure site deployment redeploy xxx
	
The video finally gets that what I *really* care about, which is deploying via GitHub.  This command
lists some of the commands we care about:

	azure site create --help
	
To create a site from a repository on GitHub:

	azure site create pcjs --github

JavaScript Coding Conventions
===

This is not intended to be an exhaustive list.  It just lists a few things that came to mind, and I'll
probably update it over time.

Tabs
---
I've configured my IDE (PhpStorm) to NEVER use tab characters in .js files (spaces only) and to
ALWAYS use tab characters in almost every other type of text file.  This is largely because when a web
browser displays a JavaScript file (either in the main window or in the Developer Tools window), tabs
usually screw up the formatting, which I find annoying when I'm debugging.  XML files, on the other hand,
are usually reformatted by the browser, so in those cases, I opt for smaller files and use real tabs.

Moreover, most of the JavaScript delivered by a production server will have been pre-compiled by Google's
Closure Compiler, which completely eliminates all non-essential whitespace, so this is really a development
preference, with little to no impact on production files.

Regardless of the choice of tab character however, I almost always use 4-column tab stops, except
in legacy .asm files, where 8-column tab stops were the norm.  I know that 2-column tab stops have
recently become "all the rage," especially in Node projects; NPM, for example, will rewrite package.json
files, replacing all the 4-column tabs with 2-column tabs, and I don't fight that trend -- I just ignore it.

JSDoc
---
I've taken a great deal of care to "[JSDoc](http://usejsdoc.org/)-ify" nearly all my JavaScript code, not
because I want to be able to generate documentation (although that's something to think about), but because
it's the only way to tell both Google's Closure Compiler and my IDE (PhpStorm) exactly what data
types are passed into/out of every function.  The goals are to minimize the number of "code inspection"
warnings in the IDE and produce warning-free compilations.

In order to use the Closure Compiler's ADVANCED_OPTIMIZATIONS option and get maximum performance
(and maximum "minification", sometimes called "uglification"), every function and its parameters needs to
be fully typed; otherwise, the Compiler will generate WAY too many warnings/errors -- at least, that was the
case when I first started using it a couple of years ago.

So, I've adopted a zero-tolerance policy for warnings: no check-ins allowed if the Closure Compiler generates
even a SINGLE warning.

I'm not sure the [JSDoc](http://usejsdoc.org/) folks and the
[Closure Compiler](https://developers.google.com/closure/compiler/docs/js-for-compiler) are totally in sync on
everything.  And then there's [PhpStorm](http://www.jetbrains.com/phpstorm/webhelp/creating-jsdoc-comments.html),
whose code inspections occasionally fail; sometimes a bogus code inspection warning can be fixed with some
additional JSDoc @name or @class annotations, but not always.
 
In any case, the subset of variable and function type declarations I use works pretty well across the board;
code inspection warnings are allowed in the IDE, as long as they are clearly erroneous (or clearly innocuous).

Braces, Parentheses, etc.
---
Most of my opening braces appear at the end of the line containing the associated "if", "while", "for", "switch",
"function" etc, preceded by a single space.  And most of my opening parentheses are also preceded by a single space,
except when following "function" or a function name, in which case there is NO space.  This is just an historical
preference, dating back to my BASIC and C programming days; it's not that those preferences matter anymore, it's just
that I see no reason to change them.

I'm not obsessed with these conventions.  Sometimes, for example, I'll write a bunch of code where the opening
brace of every function body begins underneath the "function" keyword, because the extra whitespace can make the
file a bit more readable.  It may sometimes depend on my mood, but I do try to be consistent within a given file
at least.

Variable Names
---
I still tend to follow Charles Simonyi's "[Hungarian](http://en.wikipedia.org/wiki/Hungarian_notation)" naming
conventions -- or rather, a naming convention loosely inspired by Hungarian.  I know lots of people sneer at
those conventions and think they're useless, and all I can say is, they're wrong: they are not useless to ME.
I admit they may be useless to anyone who has a phenomenal memory and can remember that an obscure variable named
"foo" was initialized with a string or a number, or who has an IDE that can answer that question with the press
of a key (or two), but for me, with my non-phenomenal memory and lazy fingers, I prefer being able to simply
look at a variable to immediately know what *type* of data it contains, if nothing else.

I rarely name a string or numeric variable something vague like "foo."  At worst, I would name it "sFoo" if it
was a string or "iFoo" if it was a number (or possibly "nFoo" or "cFoo" if it represented a total of Foos or a
counter of Foos).  And if a string or numeric variable has a very short-term use, I often just call it "s" or "i"
(or "n").

As I mention [below](./#quotation-marks), I still tend to distinguish single characters from strings too,
which means I may sometimes prefix character variables with "ch" and character counters with "cch".

Of course, these letter prefixes like "s" and "n" are irrelevant if you already give your variables meaningful
names like "nameOfPerson" or "numberOfPeople".  And that's fine -- I do that sometimes, too.  But in general,
I still prefer variable names like "sPerson" and "nPeople".

I don't try to come up with special prefixes for Objects.  If there's a Person object, for example, I'll probably
use colloquial names like "personHere" or "personThere".  I am stricter about Arrays though: I prefix array variables
with "a", arrays of strings and numbers with "as" and "ai" (or "an"), and arrays of arrays with "aa".  As for Arrays
of anything else, I usually don't bother with anything more than an "a" prefix.

Quotation Marks
---
Coming from a long C background, I prefer to use double-quotes around multi-character strings and single quotes
around single-character strings.  While the reasons for doing so are largely historical and currently irrelevant,
characters are STILL the building blocks of strings, and even the JavaScript String class contains methods that
deal with individual characters (eg, charCodeAt() and fromCharCode()).  So for any code that knowingly deals with
single characters, I like to reinforce that distinction with single quotes.

Also, to emphasize that an object property name isn't really a string, I tend to use single quotes around property
names as well.  I realize that the JSON standard insists on property names with double-quotes, but functions like
JSON.stringify() take care of that for us -- besides, I find that aspect of the JSON standard to be rather annoying
(not to mention JSON's disapproval of comments).

Obviously, it's possible to set and get object properties without any quotes at all, as in:

	obj.prop = true;
	
instead of:

	obj['prop'] = true;
	
but that works only if the property name conforms to the same syntax that variable names use.  Also, the "dot"
syntax can create problems for code compiled with Google's Closure Compiler (using ADVANCED_OPTIMIZATIONS),
because it likes to rename "dot" property names to smaller "minified" property names.  Which means if you
need to export your objects as JSON later, or if you ever need to access a property using an externally defined
string, you must avoid the "dot" syntax.

However, if an object and all its properties are purely internal, there's usually no reason not to use it:

	obj = {foo: "old", modified: false};
	obj.foo = "new";
	obj.modified = true;

I break my own quoting rules slightly when dealing with strings that *contain* double-quotes, since it's more readable
to put double-quotes inside single-quoted strings than to "escape" every double-quote with a backslash.

For code that was originally written in PHP and later ported to JavaScript, there was a tendency in the original
code to always use double-quotes around strings and "escape" double-quotes regardless, and that tendency may linger
in code I didn't feel like rewriting much, but the tendency was due more to idiosyncrasies of PHP than any convention
of mine; for example:

- single-quoted PHP strings may not include any escaped characters (except for single-quote and backslash)
- single-quoted PHP strings cannot resolve references to string variables (eg, "the value of foo is {$foo}")

Because of PHP's restrictions on single-quoted strings, I tended to avoid them.  However, in JavaScript, the
first restriction isn't true, and the second isn't even a feature of the language, so they have no bearing on the use
of single-quoted strings in JavaScript.

Arrays
---
In [this article](http://stackoverflow.com/questions/8668174/indexof-method-in-an-object-array), it's asserted,
without disagreement, that searching arrays of objects for a particular object is best performed with code that looks
like this:

	pos = myArray.map(function(e) { return e.hello; }).indexOf('stevie');
	
I disagree.  Depending on how often that function is called, creating a new array by iterating over every element
of the original array, and doing that every time you want to search for an array object with a property (eg, `hello`)
equal to some value (eg, 'stevie'), is a bad idea; I don't care how fast your JavaScript engine is or how fantastic
your garbage collector is.

My preferred approach is to create parallel arrays: one array for each property that you might want to search on, and
another array of objects that contain all the other object properties.  Then searching doesn't involve creating new
arrays:

	pos = myArrayOfHello.indexOf('stevie');
	
Yes, it's not quite as *clean* as one, unified array of objects, and yes, it would be nicer if the JavaScript Array
class had better search methods, but I think this is the right trade-off given the current reality.