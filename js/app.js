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

