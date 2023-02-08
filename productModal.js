
const apiUrl = 'https://vue3-course-api.hexschool.io/v2';
const apiPath = 'qaz326978547';
export default {
    props: ['id', 'addToCart'],
    data() {
        return {
            tempProduct: {},
            modal: '',
            qty: 1,
        }
    },
    methods: {
        hide() {
            this.modal.hide()
        }
    },
    watch: {
        id() {
            console.log('watch監聽變動id' + this.id);

            axios.get(`${apiUrl}/api/${apiPath}/product/${this.id}`)
                .then((res) => {
                    this.tempProduct = res.data.product
                    // console.log(this.tempProduct);


                })

            this.modal.show()

        }
    },
    mounted() {
        // console.log(this.$refs.modal)
        this.modal = new bootstrap.Modal(this.$refs.modal)
        // this.myModal.show()
        console.log(this.qty);
    },
    template: `
    <div class="modal fade" id="productModal" tabindex="-1" role="dialog"
    aria-labelledby="exampleModalLabel" aria-hidden="true" ref="modal">
 <div class="modal-dialog modal-xl" role="document">
   <div class="modal-content border-0">
     <div class="modal-header bg-light text-white">
       <h5 class="modal-title" id="exampleModalLabel">
         <span class="text-dark">{{ tempProduct.title }}</span>
         
     </h5>
       <button type="button" class="btn-close"
               data-bs-dismiss="modal" aria-label="Close"></button>
     </div>
     <div class="modal-body">
       <div class="row">
         <div class="col-sm-6">
           <img class="img-fluid" :src="tempProduct.imageUrl" alt="">
     </div>
         <div class="col-sm-6">
           <span class="badge bg-primary rounded-pill">{{  }}</span>
           <p>商品描述：{{ tempProduct.description }}</p>
           <p>商品內容：{{ tempProduct.content }}</p>
           <div class="h5" v-if="tempProduct.price !== tempProduct.origin_price">{{ tempProduct.price }} 元</div>
           <div v-else>
                <del class="h6">原價 {{ tempProduct.origin_price }} 元</del>
                <div class="h5">現在只要 {{ tempProduct.price }} 元</div>
           </div>
           <div>
             <div class="input-group">
               <select name="" id="" class="form-select" v-model="qty">
                    <option :value="i" v-for="i in 5" :key="i">{{ i }}</option>
               </select>
               <button type="button" class="btn btn-primary" @click="addToCart(tempProduct.id,qty)">加入購物車</button>

               </div>
     
     </div>
     </div>
         <!-- col-sm-6 end -->
     </div>
     </div>
     </div>
     </div>
     </div>`
}