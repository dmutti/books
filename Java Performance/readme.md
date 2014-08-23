# Introduction

* Client Class and Server Class
    * The process of automatically tuning flags based on the environment is called ergonomics
    * Java ergonomics is based on the notion that some machines are “client” class and some are “server” class
    * **Client-class machines**
        * any 32-bit JVM running on Microsoft Windows (regardless of the number of CPUs on the machine)
        * any 32-bit JVM running on a machine with one CPU (regardless of the operating system)
    * All other machines (including all 64-bit JVMs) are considered server class
