function calcularTrapecio(a, b, n, func) {
  const h = (b - a) / n;
  const f = new Function('x', `return ${func}`);
  let sum = 0;
  let resultados = [];

  for (let i = 0; i <= n; i++) {
    const x = a + i * h;
    const fx = f(x);
    const peso_fx = (i === 0 || i === n) ? fx : 2 * fx;
    sum += peso_fx;
    resultados.push({ i, x, fx, peso_fx });
  }

  const integral = (h / 2) * sum;
  return { integral, resultados, h };
}

function calcularSimpson(a, b, n, func) {
  if (n % 2 !== 0) {
    throw new Error("El número de intervalos (n) debe ser par para el método de Simpson.");
  }

  const h = (b - a) / n;
  let sum = 0;
  let resultados = [];

  for (let i = 0; i <= n; i++) {
    const x = a + i * h;
    const fx = eval(func.replace(/x/g, `(${x})`));
    if (i === 0 || i === n) {
      sum += fx;
      resultados.push({ i, x, fx, peso_fx: fx });
    } else if (i % 2 === 0) {
      sum += 2 * fx;
      resultados.push({ i, x, fx, peso_fx: 2 * fx });
    } else {
      sum += 4 * fx;
      resultados.push({ i, x, fx, peso_fx: 4 * fx });
    }
  }

  const integral = (h / 3) * sum;
  return { integral, resultados, h };
}



function integrateDiskMethod(f, a, b, n) {
  const dx = (b - a) / n;
  let volume = 0;
  let xValues = [];
  let yValues = [];

  for (let i = 0; i < n; i++) {
    const x = a + i * dx;
    const diskArea = Math.PI * Math.pow(f(x), 2);
    volume += diskArea * dx;
    xValues.push(x);
    yValues.push(f(x));
  }

  return { volume, xValues, yValues };
}

function integral(func, a, b, n = 1000) {
  const dx = (b - a) / n;
  let area = 0;
  for (let i = 0; i < n; i++) {
    const x = a + i * dx;
    area += func(x) * dx;
  }
  return area;
}

function calcularArea() {
  const funcF = document.getElementById('funcF').value;
  const funcG = document.getElementById('funcG').value;
  const a = parseFloat(document.getElementById('a').value);
  const b = parseFloat(document.getElementById('b').value);

  const f = new Function('x', `return ${funcF}`);
  const g = new Function('x', `return ${funcG}`);

  const areaUnderCurve = integral(f, a, b);
  const areaBetweenCurves = integral(x => f(x) - g(x), a, b);

  document.getElementById('resultado').innerHTML = `
    <p>Área bajo la curva f(x): ${areaUnderCurve.toFixed(6)}</p>
    <p>Área entre las curvas f(x) y g(x): ${areaBetweenCurves.toFixed(6)}</p>
  `;

  // Graficar las coordenadas usando Plotly
  const xValues = [];
  const yValuesF = [];
  const yValuesG = [];
  const n = 1000;
  const dx = (b - a) / n;

  for (let i = 0; i <= n; i++) {
    const x = a + i * dx;
    xValues.push(x);
    yValuesF.push(f(x));
    yValuesG.push(g(x));
  }

  const traceF = {
    x: xValues,
    y: yValuesF,
    mode: 'lines',
    name: 'f(x)'
  };

  const traceG = {
    x: xValues,
    y: yValuesG,
    mode: 'lines',
    name: 'g(x)'
  };

  const layout = {
    title: 'Gráfico de f(x) y g(x)',
    xaxis: {
      title: 'x'
    },
    yaxis: {
      title: 'y'
    }
  };

  Plotly.newPlot('myPlot', [traceF, traceG], layout);
}

function calcularVolumen() {
  const func = document.getElementById('func').value;
  const a = parseFloat(document.getElementById('a').value);
  const b = parseFloat(document.getElementById('b').value);
  const n = parseInt(document.getElementById('n').value);

  const f = new Function('x', `return ${func}`);
  const result = integrateDiskMethod(f, a, b, n);

  document.getElementById('resultado').innerText = result.volume.toFixed(6);

  // Mostrar datos de entrada
  document.getElementById('datos').innerHTML = `
        <p><strong>a:</strong> ${a}</p>
        <p><strong>b:</strong> ${b}</p>
        <p><strong>n:</strong> ${n}</p>
        <p><strong>dx:</strong> ${(b - a) / n}</p>
    `;

  // Graficar las coordenadas usando Plotly
  const trace = {
    x: result.xValues,
    y: result.yValues,
    mode: 'lines+markers',
    type: 'scatter'
  };

  const coneTrace = {
    x: result.xValues,
    y: result.yValues.map(y => Math.PI * Math.pow(y, 2)),
    mode: 'lines',
    type: 'scatter',
    name: 'Cone'
  };

  const layout = {
    title: 'Gráfico de f(x) y Volumen del Cono',
    xaxis: {
      title: 'x'
    },
    yaxis: {
      title: 'f(x) y Volumen'
    }
  };

  Plotly.newPlot('myPlot', [trace, coneTrace], layout);
}
function calcular() {
  let a = document.getElementById('a').value;
  let b = document.getElementById('b').value;
  const n = parseInt(document.getElementById('n').value);
  const func = document.getElementById('func').value;
  const method = document.getElementById('method').value;

  // Replace 'PI' with Math.PI
  a = a.replace(/PI/g, Math.PI);
  b = b.replace(/PI/g, Math.PI);

  a = parseFloat(a);
  b = parseFloat(b);

  let result;
  if (method === 'trapecio') {
    result = calcularTrapecio(a, b, n, func);
  } else if (method === 'simpson') {
    result = calcularSimpson(a, b, n, func);
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
  const xValues = result.resultados.map(row => row.x);
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
