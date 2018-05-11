// This allows the Javascript code inside this block to only run when the page
// has finished loading in the browser.
$(document).ready(function() {
  // Firebase Database setup
  const database = firebase.database();

  var groupRef = database.ref("group");
  groupRef.on("value", function(snapshot) {
    snapshot.forEach(function(groupSnapshot) {
      let groupEntry = groupSnapshot.val();
      
    });
  });


  $("#stats_nav a").on("click", function(events) {
    events.preventDefault();



    $(this).tab("show");
  });

  const group = "Feed";
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
          var status = taskSnapshot.child("status").val();
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

      comCount["Mon"] += 2;
      notCount["Mon"] += 1;

      let maxCount = 0;
      for(let i = 1; i <= 7; i++) {
        let day = moment().add(i, "days").format("ddd");
        maxCount = Math.max(maxCount, comCount[day] + notCount[day]);
        data.addRow([day, comCount[day], notCount[day]]);
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
      };

      function selectHandler() {
        let selectedItem = chart.getSelection()[0];
        if (selectedItem) {
          let day = data.getValue(selectedItem.row, 0);
          alert("The user selected " + day);
        }
      }

      // Instantiate and draw our chart, passing in some options.
      let chart = new google.visualization.ColumnChart($("#chartArea")[0]);
      google.visualization.events.addListener(chart, "select", selectHandler);
      chart.draw(data, options);
    });
  }
});
