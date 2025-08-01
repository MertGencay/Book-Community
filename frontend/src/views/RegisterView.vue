<template>
  <section class="full-section-height">
    <div class="container">
      <div class="d-flex justify-content-center">
        <h1 class="display-3" style="font-size: 50px;">📚 Kayıt Ol ve Kitap Dünyasına Katıl!</h1>
      </div>
      <form @submit.prevent="submitForm">
        <div v-if="showGenericWarningMessage" class="text-center">
          <span class="text-danger small"
            >Something happened, please try again later!</span
          >
        </div>
        <div class="row justify-content-center">
          <!-- Username Field (Medium and Larger Screens) -->
          <div class="col-md-6 col-8 mb-3">
            <label for="username" class="form-label mt-4"
              >Kullanıcı Adı
              <span class="text-danger">*</span>
            </label>
            <input
              type="text"
              class="form-control"
              id="username"
              name="username"
              v-model.trim="formData.username"
              required
              autocomplete="off"
              :class="{
                'is-valid': isUsernameValid,
                'is-invalid': !isUsernameValid && showUsernameWarningMessage,
              }"
              @focus="showUsernameWarningMessage = true"
              @blur="showUsernameWarningMessage = false"
            />
            <span
              v-if="showUsernameWarningMessage && !isUsernameValid"
              class="text-danger small"
              >Kullanıcı adınız 5 ve 20 karakter arasında olmalıdır!</span
            >
          </div>
        </div>

        <div class="row justify-content-center">
          <!-- Email Field (Medium and Larger Screens) -->
          <div class="col-md-6 col-8 mb-3">
            <label for="email" class="form-label"
              >E-Posta
              <span class="text-danger">*</span>
            </label>
            <input
              type="email"
              class="form-control"
              id="email"
              name="email"
              v-model.trim="formData.email"
              required
              autocomplete="off"
              :class="{
                'is-valid': isEmailValid,
                'is-invalid':
                  (!isEmailValid && showEmailWarningMessage) ||
                  existingEmail === formData.email,
              }"
              @focus="showEmailWarningMessage = true"
              @blur="showEmailWarningMessage = false"
            />
            <span
              v-if="showEmailWarningMessage && !isEmailValid"
              class="text-danger small"
              >Lütfen geçerli bir e-posta adresi giriniz!</span
            >
            <span
              v-if="existingEmail === formData.email"
              class="text-danger small"
            >
              {{ `${existingEmail} is already exist!` }}</span
            >
          </div>
        </div>

        <!-- Password Field -->
        <div class="row justify-content-center">
          <div class="col-md-6 col-8 mb-3">
            <label for="password" class="form-label"
              >Şifre
              <span class="text-danger">*</span>
            </label>
            <input
              type="password"
              class="form-control"
              id="password"
              name="password"
              v-model.trim="formData.password"
              required
              :class="{
                'is-valid': isPasswordValid,
                'is-invalid': !isPasswordValid && showPasswordWarningMessage,
              }"
              @focus="showPasswordWarningMessage = true"
              @blur="showPasswordWarningMessage = false"
            />
            <span
              v-if="showPasswordWarningMessage && !isPasswordValid"
              class="text-danger small"
              >Şifreniz 4 ve 10 karakter arasında olmalıdır!</span
            >
          </div>
        </div>

        <!-- Submit Button -->
        <div class="row justify-content-center">
          <div class="col-md-6 col-8 mb-3">
            <button
              :disabled="!isFormValid"
              type="submit"
              class="btn btn-primary w-100"
            >
              Kayıt Ol
            </button>
            <span v-if="!isFormValid" class="text-danger small"
              >* Lütfen zorunlu alanların hepsini doldurunuz!</span
            >
          </div>
        </div>
      </form>
    </div>
  </section>
</template>

<script setup>
import { useAuthStore } from '@/stores/authStore.js';
import { mapActions } from 'pinia';
import { useToast } from 'vue-toastification';
import { ref, reactive, computed } from 'vue';
import { useRouter } from 'vue-router';

const formData = reactive({
  username: '',
  email: '',
  password: '',
});

const showUsernameWarningMessage = ref(false);
const showEmailWarningMessage = ref(false);
const showPasswordWarningMessage = ref(false);
const existingEmail = ref(null);
const showGenericWarningMessage = ref(false);

const authStore = useAuthStore();
const router = useRouter();

const submitForm = async () => {
  try {
    await authStore.register(formData);

    const toast = useToast();

    toast.success('You will be redirected to the login page', {
      position: 'top-right',
      timeout: 3500,
      closeButton: 'button',
      icon: true,
      rtl: false,
    });

    setTimeout(() => {
      router.push('/login');
    }, 4000);
  } catch (data) {
    const { error } = data;

    if (error === 'The Email is already exist!') {
      existingEmail.value = formData.email;
    } else {
      showGenericWarningMessage.value = true;

      formData.username = '';
      formData.email = '';
      formData.password = '';
    }
  }
};

const isFormValid = computed(
  () => isUsernameValid.value && isEmailValid.value && isPasswordValid.value
);
const isUsernameValid = computed(
  () => formData.username.length >= 5 && formData.username.length <= 20
);

const isEmailValid = computed(() =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
);

const isPasswordValid = computed(
  () => formData.password.length >= 4 && formData.password.length <= 10
);
</script>

<style scoped></style>
