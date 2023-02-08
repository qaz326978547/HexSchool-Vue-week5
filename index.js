// import 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.47/vue.esm-browser.min.js'
import productModal from "./productModal.js";

const { createApp } = Vue

//定義驗證規則
VeeValidate.defineRule('email', VeeValidateRules['email']);
VeeValidate.defineRule('required', VeeValidateRules['required']);

const apiUrl = 'https://vue3-course-api.hexschool.io/v2';
const apiPath = 'qaz326978547';


// 讀取外部的資源
VeeValidateI18n.loadLocaleFromURL('./zh_TW.json');

// Activate the locale
VeeValidate.configure({
    generateMessage: VeeValidateI18n.localize('zh_TW'),
    validateOnInput: true, // 調整為：輸入文字時，就立即進行驗證
});

const app = Vue.createApp({
    data() {
        return {
            products: [],
            productId: '',
            cart: [],
            loadingItem: '',
            //驗證表單
            userData: {
                email: '',
                name: '',
                phone: '',
                adress: '',
                message: ''
            },
            //loading
            isLoading: false,
            fullPage: true
        };
    },
    components: {
        productModal,
        loading: VueLoading.Component,
    },
    methods: {
        getProducts() {
            this.isLoading = true
            axios.get(`${apiUrl}/api/${apiPath}/products/all`)
                .then((res) => {
                    this.products = res.data.products
                    this.isLoading = false
                })
                .catch((err) => {
                    alert(err.response.data.message);
                });
        },
        openModal(id) {
            // this.$ref.modal.myModal.show()
            this.productId = id

            console.log('openModal' + this.productId);

        },
        addToCart(product_id, qty = 1) {
            const data = {
                product_id,
                qty,
            }
            this.isLoading = true

            axios.post(`${apiUrl}/api/${apiPath}/cart`, { data })
                .then((res) => {
                    console.log('加入購物車' + res.data);
                    this.$refs.productModal.hide()
                    this.getCarts()
                    this.isLoading = false
                    swal({
                        title: "已新增購物車!",
                        text: '',
                        icon: 'success',
                        timer: 2000,
                        buttons: false,
                    });

                })
                .catch((err) => {
                    alert(err.response.data.message);
                });
        },
        getCarts() {
            axios.get(`${apiUrl}/api/${apiPath}/cart`)
                .then((res) => {
                    this.cart = res.data.data

                })
                .catch((err) => {
                    alert(err.response.data.message);
                });
        },
        updateCartItem(item) {
            const data = {
                "product_id": item.id,
                "qty": item.qty,
            }
            this.loadingItem = item.id
            axios.put(`${apiUrl}/api/${apiPath}/cart/${item.id}`, { data })
                .then((res) => {
                    this.getCarts()
                    this.loadingItem = ""
                })
                .catch((err) => {
                    alert(err.response.data.message);
                });
        },
        deleteCartItem(item) {
            this.loadingItem = item.id
            axios.delete(`${apiUrl}/api/${apiPath}/cart/${item.id}`)
                .then((res) => {
                    console.log(res.data);
                    this.getCarts()
                    this.loadingItem = ""
                    swal({
                        title: "已刪除商品!",
                        icon: 'success',
                        timer: 2000,
                        buttons: false,
                    });

                })
                .catch((err) => {
                    alert(err.response.data.message);
                });
        },
        deleteAllCart() {
            axios.delete(`${apiUrl}/api/${apiPath}/carts`)
                .then((res) => {
                    console.log(res.data);
                    this.getCarts()
                    swal({
                        title: "已清除購物車",
                        icon: 'success',
                        timer: 2000,
                        buttons: false,
                    });
                })
                .catch((err) => {
                    alert(err.response.data.message);
                });
        },
        ////驗證表單
        isPhone(value) {
            const phoneNumber = /^(09)[0-9]{8}$/
            return phoneNumber.test(value) ? true : '需要正確的電話號碼'
        },
        onSubmit() {
             if (this.cart.carts.length === 0) {
                console.log('請新增商品');

            } else {
                console.log(this.userData);
            }
        }
    },
    mounted() {
        this.getProducts()
        this.getCarts()
    },
})
//loading
// app.component('loading', VueLoading.Components)
// app.use(VueLoading.LoadingPlugin);

//註冊驗證元件
app.component('VForm', VeeValidate.Form);
app.component('VField', VeeValidate.Field);
app.component('ErrorMessage', VeeValidate.ErrorMessage);

app.mount('#app')
