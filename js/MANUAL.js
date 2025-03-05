function calcularTrapecioManual(a, b, n, func, xValues) {
  const f = new Function('x', `return ${func}`);
  let sum = 0;
  let resultados = [];

  for (let i = 0; i < xValues.length; i++) {
    const x = xValues[i];
    const fx = f(x);
    const peso_fx = (i === 0 || i === xValues.length - 1) ? fx : 2 * fx;
    sum += peso_fx;
    resultados.push({ i, x, fx, peso_fx });
  }

  const h = (b - a) / n;
  const integral = (h / 2) * sum;
  return { integral, resultados, h };
}

function calcularSimpsonManual(a, b, n, func, xValues) {
  if (n % 2 !== 0) {
    throw new Error("El número de intervalos (n) debe ser par para el método de Simpson.");
  }

  const f = new Function('x', `return ${func}`);
  let sum = 0;
  let resultados = [];

  for (let i = 0; i < xValues.length; i++) {
    const x = xValues[i];
    const fx = f(x);
    let peso_fx;
    if (i === 0 || i === xValues.length - 1) {
      peso_fx = fx;
    } else if (i % 2 === 0) {
      peso_fx = 2 * fx;
    } else {
      peso_fx = 4 * fx;
    }
    sum += peso_fx;
    resultados.push({ i, x, fx, peso_fx });
  }

  const h = (b - a) / n;
  const integral = (h / 3) * sum;
  return { integral, resultados, h };
}

function calcularManual() {
  let a = document.getElementById('a').value;
  let b = document.getElementById('b').value;
  const n = parseInt(document.getElementById('n').value);
  const func = document.getElementById('func').value;
  const method = document.getElementById('method').value;
  const xValues = document.getElementById('xValues').value.split(',').map(Number);

  // Replace 'PI' with Math.PI
  a = a.replace(/PI/g, Math.PI);
  b = b.replace(/PI/g, Math.PI);

  a = parseFloat(a);
  b = parseFloat(b);

  let result;
  if (method === 'trapecio') {
    result = calcularTrapecioManual(a, b, n, func, xValues);
  } else if (method === 'simpson') {
    result = calcularSimpsonManual(a, b, n, func, xValues);
  }

  document.getElementById('resultado').innerText = result.integral.toFixed(6);

  // Mostrar datos de entrada
  document.getElementById('datos').innerHTML = `
        <p><strong>a:</strong> ${a}</p>
        <p><strong>b:</strong> ${b}</p>
        <p><strong>n:</strong> ${n}</p>
        <p><strong>h:</strong> ${result.h.toFixed(6)}</p>
    `;

  // Mostrar resultados en una tabla
  let tabla = '<table class="min-w-full divide-y divide-gray-200"><thead><tr><th>i</th><th>x_i</th><th>f(x_i)</th><th>Peso * f(x_i)</th></tr></thead><tbody>';
  result.resultados.forEach(row => {
    tabla += `<tr><td>${row.i}</td><td>${row.x.toFixed(2)}</td><td>${row.fx.toFixed(6)}</td><td>${row.peso_fx.toFixed(6)}</td></tr>`;
  });
  tabla += '</tbody></table>';
  document.getElementById('tablaResultados').innerHTML = tabla;

  // Graficar las coordenadas usando Plotly
  const yValues = result.resultados.map(row => row.fx);

  const trace = {
    x: xValues,
    y: yValues,
    mode: 'lines+markers',
    type: 'scatter'
  };

  const layout = {
    title: 'Gráfico de f(x)',
    xaxis: {
      title: 'x'
    },
    yaxis: {
      title: 'f(x)'
    }
  };

  Plotly.newPlot('myPlot', [trace], layout);
}
