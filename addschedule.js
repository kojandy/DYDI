$(() => {
    const $modal = $("#modal_add_schedule");
    const $form = $('#add_form');
    const $group = $('#add_group');
    const $repeatCheck = $('#add_repeat');
    const database = firebase.database();

    $group.selectize({
        create: true,
        sortField: 'text',
        valueField: 'name',
        labelField: 'name',
        searchField: 'name',
    });

    const selectize = $group[0].selectize;

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

        database.ref('/group').once('value', (snapshot) => {
            const groups = snapshot.val();
            const titles = [];
            for (const id in groups) {
                titles.push(groups[id].title);
            }
            if (!titles.includes(data.group)) {
                database.ref('/group').push({title: data.group, tracked: true});
            }
        });

        $modal.modal('hide');
    });

    $('#add_reset').click(() => {
        for (let i = 0; i < 7; ++i) {
            const $elem = $('#add_' + i);
            $elem.prop('checked', false);
            $elem.parent().removeClass('active');
        }
        selectize.clear();
    });

    $repeatCheck.click(() => {
        const $collapse = $('#repeat_collapse');
        const $collapseDate = $('#add_date');
        const $startDate = $('#add_start_date');
        const $endDate = $('#add_end_date');
        if ($repeatCheck.prop('checked')) {
            $collapse.collapse('show');
            $collapseDate.collapse('hide');
            $startDate.val(moment().format('YYYY-MM-DD'));
            $endDate.val('2999-12-31');
        } else {
            $startDate.val('');
            $endDate.val('');
            $collapse.collapse('hide');
            $collapseDate.collapse('show');
            for (let i = 0; i < 7; ++i) {
                const $elem = $('#add_' + i);
                $elem.prop('checked', false);
                $elem.parent().removeClass('active');
            }
        }
    });

    database.ref('/group').on('value', (snapshot) => {
        const groups = snapshot.val();
        selectize.clearOptions();
        for (const id in groups) {
            selectize.addOption({name: groups[id].title});
        }
        selectize.refreshOptions();
    });
});