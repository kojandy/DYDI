# DYDI
## Introduction
### This service is for pet cafe owners and their employees, who has a hard time managing many pets.
### [Demo] (https://dydi.kojandy.com)

## Implementations
* Timeline tabs(index.html)
  * The present time is marked by a red line in the middle.
    * User can compare the today’s task with the current time to know when to work.
#### User can select completion and necessity of each task.
- When user select each task then pop up will pops up and ask user to select completion and necessity of that task.
- If user select one then it is linked to firebase and reflected in calendar.
#### Differentiate completion and necessity by color.
- completed tasks : green color
- unfinished tasks : red color
- not needed tasks : gray color

### Noti tabs(index.html)
#### The number of notifications is provided in a small red circle in the Noti tab.
#### When user click each notification then it will delete.

### Add schedule(index.html)
#### Select repetition status.
- Tasks of managing pets will often be repeated, so we allow user to choice days to repeat, date to start and date to end.
#### Select pets
- User can choose among the managed pets to perform the task together.

### Tasks(calendar.html)
#### User can see the tasks by month, week, day and list.
#### Differentiate completion and necessity by color.
- Same with timeline.
When user brings the mouse to each task then calendar tells user what kind of tasks it is.
#### User can drag and drop tasks at the calendar.
- When user changes the date of a task by drag and drop at the calendar, then it is linked to firebase and reflected in timeline.
- To avoid confusion, user can drag and drop only non-repeating tasks.

### Shop
### Statistics
