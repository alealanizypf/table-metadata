function fixPage() {
    let viewportWidth = window.innerWidth;
    if (viewportWidth <= 761) setResponsive();
    window.addEventListener("resize", function () {
        setResponsive();
    }, true);
}
function setResponsive() {
    const cabecerasTabla1 = document.querySelectorAll(".rating-table .main-table.rating__tabla-1 .main-table__header .vtl-thead-column");
    if (cabecerasTabla1) {
        const viewportWidth = window.innerWidth;
        if (viewportWidth <= 768) {
            const tabla1Header = document.querySelectorAll('.rating__tabla-1-header');
            if (Array.from(tabla1Header).length === 0) {
                const filasTabla2 = Array.from(document.querySelectorAll(".main-table.rating__tabla-2 .mt-cards__container .main-table__row"))[0];
                const copiaCabeceras = Array.from(cabecerasTabla1).map( cabecera => cabecera.cloneNode(true));
                copiaCabeceras.forEach((cabecera, index) => {
                    cabecera.classList.remove('vtl-thead-column');
                    cabecera.classList.add('rating__tabla-1-header');
                    cabecera.classList.add('rating__tabla-1-header-' + index );
                    filasTabla2.appendChild(cabecera);
                });
            }
        } else {
            document.querySelectorAll(".rating__tabla-1-header").forEach(el => el.remove());
        }
    }
}

// elsewhere in code
fixPage();