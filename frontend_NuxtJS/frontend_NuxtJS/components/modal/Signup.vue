<template>
  <form action="#" method="post" @submit="checkForm">
    <section class="px-5 rounded-b-2xl">
      <div v-if="!isUserSignedUp">
        <div class="m-4">
          <input
            v-model="name"
            :class="[highlightNameWithError ? 'input border-red' : 'input']"
            type="text"
            placeholder="Your Name"
            @keyup="checkNameOnKeyUp(name)"
          >
          <p v-if="highlightNameWithError" class="help text-red">
            {{ nameErrorLabel }}
          </p>
        </div>
        <div class="m-4">
          <input
            v-model="email"
            :class="[highlightEmailWithError ? 'input border-red' : 'input']"
            type="email"
            placeholder="Email Address"
            name="emailName"
            @keyup="checkEmailOnKeyUp(email)"
          >
          <p v-if="highlightEmailWithError" class="help text-red">
            {{ emailErrorLabel }}
          </p>
        </div>
        <div class="m-4">
          <input
            v-model="password"
            :class="[highlightPasswordWithError ? 'input border-red' : 'input']"
            type="password"
            placeholder="Password"
            @keyup="checkPasswordOnKeyUp(password)"
          >
          <p v-if="highlightPasswordWithError" class="help text-red">
            {{ passwordErrorLabel }}
          </p>
        </div>
        <div class="m-4">
          <input
            v-model="repeatPassword"
            :class="[highlightRepeatPasswordWithError ? 'input border-red' : 'input']"
            type="password"
            placeholder="Re-password"
            @keyup="checkRepeatPasswordOnKeyUp(repeatPassword)"
          >
          <p v-if="highlightRepeatPasswordWithError" class="help text-red">
            {{ notEqualErrorLabel }}
          </p>
        </div>
      </div>
      <div v-if="isUserSignedUp">
        <div class="text-center">
          <div>
            <p class="text-2xl">
              Now you are a member
            </p>
            <p class="text-2xl">
              Please click login to join the shopping !!
            </p>
            <button class="rounded-xl p-3 bg-yellow text-white w-full hover:bg-yellow_hover font-semibold lg:w-1/3 my-1" @click="login(true)">
              Login Now
            </button>
          </div>
        </div>
      </div>
    </section>
    <div class="m-4 px-5">
      <button v-if="!isUserSignedUp" class="rounded-xl p-3 bg-yellow text-white w-full hover:bg-yellow_hover font-semibold lg:w-1/3">
        {{ primaryBtnLabel }}
      </button>
      <!-- <button v-if="isUserSignedUp" type="button" class="rounded-xl p-3 bg-grey_light text-grey_dark" @click="closeModal">
        {{ btnRegisteredLabel }}
      </button> -->
    </div>
  </form>
</template>

<script>
import { isValidEmail, isValidName, isValidPassword } from '@/assets/validators'

export default {
  name: 'Signup',

  data () {
    return {
      primaryBtnLabel: 'Sign up',
      notEqualErrorLabel: 'Passwords must be equal',
      passwordErrorLabel: 'Password required',
      nameErrorLabel: 'Name required',
      emailErrorLabel: 'Email required',
      emailNotValidLabel: 'Valid email required',
      name: '',
      email: '',
      password: '',
      repeatPassword: '',
      highlightNameWithError: null,
      highlightEmailWithError: null,
      highlightPasswordWithError: null,
      highlightRepeatPasswordWithError: null,
      isFormSuccess: false
    }
  },

  computed: {
    isUserSignedUp () {
      return this.$store.getters.isUserSignedUp
    },
    openModal () {
      if (this.$store.getters.isSignupModalOpen) {
        return true
      } else {
        return false
      }
    }
  },

  methods: {
    login (islogin) {
      this.$emit('to-login', islogin)
    },
    closeModal () {
      this.$store.commit('showSignupModal', false)
    },
    async checkForm (e) {
      e.preventDefault()

      try {
        if (this.name && isValidEmail(this.email) && isValidPassword(this.password) && this.repeatPassword) {
          await this.$api.auth.signup(this.name, this.email, this.password)
          // alert('thành công')
          this.highlightEmailWithError = false
          this.highlightPasswordWithError = false
          this.isFormSuccess = true
          this.$store.commit('setUserName', this.name)
          this.$store.commit('isUserSignedUp', this.isFormSuccess)
          this.$toast.success('Registration successful', { timeout: 1500 })

          // this.$store.commit('isUserLoggedIn', this.isFormSuccess)
        }
      } catch (error) {
        console.log(error)
        this.$toast.error('Registration failed', { timeout: 1500 })
      }

      // if (this.name && this.email && isValidPassword(this.password) && this.repeatPassword) {
      //   this.highlightEmailWithError = false
      //   this.highlightPasswordWithError = false
      //   // this.isFormSuccess = true
      //   // this.$store.commit('setUserName', this.name)
      //   // this.$store.commit('isUserSignedUp', this.isFormSuccess)
      //   // this.$store.commit('isUserLoggedIn', this.isFormSuccess)
      // }

      if (this.name && isValidName(this.name)) {
        this.highlightNameWithError = false
      } else {
        this.highlightNameWithError = true
      }

      if (!this.email) {
        this.highlightEmailWithError = true

        if (this.email && !isValidEmail(this.email)) {
          this.emailErrorLabel = this.emailNotValidLabel
        }
      } else {
        this.highlightEmailWithError = false
      }

      if (isValidPassword(this.password)) {
        this.highlightPasswordWithError = false
      } else {
        this.highlightPasswordWithError = true
      }

      if (!this.repeatPassword) {
        this.highlightRepeatPasswordWithError = true
      } else {
        this.highlightRepeatPasswordWithError = false
      }
    },
    checkNameOnKeyUp (nameValue) {
      if (nameValue && isValidName(nameValue)) {
        this.highlightNameWithError = false
      } else {
        this.highlightNameWithError = true
      }
    },
    checkEmailOnKeyUp (emailValue) {
      if (emailValue && isValidEmail(emailValue)) {
        this.highlightEmailWithError = false
      } else {
        this.highlightEmailWithError = true

        if (!isValidEmail(emailValue)) {
          this.emailErrorLabel = this.emailNotValidLabel
        }
      }
    },
    checkPasswordOnKeyUp (passwordValue) {
      if (passwordValue && isValidPassword(passwordValue)) {
        this.highlightPasswordWithError = false

        if (this.repeatPassword === this.password) {
          this.highlightRepeatPasswordWithError = false
        } else {
          this.highlightRepeatPasswordWithError = true
        }
      } else {
        this.highlightPasswordWithError = true
      }
    },
    checkRepeatPasswordOnKeyUp (repeatPasswordValue) {
      if (repeatPasswordValue) {
        if (repeatPasswordValue === this.password) {
          this.highlightRepeatPasswordWithError = false
        } else {
          this.highlightRepeatPasswordWithError = true
        }
      } else {
        this.highlightRepeatPasswordWithError = true
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.fa-exclamation-circle {
  color: red;
}
.fa-check {
  color: green;
}
</style>
