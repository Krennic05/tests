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
                <td>${p.paciente_nombre}</td>
                <td>${p.paciente_rut}</td>
                <td>${p.cirugia}</td>
                <td>${p.medico}</td>
                <td>${p.prevision}</td>
            `;

            tbody.appendChild(tr);
        });
    })
    .catch(error => {
        console.error(error);
        alert("Error al cargar protocolos");
    });
