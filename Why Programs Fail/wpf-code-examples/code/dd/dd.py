#!/usr/bin/env python
# $Id: dd.py,v 2.4 2005/04/28 20:37:11 zeller Exp $

import split
from listsets import listminus, listunion
import re

PASS       = "PASS"
FAIL       = "FAIL"
UNRESOLVED = "UNRESOLVED"

def dd(c_pass, c_fail, test, splitter = None):
    """Return a triple (DELTA, C_PASS', C_FAIL') such that
       - C_PASS subseteq C_PASS' subset C_FAIL' subseteq C_FAIL holds
       - DELTA = C_FAIL' - C_PASS' is a minimal difference
         between C_PASS' and C_FAIL' that is relevant with respect to TEST."""

    if splitter is None:
        splitter = split.split

    n = 2
    
    while 1:
        assert test(c_pass) == PASS
        assert test(c_fail) == FAIL
        assert n >= 2

        delta = listminus(c_fail, c_pass)

        if n > len(delta):
            # No further minimizing
            return (delta, c_pass, c_fail)

        deltas = splitter(delta, n)
        assert len(deltas) == n

        offset = 0
        j = 0
        while j < n:
            i = (j + offset) % n
            next_c_pass = listunion(c_pass, deltas[i])
            next_c_fail = listminus(c_fail, deltas[i])

            if test(next_c_fail) == FAIL and n == 2:
                c_fail = next_c_fail
                n = 2; offset = 0; break
            elif test(next_c_fail) == PASS:
                c_pass = next_c_fail
                n = 2; offset = 0; break
            elif test(next_c_pass) == FAIL:
                c_fail = next_c_pass
                n = 2; offset = 0; break
            elif test(next_c_fail) == FAIL:
                c_fail = next_c_fail
                n = max(n - 1, 2); offset = i; break
            elif test(next_c_pass) == PASS:
                c_pass = next_c_pass
                n = max(n - 1, 2); offset = i; break
            else:
                j = j + 1

        if j >= n:
            if n >= len(delta):
                return (delta, c_pass, c_fail)
            else:
                n = min(len(delta), n * 2)

if __name__ == "__main__":
    tests = {}
    c_fail = []

    def string_to_list(s):
        c = []
        for i in range(len(s)):
            c.append((i, s[i]))
        return c
    
    def mytest(c):
        global tests
        global c_fail

        s = ""
        for (index, char) in c:
            s += char

        if s in tests.keys():
            return tests[s]

        map = {}
        for (index, char) in c:
            map[index] = char

        x = ""
        for i in range(len(c_fail)):
            if map.has_key(i):
                x += map[i]
            else:
                x += "."

        print "%02i" % (len(tests.keys()) + 1), "Testing", `x`,
        
        if s != "" and re.match("<SELECT.*>", s):
            print FAIL
            tests[s] = FAIL
            return FAIL

        print PASS
        tests[s] = PASS
        return PASS

    c_pass = []
    c_fail = string_to_list('<SELECT NAME="priority" MULTIPLE SIZE=7>')
    # mytest(c_fail)
    
    print dd(c_pass, c_fail, mytest)
