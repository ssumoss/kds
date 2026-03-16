const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const path = require("path");
const cors = require("cors");

const app = express();
const port = 3000;

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "kds_proje"
});

db.connect((err) => {
    if (err) {
        console.error("MySQL bağlantı hatası:", err);
    } else {
        console.log("MySQL'e başarıyla bağlanıldı!");
    }
});

//MIDDLEWARE
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/html/giris.html'))
});
app.get('/giris.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/html/giris.html'))
});
app.get('/anasayfa.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/html/anasayfa.html'))
});
app.get('/subeler.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/html/subeler.html'))
});
app.get('/urunler.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/html/urunler.html'))
});
app.get('/musteriler.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/html/musteriler.html'))
});
app.get('/tahmin.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/html/tahmin.html'))
});

/////////////////////////////////////GİRİŞ EKRANI////////////////////////////////////////////////
app.post("/login", (req, res) => {
    const { kullanici_adi, sifre } = req.body;

    const query = "SELECT * FROM yonetici WHERE kullanici_adi = ? AND sifre = ?";
    db.query(query, [kullanici_adi, sifre], (err, results) => {
        if (err) {
            console.error("Hata:", err);
            return res.status(500).send("Bir hata oluştu. Lütfen tekrar deneyin.");
        }

        if (results.length > 0) {
            res.redirect("/anasayfa.html");
        } else {
            res.status(401).send("Geçersiz kullanıcı adı veya şifre.");
        }
    });
});
//////////////////////////////////GİRİŞ EKRANI SON////////////////////////////////////////////////

//////////////////////////////////ANASAYFA////////////////////////////////////////////
//TOPLAM ŞUBE SAYISI
app.get('/api/sube-sayisi', (req, res) => {
    const query = `SELECT COUNT(sube_id) AS sube_sayisi 
                   FROM subeler`; 
    db.query(query, (err, results) => {
        if (err) {
            console.error("Hata:", err);
            return res.status(500).send({ message: "Bir hata oluştu." });
        }

        res.json({ sube_sayisi: results[0].sube_sayisi });
    });
});
//TOPLAM MÜŞTERİ SAYİSİ
app.get('/api/musteri-sayisi', (req, res) => {
    const query = `SELECT COUNT(musteri_id) AS musteri_sayisi 
                   FROM musteriler`; 
    db.query(query, (err, results) => {
        if (err) {
            console.error("Hata:", err);
            return res.status(500).send({ message: "Bir hata oluştu." });
        }

        res.json({ musteri_sayisi: results[0].musteri_sayisi });
    });
});
//TOPLAM SATIŞ
app.get('/api/satis-sayisi', (req, res) => {
    const query = `SELECT SUM(satis_adedi) AS satis_sayisi 
                   FROM subeler, satislar 
                   WHERE subeler.sube_id=satislar.sube_id`; 
    db.query(query, (err, results) => {
        if (err) {
            console.error("Hata:", err);
            return res.status(500).send({ message: "Bir hata oluştu." });
        }

        res.json({ satis_sayisi: results[0].satis_sayisi });
    });
});
//GELİR
app.get('/api/toplam-gelir', (req, res) => {
    const query = `
    SELECT 
    SUM(
        CASE 
            WHEN YEAR(satislar.satis_tarihi) = 2024 THEN urunler.fiyat_2024 * satislar.satis_adedi
            WHEN YEAR(satislar.satis_tarihi) = 2023 THEN urunler.fiyat_2023 * satislar.satis_adedi
            WHEN YEAR(satislar.satis_tarihi) = 2022 THEN urunler.fiyat_2022 * satislar.satis_adedi
            WHEN YEAR(satislar.satis_tarihi) = 2021 THEN urunler.fiyat_2021 * satislar.satis_adedi
            WHEN YEAR(satislar.satis_tarihi) = 2020 THEN urunler.fiyat_2020 * satislar.satis_adedi
            ELSE 0
        END
    ) AS toplam_gelir
FROM satislar
JOIN urunler ON urunler.urun_id = satislar.urun_id
WHERE YEAR(satislar.satis_tarihi) IN (2020, 2021, 2022, 2023, 2024);

` 
    db.query(query, (err, results) => {
        if (err) {
            console.error("Hata:", err);
            return res.status(500).send({ message: "Bir hata oluştu." });
        }
        res.json({ toplam_gelir: results[0].toplam_gelir });
    });
});
//BRÜT KAR
app.get('/api/brut-kar', (req, res) => {
    const query = `
    SELECT 
    SUM(
        CASE 
            WHEN YEAR(satislar.satis_tarihi) = 2024 THEN 
                (urunler.fiyat_2024 - urunler.maliyet_2024) * satislar.satis_adedi
            WHEN YEAR(satislar.satis_tarihi) = 2023 THEN 
                (urunler.fiyat_2023 - urunler.maliyet_2023) * satislar.satis_adedi
            WHEN YEAR(satislar.satis_tarihi) = 2022 THEN 
                (urunler.fiyat_2022 - urunler.maliyet_2022) * satislar.satis_adedi
            WHEN YEAR(satislar.satis_tarihi) = 2021 THEN 
                (urunler.fiyat_2021 - urunler.maliyet_2021) * satislar.satis_adedi
            WHEN YEAR(satislar.satis_tarihi) = 2020 THEN 
                (urunler.fiyat_2020 - urunler.maliyet_2020) * satislar.satis_adedi
            ELSE 
                0
        END
    ) AS brut_kar
FROM satislar
JOIN urunler ON urunler.urun_id = satislar.urun_id
WHERE YEAR(satislar.satis_tarihi) IN (2020, 2021, 2022, 2023, 2024);

`; 
    db.query(query, (err, results) => {
        if (err) {
            console.error("Hata:", err);
            return res.status(500).send({ message: "Bir hata oluştu." });
        }

        res.json({ brut_kar: results[0].brut_kar });
    });
});
//GRAFİK1
app.get('/api/sube-gelir', (req, res) => {
    const year = req.query.year || new Date().getFullYear();

    const query = `
        SELECT subeler.sube_adi,
    SUM(
        CASE 
            WHEN YEAR(satislar.satis_tarihi) = 2024 THEN urunler.fiyat_2024 * satislar.satis_adedi
            WHEN YEAR(satislar.satis_tarihi) = 2023 THEN urunler.fiyat_2023 * satislar.satis_adedi
            WHEN YEAR(satislar.satis_tarihi) = 2022 THEN urunler.fiyat_2022 * satislar.satis_adedi
            WHEN YEAR(satislar.satis_tarihi) = 2021 THEN urunler.fiyat_2021 * satislar.satis_adedi
            WHEN YEAR(satislar.satis_tarihi) = 2020 THEN urunler.fiyat_2020 * satislar.satis_adedi
            ELSE 0
        END
    ) AS sube_gelir
        FROM satislar
        JOIN urunler ON urunler.urun_id = satislar.urun_id
        JOIN subeler ON subeler.sube_id = satislar.sube_id
        WHERE YEAR(satislar.satis_tarihi) = ?
        GROUP BY subeler.sube_id;
    `;

    db.query(query, [year], (err, results) => {
        if (err) {
            console.error("Hata:", err);
            return res.status(500).send({ message: "Bir hata oluştu." });
        }
        res.json(results);
    });
});
//GRAFİK 2
app.get('/api/sube-brut', (req, res) => {
    const year = req.query.year || new Date().getFullYear();
    const query = `
        SELECT subeler.sube_adi, 
    SUM(
        CASE 
            WHEN YEAR(satislar.satis_tarihi)=2024 THEN (urunler.fiyat_2024*satislar.satis_adedi)-(urunler.maliyet_2024*satislar.satis_adedi)
            WHEN YEAR(satislar.satis_tarihi)=2023 THEN (urunler.fiyat_2023*satislar.satis_adedi)-(urunler.maliyet_2023*satislar.satis_adedi)
            WHEN YEAR(satislar.satis_tarihi)=2022 THEN (urunler.fiyat_2022*satislar.satis_adedi)-(urunler.maliyet_2022*satislar.satis_adedi)
            WHEN YEAR(satislar.satis_tarihi)=2021 THEN (urunler.fiyat_2021*satislar.satis_adedi)-(urunler.maliyet_2021*satislar.satis_adedi)
            WHEN YEAR(satislar.satis_tarihi)=2020 THEN (urunler.fiyat_2020*satislar.satis_adedi)-(urunler.maliyet_2020*satislar.satis_adedi)
            ELSE 0
        END
    ) AS sube_brut
FROM satislar
JOIN urunler ON urunler.urun_id = satislar.urun_id
JOIN subeler ON subeler.sube_id = satislar.sube_id
WHERE YEAR(satislar.satis_tarihi) = ? 
GROUP BY subeler.sube_id;

    `;
    db.query(query, [year], (err, results) => {
        if (err) {
            console.error("Hata:", err);
            return res.status(500).send({ message: "Bir hata oluştu." });
        }
        res.json(results);
    });
});
//GRAFİK 3
app.get('/api/satislar', (req, res) => {
    const year = req.query.year || new Date().getFullYear();
    const query = `
        SELECT MONTHNAME(satis_tarihi) AS aylar, 
               SUM(satis_adedi) AS satislar
        FROM satislar
        WHERE YEAR(satis_tarihi)=?
        GROUP BY MONTH(satis_tarihi)
        ORDER BY MONTH(satis_tarihi)
    `;
    db.query(query, [year], (err, results) => {
        if (err) {
            console.error("Hata:", err);
            return res.status(500).send({ message: "Bir hata oluştu." });
        }
        res.json(results);
    });
});
//GRAFİK 4
app.get('/api/gelirler', (req, res) => {
    const year = req.query.year || new Date().getFullYear();
    const query = `
        SELECT MONTHNAME(satislar.satis_tarihi) AS aylar, 
    SUM(
        CASE 
            WHEN YEAR(satislar.satis_tarihi) = 2024 THEN urunler.fiyat_2024 * satislar.satis_adedi
            WHEN YEAR(satislar.satis_tarihi) = 2023 THEN urunler.fiyat_2023 * satislar.satis_adedi
            WHEN YEAR(satislar.satis_tarihi) = 2022 THEN urunler.fiyat_2022 * satislar.satis_adedi
            WHEN YEAR(satislar.satis_tarihi) = 2021 THEN urunler.fiyat_2021 * satislar.satis_adedi
            WHEN YEAR(satislar.satis_tarihi) = 2020 THEN urunler.fiyat_2020 * satislar.satis_adedi
            ELSE 0
        END
    ) AS gelirler
FROM satislar
JOIN urunler ON urunler.urun_id = satislar.urun_id
WHERE YEAR(satislar.satis_tarihi) = ?
GROUP BY MONTH(satislar.satis_tarihi)
ORDER BY MONTH(satislar.satis_tarihi);
    `;
    db.query(query, [year], (err, results) => {
        if (err) {
            console.error("Hata:", err);
            return res.status(500).send({ message: "Bir hata oluştu." });
        }
        res.json(results);
    });
});

////////////////////////////////////////ANASAYFA SON//////////////////////////////////////////////////

////////////////////////////////////////ŞUBELER////////////////////////////////////////////
//GRAFİK1
app.get('/api/sube-satis', (req, res) => {
    const query = `
        SELECT subeler.sube_id, subeler.sube_adi, 
        ROUND((SUM(satislar.satis_adedi)/(SELECT SUM(satislar.satis_adedi) AS sube_satis 
                                          FROM subeler, satislar 
                                          WHERE subeler.sube_id=satislar.sube_id)*100),2) AS satis_yuzdesi
        FROM satislar, subeler
        WHERE subeler.sube_id=satislar.sube_id
        GROUP BY subeler.sube_adi
    `;
    db.query(query, (err, results) => {
        if (err) {
            console.error("Hata:", err);
            return res.status(500).send({ message: "Bir hata oluştu." });
        }
        res.json(results);
    });
});
//GRAFİK2
app.get('/api/gelir-oran', (req, res) => {
    const query = `
        SELECT subeler.sube_id, subeler.sube_adi, 
    ROUND(
        (
            SUM(
                CASE 
                    WHEN YEAR(satislar.satis_tarihi) = 2024 THEN urunler.fiyat_2024 * satislar.satis_adedi
                    WHEN YEAR(satislar.satis_tarihi) = 2023 THEN urunler.fiyat_2023 * satislar.satis_adedi
                    WHEN YEAR(satislar.satis_tarihi) = 2022 THEN urunler.fiyat_2022 * satislar.satis_adedi
                    WHEN YEAR(satislar.satis_tarihi) = 2021 THEN urunler.fiyat_2021 * satislar.satis_adedi
                    WHEN YEAR(satislar.satis_tarihi) = 2020 THEN urunler.fiyat_2020 * satislar.satis_adedi
                    ELSE 0
                END
            )
            / (
                SELECT SUM(
                    CASE 
                        WHEN YEAR(satislar.satis_tarihi) = 2024 THEN urunler.fiyat_2024 * satislar.satis_adedi
                        WHEN YEAR(satislar.satis_tarihi) = 2023 THEN urunler.fiyat_2023 * satislar.satis_adedi
                        WHEN YEAR(satislar.satis_tarihi) = 2022 THEN urunler.fiyat_2022 * satislar.satis_adedi
                        WHEN YEAR(satislar.satis_tarihi) = 2021 THEN urunler.fiyat_2021 * satislar.satis_adedi
                        WHEN YEAR(satislar.satis_tarihi) = 2020 THEN urunler.fiyat_2020 * satislar.satis_adedi
                        ELSE 0
                    END
                ) AS toplam_gelir
                FROM satislar
                JOIN urunler ON urunler.urun_id = satislar.urun_id
            )
        ) * 100, 2
    ) AS gelir_yuzdesi
FROM satislar
JOIN urunler ON urunler.urun_id = satislar.urun_id
JOIN subeler ON subeler.sube_id = satislar.sube_id
GROUP BY subeler.sube_adi;
    `;
    db.query(query, (err, results) => {
        if (err) {
            console.error("Hata:", err);
            return res.status(500).send({ message: "Bir hata oluştu." });
        }
        res.json(results);
    });
});
//GRAFİK3
app.get('/api/besiktas', (req, res) => {
    const year = req.query.year || new Date().getFullYear();
    const query = `
        SELECT MONTHNAME(satis_tarihi) AS aylar, 
               SUM(satis_adedi) AS satislar
        FROM satislar, subeler
        WHERE subeler.sube_id=satislar.sube_id
        AND subeler.sube_id=1
        AND YEAR(satis_tarihi)=?
        GROUP BY MONTH(satis_tarihi)
        ORDER BY MONTH(satis_tarihi)
    `;
    db.query(query, [year], (err, results) => {
        if (err) {
            console.error("Hata:", err);
            return res.status(500).send({ message: "Bir hata oluştu." });
        }
        res.json(results);
    });
});
//GRAFİK4
app.get('/api/beykoz', (req, res) => {
    const year = req.query.year || new Date().getFullYear();
    const query = `
        SELECT MONTHNAME(satis_tarihi) AS aylar, 
               SUM(satis_adedi) AS satislar
        FROM satislar, subeler
        WHERE subeler.sube_id=satislar.sube_id
        AND subeler.sube_id=2
        AND YEAR(satis_tarihi)=?
        GROUP BY MONTH(satis_tarihi)
        ORDER BY MONTH(satis_tarihi)
    `;
    db.query(query, [year], (err, results) => {
        if (err) {
            console.error("Hata:", err);
            return res.status(500).send({ message: "Bir hata oluştu." });
        }
        res.json(results);
    });
});
//GRAFİK5
app.get('/api/kadikoy', (req, res) => {
    const year = req.query.year || new Date().getFullYear();
    const query = `
        SELECT MONTHNAME(satis_tarihi) AS aylar, 
               SUM(satis_adedi) AS satislar
        FROM satislar, subeler
        WHERE subeler.sube_id=satislar.sube_id
        AND subeler.sube_id=3
        AND YEAR(satis_tarihi)=?
        GROUP BY MONTH(satis_tarihi)
        ORDER BY MONTH(satis_tarihi)
    `;
    db.query(query, [year], (err, results) => {
        if (err) {
            console.error("Hata:", err);
            return res.status(500).send({ message: "Bir hata oluştu." });
        }
        res.json(results);
    });
});
//GRAFİK6
app.get('/api/pendik', (req, res) => {
    const year = req.query.year || new Date().getFullYear();
    const query = `
        SELECT MONTHNAME(satis_tarihi) AS aylar, 
               SUM(satis_adedi) AS satislar
        FROM satislar, subeler
        WHERE subeler.sube_id=satislar.sube_id
        AND subeler.sube_id=4
        AND YEAR(satis_tarihi)=?
        GROUP BY MONTH(satis_tarihi)
        ORDER BY MONTH(satis_tarihi)
    `;
    db.query(query, [year], (err, results) => {
        if (err) {
            console.error("Hata:", err);
            return res.status(500).send({ message: "Bir hata oluştu." });
        }
        res.json(results);
    });
});
//GRAFİK7
app.get('/api/sisli', (req, res) => {
    const year = req.query.year || new Date().getFullYear();
    const query = `
        SELECT MONTHNAME(satis_tarihi) AS aylar, 
               SUM(satis_adedi) AS satislar
        FROM satislar, subeler
        WHERE subeler.sube_id=satislar.sube_id
        AND subeler.sube_id=5
        AND YEAR(satis_tarihi)=?
        GROUP BY MONTH(satis_tarihi)
        ORDER BY MONTH(satis_tarihi)
    `;
    db.query(query, [year], (err, results) => {
        if (err) {
            console.error("Hata:", err);
            return res.status(500).send({ message: "Bir hata oluştu." });
        }
        res.json(results);
    });
});
//GRAFİK8
app.get('/api/uskudar', (req, res) => {
    const year = req.query.year || new Date().getFullYear();
    const query = `
        SELECT MONTHNAME(satis_tarihi) AS aylar, 
               SUM(satis_adedi) AS satislar
        FROM satislar, subeler
        WHERE subeler.sube_id=satislar.sube_id
        AND subeler.sube_id=6
        AND YEAR(satis_tarihi)=?
        GROUP BY MONTH(satis_tarihi)
        ORDER BY MONTH(satis_tarihi)
    `;
    db.query(query, [year], (err, results) => {
        if (err) {
            console.error("Hata:", err);
            return res.status(500).send({ message: "Bir hata oluştu." });
        }
        res.json(results);
    });
});
//GRAFİK9
app.get('/api/esenyurt', (req, res) => {
    const year = req.query.year || new Date().getFullYear();
    const query = `
        SELECT MONTHNAME(satis_tarihi) AS aylar, 
               SUM(satis_adedi) AS satislar
        FROM satislar, subeler
        WHERE subeler.sube_id=satislar.sube_id
        AND subeler.sube_id=7
        AND YEAR(satis_tarihi)=?
        GROUP BY MONTH(satis_tarihi)
        ORDER BY MONTH(satis_tarihi)
    `;
    db.query(query, [year], (err, results) => {
        if (err) {
            console.error("Hata:", err);
            return res.status(500).send({ message: "Bir hata oluştu." });
        }
        res.json(results);
    });
});
//GRAFİK10
app.get('/api/fatih', (req, res) => {
    const year = req.query.year || new Date().getFullYear();
    const query = `
        SELECT MONTHNAME(satis_tarihi) AS aylar, 
               SUM(satis_adedi) AS satislar
        FROM satislar, subeler
        WHERE subeler.sube_id=satislar.sube_id
        AND subeler.sube_id=8
        AND YEAR(satis_tarihi)=?
        GROUP BY MONTH(satis_tarihi)
        ORDER BY MONTH(satis_tarihi)
    `;
    db.query(query, [year], (err, results) => {
        if (err) {
            console.error("Hata:", err);
            return res.status(500).send({ message: "Bir hata oluştu." });
        }
        res.json(results);
    });
});
//GRAFİK11
app.get('/api/buyukcekmece', (req, res) => {
    const year = req.query.year || new Date().getFullYear();
    const query = `
        SELECT MONTHNAME(satis_tarihi) AS aylar, 
               SUM(satis_adedi) AS satislar
        FROM satislar, subeler
        WHERE subeler.sube_id=satislar.sube_id
        AND subeler.sube_id=9
        AND YEAR(satis_tarihi)=?
        GROUP BY MONTH(satis_tarihi)
        ORDER BY MONTH(satis_tarihi)
    `;
    db.query(query, [year], (err, results) => {
        if (err) {
            console.error("Hata:", err);
            return res.status(500).send({ message: "Bir hata oluştu." });
        }
        res.json(results);
    });
});
//GRAFİK12
app.get('/api/beyoglu', (req, res) => {
    const year = req.query.year || new Date().getFullYear();
    const query = `
        SELECT MONTHNAME(satis_tarihi) AS aylar, 
               SUM(satis_adedi) AS satislar
        FROM satislar, subeler
        WHERE subeler.sube_id=satislar.sube_id
        AND subeler.sube_id=10
        AND YEAR(satis_tarihi)=?
        GROUP BY MONTH(satis_tarihi)
        ORDER BY MONTH(satis_tarihi)
    `;
    db.query(query, [year], (err, results) => {
        if (err) {
            console.error("Hata:", err);
            return res.status(500).send({ message: "Bir hata oluştu." });
        }
        res.json(results);
    });
});
//////////////////////////////////ŞUBELER SON///////////////////////////////////////////////

/////////////////////////////////////ÜRÜNLER////////////////////////////////////////////////////
//////////////GRAFİK 1///////////
app.get('/api/urun-satis', (req, res) => {
    const year = req.query.year || new Date().getFullYear();
    const query = `
        SELECT urunler.urun_adi, 
               SUM(satislar.satis_adedi) AS urun_satisi
        FROM urunler, satislar
        WHERE urunler.urun_id = satislar.urun_id
        AND YEAR(satislar.satis_tarihi)=?
        GROUP BY urunler.urun_adi;
    `;
    db.query(query, [year], (err, results) => {
        if (err) {
            console.error("Hata:", err);
            return res.status(500).send({ message: "Bir hata oluştu." });
        }
        res.json(results);
    });
});
////////////////GRAFİK 2//////////////
app.get('/api/urun-cesit', (req, res) => {
    const year = req.query.year || new Date().getFullYear();
    const query = `
        SELECT MONTHNAME(satis_tarihi) AS aylar,
               COUNT(DISTINCT satislar.urun_id) AS urun_cesidi
        FROM satislar
        WHERE YEAR(satislar.satis_tarihi)=?
        GROUP BY MONTH(satis_tarihi)
        ORDER BY MONTH(satis_tarihi);
    `;
    db.query(query, [year], (err, results) => {
        if (err) {
            console.error("Hata:", err);
            return res.status(500).send({ message: "Bir hata oluştu." });
        }
        res.json(results);
    });
});
////////////////GRAFİK 3//////////////
app.get('/api/urun-gelir', (req, res) => {
    const year = req.query.year || new Date().getFullYear();
    const query = `
        SELECT 
    urunler.urun_id, 
    urunler.urun_adi, 
    SUM(
        CASE
            WHEN YEAR(satislar.satis_tarihi) = 2024 THEN urunler.fiyat_2024 * satislar.satis_adedi
            WHEN YEAR(satislar.satis_tarihi) = 2023 THEN urunler.fiyat_2023 * satislar.satis_adedi
            WHEN YEAR(satislar.satis_tarihi) = 2022 THEN urunler.fiyat_2022 * satislar.satis_adedi
            WHEN YEAR(satislar.satis_tarihi) = 2021 THEN urunler.fiyat_2021 * satislar.satis_adedi
            WHEN YEAR(satislar.satis_tarihi) = 2020 THEN urunler.fiyat_2020 * satislar.satis_adedi
            ELSE 0
        END
    ) AS toplam_gelir
FROM satislar
JOIN urunler 
    ON urunler.urun_id = satislar.urun_id
WHERE YEAR(satislar.satis_tarihi) = ?
GROUP BY urunler.urun_id, urunler.urun_adi;

    `;
    db.query(query, [year], (err, results) => {
        if (err) {
            console.error("Hata:", err);
            return res.status(500).send({ message: "Bir hata oluştu." });
        }
        res.json(results);
    });
});
//////////////////GRAFİK 4///////////////
app.get('/api/urun-maliyet', (req, res) => {
    const year = req.query.year || new Date().getFullYear();
    const query = `
        SELECT 
    urunler.urun_id, 
    urunler.urun_adi, 
    SUM(
        CASE
            WHEN YEAR(satislar.satis_tarihi) = 2024 THEN urunler.maliyet_2024 * satislar.satis_adedi
            WHEN YEAR(satislar.satis_tarihi) = 2023 THEN urunler.maliyet_2023 * satislar.satis_adedi
            WHEN YEAR(satislar.satis_tarihi) = 2022 THEN urunler.maliyet_2022 * satislar.satis_adedi
            WHEN YEAR(satislar.satis_tarihi) = 2021 THEN urunler.maliyet_2021 * satislar.satis_adedi
            WHEN YEAR(satislar.satis_tarihi) = 2020 THEN urunler.maliyet_2020 * satislar.satis_adedi
            ELSE 0
        END
    ) AS toplam_maliyet
FROM satislar
JOIN urunler 
    ON urunler.urun_id = satislar.urun_id
WHERE YEAR(satislar.satis_tarihi) = ?
GROUP BY urunler.urun_id, urunler.urun_adi;

    `;
    db.query(query, [year], (err, results) => {
        if (err) {
            console.error("Hata:", err);
            return res.status(500).send({ message: "Bir hata oluştu." });
        }
        res.json(results);
    });
});
/////////////////////ÜRÜNLER SON//////////////////////////////////////////////

//////////////////////////MÜŞTERİLER///////////////////////////////////////
/////////////GRAFİK 1/////////////////////
app.get('/api/musteri-yas', (req, res) => {
    const query = `
        SELECT 
            CASE
                WHEN FLOOR(DATEDIFF(CURDATE(), dogum_tarihi) / 365) BETWEEN 18 AND 24 THEN '18-24'
                WHEN FLOOR(DATEDIFF(CURDATE(), dogum_tarihi) / 365) BETWEEN 25 AND 30 THEN '25-30'
                WHEN FLOOR(DATEDIFF(CURDATE(), dogum_tarihi) / 365) BETWEEN 31 AND 35 THEN '31-35'
                WHEN FLOOR(DATEDIFF(CURDATE(), dogum_tarihi) / 365) BETWEEN 36 AND 40 THEN '36-40'
                WHEN FLOOR(DATEDIFF(CURDATE(), dogum_tarihi) / 365) BETWEEN 41 AND 45 THEN '41-45'
                WHEN FLOOR(DATEDIFF(CURDATE(), dogum_tarihi) / 365) BETWEEN 46 AND 50 THEN '46-50'
                WHEN FLOOR(DATEDIFF(CURDATE(), dogum_tarihi) / 365) BETWEEN 51 AND 55 THEN '51-55'
                ELSE 'Diğer'
            END AS yas_araligi,
            COUNT(*) AS musteri_sayisi,
            ROUND((COUNT(*) / (SELECT COUNT(*) FROM musteriler) * 100), 2) AS yuzde
        FROM musteriler
        GROUP BY yas_araligi
        ORDER BY yas_araligi;
    `;
    db.query(query, (err, results) => {
        if (err) {
            console.error("Hata:", err);
            return res.status(500).send({ message: "Bir hata oluştu." });
        }
        res.json(results);
    });
});
/////////////GRAFİK 2/////////////////////
app.get('/api/musteri-cinsiyet', (req, res) => {
    const query = `
        SELECT 
            CASE
                WHEN cinsiyet_id = 1 THEN 'Kadın'
                WHEN cinsiyet_id = 2 THEN 'Erkek'
                ELSE 'Diğer'
            END AS cinsiyet_adi,
            COUNT(*) AS musteri_sayisi,
            ROUND((COUNT(*) / (SELECT COUNT(*) FROM musteriler) * 100), 2) AS yuzde
        FROM musteriler
        GROUP BY cinsiyet_id
        ORDER BY cinsiyet_id;
    `;
    db.query(query, (err, results) => {
        if (err) {
            console.error("Hata:", err);
            return res.status(500).send({ message: "Bir hata oluştu." });
        }
        res.json(results);
    });
});
///////////////GRAFİK 3 ///////////////////
app.get('/api/sevilen-urun', (req, res) => {
    const query = `
        SELECT 
            urunler.urun_adi,
            SUM(satislar.satis_adedi) AS satis_adedi
        FROM satislar
        JOIN urunler ON urunler.urun_id = satislar.urun_id
        GROUP BY urunler.urun_id
        ORDER BY satis_adedi DESC
        LIMIT 5;
    `;
    db.query(query, (err, results) => {
        if (err) {
            console.error("Hata:", err);
            return res.status(500).send({ message: "Bir hata oluştu." });
        }
        res.json(results);
    });
});
///////////////GRAFİK 4///////////////////
app.get('/api/sevilmeyen-urun', (req, res) => {
    const query = `
        SELECT 
            urunler.urun_adi,
            SUM(satislar.satis_adedi) AS satis_adedi
        FROM satislar
        JOIN urunler ON urunler.urun_id = satislar.urun_id
        GROUP BY urunler.urun_id
        ORDER BY satis_adedi
        LIMIT 5;
    `;
    db.query(query, (err, results) => {
        if (err) {
            console.error("Hata:", err);
            return res.status(500).send({ message: "Bir hata oluştu." });
        }
        res.json(results);
    });
});
//////////////////////////////MÜŞTERİLER SON/////////////////////////////////////////

/////////////////////////////KARAR VE TAHMİN/////////////////////////////////////////
///////GRAFİK 1///////////
app.get('/api/gelir-tahmin', (req, res) => {
    const query = `
     SELECT 
    YEAR(satislar.satis_tarihi) AS year,
    COUNT(DISTINCT satislar.musteri_id) AS musteri_sayisi,
    SUM(
        CASE
            WHEN YEAR(satislar.satis_tarihi) = 2024 THEN urunler.fiyat_2024 * satislar.satis_adedi
            WHEN YEAR(satislar.satis_tarihi) = 2023 THEN urunler.fiyat_2023 * satislar.satis_adedi
            WHEN YEAR(satislar.satis_tarihi) = 2022 THEN urunler.fiyat_2022 * satislar.satis_adedi
            WHEN YEAR(satislar.satis_tarihi) = 2021 THEN urunler.fiyat_2021 * satislar.satis_adedi
            WHEN YEAR(satislar.satis_tarihi) = 2020 THEN urunler.fiyat_2020 * satislar.satis_adedi
            ELSE 0 
        END
    ) AS toplam_gelir
FROM satislar
JOIN urunler ON urunler.urun_id = satislar.urun_id
WHERE YEAR(satislar.satis_tarihi) IN (2020, 2021, 2022, 2023, 2024)
GROUP BY YEAR(satislar.satis_tarihi);

    `;
    
    db.query(query, (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Database error');
      }
      res.json(results); 
    });
  });
  /////////////////GRAFİK 2/////////////////////
  app.get('/api/sube-gelir-yuzdesi', (req, res) => {
    const query = `
        SELECT subeler.sube_id, subeler.sube_adi, 
    ROUND(
        (
            SUM(
                CASE 
                    WHEN YEAR(satislar.satis_tarihi) = 2024 THEN urunler.fiyat_2024 * satislar.satis_adedi
                    WHEN YEAR(satislar.satis_tarihi) = 2023 THEN urunler.fiyat_2023 * satislar.satis_adedi
                    WHEN YEAR(satislar.satis_tarihi) = 2022 THEN urunler.fiyat_2022 * satislar.satis_adedi
                    WHEN YEAR(satislar.satis_tarihi) = 2021 THEN urunler.fiyat_2021 * satislar.satis_adedi
                    WHEN YEAR(satislar.satis_tarihi) = 2020 THEN urunler.fiyat_2020 * satislar.satis_adedi
                    ELSE 0
                END
            )
            / (
                SELECT SUM(
                    CASE 
                        WHEN YEAR(satislar.satis_tarihi) = 2024 THEN urunler.fiyat_2024 * satislar.satis_adedi
                        WHEN YEAR(satislar.satis_tarihi) = 2023 THEN urunler.fiyat_2023 * satislar.satis_adedi
                        WHEN YEAR(satislar.satis_tarihi) = 2022 THEN urunler.fiyat_2022 * satislar.satis_adedi
                        WHEN YEAR(satislar.satis_tarihi) = 2021 THEN urunler.fiyat_2021 * satislar.satis_adedi
                        WHEN YEAR(satislar.satis_tarihi) = 2020 THEN urunler.fiyat_2020 * satislar.satis_adedi
                        ELSE 0
                    END
                ) AS toplam_gelir
                FROM satislar
                JOIN urunler ON urunler.urun_id = satislar.urun_id
            )
        ) * 100, 2
    ) AS gelir_yuzdesi
FROM satislar
JOIN urunler ON urunler.urun_id = satislar.urun_id
JOIN subeler ON subeler.sube_id = satislar.sube_id
GROUP BY subeler.sube_adi;
    `;
    db.query(query, (err, results) => {
        if (err) {
            console.error("Hata:", err);
            return res.status(500).send({ message: "Bir hata oluştu." });
        }
        res.json(results);
    });
});
/////////////////////////TAHMİN SAYFASI SON///////////////////////////////////


app.listen(port, () => {
    console.log(`Sunucu http://localhost:${port} adresinde çalışıyor.`);
});