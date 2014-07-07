# Apache Flume - Distributed Log Collection For Hadoop
-------

# 1. Overview and Architecture

## The problem with HDFS and streaming data/logs

* HDFS isn't a real filesystem, and many of the things we take for granted with normal filesystems don't apply here
* In a regular Portable Operating System Interface (POSIX) style filesystem, if you open a file and write data, it still exists on disk before the file is closed.
  * if that writing process is interrupted, any portion that made it to disk is usable (it may be incomplete, but it exists)
  * In HDFS the file exists only as a directory entry, it shows as having zero length until the file is closed.
  * if data is written to a file for an extended period without closing it, a network disconnect with the client will leave you with nothing but an empty file for all your efforts
* This may lead you to the conclusion that it would be wise to write small files so you can close them as soon as possible
  * **Hadoop doesn't like lots of tiny files!**
  * If you have lots of tiny files, the cost of starting the worker processes can be disproportionally high compared to the data it is processing
  * This kind of block fragmentation also results in more mapper tasks increasing the overall job run times
* If the plan is to keep the data around for a short time, then you can lean towards the smaller file size.
* if you plan on keeping the data for very long time, you can either target larger files
  * or do some periodic cleanup to compact smaller files into fewer larger files to make them more MapReduce friendly

## Sources, channels, and sinks

![Flume Architecture](flume_architecture.png "Flume Architecture")

* Running inside an **agent** daemon
  * An input is called a source and an output is called a sink
  * A channel provides the glue between a source and a sink
* **keep in mind**
  * A source writes events to one or more channels
  * A channel is the holding area as events are passed from a source to a sink.
  * A sink receives events from one channel only.
  * An agent can have many sources, channels, and sinks.

## Flume events
* basic payload of data transported by Flume is called an event
* An event is composed of zero or more headers and a body
* The headers are key/value pairs that can be used to make routing decisions or carry other structured information

## Interceptors, channel selectors, and sink processors

* An interceptor is a point in your data flow where you can inspect and alter Flume events
  * You can chain zero or more interceptors after a source creates an event or before a sink sends the event wherever it is destined
* Channel selectors are responsible for how data moves from a source to one or more channels
  * A replicating channel selector (the default) simply puts a copy of the event into each channel assuming you have configured more than one
  * a multiplexing channel selector can write to different channels depending on certain header information.
* a sink processor is the mechanism by which you can create failover paths for your sinks or load balance events across multiple sinks from a channel

-------------

# 2. Flume Quick Start

## Flume configuration file overview

```
agent.sources=<list of sources>
agent.channels=<list of channels>
agent.sinks=<list of sinks>
```

* Each agent is configured starting with three parameters
* Each source, channel, and sink also has a unique name within the context of that agent
* Example
  * if I'm going to transport my Apache access logs, I might define a channel named `access`
  * The configurations for this channel would all start with the prefix `agent.channels.access`
* Each configuration item has a type property that tells Flume what kind of source, channel, or sink it is

## Starting up with "Hello World"

```
agent.sources=s1
agent.channels=c1
agent.sinks=k1
agent.sources.s1.type=netcat
agent.sources.s1.channels=c1
agent.sources.s1.bind=0.0.0.0
agent.sources.s1.port=12345
agent.channels.c1.type=memory
agent.sinks.k1.type=logger
agent.sinks.k1.channel=c1
```

* Here I've defined one agent (called `agent`) that has a source named `s1`, a channel named `c1`, and a sink named `k1`.
* The s1 source's type is `netcat`, which simply opens a socket listening for events **(one line of text per event)**
* The source configuration also has a parameter called channels (plural) that is the name of the channel/channels the source will append events to, in this case c1
* The channel named `c1` is a memory channel with default configuration.
* The sink named `k1` is of type `logger` (mostly used for debugging and testing)
  * It will log all events at INFO level using log4j, which it receives from the configured channel, in this case `c1`
  * the channel keyword is singular because a sink can only be fed data from one channel

-------------------

# 3. Channels

* a channel is the construct used between sources and sinks.
* It provides a holding area for your in-flight events after they are read from sources until they can be written to sinks in your data processing pipelines
* The durable file channel flushes all changes to disk before acknowledging receipt of the event to the sender
  * considerably slower than using the non-durable memory channel
  * provides recoverability in the event of system or Flume agent restarts
* the memory channel is much faster
  * failure results in data loss
  * has much lower storage capacity when compared with the disks backing the file channel
* regardless of what channel you choose, if your rate of ingest from the sources into the channel is greater than the rate the sink can write data, you will exceed the capacity of the channel and you will throw a `ChannelException`
* ** you always want your sink to be able to write faster than your source input**
  * Otherwise, you may get into a situation where once your sink falls behind you can never catch up

## Memory channel

* a channel where in-flight events are stored in memory.
* events can be ingested much more quickly resulting in reduced hardware needs
* The downside of using this channel is that an agent failure results in loss of data
* To use the memory channel, set the  type parameter on your named channel to memory
  * `agent.channels.c1.type=memory`
* The default capacity of this channel is 100 Events
  * if you increase this value you may also have to increase your Java heap space
* transactionCapacity is the maximum number of events that can be written, in a single transaction, when moving data from the source to the channel
  * This is also the number of events that can be read, in a single transaction, when moving data from the channel to the sink
  * Increase it to decrease the overhead of the transaction wrapper, which may speed things up
  * The downside to increasing this, in the event of a failure, is that a source would have to roll back more data
* the keep-alive parameter is the time the thread writing data into the channel will wait when the channel is full before giving up
  * if space opens up before the timeout expires, the data will be written to the channel rather than throwing an exception back to the source

![Memory Channel Configuration Parameters](memory_channel_config_parameters.png "Memory Channel Configuration Parameters")

## File Channel
