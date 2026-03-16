window.onload = function() {
    ///////////GRAFİK 1//////////////////////
    const yearSelect = document.getElementById('yearSelect');
    const ct1 = document.getElementById('grfk1').getContext('2d');
    let grfgm1;

    function fetchAndRenderChart1(selectedYear) {
        fetch(`/api/urun-satis?year=${selectedYear}`)
            .then(response => response.json())
            .then(data => {
                const urun = data.map(item => item.urun_adi);
                const miktar = data.map(item => item.urun_satisi);
                const dta1 = {
                    labels: urun,
                    datasets: [{
                        label: `Satış Miktarı ${selectedYear}`,
                        data: miktar,
                        backgroundColor: 'rgba(148, 44, 21, 0.2)',
                        borderColor: 'rgba(148, 44, 21, 1)',
                        borderWidth: 1,
                    }]
                };

                const cnfg1 = {
                    type: 'line',
                    data: dta1,
                    options: {
                        responsive: true,
                        plugins: {
                            legend: { position: 'top' },
                            title: {
                                display: true,
                                text: `Ürünlerin Satış Miktarları (${selectedYear})`
                            }
                        },
                        scales: { y: { beginAtZero: true } }
                    }
                };

                if (grfgm1) grfgm1.destroy();
                grfgm1 = new Chart(ct1, cnfg1);
            })
            .catch(error => console.log('hata:', error));
    }

    ///////////GRAFİK 2//////////////////////
    const ct2 = document.getElementById('grfk2').getContext('2d');
    let grfgm2;

    function fetchAndRenderChart2(selectedYear) {
        fetch(`/api/urun-cesit?year=${selectedYear}`)
            .then(response => response.json())
            .then(data => {
                const urunSayi = data.map(item => item.urun_cesidi);
                const ay = data.map(item => item.aylar);
                const dta2 = {
                    labels: ay,
                    datasets: [{
                        label: `Ürün Çeşit Miktarı ${selectedYear}`,
                        data: urunSayi,
                        backgroundColor: 'rgba(148, 44, 21, 0.2)',
                        borderColor: 'rgba(148, 44, 21, 1)',
                        borderWidth: 1,
                    }]
                };

                const cnfg2 = {
                    type: 'line',
                    data: dta2,
                    options: {
                        responsive: true,
                        plugins: {
                            legend: { position: 'top' },
                            title: {
                                display: true,
                                text: `Aylık Satılan Ürün Çeşitleri (${selectedYear})`
                            }
                        },
                        scales: { y: { beginAtZero: true } }
                    }
                };

                if (grfgm2) grfgm2.destroy();
                grfgm2 = new Chart(ct2, cnfg2);
            })
            .catch(error => console.log('hata:', error));
    }

    //////////GRAFİK 3/////////////////////
    const ct3 = document.getElementById('grfk3').getContext('2d');
    let grfgm3;

    function fetchAndRenderChart3(selectedYear) {
        fetch(`/api/urun-gelir?year=${selectedYear}`)
            .then(response => response.json())
            .then(data => {
                const gelir = data.map(item => item.toplam_gelir);
                const urun = data.map(item => item.urun_adi);
                const dta3 = {
                    labels: urun,
                    datasets: [{
                        label: `Toplam Gelir ${selectedYear}`,
                        data: gelir,
                        backgroundColor: 'rgba(148, 44, 21, 0.2)',
                        borderColor: 'rgba(148, 44, 21, 1)',
                        borderWidth: 1,
                        borderRadius: 10,
                    }]
                };

                const cnfg3 = {
                    type: 'bar',
                    data: dta3,
                    options: {
                        responsive: true,
                        plugins: {
                            legend: { position: 'top' },
                            title: {
                                display: true,
                                text: `Ürünlerin Toplam Gelirleri (${selectedYear})`
                            }
                        },
                        scales: { y: { beginAtZero: true } }
                    }
                };

                if (grfgm3) grfgm3.destroy();
                grfgm3 = new Chart(ct3, cnfg3);
            })
            .catch(error => console.log('hata:', error));
    }

    //////////GRAFİK 4/////////////////////
    const ct4 = document.getElementById('grfk4').getContext('2d');
    let grfgm4;

    function fetchAndRenderChart4(selectedYear) {
        fetch(`/api/urun-maliyet?year=${selectedYear}`)
            .then(response => response.json())
            .then(data => {
                const maliyet = data.map(item => item.toplam_maliyet);
                const urun = data.map(item => item.urun_adi);
                const dta4 = {
                    labels: urun,
                    datasets: [{
                        label: `Toplam Maliyet ${selectedYear}`,
                        data: maliyet,
                        backgroundColor: 'rgba(148, 44, 21, 0.2)',
                        borderColor: 'rgba(148, 44, 21, 1)',
                        borderWidth: 1,
                        borderRadius: 10,
                    }]
                };

                const cnfg4 = {
                    type: 'bar',
                    data: dta4,
                    options: {
                        responsive: true,
                        plugins: {
                            legend: { position: 'top' },
                            title: {
                                display: true,
                                text: `Ürünlerin Toplam Maliyetleri (${selectedYear})`
                            }
                        },
                        scales: { y: { beginAtZero: true } }
                    }
                };

                if (grfgm4) grfgm4.destroy();
                grfgm4 = new Chart(ct4, cnfg4);
            })
            .catch(error => console.log('hata:', error));
    }

    fetchAndRenderChart1(yearSelect.value);
    fetchAndRenderChart2(yearSelect.value);
    fetchAndRenderChart3(yearSelect.value);
    fetchAndRenderChart4(yearSelect.value);

    yearSelect.addEventListener('change', () => {
        const selectedYear = yearSelect.value;
        fetchAndRenderChart1(selectedYear);
        fetchAndRenderChart2(selectedYear);
        fetchAndRenderChart3(selectedYear);
        fetchAndRenderChart4(selectedYear);
    });
};