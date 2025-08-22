// Função para calcular custo mensal dado o percentual reservado
// Entrada:
// qntInstancias = número de instâncias
// precoHora = preço on-demand por hora
// desconto = desconto percentual nas reservadas
// custoAdiantado = custo upfront por instância reservada
// pctReservado = percentual de instâncias reservadas (0 a 100)
// Assume 730 horas por mês
function calculaCustoMensal(qntInstancias, precoHora, desconto, custoAdiantado, pctReservado) {
    const horasMes = 730;
    const nReservadas = (pctReservado/100) * qntInstancias;
    const nOnDemand = qntInstancias - nReservadas;
  
    const precoHoraReservada = precoHora * (1 - desconto/100);
  
    const custoUpfrontMensal = (custoAdiantado ? custoAdiantado : 0) / 12;
  
    const custoReservadas = nReservadas * (precoHoraReservada * horasMes + custoUpfrontMensal);
  
    const custoOnDemand = nOnDemand * precoHora * horasMes;
  
    const custoTotal = custoReservadas + custoOnDemand;
  
    return custoTotal;
  }
  
  document.getElementById('form-calc').addEventListener('submit', function(e) {
    e.preventDefault();
  
    const qntInstancias = parseFloat(document.getElementById('qntInstancias').value);
    const precoHora = parseFloat(document.getElementById('precoHora').value);
    const desconto = parseFloat(document.getElementById('desconto').value);
    const custoAdiantado = parseFloat(document.getElementById('custoAdiantado').value) || 0;
    const pctReservado = parseFloat(document.getElementById('pctReservado').value);
  
    const custoBaseline = calculaCustoMensal(qntInstancias, precoHora, desconto, custoAdiantado, 0);
  
    const percentuais = [50, 80, 100];
    if (pctReservado >= 0 && !percentuais.includes(pctReservado)) {
      percentuais.push(pctReservado);
    }
  
    percentuais.sort((a,b) => a-b);
  
    const tbody = document.getElementById('resultado-tbody');
    tbody.innerHTML = '';
  
    percentuais.forEach(pct => {
      const custo = calculaCustoMensal(qntInstancias, precoHora, desconto, custoAdiantado, pct);
      const economiaAbs = custoBaseline - custo;
      const economiaPerc = (economiaAbs / custoBaseline) * 100;
  
      const custoFormat = custo.toLocaleString('pt-BR', {style:'currency', currency:'BRL'});
      const economiaAbsFormat = economiaAbs.toLocaleString('pt-BR', {style:'currency', currency:'BRL'});
      const economiaPercFormat = economiaPerc.toFixed(2) + '%';
  
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${pct}%</td>
        <td>${custoFormat}</td>
        <td>${economiaAbsFormat}</td>
        <td>${economiaPerc >= 0 ? economiaPercFormat : '0.00%'}</td>
      `;
      tbody.appendChild(tr);
    });
  
    document.getElementById('resultados').style.display = 'block';
  });
  