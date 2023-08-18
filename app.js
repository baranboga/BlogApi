
const config = require("config");
const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");


const products = require("./routes/products");
const categories = require("./routes/categories");
const users = require("./routes/users");
const home = require("./routes/home");


app.use(express.json());

app.use(cors({
    origin: "*",
    methods: ["*"]
}));

app.use("/api/products" ,products);
app.use("/api/categories" ,categories);
app.use("/api/users" ,users);
app.use("/", home);

const username = config.get("db.username");
const password = config.get("db.password");
const database = config.get("db.name");

(async () => {
    try {
        await mongoose.connect(`mongodb+srv://${username}:${password}@cluster0.h2jjpwa.mongodb.net/${database}?retryWrites=true&w=majority`);
        console.log("mongodb bağlantısı kuruldu.");
    }
    catch(err) {
        console.log(err);
    }
})();

if(process.env.NODE_ENV == "production") {
    require("./startup/production")(app);
}


const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`listening on port ${port}`);
});




//AUTHENTİCATİON

//User modelini oluştururuz.  //register ve login in validation larını ayrı ayrı yaparız.
//User ROUTE oluştururuz.


//KULLANICI KAYDETME

// router.post("/create", async (req, res) => {
//     const { error } = validateRegister(req.body);                      //alınan user bilgisini validate ederiz.

//     if(error) {
//         return res.status(400).send(error.details[0].message);        //Hata varsa mesaj döner
//     }

//     let user = await User.findOne({ email: req.body.email });        //Aynı mail adresi varsa hata gönderir.

//     if(user) {
//         return res.status(400).send("bu mail adresiyle zaten bir kullanıcı mevcut.");
//     }

//     const hashedPassword = await bcrypt.hash(req.body.password, 10);          //İlk olarak "bcrypt" kullanarak kullanıcının şifresini gizleriz.

//     user = new User({                                                         //Kullancının bilgilerini kaydederiz.
//         name: req.body.name,
//         email: req.body.email,
//         password: hashedPassword
//     });

//     await user.save();                                                     //Bilgileri kaydederiz.

//    
// });



//KULLANICININ AUTH OLMASI  //TOKEN

// router.post("/auth", async (req, res) => {
//     const { error } = validateLogin(req.body);                            //Validate ederiz

//     if(error) {
//         return res.status(400).send(error.details[0].message);          
//     }

//     let user = await User.findOne({ email: req.body.email });           //kullancıyı email e göre sorgularız.
//     if(!user) {
//         return res.status(400).send("hatalı email ya da parola");
//     }

//     const isSuccess = await bcrypt.compare(req.body.password, user.password);   //şifreyi sorgularız
//     if(!isSuccess) {
//         return res.status(400).send("hatalı email ya da parola");
//     }

//     const token = user.createAuthToken();

//     res.send(token);
// });



//TOKEN İŞLEMİ İÇİN PAKET KULLANIRIZ.
//npm i jsonwebtoken

//--Token içerisine bilgi koyup taşıyabiliriz.


//--İlk olarak model içerisinde model oluşturmadan önce bir token oluşturma metodu tanımlarız.
//--Bu metod bize token oluşturur.

// userSchema.methods.createAuthToken = function() {
//     const decodedToken = jwt.sign({ _id: this._id }, 'jwtPrivateKey');              //kullanıcının id si de token bilgisinin içerisine gizlenmiş
//     return decodedToken;
// };



//-İkinci olarak token oluşturduğumuz yerde bu metodu çağırırız .
//Örneğin kullanıcı oluşturulurken,

// router.post("/create", async (req, res) => {
//     const { error } = validateRegister(req.body);

//     if(error) {
//         return res.status(400).send(error.details[0].message);
//     }

//     let user = await User.findOne({ email: req.body.email });
//     if(user) {
//         return res.status(400).send("bu mail adresiyle zaten bir kullanıcı mevcut.");
//     }

//     const hashedPassword = await bcrypt.hash(req.body.password, 10);
//     user = new User({
//         name: req.body.name,
//         email: req.body.email,
//         password: hashedPassword
//     });

//     await user.save();
//     const token = user.createAuthToken();                         //Metodu çağırıp tokenimizi alırız.
//     res.header("x-auth-token", token).send(user);                 //kayıt olan kullancıya header içerisinde token bilgisini göndeririz.
// });


//Kullanıcı login olduğu zaman da direk olarak body içerisinde token bilgisini göndeririz.




//TOKEN KONTROLÜNÜN YAPILMASI
//Kullanıcının token i yok ise bazı yerlere erişimini sınırlayabiliriz.

//token kontrol işlemini middware de yapmamız gerekmekte. Bunun için bir middware dosyası
//açarız ve validasyon işlemlerimizi orada yaparız.  auth.js

// const jwt = require("jsonwebtoken");

// module.exports = function (req, res, next) {                 //next i unutma
//     const token = req.header("x-auth-token");                //token i kontrol et
//     if(!token) {
//         return res.status(401).send("yetkiniz yok.");       //token yok ise uyarı versin
//     }

//     try {
//         const decodedToken = jwt.verify(token, "jwtPrivateKey");  //token varsa token i kontrol et
//         req.user = decodedToken;                                 //Buradan bize çözülmüş token gelir. İçinde payload vardır.
                                                                    //Token içerindeki bilgileri daha sonra kullanabiliriz diye user objesi içine atık
//         next();                                                  //işlemi devam ettirmemiz gerek
//     }
//     catch(ex) {
//         res.status(400).send("hatalı token");
//     }
// }


//auth işlemi yapacağımız yerlerde metotta bunu belirttik.

// router.put("/:id", auth, async (req, res) => {             //burada auth u belirttik
//     const product = await Product.findById(req.params.id);
//     if(!product) {
//         return res.status(404).send("aradığınız ürün bulunamadı.");
//     }

//     const { error } = validateProduct(req.body);

//     if(error) {
//         return res.status(400).send(error.details[0].message);
//     }





//ROLLER GÖRE AUTH İŞLEMİ



//UYGULAMA YAYINLAMA

//Uygulamayı hangi aşamada kullanıyorsak ona göre uygulamayı başlatabiliriz.,,

//  "dev": "NODE_ENV=development PORT=3000 DB_PASSWORD=135790 JWTPRIVATEKEY=mysecretkey nodemon app.js",    //uygulama geliştirme modunda mı
//   "prod": "NODE_ENV=production PORT=8080 nodemon app.js",                                                //Uygulama yayın modunda mı


//UYGULAMA PUBLİSH HAZIRLIKLARI
//Config paketini indiririz.

//Uygulamayı çalıştırıken congfig bilgilerini düzenlememiz gerek. Bunun için bir config dosyası açarız. ve değerler tanımalarız
//Bu bilgileri uygulamada bu bilgileri kullandığımız yerlerde de değiştirmeliyiz.

//

//Default = her durumda uygulamanın özelliklerini belirttiğimiz yer. Örneğin uygulamamın ismi
//Development   = uygulamın develop modunda kullancağı özellikler,  veri tabanı ismi ve kullanıcı ismi
//Development   = uygulamın publish modunda kullancağı özellikler,  veri tabanı ismi ve kullanıcı ismi


//Costom enviroment de kullancağımız ortam değişkenlerinin isimlerini yazarız. Doğru bir şekilde yazmamız gerekmekte.

// {
//     "db": {
//         "password": "DB_PASSWORD"                 //Kullanıcı ismi  //burada DB PASSAWOD daha sonra bizim yayınlarken belirleyeceğimiz bir şey. Şimdilik isim koyduk yayınlarken karşısına gerçek değeri yazacağız.
//     },
//     "auth": {
//         "jwtPrivateKey": "JWTPRIVATEKEY"         //Token keyi
//     }
// }


//Buradaki bilgileri uygulamayı kullandığımız yerlere de yazmamız gerekmekte. Örneğin auth=>

// module.exports = function (req, res, next) {
//     const token = req.header("x-auth-token");
//     if(!token) {
//         return res.status(401).send("yetkiniz yok.");
//     }

//     try {
//         const decodedToken = jwt.verify(token, config.get("jwtPrivateKey"));     //burada config den alacağımızı belirttik.
//         req.user = decodedToken;
//         next();
//     }
//     catch(ex) {
//         res.status(400).send("hatalı token");
//     }
// }


//KOD DÜZENLEMELERİ


//Startup projesi oluşturduk .Proje çalıştığı anda çalışmasını istediğimiz kodları buraya yazarız.
//Bİr fonksyon



//ORTAM DEĞİŞKENLERİ

//app.js de port numarasını ortam değişkenlerine göre ayarladıktan sonra, scripte "dev" ve "pord" scriptleri ekleriz.

// const port = process.env.PORT || 3000;

// app.listen(port, () => {
//     console.log(`listening on port ${port}`);
// });


//------- package.json

// "dev": "set NODE_ENV=development&& set PORT=3000&& set DB_PASSWORD=19421945&& set JWTPRIVATEKEY=mysecretkey&& nodemon app.js",
// "prod": "set NODE_ENV=production&& set PORT=8080&& nodemon app.js",



//---------CONFİG dosyası

//Burada hangi modda, hangi bilgileri kullanacaksak ona göre kullanırlır. Meseka env modunda hangi bilgiler kullanılsın. veya prod modunda hangi bilgiler kullanılsın

