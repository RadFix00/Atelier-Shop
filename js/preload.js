window.addEventListener("load", function() {
    setTimeout(function()  {
        const preloader = document.getElementById("preloader");
        preloader.style.display = "none";
    }, 100);
    
});

function updateClock() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const timeString = `${hours}:${minutes}:${seconds}`;
    
    document.getElementById("clock").textContent = timeString;
}

setInterval(updateClock, 1000);

function openCarrito() {
    document.getElementById('overlay').style.display = 'block';
    document.getElementById('popup').style.display = 'block';
}

function closeCarrito() {
    document.getElementById('overlay').style.display = 'none';
    document.getElementById('popup').style.display = 'none';
}

function openUser() {
    document.getElementById('overlay').style.display = 'block';
    document.getElementById('index').style.display = 'block';
}

function closeUser() {
    document.getElementById('overlay').style.display = 'none';
    document.getElementById('index').style.display = 'none';
}

const store = new Vuex.Store({
    state: {
        cart: JSON.parse(localStorage.getItem('cart')) || [],
        products: [ 
           { id: 0, marca: 'Biggie big Negro Manchado', price: 160000, talla:"L" ,imagen: '../img/pant1.png', categoria: 'pantalon' },
           { id: 1, marca: 'Biggie big Azul Manchado', price: 120000, talla:"S" ,imagen: '../img/pant2.png', categoria: 'pantalon' },
           { id: 2, marca: 'Biggie big Negro', price: 100000, talla:"M" ,imagen: '../img/pant3.png', categoria: 'pantalon' },
           { id: 3, marca: 'Biggie big Azul Celeste', price: 150000, talla:"l" ,imagen: '../img/pant4.png', categoria: 'pantalon' },
           { id: 4, marca: 'Buzo Cremallera Cafe', price: 200000, talla:"XL" ,imagen: '../img/buzo1.png', categoria: 'buzo' },
           { id: 5, marca: 'Buzo Hot Wheels', price: 220000, talla:"M" ,imagen: '../img/buzo2.png', categoria: 'buzo' },
           { id: 6, marca: 'Buzo Cremallera Gris Manchado', price: 185000, talla:"S" ,imagen: '../img/buzo3.png', categoria: 'buzo' },
           { id: 7, marca: 'Buzo Overzide Bushwick', price: 100000, talla: "XL", imagen: '../img/buzo4.png', categoria: 'buzo' },
           { id: 8, marca: 'Gorro Vans Cebra', price: 110000, talla:"Universal" ,imagen: '../img/gorro1.png', categoria: 'gorro' },
           { id: 9, marca: 'Gorro Spitfire Camuflado', price: 120000, talla:"Universal" ,imagen: '../img/gorro2.png', categoria: 'gorro' },
           { id: 10, marca: 'Gorro Skate Terror Verde', price: 100000, talla:"Universal" ,imagen: '../img/gorro3.png', categoria: 'gorro' },
           { id: 11, marca: 'Gorro Vans Cuadrado', price: 110000, talla:"Universal" ,imagen: '../img/gorro4.png', categoria: 'gorro' },
           { id: 12, marca: 'Gorro Hzn', price: 120000, talla:"Universal" ,imagen: '../img/gorro5.png', categoria: 'gorro' },
           { id: 13, marca: 'Pesquero Vans Cuadrado', price: 80000, talla: "Universal", imagen: '../img/gorro6.png', categoria: 'gorro' }, 
        ]
    },
    mutations: {
        addToCart(state, product) {
            const found = state.cart.find(item => item.id === product.id);
            if (found) {
                found.quantity++;
            } else {
                state.cart.push({ ...product, quantity: 1 });
            }
            localStorage.setItem('cart', JSON.stringify(state.cart));
        },
        removeFromCart(state, productId) {
            const found = state.cart.find(item => item.id === productId);
            if (found) {
                found.quantity--;
                if (found.quantity <= 0) {
                    state.cart = state.cart.filter(item => item.id !== productId);
                }
            }
            localStorage.setItem('cart', JSON.stringify(state.cart));
        },
        addFromCart(state, productId) {
            const found = state.cart.find(item => item.id === productId);
            if (found) {
                found.quantity++;
            }
            localStorage.setItem('cart', JSON.stringify(state.cart));
        }
    },
    getters: {
        cartTotal(state) {
            const total = state.cart.reduce((total, product) => total + product.price * product.quantity, 0);
            return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimunFractionDigits: 0 }).format(total);
        },
        cartItems(state) {
            return state.cart.map(product => ({
                ...product,
                formattedPrice: new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimunFractionDigits: 0 }).format(product.price)
            }));
        },
        productsList(state) {
            return state.products.map(product => ({
                ...product,
                formattedPrice: new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimunFractionDigits: 0 }).format(product.price)
            }));
        }
    }
});

new Vue({
    el: '#app',
    store,
    data: {
        busqueda: '',
        currentForm: 'login', 
        email: '',
        password: '',
        username: '',
        errorMessage:"",
        apiUrl:"http://127.0.0.1:5000/login"
    },
    computed: {
        cartItems() {
            return this.$store.getters.cartItems;
        },
        cartTotal() {
            return this.$store.getters.cartTotal;
        },
        productosFiltrados() {
            return this.$store.getters.productsList.filter(producto =>
                producto.marca.toLowerCase().includes(this.busqueda.toLowerCase())
            );
        }
    },
    methods: {
        addToCart(product) {
            this.$store.commit('addToCart', product);
        },
        removeFromCart(productId) {
            this.$store.commit('removeFromCart', productId);
        },
        addFromCart(productId) {
            this.$store.commit('addFromCart', productId);
        },
        pagar() {
            alert("Proceso de pago");
        },
        async login() {
            if (this.username.trim() === "" || this.password.trim() === "") {
                this.errorMessage = "No se ha podido iniciar sesion faltan datos"   
                return;
            }
            else {
                try {
                    const response = await axios.post(this.apiUrl, {
                        username: this.username,
                        password: this.password
                    });

                    if (response.data.message === 'Login Exitoso') {
                        window.location.href = './index.html'
                    } else {
                        this.errorMessage = "No se ha podido Iniciar Sesion. Verifique sus credenciales"
                    }
                } catch (error) {
                    this.errorMessage = "Usuario o Contraseña Incorrectos"
                    console.error(error);
                }
            }
        }
    }
});

new Vue({
        el: '#catalogo',
        store,  // Enlazamos el store de Vuex
        computed: {
            categories() {
                return this.$store.getters.categories;
            },
            getProductsByCategory() {
                return this.$store.getters.productsByCategory;
            },
            formatPrice() {
                return this.$store.getters.formatPrice;
            }
        }
    });
        
const images = [
    '../img/5.jpg',
    '../img/1.jpg',
    '../img/2.jpg',
    '../img/3.jpg',
    '../img/4.jpg',
    '../img/6.jpg',
    '../img/7.jpg',
    '../img/8.jpg',
    '../img/9.jpg',
    '../img/10.jpg',
    '../img/11.jpg',
    '../img/19.jpg',
    '../img/13.jpg',
    '../img/14.jpg',
    '../img/15.jpg',
    '../img/16.jpg',
    '../img/17.jpg',
    '../img/18.jpg',
    '../img/12.jpg',
    '../img/20.jpg'
];

const imagelibreria = document.getElementById('libreria');
let availableImages = [...images]; // Copia inicial de las imágenes disponibles

// Función para cargar imágenes aleatorias sin repetir
function cargarRamdom() {
    for (let i = 0; i < 4; i++) {
        if (availableImages.length === 0) {
            console.log('No quedan más imágenes disponibles.');
            return; // Salir si no hay más imágenes
        }

        const randomIndex = Math.floor(Math.random() * availableImages.length);
        const selectedImage = availableImages.splice(randomIndex, 1)[0]; // Eliminar la imagen seleccionada

        const img = document.createElement('img');
        img.src = selectedImage;
        imagelibreria.appendChild(img);
    }
}

// Evento de scroll para cargar más imágenes
window.addEventListener('scroll', () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 200) {
        cargarRamdom();
    }
});

// Cargar imágenes iniciales
cargarRamdom();
