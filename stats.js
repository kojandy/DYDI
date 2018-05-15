// This allows the Javascript code inside this block to only run when the page
// has finished loading in the browser.
$(document).ready(function() {
  // Firebase Database setup
  const database = firebase.database();

  let currentGroup = undefined;

  let groupRef = database.ref("group");
  groupRef.on("value", function(snapshot) {
    $("#stats_nav_tab").empty();
    $("#stats_nav_tabContent").empty();

    let firstNav = true;
    currentGroup = undefined;

    snapshot.forEach(function(groupSnapshot) {
      let groupEntry = groupSnapshot.val();
      if(groupEntry.tracked) {
        let title = groupEntry.title;
        $("#stats_nav_tab").append(
          `<a class="nav-item nav-link`
          + (firstNav ? " active" : "") +
          `" id="stats_nav_`
          + title +
          `_tab" data-toggle="tab" href="#stats_nav_`
          + title +
          `" role="tab" aria-controls="stats_nav_`
          + title +
          `" aria-selected="true" group="`
          + title +
          `">`
          + title +
          `</a>`
        );
        $("#stats_nav_tabContent").append(
          `<div class="tab-pane fade`
          + (firstNav ? " show active" : "") +
          `" id="stats_nav_`
          + title +
          `" role="tabpanel" aria-labelledby="stats_nav_`
          + title +
          `_tab"></div>`
        );

        if(firstNav)
        {
          currentGroup = title;
          loadAndDraw(title);
        }

        firstNav = false;

        $("#stats_nav_tab a:last-of-type").click(function(events) {
          events.preventDefault();

          loadAndDraw($(this).attr("group"));

          $(this).tab("show");
        });
      }
    });
  });

  let taskRef = database.ref("task");
  taskRef.on("value", function(snapshot) {
    loadAndDraw(currentGroup);
  });

  function loadAndDraw(group) {

    if(group === undefined)
      return;

    const chartDiv = $("#stats_nav_" + group);
    const defaultTickCount = 15;
    const completeColor = "green";
    const notneededColor = "grey";

    // Load the Visualization API and the corechart package.
    google.charts.load("current", {"packages": ["corechart"]});

    // Set a callback to run when the Google Visualization API is loaded.
    google.charts.setOnLoadCallback(drawChart);

    // Callback that creates and populates a data table,
    // instantiates the pie chart, passes in the data and
    // draws it.
    function drawChart() {
      const tasksRef = database.ref("task").orderByChild("group").equalTo(group);
      tasksRef.once("value", function(tasksSnapshot) {
        let comCount = {
          "Mon": 0,
          "Tue": 0,
          "Wed": 0,
          "Thu": 0,
          "Fri": 0,
          "Sat": 0,
          "Sun": 0,
        };
        let notCount = {
          "Mon": 0,
          "Tue": 0,
          "Wed": 0,
          "Thu": 0,
          "Fri": 0,
          "Sat": 0,
          "Sun": 0,
        };

        tasksSnapshot.forEach(function(taskSnapshot) {
          if(taskSnapshot.hasChild("status")) {
            let status = taskSnapshot.child("status").val();
            for(d in status) {
              if(moment(d).isSameOrAfter(moment().subtract(7, "days"))) {
                if(status[d])
                  comCount[moment(d).format("ddd")] += 1;
                else
                  notCount[moment(d).format("ddd")] += 1;
              }
            }
          }
        });

        // Create the data table.
        let data = new google.visualization.DataTable();

        data.addColumn("string", "Day");
        data.addColumn("number", "Complete");
        data.addColumn("number", "Not Needed");

        let maxCount = 0;
        for(let i = 1; i <= 7; i++) {
          let day = moment().add(i, "days").format("ddd");
          maxCount = Math.max(maxCount, comCount[day] + notCount[day] + 2 + 1);
          data.addRow([day, comCount[day] + 1, notCount[day] + 1]);
        }

        let tickCount = Math.min(maxCount + 1, defaultTickCount);
        let tickMarks = [];
        for(let i = 0; i < tickCount; i++)
          tickMarks[i] = (i == tickCount - 1) ? maxCount : Math.floor(i * maxCount/ (tickCount - 1));

        // Set chart options
        let options = {
          title: group + " (This week)",
          isStacked: true,
          vAxis: {
            ticks: tickMarks,
          },
          series: {
            0: {color: completeColor},
            1: {color: notneededColor},
          },
          chartArea: {
            width: "100%",
          },
          bar: {
            groupWidth: "38.2%",
          },
          legend: {
            position: "bottom",
          },
        };

        function selectHandler() {
          let selectedItem = chart.getSelection()[0];
          if (selectedItem) {
            let day = data.getValue(selectedItem.row, 0);
            alert("The user selected " + day);
          }
        }

        // Instantiate and draw our chart, passing in some options.
        let chart = new google.visualization.ColumnChart(chartDiv[0]);
        google.visualization.events.addListener(chart, "select", selectHandler);
        chart.draw(data, options);
      });
    }
  }
});
