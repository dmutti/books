# Understanding XP

* If the customers won't move to the team, move the team to the customers.
* Full-Time Team Members
    * Fractional assignment is dreadfully counterproductive: fractional workers don't bond with their teams, they often aren't around to hear conversations and answer questions, and they must task switch, which incurs a significant hidden penalty. "The minimum penalty is 15 percent... Fragmented knowledge workers may look busy, but a lot of their busyness is just thrashing".
    * That's not to say everyone needs to work with the team for the entire duration of the project. You can bring someone in to consult on a problem temporarily. However, while she works with the team, she should be fully engaged and available.
* The Last Responsible Moment
** Note that the phrase is the last responsible moment, not the last possible moment. As [Poppendieck & Poppendieck] says, make decisions at "the moment at which failing to make a decision eliminates an important alternative. If commitments are delayed beyond the last responsible moment, then decisions are made by default, which is generally not a good approach to making decisions."
    * By delaying decisions until this crucial point, you increase the accuracy of your decisions, decrease your workload, and decrease the impact of changes. Why? A delay gives you time to increase the amount of information you have when you make a decision, which increases the likelihood it is a correct decision. That, in turn, decreases your workload by reducing the amount of rework that results from incorrect decisions. Changes are easier because they are less likely to invalidate decisions or incur additional rework.
* Theory of Constraints
    * What should the nonconstraints do in their spare time? Help eliminate the constraint. If testers are the constraint, programmers might introduce and improve automated tests.

# Adopting XP

* Recommendation #2: Strong Design Skills - If no one has strong design skills...
    * Meanwhile, start learning! [Evans]' Domain-Driven Design is a good place to start, as is [Fowler 2002a]'s Patterns of Enterprise Application Architecture. Consider taking a course or hiring somebody to join the team as a mentor. Be careful, though—strong design skills, while essential, are surprisingly rare. Ask someone with good design skills to help you vet your choice.

# Thinking

## Pair Programming

* Alternatives
    * Inspections alone are unlikely to share knowledge as thoroughly as collective code ownership requires. If you cannot pair program, consider avoiding collective ownership, at least at first.

## Energized Work

* How to Be Energized
    * If quality time off is the yin of energized work, focused work is the yang. While at work, give it your full attention. Turn off interruptions such as email and instant messaging. Silence your phones. Ask your project manager to shield you from unnecessary meetings and organizational politics.
* Supporting Energized Work
    * Tired people make mistakes and take shortcuts.
* Questions
    * What if I'm not ready to check in my code and it's time to go home? Some teams revert (delete) code that doesn't pass all its tests at the end of the day. This sounds harsh, but it's a good idea: if you can't easily check in, you’ve gone far off track. You'll do better work in the morning. If you're practicing continuous integration well, the loss of code will be minimal and you'll still have learned from the experience.
* Contraindications
    * Some organizations may make energized work difficult. If your organization uses the number of hours worked as a yardstick to judge dedication, you may be better off sacrificing energized work and working long hours. The choice between quality of life and career advancement is a personal one that only you and your family can make.

## Informative Workspace

* If people won't take responsibility, perhaps you're being too controlling.
* Alternatives
    * A traditional alternative is the weekly status meeting, but I find these dreary wastes of time that delay and confuse important information.

## Root-Cause Analysis

* Rather than blaming people, I blame the process. What is it about the way we work that allowed this mistake to happen? How can we change the way we work so that it's harder for something to go wrong?
    * This is root-cause analysis.
* How to Find the Root Cause
    * A classic approach to root-cause analysis is to ask "why" five times
* Questions
    * How do we avoid blaming individuals? If your root cause points to an individual, ask "why" again. Why did that person do what she did? How was it possible for her to make that mistake? Keep digging until you learn how to prevent that mistake in the future.

# Collaborating

## Trust

* Team Strategy #1: Customer-Programmer Empathy
    * Sometimes the acrimony is so intense that the groups actually start doing what the others fear: programmers react by inflating estimates and focusing on technical toys at the expense of necessary features; customers react by ignoring programmer estimates and applying schedule pressure. This sometimes happens even when there's no overt face-to-face hostility.
* Contraindications
    * Compensation practices can make teamwork difficult. An XP team produces results through group effort. If your organization relies on individual task assignment for personnel evaluation, teamwork may suffer. Similarly, ranking on a curve—in which at least one team member must be marked unsatisfactory, regardless of performance—has a destructive effect on team cohesion. These practices can transform your team into a group of competing individuals, which will hurt your ability to practice XP.

## Sit Together

* Accommodating Poor Communication
    * As the distance between people grows, the effectiveness of their communication decreases. Misunderstandings occur and delays creep in. People start guessing to avoid the hassle of waiting for answers. Mistakes appear.
    * To combat this problem, most development methods attempt to reduce the need for direct communication. It's a sensible response. If questions lead to delays and errors, reduce the need to ask questions!
    * The primary tools teams use to reduce reliance on direct communication are development phases and work-in-progress documents. For example, in the requirements phase, business analysts talk to customers and then produce a requirements document. Later, if a programmer has a question, he doesn't need to talk to an expert; he can simply look up the answer in the document.
    * It's a sensible idea, but it has flaws. The authors of the documents need to anticipate which questions will come up and write clearly enough to avoid misinterpretations. This is hard to do well. In practice, it's impossible to anticipate all possible questions. Also, adding up-front documentation phases stretches out the development process.*
* Questions
    * **How can I concentrate with all that background noise?** Sometimes, the team gets a little noisy and rambunctious. It's OK to ask for quiet—the sound in the team room should be a hum, not a full-throated chorus. Some teams have a bell for team members to ring when they want the team to be more quiet.

## Real Customer Involvement

* Contraindications
    * End-users often think in terms of improving their existing way of working, rather than in terms of finding completely new ways of working. This is another reason why end-users should be involved but not in control. If innovation is important to your project, give innovative thinkers—such as a visionary product manager or interaction designer—a prominent role on your team.

## Coding Standards

* Beyond Formatting
    * We all agreed that clearly named variables and short methods were important. We agreed to use assertions to make our code fail fast, not to optimize without measurements, and never to pass null references between objects. We agreed on how we should and shouldn't handle exceptions, what to do about debugging code, and when and where to log events.
* How to Create a Coding Standard
    * One of the marks of a professional is the willingness to put aside personal aesthetics for a team aesthetic.
* Adhering to the Standard
    * Start by talking with your colleague alone to see if there’s a disagreement. Take an attitude of collaborative problem solving: instead of saying, "Why aren't you propagating exceptions like we agreed?" ask, "What do you think about the 'propagate exceptions' standard we agreed on? Should we keep it?" Give objections full consideration, raise them with the rest of the team, and consider changing the standard.

# Releasing

## No Bugs

* How to Achieve Nearly Zero Bugs
    * Many approaches to improving software quality revolve around finding and removing more defects through traditional testing, inspection, and automated analysis.
    * The agile approach is to generate fewer defects. This isn't a matter of finding defects earlier; it's a question of not generating them at all.
    * To achieve these results, XP uses a potent cocktail of techniques:
        1. Write fewer bugs by using a wide variety of technical and organizational practices
        2. Eliminate bug breeding grounds by refactoring poorly designed code
        3. Fix bugs quickly to reduce their impact, write tests to prevent them from reoccurring, then fix the associated design flaws that are likely to breed more bugs
        4. Test your process by using exploratory testing to expose systemic problems and hidden assumptions
        5. Fix your process by uncovering categories of mistakes and making those mistakes impossible
* Ingredient #3: Fix Bugs Now
    * Mistakes do occur, of course, and we want to prevent those mistakes. Pointing fingers is counterproductive. The whole team—on-site customers, testers, and programmers—is responsible for delivering valuable software. Regardless of who made the mistake, the whole team is responsible for preventing it from reaching stakeholders. To that end, when I think about bugs, I focus on what the team delivers, not where the bug came from.
    * **A bug or defect is any behavior of your software that will unpleasantly surprise important stakeholders**
* Ingredient #4: Test Your Process
    * Don't rely on exploratory testing to find bugs in your software. (Really!) Your primary defense against bugs is test-driven development and all the other good practices I've mentioned. Instead, use exploratory testing to test your process. When an exploratory test finds a bug, it's a sign that your work habits—your process—have a hole in them. Fix the bug, then fix your process.
* Invert Your Expectations
    * If you follow these practices, bugs should be a rarity. Your next step is to treat them that way. Rather than shrugging your shoulders when a bug occurs—"Oh yeah, another bug, that's what happens in software"—be shocked and dismayed. "That's our fourth bug this month! Why do we have so many bugs?”
    * For this reason, I recommend that new XP teams not install a bug database. If you're only generating a bug or two per month, you don't need a database to keep track of your bugs; you can just process them as they come in. Explicitly not providing a database helps create the attitude that bugs are abnormal. It also removes the temptation to use the database as a substitute for direct, personal communication.
* Questions
    * **If we don't find any bugs, how do we know that our testers are doing exploratory testing correctly?** If you're following the practices and your testers haven't found anything, you can comfortably release your software. Reevaluate your approach if your stakeholders or customers find a significant bug.

## Version Control

* Concurrent Editing
    * While this approach solves the problem of accidentally overwriting changes, it can cause other, more serious problems. A locking model makes it difficult to make changes. Team members have to carefully coordinate who is working on which file, and that stifles their ability to refactor and make other beneficial changes. To get around this, teams often turn to strong code ownership, which is the worst of the code ownership models because only one person has the authority to modify a particular file. Collective code ownership is a better approach, but it's very hard to do if you use file locking.
* Whole Project
    * For similar reasons, store the entire project in a single repository. Although it may seem natural to split the project into multiple repositories perhaps one for each deliverable, or one for source code and one for documentation—this approach increases the opportunities for things to get out of sync.
* Keep It Clean
    * One of the most important ideas in XP is that you keep the code clean and ready to ship. It starts with your sandbox. Although you have to break the build in your sandbox in order to make progress, confine it to your sandbox. Never check in code that breaks the build. This allows anybody to update at any time without worrying about breaking their build—and that, in turn, allows everyone to work smoothly and share changes easily.
    * **Always check in code that builds and passes all tests**
* Single Codebase
    * I've seen this cripple a team's ability to deliver working software on a timely schedule. It's nearly impossible to recombine a duplicated codebase without heroic and immediate action. That one click doesn't just lead to technical debt; it leads to indentured servitude.
    * **Duplicating your codebase will cripple your ability to deliver**
    * Branches have their uses, but using them to provide multiple customized versions of your software is risky. Although version control systems provide mechanisms for keeping multiple branches synchronized, doing so is tedious work that steadily becomes more difficult over time. Instead, design your code to support multiple configurations. Use a plug-in architecture, a configuration file, or factor out a common library or framework. Top it off with a build and delivery process that creates multiple versions.
* Appropriate Uses of Branches
    * Branches work best when they are short-lived or when you use them for small numbers of changes. If you support old versions of your software, a branch for each version is the best place to put bug fixes and minor enhancements for those versions.

## Ten-Minute Build

* Ten Minutes or Less
    * A great build script puts your team way ahead of most software teams. After you get over the rush of being able to build the whole system at any time you want, you’ll probably notice something new: the build is slow.
    * With continuous integration, you integrate every few hours. Each integration involves two builds: one on your machine and one on the integration machine. You need to wait for both builds to finish before continuing because you can never let the build break in XP. If the build breaks, you have to roll back your changes.
    * A 10-minute build leads to a 20-minute integration cycle. That's a pretty long delay. I prefer a 10- or 15-minute integration cycle. That's about the amount of time it takes to stretch my legs, get some coffee, and talk over our work with my pairing partner.
    * The easiest way to keep the build under 5 minutes (with a 10-minute maximum) is to keep the build times down from the beginning. One team I worked with started to look for ways to speed up the build whenever it exceeded 100 seconds.
    * Many new XP teams make the mistake of letting their build get too long. If you're in that boat, don't worry. You can fix long build times in the same agile way you fix all technical debt: piece by piece, focusing on making useful progress at each step.

## Continuous Integration
* There's a lively community of open-source continuous integration servers (also called CI servers). The granddaddy of them all is CruiseControl, pioneered by ThoughtWorks employees.
* A continuous integration server starts the build automatically after check-in. If the build fails, it notifies the team. Some people try to use a continuous integration server instead of the continuous integration script discussed earlier. This doesn't quite work because without an integration token, team members can accidentally check out code that hasn't yet been proven to work.
* Another common mistake is using a continuous integration server to shame team members into improving their build practices. Although the "wow factor" of a CI server can sometimes inspire people to do so, it only works if people are really willing to make an effort to check in good code. I've heard many reports of people who tried to use a CI server to enforce compliance, only to end up fixing all the build failures themselves while the rest of the team ignored their strong-arming.
* If your team sits together and has a fast build, you don’t need the added complexity of a CI server. Simply walk over to the integration machine and start the build when you check in. It only takes a few seconds—less time than it takes for a CI server to notice your check-in—and gives you an excuse to stretch your legs.

## Collective Code Ownership

* There's a metric for the risk imposed by concentrating knowledge in just a few people's heads—it's called the truck number. How many people can get hit by a truck before the project suffers irreparable harm?

## Documentation

* Alternatives
    * Alistair Cockburn suggests an intriguing alternative to written documents for handoff documentation: rather than creating a design overview, use a video camera to record a whiteboard conversation between an eloquent team member and a programmer who doesn't understand the system. Accompany the video with a table of contents that provides timestamps for each portion of the conversation.

## Planning

### Vision
* Identifying the Vision
    * Like the children's game of telephone, every step between the visionaries and the product manager reduces the product manager's ability to accurately maintain and effectively promote the vision.
* **How to Create a Vision Statement**
    * Ver no livro - página 208

### Release Planning

* How to Create a Release Plan
    * Timeboxed plans are almost always better. They constrain the amount of work you can do and force people to make difficult but important prioritization decisions. This requires the team to identify cheaper, more valuable alternatives to some requests. Without a timebox, your plan will include more low-value features.
    * To create your timeboxed plan, first choose your release dates. I like to schedule releases at regular intervals, such as once per month and no more than three months apart.
* Adaptive Planning and Organizational Culture
    * No aspect of agile development challenges organizational culture more than the transition to adaptive planning. It requires changes not only to the development team, but to reporting, evaluation, and executive oversight. The choice of adaptive planning extends to surprisingly diverse parts of the project community, and people often have a shocked or emotional reaction to the idea.
    * As a result, you may not be able to influence a change to adaptive planning. Unless you have executive support, any change that does occur will probably be slow and gradual. Even with executive support, this change is difficult.
    * You can work within your organization's culture to do adaptive planning under the radar. Use adaptive planning, but set your planning horizons to match the organization's expectations. Generally, estimating and prioritizing stories for the remainder of the current release is enough. This works best if you have small, frequent releases.

## Iteration Planning

* DAILY ITERATIONS
    * If you have a particularly chaotic environment, you probably won't be able to use a lot of the XP practices. However, iterations—particularly daily iterations—can be a great way to bring structure to this environment.
    * One team I worked with was struggling under a crushing load of support requests. They had resorted to firefighting: they responded to whichever request seemed like the biggest emergency. We instituted a simple daily iteration—nothing else—in which the team prioritized outstanding support requests using the planning game. They deferred any new requests that came in during the day until the next planning game. That was acceptable because the team planned every morning.
    * The results were remarkable. Productivity increased, morale shot up, and the team actually found itself with free time. Daily iterations helped the team tame the chaos and, in so doing, dramatically improved their effectiveness.
    * If you find yourself struggling with firefighting, daily iterations might help your team, too.

## Slack

* How to Introduce Slack
    * schedule useful, important work that isn't time-critical—work you can set aside in case of an emergency. Paying down technical debt fits the bill perfectly.
    * Paying down technical debt directly increases team productivity, so I spend a lot of time on it throughout the iteration. I usually spend about eight hours per week paying down technical debt, but other members of my teams spend only a few hours. A good rule of thumb is to spend 10 percent of the iteration on technical debt.
* Research Time
    * Research time works because programmers are typically motivated by a desire to do good work, particularly when they're self-directed. Most programmers have a natural desire to make their lives easier and to impress their colleagues. As a result, the work done in research time often has a surprisingly high return for the project.
* Don't Cross the Line
    * Making enough time for these nonurgent tasks is difficult. With a deadline rushing head-first toward you, it's difficult to imagine spending any time that doesn't directly contribute to getting stories out the door. New XP teams especially struggle with this. Don't give up. Slack is essential to meeting commitments, and that is the key to successful XP.
* Reducing the Need for Slack
    * In my experience, there are two big sources of randomness on XP teams: customer unavailability and technical debt. Both lead to an unpredictable environment, make estimating difficult, and require you to have more slack in order to meet your commitments.
* Contraindications
    * In addition, never incur technical debt in the name of slack. If you can't meet your iteration commitments while performing standard XP tasks, replan the iteration instead. Practices you should never use as slack include test-driven development, refactoring new code, pair programming, and making sure stories are "done done."
* Alternatives
    * Rather than including slack at the iteration level, some teams add a safety buffer to every estimate. As [Goldratt 1997] explains, this leads to delays and often doesn't improve the team's ability to meet their commitments.
* Silver stories
    * Other teams schedule silver stories for slack. These are less-important stories that the team can set aside if they need extra time. I prefer to pay down technical debt instead because teams often neglect this crucial task.
    * I've also observed that silver stories hurt programmer morale. If the team needs to use some slack, they don't finish all the stories on the board. Even though the silver stories were bonus stories, it doesn't feel like that in practice. In contrast, any time spent paying down technical debt directly improves programmers' quality of life. That's a win.

## Stories

* Customer-Centricity
    * Instead, include any technical considerations in the estimate for each story. If a story requires that the programmers create or update a build script, for example, include that cost when estimating for that story.
    * **Including technical costs in stories, rather than having dedicated technical stories, requires incremental design and architecture**
* Special Stories
    * "Nonfunctional" stories
        * Performance, scalability, and stability—so-called nonfunctional requirements—should be scheduled with stories, too. Be sure that these stories have precise completion criteria
        * Spike stories
            * Sometimes programmers won't be able to estimate a story because they don't know enough about the technology required to implement the story. In this case, create a story to research that technology. An example of a research story is "Figure out how to estimate 'Send HTML' story." Programmers will often use a spike solution to research the technology, so these sorts of stories are typically called spike stories.

## Estimating

* What Works (and Doesn't) in Estimating
    * Part of the secret to making good estimates is to predict the effort, not the calendar time, that a project will take. Make your estimates in terms of ideal engineering days (often called story points), which are the number of days a task would take if you focused on it entirely and experienced no interruptions.
* Velocity and the Iteration Timebox
    * Velocity relies upon a strict iteration timebox. To make velocity work, never count stories that aren't "done done" at the end of the iteration. Never allow the iteration deadline to slip, not even by a few hours.
* How to Improve Your Velocity
    * Pay down technical debt
    * Improve customer involvement
    * Support energized work
    * Offload programmer duties
    * Provide needed resources

# Developing
* The best way I know to reduce the cost of writing software is to improve the internal quality of its code and design. I've never seen high quality on a well-managed project fail to repay its investment. It always reduces the cost of development in the short term as well as in the long term. On a successful XP project, there's an amazing feeling—the feeling of being absolutely safe to change absolutely anything without worry.

## Incremental Requirements

* Customer review
    * **Prior to seeing the application in action, every conversation is theoretical. You can discuss options and costs, but until you have an implementation, everyone can only imagine how the choices will feel. Only working applications show you what you're really going to get.**
* Questions
    * **As a programmer, I'm offended by some of the things customers find in their reviews. They're too nitpicky.** Things that can seem nitpicky to programmers—such as the color of the screen background, or a few pixels of alignment in the UI—represent polish and professionalism to customers. This goes both ways: some things that seem important to programmers, such as quality code and refactoring, often seem like unnecessary perfectionism to customers.

## Customer Tests
* Describe
    * At the beginning of the iteration, look at your stories and decide whether there are any aspects that programmers might misunderstand. You don't need to provide examples for everything. Customer tests are for communication, not for proving that the software works.
* Develop
    * **Don't use customer tests as a substitute for test-driven development.**
* Focus on Business Rules
    * Good examples focus on the essence of your rules. Rather than imagining how those rules might work in the application, just think about what the rules are. If you weren't creating an application at all, how would you describe those rules to a colleague? Talk about things rather than actions. Sometimes it helps to think in terms of a template: "When (scenario X), then (scenario Y)."
* Ask Customers to Lead
    * Team members, watch out for a common pitfall in customer testing: no customers! Some teams have programmers and testers do all the work of customer testing, and some teams don't involve their customers at all. In others, a customer is present only as a mute observer. Don't forget the "customer" in "customer tests." The purpose of these activities to bring the customer's knowledge and perspective to the team’s work. If programmers or testers take the reins, you've lost that benefit and missed the point.
* TESTERS' ROLE
    * Testers play an important support role in customer testing. Although the customers should lead the effort, they benefit from testers' technical expertise and ability to imagine diverse scenarios. While customers should generate the initial examples, testers should suggest scenarios that customers don't think of.
    * On the other hand, testers should be careful not to try to cover every possible scenario. The goal of the exercise is to help the team understand the customers' perspective, not to exhaustively test the application.
* Automating the Examples
    * Using Fit in this way requires a ubiquitous language and good design. A dedicated domain layer with Whole Value objects works best. Without it, you may have to write end-to-end tests, with all the challenges that entails. If you have trouble using Fit, talk to your mentor about whether your design needs work.
* Contraindications
    * Don't use customer tests as a substitute for test-driven development. Customer tests are a tool to help communicate challenging business rules, not a comprehensive automated testing tool. In particular, Fit doesn't work well as a test scripting tool—it doesn't have variables, loops, or subroutines. (Some people have attempted to add these things to Fit, but it’s not pretty.) Real programming tools, such as xUnit or Watir, are better for test scripting.
    * Finally, because Fit tests are written in HTML, Fit carries more of a maintenance burden than xUnit frameworks do. Automated refactorings won't extend to your Fit tests. To keep your maintenance costs down, avoid creating customer tests for every business rule. Focus on the tests that will help improve programmer understanding, and avoid further maintenance costs by refactoring your customer tests regularly. Similar stories will have similar tests: consolidate your tests whenever you have the opportunity.

## Test-Driven Development

* Why TDD Works
    * In TDD, the tests are written from the perspective of a class' public interface. They focus on the class' behavior, not its implementation. Programmers write each test before the corresponding production code.
    * This focuses their attention on creating interfaces that are easy to use rather than easy to implement, which improves the design of the interface.
* Speed Matters
    * The vast majority of your tests should be unit tests. A small fraction should be integration tests, and only a few should be end-to-end tests.
* Unit Tests
    * Other kinds of tests often masquerade as unit tests. A test is not a unit test if:
        1. It talks to a database
        2. It communicates across a network
        3. It touches the file system
        4. You have to do special things to your environment (such as editing configuration files) to run it
* Focused Integration Tests
    * You shouldn't need many integration tests. The best integration tests have a narrow focus; each checks just one aspect of your program's ability to talk to the outside world. The number of focused integration tests in your test suite should be proportional to the types of external interactions your program has, not the overall size of the program. (In contrast, the number of unit tests you have is proportional to the overall size of the program.)
* End-to-End Tests
    * End-to-end tests can give you more confidence in your code, but they suffer from many problems. They're difficult to create because they require error-prone and labor-intensive setup and teardown procedures. They're brittle and tend to break whenever any part of the system or its setup data changes. They're very slow—they run in seconds or even minutes per test, rather than multiple tests per second. They provide a false sense of security, by exercising so many branches in the code that it's difficult to say which parts of the code are actually covered.
    * **Don't use exploratory testing to find bugs; use it to determine if your unit tests and integration tests mesh properly. When you find an issue, improve your TDD strategy.**
    * In some cases, limitations in your design may prevent unit and integration tests from testing your code sufficiently. This often happens when you have legacy code. In that case, end-to-end tests are a necessary evil. Think of them as technical debt: strive to make them unecessary, and replace them with unit and integration tests whenever you have the opportunity.
* TDD and Legacy Code
    * With the smoke tests in place, you can start introducing unit tests. The challenge here is finding isolated components to test, as legacy code is often tightly coupled code. Instead, look for ways for your test to strategically interrupt program execution. [Feathers] calls these opportunities seams. For example, in an object-oriented language, if a method has a dependency you want to avoid, your test can call a testspecific subclass that overrides and stubs out the offending method.

## Refactoring

* Questions
    * **Isn't refactoring rework? Shouldn't we design our code correctly from the beginning?** If it were possible to design your code perfectly from the beginning, then refactoring would be rework. However, as anybody who's worked with large systems knows, mistakes always creep in. It isn't possible to design software perfectly. That's why refactoring is important. Rather than bemoan the errors in the design, celebrate your ability to fix them.
    * **How can we make large design changes without conflicting with other team members?** During the refactoring, I like to use the distributed version control system SVK, built atop Subversion. It allows me to commit my changes to a local repository one at a time, then push all of them to the main repository when I reach the point of integration. This doesn’t prevent conflicts with other pairs, but it allows me to checkpoint locally, which reduces my need to disturb anyone else before I finish.

##  Simple Design
* **Simple, not simplistic.**

## Incremental Design and Architecture

* Incrementally Designing Classes
    * **Don't let design discussions turn into long, drawn-out disagreements. Follow the 10- minute rule: if you disagree on a design direction for 10 minutes, try one and see how it works in practice. If you have a particularly strong disagreement, split up and try both as spike solutions. Nothing clarifies a design issue like working code.**
* Incrementally Designing Architecture
    * Fortunately, you can also design architectures incrementally. As with other types of continuous design, use TDD and pair programming as your primary vehicle. While your software grows, be conservative in introducing new architectural patterns: introduce just what you need to for the amount of code you have and the features you support at the moment. Before introducing a new pattern, ask yourself if the duplication is really necessary. Perhaps there's some language feature you can use that will reduce your need to rely on the pattern.
    * Keep delivering stories while you refactor. Although you could take a break from new development to refactor, that would disenfranchise your customers. Balance technical excellence with delivering value. Neither can take precedence over the other. This may lead to inconsistencies within the code during the changeover, but fortunately, that's mostly an aesthetic problem—more annoying than problematic.
    * **Introducing architectural patterns incrementally helps reduce the need for multiiteration refactorings. It's easier to expand an architecture than it is to simplify one that's too ambitious.**
* Questions
    * **Our organization (or customer) requires comprehensive design documentation. How can we satisfy this requirement?** Ask them to schedule it with a story, then estimate and deliver it as you would any other story. Remind them that the design will change over time. The most effective option is to schedule documentation stories for the last iteration.

## Performance Optimization

* When to Optimize
    * Similarly, you have a responsibility to maintain an efficient development environment. If your tests start to take too long, go ahead and optimize until you meet a concrete goal, such as five or ten minutes. Keep in mind that the most common cause of a slow build is too much emphasis on end-to-end tests, not slow code.

## Exploratory Testing

* Questions
    * **Won't the burden of exploratory testing keep getting bigger over the course of the project?** The flaw in this approach is using exploratory testing as a means of regression testing. Use test-driven development to create a comprehensive, automated regression test suite. Focus your exploratory testing on new features (and their interactions with existing features), particularly those features that do things differently from previous features.
* Alternatives
    * You can use exploratory testing as a mechanism for bug hunting when working with software, particularly legacy software, that you suspect to be buggy. However, beware of relying on exploratory testing or any other testing approach to ensure all the bugs are caught. They won't be.

# Values and Principles

* About Values, Principles, and Practices
    1. **Courage** To make the right decisions, even when they're difficult, and to tell stakeholders the truth when they need to hear it
    2. **Communication** To give the right people the right information when they can use it to its maximum advantage
    3. **Simplicity** To discard the things we want but don't actually need
    4. **Feedback** To learn the appropriate lessons at every possible opportunity
    5. **Respect** To treat ourselves and others with dignity, and to acknowledge expertise and our mutual desire for success
* Principles are applications of those ideals to an industry. For example, the value of simplicity leads us to focus on the essentials of development. As [Beck 2004] puts it, this principle is to "travel light." [Cockburn] says, "Excess methodology weight is costly," and "Discipline, skills, and
understanding counter process, formality, and documentation."

# Eliminate Waste

* In Practice
    * XP's emphasis on programmer productivity—often at the cost of other team members' productivity— is another example of this principle. Although having customers sit with the team full-time may not be the most efficient use of the customers' time, it increases programmer productivity. If programmers are the constraint, as XP assumes, this increases the team's overall throughput and productivity.

# Deliver Value

* Only Releasable Code Has Value
    * Having the best, most beautiful code in the world matters very little unless it does what the customer wants. It's also true that having code that meets customer needs perfectly has little value unless the customer can actually use it. Until your software reaches the people who need it, it has only potential value.
    * Delivering actual value means delivering real software. Unreleasable code has no value. Working software is the primary measure of your progress. At every point, it should be possible to stop the project and have actual value proportional to your investment in producing the software.
    * Any functional team can change its focus in a week or a month, but can they do so while maximizing their investment of time and resources to deliver software regularly? Do they really finish code—does "done" mean "done done"—or do they leave an expanding wake of half-finished code? Do they keep their project releasable at any time?
    * Agility and flexibility are wonderful things, especially when combined with iterative incremental development. Throughput is important! Besides reducing thrashing and waste, it provides much better feedback, and not just in terms of the code's quality. Only code that you can actually release to customers can provide real feedback on how well you're providing value to your customers.
    * That feedback is invaluable.

## Seek Technical Excellence

* With so many conflicting points of view about what's obviously good, only one thing is clear: good isn't obvious.
* Quality with a Name
    * Some programmers flinch at the thought of wasting computer time and making "slow" programs. However, wasting cheap computer time to save programmer resources is a wise design decision. Programmers are often the most expensive component in software development.
    * **A good software design minimizes the time required to create, modify, and maintain the software while achieving acceptable runtime performance.**
* Great Design
    * **Modification and maintenance time are more important than creation time.** It bears repeating that most software spends far more time in maintenance than in initial development. When you consider that even unreleased software often requires modifications to its design, the importance of creation time shrinks even further. A good design focuses on minimizing modification and maintenance time over minimizing creation time.
* Optimize from Measurements
    * Although well-designed code is often fast code, it isn't always fast. Optimization is sometimes necessary. Optimizing later allows you to do it in the smartest way possible: when you've refined the code, when it's cheapest to modify, and when performance profiling can help direct your optimization effort to the most effective improvements.
* Pursue Mastery
    * However, I'm willing to throw away even the design principles if they get in the way of reducing programmer time and, most importantly, solving real customer problems.
