// =========================================================
// DATA SAMPEL – 5 Mata Kuliah
// =========================================================
const sampleCourses = [
  { nama: "Kalkulus",                           sks: 0, tugas: 0, uts: 0, uas: 0 },
  { nama: "Fisika",                             sks: 0, tugas: 0, uts: 0, uas: 0 },
  { nama: "Dasar-Dasar Pemrograman",            sks: 0, tugas: 0, uts: 0, uas: 0 },
  { nama: "Bahasa Indonesia",                   sks: 0, tugas: 0, uts: 0, uas: 0 },
  { nama: "Pendidikan Agama Islam",             sks: 0, tugas: 0, uts: 0, uas: 0 }
];

// Data default info mahasiswa (untuk reset)
const defaultStudent = {
  nama:     "",
  nim:      "",
  semester: "",
  jurusan:  "",
};

// =========================================================
// BOBOT PENILAIAN
// =========================================================
const BOBOT_TUGAS = 0.40;   // 40 %
const BOBOT_UTS   = 0.30;   // 30 %
const BOBOT_UAS   = 0.30;   // 30 %

// =========================================================
// BACA INFO MAHASISWA DARI INPUT
// =========================================================

function getStudentInfo() {
  return {
    nama:     document.getElementById("inputNama").value.trim()     || "—",
    nim:      document.getElementById("inputNIM").value.trim()      || "—",
    semester: document.getElementById("inputSemester").value,
    jurusan:  document.getElementById("inputJurusan").value     //jurusan:  document.getElementById("inputJurusan").value.trim()  || "—"
  };
}

// =========================================================
// KONVERSI NILAI ANGKA → GRADE & BOBOT IP
// =========================================================
function getGradeInfo(nilai) {
  if (nilai >= 90) return { grade: "A",  bobot: 4.0 };
  if (nilai >= 80) return { grade: "AB", bobot: 3.7 };
  if (nilai >= 70) return { grade: "B", bobot: 3.3 };
  if (nilai >= 60) return { grade: "BC",  bobot: 3.0 };
  if (nilai >= 50) return { grade: "C",  bobot: 2.0 };
  return                   { grade: "D",  bobot: 0.0 };
}

// Kelas CSS untuk badge grade
function getGradeCssClass(grade) {
  const map = { "A": "A", "AB": "AB", "B": "B", "BC": "BC", "C": "C", "D": "D" };  //{ "A": "A", "AB": "AB", "B": "B", "BC": "BC", "C": "C", "D": "D" };
  return map[grade] || "";
}

// =========================================================
// BUAT BARIS TABEL
// =========================================================
function createRow(index, course) {
  const delay = index * 0.06; // stagger animasi

  const tr = document.createElement("tr");
  tr.style.animationDelay = delay + "s";
  tr.setAttribute("data-index", index);

  tr.innerHTML = `
    <td>${index + 1}</td>
    <td>
      <input type="text"
             class="input-name"
             value="${course.nama}"
             placeholder="Nama mata kuliah…"
             oninput="updateNama(${index}, this.value)" />
    </td>
    <td>
      <input type="number"
             class="input-sks"
             min="1" max="6"
             value="${course.sks}"
             oninput="updateSKS(${index}, this.value)" />
    </td>
    <td>
      <input type="number"
             class="input-score"
             min="0" max="100"
             value="${course.tugas}"
             placeholder="0"
             oninput="updateScore(${index}, 'tugas', this.value)" />
    </td>
    <td>
      <input type="number"
             class="input-score"
             min="0" max="100"
             value="${course.uts}"
             placeholder="0"
             oninput="updateScore(${index}, 'uts', this.value)" />
    </td>
    <td>
      <input type="number"
             class="input-score"
             min="0" max="100"
             value="${course.uas}"
             placeholder="0"
             oninput="updateScore(${index}, 'uas', this.value)" />
    </td>
    <td class="cell-final" id="final-${index}">—</td>
    <td><span class="grade-badge" id="badge-${index}">—</span></td>
  `;

  return tr;
}

// =========================================================
// INISIALISASI TABEL
// =========================================================
function initTable() {
  const tbody = document.getElementById("tableBody");
  tbody.innerHTML = "";

  sampleCourses.forEach((course, i) => {
    tbody.appendChild(createRow(i, course));
  });

  // Hitung nilai akhir per baris saat halaman dibuka
  sampleCourses.forEach((_, i) => updateRow(i));
}

// =========================================================
// UPDATE HANDLER (live saat user mengetik)
// =========================================================
function updateNama(index, val) {
  sampleCourses[index].nama = val;
}

function updateSKS(index, val) {
  let n = parseInt(val);
  if (isNaN(n) || n < 1) n = 1;
  if (n > 6) n = 6;
  sampleCourses[index].sks = n;
}

function updateScore(index, field, val) {
  let n = parseFloat(val);
  if (isNaN(n) || n < 0) n = 0;
  if (n > 100) n = 100;
  sampleCourses[index][field] = n;
  updateRow(index);
}

// =========================================================
// HITUNG & TAMPILKAN NILAI AKHIR + GRADE PER BARIS
// =========================================================
function updateRow(index) {
  const c = sampleCourses[index];

  // Nilai akhir berbobot
  const nilai = (c.tugas * BOBOT_TUGAS) + (c.uts * BOBOT_UTS) + (c.uas * BOBOT_UAS);
  const nilai_round = Math.round(nilai * 100) / 100;

  // Tampilkan nilai akhir
  const finalEl = document.getElementById("final-" + index);
  finalEl.textContent = nilai_round.toFixed(2);

  // Grade & badge
  const info = getGradeInfo(nilai_round);
  const badgeEl = document.getElementById("badge-" + index);
  badgeEl.textContent = info.grade;
  badgeEl.className = "grade-badge " + getGradeCssClass(info.grade);
}

// =========================================================
// HITUNG IP (Indeks Prestasi) KESELURUHAN
// =========================================================
function calculateIP() {
  let totalBobot = 0;   // Σ (bobot_grade × SKS)
  let totalSKS   = 0;   // Σ SKS

  sampleCourses.forEach((c, i) => {
    const nilai = (c.tugas * BOBOT_TUGAS) + (c.uts * BOBOT_UTS) + (c.uas * BOBOT_UAS);
    const info  = getGradeInfo(nilai);
    totalBobot += info.bobot * c.sks;
    totalSKS   += c.sks;
  });

  const ip = totalSKS > 0 ? totalBobot / totalSKS : 0;

  // Tampilkan hasil
  const ipEl     = document.getElementById("resultIP");
  const statusEl = document.getElementById("resultStatus");

  ipEl.textContent = ip.toFixed(2);

  // Tentukan kategori & warna
  let cls, status;
  if (ip >= 3.5)      { cls = "good";  status = "✦ Prestasi Sangat Baik – Pertahankan!"; }
  else if (ip >= 3.0) { cls = "ok";    status = "✦ Prestasi Baik – Terus semangat!"; }
  else if (ip >= 2.0) { cls = "warn";  status = "⚠ Prestasi Cukup – Perlu peningkatan"; }
  else                { cls = "bad";    status = "✗ Prestasi Kurang – Konsultasikan dengan dosen"; }

  // Animasi: lepas & pasang ulang class
  ipEl.classList.remove("good", "ok", "warn", "bad");
  statusEl.classList.remove("good", "ok", "warn", "bad");

  // Trigger reflow agar animasi kelas berjalan ulang
  void ipEl.offsetWidth;

  ipEl.classList.add(cls);
  statusEl.classList.add(cls);
  statusEl.textContent = status;

  // Tampilkan info mahasiswa di kartu hasil
  const student = getStudentInfo();
  document.getElementById("resultMeta").innerHTML = `
    <div class="result-meta-item">
      <span class="meta-label">Nama</span>
      <span class="meta-value highlight">${student.nama}</span>
    </div>
    <div class="result-meta-item">
      <span class="meta-label">NIM</span>
      <span class="meta-value">${student.nim}</span>
    </div>
    <div class="result-meta-item">
      <span class="meta-label">Semester</span>
      <span class="meta-value highlight">Semester ${student.semester}</span>
    </div>
    <div class="result-meta-item">
      <span class="meta-label">Jurusan</span>
      <span class="meta-value">${student.jurusan}</span>
    </div>
  `;
}

// =========================================================
// RESET FORM
// =========================================================
function resetForm() {
  // Kembalikan ke data sampel awal – mata kuliah
  const defaults = [
  { nama: "",            sks: 0, tugas: 0, uts: 0, uas: 0 },
  { nama: "",            sks: 0, tugas: 0, uts: 0, uas: 0 },
  { nama: "",            sks: 0, tugas: 0, uts: 0, uas: 0 },
  { nama: "",            sks: 0, tugas: 0, uts: 0, uas: 0 },
  { nama: "",            sks: 0, tugas: 0, uts: 0, uas: 0 }
  ];

  defaults.forEach((d, i) => {
    sampleCourses[i] = { ...d };
  });

  initTable();

  // Reset input info mahasiswa ke default
  document.getElementById("inputNama").value     = defaultStudent.nama;
  document.getElementById("inputNIM").value      = defaultStudent.nim;
  document.getElementById("inputSemester").value = defaultStudent.semester;
  document.getElementById("inputJurusan").value  = defaultStudent.jurusan;

  // Reset tampilan kartu hasil
  document.getElementById("resultIP").textContent    = "0.00";
  document.getElementById("resultIP").className      = "result-ip";
  document.getElementById("resultStatus").textContent = "—";
  document.getElementById("resultStatus").className  = "result-status";
  document.getElementById("resultMeta").innerHTML    = "";
}

// =========================================================
// JALANKAN SAAT DOM SIAP
// =========================================================
document.addEventListener("DOMContentLoaded", initTable);
