function extraerDatosTabla() {
   let filas = document.querySelectorAll(".vtl-tbody-tr");
   let jsonData = [];
   let currentEntry = null;
   
   filas.forEach(fila => {
       let columnas = fila.querySelectorAll("td");
       if (columnas.length === 0) return;
       
       let firstColText = columnas[0].innerText.trim();
       let lastColLink = columnas[columnas.length - 1].querySelector("a");
       let linkUrl = lastColLink ? lastColLink.href : null;
       
       let props = {};
       let headers = ["Bono", "FechaEmisión", "Vencimiento", "MontoVigente", "MercadoDeCotizacion", "Estado"];
       
       columnas.forEach((columna, index) => {
           if (index < headers.length) {
               props[headers[index]] = columna.innerText.trim();
           }
       });
       
       if (linkUrl) {
           if (currentEntry) {
               currentEntry.children.push({ 
                  text: firstColText,
                  
                     props: {
                        url: linkUrl ,
                        alt: "Descargar documento",
                        target: "Nueva"
                     },
                     type: "link"
                   
               });
           }
       } else {
           if (currentEntry) {
               jsonData.push(currentEntry);
           }
           currentEntry = { text: firstColText, props: props, children: [],type:"Emisiones", };
       }
   });
   
   if (currentEntry) {
       jsonData.push(currentEntry);
   }
   
   console.log(JSON.stringify(jsonData, null, 4));
   return jsonData;
}

// Llamar a la función para extraer los datos
extraerDatosTabla();
