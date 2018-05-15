// This allows the Javascript code inside this block to only run when the page
// has finished loading in the browser.
$(document).ready(function() {
  // Firebase Database setup
  var database = firebase.database();

  function resetHandler() {
    dbRef = database.ref();
    dbRef.set({
      group: {
        group0: {
          title: "Feed",
          tracked: true,
        },
        group1: {
          title: "Bathe",
          tracked: true,
        },
      },
      noti: {
        noti0: {
          at: "2018-05-03T14:00",
          body: "Vaccination",
        },
        noti1: {
          at: "2018-05-13T18:00",
          body: "Feed Jandy",
        },
        noti2: {
          at: "2018-05-14T12:00",
          body: "Checked in: Ohjun Kwon",
        },
      },
      shift: {
        shift0: {
          start: "16:00",
          end: "19:00",
          members: {
            day0: {
              member0: "Shihwan Kim",
              member1: "Jeongjae Lee",
            },
            day1: {
              member0: "Suyeon Lee",
              member1: "Jaehoon Kim",
            },
            day2: {
              member0: "Hyogeun Han",
              member1: "Jun Lee",
            },
          },
        },
        shift1: {
          start: "19:00",
          end: "22:00",
          members: {
            day0: {
              member0: "Hyogeun Han",
              member1: "Suyeon Lee",
            },
            day1: {
              member0: "Jeongjae Lee",
              member1: "Jun Lee",
            },
            day2: {
              member0: "Jaehoon Kim",
              member1: "Shihwan Kim",
            },
          },
        },
      },
      task: {
        task0: {
          title: "Feed all pets",
          start: "2018-04-25T14:00",
          end: "2018-04-27T14:00",
          group: "Feed",
          recurring: false,
          status: {
            "2018-04-25": false,
          },
        },
        task1: {
          title: "Shaving Jandy",
          start: "2018-05-03T14:00",
          end: "2018-05-10T15:00",
          group: "Feed",
          recurring: {
            0: true,
            1: false,
            2: true,
            3: false,
            4: false,
            5: false,
            6: false,
          },
          status: {
            "2018-05-06": true,
            "2018-05-08": false,
          },
        },
        task2: {
          title: "Clean Litter box",
          start: "2018-05-11T14:00",
          end: "2018-05-11T15:00",
          group: "Feed",
          recurring: false,
        },
        task3: {
          title: "Walk",
          start: "2018-05-01T12:00",
          end: "2018-05-18T13:00",
          group: "Bathe",
          recurring: {
            0: false,
            1: false,
            2: true,
            3: false,
            4: false,
            5: false,
            6: false,
          },
          status: {
            "2018-05-07": false,
          },
        },
        task4: {
          title: "Fighting",
          start: "2018-05-12T05:00",
          end: "2018-05-12T07:00",
          group: "Bathe",
          recurring: false,
          status: {
            "2018-05-12": true,
          },
        },
        task5: {
          title: "HCI",
          start: "2018-05-14T19:00",
          end: "2018-05-14T20:30",
          group: "Bathe",
          recurring: false,
        },
        task6: {
          title: "DP6 Write-up",
          start: "2018-05-17T19:00",
          end: "2018-05-17T20:30",
          group: "Bathe",
          recurring: false,
        },
      },
    });
  }

  $("#db_reset").click(resetHandler);
});
