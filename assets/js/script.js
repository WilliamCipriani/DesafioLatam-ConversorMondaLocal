let instanciaGrafico = null;

async function convertirMoneda() {
    const cantidad = document.getElementById('cantidad').value;
    const moneda = document.getElementById('moneda').value;
    const divResultado = document.getElementById('resultado');

    if (cantidad === '') {
        divResultado.innerText = 'Por favor, ingresa un monto.';
        return;
    }

    try {
        const respuesta = await fetch('https://mindicador.cl/api/' + moneda);
        if (!respuesta.ok) {
            throw new Error('Network response was not ok');
        }
        const datos = await respuesta.json();
        const tasa = datos.serie[0].valor;
        const montoConvertido = cantidad / tasa;
        divResultado.innerText = `Resultado: $${montoConvertido.toFixed(2)}`;

        if (instanciaGrafico) {
            instanciaGrafico.destroy();
        }

        generarGrafico(datos.serie);

    } catch (error) {
        divResultado.innerText = 'Hubo un problema con la conversión: ' + error.message;
    }
}

function generarGrafico(datos) {
    const ctx = document.getElementById('grafico').getContext('2d');
    const etiquetas = datos.slice(0, 10).map(item => new Date(item.fecha).toLocaleDateString());
    const valores = datos.slice(0, 10).map(item => item.valor);

    instanciaGrafico = new Chart(ctx, {
        type: 'line',
        data: {
            labels: etiquetas,
            datasets: [{
                label: 'Historial últimos 10 días',
                data: valores,
                borderColor: 'rgba(255, 99, 132, 1)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: false
                }
            }
        }
    });
}
