document.addEventListener('DOMContentLoaded', function() {
    populateTable();
    addEventListeners();
    calculateAll(); // Initial calculation
});

// Data Mata Kuliah (Nama, SKS, Bobot AKT, UTS, UAS)
const courses = [
    { name: "Pengantar Pengelolaan Keuangan", sks: 3, weights: { akt: 0.30, uts: 0.30, uas: 0.40 } },
    { name: "Ekonomi Makro dan Kebijakan Fiskal", sks: 3, weights: { akt: 0.30, uts: 0.30, uas: 0.40 } },
    { name: "Akuntansi Keuangan Menengah I", sks: 3, weights: { akt: 0.30, uts: 0.30, uas: 0.40 } },
    { name: "Akuntansi Biaya", sks: 3, weights: { akt: 0.25, uts: 0.25, uas: 0.50 } },
    { name: "PPh Lanjutan", sks: 2, weights: { akt: 0.30, uts: 0.30, uas: 0.40 } },
    { name: "Pajak Tidak Langsung Lainnya (PTLL)", sks: 2, weights: { akt: 0.25, uts: 0.25, uas: 0.50 } },
    { name: "Statistika", sks: 2, weights: { akt: 0.30, uts: 0.30, uas: 0.40 } },
    { name: "Hukum Perdata", sks: 2, weights: { akt: 0.30, uts: 0.30, uas: 0.40 } }
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
function downloadScreenshot() {
    const elementToCapture = document.getElementById('results-table-container'); // Target container tabel
    const downloadButton = document.getElementById('downloadBtn');

    // Sembunyikan tombol sementara agar tidak ikut tercapture
    // downloadButton.style.display = 'none';

    html2canvas(elementToCapture, {
        scale: 2, // Tingkatkan resolusi gambar
        useCORS: true, // Jika ada gambar eksternal (tidak relevan di sini)
        backgroundColor: '#ffffff' // Set background putih eksplisit
    }).then(canvas => {
        // Konversi canvas ke Data URL
        const imageURL = canvas.toDataURL('image/png');

        // Buat link download sementara
        const link = document.createElement('a');
        link.href = imageURL;
        link.download = 'Hasil_IP_Semester.png'; // Nama file download
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

         // Tampilkan kembali tombol setelah selesai
       // downloadButton.style.display = 'inline-flex';

    }).catch(err => {
        console.error("Oops, gagal mengambil screenshot:", err);
        alert("Maaf, gagal menyimpan gambar. Silakan coba screenshot manual.");
         // Tampilkan kembali tombol jika error
        // downloadButton.style.display = 'inline-flex';
    });
}


// Tambahkan event listeners
function addEventListeners() {
    const inputs = document.querySelectorAll('.score-input');
    inputs.forEach(input => {
        input.addEventListener('input', () => {
            const row = input.closest('tr');
            const rowIndex = row.getAttribute('data-index');
            calculateRow(rowIndex); // Hitung baris yang diubah
            calculateAll();       // Hitung ulang GPA keseluruhan
        });
    });

    // Event listener untuk tombol download
    document.getElementById('downloadBtn').addEventListener('click', downloadScreenshot);
}