document.addEventListener('DOMContentLoaded', function () {
    const calculateBtn = document.getElementById('calculateBtn');
    const calculateCustomBtn = document.getElementById('calculateCustomBtn');
    const scenariosContainer = document.getElementById('scenariosContainer');
    const customResult = document.getElementById('customResult');

    // Função para calcular os custos
    function calculateCost(reservedSharePct) {
        // Obter valores dos inputs
        const onDemandHourly = parseFloat(document.getElementById('onDemandHourly').value);
        const reservedDiscountPct = parseFloat(document.getElementById('reservedDiscount').value);
        const instancesTotal = parseInt(document.getElementById('instancesTotal').value);
        const hoursPerMonth = parseInt(document.getElementById('hoursPerMonth').value);
        const reservedUpfrontMonthly = parseFloat(document.getElementById('reservedUpfront').value);

        // Calcular preço reservado por hora
        const priceReservedHourly = onDemandHourly * (1 - reservedDiscountPct / 100);

        // Calcular número de instâncias reservadas e on-demand
        const instReserved = Math.round(instancesTotal * reservedSharePct / 100);
        const instOndemand = instancesTotal - instReserved;

        // Calcular custos
        const costReserved = instReserved * (priceReservedHourly * hoursPerMonth + reservedUpfrontMonthly);
        const costOndemand = instOndemand * (onDemandHourly * hoursPerMonth);
        const costTotal = costReserved + costOndemand;

        // Calcular baseline (100% on-demand)
        const baseline = instancesTotal * onDemandHourly * hoursPerMonth;

        // Calcular economias
        const savingAbs = baseline - costTotal;
        const savingPct = (savingAbs / baseline) * 100;

        return {
            reservedSharePct,
            instReserved,
            instOndemand,
            costReserved,
            costOndemand,
            costTotal,
            baseline,
            savingAbs,
            savingPct
        };
    }

    // Função para formatar valores monetários
    function formatCurrency(value) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    }

    // Função para exibir os cenários
    function displayScenarios() {
        const scenarios = [50, 80, 100];
        scenariosContainer.innerHTML = '';

        scenarios.forEach(percentage => {
            const result = calculateCost(percentage);

            const scenarioCard = document.createElement('div');
            scenarioCard.className = 'scenario-card';
            scenarioCard.innerHTML = `
                        <h3>Cenário ${percentage}% Reservadas</h3>
                        <div class="percentage">${percentage}%</div>
                        <div>Instâncias Reservadas: ${result.instReserved}</div>
                        <div>Instâncias On-Demand: ${result.instOndemand}</div>
                        <div class="cost">Custo Total: ${formatCurrency(result.costTotal)}</div>
                        <div class="saving">Economia: ${formatCurrency(result.savingAbs)}</div>
                        <div class="saving">Economia: ${result.savingPct.toFixed(2)}%</div>
                    `;

            scenariosContainer.appendChild(scenarioCard);
        });
    }

    // Função para exibir o cenário personalizado
    function displayCustomScenario() {
        const customPercentage = parseInt(document.getElementById('customPercentage').value);

        if (isNaN(customPercentage) || customPercentage < 0 || customPercentage > 100) {
            alert('Por favor, insira uma porcentagem válida entre 0 e 100.');
            return;
        }

        const result = calculateCost(customPercentage);

        customResult.innerHTML = `
                    <div class="result-item">
                        <h4>Instâncias Reservadas</h4>
                        <div class="result-value">${result.instReserved}</div>
                    </div>
                    <div class="result-item">
                        <h4>Instâncias On-Demand</h4>
                        <div class="result-value">${result.instOndemand}</div>
                    </div>
                    <div class="result-item">
                        <h4>Custo Total</h4>
                        <div class="result-value">${formatCurrency(result.costTotal)}</div>
                    </div>
                    <div class="result-item">
                        <h4>Economia Absoluta</h4>
                        <div class="result-value positive">${formatCurrency(result.savingAbs)}</div>
                    </div>
                    <div class="result-item">
                        <h4>Economia Percentual</h4>
                        <div class="result-value positive">${result.savingPct.toFixed(2)}%</div>
                    </div>
                `;
    }

    // Event listeners
    calculateBtn.addEventListener('click', displayScenarios);
    calculateCustomBtn.addEventListener('click', displayCustomScenario);

    // Calcular cenários iniciais ao carregar a página
    displayScenarios();
    displayCustomScenario();
});