fetch("/api/usuario/protocolos")
    .then(res => res.json())
    .then(protocolos => {
        const tbody = document.querySelector("#tablaProtocolos tbody");

        if (protocolos.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7">No hay protocolos registrados</td>
                </tr>
            `;
            return;
        }

        protocolos.forEach(p => {
            const tr = document.createElement("tr");

            tr.innerHTML = `
                <td>${p.id}</td>
                <td>${p.fecha}</td>
                <td>${p.nombrePaciente}</td>
                <td>${p.rutPaciente}</td>
                <td>${p.nombreCirugia}</td>
                <td>${p.nombreMedico}</td>
                <td>${p.prevision}</td>
            `;

            tbody.appendChild(tr);
        });
    })
    .catch(error => {
        console.error(error);
        alert("Error al cargar protocolos");
    });
