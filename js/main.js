let table;
window.onload = async function() {
    await loadLocations();
    table = $('#data').DataTable();

    $('.allRam').change(function() {
        if ($(this).is(":checked")) {
            $('.checkboxRam').attr("checked", true);
        } else {
            $('.checkboxRam').attr("checked", false);
        }
    });
};

async function loadLocations() {
    const url = "http://localhost:8080/location";
    const response = await fetch(url);
    const responseJson = await response.json();

    const locationSelect = $('#location');
    responseJson.data.map((location) => {
        const option = `<option value="${location.name}">${location.name}</option>`;
        locationSelect.append(option);
    });
}

async function loadData() {
    table.clear().draw();
    $('.loading').show();
    const storageText = {
        1: "0GB",            
        2: "250GB",
        3: "500GB",
        4: "1TB",
        5: "2TB",
        6: "3TB",
        7: "4TB",
        8: "8TB",
        9: "12TB",
        10: "24TB",
        11: "48TB",
        12: "72TB"
    };

    let rams = [];
    $.each($("input[name='ram']:checked"), function() {
        rams.push($(this).val().replace('GB', ''));
    });


    const storageNumber = $('#storage').val();
    const arrStorageNumber = storageNumber.split(',');
    const storageMin = storageText[arrStorageNumber[0]];
    const storageMax = storageText[arrStorageNumber[1]];
    
    const ram = rams.join(', ');
    const hddType = $('#hdd').val();
    const location = $('#location').val();

    const url = `http://localhost:8080/servers?
                storageMin=${storageMin}&
                storageMax=${storageMax}&
                ram=${ram}&
                hddType=${hddType}&
                location=${location}`;

    const response = await fetch(url);
    const responseJson = await response.json();

    const tbody = $('#tbodyServers');
    tbody.empty();
    responseJson.data.map((server) => {
        table.row.add([
            server.model,
            server.ram,
            server.hdd,
            server.location,
            server.price
        ]).draw().node();
    });
    $('.loading').hide();
    $('#data').show();
}
