$(() => {
    let database = firebase.database();
    let $body = $('body');
    let $calendar = $('#timeline_today');
    let $upcomingBody = $('#tl_upcoming');
    let $notiBody = $('#tab_noti');
    let $notiBadge = $('#noti_badge');

    let $modalTitle = $('#modal_title');
    let $modalBtnNN = $('#modal_nn');
    let $modalBtnNY = $('#modal_ny');
    let $modalBtnY = $('#modal_y');

    $calendar.fullCalendar({
        header: false,
        height: 'parent',
        themeSystem: 'bootstrap4',
        defaultView: 'agendaDay',
        nowIndicator: true,
        schedulerLicenseKey: 'CC-Attribution-NonCommercial-NoDerivatives',
        height: 300,
        scrollTime: moment().subtract(1, 'hours').format('HH:mm:ss'),
        eventClick: (event) => {
            let date = event.start.format('Y-MM-DD');

            $modalTitle.text(event.title);
            $modalBtnNN.click(() => {
                database.ref('task/' + event.id + '/status/' + date).set(false);
            });
            $modalBtnNY.click(() => {
                database.ref('task/' + event.id + '/status/' + date).remove();
            });
            $modalBtnY.click(() => {
                database.ref('task/' + event.id + '/status/' + date).set(true);
            });
            $('#modal').modal();
        },
        // allDaySlot: false,
    });

    $('#btn_toggle_nav').click(() => {
        if ($body.hasClass('sidebar-show')) {
            $body.removeClass('sidebar-show');
        } else {
            $body.addClass('sidebar-show');
        }
    });

    const $btnToggleAside = $('#btn_toggle_aside');

    $btnToggleAside.click(() => {
        if ($body.hasClass('aside-menu-show')) {
            $body.removeClass('aside-menu-show');
            $btnToggleAside.html($('<span class="fas fa-outdent" style="color: #777;">'));
        } else {
            $body.addClass('aside-menu-show');
            $btnToggleAside.html($('<span class="fas fa-indent" style="color: #777;">'));
        }
    });

    function addToday(id, start, end, status, title) {
        let event = {
            title: title,
            start: start.format(),
            end: end.format(),
            id: id,
        };

        if (status === 'complete') {
            event.backgroundColor = 'green';
            event.borderColor = 'green';
        } else if (status === 'not yet') {
            event.backgroundColor = 'red';
            event.borderColor = 'red';
        } else if (status === 'not needed') {
            event.backgroundColor = 'grey'
            event.borderColor = 'grey';
        }

        $calendar.fullCalendar('renderEvent', event);
    }

    function addUpcoming(id, start, status, title) {
        let newItem =
            $('<div>')
                .addClass('list-group-item')
                .addClass('list-group-item-divider')
                .append(
                    $('<div class="text-truncate font-weight-bold">').text(title)
                ).append(
                    $('<small class="text-muted">')
                    .append($('<span class="far fa-clock" style="margin-right: 5px;">'))
                    .append(start.format('M/D H:mm'))
                    .append(' ~')
                ).css('cursor', 'pointer').click(() => {
                    let date = start.format('Y-MM-DD');

                    $modalTitle.text(title);
                    $modalBtnNN.click(() => {
                        database.ref('task/' + id + '/status/' + date).set(false);
                    });
                    $modalBtnNY.click(() => {
                        database.ref('task/' + id + '/status/' + date).remove();
                    });
                    $modalBtnY.click(() => {
                        database.ref('task/' + id + '/status/' + date).set(true);
                    });
                    $('#modal').modal();
                });

        if (status === 'complete') {
            newItem.addClass('list-group-item-light');
            newItem.addClass('list-group-item-accent-success');
        } else if (status === 'not yet') {
            newItem.addClass('list-group-item-accent-danger');
        } else if (status === 'not needed') {
            newItem.addClass('list-group-item-light');
            newItem.addClass('list-group-item-accent-secondary');
        }

        $upcomingBody.append(newItem);
    }

    function addNoti(id, at, body) {
        const $body = $('<div>')
                        .addClass('text-truncate')
                        .addClass('font-weight-bold')
                        .attr('data-toggle', 'tooltip')
                        .attr('data-placement', 'bottom')
                        .attr('title', body)
                        .text(body);

        $notiBody.append(
            $('<div class="noti">').append(
                $('<small class="text-muted float-right">').text(at.fromNow())
            ).append($body).css('cursor', 'pointer').click(() => {
                database.ref('noti/' + id).remove();
            })
        ).append($('<hr>'));
        $body.tooltip();
    }

    database.ref('task').on('value', (snapshot) => {
        let tasks = snapshot.val();
        $calendar.fullCalendar('removeEvents');
        $upcomingBody.empty();
        let con = [];
        for (let id in tasks) {
            if (tasks[id].recurring === false) {
                let date = moment(tasks[id].start).format('Y-MM-DD');
                let event = {
                    id: id,
                    title: tasks[id].title,
                    start: moment(tasks[id].start),
                    end: moment(tasks[id].end),
                };

                if (tasks[id].status === undefined) {
                    event.status = 'not yet';
                } else {
                    if (tasks[id].status[date] === undefined) {
                        event.status = 'not yet';
                    } else if (tasks[id].status[date]) {
                        event.status = 'complete';
                    } else {
                        event.status = 'not needed';
                    }
                }
                con.push(event);
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
                        let date = current.format('Y-MM-DD');
                        let event = {
                            id: id,
                            title: tasks[id].title,
                            start: start,
                            end: end,
                        };

                        if (tasks[id].status === undefined) {
                            event.status = 'not yet';
                        } else {
                            if (tasks[id].status[date] === undefined) {
                                event.status = 'not yet';
                            } else if (tasks[id].status[date]) {
                                event.status = 'complete';
                            } else {
                                event.status = 'not needed';
                            }
                        }
                        con.push(event);
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
            addToday(task.id, task.start, task.end, task.status, task.title);
        }

        for (let task of upcoming) {
            addUpcoming(task.id, task.start, task.status, task.title);
        }
    });

    database.ref('noti').on('value', (snapshot) => {
        let notis = snapshot.val();
        $notiBody.empty();
        $('.tooltip').remove();
        let con = [];
        for (let id in notis) {
            con.push({
                id: id,
                body: notis[id].body,
                moment: moment(notis[id].at),
            });
        }
        con = con.filter(noti => (noti.moment.diff(moment()) < 0));
        con.sort((a, b) => b.moment.diff(a.moment));
        for (let noti of con) {
            addNoti(noti.id, noti.moment, noti.body);
        }
        if (con.length !== 0) {
            $notiBadge.text(con.length);
        } else {
            $notiBadge.text('');
        }
    });
});
