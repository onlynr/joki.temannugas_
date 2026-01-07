/**
 * JOKI TEMAN NUGAS - JAVASCRIPT
 * Fungsi untuk menangani redirect ke WhatsApp dengan pesan otomatis
 */

// Konfigurasi nomor WhatsApp (ganti dengan nomor yang sebenarnya)
// Format: 628xxxxxxxxxx (tanpa tanda + atau -)
const WHATSAPP_NUMBER = "6285954773849"; // GANTI DENGAN NOMOR WHATSAPP ANDA

/**
 * Fungsi untuk membuat URL WhatsApp dengan pesan otomatis
 * @param {string} nama - Nama pelanggan
 * @param {string} kontak - Kontak WhatsApp pelanggan
 * @param {string} jenisTugas - Jenis tugas yang dipilih
 * @param {string} detailTugas - Detail tugas dan deadline
 * @returns {string} URL WhatsApp dengan pesan yang sudah di-encode
 */
function createWhatsAppURL(nama, kontak, jenisTugas, detailTugas) {
    // Template pesan WhatsApp
    const message = `Hai kak, saya ingin order joki tugas:

*Nama:* ${nama}
*Kontak:* ${kontak}
*Jenis Tugas:* ${jenisTugas}
*Detail Tugas & Deadline:*
${detailTugas}

Mohon informasi estimasi harga dan waktu pengerjaannya. Terima kasih!`;

    // Encode pesan untuk URL
    const encodedMessage = encodeURIComponent(message);

    // Buat URL WhatsApp
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
}

/**
 * Fungsi untuk redirect ke WhatsApp
 * @param {string} url - URL WhatsApp yang akan dibuka
 */
function redirectToWhatsApp(url) {
    window.open(url, '_blank');
}

/**
 * Event listener untuk tombol CTA di Hero Section
 */
document.getElementById('heroCtaBtn').addEventListener('click', function (e) {
    e.preventDefault();

    // Pesan default untuk tombol CTA
    const defaultMessage = encodeURIComponent('Hai kak, saya tertarik dengan layanan Joki Teman Nugas. Bisa minta informasi lebih lanjut?');
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${defaultMessage}`;

    redirectToWhatsApp(url);
});

/**
 * File upload handling
 */
let uploadedFiles = [];
const MAX_FILES = 5;

const fileUploadInput = document.getElementById('fileUpload');
const fileListContainer = document.getElementById('fileList');

/**
 * Format ukuran file ke format yang mudah dibaca
 * @param {number} bytes - Ukuran file dalam bytes
 * @returns {string} Ukuran file yang sudah diformat
 */
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Dapatkan icon berdasarkan tipe file
 * @param {string} fileName - Nama file
 * @returns {string} Emoji icon
 */
function getFileIcon(fileName) {
    const extension = fileName.split('.').pop().toLowerCase();
    const icons = {
        'pdf': '📄',
        'doc': '📝',
        'docx': '📝',
        'ppt': '📊',
        'pptx': '📊',
        'xls': '📊',
        'xlsx': '📊'
    };
    return icons[extension] || '📎';
}

/**
 * Render daftar file yang sudah diupload
 */
function renderFileList() {
    fileListContainer.innerHTML = '';

    uploadedFiles.forEach((file, index) => {
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item';
        fileItem.innerHTML = `
            <div class="file-item-info">
                <span class="file-item-icon">${getFileIcon(file.name)}</span>
                <span class="file-item-name">${file.name}</span>
                <span class="file-item-size">(${formatFileSize(file.size)})</span>
            </div>
            <button type="button" class="file-item-remove" data-index="${index}" title="Hapus file">✕</button>
        `;
        fileListContainer.appendChild(fileItem);
    });

    // Add event listeners untuk tombol remove
    document.querySelectorAll('.file-item-remove').forEach(button => {
        button.addEventListener('click', function () {
            const index = parseInt(this.getAttribute('data-index'));
            removeFile(index);
        });
    });
}

/**
 * Hapus file dari daftar
 * @param {number} index - Index file yang akan dihapus
 */
function removeFile(index) {
    uploadedFiles.splice(index, 1);
    renderFileList();

    // Reset input file
    fileUploadInput.value = '';
}

/**
 * Event listener untuk file upload
 */
fileUploadInput.addEventListener('change', function (e) {
    const files = Array.from(e.target.files);

    // Validasi jumlah file
    if (uploadedFiles.length + files.length > MAX_FILES) {
        alert(`Maksimal ${MAX_FILES} file yang dapat diupload!`);
        return;
    }

    // Tambahkan file ke array
    uploadedFiles.push(...files);

    // Render file list
    renderFileList();
});

/**
 * Event listener untuk form order
 */
document.getElementById('orderForm').addEventListener('submit', function (e) {
    e.preventDefault();

    // Ambil nilai dari form
    const nama = document.getElementById('nama').value.trim();
    const kontak = document.getElementById('kontak').value.trim();
    const jenisTugas = document.getElementById('jenisTugas').value;
    const detailTugas = document.getElementById('detailTugas').value.trim();

    // Validasi form
    if (!nama || !kontak || !jenisTugas || !detailTugas) {
        alert('Mohon lengkapi semua field yang diperlukan!');
        return;
    }

    // Validasi nomor WhatsApp (harus dimulai dengan 08 atau 62)
    if (!kontak.match(/^(08|62)/)) {
        alert('Format nomor WhatsApp tidak valid. Gunakan format 08xxxxxxxxxx atau 628xxxxxxxxxx');
        return;
    }

    // Buat pesan dengan informasi file
    let message = `Halo, saya ingin order joki tugas:

*Nama:* ${nama}
*Kontak:* ${kontak}
*Jenis Tugas:* ${jenisTugas}
*Detail Tugas & Deadline:*
${detailTugas}`;

    // Tambahkan informasi file jika ada
    if (uploadedFiles.length > 0) {
        message += `\n\n*File Terlampir:* ${uploadedFiles.length} file`;
        uploadedFiles.forEach((file, index) => {
            message += `\n${index + 1}. ${file.name} (${formatFileSize(file.size)})`;
        });
        message += `\n\n_Catatan: File akan saya kirim setelah chat ini_`;
    }

    message += `\n\nMohon informasi estimasi harga dan waktu pengerjaannya. Terima kasih!`;

    // Encode pesan untuk URL
    const encodedMessage = encodeURIComponent(message);
    const whatsappURL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;

    // Redirect ke WhatsApp
    redirectToWhatsApp(whatsappURL);

    // Reset form setelah submit (opsional)
    // this.reset();
    // uploadedFiles = [];
    // renderFileList();
});

/**
 * Smooth scroll untuk navigasi (jika ada anchor links)
 */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');

        // Skip jika href hanya "#" (untuk CTA button)
        if (href === '#') {
            return;
        }

        e.preventDefault();
        const target = document.querySelector(href);

        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

/**
 * Animasi fade-in saat scroll (opsional - untuk pengalaman lebih baik)
 */
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function (entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe semua section untuk animasi
document.querySelectorAll('section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(20px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(section);
});

// Hero section langsung terlihat
document.querySelector('.hero').style.opacity = '1';
document.querySelector('.hero').style.transform = 'translateY(0)';

/**
 * Navigation active state handler
 */
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');

function setActiveNav() {
    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;

        if (window.pageYOffset >= sectionTop - 100) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

// Update active nav on scroll
window.addEventListener('scroll', setActiveNav);

// Set initial active state
setActiveNav();
