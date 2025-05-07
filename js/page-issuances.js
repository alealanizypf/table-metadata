document.addEventListener("DOMContentLoaded", function () {
  let metadataLocal = null;
  let filtersValues = {};

  // Función para crear la tabla
  function generateTableMetadata(data, _columns, id) {
    const columns = JSON.parse(_columns).filter((colProp) => {
      if (colProp.type == "extra") return true;
      if (colProp.type != "extra")
        return data.some((item) => item.props.hasOwnProperty(colProp.prop));
    });

    // Creamos la estructura de la tabla
    const tabla = document.createElement("table");
    tabla.id = "table-metadata-" + id;
    // Creamos el encabezado
    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");

    // Agregamos las columnas principales
    columns.forEach((columna) => {
      const th = document.createElement("th");
      th.textContent = columna.label;
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
      //verificacion de clase destacada
      if (item.props.type === "destacada") {
        tr.classList.add("destacada");
      }
      tr.dataset.id = item.text
        .replace(/\s+/g, "-")
        .replace(/\*|\(|\)/g, "")
        .toLowerCase();

      // Agregamos las celdas para cada columna
      columns.forEach((columna) => {
         const td = document.createElement("td");
     
         // Si es la columna de extra, agregamos el botón
         if (columna.type === "extra") {  // Cambiado == por ===
             const expandBtn = document.createElement("button");
             expandBtn.className =
                 "metadata-table__group-collapsable metadata-table__group-collapsable--default";
             
             // Solo agregar el SVG y la clase si tiene hijos
             if (item.children && item.children.length > 0) {
                 expandBtn.innerHTML = `<span><svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="angle-down" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" class="detail-angle-down svg-inline--fa fa-angle-down fa-w-10"><path fill="currentColor" d="M143 352.3L7 216.3c-9.4-9.4-9.4-24.6 0-33.9l22.6-22.6c9.4-9.4 24.6-9.4 33.9 0l96.4 96.4 96.4-96.4c9.4-9.4 24.6-9.4 33.9 0l22.6 22.6c9.4 9.4 9.4 24.6 0 33.9l-136 136c-9.2 9.4-24.4 9.4-33.8 0z" class=""></path></svg></span>`;
                 tr.classList.add("metadata-table__row--group-parent-no-empty");
             }
             td.appendChild(expandBtn);
         } else if (columna.type === "mail") {
             td.innerHTML = `<a href="mailto:${item.props[columna.prop]}">${
                 item.props[columna.prop]
             }</a>`;
         } else {
             td.textContent = item.props[columna.prop] || "";
         }
     
         tr.appendChild(td);
     });

      tbody.appendChild(tr);

      if (item.children && item.children.length > 0) {
        // Hacemos que toda la fila sea clickeable
        tr.onclick = function () {
          toggleFilasHijas(this.dataset.id);
          this.children[this.children.length - 1]
            .querySelector("span")
            ?.classList.toggle("rotate");
        };

        //creacion de filas hijas
        item.children.forEach((child) => {
          if (child.type === "link") {
            const trChild = document.createElement("tr");
            trChild.className = `fila-hijo ${item.text
              .replace(/\s+/g, "-")
              .replace(/\*|\(|\)/g, "")
              .toLowerCase()} hidden metadata-table__row--group metadata-table__row--group-child`;

            const tdText = document.createElement("td");
            tdText.colSpan = columns.length - 1;
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
            link.textContent = "Download";

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

  // Función para mostrar/ocultar filas hijas en la tabla
  function toggleFilasHijas(id) {
    const filasHijas = document.querySelectorAll(`.${id}`);
    filasHijas.forEach((fila) => {
      fila.classList.toggle("hidden");
    });
  }

  function generateCards(data, id) {
    const container = document.createElement("div");
    container.id = "card-metadata-" + id;
    container.className = "mt-cards__container";

    data.forEach((item, index) => {
      // Crear tarjeta principal
      const card = document.createElement("div");
      card.className = "mt-cards__card metadata-cards__row";

      const groupId = `group-${Math.random().toString(36).substr(2, 9)}`;
      card.classList.add(
        "metadata-cards__row--group",
        `metadata-cards__row--group-${groupId}`,
        "metadata-cards__row--group-parent",
        "mt-cards__card--group-parent"
      );

      // Generar campos
      const fields = [
        { key: "Bond", value: item.props.Bond },
        { key: "Issue Date", value: item.props.IssueDate },
        { key: "Maturity", value: item.props.Maturity },
        { key: "Outstanding Amount", value: item.props.OutstandingAmount },
        { key: "Market", value: item.props.Market },
        { key: "Status", value: item.props.Status },
      ];

      fields.forEach((field) => {
        const fieldDiv = createField(field.key, field.value);
        card.appendChild(fieldDiv);
      });

      // Agregar sección de Downloads
      const downloadField = document.createElement("div");
      downloadField.className = "mt-cards__field";
      downloadField.style.display = "flex";

      const downloadLabel = document.createElement("div");
      downloadLabel.className = "mt-cards__field-label";
      downloadLabel.innerHTML = "<span>DOWNLOADS:</span>";
      downloadField.appendChild(downloadLabel);

      if (item.children && item.children.length > 0) {
        const downloadValue = document.createElement("div");
        downloadValue.className = "mt-cards__field-value";
        downloadValue.innerHTML = `
            <span class="metadata-cards__group-collapsable metadata-cards__group-collapsable--default" data-group="${groupId}">
              <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="angle-down" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" class="detail-angle-down svg-inline--fa fa-angle-down fa-w-10">
                <path fill="currentColor" d="M143 352.3L7 216.3c-9.4-9.4-9.4-24.6 0-33.9l22.6-22.6c9.4-9.4 24.6-9.4 33.9 0l96.4 96.4 96.4-96.4c9.4-9.4 24.6-9.4 33.9 0l22.6 22.6c9.4 9.4 9.4 24.6 0 33.9l-136 136c-9.2 9.4-24.4 9.4-33.8 0z"></path>
              </svg>
            </span>`;

        downloadField.appendChild(downloadValue);
        card.appendChild(downloadField);
      }
      // Crear contenedor para links de descarga
      const linksContainer = document.createElement("div");
      linksContainer.className = `mt-cards__downloads-container mt-cards__downloads-${groupId}`;
      linksContainer.style.display = "none";

      // Agregar links de descarga
      item.children.forEach((child) => {
        if (child.type === "link") {
          const linkDiv = document.createElement("div");
          linkDiv.className = "mt-cards__download-link";
          linkDiv.innerHTML = `<span data-colspan="6" style="" class="metadata-cards__text metadata-cards__cell">${child.text}</span>
              <a href="${child.props.url}" target="${child.props.target}" class="metadata-cards__link">
                Download
              </a>`;
          linksContainer.appendChild(linkDiv);
        }
      });

      card.appendChild(linksContainer);

      container.appendChild(card);
    });

    // Agregar event listeners para los botones de descarga
    container.addEventListener("click", (e) => {
      const div = e.target.closest(".mt-cards__card");
      if (div) {
        const button = div.querySelector(".metadata-cards__group-collapsable");
        if (button) {
          const groupId = button.dataset.group;
          const linksContainer = container.querySelector(
            `.mt-cards__downloads-${groupId}`
          );
          const icon = button.querySelector(".detail-angle-down");

          if (linksContainer) {
            const isVisible = linksContainer.style.display === "block";
            linksContainer.style.display = isVisible ? "none" : "block";
            icon.style.transform = isVisible ? "" : "rotate(180deg)";
          }
        }
      }
    });

    return container;
  }

  function createField(label, value) {
    const fieldDiv = document.createElement("div");
    fieldDiv.className = "mt-cards__field";
    fieldDiv.style.display = "flex";

    const labelDiv = document.createElement("div");
    labelDiv.className = "mt-cards__field-label";
    labelDiv.innerHTML = `<span>${label.toUpperCase()}:</span>`;

    const valueDiv = document.createElement("div");
    valueDiv.className = "mt-cards__field-value";
    valueDiv.innerHTML = `<span class="metadata-table__text metadata-table__cell">${
      value || "-"
    }</span>`;

    fieldDiv.appendChild(labelDiv);
    fieldDiv.appendChild(valueDiv);

    return fieldDiv;
  }

  //Seccion de filtros de datos
  function generateFilterHtml(jsonData, container, idMetadata) {
    const filtersProp = JSON.parse(container.dataset.filters);

    // Create filters map in a single pass through the data
    const filtersMap = filtersProp.reduce((acc, { prop }) => {
      acc[prop] = new Set(["Todos"]);
      return acc;
    }, {});

    // Populate unique values
    jsonData.forEach((dataItem) => {
      filtersProp.forEach(({ prop }) => {
        if (dataItem.props[prop] != null) {
          filtersMap[prop].add(dataItem.props[prop]);
        }
      });
    });

    // Generate HTML for filters
    return Object.entries(filtersMap)
      .map(
        ([prop, values]) => `
         <div class="scroll-wrapper" id="wrapperFilter_${idMetadata}_${prop}">
            <p>${prop}</p>
            <button class="scroll-button scroll-left" aria-label="Scroll left">←</button>
            <button class="scroll-button scroll-right" aria-label="Scroll right">→</button>
            <div class="scroll-container">
               ${Array.from(values)
                 .map(
                   (value) => `<button class="filter-button">${value}</button>`
                 )
                 .join("")}
            </div>
         </div>
      `
      )
      .join("");
  }

  function filterData(filter, value) {
    const [_, idMetadata, filterKey] = filter.split("_");
    filtersValues[filterKey] = value;

    // Cache de selectores DOM
    const containers = document.querySelectorAll(
      `[data-metadata="${idMetadata}"]`
    );

    // Encontrar los datos
    const jsonData = metadataLocal.find(
      (element) => element.title === idMetadata
    );
    if (!jsonData) return; // Early return si no hay datos

    // Filtrar datos
    const filteredData = jsonData.data.filter((item) =>
      Object.entries(filtersValues).every(
        ([key, filterValue]) =>
          filterValue === "Todos" || item.props[key] === filterValue
      )
    );

    // Actualizar DOM
    containers.forEach((container) => {
      const columns = container.dataset.props;

      // Usar DocumentFragment para mejor rendimiento
      const fragment = document.createDocumentFragment();
      let newElement;

      if (container.className === "metadata-table") {
        newElement = generateTableMetadata(filteredData, columns, idMetadata);
      } else if (container.className === "metadata-cards") {
        newElement = generateCards(filteredData, idMetadata);
      }

      if (newElement) {
        fragment.appendChild(newElement);

        // Usar replaceChild en lugar de remove + append
        const oldElement = container.lastElementChild;
        if (oldElement) {
          container.replaceChild(fragment, oldElement);
        } else {
          container.appendChild(fragment);
        }
      }
    });
  }

  function addClickToScrollButtons() {
    // Cantidad de píxeles a desplazar
    const scrollAmount = 200;

    // Manejar cada conjunto de botones de manera independiente
    document.querySelectorAll(".scroll-wrapper").forEach((wrapper) => {
      wrapper.querySelectorAll(".filter-button").forEach((button) => {
        button.addEventListener("click", (event) => {
          wrapper.querySelectorAll(".filter-button").forEach((btn) => {
            btn.classList.remove("active");
          });
          button.classList.add("active");
          filterData(wrapper.id, event.target.innerHTML);
        });
      });
      const scrollContainer = wrapper.querySelector(".scroll-container");
      const leftButton = wrapper.querySelector(".scroll-left");
      const rightButton = wrapper.querySelector(".scroll-right");

      leftButton.addEventListener("click", () => {
        scrollContainer.scrollBy({
          left: -scrollAmount,
          behavior: "smooth",
        });
      });

      rightButton.addEventListener("click", () => {
        scrollContainer.scrollBy({
          left: scrollAmount,
          behavior: "smooth",
        });
      });

      // Actualizar visibilidad de botones para este contenedor
      const updateButtonsVisibility = () => {
        const { scrollLeft, scrollWidth, clientWidth } = scrollContainer;
        leftButton.style.display = scrollLeft > 0 ? "flex" : "none";
        rightButton.style.display =
          scrollLeft < scrollWidth - clientWidth ? "flex" : "none";
      };

      // Agregar listeners para este contenedor específico
      scrollContainer.addEventListener("scroll", updateButtonsVisibility);
      window.addEventListener("resize", () => updateButtonsVisibility());

      // // Inicializar estado de los botones
      // updateButtonsVisibility();
    });
  }

  function generateHtml() {
    const containers = document.querySelectorAll("[data-metadata]");
    containers.forEach((container) => {
      const idMetadata = container.dataset.metadata;
      const columns = container.dataset.props;
      const jsonData = metadataLocal.find(
        (element) => element.title == idMetadata
      );

      if (jsonData) {
        let element = null;
        container.innerHTML = "";
        if (container.className == "metadata-table")
          element = generateTableMetadata(jsonData.data, columns, idMetadata);
        if (container.className == "metadata-cards")
          element = generateCards(jsonData.data, idMetadata);

        //toda esta seccion es si se agregan filtros de datos
        if (container.dataset.filters != undefined) {
          container.innerHTML = generateFilterHtml(
            jsonData.data,
            container,
            idMetadata
          );

          addClickToScrollButtons();
        }
        container.appendChild(element);
      }
    });
  }

  async function initialize() {
    metadataLocal = JSON.parse(
      sessionStorage.getItem("ylite.metadataLocal.Investors")
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
