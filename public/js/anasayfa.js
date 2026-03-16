window.onload = function() {
    fetch('/api/sube-sayisi')
        .then(response => response.json())
        .then(data => {
            document.getElementById('subeSayisi').textContent = data.sube_sayisi;
        })
        .catch(error => {
            console.error('Hata:', error);
            document.getElementById('subeSayisi').textContent = 'Veri alınamadı';
        });

    fetch('/api/musteri-sayisi')
        .then(response => response.json())
        .then(data => {
            document.getElementById('musteriSayisi').textContent = data.musteri_sayisi;
        })
        .catch(error => {
            console.error('Hata:', error);
            document.getElementById('musteriSayisi').textContent = 'Veri alınamadı';
        });

    fetch('/api/satis-sayisi')
        .then(response => response.json())
        .then(data => {
            document.getElementById('satisSayisi').textContent = data.satis_sayisi;
        })
        .catch(error => {
            console.error('Hata:', error);
            document.getElementById('satisSayisi').textContent = 'Veri alınamadı';
        });

    fetch('/api/toplam-gelir')
        .then(response => response.json())
        .then(data => {
            document.getElementById('toplamGelir').textContent = data.toplam_gelir;
        })
        .catch(error => {
            console.error('Hata:', error);
            document.getElementById('toplamGelir').textContent = 'Veri alınamadı';
        });

    fetch('/api/brut-kar')
        .then(response => response.json())
        .then(data => {
            document.getElementById('brutKar').textContent = data.brut_kar;
        })
        .catch(error => {
            console.error('Hata:', error);
            document.getElementById('brutKar').textContent = 'Veri alınamadı';
        });

    const yearSelect = document.getElementById('yearSelect');
    const ctx1 = document.getElementById('chart1').getContext('2d');
    let myChart1;

    function fetchAndRenderChart1(selectedYear) {
        fetch(`/api/sube-gelir?year=${selectedYear}`)
            .then(response => response.json())
            .then(data => {
                const subeAdi = data.map(item => item.sube_adi);
                const subeGelir = data.map(item => item.sube_gelir);

                const data1 = {
                    labels: subeAdi,
                    datasets: [{
                        label: `Gelir (${selectedYear})`,
                        data: subeGelir,
                        backgroundColor: 'rgba(148, 44, 21, 0.2)',
                        borderColor: 'rgba(148, 44, 21, 1)',
                        borderWidth: 1,
                        borderRadius: 10,
                    }]
                };
                const config1 = {
                    type: 'bar',
                    data: data1,
                    options: {
                        responsive: true,
                        plugins: {
                            legend: { position: 'top' },
                            title: {
                                display: true,
                                text: `Şube-Gelir (${selectedYear})`
                            }
                        },
                        scales: {
                            y: { beginAtZero: true }
                        }
                    }
                };

                if (myChart1) {
                    myChart1.destroy();
                }
                myChart1 = new Chart(ctx1, config1);
            })
            .catch(error => console.error('Hata:', error));
    }

    const ctx2 = document.getElementById('chart2').getContext('2d');
    let myChart2;

    function fetchAndRenderChart2(selectedYear) {
        fetch(`/api/sube-brut?year=${selectedYear}`)
            .then(response => response.json())
            .then(data => {
                const subeAdi = data.map(item => item.sube_adi);
                const subeBrut = data.map(item => item.sube_brut);

                const data2 = {
                    labels: subeAdi,
                    datasets: [{
                        label: `Brüt Kâr (${selectedYear})`,
                        data: subeBrut,
                        backgroundColor: 'rgba(148, 44, 21, 0.2)',
                        borderColor: 'rgba(148, 44, 21, 1)',
                        borderWidth: 1,
                        borderRadius: 10,
                    }]
                };

                const config2 = {
                    type: 'bar',
                    data: data2,
                    options: {
                        responsive: true,
                        plugins: {
                            legend: { position: 'top' },
                            title: {
                                display: true,
                                text: `Şube-Brüt Kâr (${selectedYear})`
                            }
                        },
                        scales: {
                            y: { beginAtZero: true }
                        }
                    }
                };

                if (myChart2) {
                    myChart2.destroy();
                }
                myChart2 = new Chart(ctx2, config2);
            })
            .catch(error => console.error('Hata:', error));
    }

    fetchAndRenderChart1(yearSelect.value);
    fetchAndRenderChart2(yearSelect.value);

    yearSelect.addEventListener('change', () => {
        const selectedYear = yearSelect.value;
        fetchAndRenderChart1(selectedYear);
        fetchAndRenderChart2(selectedYear);
    });

    const ctx3 = document.getElementById('chart3').getContext('2d');
    let myChart3;

    function fetchAndRenderChart3(selectedYear) {
        fetch(`/api/satislar?year=${selectedYear}`)
            .then(response => response.json())
            .then(data => {
                const ay = data.map(item => item.aylar);
                const satis = data.map(item => item.satislar);

                const data3 = {
                    labels: ay,
                    datasets: [{
                        label: `Satış Miktarı (${selectedYear})`,
                        data: satis,
                        backgroundColor: 'rgba(148, 44, 21, 0.2)',
                        borderColor: 'rgba(148, 44, 21, 1)',
                        borderWidth: 1,
                    }]
                };

                const config3 = {
                    type: 'line',
                    data: data3,
                    options: {
                        responsive: true,
                        plugins: {
                            legend: { position: 'top' },
                            title: {
                                display: true,
                                text: `İşletme Genelinde Aylık Satış Miktarları (${selectedYear})`
                            }
                        },
                        scales: {
                            y: { beginAtZero: true }
                        }
                    }
                };

                if (myChart3) {
                    myChart3.destroy();
                }
                myChart3 = new Chart(ctx3, config3);
            })
            .catch(error => console.error('Hata (Grafik 3):', error));
    }

    const ctx4 = document.getElementById('chart4').getContext('2d');
    let myChart4;

    function fetchAndRenderChart4(selectedYear) {
        fetch(`/api/gelirler?year=${selectedYear}`)
            .then(response => response.json())
            .then(data => {
                const ay = data.map(item => item.aylar);
                const gelir = data.map(item => item.gelirler);

                const data4 = {
                    labels: ay,
                    datasets: [{
                        label: `Satış Geliri (${selectedYear})`,
                        data: gelir,
                        backgroundColor: 'rgba(148, 44, 21, 0.2)',
                        borderColor: 'rgba(148, 44, 21, 1)',
                        borderWidth: 1,
                    }]
                };

                const config4 = {
                    type: 'line',
                    data: data4,
                    options: {
                        responsive: true,
                        plugins: {
                            legend: { position: 'top' },
                            title: {
                                display: true,
                                text: `İşletme Genelinde Aylık Satış Gelirleri (${selectedYear})`
                            }
                        },
                        scales: {
                            y: { beginAtZero: true }
                        }
                    }
                };

                if (myChart4) {
                    myChart4.destroy();
                }
                myChart4 = new Chart(ctx4, config4);
            })
            .catch(error => console.error('Hata (Grafik 4):', error));
    }

    fetchAndRenderChart3(yearSelect.value);
    fetchAndRenderChart4(yearSelect.value);

    yearSelect.addEventListener('change', () => {
        const selectedYear = yearSelect.value;
        fetchAndRenderChart3(selectedYear);
        fetchAndRenderChart4(selectedYear);
    });
}