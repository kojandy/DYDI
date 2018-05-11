$(() => {
    let config = {
        apiKey: 'AIzaSyAn9cS4J2VMItPAG7DFDqRfgZfknrVjhQ8',
        databaseURL: 'https://dydi-82330.firebaseio.com/',
    };
    firebase.initializeApp(config);

    let database = firebase.database();
    let $body = $('body');
    let $calendar = $('#calendar');
    let $upcomingBody = $('#tl_upcoming');
    let $notiBody = $('#tab_noti');
    let $notiBadge = $('#noti_badge');

    $calendar.fullCalendar({
        header: false,
        height: 'parent',
        themeSystem: 'bootstrap4',
        defaultView: 'agendaDay',
        nowIndicator: true,
        schedulerLicenseKey: 'CC-Attribution-NonCommercial-NoDerivatives',
        height: 300,
        scrollTime: moment().subtract(1, 'hours').format('HH:mm:ss'),
        // allDaySlot: false,
    });

    $('#btn_toggle_nav').click(() => {
        if ($body.hasClass('sidebar-show')) {
            $body.removeClass('sidebar-show');
        } else {
            $body.addClass('sidebar-show');
        }
    });

    $('#btn_toggle_aside').click(() => {
        if ($body.hasClass('aside-menu-show')) {
            $body.removeClass('aside-menu-show');
        } else {
            $body.addClass('aside-menu-show');
        }
    });

    function addToday(start, end, title) {
        $calendar.fullCalendar('renderEvent', {
            title: title,
            start: start.format(),
            end: end.format(),
        });
    }

    function addUpcoming(start, title) {
        $upcomingBody.append(
            $('<div>')
                .addClass('list-group-item')
                .addClass('list-group-item-accent-warning')
                .addClass('list-group-item-divider')
                .append(
                    $('<div class="text-truncate font-weight-bold">').text(title)
                ).append(
                    $('<small class="text-muted">')
                    .append($('<span class="far fa-clock" style="margin-right: 5px;">'))
                    .append(start.format('M/D H:mm'))
                    .append(' ~')
                )
        );
    }

    function addNoti(at, body) {
        $notiBody.append(
            $('<div class="noti">').append(
                $('<small class="text-muted float-right">').text(at.fromNow())
            ).append(
                $('<div class="text-truncate font-weight-bold">').text(body)
            )
            ).append($('<hr>'));
    }

    database.ref('task').on('value', (snapshot) => {
        let tasks = snapshot.val();
        $calendar.fullCalendar('removeEvents');
        $upcomingBody.empty();
        let con = [];
        for (let id in tasks) {
            if (tasks[id].recurring === false) {
                con.push({
                    title: tasks[id].title,
                    start: moment(tasks[id].start),
                    end: moment(tasks[id].end),
                });
            } else {
                let begin = moment(tasks[id].start).startOf('day');
                let final = moment(tasks[id].end).endOf('day');
                let current = moment();
                let date = {
                    'year': current.get('year'),
                    'month': current.get('month'),
                    'date': current.get('date'),
                };
                let start = moment(tasks[id].start).set(date);
                let end = moment(tasks[id].end).set(date);

                if (begin.diff(current) < 0 && current.diff(final) < 0) {
                    if (tasks[id].recurring[current.format('d')]) {
                        con.push({
                            title: tasks[id].title,
                            start: start,
                            end: end,
                        })
                    }
                }
            }
        }
        con = con.filter((e) => (e.end.diff(moment().startOf('day'))) > 0);
        con.sort((a, b) => a.start.diff(b.start));

        let today = [];
        let upcoming = [];
        for (let task of con) {
            if (task.start.diff(moment().endOf('day')) < 0) {
                today.push(task);
            } else {
                upcoming.push(task);
            }
        }

        for (let task of today) {
            addToday(task.start, task.end, task.title);
        }

        for (let task of upcoming) {
            addUpcoming(task.start, task.title);
        }
    });

    database.ref('noti').on('value', (snapshot) => {
        let notis = snapshot.val();
        $notiBody.empty();
        let con = [];
        for (let id in notis) {
            con.push({
                body: notis[id].body,
                moment: moment(notis[id].at),
            });
        }
        con.sort((a, b) => b.moment.diff(a.moment));
        for (let noti of con) {
            addNoti(noti.moment, noti.body);
        }
        if (con.length !== 0) {
            $notiBadge.text(con.length);
        } else {
            $notiBadge.text();
        }
    });
});