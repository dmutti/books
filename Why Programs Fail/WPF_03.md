Tracking Origins
================

-   omniscient debugging
    -   a technique that records an entire execution history
    -   so that the user can explore arbitrary moments in time without ever restarting the program
-   dynamic slicing
    -   a technique that tracks the origins of specific values

REASONING BACKWARD
------------------

-   A common issue with observation tools is that they execute the program forward in time
-   the programmer must
    -   reason backward in time
-   when using interactive debugging tools, the programmer must carefully approach the moment in time where the infection is observable
-   As soon as the infection is found, he or she must restart the program and stop at some earlier moment in time to explore the previous state
    -   pretty time consuming
    -   if we go just one step too far, the program must be restarted
-   key issues
    -   how to ease the task of discovering the origin of a value
    -   and how to keep a memory of what was going on during the run

EXPLORING EXECUTION HISTORY
---------------------------

-   One first idea would be to have a means of undoing the last execution steps
-   better idea
    -   to explore the entire execution history backward
-   record the execution - every single change to every single aspect of the state
    -   **omniscient debugging**
-   Rather than accessing the program while it is running, an omniscient debugger first executes the program and records it
-   ODB debugger for JAVA
    -   main drawback - recording all state changes is expensive
    -   overhead by a factor of 10 or more
    -   generates data at the rate of 100 MB per second
        -   record specific events only (the last second before the failure)
        -   record specific parts of the system only (ignore the runtime library)
        -   use a compressed storage of the individual events
-   **omniscient debugging will become a standard feature of future interactive debuggers**

DYNAMIC SLICING
---------------

-   When debugging
    -   we have a concrete failing run at hand
    -   and we would like to know the dependences for this concrete run in order to trace back origins
-   solution
    -   dynamic slicing!
-   a dynamic slice encompasses a part of the program
    -   the part of the program that could have influenced (or could be influenced by) a specific variableat some point
    -   **it does not hold for all possible runs but for one single concrete run**
-   The dynamic slice for the run is more precise than the static slice for the entire program
-   To compute a dynamic slice, one requires a trace
-   A trace is a list of statements in the order they were executed during the concrete run
    -   created by instrumenting the program
    -   or by running the program in an interpreter
    -   In this trace, one records the variables that were read and written
        -   the effects are recorded for each statement as it is executed
        -   one introduces a predicate pseudovariable for each predicate that controls execution
        -   these pseudovariables is "written" by the statement that controls execution and "read" by the statements that are controlled
-   On average, dynamic slices are far more precise than static slices
-   In a concrete run
    -   **all** locations of **all** variables are known, eliminating conservative approximation
    -   paths that were not taken need not be taken into account
-   a dynamic slice only encompasses 5 percent of the executed statements
-   price
    -   Overhead
        -   a trace of the program is difficult to obtain efficiently
        -   we still need to record which statements were taken in which order
    -   Lack of generality
        -   Dynamic slices cannot be reused for other runs

TRACKING DOWN INFECTIONS
------------------------

1.  Start with the infected value as reported by the failure
2.  Follow back the dependences to potential origins, using
    -   static dependences
    -   dynamic dependences

3.  Observe the origins and judge whether the individual origins are infected or not
4.  If you find an earlier infected value, repeat steps 2 and 3 to track its origins
5.  When you find an infected value V where all values that V depends on are sane, you have found the infection site
6.  Fix the defect, and verify that the failure no longer occurs

-   We must still ease the task

TOOLS
-----

-   Dynamic Slicers
    -   [JSLICE](http://jslice.sourceforge.net/)
-   [ODB](http://www.lambdacs.com/debugger/debugger.html)
-   [WHYLINE for JAVA](http://faculty.washington.edu/ajko/whyline-java.shtml)

FURTHER READING
---------------

-   critical slicing
    -   based on the idea of removing individual statements from the program and to leave only those statements relevant to the error
    -   this reduces the average program by 64 percent
    -   SPYDER debugger

Asserting Expectations
======================

AUTOMATING OBSERVATION
----------------------

-   Observing what is going on in a program can be a burden for a programmer
    -   many states and events that can and must be observed
    -   for each new run (or each new defect) the same items must be observed again
    -   the act of judging whether the observed state is sane or not
-   have the computer check whether the program state is still sane, or whether an infection has occurred
-   advantages of automated observation
    -   scalability
        -   having the computer observe and judge allows us to check large parts of the execution automatically
        -   Each automated observation acts like an infection detector, catching infections before they can propagate and obscure their origins
    -   persistence
        -   Once we have specified the properties of a sane state, we can reuse this specification over and over again
        -   it includes debugging, documentation and general program understanding
-   probably the best long-term investment in code quality

BASIC ASSERTIONS
----------------

-   The basic idea is to insert appropriate code that checks for infections
-   it is wise to explicitly separate code concerned with debugging from the normal program code
    -   have a special function that explicitly checks for a specific condition
    -   **assert**!
-   Just as with logging functions we want to be able to turn assertions off
-   in the JAVA interpreter java assertions are turned off by default
-   Assertions
    -   should not interfere with the actual run (and thus have no side effects)
    -   and should be used systematically rather than sprinkled randomly across the code
-   two major (systematic) uses of assertions in debugging
    -   Data invariants that ensure data integrity
    -   Pre and postconditions that ensure function correctness

ASSERTING INVARIANTS
--------------------

-   The most important use of assertions
-   properties that must hold throughout the entire execution
-   Ideally, we would set up statements at the beginning and end of each public method
    -   To reduce clutter,we can use an aspect
-   Once one has a function that checks data invariants, one can also invoke it in an interactive debugger to check data sanity on-the-fly

ASSERTING CORRECTNESS
---------------------

-   ensure that some function does the right thing
-   postconditions
    -   conditions over the state that must hold at the end of the function
-   a precondition expresses conditions over the state that must hold at the beginning of a function
-   Helper functions used in postconditions usually make useful public methods
-   The EIFFEL language incorporates the concept of design by contract
    -   a contract is a set of preconditions that must be met by the caller (the client)
    -   and a set of postconditions that are guaranteed by the callee (the supplier)

ASSERTIONS AS SPECIFICATIONS
----------------------------

-   the assertions become part of the interface
-   A user of a function must satisfy its precondition
-   A supplier of a function must satisfy the postcondition under the assumption the precondition holds
-   validating that the program code satisfies the specification is difficult
    -   It requires us to prove that the concrete code requires no more than the abstract specification
    -   and that it provides no less than the specification
-   when specification and code are separated
    -   it leads to huge efforts when it comes to mapping one onto the other
-   EIFFEL-style specifications integrate the specification within the code
    -   they allow us to validate correctness simply by running the program
    -   For every program run where the assertions hold, the assertions guarantee the correctness of the result

FROM ASSERTIONS TO VERIFICATION
-------------------------------

-   JML, the Java Modeling Language
    -   JML assertions are written as special comments in the JAVA code
    -   recognized by JML tools alone and ignored by ordinary JAVA compilers
-   JMLC translates conditions into runtime assertions and thus ensures that no violation passes by unnoticed
-   the extended use of assertions also improves the software process
-   as assertions establish a contract between clients and suppliers of software
-   As the contract is unambiguous and complete, it allows for blame assignment
-   be sure to have all of your assertions (and specifications) carefully reviewed

REFERENCE RUNS
--------------

-   In some cases, the correct behavior of a program PA is not specified explicitly but by reference to another program PB, the behavior of which is defined as "correct"
    -   PA is supposed to behave like PB in some central aspect, or even in every aspect
    -   most common reason is that PA is a new revision or variant of the original PB
-   Reference programs are mainly used as oracles
    -   as universal devices that tell us what is correct, right, or true
-   a common scenario for regression testing
    -   feed PB and PA with the same input
    -   Any unexpected difference in output is a potential error
-   automate the comparison
    -   **relative debugging**
    -   debugging a program relative to a reference version
    -   execute PB and PA in parallel and flagging any difference between the program states
-   GUARD debugging for Java
    -   the programmer sets up a relative assertion
    -   an assertion that two variables have the same value at a specific location
    -   lets the user define individual comparison functions that can compare using a common abstraction, such as sets
-   Best results are achieved when porting an otherwise identical program from one environment to another

SYSTEM ASSERTIONS
-----------------

-   Some properties of a program must hold during the entire execution
-   The most important of these properties is
    -   the integrity of the program data
-   validate the state of the heap In C and C++ programs
-   Validating the Heap with MALLOC\_CHECK\_
-   Avoiding Buffer Overflows with ELECTRICFENCE
-   Detecting Memory Errors with VALGRIND
-   Language Extensions
    -   CYCLONE, a safer dialect of the C programming language (special pointers)

CHECKING PRODUCTION CODE
------------------------

-   When it comes to releasing the program, should we still have all checks enabled?
-   some checks that should never be turned off
-   **Critical results**
    -   If your program computes a result that people's lives, health, or money depends on
    -   validate the result using some additional computation
    -   an assertion is not the best way of checking critical results
        -   can be turned off
-   **External conditions**
    -   Any conditions that are not within our control must be checked for integrity
    -   an assertion is not the right way to check external conditions
-   This idea of making code "fail fast" is an argument for leaving assertions turned on
-   make sure the program gracefully fails
-   proving correctness may turn out to be a strategy for optimization
    -   If it can be proven that an assertion always holds, it can easily be eliminated

Detecting Anomalies
===================

CAPTURING NORMAL BEHAVIOR
-------------------------

-   why not simply use assertions all the way through?
    -   Assertions take time to write, especially in otherwise unspecified or undocumented code
    -   Assertions over temporal properties or control flow are difficult to specify
    -   assertions cannot cover all properties of the entire state at all times
        -   this would imply a specification as complex as the original program
-   rather than having assertions compare against the correct behavior we could also have assertions compare against normal behavior
    -   **detect behavior that is abnormal**
-   knowing about abnormal behavior is not as useful as knowing about incorrect behavior
    -   Incorrect behavior implies a defect,whereas abnormal behavior implies just abnormal behavior
-   abnormal behavior is often a good indicator of defects
-   how to capture normal behavior of a program?
    -   induction techniques
    -   inferring an abstraction from multiple concrete events
    -   where the concrete events are program runs

COMPARING COVERAGE
------------------

-   One of the simplest methods
    1.  Every failure is caused by an infection, which again is caused by a defect
    2.  The defect must be executed in order to start the infection
    3.  code that is executed only in failing runs is more likely to contain the defect than code that is always executed
-   we need a means of checking whether code has been executed or not
    -   easily done using coverage tools
-   A test suite should execute each statement at least once, because otherwise a defect may not be executed
-   Assuming that a statement is more normal the more often it is executed in passing runs
-   an anomaly does not necessarily indicate a defect, but that a defect is frequently an anomaly
-   extensions to coverage comparison
    -   Nearest neighbor
        -   Rather than comparing against a combination of all passing runs compare only against one passing run (nearest neighbor)
        -   This nearest neighbor is the passing run the coverage of which is most similar to the failing run
        -   predicts defect locations better than any other method based on coverage
    -   Sequences
        -   Some failures occur only through a sequence of method calls tied to a specific object
        -   ex: in Java, a stream that is not explicitly closed after use could cause the system to run out of file handles leading to a failure

STATISTICAL DEBUGGING
---------------------

-   One interesting aspect is exceptional behavior of functions
    -   indicated by exceptions being raised or unusual values being returned
-   If such events frequently occur together with failures
    -   we might have important anomalies that point us to the defect
-   code was instrumented
    -   generated random runs
    -   These runs were classified into failing (crashing) and passing runs
    -   search for functions executed only in failing runs, but never in passing runs

COLLECTING DATA IN THE FIELD
----------------------------

-   Detecting anomalies from actual executions may require a large set of runs, which is why these are typically generated randomly
-   far better approach is to use data collected in the field
    -   The number of executions at users' sites is typically far higher than the number of executions during testing
    -   Real-life executions produce a greater variety
    -   collecting and gathering data can easily be automated, as well as the analysis
    -   Gathering information from users' runs gives a firsthand indication about how the software is being used
-   Two issues have to be considered
    -   Privacy
    -   Performance
    -   sampling returns requires a large number of runs
    -   the higher the number of runs, the more significant the correlation of features and failures will be

DYNAMIC INVARIANTS
------------------

-   generate likely specifications that hold for all runs
    -   to see whether these can be turned into general assertions
    -   assertions that can be used to detect anomalies
-   How does one generate specifications from actual runs?
    -   DAIKON tool
    -   discover invariants that hold for all observed runs
    -   in the form of pre and postconditions
-   How does DAIKON detect these invariants?
    1.  The program to be observed is instrumented at runtime such that all values of all variables at all entries and exits of all functions are logged to a trace file
    2.  When executing the program under a test suite,the instrumented code generates a trace file
    3.  DAIKON processes this trace file
        -   DAIKON maintains a library of invariant patterns over variables and constants
        -   Each of these patterns can be instantiated with different variables and constants
        -   For each variable (or tuple of variables), DAIKON maintains a set of potential invariants, initially consisting of all invariants
        -   At each execution, DAIKON checks each invariant in the set to determine whether it still holds
        -   Derived variables also include the return values of functions, to be used in postconditions

    4.  DAIKON makes some optimizations to make the remaining invariants as relevant as possible
        -   if some invariant A implies an invariant B, then B need not be reported

    5.  the invariants that remain are those that held for all execution points
    6.  DAIKON ranks the invariants by the number of times they actually occurred
-   drawback
    -   the invariants it detects are those built into its library
    -   DAIKON cannot generate new abstractions on its own
    -   the more properties there are to be checked the longer DAIKON has to run
-   Whenever a specification is required but a test suite is available, the invariants inferred by DAIKON come in handy as a first take

INVARIANTS ON-THE-FLY
---------------------

-   A question not yet answered is
    -   dynamic invariants can be directly used for anomaly detection
    -   without first selecting those that are useful as general specifications?
-   idea explored in the DIDUCE prototype
    -   built for efficiency
    -   primarily geared toward anomaly detection
    -   it works for a very specific set of invariants only
    -   it works on-the-fly
        -   invariants are computed while the program is executed
-   DIDUCE stores three items For each instrumented place in the program
    -   Coverage
        -   the number of times the place was executed
    -   Values
        -   the found value of the variable read or written
        -   it is stored as a pair (V,M), where
        -   V is the initial value first written to the variable
        -   M is a mask representing the range of values
    -   Difference
        -   the difference between the previous value and the new value
        -   stored as a pair (V,M)
-   Whenever DIDUCE observes further variation of M, it reports a violation
    -   each value or difference out of the range observed previously becomes an anomaly
-   As DIDUCE accumulates invariants during a run
    -   it can be switched from "learning" to "detection" mode without interrupting the application
-   users can
    -   start using DIDUCE at the start of the debugging process
    -   and switch between inferring and checking during a run

FROM ANOMALIES TO DEFECTS
-------------------------

-   An anomaly is not
    -   a defect
    -   a failure cause
-   but it can be a good starting point for reasoning
-   Does the anomaly indicate an infection?
    -   If so, we can trace the dependences back to the origins
-   Could the anomaly cause a failure?
    -   If so, we must understand the effects of the anomaly
    -   by following the forward dependences through the program
-   Could the anomaly be a side effect of a defect?
    -   If so, we must trace back the anomaly to the common origin of failure and anomaly
-   whenever we have the choice of multiple events we should first focus on the abnormal ones

TOOLS
-----

-   [DAIKON](http://groups.csail.mit.edu/pag/daikon/)
-   [DIDUCE](http://diduce.sourceforge.net/)

Causes and Effects
==================

-   Deduction, observation, and induction are all good in finding potential defects
-   none of these techniques alone is sufficient to determine a failure cause
-   How does one identify a cause?
-   How does one isolate not only a cause but the actual cause of a failure?

CAUSES AND ALTERNATE WORLDS
---------------------------

-   we do not know yet whether Anomalies and defects actually cause the failure in question
-   we must understand how to search for cause-effect relationships
-   a cause becomes a difference between the two worlds
    -   A world where the effect occurs
    -   An alternate world where the effect does not occur
-   Given the right means the program execution
    -   is under (almost) total control
    -   and is (almost) totally deterministic
-   HOW DO I KNOW SOMETHING CAUSES THE FAILURE IN QUESTION?

VERIFYING CAUSES
----------------

-   The alternate world is what we need to show that some property causes the failure
-   To show causality
    -   we must set up an experiment with an alternate world in which the property does not occur
-   any systematic procedure will first determine causality by an experiment

CAUSALITY IN PRACTICE
---------------------

-   "obvious" is not enough
    -   "Obviously", the program should work, but it does not
    -   we can trust nothing, and especially not the obvious
-   the use of scientific method prevents fallacies from the start
    -   as every hypothesis (about a failure cause) must be verified by an experiment (with an alternate world in which the cause does not occur)
-   In the context of debugging we can repeat runs over and over
    -   experiments are the only way to show causality
    -   Deduction and speculation do not suffice

FINDING ACTUAL CAUSES
---------------------

-   How do we find a failure cause?
    -   The problem is to find the cause among a number of alternatives
-   the only way to determine whether something is a cause is through an experiment
-   Just as there are infinitely many ways of writing a program, there are infinitely many ways of changing a program such that a failure no longer occurs
    -   Because each of these changes implies a failure cause, there are infinitely many failure causes
    -   in debugging, we would like to point out a single failure cause, not a multitude of trivial alternatives
-   **closest possible world**
    -   the alternate world should be as close as possible
-   an actual cause is
    -   a difference between the actual world where the effect occurs, and the closest possible world where it would not
-   Ockham's Razor
    -   whenever you have competing theories for how some effect comes to be, pick the simplest

NARROWING DOWN CAUSES
---------------------

-   Given some failure (the effect), how do we find an actual cause?
    -   Find an alternate world in which the effect does not occur
    -   Narrow down the initial difference to an actual cause, using scientific method
-   The trick is that the alternate world need not be a world in which the program has been corrected
    -   It suffices that the failure does not occur
    -   The challenge is to identify this initial difference, which can then be narrowed down to an actual cause

THE COMMON CONTEXT
------------------

-   It suffices to have some alternate world in which the failure does not occur
    -   as long as we can narrow down the initial difference to an actual cause
-   This initial difference sets the frame in which to search for the actual cause
-   Aspects that do not differ will be part of the common context
    -   never changed nor isolated as causes
    -   This context is much larger than may be expected
        -   for instance, the fact that the program is executed
-   Whatever alternate world is chosen
    -   one should strive to keep it as similar as possible to the actual world

CAUSES IN DEBUGGING
-------------------

-   The concepts actual cause and closest possible world are applicable to all causes
    -   including the causes required for debugging
    -   Input
    -   State
    -   Code
-   All of these failure causes must be verified by two experiments
    -   one in which effect and failure occur
    -   and one in which they do not

