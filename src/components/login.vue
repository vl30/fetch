<template>
	<div class="loginBox">
		<img
			class="user"
			src="https://i.ibb.co/yVGxFPR/2.png"
			height="100px"
			width="100px"
		/>
		<h3>Sign in here</h3>
		<form @submit.prevent="handleLogin">
			<div class="inputBox">
				<input
					id="uname"
					type="text"
					name="Username"
					placeholder="NIS"
					v-model="nis"
					required
				/>
			</div>
			<input
				type="submit"
				name=""
				value="Login"
			/>
		</form>
		<div
			v-if="errorMessage"
			class="error-message"
		>
			{{ errorMessage }}
		</div>
		<div
			v-if="successMessage"
			class="success-message"
		>
			{{ successMessage }}
		</div>
		<div class="text-center">
			<a
				style="color: #59238f"
				href="/register"
				>Sign-Up</a
			>
		</div>
	</div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const nis = ref('');
const errorMessage = ref('');
const successMessage = ref('');
let studentData = ref(null);

onMounted(async () => {
	const response = await fetch('http://localhost:3001/api/siswa');
	studentData.value = await response.json();
});

const handleLogin = () => {
	errorMessage.value = '';
	successMessage.value = '';

	if (!nis.value) {
		errorMessage.value = 'Please enter NIS';
		return;
	}

	if (Array.isArray(studentData.value)) {
		const found = studentData.value.find((s) => s.nis === nis.value);
		if (found) {
			localStorage.setItem('loggedInStudent', JSON.stringify(found));
			successMessage.value = `Welcome, ${found.nama}!`;
			setTimeout(() => (window.location.href = '/dashboard'), 1500);
		} else {
			errorMessage.value = 'NIS tidak di temukan';
		}
	} else if (studentData.value && studentData.value.nis === nis.value) {
		localStorage.setItem('loggedInStudent', JSON.stringify(studentData.value));
		successMessage.value = `Welcome, ${studentData.value.nama}!`;
		setTimeout(() => (window.location.href = '/dashboard'), 1500);
	} else {
		errorMessage.value = 'NIS tidak di temukan';
	}
};
</script>

<style scoped>
body {
	margin: 0;
	padding: 0;
	height: 100vh;
	font-family: sans-serif;
	background-size: cover;
	background-repeat: no-repeat;
	background-position: center;
	overflow: hidden;
}

#particles-js {
	height: 100%;
}
.loginBox {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	width: 350px;
	min-height: 200px;
	background: #000000;
	border-radius: 10px;
	padding: 40px;
	box-sizing: border-box;
}
.user {
	margin: 0 auto;
	display: block;
	margin-bottom: 20px;
}
h3 {
	margin: 0;
	padding: 0 0 20px;
	color: #59238f;
	text-align: center;
}
.loginBox input {
	width: 100%;
	margin-bottom: 20px;
}
.loginBox input[type='text'] {
	border: none;
	border-bottom: 2px solid #262626;
	outline: none;
	height: 40px;
	color: #fff;
	background: transparent;
	font-size: 16px;
	padding-left: 20px;
	box-sizing: border-box;
}
.loginBox input[type='text']:hover {
	color: #42f3fa;
	border: 1px solid #42f3fa;
	box-shadow: 0 0 5px rgba(0, 255, 0, 0.3), 0 0 10px rgba(0, 255, 0, 0.2), 0 0 15px rgba(0, 255, 0, 0.1), 0 2px 0 black;
}
.loginBox input[type='text']:focus {
	border-bottom: 2px solid #42f3fa;
}
.inputBox {
	position: relative;
}
.inputBox span {
	position: absolute;
	top: 10px;
	color: #262626;
}
.loginBox input[type='submit'] {
	border: none;
	outline: none;
	height: 40px;
	font-size: 16px;
	background: #59238f;
	color: #fff;
	border-radius: 20px;
	cursor: pointer;
}
.loginBox input[type='submit']:hover {
	background: #6a2a9f;
}
.loginBox a {
	color: #262626;
	font-size: 14px;
	font-weight: bold;
	text-decoration: none;
	text-align: center;
	display: block;
}
a:hover {
	color: #00ffff;
}
p {
	color: #0000ff;
}

.error-message {
	color: #ff4444;
	background: rgba(255, 68, 68, 0.1);
	border: 1px solid #ff4444;
	padding: 10px;
	margin: 10px 0;
	border-radius: 5px;
	text-align: center;
	font-size: 14px;
}

.success-message {
	color: #44ff44;
	background: rgba(68, 255, 68, 0.1);
	border: 1px solid #44ff44;
	padding: 10px;
	margin: 10px 0;
	border-radius: 5px;
	text-align: center;
	font-size: 14px;
}
</style>
