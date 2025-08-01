<template>
  <nav class="navbar navbar-expand-md custom-nav">
    <div class="container">
      <RouterLink class="navbar-brand" :to="{ name: 'home' }">{{
        brandName
      }}</RouterLink>
      <ul class="navbar-nav">
        <li class="nav-item">
          <RouterLink class="nav-link" :to="{ name: 'home' }">Anasayfa</RouterLink>
        </li>
        <li class="nav-item">
          <RouterLink class="nav-link" :to="{ name: 'books' }"
            >Kitaplar</RouterLink
          >
        </li>
        <li class="nav-item" v-if="isLoggedIn">
          <RouterLink class="nav-link" :to="{ name: 'dashboard' }"
            >Profil</RouterLink
          >
        </li>
        <li class="nav-item" v-if="!isLoggedIn">
          <RouterLink class="nav-link" :to="{ name: 'login' }"
            >Giriş Yap</RouterLink
          >
        </li>
        <li class="nav-item" v-if="!isLoggedIn">
          <RouterLink class="nav-link" :to="{ name: 'register' }"
            >Kayıt Ol</RouterLink
          >
        </li>
        <li class="nav-item" v-if="isLoggedIn">
          <button class="nav-link" @click="logoutUser">Çıkış Yap</button>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script>
import { useAuthStore } from '@/stores/authStore.js';
import { mapState, mapActions } from 'pinia';
export default {
  name: 'NavBar',
  data() {
    return {
      brandName: 'Kitap Dünyası',
    };
  },
  computed: {
    ...mapState(useAuthStore, ['isLoggedIn']),
  },
  methods: {
    ...mapActions(useAuthStore, ['logout']),
    logoutUser() {
      this.logout();
    },
  },
};
</script>

<style scoped>
.custom-nav {
  background-color: var(--primary-color);
  padding: 15px 0;
}

.navbar-brand {
  padding: 0;
  margin: 0;
  color: #fff;
  font-size: 24px;
  font-weight: bold;
}

.nav-link {
  padding: 10px 15px !important;
  color: #fff;
  text-align: center;
}

.nav-link:hover {
  color: var(--secondary-color);
}

.active-link {
  color: var(--secondary-color);
}
</style>
