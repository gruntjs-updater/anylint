anylint
=======

Check files and sets of files over custom rules - this time both for metadata and content.

###Intro
There is a bunch of code with custom JS class system.
Each file has some entity defined by custom (global) function.

###Problem
It's unknown if somebody redefined old class. Neither there is a check if filename corresponds to definition.

###Solution
Iterate through all the code files, parsing them via set of custom filters.
Each filter accepts AST tree for validation and file's metadata.

###Alternatives
There is amazing 'eslint' that works with custom rules and AST, but it doesn't support file's metadata by definition.

###Roadmap
1. Implementation for first level of definitions
2. ...
3. Pull request for 'eslint' or publishing as alternative to it

