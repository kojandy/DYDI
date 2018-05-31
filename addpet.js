$(() => {
    const $modal = $("#modal_add_schedule");
    const $form = $('#add_form');
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
        $("#field").empty();
        e.preventDefault();
        const data = {};
        var gender = "male";

        $.map($form.serializeArray(), (n, i) => {
            if (data[n['name']] === undefined) {
                data[n['name']] = '';
            }
            data[n['name']] += n['value'];
        });
        
        if (data.gridRadios == "option2"){
            gender = "female";
        }

        Addfirebase(data.title, data.age, gender)
        function Addfirebase(name, age, gender) {
            var num = Math.floor(Math.random() * 4) + 1;
            var url = "./images/dog"+num+".jpg";
            var newObject = {
                age: age + "years old",
                gender: gender,
                name: name,
                url: url,
            }
            petsRef.child("pet" + numobj + "").set(newObject);
            //window.location.reload();
        }

        $modal.modal('hide');
    });
});