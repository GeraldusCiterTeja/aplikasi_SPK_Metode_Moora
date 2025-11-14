// Data Global untuk Aplikasi
let criteria = [
    // Contoh Data Awal
    { id: 'C1', name: 'Harga', weight: 0.30, type: 'cost' },
    { id: 'C2', name: 'Performa', weight: 0.40, type: 'benefit' },
    { id: 'C3', name: 'Portabilitas', weight: 0.15, type: 'benefit' },
    { id: 'C4', name: 'Baterai', weight: 0.15, type: 'benefit' }
];
let alternatives = [
    // Contoh Data Awal
    { id: 1, name: 'Laptop A' },
    { id: 2, name: 'Laptop B' },
    { id: 3, name: 'Laptop C' }
];
// Matriks Keputusan Awal (disimpan sebagai skor alternatif)
let decisionMatrix = {
    // format: { altId: { C1: score, C2: score, ... } }
    1: { C1: 15000000, C2: 85, C3: 7, C4: 8 },
    2: { C1: 12000000, C2: 75, C3: 9, C4: 10 },
    3: { C1: 18000000, C2: 90, C3: 6, C4: 7 }
};

// --- FUNGSI UTAMA MANAJEMEN DATA (CRUD Sederhana) ---

/** Menggambar ulang tabel kriteria */
function renderCriteria() {
    const tableBody = document.querySelector('#criteria-table tbody');
    tableBody.innerHTML = '';
    
    criteria.forEach((c, index) => {
        const row = tableBody.insertRow();
        row.insertCell(0).textContent = c.id;
        row.insertCell(1).textContent = c.name;
        row.insertCell(2).textContent = `${(c.weight * 100).toFixed(0)}%`;
        row.insertCell(3).textContent = c.type.toUpperCase();
        
        const actionCell = row.insertCell(4);
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Hapus';
        deleteBtn.className = 'btn btn-danger';
        deleteBtn.onclick = () => deleteCriterion(index);
        actionCell.appendChild(deleteBtn);
    });

    renderDecisionMatrix();
}

/** Menambahkan kriteria baru */
function addCriterion() {
    const nextId = 'C' + (criteria.length + 1);
    const formHtml = `
        <div class="form-group" id="temp-crit-input">
            <input type="text" id="crit-name" placeholder="Nama Kriteria" value="Kriteria ${criteria.length + 1}">
            <input type="number" id="crit-weight" placeholder="Bobot (0-1)" step="0.05" min="0" max="1">
            <select id="crit-type">
                <option value="benefit">Benefit</option>
                <option value="cost">Cost</option>
            </select>
            <button onclick="saveCriterion('${nextId}')" class="btn btn-success">Simpan</button>
            <button onclick="cancelCriterion()" class="btn btn-danger">Batal</button>
        </div>
    `;
    document.getElementById('criteria-form').insertAdjacentHTML('beforeend', formHtml);
    document.querySelector('.btn-primary').disabled = true; // Disable tombol tambah
}

/** Menyimpan kriteria yang baru ditambahkan */
function saveCriterion(id) {
    const name = document.getElementById('crit-name').value;
    const weight = parseFloat(document.getElementById('crit-weight').value);
    const type = document.getElementById('crit-type').value;

    if (!name || isNaN(weight) || weight <= 0) {
        alert("Nama dan Bobot Kriteria harus diisi dan Bobot harus > 0.");
        return;
    }

    // Pastikan total bobot tidak melebihi 1
    const currentTotalWeight = criteria.reduce((sum, c) => sum + c.weight, 0);
    if (currentTotalWeight + weight > 1.05) { // Toleransi float
        alert(`Total bobot saat ini adalah ${(currentTotalWeight * 100).toFixed(0)}%. Penambahan ini akan melebihi 100%.`);
        return;
    }

    criteria.push({ id, name, weight, type });
    document.getElementById('temp-crit-input').remove();
    document.querySelector('.btn-primary').disabled = false;
    renderCriteria();
}

/** Membatalkan penambahan kriteria */
function cancelCriterion() {
    document.getElementById('temp-crit-input').remove();
    document.querySelector('.btn-primary').disabled = false;
}

/** Menghapus kriteria */
function deleteCriterion(index) {
    const deletedId = criteria[index].id;
    criteria.splice(index, 1);
    
    // Hapus nilai kriteria dari decisionMatrix
    alternatives.forEach(alt => {
        delete decisionMatrix[alt.id][deletedId];
    });

    renderCriteria();
}

/** Menggambar ulang tabel alternatif */
function renderAlternatives() {
    const tableBody = document.querySelector('#alternatives-list tbody');
    tableBody.innerHTML = '';
    
    alternatives.forEach((alt, index) => {
        const row = tableBody.insertRow();
        row.insertCell(0).textContent = alt.name;
        
        const actionCell = row.insertCell(1);
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Hapus';
        deleteBtn.className = 'btn btn-danger';
        deleteBtn.onclick = () => deleteAlternative(index);
        actionCell.appendChild(deleteBtn);
    });
    
    renderDecisionMatrix();
}

/** Menambahkan alternatif baru */
function addAlternative() {
    const name = document.getElementById('alt-name').value.trim();
    if (name === '') {
        alert("Nama Alternatif harus diisi.");
        return;
    }
    
    const newId = alternatives.length > 0 ? Math.max(...alternatives.map(a => a.id)) + 1 : 1;
    alternatives.push({ id: newId, name: name });
    decisionMatrix[newId] = {}; // Inisialisasi skor alternatif baru
    
    document.getElementById('alt-name').value = '';
    renderAlternatives();
}

/** Menghapus alternatif */
function deleteAlternative(index) {
    const deletedId = alternatives[index].id;
    alternatives.splice(index, 1);
    delete decisionMatrix[deletedId]; // Hapus skor alternatif dari matriks
    renderAlternatives();
}

/** Menggambar ulang tabel Matriks Keputusan */
function renderDecisionMatrix() {
    const matrixSection = document.getElementById('matrix-section');
    const table = document.getElementById('decision-matrix-table');
    const thead = table.querySelector('thead tr');
    const tbody = table.querySelector('tbody');

    // Tampilkan/sembunyikan Matriks Keputusan
    if (alternatives.length > 0 && criteria.length > 0) {
        matrixSection.style.display = 'block';
    } else {
        matrixSection.style.display = 'none';
        return;
    }

    // 1. Update Header (Kriteria)
    thead.innerHTML = '<th>Alternatif</th>';
    criteria.forEach(c => {
        thead.innerHTML += `<th>${c.name} (${c.id})</th>`;
    });

    // 2. Update Body (Input Nilai)
    tbody.innerHTML = '';
    alternatives.forEach(alt => {
        const row = tbody.insertRow();
        row.insertCell(0).textContent = alt.name;
        
        // Pastikan ada entri di decisionMatrix
        if (!decisionMatrix[alt.id]) {
            decisionMatrix[alt.id] = {};
        }

        criteria.forEach(c => {
            const cell = row.insertCell();
            const input = document.createElement('input');
            input.type = 'number';
            input.step = 'any';
            input.value = decisionMatrix[alt.id][c.id] || 0; // Ambil nilai yang sudah ada atau default 0
            input.required = true;
            
            // Simpan nilai input saat berubah
            input.onchange = (e) => {
                decisionMatrix[alt.id][c.id] = parseFloat(e.target.value);
            };
            cell.appendChild(input);
        });
    });
}

// --- FUNGSI PERHITUNGAN MOORA INTI ---

function runMooraCalculation() {
    // 1. Validasi Data
    if (alternatives.length === 0 || criteria.length === 0) {
        alert("Harap masukkan setidaknya satu Kriteria dan satu Alternatif.");
        return;
    }
    const totalWeight = criteria.reduce((sum, c) => sum + c.weight, 0);
    if (Math.abs(totalWeight - 1.0) > 0.01) {
        alert(`Peringatan: Total Bobot Kriteria harus mendekati 100%. Saat ini: ${(totalWeight * 100).toFixed(1)}%.`);
        // Lanjutkan perhitungan meski ada peringatan, namun idealnya ini dicegah saat input
    }
    
    // 2. Menghitung Pembilang Vektor Normalisasi (Denominators)
    const denominators = {};
    criteria.forEach(c => {
        let sumSq = 0;
        alternatives.forEach(alt => {
            const value = decisionMatrix[alt.id][c.id] || 0;
            sumSq += Math.pow(value, 2);
        });
        denominators[c.id] = Math.sqrt(sumSq);
    });

    // 3. Menghitung Matriks Normalisasi Terbobot (Vij) & Total Benefit/Cost
    const results = alternatives.map(alt => {
        let totalBenefit = 0;
        let totalCost = 0;
        
        criteria.forEach(c => {
            const Xij = decisionMatrix[alt.id][c.id] || 0;
            const Wj = c.weight;
            const Denom = denominators[c.id];

            // Vektor Normalisasi: Xij* = Xij / Denom
            const normalizedValue = Denom !== 0 ? Xij / Denom : 0;

            // Normalisasi Terbobot: Vij = Wj * Xij*
            const Vij = Wj * normalizedValue;

            // Pisahkan untuk perhitungan Benefit dan Cost
            if (c.type.toLowerCase() === 'benefit') {
                totalBenefit += Vij;
            } else if (c.type.toLowerCase() === 'cost') {
                totalCost += Vij;
            }
        });
        
        // Perhitungan Nilai Optimasi (Yi)
        const Yi = totalBenefit - totalCost;

        return {
            name: alt.name,
            totalBenefit: totalBenefit,
            totalCost: totalCost,
            Yi: Yi
        };
    });

    // 4. Perangkingan
    results.sort((a, b) => b.Yi - a.Yi); // Urutkan Yi tertinggi ke terendah

    // 5. Menampilkan Hasil
    renderResults(results);
}

/** Menggambar ulang tabel hasil perangkingan */
function renderResults(results) {
    const resultsSection = document.getElementById('results-section');
    const tableBody = document.querySelector('#ranking-results tbody');
    tableBody.innerHTML = '';

    results.forEach((r, index) => {
        const row = tableBody.insertRow();
        row.insertCell(0).textContent = index + 1; // Peringkat
        row.insertCell(1).textContent = r.name;
        row.insertCell(2).textContent = r.totalBenefit.toFixed(4);
        row.insertCell(3).textContent = r.totalCost.toFixed(4);
        row.insertCell(4).textContent = r.Yi.toFixed(4);
    });

    resultsSection.style.display = 'block';
}

// --- INISIALISASI ---
document.addEventListener('DOMContentLoaded', () => {
    // Jalankan fungsi rendering awal untuk menampilkan data contoh
    renderCriteria();
    renderAlternatives();
});