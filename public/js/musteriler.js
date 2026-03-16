window.onload = function () {
        ////////////////////////GRAFİK1///////////////////
        fetch('/api/musteri-yas')
            .then(response => {
                if (!response.ok) {
                    throw new Error('API isteği başarısız oldu!');
                }
                return response.json();
            })
            .then(data => {
                const yas = data.map(item => item.yas_araligi);
                const yas_yuzdesi = data.map(item => item.yuzde);
                const grf1 = document.getElementById('grafik1').getContext('2d');

                const veri1 = {
                    labels: yas,
                    datasets: [{
                        label: 'Yaş Yüzdesi',
                        data: yas_yuzdesi,
                        backgroundColor: [
                            '#BA5E4A', '#8c3623', '#BD7C6E', '#813524',
                            '#D6573B', '#D49789', '#7A1A05'
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
                                text: 'Müşteri Yaş Yüzdeleri'
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

        /////////////////GRAFİK 2/////////////////
        fetch('/api/musteri-cinsiyet')
            .then(response => {
                if (!response.ok) {
                    throw new Error('API isteği başarısız oldu!');
                }
                return response.json();
            })
            .then(data => {
                const cinsiyet = data.map(item => item.cinsiyet_adi);
                const cinsiyet_yuzdesi = data.map(item => item.yuzde);
                const grf2 = document.getElementById('grafik2').getContext('2d');

                const veri2 = {
                    labels: cinsiyet,
                    datasets: [{
                        label: 'Cinsiyet Yüzdesi',
                        data: cinsiyet_yuzdesi,
                        backgroundColor: [
                            '#BA5E4A', '#7A1A05'
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
                                text: 'Müşteri Cinsiyet Yüzdeleri'
                            }
                        }
                    }
                };

                new Chart(grf2, con2);
            })
            .catch(error => {
                console.error('Hata oluştu:', error);
            });

        /////////////////GRAFİK 3/////////////////// 
        fetch('/api/sevilen-urun')
            .then(response => response.json())
            .then(data => {
                const urun = data.map(item => item.urun_adi);
                const miktar = data.map(item => item.satis_adedi);
                const grf3 = document.getElementById('grafik3').getContext('2d');

                const veri3 = {
                    labels: urun,
                    datasets: [{
                        label: 'Satış Miktarı',
                        data: miktar,
                        backgroundColor: 'rgba(148, 44, 21, 0.2)',
                        borderColor: 'rgba(148, 44, 21, 1)',
                        borderWidth: 1,
                        borderRadius: 10,
                    }]
                };

                const con3 = {
                    type: 'bar',
                    data: veri3,
                    options: {
                        responsive: true,
                        plugins: {
                            legend: {
                                position: 'top',
                            },
                            title: {
                                display: true,
                                text: 'En Çok Tercih Edilen 5 Ürün'
                            }
                        }
                    }
                };
                new Chart(grf3, con3);
            });

        /////////////////GRAFİK 4/////////////////// 
        fetch('/api/sevilmeyen-urun')
            .then(response => response.json())
            .then(data => {
                const urun = data.map(item => item.urun_adi);
                const miktar = data.map(item => item.satis_adedi);
                const grf4 = document.getElementById('grafik4').getContext('2d');

                const veri4 = {
                    labels: urun,
                    datasets: [{
                        label: 'Satış Miktarı',
                        data: miktar,
                        backgroundColor: 'rgba(148, 44, 21, 0.2)',
                        borderColor: 'rgba(148, 44, 21, 1)',
                        borderWidth: 1,
                        borderRadius: 10,
                    }]
                };

                const con4 = {
                    type: 'bar',
                    data: veri4,
                    options: {
                        responsive: true,
                        plugins: {
                            legend: {
                                position: 'top',
                            },
                            title: {
                                display: true,
                                text: 'En Az Tercih Edilen 5 Ürün'
                            }
                        }
                    }
                };
                new Chart(grf4, con4);
            });
    };