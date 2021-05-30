const mongoose=require('mongosse');

mongoose.connect(process.env.MONGODB_URL_DEV,{
    useNewUrlParser:true,
    useCreateIndex:true,
    useUnifiedTopology:true,
    useFindAndModify:false
})