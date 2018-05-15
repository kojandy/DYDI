# DYDI
## Introduction
### This service is for pet cafe owners and their employees, who has a hard time managing many pets.
### [Link to Demo](http://dydi.kojandy.com)

## Implementations
* Timeline tabs (index.\*)
  * The present time is marked by a red line in the middle.
    * User can compare the today’s task with the current time to know when to work.
  * User can select completion and necessity of each task.
    * When user select each task then pop up will pops up and ask user to select completion and necessity of that task.
    * If user answer then it is linked to firebase and reflected in calendar.
  * Differentiate completion and necessity by color.
    * completed tasks : green color
    * unfinished tasks : red color
    * not needed tasks : gray color

* Noti tabs (index.\*)
  * The number of notifications is provided in a small red circle in the Noti tab.
  * When user click each notification then it will delete.

* Add schedule (index.\*)
  * Select repetition status.
    * Tasks of managing pets will often be repeated, so we allow user to choice days to repeat, date to start and date to end.
  * Select pets
    * User can choose among the managed pets to perform the task together.

* Tasks (calendar.\*)
  * User can see the tasks by month, week, day and list.
  * Differentiate completion and necessity by color.
    * Same with timeline.
    * When user brings the mouse to each task then calendar tells user what kind of tasks it is.
  * User can drag and drop tasks at the calendar.
    * When user changes the date of a task by drag and drop at the calendar, then it is linked to firebase and reflected in timeline.
    * To avoid confusion, user can drag and drop only non-repeating tasks.

* Shop (shop.\*)
  * Show  timetable for the part-time job
  * reflects current/next shift status in the main page
  * can add new shift or modify already exist shift
  
* Statistics (stats.\*)
  * Show statistics of tasks of past 7 days, in groups.
  * Immediately reflects group/task state changes
  * Color scheme is same as timeline
