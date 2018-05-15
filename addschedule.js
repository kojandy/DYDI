$(() => {
    const $form = $('#add_form');
    const database = firebase.database();

    $form.on('submit', (e) => {
        e.preventDefault();
        const data = {};

        $.map($form.serializeArray(), (n, i) => {
            if (data[n['name']] === undefined) {
                data[n['name']] = '';
            }
            data[n['name']] += n['value'];
        });

        const task = {
            title: data.title,
            start: data.start_date + 'T' + data.start_time,
            end: data.end_date + 'T' + data.end_time,
            group: data.group,
            recurring: false,
        };

        if (data.repeat !== undefined) {
            const recurring = {};
            for (let i = 0; i < 7; ++i) {
                if (data.repeat.indexOf(i) === -1) {
                    recurring[i] = false;
                } else {
                    recurring[i] = true;
                }
            }
            task.recurring = recurring;
        }

        database.ref('task').push(task);

        if (data.noti_body !== '') {
            database.ref('noti').push({
                body: data.noti_body,
                at: task.start,
            });
        }
    });
    $('#add_reset').click(() => {
        for (let i = 0; i < 7; ++i) {
            const $elem = $('#add_' + i);
            $elem.prop('checked', false);
            $elem.parent().removeClass('active');
        }
    });
});