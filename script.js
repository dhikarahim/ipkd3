document.addEventListener('DOMContentLoaded', function() {
    populateTable();
    addEventListeners();
    calculateAll(); // Initial calculation
});

// Data Mata Kuliah (Nama, SKS, Bobot AKT, UTS, UAS)
const courses = [
    { name: "Pengantar Pengelolaan Keuangan", sks: 3, weights: { akt: 0.40, uts: 0.30, uas: 0.30 } },
    { name: "Ekonomi Makro dan Kebijakan Fiskal", sks: 3, weights: { akt: 0.40, uts: 0.30, uas: 0.30 } },
    { name: "Akuntansi Keuangan Menengah I", sks: 3, weights: { akt: 0.40, uts: 0.30, uas: 0.30 } },
    { name: "Akuntansi Biaya", sks: 3, weights: { akt: 0.50, uts: 0.25, uas: 0.25 } },
    { name: "PPh Lanjutan", sks: 2, weights: { akt: 0.40, uts: 0.30, uas: 0.30 } },
    { name: "Pajak Tidak Langsung Lainnya (PTLL)", sks: 2, weights: { akt: 0.50, uts: 0.25, uas: 0.25 } },
    { name: "Statistika", sks: 2, weights: { akt: 0.40, uts: 0.30, uas: 0.30 } },
    { name: "Hukum Perdata", sks: 2, weights: { akt: 0.40, uts: 0.30, uas: 0.30 } }
];

// Fungsi untuk mengisi tabel
function populateTable() {
    const tbody = document.getElementById('coursesTable').querySelector('tbody');
    tbody.innerHTML = ''; // Kosongkan dulu
    let totalSks = 0;

    courses.forEach((course, index) => {
        const row = tbody.insertRow();
        row.setAttribute('data-index', index); // Tandai baris dengan index

        row.innerHTML = `
            <td>${course.name}</td>
            <td class="sks">${course.sks}</td>
            <td><input type="number" class="score-input akt-score" min="0" max="100" placeholder="0-100" value="0"></td>
            <td><input type="number" class="score-input uts-score" min="0" max="100" placeholder="0-100" value="0"></td>
            <td><input type="number" class="score-input uas-score" min="0" max="100" placeholder="0-100" value="0"></td>
            <td class="grade-angka">-</td>
            <td class="grade-huruf">-</td>
            <td class="grade-indeks">-</td>
        `;
        totalSks += course.sks;
    });

    document.getElementById('totalSks').textContent = totalSks;
}

// Fungsi konversi Nilai Angka ke Huruf dan Indeks
function getGradeDetails(score) {
    if (score >= 86) return { huruf: 'A', indeks: 4.00, cssClass: 'grade-A' };
    if (score >= 80) return { huruf: 'A-', indeks: 3.70, cssClass: 'grade-A-minus' };
    if (score >= 75) return { huruf: 'B+', indeks: 3.30, cssClass: 'grade-B-plus' };
    if (score >= 70) return { huruf: 'B', indeks: 3.00, cssClass: 'grade-B' };
    if (score >= 66) return { huruf: 'B-', indeks: 2.70, cssClass: 'grade-B-minus' };
    if (score >= 61) return { huruf: 'C+', indeks: 2.30, cssClass: 'grade-C-plus' };
    if (score >= 56) return { huruf: 'C', indeks: 2.00, cssClass: 'grade-C' };
    if (score >= 41) return { huruf: 'D', indeks: 1.00, cssClass: 'grade-D' };
    return { huruf: 'E', indeks: 0.00, cssClass: 'grade-E' }; // Default E
}

// Fungsi menghitung nilai satu baris
function calculateRow(rowIndex) {
    const row = document.querySelector(`tbody tr[data-index="${rowIndex}"]`);
    if (!row) return { indeks: 0, sks: 0 }; // Return default if row not found

    const course = courses[rowIndex];
    const aktScore = parseFloat(row.querySelector('.akt-score').value) || 0;
    const utsScore = parseFloat(row.querySelector('.uts-score').value) || 0;
    const uasScore = parseFloat(row.querySelector('.uas-score').value) || 0;

    // Batasi nilai 0-100
    const validAkt = Math.max(0, Math.min(100, aktScore));
    const validUts = Math.max(0, Math.min(100, utsScore));
    const validUas = Math.max(0, Math.min(100, uasScore));

    // Update input jika nilai di luar range (opsional)
    // row.querySelector('.akt-score').value = validAkt;
    // row.querySelector('.uts-score').value = validUts;
    // row.querySelector('.uas-score').value = validUas;


    const nilaiAngka = (validAkt * course.weights.akt) +
                       (validUts * course.weights.uts) +
                       (validUas * course.weights.uas);

    const gradeDetails = getGradeDetails(nilaiAngka);

    // Update tampilan di tabel
    const gradeAngkaCell = row.querySelector('.grade-angka');
    const gradeHurufCell = row.querySelector('.grade-huruf');
    const gradeIndeksCell = row.querySelector('.grade-indeks');

    gradeAngkaCell.textContent = nilaiAngka.toFixed(2);
    gradeHurufCell.textContent = gradeDetails.huruf;
    gradeIndeksCell.textContent = gradeDetails.indeks.toFixed(2);

    // Hapus class warna lama dan tambahkan yang baru
    gradeHurufCell.className = 'grade-huruf'; // Reset class
    gradeHurufCell.classList.add(gradeDetails.cssClass);

    return { indeks: gradeDetails.indeks, sks: course.sks };
}

// Fungsi menghitung IP Semester
function calculateAll() {
    let totalQualityPoints = 0;
    let totalSks = 0;

    courses.forEach((course, index) => {
        const result = calculateRow(index);
        totalQualityPoints += result.indeks * result.sks;
        totalSks += result.sks;
    });

    const finalGpa = totalSks > 0 ? (totalQualityPoints / totalSks) : 0;
    document.getElementById('finalGpa').textContent = finalGpa.toFixed(2);
    // Pastikan total SKS di summary juga terupdate (jika dinamis)
    if (document.getElementById('totalSks').textContent === '0') {
         document.getElementById('totalSks').textContent = totalSks;
    }
}

// Fungsi untuk download screenshot
// Fungsi untuk download screenshot (Versi Baru)
function downloadScreenshot() {
    // Target elemen utama kartu kalkulator
    const elementToCapture = document.querySelector('.calculator-card');
    const downloadButton = document.getElementById('downloadBtn');
    const ocr = document.querySelector('.ocr-section');

    if (!elementToCapture) {
        console.error("Elemen .calculator-card tidak ditemukan!");
        alert("Terjadi kesalahan saat menyiapkan screenshot.");
        return;
    }

    // Sembunyikan tombol sementara agar tidak ikut tercapture
    downloadButton.style.display = 'none';
    ocr.style.display = 'none';

    console.log("Mengambil screenshot dari .calculator-card..."); // Log

    html2canvas(elementToCapture, {
        scale: 2, // Tingkatkan resolusi gambar
        useCORS: true,
        backgroundColor: '#ffffff', // Set background putih eksplisit
        // Opsi untuk mencoba memperbaiki rendering jika ada masalah:
        // scrollX: 0,
        // scrollY: -window.scrollY // Jika ada masalah scroll
        // windowWidth: elementToCapture.scrollWidth,
        // windowHeight: elementToCapture.scrollHeight
    }).then(canvas => {
        console.log("Screenshot berhasil dibuat."); // Log
        // Konversi canvas ke Data URL
        const imageURL = canvas.toDataURL('image/png');

        // Buat link download sementara
        const link = document.createElement('a');
        link.href = imageURL;
        link.download = 'Hasil_IP_Semester_Lengkap.png'; // Nama file download baru
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

         // Tampilkan kembali tombol setelah selesai
       downloadButton.style.display = 'inline-flex'; // Kembalikan display aslinya
       console.log("Tombol download ditampilkan kembali."); // Log

    }).catch(err => {
        console.error("Oops, gagal mengambil screenshot:", err);
        alert("Maaf, gagal menyimpan gambar. Silakan coba screenshot manual.");
         // Tampilkan kembali tombol jika error
        downloadButton.style.display = 'inline-flex'; // Pastikan tombol muncul lagi
    });
}


// Tambahkan event listeners
// Variabel global untuk Tesseract Worker (opsional, bisa dibuat di dalam fungsi)
let worker = null;

// --- Fungsi Baru: Update Status OCR ---
function updateOcrStatus(message) {
    const statusElement = document.getElementById('ocrStatus');
    if (!statusElement) return;

    let statusText = message.status;
    if (message.progress) {
        statusText += ` (${(message.progress * 100).toFixed(0)}%)`;
    }
    statusElement.textContent = statusText;
    console.log(message); // Log detail ke console
}

// --- Fungsi Baru: Parsing Teks OCR dan Isi Tabel ---
// !! PERINGATAN: Fungsi ini sangat bergantung pada format teks hasil OCR !!
// !! dan mungkin perlu banyak penyesuaian (trial & error) !!
function parseOcrTextAndPopulate(text) {
    console.log("Hasil Teks OCR:\n", text);
    const lines = text.split('\n');
    let populatedCount = 0;

    lines.forEach(line => {
        // Coba cari baris yang mengandung nilai UTS, UAS, AKT (angka desimal)
        // Contoh Regex: cocokkan minimal 3 angka desimal (e.g., 75.50 84.75 84.60)
        const scoreRegex = /(\d{1,3}\.\d{1,2})\s+(\d{1,3}\.\d{1,2})\s+(\d{1,3}\.\d{1,2})/;
        const match = line.match(scoreRegex);

        if (match && match.length >= 4) {
            const utsScore = parseFloat(match[1]);
            const uasScore = parseFloat(match[2]);
            const aktScore = parseFloat(match[3]);

            // Coba ekstrak nama mata kuliah (teks sebelum angka pertama)
            // Ini asumsi kasar, mungkin perlu diperbaiki
            const courseNamePart = line.substring(0, match.index).trim();
            // Hilangkan nomor di awal jika ada (misal "1 ", "2 ")
            const courseNameFromOCR = courseNamePart.replace(/^\d+\s+/, '').toLowerCase();

            console.log(`Ditemukan potensi baris: ${courseNameFromOCR} | UTS: ${utsScore}, UAS: ${uasScore}, AKT: ${aktScore}`);

            // Cari mata kuliah yang cocok di data kita (dengan case-insensitive & includes)
            let matchedIndex = -1;
            courses.forEach((course, index) => {
                // Gunakan includes() untuk pencocokan yang lebih fleksibel
                if (courseNameFromOCR.length > 5 && course.name.toLowerCase().includes(courseNameFromOCR.substring(0, Math.min(courseNameFromOCR.length, 15)))) { // Cocokkan beberapa karakter awal
                    matchedIndex = index;
                    console.log(`Cocok dengan: ${course.name} (Index: ${matchedIndex})`);
                    return; // Hentikan loop forEach jika sudah cocok
                }
                 // Fallback: Coba cocokkan kata kunci unik jika ada
                 else if (courseNameFromOCR.includes("keuangan negara") && course.name.toLowerCase().includes("keuangan negara")) matchedIndex = index;
                 else if (courseNameFromOCR.includes("makro") && course.name.toLowerCase().includes("makro")) matchedIndex = index;
                 else if (courseNameFromOCR.includes("menengah i") && course.name.toLowerCase().includes("menengah i")) matchedIndex = index;
                 else if (courseNameFromOCR.includes("biaya") && course.name.toLowerCase().includes("biaya")) matchedIndex = index;
                 else if (courseNameFromOCR.includes("pph lanjutan") && course.name.toLowerCase().includes("pph lanjutan")) matchedIndex = index;
                 else if (courseNameFromOCR.includes("ptll") && course.name.toLowerCase().includes("ptll")) matchedIndex = index;
                 else if (courseNameFromOCR.includes("statistika") && course.name.toLowerCase().includes("statistika")) matchedIndex = index;
                 else if (courseNameFromOCR.includes("perdata") && course.name.toLowerCase().includes("perdata")) matchedIndex = index;

                 if(matchedIndex !== -1 && courses[matchedIndex].name.toLowerCase().includes(courseNameFromOCR.substring(0, Math.min(courseNameFromOCR.length, 15)))) {
                    console.log(`Fallback cocok dengan: ${courses[matchedIndex].name} (Index: ${matchedIndex})`);
                    return;
                 } else {
                    matchedIndex = -1; // Reset jika fallback tidak cocok
                 }
            });


            if (matchedIndex !== -1) {
                // Temukan baris tabel HTML yang sesuai
                const targetRow = document.querySelector(`tbody tr[data-index="${matchedIndex}"]`);
                if (targetRow) {
                    // Isi nilai ke input fields
                    const utsInput = targetRow.querySelector('.uts-score');
                    const uasInput = targetRow.querySelector('.uas-score');
                    const aktInput = targetRow.querySelector('.akt-score');

                    if (utsInput) utsInput.value = utsScore;
                    if (uasInput) uasInput.value = uasScore;
                    if (aktInput) aktInput.value = aktScore;

                    populatedCount++;
                    console.log(`Berhasil mengisi nilai untuk index ${matchedIndex}`);
                } else {
                    console.warn(`Baris tabel untuk index ${matchedIndex} tidak ditemukan.`);
                }
            } else {
                console.warn(`Tidak ditemukan mata kuliah yang cocok untuk: "${courseNameFromOCR}"`);
            }
        }
    });

    if (populatedCount > 0) {
        alert(`Berhasil mengisi ${populatedCount} baris nilai dari gambar! Silakan periksa kembali hasilnya.`);
        calculateAll(); // Hitung ulang semua nilai setelah diisi
    } else {
        alert("Tidak dapat menemukan atau mengisi nilai dari gambar. Pastikan screenshot jelas dan format tabel sesuai. Coba input manual.");
    }
}


// --- Fungsi Baru: Handle Upload Gambar ---
async function handleImageUpload(event) {
    const file = event.target.files[0];
    const statusElement = document.getElementById('ocrStatus');

    if (!file || !file.type.startsWith('image/')) {
        statusElement.textContent = 'Silakan pilih file gambar.';
        return;
    }

    statusElement.textContent = 'Mempersiapkan OCR...';

    try {
         // Buat worker jika belum ada atau gunakan yang sudah ada
        if (!worker) {
             console.log("Membuat Tesseract Worker...");
             updateOcrStatus({ status: 'Memuat library OCR...' });
             // Gunakan bahasa Indonesia ('ind') dan Inggris ('eng') jika perlu
             // Tapi coba 'ind' dulu karena nama mata kuliahnya Indonesia
             worker = await Tesseract.createWorker('ind', 1, { // Bahasa 'ind'
                 logger: updateOcrStatus, // Fungsi untuk update progress
                 // workerPath: 'https://cdn.jsdelivr.net/npm/tesseract.js@v5.0.0/dist/worker.min.js', // Opsional: path explicit
                 // langPath: 'https://tessdata.projectnaptha.com/4.0.0', // Opsional: path data bahasa
                 // corePath: 'https://cdn.jsdelivr.net/npm/tesseract.js-core@v5.0.0/tesseract-core.wasm.js', // Opsional: path core
             });
             console.log("Tesseract Worker siap.");
         } else {
             console.log("Menggunakan Tesseract Worker yang sudah ada.");
         }


        updateOcrStatus({ status: 'Mengenali teks dari gambar...' });
        const result = await worker.recognize(file);
        parseOcrTextAndPopulate(result.data.text);

    } catch (error) {
        console.error('Error saat proses OCR:', error);
        statusElement.textContent = 'Error: Gagal memproses gambar.';
    } finally {
         statusElement.textContent = 'Proses OCR selesai.'; // Atau hapus teks status
        // Reset input file agar bisa upload file yang sama lagi (opsional)
        event.target.value = null;
        // Worker bisa di-terminate di sini jika hanya sekali pakai,
        // tapi membiarkannya aktif bisa mempercepat proses selanjutnya
        // await worker.terminate();
        // worker = null; // Reset worker jika di-terminate
        // console.log("Tesseract Worker dihentikan.");
    }
}


// Modifikasi addEventListeners
function addEventListeners() {
    // Event listener input nilai (yang sudah ada)
    const inputs = document.querySelectorAll('.score-input');
    inputs.forEach(input => {
        input.addEventListener('input', () => {
            const row = input.closest('tr');
            const rowIndex = row.getAttribute('data-index');
            calculateRow(rowIndex); // Hitung baris yang diubah
            calculateAll();       // Hitung ulang GPA keseluruhan (sudah memanggil calculateRow)
        });
    });

    // Event listener tombol download (yang sudah ada)
    document.getElementById('downloadBtn').addEventListener('click', downloadScreenshot);

    // Event listener BARU untuk input file
    const imageUploadInput = document.getElementById('imageUpload');
    if (imageUploadInput) {
        imageUploadInput.addEventListener('change', handleImageUpload);
    } else {
        console.error("Input file dengan ID 'imageUpload' tidak ditemukan!");
    }
}

// --- PASTIKAN SEMUA FUNGSI LAINNYA (populateTable, getGradeDetails, calculateRow, calculateAll, downloadScreenshot) TETAP ADA ---

// Inisialisasi di awal (tetap sama)
document.addEventListener('DOMContentLoaded', function() {
    populateTable();
    addEventListeners();
    calculateAll(); // Initial calculation
});
