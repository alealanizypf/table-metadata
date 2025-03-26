// Función para renderizar la lista de objetos
function renderizarLista(anioSeleccionado, metadataList) {
    var listaObjetos = $('#table-container');
    listaObjetos.empty();

    // Filtrar objetos según el año seleccionado
    var objetosFiltrados = metadataList;
    if (anioSeleccionado !== 'Todos los años') {
        objetosFiltrados = metadataList.filter(item => item.props.anio == anioSeleccionado);
    }

    var tableHeader = $('<div class="table-header"></div>');
    tableHeader.append('<div class="table-header-anio">AÑO</div>');
    tableHeader.append('<div class="table-header-fecha">FECHA DE PAGO</div>');
    tableHeader.append('<div class="table-header-monto">MONTO (PESOS POR ACCIÓN)</div>');
    listaObjetos.append(tableHeader);

    // Renderizar cada objeto
    objetosAniosUnicos = objetosFiltrados.filter(item => objetosFiltrados.filter(obj => obj.props.anio === item.props.anio).length === 1);
    objetosAniosMulti = objetosFiltrados.filter(item => objetosFiltrados.filter(obj => obj.props.anio === item.props.anio).length > 1);
    objetosAniosUnicos.forEach(item => {
        var elemento = $(`<div class="table-filter-row"></div>`);
        elemento.append(`<div class="table-filter-row-anio">${item.props.anio}</div>`);
        elemento.append(`<div class="table-filter-row-fecha">${item.props.fecha}</div>`);
        elemento.append(`<div class="table-filter-row-monto">${item.props.monto}</div>`);
        listaObjetos.append(elemento);
    });
    var aniosUnicosObjetos = [...new Set(objetosAniosMulti.map(obj => obj.props.anio))];
    aniosUnicosObjetos.forEach(anio => {
        const objetosCurrentAnio = objetosAniosMulti.filter(item => item.props.anio === anio);
        let sumaDeMontos = objetosCurrentAnio.map(objeto => parseFloat(objeto.props.monto.replace(',','.'))).reduce((acumulador, monto) => acumulador + monto, 0);
        var downArrow = $(`<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="angle-down" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" class="arrow-${anio} detail-angle-down svg-inline--fa fa-angle-down fa-w-10"><path fill="currentColor" d="M143 352.3L7 216.3c-9.4-9.4-9.4-24.6 0-33.9l22.6-22.6c9.4-9.4 24.6-9.4 33.9 0l96.4 96.4 96.4-96.4c9.4-9.4 24.6-9.4 33.9 0l22.6 22.6c9.4 9.4 9.4 24.6 0 33.9l-136 136c-9.2 9.4-24.4 9.4-33.8 0z" class=""></path></svg>`);
        var upArrow = $(`<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="angle-up" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" class="arrow-${anio} detail-angle-up svg-inline--fa fa-angle-up fa-w-10"><path fill="currentColor" d="M177 159.7l136 136c9.4 9.4 9.4 24.6 0 33.9l-22.6 22.6c-9.4 9.4-24.6 9.4-33.9 0L160 255.9l-96.4 96.4c-9.4 9.4-24.6 9.4-33.9 0L7 329.7c-9.4-9.4-9.4-24.6 0-33.9l136-136c9.4-9.5 24.6-9.5 34-.1z" class=""></path></svg>`);
        upArrow.hide();
         
        var elemento = $(`<a class="table-filter-row-parent"></a>`);
        elemento.append(`<div class="table-filter-row-anio">${anio}</div>`);
        elemento.append(`<div class="table-filter-row-fecha"></div>`);
        var celdaMonto = $(`<div class="table-filter-row-monto"><span class="texto">${sumaDeMontos.toFixed(2).toString().replace('.', ',')}</span></div>`);
        celdaMonto.append(downArrow);
        celdaMonto.append(upArrow);
        elemento.append(celdaMonto);
        elemento.click (function () {
            $(`.row-child-${anio}`).toggle();
            $(`.arrow-${anio}`).toggle();
        });
        listaObjetos.append(elemento);
        objetosCurrentAnio.forEach(item => {
            var childElement = $(`<div class="table-filter-row-white row-child-${anio}"></div>`);
            childElement.append(`<div class="table-filter-row-anio">${item.props.anio}</div>`);
            childElement.append(`<div class="table-filter-row-fecha">${item.props.fecha}</div>`);
            childElement.append(`<div class="table-filter-row-monto">${item.props.monto}</div>`);
            childElement.hide();
            listaObjetos.append(childElement);
        })
    });
}
function createTable() {
    const metadataLocal = JSON.parse(sessionStorage.getItem('ylite.metadataLocal.inversores'));
    if (metadataLocal) {
        const metadataList = metadataLocal.find(item => item.title === window.pageMetadataTable).data
        console.log(metadataList);
        var selected = $('.custom-select .selected');
        var options = $('.custom-select .options');
        var anioActual = new Date().getFullYear();

        // Obtener años únicos y llenar el select
        var aniosUnicos = [...new Set(metadataList.map(obj => obj.props.anio))];
        options.append('<div class="item" data-value="Todos los años">Todos los años</div>');
        aniosUnicos.sort().reverse().forEach(anio => {
            var item = $(`<div class="item" data-value="${anio}">${anio}</div>`);
            options.append(item);
        });
        selected.text('Todos los años');

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
        renderizarLista('Todos los años', metadataList);

    } else {
        setTimeout(() => {
            createTable();
        }, 200);
    }
}
createTable();
