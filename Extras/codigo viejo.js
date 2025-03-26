document.addEventListener("DOMContentLoaded", function () {
   let metadataLocal = null;
   // Función para crear la tabla
   function crearTablaEmisiones(data) {
     // Obtenemos todas las claves posibles de props para las columnas
     const columnasSet = new Set();
     data.forEach((item) => {
       Object.keys(item.props).forEach((key) => columnasSet.add(key));
     });
     const columnas = Array.from(columnasSet);
     //  columnas.push("Descargas");
 
     // Creamos la estructura de la tabla
     const tabla = document.createElement("table");
 
     // Creamos el encabezado
     const thead = document.createElement("thead");
     const headerRow = document.createElement("tr");
 
     // Agregamos las columnas principales
     columnas.forEach((columna) => {
       const th = document.createElement("th");
       // th.className = "vtl-thead-th main-table__header"
       th.textContent = columna.toUpperCase();
 
       // const divColumn = document.createElement("div");
       // divColumn.className = "vtl-thead-column";
       // th.appendChild(divColumn);
 
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
       tr.className = "fila-principal";
       tr.dataset.id = item.text
         .replace(/\s+/g, "-")
         .replace(/\*|\(|\)/g, "")
         .toLowerCase();
 
       // Agregamos las celdas para cada columna
       columnas.forEach((columna) => {
         const td = document.createElement("td");
 
         // Si es la columna de Descargas, agregamos el botón
         if (columna === "Descargas") {
           const expandBtn = document.createElement("button");
           //delete
           expandBtn.innerHTML = "+";
           expandBtn.className = "expand-btn";
           expandBtn.onclick = function (e) {
             e.stopPropagation(); // Evitar que el click se propague a la fila
             // toggleFilasHijas(tr.dataset.id);
             // this.textContent = this.textContent === "+" ? "-" : "+";
           };
           td.appendChild(expandBtn);
         } else {
           td.textContent = item.props[columna] || "";
         }
 
         tr.appendChild(td);
       });
 
       // Hacemos que toda la fila sea clickeable
       tr.onclick = function () {
         toggleFilasHijas(this.dataset.id)
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
               .toLowerCase()} oculto`;
 
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
             link.className = "main-table__link main-table__cell";
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
       fila.classList.toggle("oculto");
     });
   }
 
   // Crear la tabla y añadirla al contenedor
   function generarTabla(tableId) {
     const contenedor = document.getElementById(tableId);
     if (contenedor) {
       let idMetadata =
         tableId == "emisionesInternacionales"
           ? "Emisiones Internacionales"
           : "Inversores - Emisiones Locales";
 
       const jsonData = metadataLocal.find(
         (element) => element.title == idMetadata
       );
 
       if (jsonData) {
         const tabla = crearTablaEmisiones(jsonData.data);
         contenedor.appendChild(tabla);
       }
     }
   }
   async function initialize() {
     metadataLocal = JSON.parse(
       sessionStorage.getItem("ylite.metadataLocal.inversores")
     );
 
     if (metadataLocal) {
       generarTabla("emisionesInternacionales");
       generarTabla("emisionesLocales");
     } else {
       setTimeout(() => {
         initialize();
       }, 200);
     }
   }
   initialize();
 });
 