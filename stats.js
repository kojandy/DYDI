// This allows the Javascript code inside this block to only run when the page
// has finished loading in the browser.
$(document).ready(function() {
  // Firebase Database setup
  const database = firebase.database();

  let currentGroup = undefined;

  function focusOnGroup(group) {
    if(group === undefined)
      return;

    loadAndDraw(group);

    let ro = new ResizeObserver(function(entries) {
      loadAndDraw(group);
    });

    // Observe one or multiple elements
    ro.observe($("#stats_nav_" + group)[0]);
  }

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
          `<div class="tab-pane fade chart_pane`
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
          focusOnGroup(currentGroup);
        }

        firstNav = false;

        $("#stats_nav_tab a:last-of-type").click(function(events) {
          events.preventDefault();

          focusOnGroup($(this).attr("group"));

          $(this).tab("show");
        });
      }
    });
  });

  let taskRef = database.ref("task");
  taskRef.on("value", function(snapshot) {
    focusOnGroup(currentGroup);
  });

  function loadAndDraw(group) {

    if(group === undefined)
      return;

    const chartDiv = $("#stats_nav_" + group);
    if(!chartDiv.hasClass("active"))
      return;

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

        let baseValue = 1;
        if(group === "Beauty")
          baseValue = 0;

        let comCount = {
          "Mon": baseValue,
          "Tue": baseValue,
          "Wed": baseValue,
          "Thu": baseValue,
          "Fri": baseValue,
          "Sat": baseValue,
          "Sun": baseValue,
        };
        let notCount = {
          "Mon": baseValue,
          "Tue": baseValue,
          "Wed": baseValue,
          "Thu": baseValue,
          "Fri": baseValue,
          "Sat": baseValue,
          "Sun": baseValue,
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
          let day = moment().subtract(7 - i, "days").format("ddd");
          let day_full = moment().subtract(7 - i, "days").format("ddd (M/D)");
          maxCount = Math.max(maxCount, comCount[day] + notCount[day] + 1);
          data.addRow([day_full, comCount[day], notCount[day]]);
        }

        let tickCount = Math.min(maxCount + 1, defaultTickCount);
        let tickMarks = [];
        for(let i = 0; i < tickCount; i++)
          tickMarks[i] = (i == tickCount - 1) ? maxCount : Math.floor(i * maxCount/ (tickCount - 1));

        // Set chart options
        let options = {
          title: "# of " + group + " (in past 7 days)",
          isStacked: true,
          vAxis: {
            ticks: tickMarks,
          },
          series: {
            0: {color: completeColor},
            1: {color: notneededColor},
          },
          chartArea: {
            width: "95%",
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
            // alert("The user selected " + day);
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
