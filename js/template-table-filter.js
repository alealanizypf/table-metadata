
// Función para renderizar la lista de objetos
function renderizarLista(anioSeleccionado, metadataList) {
    var listaObjetos = $('#table-container');
    listaObjetos.empty();

    // Filtrar objetos según el año seleccionado
    var objetosFiltrados = metadataList;
    if (anioSeleccionado !== '') {
        objetosFiltrados = metadataList.filter(item => item.props.anio == anioSeleccionado);
    }

    // Renderizar cada objeto
    objetosFiltrados.forEach(item => {
        if (window.pageMetadataTable === "Inversores - Presentaciones") {
            var elemento = $(`<a href="${item.props.link}" target="_blank" class="table-filter-row"></a>`);
            elemento.append(`<div class="table-filter-row-fecha">${item.props.fecha}</div>`);
            elemento.append(`<div class="table-filter-row-titulo">${item.props.titulo}</div>`);
            elemento.append(`<div class="table-filter-row-link">Descargar</div>`);
        }
        if (window.pageMetadataTable === "Inversores - Asamblea de Accionistas" || window.pageMetadataTable === "Inversores - Código Gobierno Societario") {
            var elemento = $(`<a href="${item.props.link}" target="_blank" class="table-filter-row"></a>`);
            elemento.append(`<div class="table-filter-row-titulo">${item.props.titulo}</div>`);
        }
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
        aniosUnicos.sort().reverse().forEach(anio => {
            var item = $(`<div class="item" data-value="${anio}">${anio}</div>`);
            options.append(item);
        });
        if (!aniosUnicos.includes(anioActual)) {
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
