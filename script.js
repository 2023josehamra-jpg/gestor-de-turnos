document.addEventListener('DOMContentLoaded', () => {
    const turnoForm = document.getElementById('turnoForm');
    const horaSelect = document.getElementById('hora');
    const fechaInput = document.getElementById('fecha');
    const listaTurnos = document.getElementById('listaTurnos');

    const turnosArr = []; // Array para almacenar los turnos temporalmente

    // Configurar fecha mínima (hoy)
    const hoy = new Date().toISOString().split('T')[0];
    fechaInput.setAttribute('min', hoy);

    // Generar horarios cada 30 min (8:00 a 17:30)
    function generarHorarios() {
        for (let hora = 8; hora < 18; hora++) {
            for (let min = 0; min < 60; min += 30) {
                const horaStr = `${hora.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
                const option = document.createElement('option');
                option.value = horaStr;
                option.textContent = horaStr;
                horaSelect.appendChild(option);
            }
        }
    }
    generarHorarios();

    turnoForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const nombre = document.getElementById('nombre').value;
        const dni = document.getElementById('dni').value;
        const especialidad = document.getElementById('especialidad').value;
        const fecha = fechaInput.value;
        const hora = horaSelect.value;

        // Verificar disponibilidad: mismo horario en la misma fecha
        const existeTurno = turnosArr.some(turno => turno.fecha === fecha && turno.hora === hora);

        if (existeTurno) {
            alert('Error: Ya existe un turno agendado para esta fecha y horario.');
            return;
        }

        // Guardar turno
        const nuevoTurno = { id: Date.now(), nombre, dni, especialidad, fecha, hora };
        turnosArr.push(nuevoTurno);
        actualizarPanel();
        turnoForm.reset();
        fechaInput.setAttribute('min', hoy); // Reajustar min tras reset
    });

    function actualizarPanel() {
        listaTurnos.innerHTML = ''; // Limpiar panel

        turnosArr.forEach(turno => {
            const card = document.createElement('div');
            card.classList.add('turno-card');
            card.innerHTML = `
                <div>
                    <strong>${turno.nombre}</strong> (DNI: ${turno.dni})<br>
                    <small>${turno.especialidad} - ${turno.fecha} ${turno.hora}</small>
                </div>
                <button class="btn-eliminar" onclick="eliminarTurno(${turno.id})">Eliminar</button>
            `;
            listaTurnos.appendChild(card);
        });
    }

    // Definir la función eliminarTurno globalmente para el onclick
    window.eliminarTurno = (id) => {
        const indice = turnosArr.findIndex(turno => turno.id === id);
        if (indice !== -1) {
            turnosArr.splice(indice, 1);
            actualizarPanel();
        }
    };
});
