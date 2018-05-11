var alreadyLoadedLibrary = false;

function loadLibrary() {
  if(alreadyLoadedLibrary)
    return;
  alreadyLoadedLibrary = true;

  const config = {
    apiKey: "AIzaSyAn9cS4J2VMItPAG7DFDqRfgZfknrVjhQ8",
    databaseURL: "https://dydi-82330.firebaseio.com/",
  };
  firebase.initializeApp(config);
}

/*
  let loadString =
  `
  <script src="http://code.jquery.com/jquery-3.3.1.min.js" integrity="sha256-FgpCb/KJQlLNfOu91ta32o/NMZxltwRo8QtmkMRdAu8=" crossorigin="anonymous"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js" integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q" crossorigin="anonymous"></script>
  <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.1.1/js/bootstrap.min.js" integrity="sha384-smHYKdLADwkXOn1EmN1qk/HfnUcbVRZyYmZ4qpPea6sjB/pTJ0euyQp0Mk8ck+5T" crossorigin="anonymous"></script>
  <script src="https://unpkg.com/@coreui/coreui@2.0.0-rc.1/dist/js/coreui.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.22.1/moment.js" integrity="sha256-Z1d5nX6+IwGjjkkYg+fWe/jzvJae4NYejTz7PcIumxE=" crossorigin="anonymous"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/fullcalendar/3.9.0/fullcalendar.min.js"></script>
  <script src="lib/scheduler.min.js"></script>
  <script src="https://www.gstatic.com/firebasejs/4.10.1/firebase.js"></script>
  <script src="https://www.gstatic.com/charts/loader.js"></script>
  <link rel="stylesheet" href="https://unpkg.com/@coreui/coreui@2.0.0-rc.1/dist/css/coreui.min.css">
  <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.0.13/css/all.css" integrity="sha384-DNOHZ68U8hZfKXOrtjWvjxusGo9WQnrNx2sqG0tfsghAvtVlRW3tvkXWZh58N9jp" crossorigin="anonymous">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/fullcalendar/3.9.0/fullcalendar.min.css">
  <link rel="stylesheet" href="lib/scheduler.min.css">
  `;
*/
