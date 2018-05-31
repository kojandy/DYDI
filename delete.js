$(() => {
    const $modal = $("#modal_delete_schedule");
    const $form = $('#delete_form');
    const database = firebase.database();
    var petsRef = database.ref('pets');
    var dummyRef = database.ref('dummy');
    var url;
    var url_list = [];
    var numobj;

    petsRef.on('value', function (snapshot) {
        numobj = snapshot.numChildren();
    })


    $form.on('submit', (e) => {
        e.preventDefault();
        const data = {};
        var gender = "male";

        var sel = document.getElementById("delete");
        var val;
        var del_list = [];

        for (i = 0; i < sel.options.length; i++) {
            if (sel.options[i].selected == true) {
                val = sel.options[i].value;
                del_list.push(val);
                console.log(val);
            }
        }

        petsRef.on('value', function(snapshot) {
            snapshot.forEach(function (childSnapshot) {
                for (i = 0; i < del_list.length; i++) {
                    if (childSnapshot.val().name == del_list[i]) {
                        petsRef.child(childSnapshot.key).remove();
                        window.location.reload();
                    }
                }
            })
        })

        $modal.modal('hide');
    });
});