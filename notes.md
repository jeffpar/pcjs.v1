Git "Cheat Sheet"
===

Committing files
---

To automatically stage files that have been modified and deleted, include -a; eg:

	git commit -a

Creating a new branch ("386dev")
---

You could use `git branch`, but if you've already modified some files that you now want to 
move to a new branch:

	git checkout -b 386dev
	
Pushing a new branch ("386dev")
---

Since a simple `git push` will report:

	fatal: The current branch 386dev has no upstream branch.
    To push the current branch and set the remote as upstream, use
    
        git push --set-upstream origin 386dev

do this instead:

	git push -u origin 386dev

Reverting (resetting) a single file [[link](http://www.norbauer.com/rails-consulting/notes/git-revert-reset-a-single-file.html)]
---

If you have an uncommitted change (it's only in your working copy) that you wish to revert (in SVN terms)
to the copy in your latest commit, do the following:

	git checkout filename

This will checkout the file from HEAD, overwriting your change. This command is also used to checkout branches,
and you could happen to have a file with the same name as a branch. All is not lost, you will simply need to type:

	git checkout -- filename

You can also do this with files from other branches, and such. `man git-checkout` has the details.

The rest of the Internet will tell you to use `git reset --hard`, but this resets all uncommitted changes you’ve
made in your working copy. Type this with care.

Node "Cheat Sheet"
===

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
	git repository: (git://github.com/jeffpar/pcjs.git)
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
		"url": "git://github.com/jeffpar/pcjs.git"
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
		"url": "https://github.com/jeffpar/pcjs/issues"
	  },
	  "homepage": "http://www.pcjs.org/"
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

Updating Node (and NPM)
---

So as per above, I ran:

	[~/Sites/pcjs] sudo n stable

which reported:

	  install : v0.12.1
	    mkdir : /usr/local/n/versions/0.12.1
	    fetch : http://nodejs.org/dist/v0.12.1/node-v0.12.1-darwin-x64.tar.gz
	installed : v0.12.1

Unfortunately, I ran into a [regression](https://github.com/joyent/node/issues/9310) on OS X with Node v0.12.x
that affects the command-line version of PCjs (specifically, the Node REPL), so I had to revert to v0.11.11.

Next, to update NPM:

	[~/Sites/pcjs] sudo npm update -g
