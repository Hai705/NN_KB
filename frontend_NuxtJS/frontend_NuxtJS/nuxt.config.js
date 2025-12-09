export default {
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,

  // router: {
  //   middleware: 'auth'
  // },

  // [QUAN TRỌNG] Tắt cấu hình port cứng khi deploy lên Vercel.
  // Vercel sẽ tự động cấp port. Nếu chạy local bạn có thể bỏ comment.
  // server: {
  //   port: 8080
  // },

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'AndShop',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      {
        rel: 'stylesheet',
        href:
          'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons'
      },
      {
        rel: 'stylesheet',
        integrity:
          'sha384-AYmEC3Yw5cVb3ZcuHtOA93w35dYTsvhLPVnYs9eStHfGJvOvKxVfELGroGkvsg+p',
        crossorigin: 'anonymous',
        href: 'https://pro.fontawesome.com/releases/v5.10.0/css/all.css'
      },
      { rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    'ant-design-vue/dist/antd.css',
    '@/assets/main.scss'
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '@/plugins/antd-ui',
    '@/plugins/api',
    '@/plugins/toast',
    '@/plugins/table',
    // '@plugins/crisp'
    { src: '~plugins/crisp.js', mode: 'client' },
    { src: '~/plugins/chart.js', mode: 'client' }

  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
    '@nuxt/postcss8',
    '@nuxtjs/moment'
  ],
  // moment: {
  //   /* module options */
  //   locales: ['fa']
  // },
  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    '@nuxtjs/cloudinary'
  ],

  // [QUAN TRỌNG] Cấu hình kết nối Backend
  axios: {
    // Ưu tiên lấy biến môi trường API_HOST, nếu không có thì lấy link Render cứng
    baseURL: process.env.API_HOST || 'https://nn-kb-onrender-com.onrender.com'
  },

  cloudinary: {
    cloudName: process.env.CLOUDNAME,
    apiKey: process.env.API_KEY,
    apiSecret: process.env.API_SECRET,
    useComponent: true
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    postcss: {
      plugins: {
        tailwindcss: {},
        autoprefixer: {}
      }
    },
    loaders: {
      sass: {
        implementation: require('sass')
      },
      scss: {
        implementation: require('sass')
      }
    }
  },

  // [QUAN TRỌNG] Biến môi trường
  env: {
    // Cập nhật link Backend Render vào đây để đảm bảo mọi chỗ gọi process.env.API_HOST đều đúng
    BASE_URL: process.env.BASE_URL || 'https://nn-kb-onrender-com.onrender.com',
    API_HOST: process.env.API_HOST || 'https://nn-kb-onrender-com.onrender.com'
  }
}
