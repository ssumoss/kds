window.onload = function () {
    ////////////////////////GRAFİK1///////////////////
    fetch('/api/sube-satis')
        .then(response => {
            if (!response.ok) throw new Error('API isteği başarısız oldu!');
            return response.json();
        })
        .then(data => {
            const sube = data.map(item => item.sube_adi);
            const satis_yuzdesi = data.map(item => item.satis_yuzdesi);
            const grf1 = document.getElementById('grafik1').getContext('2d');

            const veri1 = {
                labels: sube,
                datasets: [{
                    label: 'Satış Yüzdesi',
                    data: satis_yuzdesi,
                    backgroundColor: [
                        '#BA5E4A', '#8c3623', '#BD7C6E', '#813524',
                        '#D6573B', '#D49789', '#7A1A05', '#AB3A22', '#B66B5B', '#7C2A18'
                    ],
                    borderWidth: 1,
                }]
            };

            const con1 = {
                type: 'pie',
                data: veri1,
                options: {
                    plugins: {
                        legend: {
                            onHover: handleHover,
                            onLeave: handleLeave
                        },
                        title: {
                            display: true,
                            text: 'Şube Satış Yüzdeleri'
                        }
                    }
                }
            };

            new Chart(grf1, con1);
        })
        .catch(error => {
            console.error('Hata oluştu:', error);
        });

    function handleHover(event, legendItem) { }
    function handleLeave(event, legendItem) { }

    ///////////////////////////GRAFİK2/////////////////////////////////
    fetch('/api/gelir-oran')
        .then(response => {
            if (!response.ok) throw new Error('API isteği başarısız oldu!');
            return response.json();
        })
        .then(data => {
            const sube = data.map(item => item.sube_adi);
            const gelir_yuzdesi = data.map(item => item.gelir_yuzdesi);
            const grf2 = document.getElementById('grafik2').getContext('2d');

            const veri2 = {
                labels: sube,
                datasets: [{
                    label: 'Gelir Yüzdesi',
                    data: gelir_yuzdesi,
                    backgroundColor: [
                        '#BA5E4A', '#8c3623', '#BD7C6E', '#813524',
                        '#D6573B', '#D49789', '#7A1A05', '#AB3A22', '#B66B5B', '#7C2A18'
                    ],
                    borderWidth: 1,
                }]
            };

            const con2 = {
                type: 'pie',
                data: veri2,
                options: {
                    plugins: {
                        legend: {
                            onHover: handleHover,
                            onLeave: handleLeave
                        },
                        title: {
                            display: true,
                            text: 'Şube Gelir Yüzdeleri'
                        }
                    }
                }
            };

            new Chart(grf2, con2);
        })
        .catch(error => {
            console.error('Hata oluştu:', error);
        });

    /////////////////////////GRAFİK 3///////////////////////
    const yearSelect = document.getElementById('yearSelect');
    const grf3 = document.getElementById('grafik3').getContext('2d');
    let grafigim3;

    function fetchAndRenderChart3(selectedYear) {
        fetch(`/api/besiktas?year=${selectedYear}`)
            .then(response => response.json())
            .then(data => {
                const aySatis = data.map(item => item.aylar);
                const satisMiktari = data.map(item => item.satislar);
                const veri3 = {
                    labels: aySatis,
                    datasets: [{
                        label: `Satış Miktarı ${selectedYear}`,
                        data: satisMiktari,
                        backgroundColor: 'rgba(148, 44, 21, 0.2)',
                        borderColor: 'rgba(148, 44, 21, 1)',
                        borderWidth: 1,
                    }]
                };

                const con3 = {
                    type: 'line',
                    data: veri3,
                    options: {
                        responsive: true,
                        plugins: {
                            legend: { position: 'top' },
                            title: {
                                display: true,
                                text: `Beşiktaş Şubesi Aylık Satış Miktarları (${selectedYear})`
                            }
                        },
                        scales: { y: { beginAtZero: true } }
                    }
                };
                if (grafigim3) grafigim3.destroy();
                grafigim3 = new Chart(grf3, con3);
            })
            .catch(error => console.log('Hata:', error))
    }

    /////////////////////////GRAFİK 4///////////////////////
    const grf4 = document.getElementById('grafik4').getContext('2d');
    let grafigim4;

    function fetchAndRenderChart4(selectedYear) {
        fetch(`/api/beykoz?year=${selectedYear}`)
            .then(response => response.json())
            .then(data => {
                const aySatis = data.map(item => item.aylar);
                const satisMiktari = data.map(item => item.satislar);
                const veri4 = {
                    labels: aySatis,
                    datasets: [{
                        label: `Satış Miktarı ${selectedYear}`,
                        data: satisMiktari,
                        backgroundColor: 'rgba(148, 44, 21, 0.2)',
                        borderColor: 'rgba(148, 44, 21, 1)',
                        borderWidth: 1,
                    }]
                };

                const con4 = {
                    type: 'line',
                    data: veri4,
                    options: {
                        responsive: true,
                        plugins: {
                            legend: { position: 'top' },
                            title: {
                                display: true,
                                text: `Beykoz Şubesi Aylık Satış Miktarları (${selectedYear})`
                            }
                        },
                        scales: { y: { beginAtZero: true } }
                    }
                };
                if (grafigim4) grafigim4.destroy();
                grafigim4 = new Chart(grf4, con4);
            })
            .catch(error => console.log('hata:', error));
    }

    /////////////////////////GRAFİK 5///////////////////////
    const grf5 = document.getElementById('grafik5').getContext('2d');
    let grafigim5;

    function fetchAndRenderChart5(selectedYear) {
        fetch(`/api/kadikoy?year=${selectedYear}`)
            .then(response => response.json())
            .then(data => {
                const aySatis = data.map(item => item.aylar);
                const satisMiktari = data.map(item => item.satislar);
                const veri5 = {
                    labels: aySatis,
                    datasets: [{
                        label: `Satış Miktarı ${selectedYear}`,
                        data: satisMiktari,
                        backgroundColor: 'rgba(148, 44, 21, 0.2)',
                        borderColor: 'rgba(148, 44, 21, 1)',
                        borderWidth: 1,
                    }]
                };

                const con5 = {
                    type: 'line',
                    data: veri5,
                    options: {
                        responsive: true,
                        plugins: {
                            legend: { position: 'top' },
                            title: {
                                display: true,
                                text: `Kadıköy Şubesi Aylık Satış Miktarları (${selectedYear})`
                            }
                        },
                        scales: { y: { beginAtZero: true } }
                    }
                };
                if (grafigim5) grafigim5.destroy();
                grafigim5 = new Chart(grf5, con5);
            })
            .catch(error => console.log('hata:', error));
    }

    /////////////////////////GRAFİK 6///////////////////////
    const grf6 = document.getElementById('grafik6').getContext('2d');
    let grafigim6;

    function fetchAndRenderChart6(selectedYear) {
        fetch(`/api/pendik?year=${selectedYear}`)
            .then(response => response.json())
            .then(data => {
                const aySatis = data.map(item => item.aylar);
                const satisMiktari = data.map(item => item.satislar);
                const veri6 = {
                    labels: aySatis,
                    datasets: [{
                        label: `Satış Miktarı ${selectedYear}`,
                        data: satisMiktari,
                        backgroundColor: 'rgba(148, 44, 21, 0.2)',
                        borderColor: 'rgba(148, 44, 21, 1)',
                        borderWidth: 1,
                    }]
                };

                const con6 = {
                    type: 'line',
                    data: veri6,
                    options: {
                        responsive: true,
                        plugins: {
                            legend: { position: 'top' },
                            title: {
                                display: true,
                                text: `Pendik Şubesi Aylık Satış Miktarları (${selectedYear})`
                            }
                        },
                        scales: { y: { beginAtZero: true } }
                    }
                };
                if (grafigim6) grafigim6.destroy();
                grafigim6 = new Chart(grf6, con6);
            })
            .catch(error => console.log('hata:', error));
    }

    /////////////////////////GRAFİK 7///////////////////////
    const grf7 = document.getElementById('grafik7').getContext('2d');
    let grafigim7;

    function fetchAndRenderChart7(selectedYear) {
        fetch(`/api/sisli?year=${selectedYear}`)
            .then(response => response.json())
            .then(data => {
                const aySatis = data.map(item => item.aylar);
                const satisMiktari = data.map(item => item.satislar);
                const veri7 = {
                    labels: aySatis,
                    datasets: [{
                        label: `Satış Miktarı ${selectedYear}`,
                        data: satisMiktari,
                        backgroundColor: 'rgba(148, 44, 21, 0.2)',
                        borderColor: 'rgba(148, 44, 21, 1)',
                        borderWidth: 1,
                    }]
                };

                const con7 = {
                    type: 'line',
                    data: veri7,
                    options: {
                        responsive: true,
                        plugins: {
                            legend: { position: 'top' },
                            title: {
                                display: true,
                                text: `Şişli Şubesi Aylık Satış Miktarları (${selectedYear})`
                            }
                        },
                        scales: { y: { beginAtZero: true } }
                    }
                };
                if (grafigim7) grafigim7.destroy();
                grafigim7 = new Chart(grf7, con7);
            })
            .catch(error => console.log('hata:', error));
    }

    /////////////////////////GRAFİK 8///////////////////////
    const grf8 = document.getElementById('grafik8').getContext('2d');
    let grafigim8;

    function fetchAndRenderChart8(selectedYear) {
        fetch(`/api/uskudar?year=${selectedYear}`)
            .then(response => response.json())
            .then(data => {
                const aySatis = data.map(item => item.aylar);
                const satisMiktari = data.map(item => item.satislar);
                const veri8 = {
                    labels: aySatis,
                    datasets: [{
                        label: `Satış Miktarı ${selectedYear}`,
                        data: satisMiktari,
                        backgroundColor: 'rgba(148, 44, 21, 0.2)',
                        borderColor: 'rgba(148, 44, 21, 1)',
                        borderWidth: 1,
                    }]
                };

                const con8 = {
                    type: 'line',
                    data: veri8,
                    options: {
                        responsive: true,
                        plugins: {
                            legend: { position: 'top' },
                            title: {
                                display: true,
                                text: `Üsküdar Şubesi Aylık Satış Miktarları (${selectedYear})`
                            }
                        },
                        scales: { y: { beginAtZero: true } }
                    }
                };
                if (grafigim8) grafigim8.destroy();
                grafigim8 = new Chart(grf8, con8);
            })
            .catch(error => console.log('hata:', error));
    }

    /////////////////////////GRAFİK 9///////////////////////
    const grf9 = document.getElementById('grafik9').getContext('2d');
    let grafigim9;

    function fetchAndRenderChart9(selectedYear) {
        fetch(`/api/esenyurt?year=${selectedYear}`)
            .then(response => response.json())
            .then(data => {
                const aySatis = data.map(item => item.aylar);
                const satisMiktari = data.map(item => item.satislar);
                const veri9 = {
                    labels: aySatis,
                    datasets: [{
                        label: `Satış Miktarı ${selectedYear}`,
                        data: satisMiktari,
                        backgroundColor: 'rgba(148, 44, 21, 0.2)',
                        borderColor: 'rgba(148, 44, 21, 1)',
                        borderWidth: 1,
                    }]
                };

                const con9 = {
                    type: 'line',
                    data: veri9,
                    options: {
                        responsive: true,
                        plugins: {
                            legend: { position: 'top' },
                            title: {
                                display: true,
                                text: `Esenyurt Şubesi Aylık Satış Miktarları (${selectedYear})`
                            }
                        },
                        scales: { y: { beginAtZero: true } }
                    }
                };
                if (grafigim9) grafigim9.destroy();
                grafigim9 = new Chart(grf9, con9);
            })
            .catch(error => console.log('hata:', error));
    }

    /////////////////////////GRAFİK 10///////////////////////
    const grf10 = document.getElementById('grafik10').getContext('2d');
    let grafigim10;

    function fetchAndRenderChart10(selectedYear) {
        fetch(`/api/fatih?year=${selectedYear}`)
            .then(response => response.json())
            .then(data => {
                const aySatis = data.map(item => item.aylar);
                const satisMiktari = data.map(item => item.satislar);
                const veri10 = {
                    labels: aySatis,
                    datasets: [{
                        label: `Satış Miktarı ${selectedYear}`,
                        data: satisMiktari,
                        backgroundColor: 'rgba(148, 44, 21, 0.2)',
                        borderColor: 'rgba(148, 44, 21, 1)',
                        borderWidth: 1,
                    }]
                };

                const con10 = {
                    type: 'line',
                    data: veri10,
                    options: {
                        responsive: true,
                        plugins: {
                            legend: { position: 'top' },
                            title: {
                                display: true,
                                text: `Fatih Şubesi Aylık Satış Miktarları (${selectedYear})`
                            }
                        },
                        scales: { y: { beginAtZero: true } }
                    }
                };
                if (grafigim10) grafigim10.destroy();
                grafigim10 = new Chart(grf10, con10);
            })
            .catch(error => console.log('hata:', error));
    }

    /////////////////////////GRAFİK 11///////////////////////
    const grf11 = document.getElementById('grafik11').getContext('2d');
    let grafigim11;

    function fetchAndRenderChart11(selectedYear) {
        fetch(`/api/buyukcekmece?year=${selectedYear}`)
            .then(response => response.json())
            .then(data => {
                const aySatis = data.map(item => item.aylar);
                const satisMiktari = data.map(item => item.satislar);
                const veri11 = {
                    labels: aySatis,
                    datasets: [{
                        label: `Satış Miktarı ${selectedYear}`,
                        data: satisMiktari,
                        backgroundColor: 'rgba(148, 44, 21, 0.2)',
                        borderColor: 'rgba(148, 44, 21, 1)',
                        borderWidth: 1,
                    }]
                };

                const con11 = {
                    type: 'line',
                    data: veri11,
                    options: {
                        responsive: true,
                        plugins: {
                            legend: { position: 'top' },
                            title: {
                                display: true,
                                text: `Büyükçekmece Şubesi Aylık Satış Miktarları (${selectedYear})`
                            }
                        },
                        scales: { y: { beginAtZero: true } }
                    }
                };
                if (grafigim11) grafigim11.destroy();
                grafigim11 = new Chart(grf11, con11);
            })
            .catch(error => console.log('hata:', error));
    }

    /////////////////////////GRAFİK 12///////////////////////
    const grf12 = document.getElementById('grafik12').getContext('2d');
    let grafigim12;

    function fetchAndRenderChart12(selectedYear) {
        fetch(`/api/beyoglu?year=${selectedYear}`)
            .then(response => response.json())
            .then(data => {
                const aySatis = data.map(item => item.aylar);
                const satisMiktari = data.map(item => item.satislar);
                const veri12 = {
                    labels: aySatis,
                    datasets: [{
                        label: `Satış Miktarı ${selectedYear}`,
                        data: satisMiktari,
                        backgroundColor: 'rgba(148, 44, 21, 0.2)',
                        borderColor: 'rgba(148, 44, 21, 1)',
                        borderWidth: 1,
                    }]
                };

                const con12 = {
                    type: 'line',
                    data: veri12,
                    options: {
                        responsive: true,
                        plugins: {
                            legend: { position: 'top' },
                            title: {
                                display: true,
                                text: `Beyoğlu Şubesi Aylık Satış Miktarları (${selectedYear})`
                            }
                        },
                        scales: { y: { beginAtZero: true } }
                    }
                };
                if (grafigim12) grafigim12.destroy();
                grafigim12 = new Chart(grf12, con12);
            })
            .catch(error => console.log('hata:', error));
    }

    fetchAndRenderChart3(yearSelect.value);
    fetchAndRenderChart4(yearSelect.value);
    fetchAndRenderChart5(yearSelect.value);
    fetchAndRenderChart6(yearSelect.value);
    fetchAndRenderChart7(yearSelect.value);
    fetchAndRenderChart8(yearSelect.value);
    fetchAndRenderChart9(yearSelect.value);
    fetchAndRenderChart10(yearSelect.value);
    fetchAndRenderChart11(yearSelect.value);
    fetchAndRenderChart12(yearSelect.value);

    yearSelect.addEventListener('change', () => {
        const selectedYear = yearSelect.value;
        fetchAndRenderChart3(selectedYear);
        fetchAndRenderChart4(selectedYear);
        fetchAndRenderChart5(selectedYear);
        fetchAndRenderChart6(selectedYear);
        fetchAndRenderChart7(selectedYear);
        fetchAndRenderChart8(selectedYear);
        fetchAndRenderChart9(selectedYear);
        fetchAndRenderChart10(selectedYear);
        fetchAndRenderChart11(selectedYear);
        fetchAndRenderChart12(selectedYear);
    })
};