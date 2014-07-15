# 2. The Big Picture

A language is a set of valid sentences, a sentence is made up of phrases, and a phrase is made up of subphrases and vocabulary symbols
* The lexer (a program that tokenizes the input) can group related tokens into token classes, or token types, such as  INT (integers),  ID (identifiers),  FLOAT (floating-point numbers), and so on.
* The lexer groups vocabulary symbols into types when the parser cares only about the type, not the individual symbols.
* Tokens consist of at least two pieces of information: the token type (identifying the lexical structure) and the text matched for that token by the lexer.
