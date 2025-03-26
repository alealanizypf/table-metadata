document.addEventListener("DOMContentLoaded", function () {
  let metadataLocal = null;
  // Función para crear la tabla
  function crearTablaEmisiones(data) {
    // Obtenemos todas las claves posibles de props para las columnas
    const columnasSet = new Set();
    data.forEach((item) => {
      Object.keys(item.props).forEach((key) => columnasSet.add(key));
    });
    columnasSet.add("Descargas");

    const columnas = [];
    columnasSet.forEach((col) => {
      switch (col) {
        case "FechaEmision":
          columnas.push("Fecha de Emisión");
          break;
        case "MontoVigente":
          columnas.push("Monto Vigente");
          break;
        case "MercadoDeCotizacion":
          columnas.push("Mercado de Cotización");
          break;
        default:
          columnas.push(col);
          break;
      }
    });

    // Creamos la estructura de la tabla
    const tabla = document.createElement("table");

    // Creamos el encabezado
    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");

    // Agregamos las columnas principales
    columnas.forEach((columna) => {
      const th = document.createElement("th");
      th.textContent = columna.toUpperCase();
      headerRow.appendChild(th);
    });

    thead.appendChild(headerRow);
    tabla.appendChild(thead);

    // Creamos el cuerpo de la tabla
    const tbody = document.createElement("tbody");

    // Agregamos cada fila de datos
    data.forEach((item) => {
      // Fila principal
      const tr = document.createElement("tr");
      tr.className = "metadata-table__row--group-parent";
      tr.dataset.id = item.text
        .replace(/\s+/g, "-")
        .replace(/\*|\(|\)/g, "")
        .toLowerCase();

      // Agregamos las celdas para cada columna
      console.log("columnasSet", columnasSet);
      console.log("columnas", columnas);
      columnasSet.forEach((columna) => {
        const td = document.createElement("td");

        // Si es la columna de Descargas, agregamos el botón
        if (columna === "Descargas") {
          const expandBtn = document.createElement("button");
          expandBtn.className =
            "metadata-table__group-collapsable metadata-table__group-collapsable--default";
          if (item.children && item.children.length > 0) {
            expandBtn.innerHTML = `<span><svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="angle-down" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" class="detail-angle-down svg-inline--fa fa-angle-down fa-w-10"><path fill="currentColor" d="M143 352.3L7 216.3c-9.4-9.4-9.4-24.6 0-33.9l22.6-22.6c9.4-9.4 24.6-9.4 33.9 0l96.4 96.4 96.4-96.4c9.4-9.4 24.6-9.4 33.9 0l22.6 22.6c9.4 9.4 9.4 24.6 0 33.9l-136 136c-9.2 9.4-24.4 9.4-33.8 0z" class=""></path></svg></span>`;
            tr.classList.add("metadata-table__row--group-parent-no-empty");
          }
          td.appendChild(expandBtn);
        } else {
          td.textContent = item.props[columna] || "";
        }

        tr.appendChild(td);
      });

      // Hacemos que toda la fila sea clickeable
      tr.onclick = function () {
        toggleFilasHijas(this.dataset.id);
        this.children[this.children.length - 1]
          .querySelector("span")
          ?.classList.toggle("rotate");
      };

      tbody.appendChild(tr);

      // Filas hijas (documentos)
      if (item.children && item.children.length > 0) {
        item.children.forEach((child) => {
          if (child.type === "link") {
            const trChild = document.createElement("tr");
            trChild.className = `fila-hijo ${item.text
              .replace(/\s+/g, "-")
              .replace(/\*|\(|\)/g, "")
              .toLowerCase()} hidden metadata-table__row--group metadata-table__row--group-child`;

            const tdText = document.createElement("td");
            tdText.colSpan = columnas.length - 1;
            tdText.innerHTML = `<div><span data-colspan="6">${child.text}</span></div>`;

            // Creamos el enlace
            const tdDocumento = document.createElement("td");
            const link = document.createElement("a");
            link.href = child.props.url;

            link.target = child.props.target === "Nueva" ? "_blank" : "";
            link.onclick = function (e) {
              e.stopPropagation(); // Evitar que el click se propague
            };
            link.className = "metadata-table__link metadata-table__cell";
            link.textContent = "Descargar";

            const divLink = document.createElement("div");
            divLink.appendChild(link);
            tdDocumento.appendChild(divLink);

            trChild.appendChild(tdText);
            trChild.appendChild(tdDocumento);

            tbody.appendChild(trChild);
          }
        });
      }
    });

    tabla.appendChild(tbody);
    return tabla;
  }

  // Función para mostrar/ocultar filas hijas
  function toggleFilasHijas(id) {
    const filasHijas = document.querySelectorAll(`.${id}`);
    filasHijas.forEach((fila) => {
      fila.classList.toggle("hidden");
    });
  }

  function generateCards(data) {
    const container = document.createElement("div");
    //   container.className = 'mt-cards__container';

    data.forEach((item, index) => {
      // Crear tarjeta principal
      const card = document.createElement("div");
      card.className = `mt-cards__card main-table__row main-table__row_index--${index}`;

      if (item.children && item.children.length > 0) {
        card.classList.add(
          "main-table__row--group",
          `main-table__row--group-${item.props.id || generateId()}`,
          "main-table__row--group-parent",
          "mt-cards__card--group-parent"
        );
      }
      
      // Agregar campos
      //TODO: ver esto 
      const fields = [
        "Bono",
        "FechaEmisión",
        "Vencimiento",
        "MontoVigente",
        "MercadoDeCotizacion",
        "Estado",
      ];
      fields.forEach((field) => {
        const fieldDiv = document.createElement("div");
        fieldDiv.className = "mt-cards__field";
        fieldDiv.style.display = "flex";

        const label = document.createElement("div");
        label.className = "mt-cards__field-label";
        label.innerHTML = `<span>${field.toUpperCase()}:</span>`;

        const value = document.createElement("div");
        value.className = "mt-cards__field-value";
        value.innerHTML = `<span class="main-table__text main-table__cell">${
          item.props[field] || "-"
        }</span>`;

        fieldDiv.appendChild(label);
        fieldDiv.appendChild(value);
        card.appendChild(fieldDiv);
      });

      // Agregar botón de descargas si hay children
      if (item.children && item.children.length > 0) {
        const downloadField = document.createElement("div");
        downloadField.className = "mt-cards__field";
        downloadField.style.display = "flex";

        const downloadLabel = document.createElement("div");
        downloadLabel.className = "mt-cards__field-label";
        downloadLabel.innerHTML = "<span>DESCARGAS:</span>";

        const downloadValue = document.createElement("div");
        downloadValue.className = "mt-cards__field-value";
        downloadValue.innerHTML = `
        <button class="main-table__group-collapsable main-table__group-collapsable--default" data-has-event-listener="true">
          <span>
            <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="angle-down" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" class="detail-angle-down svg-inline--fa fa-angle-down fa-w-10">
              <path fill="currentColor" d="M143 352.3L7 216.3c-9.4-9.4-9.4-24.6 0-33.9l22.6-22.6c9.4-9.4 24.6-9.4 33.9 0l96.4 96.4 96.4-96.4c9.4-9.4 24.6-9.4 33.9 0l22.6 22.6c9.4 9.4 9.4 24.6 0 33.9l-136 136c-9.2 9.4-24.4 9.4-33.8 0z"></path>
            </svg>
          </span>
        </button>`;

        downloadField.appendChild(downloadLabel);
        downloadField.appendChild(downloadValue);
        card.appendChild(downloadField);

        // Agregar tarjetas child para las descargas
        item.children.forEach((child, childIndex) => {
          const childCard = document.createElement("div");
          childCard.className = `mt-cards__card main-table__row main-table__row_index--${
            index + childIndex
          } main-table__row--group main-table__row--group-child`;
          childCard.style.display = "none";

          const childField = document.createElement("div");
          childField.className = "mt-cards__field";
          childField.style.display = "flex";

          const childValue = document.createElement("div");
          childValue.className = "mt-cards__field-value";

          if (child.type === "link") {
            childValue.innerHTML = `
            <a href="${child.props.url}" target="${child.props.target}" class="main-table__link">
              ${child.text}
            </a>`;
          } else {
            childValue.innerHTML = `<span>${child.text}</span>`;
          }

          childField.appendChild(childValue);
          childCard.appendChild(childField);
          container.appendChild(childCard);
        });
      }

      container.appendChild(card);
    });

    return container;
  }
  function generateHtml() {
    const containers = document.querySelectorAll("[data-metadata]");
    containers.forEach((container) => {
      const idMetadata = container.dataset.metadata;
      const jsonData = metadataLocal.find(
        (element) => element.title == idMetadata
      );
      if (jsonData) {
        let element = null;
        if (container.className == "metadata-table")
          element = crearTablaEmisiones(jsonData.data);
        if (container.className == "metadata-cards")
          element = generateCards(jsonData.data);

        container.appendChild(element);
      }
    });
  }

  function generateId() {
    return Math.random().toString(36).substr(2, 9);
  }

  async function initialize() {
    metadataLocal = JSON.parse(
      sessionStorage.getItem("ylite.metadataLocal.inversores")
    );

    if (metadataLocal) {
      generateHtml();
    } else {
      setTimeout(() => {
        initialize();
      }, 200);
    }
  }
  initialize();
});
