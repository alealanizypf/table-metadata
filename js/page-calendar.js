// Función para formatear fecha par archivo .ics
function formatoFecha(fecha) {
    return fecha.toISOString().replace(/-|:|\.\d+/g, "");
}
// Función para generar archivo .ics
function generateICS(item) {
    const evento = {
        titulo: item.props.evento,
        descripcion: "",
        ubicacion: item.props.lugar,
        inicio: new Date(item.props['fecha-inicio']),
        fin: new Date(item.props['fecha-fin']),
    };
    const contenidoICS = `BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nSUMMARY:${evento.titulo}\nDESCRIPTION:${evento.descripcion}\nLOCATION:${evento.ubicacion}\nDTSTART:${formatoFecha(evento.inicio)}\nDTEND:${formatoFecha(evento.fin)}\nEND:VEVENT\nEND:VCALENDAR`.trim();
    const blob = new Blob([contenidoICS], { type: "text/calendar" });
    const enlaceDescarga = document.createElement("a");
    enlaceDescarga.href = URL.createObjectURL(blob);
    enlaceDescarga.download = `${evento.titulo}.ics`;
    enlaceDescarga.click();
}
// Función para renderizar la lista de objetos
function renderizarLista(anioSeleccionado, metadataList) {
    var listaObjetos = $('#table-container');
    listaObjetos.empty();

    // Filtrar objetos según el año seleccionado
    var objetosFiltrados = metadataList;
    if (anioSeleccionado !== '') {
        objetosFiltrados = metadataList.filter(item => item.props.anio == anioSeleccionado);
    }

    var tableHeader = $('<div class="table-header"></div>');
    tableHeader.append('<div class="table-header-fecha">FECHA</div>');
    tableHeader.append('<div class="table-header-evento">EVENTO</div>');
    tableHeader.append('<div class="table-header-btn">RECORDATORIO</div>');
    listaObjetos.append(tableHeader);

    // Renderizar cada objeto
    objetosFiltrados.forEach(item => {
        var elemento = $('<div class="table-filter-row"></div>');
        elemento.append(`<div class="table-filter-row-fecha">${item.props.fecha}</div>`);
        elemento.append(`<div class="table-filter-row-titulo">${item.props.evento}</div>`);
        var celdaRecordarme = $('<div class="table-filter-row-recordarme"></div>');
        var celdaLink = $('<a class="table-filter-row-recordarme-link btn">Recordarme</a>');
        celdaLink.click (function () {
            generateICS(item);
        });
        celdaRecordarme.append(celdaLink)
        elemento.append(celdaRecordarme);
        listaObjetos.append(elemento);
    });
}
function createTable() {
    const metadataLocal = JSON.parse(sessionStorage.getItem('ylite.metadataLocal.inversores'));
    if (metadataLocal) {
        const metadataList = metadataLocal.find(item => item.title === window.pageMetadataTable).data
        var selected = $('.custom-select .selected');
        var options = $('.custom-select .options');
        var anioActual = new Date().getFullYear();

        // Obtener años únicos y llenar el select
        var aniosUnicos = [...new Set(metadataList.map(obj => obj.props.anio))];
        console.log('aniosUnicos > ', aniosUnicos)
        aniosUnicos.sort().reverse().forEach(anio => {
            var item = $(`<div class="item" data-value="${anio}">${anio}</div>`);
            options.append(item);
        });
        if (!aniosUnicos.includes(anioActual.toString())) {
            // Si no contiene el año actual, encuentra el año mayor
            anioActual = Math.max(...aniosUnicos.map(Number));
        }
        selected.text(anioActual);

        // Manejar cambios en el select
        options.on('click', '.item', function () {
            var anioSeleccionado = $(this).data('value');
            selected.text(anioSeleccionado);
            renderizarLista(anioSeleccionado, metadataList);
            options.hide();
        });

        // Mostrar y ocultar las opciones al hacer clic en el select
        selected.on('click', function () {
            options.toggle();
        });

        // Ocultar las opciones al hacer clic en cualquier parte fuera del desplegable
        $(document).on('click', function (event) {
            if (!$(event.target).closest('.custom-select').length) {
                options.hide();
            }
        });

        // Inicializar la lista al cargar la página
        renderizarLista(anioActual, metadataList);

    } else {
        setTimeout(() => {
            createTable();
        }, 200);
    }
}
createTable();
