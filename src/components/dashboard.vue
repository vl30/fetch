<script setup>
import { ref, onMounted } from 'vue';

const studentData = ref({});
const jadwalData = ref([]);
const pengumumanData = ref([]);
const showJadwalModal = ref(false);
const showPengumumanModal = ref(false);
const editMode = ref(false);
const editIndex = ref(-1);

const jadwalForm = ref({
	hari: '',
	jam: '',
	mata_pelajaran: '',
});

const pengumumanForm = ref({
	isi: '',
	tanggal: new Date().toISOString().split('T')[0],
});

const handleLogout = () => {
	localStorage.removeItem('loggedInStudent');
	window.location.href = '/login';
};

const fetchData = async () => {
	try {
		const jadwalResponse = await fetch('http://localhost:3001/api/jadwal');
		jadwalData.value = await jadwalResponse.json();

		const pengumumanResponse = await fetch('http://localhost:3001/api/pengumuman');
		pengumumanData.value = await pengumumanResponse.json();
	} catch (error) {
		console.error('Error fetching data:', error);
	}
};

const openJadwalModal = (mode = 'add', index = -1) => {
	editMode.value = mode === 'edit';
	editIndex.value = index;

	if (mode === 'edit') {
		const item = jadwalData.value[index];
		jadwalForm.value = { ...item };
	} else {
		jadwalForm.value = { hari: '', jam: '', mata_pelajaran: '' };
	}

	showJadwalModal.value = true;
};

const openPengumumanModal = (mode = 'add', index = -1) => {
	editMode.value = mode === 'edit';
	editIndex.value = index;

	if (mode === 'edit') {
		const item = pengumumanData.value[index];
		pengumumanForm.value = {
			isi: item.isi,
			tanggal: new Date(item.tanggal).toISOString().split('T')[0],
		};
	} else {
		pengumumanForm.value = { isi: '', tanggal: new Date().toISOString().split('T')[0] };
	}

	showPengumumanModal.value = true;
};

const saveJadwal = async () => {
	try {
		if (editMode.value) {
			await fetch(`http://localhost:3001/api/jadwal/${editIndex.value}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(jadwalForm.value),
			});
		} else {
			await fetch('http://localhost:3001/api/jadwal', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(jadwalForm.value),
			});
		}

		showJadwalModal.value = false;
		await fetchData();
	} catch (error) {
		console.error('Error saving jadwal:', error);
	}
};

const savePengumuman = async () => {
	try {
		if (editMode.value) {
			await fetch(`http://localhost:3001/api/pengumuman/${editIndex.value}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(pengumumanForm.value),
			});
		} else {
			await fetch('http://localhost:3001/api/pengumuman', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(pengumumanForm.value),
			});
		}

		showPengumumanModal.value = false;
		await fetchData();
	} catch (error) {
		console.error('Error saving pengumuman:', error);
	}
};

const deleteJadwal = async (index) => {
	if (confirm('Yakin ingin menghapus jadwal ini?')) {
		try {
			await fetch(`http://localhost:3001/api/jadwal/${index}`, {
				method: 'DELETE',
			});
			await fetchData();
		} catch (error) {
			console.error('Error deleting jadwal:', error);
		}
	}
};

const deletePengumuman = async (index) => {
	if (confirm('Yakin ingin menghapus pengumuman ini?')) {
		try {
			await fetch(`http://localhost:3001/api/pengumuman/${index}`, {
				method: 'DELETE',
			});
			await fetchData();
		} catch (error) {
			console.error('Error deleting pengumuman:', error);
		}
	}
};

onMounted(async () => {
	const loggedInStudent = localStorage.getItem('loggedInStudent');
	if (loggedInStudent) {
		studentData.value = JSON.parse(loggedInStudent);
	}

	await fetchData();
});
</script>

<template>
	<body>
		<!-- nabar -->
		<nav class="navbar navbar-expand-lg navbar-light shadow fixed-top">
			<div class="container">
				<a
					class="navbar-brand"
					href="#"
					>Dashboard</a
				>
				<button
					class="navbar-toggler"
					type="button"
					data-bs-toggle="collapse"
					data-bs-target="#navbarNav"
				>
					<span class="navbar-toggler-icon"></span>
				</button>
				<div
					class="collapse navbar-collapse"
					id="navbarNav"
				>
					<ul class="navbar-nav ms-auto">
						<li class="nav-item ms-2">
							<button
								class="btn btn-outline-dark"
								id="themeToggle"
							>
								<i class="bi bi-moon-fill"></i>
							</button>
						</li>
						<li class="nav-item">
							<a
								class="nav-link"
								href="#jadwal"
								>Jadwal</a
							>
						</li>
						<li class="nav-item">
							<a
								class="nav-link"
								href="#pengumuman"
								>Pengumuman</a
							>
						</li>
						<li class="nav-item dropdown">
							<a
								class="nav-link dropdown-toggle"
								href="#"
								role="button"
								data-bs-toggle="dropdown"
							>
								Kelola Data
							</a>
							<ul class="dropdown-menu">
								<li>
									<a
										class="dropdown-item"
										href="#"
										@click="openJadwalModal()"
										>Tambah Jadwal</a
									>
								</li>
								<li>
									<a
										class="dropdown-item"
										href="#"
										@click="openPengumumanModal()"
										>Tambah Pengumuman</a
									>
								</li>
							</ul>
						</li>
						<li class="nav-item">
							<button
								class="btn btn-warning"
								@click="handleLogout"
							>
								Logout
							</button>
						</li>
					</ul>
				</div>
			</div>
		</nav>
		<!-- navbar akhir -->
		<!-- home -->
		<div
			class="jumbotron text-center pt-5"
			id="home"
		>
			<img
				:src="studentData.foto || 'https://via.placeholder.com/150'"
				alt="Student Photo"
				width="200px"
				class="rounded-circle img-thumbnail"
			/>
			<h1 class="display-4">{{ studentData.nama || 'Welcome' }}</h1>
			<p class="lead">{{ studentData.kelas || 'Student' }} | {{ studentData.nis || '-' }}</p>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 1440 320"
			>
				<path
					fill="white"
					fill-opacity="1"
					d="M0,256L20,245.3C40,235,80,213,120,176C160,139,200,85,240,69.3C280,53,320,75,360,80C400,85,440,75,480,101.3C520,128,560,192,600,208C640,224,680,192,720,170.7C760,149,800,139,840,144C880,149,920,171,960,192C1000,213,1040,235,1080,250.7C1120,267,1160,277,1200,272C1240,267,1280,245,1320,208C1360,171,1400,117,1420,90.7L1440,64L1440,320L1420,320C1400,320,1360,320,1320,320C1280,320,1240,320,1200,320C1160,320,1120,320,1080,320C1040,320,1000,320,960,320C920,320,880,320,840,320C800,320,760,320,720,320C680,320,640,320,600,320C560,320,520,320,480,320C440,320,400,320,360,320C320,320,280,320,240,320C200,320,160,320,120,320C80,320,40,320,20,320L0,320Z"
				></path>
			</svg>
		</div>
		<!-- home akhir -->

		<!-- jadwal -->
		<section
			id="jadwal"
			class="py-5"
		>
			<div class="container">
				<div class="row text-center mb-5">
					<div class="col">
						<h2>Jadwal Pelajaran</h2>
						<p class="text-muted">Jadwal mata pelajaran mingguan</p>
					</div>
				</div>
				<div class="row">
					<div
						v-for="(item, index) in jadwalData"
						:key="index"
						class="col-md-4 mb-4"
					>
						<div class="card h-100 shadow-sm">
							<div class="card-header text-white d-flex justify-content-between align-items-center">
								<h5 class="card-title mb-0">{{ item.hari }}</h5>
								<div>
									<button
										class="btn btn-sm btn-light me-1"
										@click="openJadwalModal('edit', index)"
									>
										<i class="bi bi-pencil"></i>
									</button>
									<button
										class="btn btn-sm btn-danger"
										@click="deleteJadwal(index)"
									>
										<i class="bi bi-trash"></i>
									</button>
								</div>
							</div>
							<div class="card-body">
								<h6 class="card-subtitle mb-2 text-muted">{{ item.jam }}</h6>
								<p class="card-text">{{ item.mata_pelajaran }}</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
		<!-- jadwal akhir -->

		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 1440 320"
		>
			<path
				fill="#FF894F"
				fill-opacity="1"
				d="M0,128L40,112C80,96,160,64,240,64C320,64,400,96,480,96C560,96,640,64,720,48C800,32,880,32,960,58.7C1040,85,1120,139,1200,133.3C1280,128,1360,64,1400,32L1440,0L1440,320L1400,320C1360,320,1280,320,1200,320C1120,320,1040,320,960,320C880,320,800,320,720,320C640,320,560,320,480,320C400,320,320,320,240,320C160,320,80,320,40,320L0,320Z"
			></path>
		</svg>

		<!-- pengumuman -->
		<section
			id="pengumuman"
			class="py-5"
		>
			<div class="container">
				<div class="row text-center mb-5">
					<div class="col">
						<h2>Pengumuman</h2>
						<p class="text-muted">Informasi terbaru dan pengumuman penting</p>
					</div>
				</div>
				<div class="row">
					<div
						v-for="(item, index) in pengumumanData"
						:key="index"
						class="col-md-6 mb-4"
					>
						<div class="card h-100 shadow-sm">
							<div class="card-body">
								<div class="d-flex justify-content-between align-items-start mb-3">
									<span class="badge bg-success">{{ new Date(item.tanggal).toLocaleDateString('id-ID') }}</span>
									<div>
										<button
											class="btn btn-sm btn-outline-primary me-1"
											@click="openPengumumanModal('edit', index)"
										>
											<i class="bi bi-pencil"></i>
										</button>
										<button
											class="btn btn-sm btn-outline-danger"
											@click="deletePengumuman(index)"
										>
											<i class="bi bi-trash"></i>
										</button>
									</div>
								</div>
								<p class="card-text">{{ item.isi }}</p>
							</div>
							<div class="card-footer bg-transparent">
								<small class="text-muted">
									<i class="bi bi-calendar-event me-1"></i>
									{{
										new Date(item.tanggal).toLocaleDateString('id-ID', {
											weekday: 'long',
											year: 'numeric',
											month: 'long',
											day: 'numeric',
										})
									}}
								</small>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
		<!-- pengumuman akhir -->

		<!-- add jadwal -->
		<div
			v-if="showJadwalModal"
			class="modal-backdrop"
		>
			<div class="modal-content">
				<div class="modal-header">
					<h5>{{ editMode ? 'Edit' : 'Tambah' }} Jadwal</h5>
					<button @click="showJadwalModal = false">&times;</button>
				</div>
				<div class="modal-body">
					<form @submit.prevent="saveJadwal">
						<div class="mb-3">
							<label class="form-label">Hari</label>
							<input
								v-model="jadwalForm.hari"
								type="text"
								class="form-control"
								required
							/>
						</div>
						<div class="mb-3">
							<label class="form-label">Jam</label>
							<input
								v-model="jadwalForm.jam"
								type="text"
								class="form-control"
								required
							/>
						</div>
						<div class="mb-3">
							<label class="form-label">Mata Pelajaran</label>
							<input
								v-model="jadwalForm.mata_pelajaran"
								type="text"
								class="form-control"
								required
							/>
						</div>
						<div class="d-flex justify-content-end">
							<button
								type="button"
								class="btn btn-secondary me-2"
								@click="showJadwalModal = false"
							>
								Batal
							</button>
							<button
								type="submit"
								class="btn btn-primary"
							>
								Simpan
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
		<!-- akhir add jadwal -->

		<!-- add pengumuman -->
		<div
			v-if="showPengumumanModal"
			class="modal-backdrop"
		>
			<div class="modal-content">
				<div class="modal-header">
					<h5>{{ editMode ? 'Edit' : 'Tambah' }} Pengumuman</h5>
					<button @click="showPengumumanModal = false">&times;</button>
				</div>
				<div class="modal-body">
					<form @submit.prevent="savePengumuman">
						<div class="mb-3">
							<label class="form-label">Isi Pengumuman</label>
							<textarea
								v-model="pengumumanForm.isi"
								class="form-control"
								rows="3"
								required
							></textarea>
						</div>
						<div class="mb-3">
							<label class="form-label">Tanggal</label>
							<input
								v-model="pengumumanForm.tanggal"
								type="date"
								class="form-control"
								required
							/>
						</div>
						<div class="d-flex justify-content-end">
							<button
								type="button"
								class="btn btn-secondary me-2"
								@click="showPengumumanModal = false"
							>
								Batal
							</button>
							<button
								type="submit"
								class="btn btn-primary"
							>
								Simpan
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
		<!-- akhir add pengumuman -->

		<!-- footer -->
		<footer class="bg-dark text-white py-4">
			<div class="container text-center">
				<p class="mb-0">&copy; 2025 Dashboard. By Naufal Dzakwan</p>
			</div>
		</footer>
		<!-- footer akhir -->
	</body>
</template>

<style scoped>
body {
	height: auto;
	min-height: 100vh;
}

.jumbotron {
	background: #ff894f;
	color: white;
	padding: 100px 0 0 0;
}

#pengumuman {
	background: #ff894f;
}

.card {
	transition: transform 0.3s ease;
}

.card:hover {
	transform: translateY(-5px);
}

.card-header {
	background: #ffcb61;
}

section {
	scroll-margin-top: 80px;
}

.modal-backdrop {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background: rgba(0, 0, 0, 0.5);
	display: flex;
	justify-content: center;
	align-items: center;
	z-index: 1000;
}

.modal-content {
	background: white;
	padding: 0;
	border-radius: 8px;
	width: 90%;
	max-width: 500px;
	max-height: 80vh;
	overflow-y: auto;
}

.modal-header {
	display: flex;
	justify-content: between;
	align-items: center;
	padding: 1rem;
	border-bottom: 1px solid #dee2e6;
}

.modal-header h5 {
	margin: 0;
	flex-grow: 1;
}

.modal-header button {
	background: none;
	border: none;
	font-size: 1.5rem;
	cursor: pointer;
}

.modal-body {
	padding: 1rem;
}

.btn {
	padding: 0.375rem 0.75rem;
	border-radius: 0.25rem;
	border: 1px solid transparent;
	cursor: pointer;
}

.btn-primary {
	background-color: #007bff;
	border-color: #007bff;
	color: white;
}

.btn-secondary {
	background-color: #6c757d;
	border-color: #6c757d;
	color: white;
}

.form-control {
	width: 100%;
	padding: 0.375rem 0.75rem;
	border: 1px solid #ced4da;
	border-radius: 0.25rem;
}

.form-label {
	margin-bottom: 0.5rem;
	font-weight: bold;
}

.mb-3 {
	margin-bottom: 1rem;
}
</style>
